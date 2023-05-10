const { tiktok } = require("../../lib/module/downloader.cjs")
const tools = require("../../lib/module/tools.cjs")

module.exports = {
    name: ['tiktok'],
    help: '<url>',
    cmd: ['tiktok', 'tt'],
    tag: 'downloader',
    wait: true,
    q: 'Masukkan link tiktok!',
    async execute(m, { conn, text }) {
        const tikdown = await tiktok(text)
        const { download } = tikdown
        const to = download.image.length > 5 ? m.sender : m.from
        if (tikdown.isSlide) {
            await m.reply(await tools.parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }))
            download.image.map(res => conn.sendFileFromUrl(to, res, { quotedMessageId: m.msgId }))
            conn.sendFileFromUrl(to, download.music, { quotedMessageId: m.msgId })
            return
        }
        await conn.sendFileFromUrl(m.from, tikdown.download.nowm, { caption: await tools.parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }), quotedMessageId: m.id._serialized }, { mimetype: 'video/mp4' })
    }
}