// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

let handler = async (m, { conn, args }) => {
  try {
    await react(conn, m, "🫧")

    // Si menciona a alguien usa esa persona, si no usa al que escribió
    let who = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.sender

    // Obtener datos del usuario de la DB
    let user = global.db.data.users[who] || {}

    // Datos por defecto si no existen
    let name = await conn.getName(who)
    let number = who.split('@')[0]
    let exp = user.exp || 0
    let level = user.level || 0
    let money = user.money || 0
    let limit = user.limit || 0
    let registered = user.registered || false
    let role = user.role || 'Principiante'

    // Calcular XP para el siguiente nivel
    let reqXp = (level + 1) * 100
    let xpProgress = exp - (level * 100)

    const caption = `💙 𐔌 ꒱ 𝗣𝗘𝗥𝗙𝗜𝗟 𝗗𝗘 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𐔌 ꒱ 💙

.⃟𖥔 ݁. 𖦹˙— \`\`ESTADISTICAS\`\` —˙𖦹.🫧꒷

🫧 *NOMBRE:* ${name}
🦋 *NUMERO:* @${number}
💎 *RANGO:* ${role}

✨ *NIVEL:* ${level}
💫 *EXP:* ${xpProgress}/${reqXp}
💰 *DINERO:* $${money}
🫐 *DIAMANTES:* ${limit}

🪼 *REGISTRO:* ${registered? 'Si' : 'No'}

━━━━━━━━━━━
*Powered by*: ***Antitop Bot*** 🪼`

    // Obtener foto de perfil
    let pp
    try {
      pp = await conn.profilePictureUrl(who, 'image')
    } catch {
      pp = 'https://files.evogb.win/OdOIUP.jpg' // imagen por defecto Antitop
    }

    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: caption,
      mentions: [who]
    }, { quoted: m })

    await react(conn, m, "✅")

  } catch (e) {
    console.error(e)
    await react(conn, m, "❌")
    await m.reply(`🌀 Ocurrió un error al obtener el perfil.`)
  }
}

handler.help = ['perfil @user']
handler.tags = ['rg']
handler.command = ['perfil', 'profile', 'p']
handler.register = false

export default handler;