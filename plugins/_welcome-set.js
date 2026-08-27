let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let type = command.replace('set', '').replace('del', '')
  let text = args.join(' ')

  // SET
  if (command.startsWith('set')) {
    if (!text) return m.reply(`💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧*** 𐔌 ꒱ 💙\n\n📌 *Uso:* ${usedPrefix}${command} <texto> 🫧\n\n*Variables coquetas:*\n@user = Menciona al user 🦋\n@group = Nombre del grupo 🫐\n@desc = Descripción del grupo 🌀`)

    chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`] = text
    await m.reply(`🫧 𐔌 ꒱ 𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗜𝗧𝗢 𐔌 ꒱ 🫧\n\n✅ *${type} personalizado guardado*\n\n*Vista previa:* ┆\n${text}`)
  }

  // DEL
  if (command.startsWith('del')) {
    if (!chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`]) {
      return m.reply(`🫐 Ay no~ *No hay un ${type} personalizado configurado*`)
    }
    delete chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`]
    await m.reply(`🫧 𐔌 ꒱ 𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢 𐔌 ꒱ 🫧\n\n❌ *${type} personalizado eliminado*\nVolvió al mensaje por defecto 💙`)
  }
}

handler.help = ['setwelcome', 'setbye', 'setkick', 'delwelcome', 'delbye', 'delkick']
handler.tags = ['config']
handler.command = /^(setwelcome|setbye|setkick|delwelcome|delbye|delkick)$/i
handler.group = true
handler.admin = true

export default handler