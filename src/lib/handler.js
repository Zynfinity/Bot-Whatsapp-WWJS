const util = require('util')
const chalk = require('chalk')
const moment = require("moment-timezone");
async function handler(m, conn) {
    const prefix = '.'
    global.shp = '+'
    const tchat = await m.getChat()
    require('./function')(m, conn, tchat)
    const {
        _data,
        caption,
        mediaKey,
        id,
        ack,
        hasMedia,
        body,
        type,
        timestamp,
        from,
        to,
        author,
        deviceType,
        isForwarded,
        forwardingScore,
        isStatus,
        isStarred,
        broadcast,
        fromMe,
        hasQuotedMsg,
        duration,
        location,
        vCards,
        inviteV4,
        mentionedIds,
        orderId,
        token,
        isGif,
        isEphemeral,
        links,
        isUrl
    } = m
    const budy = (type === 'chat') ? body : (((type === 'image' || type === 'video') && body)) ? body : type === 'list_response' ? m.selectedRowId : ''
    const chats = type === 'list_response' ? m.selectedRowId : (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && body) && body.startsWith(prefix)) ? body : ''
    const command = chats.toLowerCase().split(" ")[0].slice(1) || ''
    const args = chats.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isOwner = owner.includes(tchat.isGroup ? m.author : m.from);
    // if (conn.mode == 'self' && !isOwner) return
    const admin = tchat.isGroup ? tchat.participants.filter(s => s.isAdmin).map(s => s.id._serialized) : {}
    const isAdmin = tchat.isGroup ? admin.includes(m.author) : false;
    const isBotAdmin = tchat.isGroup ? admin.includes(conn.info.wid._serialized) : false;
    const extra = {
        budy,
        body,
        q,
        text: q,
        command,
        conn,
        prefix
    }
    const mess = {
        wait: 'Tunggu sebentar, permintaan anda sedang diproses..',
        errorlink: 'Link tidak valid!!',
        error: 'command error, mohon lapor kepada owner dengan .bugreport <bugnya>!!',
        oversize: 'Size terlalu besar, Silahkan download menggunakan link diatas!',
        fail: {
            game: "Mode game tidak diaktifkan digroup ini\nKetik .game on utuk mengaktifkan!",
            owner: "Perintah ini hanya bisa dilakukan oleh Owner!",
            private: "Perintah ini hanya bisa dilakukan di private chat!",
            group: "Perintah ini hanya bisa dilakukan di group!",
            admin: "Perintah ini hanya bisa dilakukan oleh Admin Group!",
            botAdmin: "Jadikan bot admin terlebih dahulu!",
            disabled: "Fitur dinonaktifkan, Mungkin dikarenakan ada error\nSilahkan tunggu beberapa saat"
        }
    }
    if (budy.startsWith('<')) {
        if (!isOwner) return m.reply(mess.fail.owner)
        const ev = await eval(`(async () => { ${budy.slice(2)} })()`)
        await m.reply(await require("util").format(ev));
    }
    const cmd = await Object.values(commands).find(s => s.cmd.find(res => res == command))
    if (!cmd) return

    //check requirement
    const log = async (logg) => {
        if (conn.mode == 'self') {
            console.log(chalk.green(moment.tz("Asia/Jakarta").format("DD/MM/YY HH:mm:ss")) + " " + chalk.red("[ S E L F ]") + " " + chalk.cyanBright(m.type) + ": " + chalk.yellowBright(" from: " + m._data.notifyName) + " chat: " + chalk.greenBright(logg));
        } else console.log(chalk.green(moment.tz("Asia/Jakarta")
            .format("DD/MM/YY HH:mm:ss")) + " " + chalk.red("[ P U B L I C ]") + " " + chalk.cyanBright(m.type) + ": " + chalk.yellowBright(` from: ${m._data.notifyName} In ${tchat.isGroup ? tchat.name : 'Private Chat'}`) + " chat: " + chalk.greenBright(logg));
    }
    async function error(command, err, msg) {
        eror = `Fitur Error\n\n`
        eror += `+ command : ${command}\n\n`
        eror += `Error Log\n\n`
        eror += String(err)
        if (String(err).includes("Cannot read property 'data' of undefined")) return m.reply('no media found, please resend the media')
        if (String(err).includes("(reading 'mediaData')")) return m.reply('Error, silahkan kirim ulang media, lalu ulangi commandnya!')
        else m.reply(mess.error)
        conn.sendText(owner, eror, { quotedMessageId: msg.msgId });
    }
    async function sfail(m, p) {
        await m.reply(mess.fail[p]);
    };
    if (cmd.owner && !isOwner) return sfail(m, "owner");
    if (cmd.private && tchat.isGroup) return sfail(m, "private");
    if (cmd.group && !tchat.isGroup) return sfail(m, "group");
    if (cmd.admin && !isOwner && !isAdmin) return sfail(m, "admin");
    if (cmd.botAdmin && !isBotAdmin) return sfail(m, "botAdmin");
    if (cmd.q && !q) return m.reply(cmd.q)
    if (cmd.wait) m.reply(mess.wait)
    try {
        await log(command)
        await cmd.execute(m, extra)
    } catch (e) {
        error(command, e, m)
    }

}
module.exports = handler