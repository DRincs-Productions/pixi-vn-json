#!/usr/bin/env node
/**
 * Generic TypeScript-interface → JSON-Schema generator, built on the TypeScript compiler API
 * (AST traversal for "local" declarations, the type checker for everything else). Extracted from
 * `generate-schema.mjs` (which used it, hardcoded, to generate `PixiVNJson`'s own schema) so it
 * can also be pointed at arbitrary interfaces from *other* packages — e.g. `@drincs/pixi-vn`'s
 * canvas transition prop types, consumed by `@drincs/pixi-vn-ink`.
 *
 * Two kinds of type get treated differently:
 * - "Local" declarations — interfaces/type aliases found in a file under `interfaceDir` (when
 *   provided) — are walked directly from their AST (via `typeDecls`), fully, with no depth limit.
 *   This is how `PixiVNJson`'s own schema (all declared in this package's `src/schema`) has always
 *   been generated: every cross-reference between its own types resolves exactly, however deep.
 * - Everything else ("external" types — from `@drincs/pixi-vn`, `pixi.js`, `motion`, or simply any
 *   type outside `interfaceDir`) is resolved via the type checker's fully-resolved `ts.Type`
 *   (so inherited members from `extends`/intersections are already flattened) and capped at
 *   {@link GenerateJsonSchemaOptions.maxDepth} nested object levels — see its docs for exactly
 *   what "depth" counts.
 *
 * A name in `rootTypeNames` can be either kind: a local type (e.g. `"PixiVNJson"`) is expanded
 * with no cap, while a name that's only found by scanning `rootFiles`' own top-level declarations
 * (not in `interfaceDir`) is generated via the capped "external" path from the start — this is how
 * a shallow, `maxDepth: 1` schema for e.g. `MoveInOutProps` is produced.
 */

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

/**
 * @typedef {object} GenerateJsonSchemaOptions
 * @property {string[]} rootFiles Absolute paths of files that must be part of the TS program —
 *   both the source of any name in `rootTypeNames` not found under `interfaceDir`, and (when
 *   `interfaceDir` is omitted) the only files scanned for "local" declarations.
 * @property {string} [tsconfigPath] Path to a tsconfig.json to read `compilerOptions` (and
 *   additional root files) from. When omitted, a minimal default (ES2022/ESNext/bundler
 *   resolution, `skipLibCheck: true`) is used — sufficient for reading plain `.d.ts` files.
 * @property {object} [compilerOptions] Extra compiler options, merged over (and taking priority
 *   over) whatever `tsconfigPath` provided.
 * @property {string} [interfaceDir] Absolute directory prefix. Declarations from source files
 *   under this directory are treated as "local" (see file doc above). Omit to treat every type as
 *   "external" (capped at `maxDepth`).
 * @property {string[]} rootTypeNames Interface/type-alias names to generate a top-level schema
 *   for, one entry each in the returned `schemas` map.
 * @property {number} [maxDepth=1] How many nested *object*-typed property levels get expanded for
 *   "external" types before collapsing to an opaque `{ type: "object" }`. The root type's own
 *   properties are always level 1 (so `maxDepth: 1`, the default, types every direct property —
 *   primitives, arrays, unions — correctly, but any property that is itself an object collapses
 *   without listing its members). `maxDepth: 2` expands one further level, and so on. Local types
 *   (see `interfaceDir`) are never subject to this cap.
 * @property {boolean} [includeAllLocalDeclarations=false] When `true`, every declaration found
 *   under `interfaceDir` gets a `definitions` entry (even ones never referenced from
 *   `rootTypeNames`) — used by `generate-schema.mjs` so the published `PixiVNJson` schema bundle
 *   includes every local type, not just the ones reachable from the `PixiVNJson` root.
 * @property {Record<string, object>} [typeNameOverrides] Schema to use verbatim whenever a
 *   `TypeReference` AST node by this exact name is encountered while walking a "local" declaration
 *   (see `interfaceDir`) — checked before both `typeDecls` and the external-type resolution
 *   fallback, so it works for a name that's ambiguous or expensive to resolve structurally (e.g.
 *   collapsing a large external union to a simple `{ type: [...] }`). Only applies on that
 *   AST-node path: a property discovered while enumerating an external object's own members via
 *   the type checker (i.e. anything nested inside a name in `rootTypeNames` that itself resolved
 *   as "external") is not affected.
 * @returns {{ schemas: Record<string, object>, definitions: Record<string, object> }}
 */
export function generateJsonSchema(options) {
    const {
        rootFiles,
        tsconfigPath,
        compilerOptions: extraCompilerOptions = {},
        interfaceDir,
        rootTypeNames,
        maxDepth = 1,
        includeAllLocalDeclarations = false,
        typeNameOverrides = {},
    } = options;

    // ─── TypeScript Program Setup ───────────────────────────────────────────────

    let baseOptions = {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
        skipLibCheck: true,
        esModuleInterop: true,
        allowJs: false,
        strict: false,
    };
    let configRootNames = [];

    if (tsconfigPath) {
        const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            require("node:path").dirname(tsconfigPath),
        );
        baseOptions = parsed.options;
        configRootNames = parsed.fileNames;
    }

    const options_ = {
        ...baseOptions,
        ...extraCompilerOptions,
        noEmit: true,
    };
    delete options_.outDir;
    delete options_.declaration;
    delete options_.declarationDir;
    delete options_.declarationMap;

    const rootNames = [...new Set([...configRootNames, ...rootFiles])];
    const program = ts.createProgram({ rootNames, options: options_ });
    const checker = program.getTypeChecker();

    // ─── Collect "local" Type Declarations ──────────────────────────────────────

    /** Map of type name → AST declaration node, for types treated as "local" (unlimited depth). */
    const typeDecls = new Map();
    /** Map of type name → list of type parameter names, for generic local types. */
    const typeParams = new Map();

    if (interfaceDir) {
        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.fileName.startsWith(interfaceDir)) continue;
            collectDeclarations(sourceFile);
        }
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

    // ─── JSON Schema Generation ──────────────────────────────────────────────────

    /** All definitions collected during traversal. */
    const definitions = {};
    /** Set of definition keys currently being processed (cycle detection). */
    const processing = new Set();
    /** Maximum key depth to prevent infinite expansion of recursive generics. */
    const MAX_ARG_NESTING = 3;

    function argKeyDepth(key) {
        return (key.match(/Arr/g) || []).length;
    }

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
                const valueSchema = node.type ? convertTypeNode(node.type, ctx) : {};
                return { type: "object", additionalProperties: valueSchema };
            }

            case ts.SyntaxKind.TypeReference: {
                return convertTypeReference(node, ctx);
            }

            case ts.SyntaxKind.ConditionalType:
                return {};

            case ts.SyntaxKind.IndexedAccessType:
                return {};

            case ts.SyntaxKind.TemplateLiteralType:
                return { type: "string" };

            case ts.SyntaxKind.RestType:
            case ts.SyntaxKind.OptionalType:
                return convertTypeNode(node.type, ctx);

            case ts.SyntaxKind.InferType:
                return {};

            case ts.SyntaxKind.TypeQuery:
                return {};

            case ts.SyntaxKind.NamedTupleMember:
                return convertTypeNode(node.type, ctx);

            default:
                return {};
        }
    }

    function convertTypeLiteral(node, ctx) {
        const properties = {};
        const required = [];
        let additionalProperties;

        for (const member of node.members) {
            if (ts.isPropertySignature(member)) {
                const name = getMemberName(member);
                if (!name) continue;
                const schema = convertTypeNode(member.type, ctx);
                properties[name] = getJsDocAnnotations(member, schema);
                if (!member.questionToken) {
                    required.push(name);
                }
            } else if (ts.isIndexSignatureDeclaration(member)) {
                additionalProperties = convertTypeNode(member.type, ctx);
            }
        }

        const schema = { type: "object" };
        if (Object.keys(properties).length > 0) schema.properties = properties;
        if (required.length > 0) schema.required = required;
        if (additionalProperties !== undefined) schema.additionalProperties = additionalProperties;
        return schema;
    }

    function getMemberName(member) {
        if (!member.name) return null;
        if (ts.isIdentifier(member.name)) return member.name.text;
        if (ts.isStringLiteral(member.name)) return member.name.text;
        if (ts.isNumericLiteral(member.name)) return member.name.text;
        return null;
    }

    /**
     * `definitions` entry keys already used for external (named) types, keyed by
     * `<declaring file>::<type name>::<depth>` — the depth is part of the key because the same
     * named type expands to a shallower or deeper schema depending on how far from `maxDepth` it's
     * first encountered.
     */
    const externalTypeDefKeys = new Map();

    function getExternalTypeCacheKey(type) {
        const symbol = type.getSymbol?.() ?? type.aliasSymbol;
        const name = symbol?.getName?.();
        if (!name || name.startsWith("__")) return null;
        const declaration = symbol.getDeclarations?.()?.[0];
        const file = declaration ? declaration.getSourceFile().fileName : "";
        return `${file}::${name}`;
    }

    /**
     * Converts a resolved (semantic) `ts.Type` — not an AST node — to a JSON Schema fragment,
     * capped at `maxDepth` nested object levels (see {@link GenerateJsonSchemaOptions.maxDepth}).
     * The depth cap doubles as cycle protection for circular external types.
     */
    function convertExternalType(type, depth) {
        if (!type) return {};
        const flags = type.flags;

        if (flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return {};
        if (flags & ts.TypeFlags.String) return { type: "string" };
        if (flags & ts.TypeFlags.Number) return { type: "number" };
        if (flags & ts.TypeFlags.Boolean) return { type: "boolean" };
        if (flags & ts.TypeFlags.Null) return { type: "null" };
        if (flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Void)) return {};
        if (flags & ts.TypeFlags.Never) return { not: {} };
        if (flags & ts.TypeFlags.StringLiteral) return { const: type.value };
        if (flags & ts.TypeFlags.NumberLiteral) return { const: type.value };
        if (flags & ts.TypeFlags.BooleanLiteral) {
            return { const: checker.typeToString(type) === "true" };
        }

        if (flags & ts.TypeFlags.Object) {
            if (depth <= maxDepth) {
                const cacheKey = getExternalTypeCacheKey(type);
                if (cacheKey) {
                    const existingDefKey = externalTypeDefKeys.get(`${cacheKey}@${depth}`);
                    if (existingDefKey) {
                        return { $ref: `#/definitions/${existingDefKey}` };
                    }
                    const defKey = `External_${checker.typeToString(type)}_d${depth}`.replace(
                        /[^A-Za-z0-9_]/g,
                        "_",
                    );
                    externalTypeDefKeys.set(`${cacheKey}@${depth}`, defKey);
                    definitions[defKey] = {}; // placeholder for cycle-safety
                    Object.assign(definitions[defKey], buildExternalObjectSchema(type, depth));
                    return { $ref: `#/definitions/${defKey}` };
                }
                return buildExternalObjectSchema(type, depth);
            }
            // Beyond the depth cap: still constrained to "an object", just opaque — see the
            // module doc for why this is more useful than falling back to a bare `{}`.
            return { type: "object" };
        }

        if (type.isUnion()) {
            return mergeUnion(type.types.map((t) => convertExternalType(t, depth)));
        }
        if (type.isIntersection()) {
            return { allOf: type.types.map((t) => convertExternalType(t, depth)) };
        }

        if (checker.isArrayType(type)) {
            const [elementType] = checker.getTypeArguments(type);
            return { type: "array", items: convertExternalType(elementType, depth + 1) };
        }
        if (checker.isTupleType(type)) {
            const elementTypes = checker.getTypeArguments(type);
            return {
                type: "array",
                items: elementTypes.map((t) => convertExternalType(t, depth + 1)),
            };
        }

        if (type.getCallSignatures().length > 0 || type.getConstructSignatures().length > 0) {
            return {};
        }

        return {};
    }

    function buildExternalObjectSchema(type, depth) {
        const properties = {};
        const required = [];
        for (const prop of checker.getPropertiesOfType(type)) {
            const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
            if (!declaration) continue;
            const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
            if (propType.getCallSignatures().length > 0) continue; // skip methods
            properties[prop.name] = convertExternalType(propType, depth + 1);
            if ((prop.flags & ts.SymbolFlags.Optional) === 0) {
                required.push(prop.name);
            }
        }
        const schema = { type: "object" };
        if (Object.keys(properties).length > 0) schema.properties = properties;
        if (required.length > 0) schema.required = required;
        const indexInfo =
            checker.getIndexInfoOfType(type, ts.IndexKind.String) ??
            checker.getIndexInfoOfType(type, ts.IndexKind.Number);
        if (indexInfo) {
            schema.additionalProperties = convertExternalType(indexInfo.type, depth + 1);
        } else {
            schema.additionalProperties = false;
        }
        return schema;
    }

    function convertTypeReference(node, ctx) {
        const name = getTypeName(node.typeName);

        if (ctx.has(name)) {
            const schema = ctx.get(name);
            if (schema && schema.__key !== undefined) {
                const { __key, ...rest } = schema;
                return rest;
            }
            return schema;
        }

        if (Object.hasOwn(typeNameOverrides, name)) {
            return typeNameOverrides[name];
        }

        const builtinSchema = getBuiltinTypeSchema(name);
        if (builtinSchema !== null) return builtinSchema;

        if (typeDecls.has(name)) {
            const decl = typeDecls.get(name);
            const params = typeParams.get(name);

            if (
                params &&
                params.length > 0 &&
                node.typeArguments &&
                node.typeArguments.length > 0
            ) {
                return handleGenericApplication(name, decl, params, node.typeArguments, ctx);
            }

            ensureDefinition(name, decl, new Map());
            return { $ref: `#/definitions/${name}` };
        }

        try {
            const resolvedType = checker.getTypeFromTypeNode(node);
            return convertExternalType(resolvedType, 1);
        } catch {
            return {};
        }
    }

    function handleGenericApplication(baseName, decl, paramNames, typeArgNodes, outerCtx) {
        const argKeys = typeArgNodes.map((arg, i) => getTypeNodeKey(arg, outerCtx) || `T${i}`);

        const safArgKeys = argKeys.map((k) => {
            if (argKeyDepth(k) >= MAX_ARG_NESTING) {
                return k.replace(/(Arr)+$/, "");
            }
            return k;
        });

        const defKey = `${baseName}_${safArgKeys.join("_")}`.replace(/[^A-Za-z0-9_]/g, "_");

        if (definitions[defKey] !== undefined) {
            return { $ref: `#/definitions/${defKey}` };
        }
        if (processing.has(defKey)) {
            return { $ref: `#/definitions/${defKey}` };
        }

        const argSchemas = typeArgNodes.map((arg) => convertTypeNode(arg, outerCtx));

        const newCtx = new Map(outerCtx);
        for (let i = 0; i < paramNames.length; i++) {
            const argSchema = argSchemas[i] || {};
            newCtx.set(paramNames[i], { ...argSchema, __key: safArgKeys[i] });
        }

        processing.add(defKey);
        definitions[defKey] = {};

        const raw = convertDeclaration(decl, newCtx);
        const schema = removePrivateKeys(raw);
        Object.assign(definitions[defKey], schema);
        processing.delete(defKey);

        return { $ref: `#/definitions/${defKey}` };
    }

    function removePrivateKeys(obj) {
        return JSON.parse(JSON.stringify(obj, (key, val) => (key === "__key" ? undefined : val)));
    }

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
                if (ctx.has(name)) {
                    const resolved = ctx.get(name);
                    if (resolved?.__key) return resolved.__key;
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

    function ensureDefinition(name, decl, ctx) {
        if (definitions[name] !== undefined) return;
        if (processing.has(name)) return;

        processing.add(name);
        definitions[name] = {};
        const schema = convertDeclaration(decl, ctx);
        Object.assign(definitions[name], schema);
        processing.delete(name);
    }

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

    function convertInterface(decl, ctx) {
        const properties = {};
        const required = [];
        let additionalProperties;

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
                additionalProperties = convertTypeNode(member.type, ctx);
            }
        }

        const schema = { type: "object" };
        if (Object.keys(properties).length > 0) schema.properties = properties;
        if (required.length > 0) schema.required = required;
        if (additionalProperties !== undefined) schema.additionalProperties = additionalProperties;

        if (allOf.length > 0) {
            return { allOf: [...allOf, schema] };
        }
        return schema;
    }

    function getTypeName(entityName) {
        if (ts.isIdentifier(entityName)) return entityName.text;
        if (ts.isQualifiedName(entityName)) {
            return `${getTypeName(entityName.left)}.${entityName.right.text}`;
        }
        return "";
    }

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
                return null;
            case "Pick":
            case "Omit":
                return {};
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

    function mergeUnion(schemas) {
        const nonEmpty = schemas.filter((s) => Object.keys(s).length > 0);

        if (nonEmpty.length === 0) return {};
        if (nonEmpty.length === 1) return nonEmpty[0];

        const allTypes = nonEmpty.every((s) => s.type && Object.keys(s).length === 1);
        if (allTypes) {
            const types = [...new Set(nonEmpty.map((s) => s.type))];
            if (types.length === 1) return { type: types[0] };
            return { type: types };
        }

        const allConsts = nonEmpty.every((s) => s.const !== undefined);
        if (allConsts) {
            return { enum: nonEmpty.map((s) => s.const) };
        }

        return { anyOf: nonEmpty };
    }

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

    /** Finds a top-level interface/type-alias declaration named `name` in any of `rootFiles`. */
    function findRootFileDeclaration(name) {
        for (const fileName of rootFiles) {
            const sourceFile = program.getSourceFile(fileName);
            if (!sourceFile) continue;
            let found;
            ts.forEachChild(sourceFile, (node) => {
                if (found) return;
                if (
                    (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
                    node.name.text === name
                ) {
                    found = node;
                }
            });
            if (found) return found;
        }
        return undefined;
    }

    // ─── Generate the Requested Root Schemas ─────────────────────────────────────

    const schemas = {};
    for (const name of rootTypeNames) {
        if (typeDecls.has(name)) {
            // "Local" type: expand fully via the AST-walk path (no depth cap).
            ensureDefinition(name, typeDecls.get(name), new Map());
            schemas[name] = { $ref: `#/definitions/${name}` };
            continue;
        }

        const declNode = findRootFileDeclaration(name);
        if (!declNode) {
            throw new Error(
                `generateJsonSchema: type "${name}" was not found under interfaceDir nor as a top-level declaration in any rootFiles entry.`,
            );
        }
        const type = checker.getTypeAtLocation(declNode.name);
        schemas[name] = convertExternalType(type, 1);
    }

    if (includeAllLocalDeclarations) {
        for (const [name, decl] of typeDecls) {
            if (!definitions[name]) {
                ensureDefinition(name, decl, new Map());
            }
        }
    }

    return { schemas, definitions };
}
