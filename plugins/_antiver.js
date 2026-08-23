import fs from 'fs'
const DB_FILE = './antiver_db.json'

// Cargar base de datos
let antiverDB = {}
if (fs.existsSync(DB_FILE)) antiverDB = JSON.parse(fs.readFileSync(DB_FILE))

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(antiverDB))
}

let handler = async (m, { conn, args, isAdmin }) => {
    let chat = m.chat

    if (!args[0]) return m.reply(`📌 *Uso:* \n*.antiver on* - Activar guardado automático\n*.antiver off* - Desactivar guardado automático\n\n*Estado actual:* ${antiverDB[chat]? '🟢 ACTIVO' : '🔴 DESACTIVADO'}`)

    if (args[0] === 'on') {
        antiverDB[chat] = true
        saveDB()
        m.reply(`✅ *ANTIVER ACTIVADO*\nAhora guardaré automático todas las fotos/videos/audios de "ver 1 vez" de este chat.`)

    } else if (args[0] === 'off') {
        antiverDB[chat] = false
        saveDB()
        m.reply(`❌ *ANTIVER DESACTIVADO*\nYa no guardaré los "ver 1 vez" de este chat.`)

    } else {
        m.reply(`❌ Opción no válida. Usa *.antiver on* o *.antiver off*`)
    }
}

handler.help = ['antiver on/off']
handler.tags = ['tools']
handler.command = ['antiver']
handler.group = true
handler.admin = false // pon true si solo quieres que admins lo activen

export default handler

// ESTO ES LO QUE GUARDA AUTOMÁTICO
export async function before(m, { conn }) {
    if (!m.message) return
    let chat = m.chat

    // Si no está activado en este chat, salir
    if (!antiverDB[chat]) return

    let msg = m.message
    let type = Object.keys(msg)[0]
    let content = msg[type]

    // Solo si es viewOnce
    if (!content?.viewOnce) return

    try {
        let media = await this.downloadM(content)
        let caption = content.caption || content.text || ''
        let who = `@${m.sender.split('@')[0]}`

        let txt = `🔓 *ANTI VER 1 VEZ - GUARDADO*\n👤 Enviado por: ${who}\n\n${caption}`

        if (type === 'imageMessage') {
            await conn.sendMessage(m.chat, { image: media, caption: txt, mentions: [m.sender] }, { quoted: m })
        }
        if (type === 'videoMessage') {
            await conn.sendMessage(m.chat, { video: media, caption: txt, mentions: [m.sender] }, { quoted: m })
        }
        if (type === 'audioMessage' || type === 'pttMessage') {
            await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mp4', ptt: true }, { quoted: m })
        }

        await conn.sendMessage(m.chat, { react: { text: '🔓', key: m.key } })

    } catch (e) {
        console.log('Error AntiVer:', e)
    }
}