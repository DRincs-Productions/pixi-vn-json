import { Assets, canvas, FadeAlphaTicker, ImageContainer, ImageSprite, moveIn, moveOut, MoveTicker, narration, pushIn, pushOut, removeWithDissolveTransition, removeWithFadeTransition, RotateTicker, shakeEffect, showWithDissolveTransition, showWithFadeTransition, sound, VideoSprite, zoomIn, zoomOut, ZoomTicker } from "@drincs/pixi-vn"
import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface"
import { PixiVNJsonCanvasRemove, PixiVNJsonCanvasShow } from "../interface/PixiVNJsonCanvas"
import { PixiVNJsonOperationString } from '../interface/PixiVNJsonOperations'
import { getLogichValue, setStorageJson } from "./utility"

export async function runOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
    operationStringConvert?: (value: string) => Promise<PixiVNJsonOperation | undefined>,
) {
    let operation = getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(origin)
    if (!operation) {
        return
    }
    switch (operation.type) {
        case "sound":
            switch (operation.operationType) {
                case "play":
                    sound.play(operation.alias, operation.props)
                    break
                case "stop":
                    sound.stop(operation.alias)
                    break
                case "pause":
                    sound.pause(operation.alias)
                    break
                case "resume":
                    sound.resume(operation.alias)
                    break
                case "volume":
                    sound.volume(operation.alias, operation.value)
                    break
            }
            break
        case "assets":
            switch (operation.operationType) {
                case "load":
                    let prmises = operation.assets.map((asset) => Assets.load(asset))
                    await Promise.all(prmises)
                    break
            }
            break
        case "image":
            switch (operation.operationType) {
                case "show":
                    let imageToShow = new ImageSprite(operation.props, operation.url || operation.alias)
                    await showCanvasElemet(imageToShow, operation)
                    break
                case "edit":
                    let image = canvas.find<ImageSprite>(operation.alias)
                    if (image) {
                        if (operation.props) {
                            await image.setMemory({
                                ...image.memory,
                                ...operation.props,
                            })
                        }
                    }
                    else {
                        console.error(`[Pixi’VN Json] Image with alias ${operation.alias} not found.`)
                    }
                    break
                case "remove":
                    removeCanvasElement(operation)
                    break
            }
            break
        case "video":
            switch (operation.operationType) {
                case "show":
                    let videoToShow = new VideoSprite(operation.props, operation.url || operation.alias)
                    await showCanvasElemet(videoToShow, operation)
                    break
                case "edit":
                    let video = canvas.find<VideoSprite>(operation.alias)
                    if (video) {
                        if (operation.props) {
                            await video.setMemory({
                                ...video.memory,
                                ...operation.props,
                            })
                        }
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
                case "remove":
                    removeCanvasElement(operation)
                    break
                case "pause":
                    let videoPause = canvas.find<VideoSprite>(operation.alias)
                    if (videoPause) {
                        videoPause.paused = true
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
                case "resume":
                    let videoResume = canvas.find<VideoSprite>(operation.alias)
                    if (videoResume) {
                        videoResume.paused = false
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
            }
            break
        case "imagecontainer":
            switch (operation.operationType) {
                case "show":
                    let imageContainerToShow = new ImageContainer(operation.props, operation.urls)
                    await showCanvasElemet(imageContainerToShow, operation)
                    break
                case "edit":
                    let image = canvas.find<ImageContainer>(operation.alias)
                    if (image) {
                        if (operation.props) {
                            await image.setMemory({
                                ...image.memory,
                                ...operation.props,
                            })
                        }
                    }
                    else {
                        console.error(`[Pixi’VN Json] ImageContainer with alias ${operation.alias} not found.`)
                    }
                    break
                case "remove":
                    removeCanvasElement(operation)
                    break
            }
            break
        case "canvaselement":
            switch (operation.operationType) {
                case "edit":
                    try {
                        let unknown = canvas.find(operation.alias)
                        if (unknown) {
                            if (operation.props) {
                                unknown.memory = {
                                    ...unknown.memory,
                                    ...operation.props,
                                }
                            }
                        }
                        else {
                            console.error(`[Pixi’VN Json] Canvas Element with alias ${operation.alias} not found.`)
                        }
                    }
                    catch (e) {
                        console.error(`[Pixi’VN Json] There was an error while trying to edit the canvas element with alias ${operation.alias}.`, e)
                    }
                    break
                case "remove":
                    removeCanvasElement(operation)
                    break
            }
            break
        case "value":
            setStorageJson(operation)
            break
        case "operationtoconvert":
            if (operationStringConvert) {
                let stringOperation = ""
                operation.values.forEach((value) => {
                    if (typeof value === "string") {
                        stringOperation += value
                    }
                    else {
                        let res = getLogichValue<string>(value)
                        stringOperation += `${res}`
                    }
                })
                let op = await operationStringConvert(stringOperation)
                if (op) {
                    await runOperation(op, operationStringConvert)
                }
            }
            break
        case "input":
            switch (operation.operationType) {
                case "request":
                    narration.requestInput({ type: operation.valueType }, operation.defaultValue)
                    break
            }
            break
        case "fade":
            let tickerFade = new FadeAlphaTicker(operation.props, operation.duration, operation.priority)
            canvas.addTicker(operation.alias, tickerFade)
            break
        case "move":
            let tickerMove = new MoveTicker(operation.props, operation.duration, operation.priority)
            canvas.addTicker(operation.alias, tickerMove)
            break
        case "rotate":
            let tickerRotate = new RotateTicker(operation.props, operation.duration, operation.priority)
            canvas.addTicker(operation.alias, tickerRotate)
            break
        case "zoom":
            let tickerZoom = new ZoomTicker(operation.props, operation.duration, operation.priority)
            canvas.addTicker(operation.alias, tickerZoom)
            break
        case "shake":
            await shakeEffect(operation.alias, operation.props, operation.priority)
            break
    }
}

export async function showCanvasElemet(element: ImageSprite | VideoSprite | ImageContainer, operation: PixiVNJsonCanvasShow) {
    if (operation.transition) {
        switch (operation.transition.type) {
            case "fade":
                await showWithFadeTransition(operation.alias, element, operation.transition.props, operation.transition.priority)
                break
            case "dissolve":
                await showWithDissolveTransition(operation.alias, element, operation.transition.props, operation.transition.priority)
                break
            case "movein":
            case "moveout":
                await moveIn(operation.alias, element, operation.transition.props, operation.transition.priority)
                break
            case "zoomin":
            case "zoomout":
                await zoomIn(operation.alias, element, operation.transition.props, operation.transition.priority)
                break
            case "pushin":
            case "pushout":
                await pushIn(operation.alias, element, operation.transition.props, operation.transition.priority)
                break
        }
    }
    else {
        canvas.add(operation.alias, element)
        await element.load()
    }
}

export function removeCanvasElement(operation: PixiVNJsonCanvasRemove) {
    if (operation.transition) {
        switch (operation.transition.type) {
            case "fade":
                removeWithFadeTransition(operation.alias, operation.transition.props, operation.transition.priority)
                break
            case "dissolve":
                removeWithDissolveTransition(operation.alias, operation.transition.props, operation.transition.priority)
                break
            case "movein":
            case "moveout":
                moveOut(operation.alias, operation.transition.props, operation.transition.priority)
                break
            case "zoomin":
            case "zoomout":
                zoomOut(operation.alias, operation.transition.props, operation.transition.priority)
                break
            case "pushin":
            case "pushout":
                pushOut(operation.alias, operation.transition.props, operation.transition.priority)
                break
        }
    }
    else {
        canvas.remove(operation.alias)
    }
}
