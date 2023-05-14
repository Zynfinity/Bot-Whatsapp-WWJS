import cheerio from 'cheerio';
import got from 'got';

async function google(query, lang = 'id') {
    const body = await got('https://www.google.co.id/search', {
        searchParams: {
            q: query,
            lr: `lang_${lang}`
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
    }).text()
    const $ = cheerio.load(body)
    const result = []
    $('div.tF2Cxc').each(function () {
        const el = $(this)
        const title = el.find('div.yuRUbf > a > h3').text()
        const url = el.find('div.yuRUbf > a[href]').attr('href')
        const description = el.find('div.VwiC3b > span').text() || el.find('div.VwiC3b').text()
        if (el.length && url) {
            result.push({
                title: title,
                url,
                description: description
            })
        }
    })
    return result != '' ? {
        status: true,
        result
    } : {
        status: false,
        message: 'not found'
    }
}
export default google