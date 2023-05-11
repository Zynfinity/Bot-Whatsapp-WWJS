import util from 'util'
import fs from 'fs'
const ctwa = {
    "ctwaContext": {
        "sourceUrl": "https://chat.whatsapp.com/CGMJD56YU2w4v1q5kvuyKg",
        "description": "IXX",
        "title": "Simple Whatsapp Bot",
        'thumbnail': fs.readFileSync('./src/media/thumb.png').toString('base64')
    }
}
async function func(m, conn, zx) {
    m.quoted = {}
    m.isBot = m.id.id.startsWith('BAE5') && m.id.id.length == 16 || m.id.id.startsWith('3EB0') && m.id.id.length == 20 ? true : false
    m.quoted = { ...m._data.quotedMsg }
    m.quoted.isBot = m.hasQuotedMsg ? m._data.quotedStanzaID ? m._data.quotedStanzaID.startsWith('3EB0') && m._data.quotedStanzaID.length == 20 || m._data.quotedStanzaID.startsWith('BAE5') && m._data.quotedStanzaID.length == 16 ? true : false : false : false
    //m
    m.isUrl = (url) => {
        return url.match(
            new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
                "gi"
            )
        );
    };
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
export default func