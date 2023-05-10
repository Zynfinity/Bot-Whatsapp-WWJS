module.exports = {
    name: ['owner'],
    cmd: ['owner'],
    tag: 'other',
    desc: 'Get the owner of a bot',
    async execute(m, { conn }) {
        conn.getContactById(owner).then(con => conn.sendMessage(m.from, con, { quotedMessageId: m.msgId }))
    }
}