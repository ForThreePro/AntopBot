const handler = async (m, { conn, command }) => {
  if (!m.mentionedJid[0] &&!m.quoted) {
    let texto = `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

*Uso:*
.${command} @user → Para ${command === 'promote' || command === 'promover' || command === 'daradmin'? 'promover' : 'degradar'}
.${command} → Responde al mensaje del user

> *Solo admins*`
    return m.reply(texto, m.chat)
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'

  let msgAccion = action === 'promote'
   ? `🐉 𓆩 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗣𝗥𝗢𝗠𝗢𝗩𝗜𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`PROMOTE\`\` —˙𖦹.🏆꒷

👑 *Nuevo Admin:* @${user.split('@')[0]}
⚡ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`
    : `🐉 𓆩 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗚𝗥𝗔𝗗𝗔𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`DEMOTE\`\` —˙𖦹.🏆꒷

👢 *Ya no es Admin:* @${user.split('@')[0]}
⚡ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`

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