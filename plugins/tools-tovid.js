import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg } from '../lib/converter.js'

let handler = async (m, { conn }) => {
if (!m.quoted) return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*⚠️ ERROR*

*➤* Responde a un *sticker animado*
*➤* Ejemplo: Responde al sticker + *tovid*

*━━━━━━━━━━*`, m)

let mime = m.quoted.mimetype || ''
if (!/webp|audio/.test(mime)) return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*⚠️ FORMATO NO VÁLIDO*

*➤* Solo acepto *stickers animados* .webp
*➤* O archivos de *audio*

*━━━━━━━━━━*`, m)

try {
await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
let media = await m.quoted.download()
let out = Buffer.alloc(0)

if (/webp/.test(mime)) {
out = await webp2mp4(media)
} else if (/audio/.test(mime)) {
out = await ffmpeg(media, [
'-filter_complex', 'color',
'-pix_fmt', 'yuv420p',
'-crf', '51',
'-c:a', 'copy',
'-shortest'
], 'mp3', 'mp4')
}

await conn.sendFile(m.chat, out, 'sapito.mp4', `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━━━━━━━━━*
*✅ CONVERSIÓN COMPLETADA*

*➤* Tu *sticker animado* ya es *video*
*➤* Bot: *SAPITO BOT PREM*

*━━━━━━━━━━━━━━━━━━*`, m)

await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

} catch (e) {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR EN LA CONVERSIÓN*

*➤* No se pudo convertir el archivo
*➤* Intenta con otro sticker

*━━━━━━━━━━*`, m)
}
}

handler.help = ['tovid']
handler.tags = ['sticker', 'tools']
handler.command = ['tovideo', 'tovid'] 

export default handler