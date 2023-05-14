import axios from "axios"
import cheerio from "cheerio"
import FormData from "form-data"
const igcookie = 'sessionid=8779859677%3AUaV5a1QTp8fjry%3A10%3AAYc4YKUPDgnbMjYLrgK5MUefPWp2voPSS9i6_fYizA'
async function igstalk(user) {
    try {
        const { data } = await axios.get('https://i.instagram.com/api/v1/users/web_profile_info/?username=' + user, {
            headers: {
                "cookie": igcookie,
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
                "x-asbd-id": "198387",
                "x-csrftoken": "VXLPx1sgRb8OCHg9c2NKXbfDndz913Yp",
                "x-ig-app-id": "936619743392459",
                "x-ig-www-claim": "0"
            }
        })
        return (data.status == 'ok' ? {
            status: true,
            profile: {
                low: data.data.user.profile_pic_url,
                high: data.data.user.profile_pic_url_hd,
            },
            data: {
                url: data.data.user.external_url,
                id: data.data.user.id,
                username: data.data.user.username,
                fullname: data.data.user.full_name,
                private: data.data.user.is_private,
                verified: data.data.user.is_verified,
                follower: data.data.user.edge_followed_by.count,
                following: data.data.user.edge_follow.count,
                bio: data.data.user.biography,
                videotimeline: data.data.user.edge_felix_video_timeline.count,
                timeline: data.data.user.edge_owner_to_timeline_media.count,
                savedmedia: data.data.user.edge_saved_media.count,
                collections: data.data.user.edge_media_collections.count,
            }
        } : { status: false, message: 'user not found' })
    } catch {
        return ({
            status: false,
            message: 'user not found'
        })
    }
}
async function igstory(user) {
    try {
        const userdata = await igstalk(user)
        if (!userdata.status) return ({
            status: false,
            message: 'user not found'
        })
        const {
            data
        } = await axios.get(`https://i.instagram.com/api/v1/feed/user/${userdata.data.id}/story/`, {
            headers: {
                "cookie": igcookie,
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
                "x-asbd-id": "198387",
                "x-csrftoken": "vJyxo3C9tfh4z8iz2TfcgLTgulUzZXH4",
                "x-ig-app-id": "936619743392459",
                "x-ig-www-claim": "hmac.AR2FJkaomBTRzBeE8IgIprjawqKtAkzHlrs_RzUvMkxQ9q1h"
            }
        })
        const url = []
        if (!data.reel) return ({ status: false, message: 'story not found!' })
        for (let i of data.reel.items) {
            if (i.video_duration == 5 || i.video_duration == undefined) url.push({
                type: 'image',
                url: i.image_versions2.candidates[0].url
            })
            else url.push({
                type: 'video',
                url: i.video_versions[0].url
            })
        }
        const result = {
            status: true,
            user: data.reel.user,
            story: url
        }
        return result
    } catch (e) {
        return ({
            status: false,
            message: 'user not found'
        })
    }
}
async function igdl(url) {
    const form = new FormData()
    form.append('page', url)
    form.append('ftype', 'all')
    form.append('ajax', 1)
    const { data, status } = await axios.post(`https://instagrab.app/?`, form)
    const $ = cheerio.load(data)
    const result = {
        status: true,
        media: []
    }
    $('div.results').find('div.card-deck > div').each(function () {
        let link = $('div.card-body > a:nth-child(2)').attr('href')
        result.media.push(link ? link : $('div.card-body > a').attr('href'))
    })
    if (result.media.length == 0) {
        result.status = false
        result.message = 'Media not found'
    }
    return result
}
export {
    igstalk,
    igstory,
    igdl
}