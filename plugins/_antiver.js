import fs from 'fs'
const DB_FILE = './antiver_db.json'

// Cargar BD
let antiverDB = {}
if (fs.existsSync(DB_FILE)) antiverDB = JSON.parse(fs.readFileSync(DB_FILE))

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(antiverDB))
}

let handler = async (m, { conn, args }) => {
    let chat = m.chat

    if (!args[0]) return conn.reply(m.chat, `《✧》 *ANTIVER*\n.on - Activar guardado automático\n.off - Desactivar guardado automático\n\nEstado: ${antiverDB[chat]? '🟢 ACTIVO' : '🔴 DESACTIVADO'}`, m)

    if (args[0] === 'on') {
        antiverDB[chat] = true
        saveDB()
        conn.reply(m.chat, `《✧》 *ANTIVER ACTIVADO*\nAhora guardaré automático todos los ViewOnce de este chat.`, m)

    } else if (args[0] === 'off') {
        antiverDB[chat] = false
        saveDB()
        conn.reply(m.chat, `《✧》 *ANTIVER DESACTIVADO*\nYa no guardaré los ViewOnce.`, m)
    }
}

handler.help = ['antiver on/off']
handler.tags = ['tools']
handler.command = ['antiver']

// ESTA ES LA PARTE QUE GUARDA SOLO
export async function before(m, { conn }) {
    if (!m.message) return
    let chat = m.chat
    if (!antiverDB[chat]) return // si no está activo, salir

    let msg = m.message
    let type = Object.keys(msg)[0]
    let content = msg[type]

    if (!content?.viewOnce) return // solo viewonce

    try {
        let q = { message: msg, mtype: type, key: m.key }
        let buffer = await conn.downloadM(content)
        let caption = content.caption || ''
        let who = `@${m.sender.split('@')[0]}`

        let txt = `《✧》 *ANTI VER 1 VEZ - AUTO*\n👤 De: ${who}\n\n${caption}`

        if (type === 'imageMessage') {
            await conn.sendFile(m.chat, buffer, 'media.jpg', txt, m, false, { mentions: [m.sender] })
        }
        else if (type === 'videoMessage') {
            await conn.sendFile(m.chat, buffer, 'media.mp4', txt, m, false, { mentions: [m.sender] })
        }
        else if (type === 'audioMessage') {
            await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: content.ptt }, { quoted: m })
        }

        await conn.sendMessage(m.chat, { react: { text: '🔓', key: m.key } })

    } catch (e) {
        console.log('Error AntiVer:', e)
    }
}

export default handler