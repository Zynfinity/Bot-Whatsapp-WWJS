import google from '../../../lib/module/google.js'
import { parseResult } from '../../../lib/module/tools.js'
export default {
    name: ['google'],
    help: '[Query]',
    cmd: ['google'],
    tag: 'search',
    desc: 'Search information in Google!',
    eparam: 'Masukkan Query!',
    wait: true,
    async execute(m, { conn, text }) {
        const search = await google(text)
        console.log(search)
        if (!search.status) return m.reply('Tidak ditemukan!')
        const teks = await parseResult('GOOGLE SEARCH', search.result)
        m.reply(teks)
    }
}