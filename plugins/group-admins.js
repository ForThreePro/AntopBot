const handler = async (m, { conn, command }) => {
  if (!m.mentionedJid[0] &&!m.quoted) {
    let texto = `💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𐔌 ꒱ 💙

*Uso:* 🫧
.${command} @user → Para ${command === 'promote' || command === 'promover' || command === 'daradmin'? 'promover' : 'degradar'} 🦋
.${command} → Responde al mensaje del user

> *Solo admins* 🫐`
    return m.reply(texto, m.chat)
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'

  let msgAccion = action === 'promote'
? `🫧 𐔌 ꒱ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗣𝗥𝗢𝗠𝗢𝗩𝗜𝗗𝗢 𐔌 ꒱ 🫧

.⃟𖥔 ݁. 𖦹˙— \`\`PROMOTE\`\` —˙𖦹.💙꒷

👑 *Nuevo Admin:* @${user.split('@')[0]}
💙 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Antitop Bot*** 🪼`
    : `🌀 𐔌 ꒱ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗚𝗥𝗔𝗗𝗔𝗗𝗢 𐔌 ꒱ 🌀

.⃟𖥔 ݁. 𖦹˙— \`\`DEMOTE\`\` —˙𖦹.💙꒷

📉 *Ya no es Admin:* @${user.split('@')[0]}
🫧 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Antitop Bot*** 🪼`

  await m.react(action === 'promote'? '👑' : '📉')
  await conn.groupParticipantsUpdate(m.chat, [user], action)
  m.reply(msgAccion, m.chat, { mentions: [user, m.sender] })
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupos']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler