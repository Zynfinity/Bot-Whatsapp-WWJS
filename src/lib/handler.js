const util = require('util')

async function handler(client, m) {
    const prefix = '.'
    const budy = m.type == 'chat' ? m.body : m.caption || ''
    const body = budy.startsWith(prefix) ? budy : ''
    const command = body.slice(1) || ''
    m.reply = async (text) => {
        if (typeof text == 'string') return await client.reply(m.from, text, m.id)
        else {
            ren = JSON.stringify(text, null, 2)
            pes = util.format(ren)
            return await client.reply(m.from, pes, m.id)
        }
    }
    console.log({ m, budy, body, command })
    if (budy.startsWith('<')) {
        await client.reply(
            m.from,
            await require("util").format(eval(`(async () => { ${budy.slice(2)} })()`)),
            m.id.toString()
        );
    }
    const cmd = await Object.values(commands).find(s => s.cmd.find(res => res == command))
    if (!cmd) return
    await cmd.execute(m, { client })

}
module.exports = handler