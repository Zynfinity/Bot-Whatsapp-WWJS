export default {
    name: ['sticker'],
    help: '[reply/send image]',
    cmd: ['sticker', 's', 'stiker'],
    tag: 'convert',
    desc: 'Mengubah gambar menjadi stiker',
    async execute(m, { conn, command, text }) {
        const { stickerMetadata } = config
        let packName;
        let authorName;
        if (text) {
            packName = text.split('|')[0] ? text.split('|')[0] : ''
            authorName = text.split('|')[1] ? text.split('|')[1] : ''
        } else {
            packName = stickerMetadata.stickerName
            authorName = stickerMetadata.stickerAuthor
        }
        const { quoted, type, hasMedia } = m
        if (hasMedia && type == 'image' || hasMedia && type == 'video') {
            const media = await m.downloadMedia()
            await conn.sendSticker(m.from, media, packName, authorName, { quotedMessageId: m.msgId })
        }
        else if (quoted && quoted.type == 'image' || quoted && quoted.type == 'video') {
            const quot = await m.getQuotedMessage()
            const media = await quot.downloadMedia()
            await conn.sendSticker(m.from, media, packName, authorName, { quotedMessageId: m.msgId })
        }
        else m.reply(`reply/send image dengan caption .${command}`)

    }
}