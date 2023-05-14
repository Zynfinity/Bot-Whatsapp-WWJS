import cuaca from "../../lib/module/cuaca.js"
import { parseResult } from "../../lib/module/tools.js"

export default {
    name: ['cuaca'],
    help: '[tempat]',
    cmd: ['cuaca', 'weather'],
    tag: 'information',
    desc: 'Menampilkan cuaca di <tempat>',
    eparam: 'Masukkan nama daerah!',
    wait: true,
    async execute(m, { text }) {
        const weather = await cuaca(text)
        m.reply(await parseResult('INFO CUACA', weather))
    }
}