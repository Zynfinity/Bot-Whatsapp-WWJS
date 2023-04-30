const wppconnect = require('@wppconnect-team/wppconnect');
const handler = require('./src/lib/handler')

global.commands = {}
//create clint using wppconnect?

wppconnect.create({
  session: 'bot-wa-wpp', //Pass the name of the client you want to start the bot
  puppeteerOptions: {
    userDataDir: './tokens/multidevice', // or your custom directory
  },
  catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
    console.log('Number of attempts to read the qrcode: ', attempts);
    console.lohg(asciiQR);
    //   console.log('base64 image string qrcode: ', base64Qrimg);
    //   console.log('urlCode (data-ref): ', urlCode);
  },
  statusFind: (statusSession, session) => {
    console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
    //Create session wss return "serverClose" case server for close
    console.log('Session name: ', session);
  },
  onLoadingScreen: (percent, message) => {
    console.log('LOADING_SCREEN', percent, message);
  },
  headless: true, // Headless chrome
  devtools: false, // Open devtools by default
  useChrome: true, // If false will use Chromium instance
  debug: false, // Opens a debug session
  logQR: true, // Logs QR automatically in terminal
  browserWS: '', // If u want to use browserWSEndpoint
  browserArgs: [''], // Parameters to be added into the chrome browser instance
  puppeteerOptions: {}, // Will be passed to puppeteer.launch
  disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
  updatesLog: false, // Logs info updates automatically in terminal
  autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
  tokenStore: 'file', // Define how work with tokens, that can be a custom interface
  folderNameToken: './tokens', //folder name when saving tokens
  // BrowserSessionToken
  // To receive the client's token use the function await clinet.getSessionTokenBrowser()
  sessionToken: {
    WABrowserId: '"UnXjH....."',
    WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
    WAToken1: '"0i8...."',
    WAToken2: '"1@lPpzwC...."',
  }
}).then((client) => start(client))
  .catch((error) => console.log(error));

async function loadCommands() {
  console.log('Commands')
  const path = require('path')
  const fs = require('fs')
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
async function start(client) {
  loadCommands()
  client.onMessage(async (message) => await handler(client, message))
}