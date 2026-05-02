import type { PixiVNJsonComparationOperatorsType } from "@drincs/pixi-vn-json/schema";
import pkg from "../package.json";

export const PIXIVNJSON_PARAM_ID = "___param___";

/**
 * The URL of the JSON Schema for the current version of pixi-vn-json.
 *
 * You can use this constant as the value of the `$schema` field in your PixiVNJson documents
 * so that editors can validate and auto-complete the document.
 *
 * Example:
 * ```json
 * {
 *   "$schema": "https://pixi-vn.web.app/schemas/1.13.0/schema.json"
 * }
 * ```
 */
export const PIXIVNJSON_SCHEMA_URL = `https://pixi-vn.web.app/schemas/${pkg.version}/schema.json`;

export const PixiVNJsonComparationOperators: PixiVNJsonComparationOperatorsType[] = [
    "==",
    "!=",
    "<",
    "<=",
    ">",
    ">=",
    "CONTAINS",
];
