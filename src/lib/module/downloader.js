import axios from "axios";
import cheerio from "cheerio";

async function tiktok(url) {
    const base = await axios.get('https://ttsave.app/download-tiktok-slide')
    const key = base.data.split('https://ttsave.app/download?mode=slide&key=')[1].split(`',`)[0]
    try {
        const { data, status } = await axios.post(`https://ttsave.app/download?mode=slide&key=${key}`, {
            id: url
        })
        const $ = cheerio.load(data)
        const result = {
            status,
            name: $('div > div > h2').text().trim(),
            playCount: $('div').find('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 > div:nth-child(1) > span').text(),
            likeCount: $('div').find('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 > div:nth-child(2) > span').text(),
            commentCount: $('div').find('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 > div:nth-child(3) > span').text(),
            shareCount: $('div').find('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 > div:nth-child(4) > span').text(),
            isSlide: $('div').text().includes('WITH WATERMARK') ? false : true
        }
        if (result.isSlide) {
            result.download = {
                music: `https://sf16-ies-music.tiktokcdn.com/obj/ies-music-aiso/${$('div').find('#unique-id').attr('value').split('-')[1]}.mp3`,
                image: []
            }
            $('#button-download-ready > a').each(function () {
                result.download.image.push($(this).attr('href'))
            })
        } else {
            result.download = {
                wm: $('#button-download-ready > a:nth-child(2)').attr('href'),
                nowm: $('#button-download-ready > a:nth-child(1)').attr('href'),
                music: $('#button-download-ready > a:nth-child(3)').attr('href')
            }
        }
        return (result)
    } catch (e) {
        console.log(e)
        if (e.response.status == 404) return ({ status: e.response.status, message: 'Video not found!' })
    }
}
export { tiktok }