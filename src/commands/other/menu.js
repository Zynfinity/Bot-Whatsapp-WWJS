module.exports = {
    name: ['menu'],
    cmd: ['menu'],
    tag: 'other',
    async execute(m, { conn }) {
        let teks = 'Simple Whatsapp-Bot\n'
        teks += `WAJS Version  :  ${await conn.getWWebVersion()}\n\n`
        // teks += 'Library  :  Wpp-Connect\n\n'

        let cmds = Object.values(commands)
        const sort_tag = cmds.map((mek) => mek.tag).sort()
        const tag_data = new Set(sort_tag);
        const tags = [...tag_data];
        for (let tag of tags) {
            let cmdName = []
            let plugin = cmds.filter(res => res.tag == tag)
            teks += `+ ${tag.toUpperCase()}\n`
            plugin.map(res => res.name.map(rs => cmdName.push(rs + ` ${res.help ? res.help : ''}`)))
            await cmdName.sort(function (a, b) {
                return a.length - b.length;
            });
            cmdName.map(cmd => teks += `    - ${cmd}\n`)
            teks += '\n'
        }
        m.reply(teks)
    }
}