import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `❌ *Solo admins pueden usar este comando*`, m)

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, `🐉 𓆩 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 𓆪 🐉\n\n🟢 *Activada correctamente*\nAhora enviaré mensajes con la foto del usuario`, m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, `🐉 𓆩 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 𓆪 🐉\n\n🔴 *Desactivada*\nYa no enviaré mensajes de entrada/salida`, m)
  } else {
    await conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n📌 *Uso:* ${m.prefix}bienvenida on\n📌 *Uso:* ${m.prefix}bienvenida off`, m)
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['config']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return!0

    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat ||!chat.bienvenida) return!0

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return!0

    // 1. Intentar obtener foto de perfil del usuario
    let pp
    try {
      pp = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      // 2. Si no tiene foto, usar catalogo.png
      const pathImg = join(process.cwd(), 'storage', 'img', 'catalogo.png')
      if (existsSync(pathImg)) {
        pp = readFileSync(pathImg)
      } else {
        // 3. Fallback final
        pp = { url: 'https://files.catbox.moe/1j784p.jpg' }
      }
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = ''

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🐉 𓆩 𝗡𝗨𝗘𝗩𝗢 𝗚𝗨𝗘𝗥𝗘𝗥𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`BIENVENIDO\`\` —˙𖦹.🏆꒷

⚡ *${userTag}* se unió a *${groupName}*

📊 *Datos:*
│ 👤 *Miembro N°:* ${membersCount}
│ 👑 *Creador:* SON GOKU PREM
│ 📝 *Info:* ${groupDesc}

> *Portate bien o te mando con Kamisama* 😏`

        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🐉 𓆩 𝗦𝗘 𝗙𝗨𝗘 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`ABANDONO\`\` —˙𖦹.🏆꒷

🏃‍♂️ *${userTag}* abandonó *${groupName}*

📉 *Quedamos:* ${membersCount} guerreros
> *Ni Goku lo salva ahora*`

        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`BAN\`\` —˙𖦹.🏆꒷

⚡ *${userTag}* fue eliminado de *${groupName}*

🚮 *Causa:* Rompió las reglas
👥 *Población actual:* ${membersCount}
> *Hakai aplicado* 💥`

        break
    }

    if (txt) {
      await conn.sendMessage(m.chat, {
        image: typeof pp === 'string'? { url: pp } : pp,
        caption: txt,
        mentions: [userJid]
      })
    }

  } catch (e) {
    console.error("Error en Bienvenida:", e)
  }
  return!0
}

export default handler