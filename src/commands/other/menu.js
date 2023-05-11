export default {
    name: ['menu'],
    cmd: ['menu', 'help'],
    tag: 'other',
    hidden: true,
    async execute(m, { conn, command, text }) {
        if (command == 'menu') {
            let teks = 'Simple Whatsapp-Bot\n'
            teks += `WWJS Version  :  ${await conn.getWWebVersion()}\n\n`

            let cmds = Object.values(commands)
            const sort_tag = cmds.map((mek) => mek.tag).sort()
            const tag_data = new Set(sort_tag);
            const tags = [...tag_data];
            for (let tag of tags) {
                let cmdName = []
                let plugin = cmds.filter(res => res.tag == tag && !res.hidden)
                teks += `+ ${tag.toUpperCase()}\n`
                plugin.map(res => res.name.map(rs => cmdName.push(rs + ` ${res.help ? res.help : ''}`)))
                await cmdName.sort(function (a, b) {
                    return a.length - b.length;
                });
                cmdName.map(cmd => teks += `    - ${cmd}\n`)
                teks += '\n'
            }
            teks += `\n_*Note : Ketik .help <command> untuk melihat info command_\n_Berikan jeda 5 detik dalam memakai bot_`
            // m.reply(teks)
            let fek = await conn.ctwa()
            fek.isForwarded = true
            await conn.sendMessage(m.from, teks, {
                quotedMessageId: m.msgId,
                extra: fek
            })
            return
        }
        if (!text) return m.reply('Masukkan nama command!')
        const cmd = await Object.values(commands).find(s => s.cmd.find(res => res == text))
        if (!cmd) return m.reply('Command tidak ditemukan!')
        let helpt = '*Helper*\n'
        helpt += `${shp} Name : ${cmd.name}\n`
        helpt += `${shp} Alias : ${cmd.cmd.join(', ')}\n`
        helpt += `${shp} Category : ${cmd.tag}\n\n`
        helpt += '*Command Atribute*\n'
        helpt += `${shp} isOwner : ${cmd.owner ? '✅' : '❌'}\n`
        helpt += `${shp} isAdmin : ${cmd.admin ? '✅' : '❌'}\n`
        helpt += `${shp} isBotAdmin : ${cmd.botAdmin ? '✅' : '❌'}\n`
        helpt += `${shp} isPrivate : ${cmd.private ? '✅' : '❌'}\n`
        helpt += `${shp} isGroup : ${cmd.group ? '✅' : '❌'}\n`
        helpt += '\n*Command Description*\n'
        helpt += `${shp} ${cmd.desc ? cmd.desc : 'None'}`
        m.reply(helpt)
    }
}