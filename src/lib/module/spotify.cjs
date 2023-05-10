const Spotify = require('spotify-finder')
const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data');
const client = new Spotify({
    consumer: {
        key: '271f6e790fb943cdb34679a4adcc34cc', // from v2.1.0 is required
        secret: 'c009525564304209b7d8b705c28fd294' // from v2.1.0 is required
    }
})
async function download(url) {
    try {
        const form = new FormData()
        form.append('url', url)
        console.log(await form.getHeaders())
        const { data, status } = await axios.post('https://spotifymate.com/action', form)
        if (data == 'error_url') {
            return ({
                status: 404,
                message: '[SpotifyMate] Invalid URL'
            })
        }
        const $ = cheerio.load(data)
        const id = $('div.row.dlvideos').find('div.spotifymate-downloader-right.is-desktop-only > div:nth-child(1) > a').attr('href').split('url=')[1]
        const result = {
            status,
            title: $('div.row.dlvideos').find('div.spotifymate-downloader-middle.text-center > div > h3').text().trim(),
            artist: $('div.row.dlvideos').find('div.spotifymate-downloader-middle.text-center > p > span').text(),
            cover: `https://spotifymate.com/dl?url=${id}&type=photo`,
            link: `https://spotifymate.com/dl?url=${id}`,
        }
        return result
    } catch (e) {
        console.log(e)
    }
}
async function search(query) {
    data = await client.search({
        q: query,
        type: 'track',
        limit: 10
    })
    peta = data.tracks.items
    artis = []
    const result = []
    if (peta == undefined) return ({ status: false, message: 'Song not found!' })
    /*peta.artists.map(s => {
        artis.push({
            name: s.name,
            url: s.external_urls.spotify
        })
    })*/
    for (let i of peta) {
        result.push({
            judul: i.name,
            artist: i.artists,
            album: i.album.name,
            release_date: i.album.release_date,
            popularity: i.popularity,
            track: i.external_urls.spotify,
            thumbnail: i.album.images[0].url
        })
    }
    return (result != '' ? {
        status: true,
        result: result
    } : { status: false, message: 'Song Not Found' })
}
module.exports = { search, download }