import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `❌ *Solo admins*`, m)

  let chat = global.db.data.chats[m.chat] || {}
  global.db.data.chats[m.chat] = chat

  let action = command === 'onw'
  let type = args[0]?.toLowerCase()

  if (!type) {
    return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

📌 *Uso:*
${usedPrefix}on welcome
${usedPrefix}off bye
${usedPrefix}on kick`, m)
  }

  let estado = action? '🟢 Activado' : '🔴 Desactivado'

  if (['welcome','bienvenida'].includes(type)) chat.welcome = action
  else if (['bye','despedida'].includes(type)) chat.bye = action
  else if (['kick','expulsar'].includes(type)) chat.kick = action
  else return m.reply(`❌ Opciones: welcome, bye, kick`)

  await conn.reply(m.chat, `🐉 𓆩 ${type.toUpperCase()} 𓆪 🐉\n\n${estado}`, m)
}

handler.help = ['on <welcome/bye/kick>', 'off <welcome/bye/kick>']
handler.tags = ['config']
handler.command = /^(onw|offw)$/i // interno es onw/offw
handler.customPrefix = /^(\.|#|\!)(on|off)\s/i // PERO DETECTA.on y.off
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType ||!m.isGroup) return true
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat) return true

  const userJid = m.messageStubParameters?.[0] || m.participant
  if (!userJid) return true

  let pp
  try { pp = await conn.profilePictureUrl(userJid, 'image') }
  catch { pp = 'https://files.evogb.win/qS154V.jpg' }

  const userTag = `@${userJid.split('@')[0]}`
  const groupName = groupMetadata.subject
  const groupDesc = groupMetadata.desc || 'Sin descripción'
  const membersCount = groupMetadata.participants.length
  let txt = '', audio = null

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD && chat.welcome) {
    audio = chat.audiowelcome
    txt = chat.customWelcome?.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc).replace(/@count/gi, membersCount) ||
`🐉 𓆩 𝗡𝗨𝗘𝗩𝗢 𝗚𝗨𝗘𝗥𝗘𝗥𝗢 𓆪 🐉\n\n⚡ *${userTag}* se unió a *${groupName}*\n📊 *Miembro N°:* ${membersCount}`
  }
  else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE && chat.bye) {
    audio = chat.audiobye
    txt = chat.customBye?.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@count/gi, membersCount) ||
`🐉 𓆩 𝗦𝗘 𝗙𝗨𝗘 𓆪 🐉\n\n🏃‍♂️ *${userTag}* abandonó *${groupName}*\n📉 *Quedamos:* ${membersCount}`
  }
  else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE && chat.kick) {
    audio = chat.audiokick
    txt = chat.customKick?.replace(/@user/gi, userTag).replace(/@group/gi, groupName) ||
`🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉\n\n⚡ *${userTag}* fue eliminado de *${groupName}*`
  }

  if (txt) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: txt, mentions: [userJid] })
    if (audio) {
      if (Buffer.isBuffer(audio)) await conn.sendMessage(m.chat, { audio, mimetype: 'audio/ogg', ptt: true })
      else if (typeof audio === 'string' && audio.startsWith('http')) await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/ogg', ptt: true })
    }
  }
  return true
}

export default handler