const used = new Map() // Para anti-spam

let handler = async (m, { conn, text, participants }) => {
  // ANTI-SPAM 3 SEGUNDOS
  const userId = m.sender
  const now = Date.now()
  if (used.has(userId) && now - used.get(userId) < 3000) {
    return m.reply('⏰ Espera 3 segundos para volver a usar el comando')
  }
  used.set(userId, now)
  setTimeout(() => used.delete(userId), 3000)

  const mime = (m.quoted? m.quoted.mtype : m.mtype) || ''
  const users = [...new Set(participants.map(u => conn.decodeJid(u.id)))] // quitar duplicados

  let caption = text? text : "Pᴏʀɴʜᴜʙ: @whoís.yallico"

  try {
    if (m.quoted) {
      // SI RESPONDE A UN MENSAJE
      await conn.forwardMessage(m.chat, m.quoted, {
        mentions: users
      })
    } else if (/image/.test(mime)) {
      // IMAGEN
      let media = await m.download()
      await conn.sendMessage(m.chat, {
        image: media,
        caption: caption,
        mentions: users
      }, { quoted: m })
    } else if (/video/.test(mime)) {
      // VIDEO
      let media = await m.download()
      await conn.sendMessage(m.chat, {
        video: media,
        mimetype: 'video/mp4',
        caption: caption,
        mentions: users
      }, { quoted: m })
    } else {
      // TEXTO
      await conn.sendMessage(m.chat, {
        text: caption,
        mentions: users
      }, { quoted: m })
    }
  } catch (e) {
    console.log(e)
    m.reply('❌ Error al enviar el hidetag')
  }
}

handler.help = ['hidetag [texto]', 'notify [texto]']
handler.tags = ['grupos']
handler.command = ['hidetag', 'notify', 'n', 'noti', 'notificar', 'notif', 'aviso', 'avisar']
handler.group = true
handler.admin = true

export default handler