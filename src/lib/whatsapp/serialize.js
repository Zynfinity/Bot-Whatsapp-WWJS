import { Client as _Client } from "whatsapp-web.js"
import wa from 'whatsapp-web.js'
const { MessageMedia } = wa

class Client extends _Client {
    constructor(...args) {
        super(...args)
    }
    // async sendCall(chatId, options = {}) {
    //     const start = await this.pupPage.evaluate((chatId) => {
    //         return window.WWebJS.call.start(chatId)
    //     })
    // }
    // /**
    //  *
    //  * @param {string} chatId
    //  * @returns {Promise<Boolean>}
    //  */
    // async endCall(chatId) {
    //     const end = await this.pupPage.evaluate((chatId) => {
    //         return window.WWebJS.call.end(chatId);
    //     }, chatId);
    //     if (!end) return false;
    //     return true;
    // }
    async ctwa(title, description, thumbnail, mediaUrl) {
        if (!title && !description && !thumbnail && !mediaUrl) {
            const thumb = await MessageMedia.fromUrl('https://telegra.ph/file/8588a96e89190045f2960.png')
            return ({
                "ctwaContext": {
                    title: '🤖  Simple Whatsapp-Bot',
                    description: `WWJS Version : ${await this.getWWebVersion()}`,
                    thumbnail: thumb.data,
                    mediaType: 2,
                    mediaUrl: 'https://youtube.com/watch?v=XB5mB1WuzbM'
                }
            })
        }
        else return ({
            ctwaContext: {
                title: title,
                description: description,
                thumbnail: thumbnail,
                mediaType: 2,
                mediaUrl: mediaUrl
            }
        })
    }
    async sendMessageMentions(chatId, content, option) {
        const parseMention = async (text) => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@c.us')
        }
        let tag = []
        let tagg = await parseMention(content)
        for (let i of tagg) {
            let con = await this.getContactById(i)
            tag.push(con)
        }
        return await this.sendMessage(chatId, content, { ...option, mentions: tag })
    }
    async sendText(chatId, text, option) {
        return await this.sendMessage(chatId, text, { ...option })
    }
    async sendSticker(chatId, content, pack, author, option = {}) {
        return await this.sendMessage(chatId, content, { ...option, sendMediaAsSticker: true, stickerName: pack, stickerAuthor: author })
    }
    async sendStickerFromUrl(chatId, url, pack, author, option = {}) {
        const media = await MessageMedia.fromUrl(url, { unsafeMime: true });
        return await this.sendMessage(chatId, media, { ...option, sendMediaAsSticker: true, stickerName: pack, stickerAuthor: author })
    }
    async sendFileFromUrl(chatId, url, option = {}, option1 = {}) {
        const media = await MessageMedia.fromUrl(url, { ...option1, unsafeMime: true });
        option1 ? option1.mimetype ? media.mimetype = option1.mimetype : {} : {}
        return await this.sendMessage(chatId, media, { ...option });
    };
    async sendFileFromBuffer(chatId, buffer, option = {}) {
        const media = await new MessageMedia(option.mimetype, await buffer.toString('base64'), option ? option.filename ? option.filename : '' : '')
        return await this.sendMessage(chatId, media, { ...option });
    };
    async sendFileFromPath(chatId, path, option = {}) {
        const media = await MessageMedia.fromFilePath(path, { unsafeMime: true })
        return await this.sendMessage(chatid, media, { ...option })
    }
}
export { Client }