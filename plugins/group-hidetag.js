import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants, command }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let watermark = `\n\n━━━━━━━━━━━\n*Powered by*: SON GOKU PREM 💥`
  let baseText = text || q.text || q.caption || ''

  await m.react('📢')

  // Si es texto normal
  if (!q.mtype || q.mtype === 'conversation' || q.mtype === 'extendedTextMessage') {
    let finalText = `🐉 𓆩 𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`${baseText || 'NOTIFICACION GENERAL'}\`\` —˙𖦹.🏆꒷${watermark}`

    return await conn.sendMessage(m.chat, {
      text: finalText,
      mentions: users
    }, { quoted: m })
  }

  // Si es imagen
  if (q.mtype === 'imageMessage') {
    let caption = `🐉 𓆩 𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𓆪 🐉\n\n${baseText || 'NOTIFICACION'}${watermark}`
    let buffer = await q.download()
    return await conn.sendMessage(m.chat, {
      image: buffer,
      caption: caption,
      mentions: users
    }, { quoted: m })
  }

  // Si es video
  if (q.mtype === 'videoMessage') {
    let caption = `🐉 𓆩 𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𓆪 🐉\n\n${baseText || 'NOTIFICACION'}${watermark}`
    let buffer = await q.download()
    return await conn.sendMessage(m.chat, {
      video: buffer,
      caption: caption,
      mentions: users
    }, { quoted: m })
  }

  // Si es audio
  if (q.mtype === 'audioMessage') {
    let buffer = await q.download()
    return await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mp4',
      ptt: q.ptt,
      mentions: users
    }, { quoted: m })
  }

  // Si es sticker
  if (q.mtype === 'stickerMessage') {
    let buffer = await q.download()
    return await conn.sendMessage(m.chat, {
      sticker: buffer,
      mentions: users
    }, { quoted: m })
  }

  // Si es documento
  if (q.mtype === 'documentMessage') {
    let buffer = await q.download()
    let fileName = q.fileName || 'archivo'
    let mimetype = q.mimetype || 'application/pdf'
    return await conn.sendMessage(m.chat, {
      document: buffer,
      fileName: fileName,
      mimetype: mimetype,
      caption: baseText,
      mentions: users
    }, { quoted: m })
  }
}

handler.help = ['hidetag <texto>']
handler.tags = ['grupos']
handler.command = /^(hidetag|notify|notificar|notifi|noti|n|hidet|aviso)$/i
handler.group = true
handler.admin = true

export default handler