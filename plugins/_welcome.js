import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `❌ *Solo admins pueden usar este comando*`, m)
  let chat = global.db.data.chats[m.chat] || {}
  global.db.data.chats[m.chat] = chat

  let action = command.toLowerCase() // on o off
  let type = args[0]?.toLowerCase() // welcome, bye, kick

  if (!type) {
    return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

📌 *Uso correcto:*
${usedPrefix}on welcome
${usedPrefix}off bye
${usedPrefix}on kick

*Opciones:* welcome, bye, kick`, m)
  }

  let isEnable = action === 'on'
  let estado = isEnable? '🟢 Activado' : '🔴 Desactivado'

  switch (type) {
    case 'welcome': case 'bienvenida':
      chat.welcome = isEnable
      await conn.reply(m.chat, `🐉 𓆩 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 𓆪 🐉\n\n${estado} *mensajes de entrada*`, m)
      break
    case 'bye': case 'despedida':
      chat.bye = isEnable
      await conn.reply(m.chat, `🐉 𓆩 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 𓆪 🐉\n\n${estado} *mensajes de salida*`, m)
      break
    case 'kick': case 'expulsar':
      chat.kick = isEnable
      await conn.reply(m.chat, `🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗜𝗢𝗡 𓆪 🐉\n\n${estado} *mensajes de expulsión*`, m)
      break
    default:
      await conn.reply(m.chat, `❌ *Opción no válida*\nUsa: welcome, bye, kick`, m)
  }
}

handler.help = ['on <welcome/bye/kick>', 'off <welcome/bye/kick>']
handler.tags = ['config']
handler.command = /^(on|off)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat) return true

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return true

    let pp
    try {
      pp = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      pp = 'https://files.evogb.win/qS154V.jpg'
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = '', audio = null

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        if (!chat.welcome) return true
        audio = chat.audiowelcome
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc).replace(/@count/gi, membersCount) :
`🐉 𓆩 𝗡𝗨𝗘𝗩𝗢 𝗚𝗨𝗘𝗥𝗘𝗥𝗢 𓆪 🐉\n\n⚡ *${userTag}* se unió a *${groupName}*\n📊 *Miembro N°:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        if (!chat.bye) return true
        audio = chat.audiobye
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@count/gi, membersCount) :
`🐉 𓆩 𝗦𝗘 𝗙𝗨𝗘 𓆪 🐉\n\n🏃‍♂️ *${userTag}* abandonó *${groupName}*\n📉 *Quedamos:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        if (!chat.kick) return true
        audio = chat.audiokick
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉\n\n⚡ *${userTag}* fue eliminado de *${groupName}*`
        break
    }

    if (txt) {
      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: txt,
        mentions: [userJid]
      })

      if (audio) {
        if (Buffer.isBuffer(audio)) {
          await conn.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg', ptt: false })
        } else if (typeof audio === 'string' && audio.startsWith('http')) {
          await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false })
        }
      }
    }
  } catch (e) {
    console.error("Error en Bienvenida:", e)
  }
  return true
}

export default handler