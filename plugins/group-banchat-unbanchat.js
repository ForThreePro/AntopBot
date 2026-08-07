let handler = async (m, { conn, isOwner, isAdmin, isROwner, command }) => {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  let type = command.toLowerCase()

  if (!(isAdmin || isOwner || isROwner)) {
    return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n❌ *Solo admins pueden usar este comando*`, m)
  }

  switch (type) {
    case 'banchat': case 'banearchat':
      if (chat.isBanned) return m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n⚠️ *Este chat ya se encuentra baneado.*`)
      chat.isBanned = true
      await conn.reply(m.chat, `🐉 𓆩 𝗖𝗛𝗔𝗧 𝗕𝗔𝗡𝗘𝗔𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`BAN\`\` —˙𖦹.🏆꒷

🚫 *El bot ha sido desactivado en este grupo*
💬 *No responderé a ningún comando hasta que sea desbloqueado*

👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`, m, { mentions: [m.sender] })
      break

    case 'unbanchat': case 'desbanearchat':
      if (!chat.isBanned) return m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n⚠️ *Este chat no está baneado.*`)
      chat.isBanned = false
      await conn.reply(m.chat, `🐉 𓆩 𝗖𝗛𝗔𝗧 𝗗𝗘𝗦𝗕𝗔𝗡𝗘𝗔𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`UNBAN\`\` —˙𖦹.🏆꒷

🌀 *El bot vuelve a estar activo en este grupo*
⚡ *Ya pueden utilizar todos los comandos con normalidad*

👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`, m, { mentions: [m.sender] })
      break

    default:
      return
  }
}

handler.help = ['banchat', 'unbanchat']
handler.tags = ['grupos']
handler.command = /^(banchat|banearchat|unbanchat|desbanearchat)$/i
handler.admin = true
handler.group = true

export default handler