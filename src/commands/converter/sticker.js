module.exports = {
    name: ['sticker'],
    help: '<reply/send image>',
    cmd: ['sticker', 's', 'stiker'],
    tag: 'convert',
    desc: 'Mengubah gambar menjadi stiker',
    async execute(m, { conn, hasMedia, command }) {
        const { stickerMetadata } = config
        const { quoted, type } = m
        if (hasMedia && type == 'image' || hasMedia && type == 'video') {
            const media = await m.downloadMedia()
            await conn.sendSticker(m.from, media, stickerMetadata.stickerName, stickerMetadata.stickerAuthor, { quotedMessageId: m.msgId })
        }
        else if (quoted && quoted.type == 'image' || quoted && quoted.type == 'video') {
            const quot = await m.getQuotedMessage()
            const media = await quot.downloadMedia()
            await conn.sendSticker(m.from, media, stickerMetadata.stickerName, stickerMetadata.stickerAuthor, { quotedMessageId: m.msgId })
        }
        else m.reply(`reply/send image dengan caption .${command}`)

    }
}