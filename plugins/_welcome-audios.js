let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  // Detectar tipo: welcome / bye / kick
  let type = command.replace('audiowelcome','').replace('audiobye','').replace('audiokick','')
               .replace('delaudiowelcome','').replace('delaudiobye','').replace('delaudiokick','')

  if (command.includes('welcome')) type = 'welcome'
  if (command.includes('bye')) type = 'bye'
  if (command.includes('kick')) type = 'kick'

  // SET AUDIO
  if (command.startsWith('audio')) {
    // Si responde a un audio o manda audio
    if (mime && /audio/.test(mime)) {
      let buffer = await q.download()
      chat[`audio${type}`] = buffer
      return m.reply(`🐱 𓆩 𝗔𝗨𝗗𝗜𝗢 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 𓆪 🐱\n\n✅ *Audio de ${type} guardado*\nSe reproducirá cuando pase el evento`)
    }

    // Si manda un link
    if (args[0] && args[0].startsWith('http')) {
      chat[`audio${type}`] = args[0]
      return m.reply(`🐱 𓆩 𝗟𝗜𝗡𝗞 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 𓆪 🐱\n\n✅ *Audio de ${type} guardado*\nLink: ${args[0]}`)
    }

    return m.reply(`🐱 𓆩 ***𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🐱\n\n📌 *Uso:* ${usedPrefix}${command} + [responder a audio]\n📌 *Uso:* ${usedPrefix}${command} <link del audio>`)
  }

  // DEL AUDIO
  if (command.startsWith('delaudio')) {
    if (!chat[`audio${type}`]) {
      return m.reply(`🍕 *No hay un audio de ${type} configurado*`)
    }
    delete chat[`audio${type}`]
    await m.reply(`🐱 𓆩 𝗔𝗨𝗗𝗜𝗢 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢 𓆪 🐱\n\n❌ *Audio de ${type} eliminado*`)
  }
}

handler.help = ['audiowelcome', 'audiobye', 'audiokick', 'delaudiowelcome', 'delaudiobye', 'delaudiokick']
handler.tags = ['config']
handler.command = /^(audio(welcome|bye|kick)|delaudio(welcome|bye|kick))$/i
handler.group = true
handler.admin = true

export default handler