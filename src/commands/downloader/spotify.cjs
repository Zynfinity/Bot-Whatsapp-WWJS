const { MessageMedia } = require("whatsapp-web.js");
const { search, download } = require("../../lib/module/spotify.cjs");
const { parseResult } = require("../../lib/module/tools.cjs");
const { default: axios } = require("axios");
module.exports = {
    name: ['spotify'],
    help: '<query/link>',
    cmd: ['spotify'],
    tag: 'downloader',
    q: 'Masukkan kata kunci / Link spotify!',
    desc: 'Mencari / mendownload lagu dari spotify',
    wait: true,
    async execute(m, { conn, text }) {
        const spotifySearch = await search(text)
        if (!spotifySearch.status) return m.reply('Lagu tidak ditemukan!')
        let res = spotifySearch.result[0];
        res.artist = res.artist[0].name;
        const { data } = await axios.get(`https://web-production-6856.up.railway.app/download?url=${res.track}`)

        if (!data.status) return m.reply('Lagu tidak ditemukan!')
        const audio = await new MessageMedia('audio/mp3', data.base64, 'audio.mp3')
        await conn.sendFileFromUrl(m.from, res.thumbnail, { caption: await parseResult("SPOTIFY PLAY", res, { delete: ["thumbnail"] }), quotedMessageId: m.msgId });
        await m.reply(audio)
    }
}