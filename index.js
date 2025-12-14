// index.js
require('dotenv').config()
const { default: makeWASocket, useMultiFileAuthState, Browsers } = require('ye-bail')
const { menuButtons } = require('./config')

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: !process.env.PAIR_NUMBER,
    browser: Browsers.macOS(process.env.BOT_NAME || 'MenuBot')
  })

  // pairing code login
  if (!sock.authState.creds.registered && process.env.PAIR_NUMBER) {
    const code = await sock.requestPairingCode(process.env.PAIR_NUMBER)
    console.log('Pairing code:', code)
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const jid = m.key.remoteJid
    const text = m.message.conversation || m.message?.extendedTextMessage?.text || ''

    // command /menu
    if (text === '/menu') {
      await sock.sendMessage(jid, {
        text: 'Menu Bot',
        title: 'Menu',
        footer: '© MenuBot',
        interactiveButtons: menuButtons()
      })
    }

    // handle button replies
    if (m.message?.interactiveResponseMessage) {
      const id = m.message.interactiveResponseMessage.body?.button?.id
      if (id === 'hello') {
        await sock.sendMessage(jid, { text: 'Hai 👋' })
      }
      if (id === 'info') {
        await sock.sendMessage(jid, { text: 'Ini bot sederhana dengan menu & pairing code.' })
      }
    }
  })
}

connect()
