import { Assets, AssetsManifest } from "@drincs/pixi-vn";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";
import { mergeManifests } from "../src/functions/importer";

test("setup", async () => {
    const baseManifest: AssetsManifest = {
        bundles: [
            {
                name: "base",
                assets: [
                    {
                        name: "base",
                        type: "image",
                    },
                    {
                        name: "base",
                        type: "audio",
                    },
                    {
                        name: "base",
                        type: "video",
                    },
                    {
                        name: "base",
                        type: "json",
                    },
                ],
            },
        ],
    };
    const jsons: PixiVNJson[] = [
        {
            manifest: {
                bundles: [
                    {
                        name: "base",
                        assets: [
                            {
                                name: "base2",
                                type: "image",
                            },
                            {
                                name: "base2",
                                type: "audio",
                            },
                            {
                                name: "base2",
                                type: "video",
                            },
                            {
                                name: "base",
                                type: "json",
                            },
                        ],
                    },
                ],
            },
        },
        {
            manifest: {
                bundles: [
                    {
                        name: "label2",
                        assets: [
                            {
                                name: "56345",
                                type: "image",
                            },
                            {
                                name: "34534",
                                type: "audio",
                            },
                            {
                                name: "657",
                                type: "video",
                            },
                            {
                                name: "35345",
                                type: "json",
                            },
                        ],
                    },
                ],
            },
        },
        {
            manifest: {
                bundles: [],
            },
        },
    ];
    const merge = mergeManifests(baseManifest, jsons);
    const expected = {
        bundles: [
            {
                name: "base",
                assets: [
                    {
                        name: "base",
                        type: "image",
                    },
                    {
                        name: "base",
                        type: "audio",
                    },
                    {
                        name: "base",
                        type: "video",
                    },
                    {
                        name: "base",
                        type: "json",
                    },
                    {
                        name: "base2",
                        type: "image",
                    },
                    {
                        name: "base2",
                        type: "audio",
                    },
                    {
                        name: "base2",
                        type: "video",
                    },
                ],
            },
            {
                name: "label2",
                assets: [
                    {
                        name: "56345",
                        type: "image",
                    },
                    {
                        name: "34534",
                        type: "audio",
                    },
                    {
                        name: "657",
                        type: "video",
                    },
                ],
            },
        ],
    };
    const result = await merge;

    expect(expected).toEqual(result);
    Assets.init({ manifest: result });
});
