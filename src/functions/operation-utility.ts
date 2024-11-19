import { Assets, canvas, CanvasImage, CanvasVideo, FadeAlphaTicker, moveIn, moveOut, MoveTicker, narration, removeWithDissolveTransition, removeWithFadeTransition, RotateTicker, shakeEffect, showWithDissolveTransition, showWithFadeTransition, sound, zoomIn, zoomOut, ZoomTicker } from "@drincs/pixi-vn"
import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface"
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
                case "add":
                    sound.add(operation.alias, {
                        ...operation.props,
                        url: operation.url
                    })
                    break
                case "play":
                    sound.play(operation.alias, operation.props)
                    break
                case "remove":
                    sound.remove(operation.alias)
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
                    await Assets.load(operation.assets)
                    break
            }
            break
        case "image":
            switch (operation.operationType) {
                case "show":
                    let imageToShow = new CanvasImage(operation.props, operation.url)
                    if (operation.transition) {
                        switch (operation.transition.type) {
                            case "fade":
                                await showWithFadeTransition(operation.alias, imageToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "dissolve":
                                await showWithDissolveTransition(operation.alias, imageToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "movein":
                            case "moveout":
                                await moveIn(operation.alias, imageToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "zoomin":
                            case "zoomout":
                                await zoomIn(operation.alias, imageToShow, operation.transition.props, operation.transition.priority)
                                break
                        }
                    }
                    else {
                        canvas.add(operation.alias, imageToShow)
                        await imageToShow.load()
                    }
                    break
                case "edit":
                    let image = canvas.find<CanvasImage>(operation.alias)
                    if (image) {
                        if (operation.props) {
                            image.memory = {
                                ...image.memory,
                                ...operation.props,
                            }
                        }
                    }
                    else {
                        console.error(`[Pixi’VN Json] Image with alias ${operation.alias} not found.`)
                    }
                    break
                case "remove":
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
                        }
                    }
                    else {
                        canvas.remove(operation.alias)
                    }
                    break
            }
            break
        case "video":
            switch (operation.operationType) {
                case "show":
                    let videoToShow = new CanvasVideo(operation.props, operation.url)
                    if (operation.transition) {
                        switch (operation.transition.type) {
                            case "fade":
                                await showWithFadeTransition(operation.alias, videoToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "dissolve":
                                await showWithDissolveTransition(operation.alias, videoToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "movein":
                            case "moveout":
                                await moveIn(operation.alias, videoToShow, operation.transition.props, operation.transition.priority)
                                break
                            case "zoomin":
                            case "zoomout":
                                await zoomIn(operation.alias, videoToShow, operation.transition.props, operation.transition.priority)
                                break
                        }
                    }
                    else {
                        canvas.add(operation.alias, videoToShow)
                        await videoToShow.load()
                    }
                    break
                case "edit":
                    let video = canvas.find<CanvasVideo>(operation.alias)
                    if (video) {
                        if (operation.props) {
                            video.memory = {
                                ...video.memory,
                                ...operation.props,
                            }
                        }
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
                case "remove":
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
                        }
                    }
                    else {
                        canvas.remove(operation.alias)
                    }
                    break
                case "pause":
                    let videoPause = canvas.find<CanvasVideo>(operation.alias)
                    if (videoPause) {
                        videoPause.paused = true
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
                case "resume":
                    let videoResume = canvas.find<CanvasVideo>(operation.alias)
                    if (videoResume) {
                        videoResume.paused = false
                    }
                    else {
                        console.error(`[Pixi’VN Json] Video with alias ${operation.alias} not found.`)
                    }
                    break
            }
            break
        case "value":
            setStorageJson(operation)
            break
        case "oprationtoconvert":
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
                    narration.requestInput({ type: operation.valueType })
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
