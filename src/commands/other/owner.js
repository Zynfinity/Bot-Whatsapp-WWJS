module.exports = {
    name: 'owner',
    cmd: ['owner'],
    desc: 'Get the owner of a bot',
    async execute(m, { client }) {
        client.sendContactVcard(m.from, '6289506883380@c.us', 'Zynfinity').then(res => {
            client.reply(m.from, 'Ini kontak Owner saya><', res.id)
        })
    }
}