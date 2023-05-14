import { Client as _Client } from "whatsapp-web.js"
import Chat from "whatsapp-web.js/src/structures/Chat.js"
import wa from 'whatsapp-web.js'
const { MessageMedia } = wa
class Client extends _Client {
    constructor(...args) {
        super(...args)
    }
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

async function func(m, conn, zx) {
    m.quoted = {}
    m.isBot = m.id.id.startsWith('BAE5') && m.id.id.length == 16 || m.id.id.startsWith('3EB0') && m.id.id.length == 20 ? true : false
    m.quoted = { ...m._data.quotedMsg }
    m.quoted.isBot = m.hasQuotedMsg ? m._data.quotedStanzaID ? m._data.quotedStanzaID.startsWith('3EB0') && m._data.quotedStanzaID.length == 20 || m._data.quotedStanzaID.startsWith('BAE5') && m._data.quotedStanzaID.length == 16 ? true : false : false : false
    //m
    m.msgId = m.id._serialized
    m.sender = zx.isGroup ? m.author : m.from
    m.hasQuotedMsg ? m.quoted.sender = m._data.quotedParticipant : {}
    m.parseMention = async (text) => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@c.us')
    }
    m.download = async () => {
        const media = await m.downloadMedia()
        return media == undefined ? 'No media detected' : await Buffer.from(media.data, 'base64')
    }
    m.quoted.download = async () => {
        const quot = await m.getQuotedMessage()
        const media = await quot.downloadMedia()
        return media == undefined ? 'No media detected' : await Buffer.from(media.data, 'base64')
    }
    m.quoted.forward = async (to) => {
        const quot = await m.getQuotedMessage()
        if (quot == undefined) return ({ status: false, message: 'No msg found!' })
        const send = await quot.forward(to ? to : m.from)
    }
    m.quoted.delete = async () => {
        const quot = await m.getQuotedMessage()
        if (quot == undefined) return ({ status: false, message: 'No msg found!' })
        const send = await quot.delete(true)
    }
    //m.hasQuotedMsg ? delete m._data.quotedMsg : {}
}
export { Client, func }