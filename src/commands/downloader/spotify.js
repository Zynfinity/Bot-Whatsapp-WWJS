const { MessageMedia } = import('whatsapp-web.js')
import { search, download } from "../../lib/module/spotify.js";
import { parseResult } from "../../lib/module/tools.js";
import axios from "axios";
export default {
    name: ['spotify'],
    help: '[query/url]',
    cmd: ['spotify'],
    tag: 'downloader',
    eparam: 'Masukkan kata kunci / Link spotify!',
    desc: 'Mencari / mendownload lagu dari spotify',
    wait: true,
    async execute(m, { conn, text }) {
        const spotifySearch = await search(text)
        if (!spotifySearch.status) return m.reply('Lagu tidak ditemukan!')
        let res = spotifySearch.result[0];
        res.artist = res.artist[0].name;
        const spotifyDl = await download(res.track)
        if (spotifyDl.status == 404) return m.reply('Lagu tidak ditemukan!')
        await conn.sendFileFromUrl(m.from, res.thumbnail, { caption: await parseResult("SPOTIFY PLAY", res, { delete: ["thumbnail"] }), quotedMessageId: m.msgId });
        // await m.reply(audio)
        await conn.sendFileFromUrl(m.from, spotifyDl.link, { quotedMessageId: m.msgId })
    }
}