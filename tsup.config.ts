import { defineConfig, type Options } from "tsup";

export default defineConfig((options) => {
    const sourcemap = Boolean(options.watch);
    const createConfig = (config: Options): Options => ({
        sourcemap,
        ...config,
    });

    return [
        createConfig({
            target: "es2020",
            entry: {
                core: "src/core/index.ts",
            },
            format: ["cjs", "esm"],
            dts: true,
            treeshake: true,
            splitting: false,
            clean: false,
            minify: true,
            bundle: true,
            skipNodeModulesBundle: false,
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2020",
            entry: {
                translator: "src/translator/index.ts",
            },
            format: ["cjs", "esm"],
            dts: true,
            treeshake: true,
            splitting: false,
            clean: false,
            minify: true,
            bundle: true,
            skipNodeModulesBundle: false,
            external: ["@drincs/pixi-vn-json/core"],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2020",
            entry: {
                importer: "src/importer/index.ts",
            },
            format: ["cjs", "esm"],
            dts: true,
            treeshake: true,
            splitting: false,
            clean: false,
            minify: true,
            bundle: true,
            skipNodeModulesBundle: false,
            external: ["@drincs/pixi-vn-json/core", "@drincs/pixi-vn-json/translator"],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2020",
            entry: {
                index: "src/index.ts",
            },
            format: ["cjs", "esm"], // Build for commonJS and ESmodules
            dts: true, // Generate declaration file (.d.ts)
            treeshake: true,
            clean: false,
            minify: true,
            bundle: true,
            skipNodeModulesBundle: false, // Skip bundling of node_modules
            external: ["@drincs/pixi-vn-json/core", "@drincs/pixi-vn-json/importer", "@drincs/pixi-vn-json/translator"],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
    ];
});
