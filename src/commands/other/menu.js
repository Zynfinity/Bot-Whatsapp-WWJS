module.exports = {
    name: 'menu',
    cmd: ['menu'],
    async execute(m, { client }) {
        client.reply(m.from, 'Gaada menu2', m.id)
    }
}