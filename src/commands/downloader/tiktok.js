import { tiktok } from '../../lib/module/tiktok.js'
import { parseResult } from '../../lib/module/tools.js'

export default {
    name: ['tiktok'],
    help: '[url]',
    cmd: ['tiktok', 'tt'],
    tag: 'downloader',
    wait: true,
    eparam: 'Masukkan link tiktok!',
    async execute(m, { conn, text }) {
        const tikdown = await tiktok(text)
        const { download } = tikdown
        if (tikdown.isSlide) {
            const to = download.image.length > 5 ? m.sender : m.from
            await m.reply(await parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }))
            download.image.map(res => conn.sendFileFromUrl(to, res, { quotedMessageId: m.msgId }))
            conn.sendFileFromUrl(to, download.music, { quotedMessageId: m.msgId })
            return
        }
        try {
            await conn.sendFileFromUrl(m.from, tikdown.download.nowm, { caption: await parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }), quotedMessageId: m.id._serialized }, { mimetype: 'video/mp4', filename: tikdown })
        } catch (e) {
            if (e.message == 'Evaluation failed: a') {
                console.log('oke')
                await conn.sendFileFromUrl(m.from, tikdown.download.nowm, { caption: await parseResult('Tiktok Downloader', tikdown, { delete: ['download'] }), quotedMessageId: m.id._serialized, sendMediaAsDocument: true }, { mimetype: 'video/mp4' })
            }
        }
    }
}