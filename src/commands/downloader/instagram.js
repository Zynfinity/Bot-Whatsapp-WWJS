import { igdl } from "../../lib/module/instagram.js"

export default {
    name: ['instagram'],
    help: '[url]',
    cmd: ['instagram', 'igdl', 'ig'],
    tag: 'downloader',
    desc: 'download media from instagram',
    eparam: 'Masukkan link Instagram!',
    url: {
        regex: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
    },
    wait: true,
    async execute(m, { conn, text }) {
        const igdown = await igdl(text)
        if (!igdown.status) return m.reply('Media tidak ditemukan!!')
        igdown.media.map(s => {
            conn.sendFileFromUrl(m.from, s, { quotedMessageId: m.msgId })
        })
    }
}