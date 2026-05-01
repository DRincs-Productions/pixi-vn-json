#!/usr/bin/env node
/**
 * Generates a JSON Schema from the PixiVNJson TypeScript interface.
 * Schema is saved to schemas/<version>/schema.json
 *
 * Uses TypeScript's compiler API for AST traversal to avoid stack overflow
 * issues that occur with recursive generic types when using typescript-json-schema directly.
 */

import { createRequire } from "module";
import { readFileSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { resolve, join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
const version = pkg.version;

// ─── TypeScript Program Setup ─────────────────────────────────────────────────

const tsconfigPath = join(rootDir, "tsconfig.schema.json");
const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
const { fileNames, options } = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    rootDir,
);

options.noEmit = true;
delete options.outDir;
delete options.declaration;
delete options.declarationDir;
delete options.declarationMap;

const program = ts.createProgram({ rootNames: fileNames, options });
const checker = program.getTypeChecker();

const interfaceDir = join(rootDir, "src", "interface");

// ─── Collect Type Declarations ────────────────────────────────────────────────

/**
 * Map of type/interface name → AST declaration node
 * Only includes types from src/interface/
 */
const typeDecls = new Map();
/** Map of type/interface name → list of type parameter names */
const typeParams = new Map();

for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(interfaceDir)) continue;
    collectDeclarations(sourceFile);
}

function collectDeclarations(sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
            const name = node.name.text;
            typeDecls.set(name, node);
            if (node.typeParameters && node.typeParameters.length > 0) {
                typeParams.set(
                    name,
                    node.typeParameters.map((tp) => tp.name.text),
                );
            }
        }
    });
}

// ─── JSON Schema Generation ────────────────────────────────────────────────────

/** All definitions collected during traversal */
const definitions = {};
/** Set of definition keys currently being processed (cycle detection) */
const processing = new Set();
/**
 * Maximum key depth to prevent infinite expansion of recursive generics like
 * PixiVNJsonConditionalStatements<T> → PixiVNJsonConditionalStatements<T[]> → T[][] → ...
 */
const MAX_ARG_NESTING = 3;

/**
 * Measure "nesting depth" of an argKey: count how many times "Arr" appears.
 * Used to limit infinite expansion of T → TArr → TArrArr → ...
 */
function argKeyDepth(key) {
    return (key.match(/Arr/g) || []).length;
}

/**
 * Convert a TypeScript type node (AST) to a JSON Schema fragment.
 * @param {ts.TypeNode} node - the TypeScript type AST node
 * @param {Map<string, object>} ctx - type parameter substitution context
 * @returns {object} JSON Schema fragment
 */
function convertTypeNode(node, ctx) {
    if (!node) return {};

    switch (node.kind) {
        case ts.SyntaxKind.StringKeyword:
            return { type: "string" };
        case ts.SyntaxKind.NumberKeyword:
            return { type: "number" };
        case ts.SyntaxKind.BooleanKeyword:
            return { type: "boolean" };
        case ts.SyntaxKind.NullKeyword:
            return { type: "null" };
        case ts.SyntaxKind.UndefinedKeyword:
            return {};
        case ts.SyntaxKind.AnyKeyword:
        case ts.SyntaxKind.UnknownKeyword:
        case ts.SyntaxKind.ObjectKeyword:
            return {};
        case ts.SyntaxKind.NeverKeyword:
            return { not: {} };
        case ts.SyntaxKind.VoidKeyword:
            return {};

        case ts.SyntaxKind.LiteralType: {
            const lit = node.literal;
            if (ts.isStringLiteral(lit)) return { const: lit.text };
            if (ts.isNumericLiteral(lit)) return { const: Number(lit.text) };
            if (lit.kind === ts.SyntaxKind.TrueKeyword) return { const: true };
            if (lit.kind === ts.SyntaxKind.FalseKeyword) return { const: false };
            if (lit.kind === ts.SyntaxKind.NullKeyword) return { type: "null" };
            return {};
        }

        case ts.SyntaxKind.ArrayType: {
            const items = convertTypeNode(node.elementType, ctx);
            return { type: "array", items };
        }

        case ts.SyntaxKind.TupleType: {
            const elements = node.elements.map((el) => convertTypeNode(el, ctx));
            return { type: "array", items: elements };
        }

        case ts.SyntaxKind.UnionType: {
            const types = node.types.map((t) => convertTypeNode(t, ctx));
            return mergeUnion(types);
        }

        case ts.SyntaxKind.IntersectionType: {
            const types = node.types.map((t) => convertTypeNode(t, ctx));
            return { allOf: types };
        }

        case ts.SyntaxKind.ParenthesizedType: {
            return convertTypeNode(node.type, ctx);
        }

        case ts.SyntaxKind.TypeLiteral: {
            return convertTypeLiteral(node, ctx);
        }

        case ts.SyntaxKind.MappedType: {
            // Mapped types as additionalProperties schemas
            const valueSchema = node.type ? convertTypeNode(node.type, ctx) : {};
            return {
                type: "object",
                additionalProperties: valueSchema,
            };
        }

        case ts.SyntaxKind.TypeReference: {
            return convertTypeReference(node, ctx);
        }

        case ts.SyntaxKind.ConditionalType: {
            // Conditional types are complex; simplify to {}
            return {};
        }

        case ts.SyntaxKind.IndexedAccessType: {
            return {};
        }

        case ts.SyntaxKind.TemplateLiteralType: {
            return { type: "string" };
        }

        case ts.SyntaxKind.RestType:
        case ts.SyntaxKind.OptionalType: {
            return convertTypeNode(node.type, ctx);
        }

        case ts.SyntaxKind.InferType: {
            return {};
        }

        case ts.SyntaxKind.TypeQuery: {
            return {};
        }

        case ts.SyntaxKind.NamedTupleMember: {
            // Named tuple member
            return convertTypeNode(node.type, ctx);
        }

        default:
            return {};
    }
}

/**
 * Convert a TypeLiteral AST node to a JSON Schema object.
 */
function convertTypeLiteral(node, ctx) {
    const properties = {};
    const required = [];
    let additionalProperties = undefined;

    for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
            const name = getMemberName(member);
            if (!name) continue;
            const schema = convertTypeNode(member.type, ctx);
            properties[name] = getJsDocAnnotations(member, schema);
            if (!member.questionToken) {
                required.push(name);
            }
        } else if (ts.isMethodSignature(member)) {
            // Skip methods
        } else if (ts.isIndexSignatureDeclaration(member)) {
            // Index signature: [key: string]: T or [key: number]: T
            const valueType = convertTypeNode(member.type, ctx);
            additionalProperties = valueType;
        } else if (ts.isConstructSignatureDeclaration(member)) {
            // Skip
        } else if (ts.isCallSignatureDeclaration(member)) {
            // Skip
        }
    }

    const schema = { type: "object" };

    if (Object.keys(properties).length > 0) {
        schema.properties = properties;
    }
    if (required.length > 0) {
        schema.required = required;
    }
    if (additionalProperties !== undefined) {
        schema.additionalProperties = additionalProperties;
    }

    return schema;
}

/**
 * Get a member name as a string.
 */
function getMemberName(member) {
    if (!member.name) return null;
    if (ts.isIdentifier(member.name)) return member.name.text;
    if (ts.isStringLiteral(member.name)) return member.name.text;
    if (ts.isNumericLiteral(member.name)) return member.name.text;
    if (ts.isComputedPropertyName(member.name)) return null; // skip computed
    return null;
}

/**
 * Convert a TypeReference AST node to a JSON Schema fragment.
 * This handles both plain type references and generic type applications.
 */
function convertTypeReference(node, ctx) {
    const name = getTypeName(node.typeName);

    // Check if this is a type parameter substitution
    if (ctx.has(name)) {
        const schema = ctx.get(name);
        // Strip __key before returning to avoid leaking it into the output
        if (schema && schema.__key !== undefined) {
            const { __key, ...rest } = schema;
            return rest;
        }
        return schema;
    }

    // Handle built-in types
    const builtinSchema = getBuiltinTypeSchema(name);
    if (builtinSchema !== null) return builtinSchema;

    // Check if this is a known type from our interface files
    if (typeDecls.has(name)) {
        const decl = typeDecls.get(name);
        const params = typeParams.get(name);

        if (params && params.length > 0 && node.typeArguments && node.typeArguments.length > 0) {
            // Generic type application
            return handleGenericApplication(name, decl, params, node.typeArguments, ctx);
        }

        // Non-generic named type → $ref to definition
        ensureDefinition(name, decl, new Map());
        return { $ref: `#/definitions/${name}` };
    }

    // External type (from @drincs/pixi-vn, pixi.js, etc.) → accept any value
    return {};
}

/**
 * Handle a generic type application like PixiVNJsonConditionalStatements<SomeType>.
 * Creates a definition for the instantiation and returns a $ref.
 */
function handleGenericApplication(baseName, decl, paramNames, typeArgNodes, outerCtx) {
    // Build keys for type arguments first (so we can name the instantiation)
    const argKeys = typeArgNodes.map((arg, i) => getTypeNodeKey(arg, outerCtx) || `T${i}`);

    // Guard against infinite key explosion from recursive generics like
    // PixiVNJsonConditionalStatements<T> → contains PixiVNJsonConditionalStatements<T[]>
    // → T[] → T[][] → ... which creates ever-growing keys.
    // When a key has too many array nestings, we use the base (un-arrayed) definition instead.
    const safArgKeys = argKeys.map((k) => {
        if (argKeyDepth(k) >= MAX_ARG_NESTING) {
            // Strip array suffixes beyond the limit by using the plain arg key
            return k.replace(/(Arr)+$/, "");
        }
        return k;
    });

    const defKey = `${baseName}_${safArgKeys.join("_")}`.replace(/[^A-Za-z0-9_]/g, "_");

    // If already defined, return ref
    if (definitions[defKey] !== undefined) {
        return { $ref: `#/definitions/${defKey}` };
    }

    // Cycle detection: if currently processing this key, return ref (will be filled in later)
    if (processing.has(defKey)) {
        return { $ref: `#/definitions/${defKey}` };
    }

    // Convert type arguments to schemas (for context substitution)
    const argSchemas = typeArgNodes.map((arg) => convertTypeNode(arg, outerCtx));

    // Build type parameter context for the generic body.
    // Attach __key to each schema so nested generics can derive proper names.
    const newCtx = new Map(outerCtx);
    for (let i = 0; i < paramNames.length; i++) {
        const argSchema = argSchemas[i] || {};
        newCtx.set(paramNames[i], { ...argSchema, __key: safArgKeys[i] });
    }

    // Add placeholder to avoid infinite recursion
    processing.add(defKey);
    definitions[defKey] = {}; // placeholder

    // Generate the actual definition and strip the internal __key markers
    const raw = convertDeclaration(decl, newCtx);
    const schema = removePrivateKeys(raw);
    Object.assign(definitions[defKey], schema);
    processing.delete(defKey);

    return { $ref: `#/definitions/${defKey}` };
}

/**
 * Remove __key properties that are used internally for naming but must not appear in output.
 */
function removePrivateKeys(obj) {
    return JSON.parse(JSON.stringify(obj, (key, val) => (key === "__key" ? undefined : val)));
}

/**
 * Get a simplified string key for a type argument node (for naming instantiations).
 * Uses the context to substitute type parameters with their resolved names.
 */
function getTypeNodeKey(node, ctx) {
    if (!node) return "T";

    switch (node.kind) {
        case ts.SyntaxKind.StringKeyword:
            return "string";
        case ts.SyntaxKind.NumberKeyword:
            return "number";
        case ts.SyntaxKind.BooleanKeyword:
            return "boolean";
        case ts.SyntaxKind.NullKeyword:
            return "null";
        case ts.SyntaxKind.AnyKeyword:
        case ts.SyntaxKind.UnknownKeyword:
            return "any";
        case ts.SyntaxKind.ArrayType: {
            const inner = getTypeNodeKey(node.elementType, ctx);
            return `${inner}Arr`;
        }
        case ts.SyntaxKind.TypeReference: {
            const name = getTypeName(node.typeName);
            // If this is a type parameter in our context, use the context key
            if (ctx.has(name)) {
                // Use the context's resolved key (stored alongside schema)
                const resolved = ctx.get(name);
                if (resolved && resolved.__key) return resolved.__key;
                return name;
            }
            if (node.typeArguments && node.typeArguments.length > 0) {
                const args = node.typeArguments.map((a) => getTypeNodeKey(a, ctx)).join("_");
                return `${name}_${args}`;
            }
            return name;
        }
        case ts.SyntaxKind.UnionType: {
            const parts = node.types.slice(0, 3).map((t) => getTypeNodeKey(t, ctx));
            return parts.join("_or_");
        }
        case ts.SyntaxKind.ParenthesizedType:
            return getTypeNodeKey(node.type, ctx);
        case ts.SyntaxKind.LiteralType: {
            const lit = node.literal;
            if (ts.isStringLiteral(lit)) return `lit_${lit.text}`;
            if (ts.isNumericLiteral(lit)) return `lit_${lit.text}`;
            return "lit";
        }
        default:
            return "T";
    }
}

/**
 * Ensure a named type has a definition entry. If not yet processed, process it now.
 */
function ensureDefinition(name, decl, ctx) {
    if (definitions[name] !== undefined) return;
    if (processing.has(name)) return; // cycle: will be filled in by the outer call

    processing.add(name);
    definitions[name] = {}; // placeholder
    const schema = convertDeclaration(decl, ctx);
    Object.assign(definitions[name], schema);
    processing.delete(name);
}

/**
 * Convert a type or interface declaration to a JSON Schema fragment.
 */
function convertDeclaration(decl, ctx) {
    if (ts.isInterfaceDeclaration(decl)) {
        return convertInterface(decl, ctx);
    }
    if (ts.isTypeAliasDeclaration(decl)) {
        const baseSchema = convertTypeNode(decl.type, ctx);
        return getJsDocAnnotations(decl, baseSchema);
    }
    return {};
}

/**
 * Convert an interface declaration to a JSON Schema object.
 */
function convertInterface(decl, ctx) {
    const properties = {};
    const required = [];
    let additionalProperties = undefined;

    // Handle heritage clauses (extends)
    const allOf = [];
    if (decl.heritageClauses) {
        for (const clause of decl.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                for (const type of clause.types) {
                    const parentSchema = convertTypeReference(type, ctx);
                    if (parentSchema && Object.keys(parentSchema).length > 0) {
                        allOf.push(parentSchema);
                    }
                }
            }
        }
    }

    for (const member of decl.members) {
        if (ts.isPropertySignature(member)) {
            const name = getMemberName(member);
            if (!name) continue;
            const schema = convertTypeNode(member.type, ctx);
            properties[name] = getJsDocAnnotations(member, schema);
            if (!member.questionToken) {
                required.push(name);
            }
        } else if (ts.isIndexSignatureDeclaration(member)) {
            const valueType = convertTypeNode(member.type, ctx);
            additionalProperties = valueType;
        }
    }

    const schema = { type: "object" };
    if (Object.keys(properties).length > 0) {
        schema.properties = properties;
    }
    if (required.length > 0) {
        schema.required = required;
    }
    if (additionalProperties !== undefined) {
        schema.additionalProperties = additionalProperties;
    }

    if (allOf.length > 0) {
        return { allOf: [...allOf, schema] };
    }

    return schema;
}

/**
 * Get a fully qualified type name from a TypeScript EntityName AST node.
 */
function getTypeName(entityName) {
    if (ts.isIdentifier(entityName)) return entityName.text;
    if (ts.isQualifiedName(entityName)) {
        return `${getTypeName(entityName.left)}.${entityName.right.text}`;
    }
    return "";
}

/**
 * Get JSON Schema for built-in/standard TypeScript types.
 * Returns null if the type is not a built-in.
 */
function getBuiltinTypeSchema(name) {
    switch (name) {
        case "string":
            return { type: "string" };
        case "number":
            return { type: "number" };
        case "boolean":
            return { type: "boolean" };
        case "null":
            return { type: "null" };
        case "undefined":
        case "void":
            return {};
        case "any":
        case "unknown":
        case "object":
        case "Object":
            return {};
        case "never":
            return { not: {} };
        case "Array":
        case "ReadonlyArray":
            return { type: "array" };
        case "Record":
            return { type: "object" };
        case "Partial":
        case "Required":
        case "Readonly":
        case "NonNullable":
        case "Extract":
        case "Exclude":
        case "ReturnType":
        case "Parameters":
        case "InstanceType":
        case "Awaited":
            return null; // These should be resolved via typeArguments
        case "Pick":
        case "Omit":
            return {}; // Simplified - treat as any object
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
            return {};
        case "Promise":
            return {};
        case "Date":
            return { type: "string", format: "date-time" };
        case "RegExp":
            return { type: "string", format: "regex" };
        case "Function":
            return {};
        default:
            return null;
    }
}

/**
 * Merge an array of JSON Schema fragments for a union type.
 * Simplifies cases where all elements have the same type, etc.
 */
function mergeUnion(schemas) {
    // Filter out empty schemas (undefined types)
    const nonEmpty = schemas.filter((s) => Object.keys(s).length > 0);

    if (nonEmpty.length === 0) return {};
    if (nonEmpty.length === 1) return nonEmpty[0];

    // Check if all are simple type strings
    const allTypes = nonEmpty.every((s) => s.type && Object.keys(s).length === 1);
    if (allTypes) {
        const types = [...new Set(nonEmpty.map((s) => s.type))];
        if (types.length === 1) return { type: types[0] };
        return { type: types };
    }

    // Check if any includes undefined/empty → mark all as optional
    const hasUndefined = schemas.some((s) => Object.keys(s).length === 0);

    // Check if all are consts (enum-like)
    const allConsts = nonEmpty.every((s) => s.const !== undefined);
    if (allConsts) {
        return { enum: nonEmpty.map((s) => s.const) };
    }

    return { anyOf: nonEmpty };
}

/**
 * Extract JSDoc description and add to schema.
 */
function getJsDocAnnotations(node, baseSchema) {
    const comments = ts.getJSDocCommentsAndTags(node);
    let description = "";

    for (const comment of comments) {
        if (ts.isJSDoc(comment) && comment.comment) {
            const text =
                typeof comment.comment === "string"
                    ? comment.comment
                    : comment.comment.map((c) => c.text).join("");
            description += text.trim();
        }
    }

    if (description) {
        return { description, ...baseSchema };
    }
    return baseSchema;
}

// ─── Generate the Root Schema ─────────────────────────────────────────────────

const rootDecl = typeDecls.get("PixiVNJson");
if (!rootDecl) {
    console.error("Error: PixiVNJson type not found in interface files");
    process.exit(1);
}

// Generate root schema
const rootSchema = convertDeclaration(rootDecl, new Map());

// Add all referenced definitions by processing the entire type declaration set
// This ensures all types referenced from PixiVNJson are included
for (const [name, decl] of typeDecls) {
    if (!definitions[name]) {
        ensureDefinition(name, decl, new Map());
    }
}

// Build the final schema
const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    ...rootSchema,
    definitions,
};

// ─── Output ───────────────────────────────────────────────────────────────────

const outDir = join(rootDir, "schemas", version);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "schema.json");
writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");

console.log(`Schema generated: ${outPath}`);
console.log(`Definitions: ${Object.keys(definitions).length}`);
