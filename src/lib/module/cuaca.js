import axios from "axios";
import cheerio from "cheerio";

async function cuaca(place, lang = 'id') {
    var { request, data } = await axios.get(`https://www.accuweather.com/id/search-locations?query=${place}`);
    let plink = request.res.responseUrl.replace("/en/", `/${lang}/`).replace("weather-forecast", "current-weather");
    var $ = cheerio.load(data);
    if ($("body").find("div.locations-list.content-module > a:nth-child(1)").attr("href") != undefined) {
        var { request, data } = await axios.get("https://www.accuweather.com" + $("body").find("div.locations-list.content-module > a:nth-child(1)").attr("href"));
        plink = request.res.responseUrl.replace("/en/", `/${lang}/`).replace("weather-forecast", "current-weather");
    }
    var { data } = await axios.get(plink);
    var $ = cheerio.load(data);
    const result = {
        tempat: $("body").find("a.header-city-link > h1").text(),
        suhu: $("body").find("div.display-temp").text().trim(),
        deskripsi: $("body").find("div.current-weather > div.phrase").text(),
    }
    $("body").find("div.current-weather-details.no-realfeel-phrase > div").each(function (a, b) {
        let json = $(b).find("div:nth-child(1)").text().toLowerCase().replace(/ /g, '_').replace('realfeel®', 'realfeel')
        if (json != 'realfeel_shade™') result[json] = $(b).find("div:nth-child(2)").text();
    });
    return result.suhu != '' ? {
        status: true,
        ...result,
    } : {
        status: false,
        message: "Tempat tidak ditemukan!",
    };
};

export default cuaca