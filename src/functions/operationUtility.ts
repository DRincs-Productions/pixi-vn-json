import { canvas, CanvasImage, CanvasVideo, moveIn, narration, showImage, showVideo, showWithDissolveTransition, showWithFadeTransition, sound, zoomIn } from "@drincs/pixi-vn"
import { geLogichValue, setStorageJson } from "../functions/utility"
import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface"
import { PixiVNJsonOperationString } from '../interface/PixiVNJsonOperations'

export async function runOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
    params: any[],
    operationStringConvert?: (value: string) => PixiVNJsonOperation | undefined,
) {
    let operation = geLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(origin, params)
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
        case "image":
            switch (operation.operationType) {
                case "show":
                    if (operation.transition) {
                        switch (operation.transition.type) {
                            case "fade":
                                await showWithFadeTransition(operation.alias, operation.url, operation.transition.props, operation.transition.priority)
                                break
                            case "dissolve":
                                await showWithDissolveTransition(operation.alias, operation.url, operation.transition.props, operation.transition.priority)
                                break
                            case "movein":
                            case "moveout":
                                await moveIn(operation.alias, operation.url, operation.transition.props, operation.transition.priority)
                                break
                            case "zoomin":
                            case "zoomout":
                                await zoomIn(operation.alias, operation.url, operation.transition.props, operation.transition.priority)
                                break
                        }
                    }
                    else {
                        await showImage(operation.alias, operation.url)
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
                    canvas.remove(operation.alias)
                    break
            }
            break
        case "video":
            switch (operation.operationType) {
                case "show":
                    if (operation.transition) {
                        let video = new CanvasVideo()
                        video.videoLink = operation.url
                        switch (operation.transition.type) {
                            case "fade":
                                await showWithFadeTransition(operation.alias, video, operation.transition.props, operation.transition.priority)
                                break
                            case "dissolve":
                                await showWithDissolveTransition(operation.alias, video, operation.transition.props, operation.transition.priority)
                                break
                            case "movein":
                            case "moveout":
                                await moveIn(operation.alias, video, operation.transition.props, operation.transition.priority)
                                break
                            case "zoomin":
                            case "zoomout":
                                await zoomIn(operation.alias, video, operation.transition.props, operation.transition.priority)
                                break
                        }
                    }
                    else {
                        await showVideo(operation.alias, operation.url)
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
                    canvas.remove(operation.alias)
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
            setStorageJson(operation, params)
            break
        case "oprationtoconvert":
            if (operationStringConvert) {
                let stringOperation = ""
                operation.values.forEach((value) => {
                    if (typeof value === "string") {
                        stringOperation += value
                    }
                    else {
                        let res = geLogichValue<string>(value, params)
                        stringOperation += `${res}`
                    }
                })
                let op = operationStringConvert(stringOperation)
                if (op) {
                    await runOperation(op, params)
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
    }
}
