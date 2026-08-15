import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/video|audio/.test(mime)) return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Responde a un *video* o *nota de voz*
*➤* Ejemplo: Responde al video + *tomp3*

*━━━━━━━━━━*`, m)

try {
await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
let media = await q.download?.()
if (!media) return null

let audio = await toAudio(media, 'mp4')
if (!audio.data) return null

await conn.sendFile(m.chat, audio.data, 'sapito.mp3', `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━━━━━━━━━*
*✅ AUDIO EXTRAÍDO*

*➤* Tu *video/audio* ya es *mp3*
*➤* Calidad: *Alta*
*➤* Bot: *SAPITO BOT PREM*

*━━━━━━━━━━*`, m, null, { mimetype: 'audio/mp4' })

await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

} catch {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR*

*➤* No se pudo convertir el archivo
*➤* Intenta con otro *video* o *audio*

*━━━━━━━━━━*`, m)
}
}

handler.help = ['tomp3']
handler.tags = ['tools']
handler.command = ['tomp3', 'toaudio'] 
handler.register = false

export default handler