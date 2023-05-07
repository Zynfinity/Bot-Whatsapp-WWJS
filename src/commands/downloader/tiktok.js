const { tiktok } = require("../../lib/module/downloader")
const tools = require("../../lib/module/tools")

module.exports = {
    name: ['tiktok'],
    help: '<url>',
    cmd: ['tiktok', 'tt'],
    tag: 'downloader',
    wait: true,
    q: 'Masukkan link tiktok!',
    async execute(m, { conn, text }) {
        const tikdown = await tiktok(text)
        if (tikdown.isSlide) {
            await m.reply(await tools.parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }))
            tikdown.download.map(res => conn.sendFileFromUrl(tikdown.download.length > 5 ? m.sender : m.from, res, { quotedMessageId: m.msgId }))
            return
        }
        await conn.sendFileFromUrl(m.from, tikdown.download.nowm, { caption: await tools.parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }), quotedMessageId: m.id._serialized }, { mimetype: 'video/mp4' })
    }
}