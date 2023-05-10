const { MessageMedia } = require('whatsapp-web.js')
module.exports = {
    name: ['snap'],
    cmd: ['snap', 'ss'],
    tag: 'other',
    hidden: true,
    owner: true,
    async execute(m, { conn }) {
        const pages = await conn.pupBrowser.pages();
        const page = pages[0];
        // await page.setViewport({ width: 1920, height: 1080 });
        const screenshot = await page.screenshot({ fullPage: true });
        const media = await new MessageMedia(
            "image/png",
            screenshot.toString("base64"),
            "screenshot.png"
        );
        m.reply(media)
    }
}