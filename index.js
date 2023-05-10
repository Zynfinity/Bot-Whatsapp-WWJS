import wa from 'whatsapp-web.js'
const { Client, LocalAuth } = wa
import chokidar from 'chokidar'
import syntaxerror from "syntax-error"
import qrcode from 'qrcode-terminal'
import path from 'path'
import fs from 'fs'
import handler from './src/lib/handler.js'
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
global.config = JSON.parse(fs.readFileSync('./config.json'))

global.commands = {}
//create clint using wppconnect?

async function start() {
  console.log('Welcome To ZXBOT')
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
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-gpu-sandbox',
        '--disable-dev-shm-usage',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
      exitOnPageError: false,
    }
  });
  client.initialize().then(async re => console.log(re))
  client.on('change_state', async msg => {
    console.log(msg)
    if (msg == 'CONNECTED') {
      //
    }
  })
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
async function loadCommands() {
  console.log('Commands')
  pluginFolder = path.join(__dirname, 'src/commands')
  for (let folderName of fs.readdirSync(pluginFolder)) {
    console.log(folderName + ' ✓')
    for (let fileName of fs.readdirSync(path.join(pluginFolder, folderName))) {
      plugins = require(path.join(pluginFolder, folderName, fileName))
      global.commands[fileName] = plugins
    }
  }
  console.log('Commands loaded succsessfully')
}

// reload
let pluginFilter = (filename) => /\.cjs$/.test(filename);
let pluginFolder = path.join(__dirname, "src/commands");
global.reload = async (folder) => {
  folder = `./${folder.replace(/\\/g, '/')}`
  let filename = folder.split("/")[4]
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, './' + folder.split('/')[3] + '/' + filename)
    console.log({ folder, filename, dir })
    let isi = (await import(folder)).default
    if (dir in require.cache) {
      delete require.cache[dir];
      if (fs.existsSync(dir)) console.info(`re - require plugin '${folder}'`);
      else {
        console.log(`deleted plugin '${folder}'`);
        return delete global.commands[filename];
      }
    } else console.info(`requiring new plugin '${filename}'`);
    let err = syntaxerror(fs.readFileSync(dir), filename);
    if (err) console.log(`syntax error while loading '${filename}'\n${err}`);
    else
      try {
        global.commands[filename] = isi;
      } catch (e) {
        console.log(e);
      } finally {
        global.commands = Object.fromEntries(
          Object.entries(global.commands).sort(([a], [b]) => a.localeCompare(b))
        );
      }
  }
};

var watcher = chokidar.watch('./src/commands', { ignored: /^\./, persistent: true });
watcher
  .on('error', function (error) { console.error('Error happened', error); })
  .on('add', function (path) { global.reload(path) })
  .on('change', function (path) { global.reload(path) })
  .on('unlink', function (path) { global.reload(path) })

start()