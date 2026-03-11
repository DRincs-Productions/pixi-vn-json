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

* Add a new narrative to Pixi’VN (It was used to create the integration with [Ink](https://pixi-vn.web.app/ink/ink.html) and [Ren'Py](https://pixi-vn.web.app/renpy/renpy.html))
* Create a external tool to create visual novels with Pixi’VN

( In both these cases it is advisable to notify the developers of Pixi’VN to add the new feature to be helped )

![Pixi’VN + Json Integration](https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2FPixiVNJson.png?alt=media)

## How use Pixi’VN + Json?

First of all you need to install the following library:

```bash
# npm
npm install @drincs/pixi-vn-json

# yarn
yarn add @drincs/pixi-vn-json

# pnpm
pnpm add @drincs/pixi-vn-json

# bun
bun add @drincs/pixi-vn-json
```

All you need to do to use this integration is create a object using the [`PixiVNJson` Model](#pixivnjson-model) and use the `importPixiVNJson()` function to import the object.

```typescript
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

After that you can run the `back_in_london` label with [Pixi’VN functions](https://pixi-vn.web.app/start/labels.html#run-a-label).

```typescript
narration.callLabel(`back_in_london`, {})
```

## PixiVNJson Model

You can see the `PixiVNJson` model in the [PixiVNJson.ts](https://github.com/DRincs-Productions/pixi-vn-json/blob/main/src/interface/PixiVNJson.ts) file.

Now `PixiVNJson` is currently in continuous change, more documentation will be written in the future.
