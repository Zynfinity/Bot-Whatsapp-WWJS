import axios from "axios";
import cheerio from 'cheerio'

async function yt1s(url, type, quality = '360p') {
    const { data } = await axios.request("https://yt1s.com/api/ajaxSearch/index", {
        method: "post",
        data: new URLSearchParams(
            Object.entries({
                q: url,
                vt: "home",
            })
        ),
        headers: {
            "cookie": "_ga=GA1.2.1497648114.1652002131; _gat_gtag_UA_173445049_1=1; _gid=GA1.2.969868327.1652002131; __atuvc=1|19; __atuvs=62778d5c4fade304000; prefetchAd_3897490=true",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
        },
    });
    if (data.mess.includes("Invalid"))
        return {
            creator: "@ihsanafajar",
            ...data,
            status: false,
        };
    const getk = type == "mp3" ? Object.values(data.links.mp3)[0] : Object.values(data.links.mp4).find((mp) => mp.q == quality);
    if (getk == null)
        return {
            status: false,
            message: `${quality} not available`,
        };
    const getlink = await axios.request("https://yt1s.com/api/ajaxConvert/convert", {
        method: "post",
        data: new URLSearchParams(
            Object.entries({
                vid: data.vid,
                k: getk.k,
            })
        ),
    });
    return {
        creator: "@ihsanafajar",
        ...getlink.data,
        size: getk.size,
        status: true,
        thumbnail: `https://i.ytimg.com/vi/${data.vid}/0.jpg`,
    };
};

export default yt1s