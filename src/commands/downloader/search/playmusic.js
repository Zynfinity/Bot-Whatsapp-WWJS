import yts from "yt-search"
import yt1s from "../../../lib/module/youtube.js"

export default {
    name: ['music'],
    help: '[kata kunci]',
    cmd: ['music', 'play'],
    tag: 'search',
    desc: 'Search and download music from youtube',
    eparam: 'Masukkan kata kunci!',
    wait: true,
    async execute(m, { conn, text }) {
        const { title, author, url, image } = (await yts(text)).all.filter(rs => rs.type == 'video')[0]
        const caption = `${title}\n\nSource : ${url}`
        const { status, dlink } = await yt1s(url, 'mp3')
        if (!status) return m.reply('Music tidak ditemukan!')
        await conn.sendFileFromUrl(m.from, image, { caption: caption, quotedMessageId: m.msgId })
        await conn.sendFileFromUrl(m.from, dlink, { quotedMessageId: m.msgId })
    }
}