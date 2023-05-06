const util = require('util')

async function handler(m, conn) {
    const prefix = '.'
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
    const extra = {
        budy,
        body,
        q,
        text: q,
        command,
        conn,
        prefix
    }
    console.log({ m, budy, body, command, extra })
    if (budy.startsWith('<')) {
        const ev = await eval(`(async () => { ${budy.slice(2)} })()`)
        // console.log(ev)
        await m.reply(await require("util").format(ev));
    }
    const cmd = await Object.values(commands).find(s => s.cmd.find(res => res == command))
    console.log(cmd)
    if (!cmd) return
    try {
        await cmd.execute(m, extra)
    } catch (e) {
        m.reply(String(e))
    }

}
module.exports = handler