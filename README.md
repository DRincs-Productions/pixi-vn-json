# Pixi’VN + Json Integration

![pixi-vn-cover-json](https://github.com/user-attachments/assets/ec9aa39e-6e3c-4198-8a65-e1fce1f1d637)

<p align="center">
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-json" rel="noopener noreferrer nofollow"><img src="https://img.shields.io/npm/v/@drincs/pixi-vn-json?label=version" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-json" rel="noopener noreferrer nofollow"><img src="https://img.shields.io/npm/dm/@drincs/pixi-vn-json" alt="npm downloads per month"></a>
  <a target="_blank" href="https://www.jsdelivr.com/package/npm/@drincs/pixi-vn-json" rel="noopener noreferrer nofollow"><img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/@drincs/pixi-vn-json?logo=jsdeliver"></a>
  <a href="https://www.npmjs.com/package/@drincs/pixi-vn-json" rel="noopener noreferrer nofollow"><img alt="NPM License" src="https://img.shields.io/npm/l/@drincs/pixi-vn-json"></a>
  <a target="_blank" href="https://discord.gg/E95FZWakzp" rel="noopener noreferrer nofollow"><img alt="Discord" src="https://img.shields.io/discord/1263071210011496501?color=7289da&label=discord"></a>
</p>

Pixi’VN can be integrated with JSON files to create a visual novel. This method is useful for:

* Add a new narrative to Pixi’VN (It was used to create the integration with <DynamicLink href="/ink">***ink***</DynamicLink> and <DynamicLink href="/renpy">Ren'Py</DynamicLink>)
* Create a external tool to create visual novels with Pixi’VN

( In both these cases it is advisable to notify the developers of Pixi’VN to add the new feature to be helped )

```mermaid
flowchart LR;
    K@{ img: "https://pixi-vn.web.app/renpy.svg", label: "RenPy", pos: "b", w: 90, h: 90, constraint: "on" }---->Json;
    H@{ img: "https://pixi-vn.web.app/ink.svg", label: "ink", pos: "b", w: 90, h: 90, constraint: "on" }---->Json;
    I@{ img: "https://pixi-vn.web.app/twine.svg", label: "Twine", pos: "b", w: 90, h: 90, constraint: "on" }---->Json;
    J@{ img: "https://pixi-vn.web.app/yarn-spinner.svg", label: "Yarn Spinner", pos: "b", w: 90, h: 90, constraint: "on" }---->Json;
    Json@{ img: "https://pixi-vn.web.app/pixivn-json.svg", label: "Pixi’VN + Json", pos: "b", w: 140, h: 140, constraint: "on" }
    Json===>PixiVN;
    PixiVN@{ img: "https://pixi-vn.web.app/logo.webp", label: "Pixi’VN", pos: "b", w: 180, h: 180, constraint: "on" }
classDef img fill:none,stroke:none,borderRadius:50px
class Json,D,K,H,B,I,J,PixiVN img
```

## How use Pixi’VN + Json?

First of all you need to install the following library:

```sh tab="npm"
npm install @drincs/pixi-vn-json
```

```sh tab="yarn"
yarn add @drincs/pixi-vn-json
```

```sh tab="pnpm"
pnpm add @drincs/pixi-vn-json
```

```sh tab="bun"
bun add @drincs/pixi-vn-json
```

All you need to do to use this integration is create a object using the <DynamicLink href="/json/PixiVNJson">`PixiVNJson` Model</DynamicLink> and use the `importPixiVNJson()` function to import the object.

```ts title="main.ts"
import { PixiVNJson, importPixiVNJson} from '@drincs/pixi-vn-json';

let obj: PixiVNJson = {
    labels: {
        back_in_london: [
            {
                dialogue: "We arrived into London at 9.45pm exactly.",
            },
            {
                labelToOpen: {
                    label: "hurry_home",
                    type: "jump",
                },
            },
        ],
        hurry_home: [
            {
                dialogue: "We hurried home to Savile Row as fast as we could.",
            },
            {
                end: "label_end",
            },
        ]
    }
}

importPixiVNJson(obj);
```

After that you can run the `back_in_london` label with <DynamicLink href="/start/labels#run-a-label">Pixi’VN functions</DynamicLink>.

```ts title="main.ts"
import { narration } from '@drincs/pixi-vn'

narration.call(`back_in_london`, {})
```

