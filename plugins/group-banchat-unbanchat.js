let handler = async (m, { conn, isOwner, isROwner, command }) => {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  let type = command.toLowerCase()

  if (!(isOwner || isROwner)) {
    return conn.reply(m.chat, `💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𐔌 ꒱ 💙\n\n🫐 *Solo owners pueden usar este comando*`, m)
  }

  switch (type) {
    case 'banchat': case 'banearchat':
      if (chat.isBanned) return m.reply(`💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𐔌 ꒱ 💙\n\n🌀 *Este chat ya se encuentra baneado*`)
      chat.isBanned = true
      await conn.reply(m.chat, `🌀 𐔌 ꒱ 𝗖𝗛𝗔𝗧 𝗕𝗔𝗡𝗘𝗔𝗗𝗢 𐔌 ꒱ 🌀

.⃟𖥔 ݁. 𖦹˙— \`\`BAN\`\` —˙𖦹.💙꒷

🚫 *El bot ha sido desactivado en este grupo*
💤 *No responderé a ningún comando hasta que sea desbloqueado*

👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Antitop Bot*** 🪼`, m, { mentions: [m.sender] })
      break

    case 'unbanchat': case 'desbanearchat':
      if (!chat.isBanned) return m.reply(`💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𐔌 ꒱ 💙\n\n🫐 *Este chat no está baneado*`)
      chat.isBanned = false
      await conn.reply(m.chat, `🫧 𐔌 ꒱ 𝗖𝗛𝗔𝗧 𝗗𝗘𝗦𝗕𝗔𝗡𝗘𝗔𝗗𝗢 𐔌 ꒱ 🫧

.⃟𖥔 ݁. 𖦹˙— \`\`UNBAN\`\` —˙𖦹.💙꒷

💙 *El bot vuelve a estar activo en este grupo*
✨ *Ya pueden utilizar todos los comandos con normalidad*

👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Antitop Bot*** 🪼`, m, { mentions: [m.sender] })
      break

    default:
      return
  }
}

handler.help = ['banchat', 'unbanchat']
handler.tags = ['grupos']
handler.command = /^(banchat|banearchat|unbanchat|desbanearchat)$/i
handler.owner = true
handler.group = true

export default handler