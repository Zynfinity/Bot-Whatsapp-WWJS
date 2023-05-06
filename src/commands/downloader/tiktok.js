const { tiktok } = require("../../lib/module/downloader")

module.exports = {
    name: ['tiktok'],
    help: '<url>',
    cmd: ['tiktok'],
    tag: 'downloader',
    wait: true,
    async execute(m, { conn, text }) {
        const tikdown = await tiktok(text)
        // console.log(tikdown)
        await m.reply(tikdown)
        await conn.sendFileFromUrl(m.from, tikdown.download.nowm, { caption: tikdown.name, quotedMessageId: m.id._serialized }, { mimetype: 'video/mp4' })
    }
}