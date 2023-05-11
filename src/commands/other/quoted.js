export default {
    name: ['q'],
    help: '<reply chat>',
    cmd: ['q'],
    tag: 'other',
    async execute(m, { conn }) {
        if (!m.hasQuotedMsg) return await m.reply('reply pesannya!')
        quot = await m.getQuotedMessage()
        quott = await quot.getQuotedMessage()
        if (quott == undefined) return m.reply('Pesan tidak mengandung reply!')
        await quott.forward(m.from)
    }
}