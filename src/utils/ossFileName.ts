import request from './request';

export enum WALLPAPER_TYPE {
    WALLPAPER = 'img',
    LIVE_WALLPAPER = 'live'
}

const imgPrefixPath = {
    [WALLPAPER_TYPE.WALLPAPER]: 'wallpaper',
    [WALLPAPER_TYPE.LIVE_WALLPAPER]: 'liveWallpaper'
}

export const ossFullName = (type: WALLPAPER_TYPE, fileNamePrefix: string, fileName: string) => {
    return `${imgPrefixPath[type]}/${fileNamePrefix}/${fileName}`
}

export const getImgsWithPrefix = async (type: WALLPAPER_TYPE, prefix: string) => {
    const ossPrefix = `${imgPrefixPath[type]}/${prefix}`;
    try {
        const imgsResult = await request({
            url: '/getImgsWithPrefix',
            method: 'post',
            data: {
                prefix: ossPrefix,
            }
        });
        return imgsResult.data
    } catch (e) {
        console.log("qly ~ getImgsWithPrefix ~ e:", e)
    }
}

export const deleteImgsWithPrefix = async (type: WALLPAPER_TYPE, prefix: string) => {
    const ossPrefix = `${imgPrefixPath[type]}/${prefix}`;
    try {
        const imgsResult = await request({
            url: '/deleteImgsWithPrefix',
            method: 'post',
            data: {
                prefix: ossPrefix,
            }
        });
        return imgsResult.data
    } catch (e) {
        console.log("qly ~ deleteImgsWithPrefix ~ e:", e)

    }
}