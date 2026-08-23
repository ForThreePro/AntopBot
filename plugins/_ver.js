import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
if (!m.quoted) return conn.reply(m.chat, `《✧》 Responde a una imagen/video/audio ViewOnce.`, m)
    
// DETECCION MEJORADA
let q = m.quoted
let msg = q.message || q.msg || q
let type = Object.keys(msg)[0]
let content = msg[type]

if (!content?.viewOnce) return conn.reply(m.chat, `《✧》 Ese mensaje no es ViewOnce.`, m)

let buffer = await q.download()
let caption = content.caption || ''

if (/videoMessage/.test(q.mtype)) {
    return conn.sendFile(m.chat, buffer, 'media.mp4', `《✧》 *ANTI VER 1 VEZ*\n${caption}`, m)
} else if (/imageMessage/.test(q.mtype)) {
    return conn.sendFile(m.chat, buffer, 'media.jpg', `《✧》 *ANTI VER 1 VEZ*\n${caption}`, m)
} else if (/audioMessage/.test(q.mtype)) {
    return conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: content.ptt }, { quoted: m })
} else {
    return conn.reply(m.chat, `《✧》 Solo soporta imagen, video y audio`, m)
}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 
export default handler