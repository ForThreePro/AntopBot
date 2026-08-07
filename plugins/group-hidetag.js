let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let baseText = text || q.text || q.caption || q.body || ''
  if (!baseText) baseText = 'hola'

  let finalText = `${baseText}\n\n> 🐉 *[ SON GOKU PREM ]* 💥`

  await conn.sendMessage(m.chat, {
    text: finalText,
    mentions: users
  }, { 
    quoted: q
  })
  
  await m.react('📢')
}

handler.help = ['hidetag <texto>']
handler.tags = ['grupos']
handler.command = /^(hidetag|notify|notificar|notifi|noti|n|hidet|aviso)$/i
handler.group = true
handler.admin = true

export default handler