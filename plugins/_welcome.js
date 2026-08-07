import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `❌ *Solo admins pueden usar este comando*`, m)
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, `🐉 𓆩 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 𓆪 🐉\n\n🟢 *Activada con audios*`, m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, `🐉 𓆩 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 𓆪 🐉\n\n🔴 *Desactivada*`, m)
  } else {
    await conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n📌 *Uso:* ${m.prefix}bienvenida on/off`, m)
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

    // Foto del usuario o fallback
    let pp
    try {
      pp = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      const pathImg = join(process.cwd(), 'storage', 'img', 'catalogo.png')
      if (existsSync(pathImg)) pp = readFileSync(pathImg)
      else pp = { url: 'https://files.catbox.moe/1j784p.jpg' }
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = '', audio = null, type = ''

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        type = 'welcome'
        audio = chat.audiowelcome
        txt = chat.customWelcome?
          chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🐉 𓆩 𝗡𝗨𝗘𝗩𝗢 𝗚𝗨𝗘𝗥𝗘𝗥𝗢 𓆪 🐉

⚡ *${userTag}* se unió a *${groupName}*
📊 *Miembro N°:* ${membersCount}
> *Portate bien o te mando con Kamisama* 😏`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        type = 'bye'
        audio = chat.audiobye
        txt = chat.customBye?
          chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🐉 𓆩 𝗦𝗘 𝗙𝗨𝗘 𓆪 🐉

🏃‍♂️ *${userTag}* abandonó *${groupName}*
📉 *Quedamos:* ${membersCount} guerreros`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        type = 'kick'
        audio = chat.audiokick
        txt = chat.customKick?
          chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉

⚡ *${userTag}* fue eliminado de *${groupName}*
🚮 *Causa:* Rompió las reglas`
        break
    }

    if (txt) {
      // 1. Manda imagen + texto
      await conn.sendMessage(m.chat, {
        image: typeof pp === 'string'? { url: pp } : pp,
        caption: txt,
        mentions: [userJid]
      })

      // 2. Si hay audio configurado lo manda
      if (audio) {
        if (Buffer.isBuffer(audio)) {
          await conn.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
        } else if (typeof audio === 'string' && audio.startsWith('http')) {
          await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
        }
      }
    }
  } catch (e) {
    console.error("Error en Bienvenida Audio:", e)
  }
  return!0
}

export default handler