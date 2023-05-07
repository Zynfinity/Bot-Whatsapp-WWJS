const { search, download } = require("../../lib/module/spotify");
const { parseResult } = require("../../lib/module/tools");

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
        const spotifyDl = await download(res.track)
        if (spotifyDl.status == 404) return m.reply('Lagu tidak ditemukan!')
        await conn.sendFileFromUrl(m.from, res.thumbnail, { caption: await parseResult("SPOTIFY PLAY", res, { delete: ["thumbnail"] }), quotedMessageId: m.msgId });
        await conn.sendFileFromUrl(m.from, spotifyDl.link, { quotedMessageId: m.msgId })
    }
}