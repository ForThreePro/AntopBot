let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  
  let q = m.quoted ? m.quoted : m
  let baseText = text || q.text || q.caption || ''
  if (!baseText) baseText = '📢 ATENCIÓN'

  // SIN MARCA DE AGUA
  let finalText = `🐉 𓆩 𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𓆪 🐉

${baseText}`

  // Si respondes a una imagen/video/sticker/documento
  if (m.quoted && m.quoted.mtype) {
    let type = m.quoted.mtype
    
    if (/image/.test(type)) {
      let media = await q.download()
      return await conn.sendMessage(m.chat, {
        image: media,
        caption: finalText,
        mentions: users
      }, { quoted: m })
    }
    else if (/video/.test(type)) {
      let media = await q.download()
      return await conn.sendMessage(m.chat, {
        video: media,
        caption: finalText,
        mentions: users
      }, { quoted: m })
    }
    else if (/audio/.test(type)) {
      let media = await q.download()
      return await conn.sendMessage(m.chat, {
        audio: media,
        mimetype: 'audio/ogg',
        ptt: true,
        mentions: users
      }, { quoted: m })
    }
    else if (/document/.test(type)) {
      let media = await q.download()
      let fileName = (m.quoted.msg || m.quoted).fileName || 'archivo'
      return await conn.sendMessage(m.chat, {
        document: media,
        fileName: fileName,
        caption: finalText,
        mentions: users
      }, { quoted: m })
    }
    else if (/sticker/.test(type)) {
      let media = await q.download()
      return await conn.sendMessage(m.chat, {
        sticker: media,
        mentions: users
      }, { quoted: m })
    }
  }

  // Si es solo texto
  await conn.sendMessage(m.chat, {
    text: finalText,
    mentions: users
  }, { quoted: m })

  await m.react('📢')
}

handler.help = ['hidetag <texto>']
handler.tags = ['grupos']
handler.command = /^(hidetag|notify|notificar|notifi|noti|n|hidet|aviso)$/i
handler.group = true
handler.admin = true

export default handler