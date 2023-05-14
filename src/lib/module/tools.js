import axios from "axios";
import fetch from "node-fetch";
import { JSDOM } from 'jsdom';
import FormData from 'form-data';
import fs from 'fs';
const { fromBuffer } = import('file-type')

async function kapitalisasiKata(str) {
    return str.replace(/\w\S*/g, function (kata) {
        const kataBaru = kata.slice(0, 1).toUpperCase() + kata.substr(1);
        return kataBaru
    });
}
async function webp2mp4(source) {
    let form = new FormData
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
    form.append('new-image-url', isUrl ? source : '')
    form.append('new-image', isUrl ? '' : source, 'image.webp')
    let res = await fetch('https://ezgif.com/webp-to-mp4', {
        method: 'POST',
        body: form
    })
    let html = await res.text()
    let { document } = new JSDOM(html).window
    let form2 = new FormData
    let obj = {}
    for (let input of document.querySelectorAll('form input[name]')) {
        obj[input.name] = input.value
        form2.append(input.name, input.value)
    }
    let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
        method: 'POST',
        body: form2
    })
    let html2 = await res2.text()
    let { document: document2 } = new JSDOM(html2).window
    return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function formatRupiah(angka, prefix) {
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}
async function parseResult(title, content, option) {
    const json = JSON.parse(JSON.stringify(content));
    if (Array.isArray(json)) {
        var txt = `- _*${title}*_\n\n${global.shp}\n`
        for (let i = 0; i < json.length; i++) {
            if (option && option.delete) {
                for (let j of option.delete) {
                    delete json[i][j]
                }
            }
            for (let j of Object.entries(json[i])) {
                if (j[1] != undefined && j[1] != null && j[1] != '') {
                    txt += `${global.shp} *${await kapitalisasiKata(j[0].replace(/_/g, ' '))}* : ${j[1]}\n`
                }
            }
            if (i + 1 != json.length) txt += `\n${global.shp}\n`
        }
        txt += `\n-`
    }
    else {
        var txt = `- _*${title}*_\n\n`
        if (option && option.delete) {
            for (let j of option.delete) {
                delete json[j]
            }
        }
        for (let i of Object.entries(json)) {
            if (i[1] != undefined && i[1] != null && i[1] != '') {
                txt += `${global.shp} *${await kapitalisasiKata(i[0].replace(/_/g, ' '))}* : ${i[1]}\n`
            }
        }
        txt += `\n-`
    }
    return txt
}
async function toTimer(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s
    }
    var hours = Math.floor(seconds / (60 * 60))
    var minutes = Math.floor((seconds % (60 * 60)) / 60)
    var seconds = Math.floor(seconds % 60)
    //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
    return `${pad(hours)} Jam - ${pad(minutes)} Menit - ${pad(seconds)} Detik`
}
async function tiny(link) {
    return new Promise((resolve) => {
        axios.get(`https://tinyurl.com/api-create.php?url=${link}`).then(res => {
            resolve(res.data)
        })
    })
}
async function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext ? ext : ''}`
}
async function telegraph(buffer) {
    const {
        ext
    } = await fromBuffer(buffer)
    let form = new FormData
    form.append('file', buffer, 'tmp.' + ext)
    let res = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: form
    })
    let img = await res.json()
    if (img.error) throw img.error
    return 'https://telegra.ph' + img[0].src
}
async function fileIO(buffer) {
    const {
        ext
    } = await fromBuffer(buffer) || {}
    let form = new FormData
    form.append('file', buffer, 'tmp.' + ext)
    let res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
        method: 'POST',
        body: form
    })
    let json = await res.json()
    if (!json.success) throw json
    return json.link
}
async function getBuffer(url, options) {
    try {
        options ? options : {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`)
    }
}
// const tools = {
//     getBuffer,
//     fileIO,
//     parseResult,
//     toTimer,
//     getRandom,
//     kapitalisasiKata,
//     telegraph,
//     webp2mp4,
//     sleep,
//     tiny,
//     formatRupiah
// }
// export default tools
export {
    getBuffer,
    fileIO,
    parseResult,
    toTimer,
    getRandom,
    kapitalisasiKata,
    telegraph,
    webp2mp4,
    sleep,
    tiny,
    formatRupiah
}