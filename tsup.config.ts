import { defineConfig, type Options } from "tsup";

export default defineConfig((options) => {
    const sourcemap = Boolean(options.watch);
    const createConfig = (config: Options): Options => ({
        sourcemap,
        ...config,
    });

    return [
        createConfig({
            target: "es2022",
            entry: {
                core: "src/core/index.ts",
                schema: "src/schema/index.ts",
                constants: "src/constants.ts",
            },
            format: ["cjs", "esm"],
            treeshake: true,
            splitting: false,
            clean: true,
            minify: true,
            skipNodeModulesBundle: false,
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2022",
            entry: {
                translator: "src/translator/index.ts",
            },
            format: ["cjs", "esm"],
            treeshake: true,
            splitting: false,
            clean: false,
            minify: true,
            skipNodeModulesBundle: false,
            external: ["@drincs/pixi-vn-json/core"],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2022",
            entry: {
                interpreter: "src/interpreter/index.ts",
                actions: "src/actions/index.ts",
            },
            format: ["cjs", "esm"],
            treeshake: true,
            splitting: false,
            clean: false,
            minify: true,
            skipNodeModulesBundle: false,
            external: ["@drincs/pixi-vn-json/core", "@drincs/pixi-vn-json/translator"],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2022",
            entry: {
                index: "src/index.ts",
            },
            format: ["cjs", "esm"],
            treeshake: true,
            clean: false,
            minify: true,
            skipNodeModulesBundle: false,
            external: [
                "@drincs/pixi-vn-json/core",
                "@drincs/pixi-vn-json/interpreter",
                "@drincs/pixi-vn-json/actions",
                "@drincs/pixi-vn-json/translator",
            ],
            outExtension({ format }) {
                return {
                    js: format === "esm" ? ".mjs" : ".cjs",
                };
            },
        }),
        createConfig({
            target: "es2022",
            entry: {
                core: "src/core/index.ts",
                schema: "src/schema/index.ts",
                constants: "src/constants.ts",
                translator: "src/translator/index.ts",
                interpreter: "src/interpreter/index.ts",
                actions: "src/actions/index.ts",
                index: "src/index.ts",
            },
            format: ["cjs", "esm"],
            dts: { only: true },
            clean: false,
        }),
    ];
});
