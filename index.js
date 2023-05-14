import wa from 'whatsapp-web.js';
const { LocalAuth } = wa;
import { Client } from './src/lib/whatsapp/serialize.js'
import chokidar from 'chokidar';
import syntaxerror from "syntax-error";
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { platform } from 'os';
import handler from './src/lib/handler.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
global.config = JSON.parse(fs.readFileSync('./config.json'));

global.commands = {}

async function start() {
  console.log('Welcome To Simple Whatsapp-Bot')
  console.log('Please wait, Starting Bot...')
  const worker = `./session_data/session/Default/Service Worker`;
  if (fs.existsSync(worker)) {
    fs.rmSync(worker, { recursive: true });
  }
  const client = await new Client({
    authStrategy: new LocalAuth({
      dataPath: `./session_data`
    }),
    puppeteer: {
      headless: true,
      executablePath: platform() == 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable',
      args: [
        '--no-sandbox',
        '--disable-gpu-sandbox',
        '--disable-dev-shm-usage',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
      exitOnPageError: false,
    }
  });
  client.initialize()
  client.on('change_state', msg => console.log(msg))
  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {
      small: true
    }, function (qrcode) {
      console.log(qrcode)
    });
    console.log('Scan Qr Code');
  });
  client.on('ready', async () => {
    console.log('Bot is ready!');
    console.log('Whatsapp-Web Version : ' + await client.getWWebVersion())
    client.sendMessage(config.owner, JSON.stringify(client.info, null, 2))
  });
  client.on('message', async msg => {
    await handler(msg, client)
  });
}

// reload
var watcher = chokidar.watch('./src/commands', { ignored: /^\./, persistent: true });
watcher
  .on('error', function (error) { console.error('Error happened', error); })
  .on('add', async function (pathh) {
    const path = pathh.split(pathh.includes('/') ? '/' : "\\")
    const file = path[path.length - 1]
    console.log({ file, pathh })
    global.commands[file] = (await import('./' + pathh)).default
  })
  .on('change', async function (pathh) {
    const reload = (await import(`./${pathh}?update=${Date.now()}`)).default
    const path = pathh.split(pathh.includes('/') ? '/' : "\\")
    const file = path[path.length - 1]
    console.log(`${file} Updated`)
    global.commands[file] = reload
  })
  .on('unlink', function (pathh) {
    const path = pathh.split(pathh.includes('/') ? '/' : "\\")
    const file = path[path.length - 1]
    console.log(`deleted plugin ${file}`)
    delete global.commands[file]
  })

start()