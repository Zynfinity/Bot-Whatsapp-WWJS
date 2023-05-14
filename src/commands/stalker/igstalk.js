import { igstalk } from "../../lib/module/instagram.js"
import { parseResult } from "../../lib/module/tools.js"

export default {
    name: ['igstalk'],
    help: '[Username]',
    cmd: ['igstalk', 'instagramstalk'],
    tag: 'stalker',
    desc: 'Stalks instagram accounts',
    eparam: 'Masukkan username instagram!',
    wait: true,
    async execute(m, { conn, text }) {
        const { profile, data } = await igstalk(text)
        const caption = await parseResult('INSTAGRAM STALK', data)
        await conn.sendFileFromUrl(m.from, profile.high, { caption: caption, quotedMessageId: m.msgId })
    }

}