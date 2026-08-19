import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg, toAudio } from '../lib/converter.js'

let handler = async (m, { conn, command }) => {

  // TOVID
  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted) return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR*\n\n*➤* Responde a un *sticker animado*\n*➤* Ejemplo: Responde al sticker + *tovid*\n\n*━━━━━━━━━━*`, m)
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*⚠️ FORMATO NO VÁLIDO*\n\n*➤* Solo acepto *stickers animados* .webp\n\n*━━━━━━━━━━*`, m)
    try {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await conn.sendFile(m.chat, out, 'garfield.mp4', `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*✅ CONVERSIÓN COMPLETADA*\n\n*➤* Tu *sticker animado* ya es *video*\n*➤* Bot: ***Garfield Bot Oficial***\n\n*━━━━━━━━━━*`, m)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*❌ ERROR*\n\n*➤* No se pudo convertir\n\n*━━━━━━━━━━*`, m)
    }
  }

  // TOMP3
  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR DE USO*\n\n*➤* Responde a un *video* o *nota de voz*\n*➤* Ejemplo: Responde al video + *tomp3*\n\n*━━━━━━━━━━*`, m)
    try {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await conn.sendFile(m.chat, audio.data, 'garfield.mp3', `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*✅ AUDIO EXTRAÍDO*\n\n*➤* Tu *video/audio* ya es *mp3*\n*➤* Bot: ***Garfield Bot Oficial***\n\n*━━━━━━━━━━*`, m, null, { mimetype: 'audio/mp4' })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*❌ ERROR*\n\n*➤* No se pudo convertir\n*━━━━━━━━━━*`, m)
    }
  }

  // TOIMG
  if (['toimg', 'stickerimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let isSticker = q.mtype === 'stickerMessage' || (q.mimetype || '').includes('webp')
    if (!isSticker) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR DE USO*\n\n*➤* Responde a un *sticker*\n*➤* Ejemplo: Responde al sticker + *toimg*\n\n*━━━━━━━━━━*`)
    try {
      await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } })
      let media = await q.download()
      await conn.sendMessage(m.chat, { image: media, caption: `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*✅ STICKER CONVERTIDO*\n\n*➤* Tu *sticker* ya es *imagen JPG*\n*➤* Bot: ***Garfield Bot Oficial***\n\n*━━━━━━━━━━*` }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱\n\n*━━━━━━━━━━*\n*❌ ERROR*\n\n*➤* No pude convertir el *sticker*\n\n*━━━━━━━━━━*`)
    }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler