import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `❌ *Solo admins*`, m)
  let chat = global.db.data.chats[m.chat] || {}
  global.db.data.chats[m.chat] = chat

  let action = command.toLowerCase().replace('w','') // onw -> on, offw -> off
  let type = args[0]?.toLowerCase()

  if (!type) {
    return conn.reply(m.chat, `🐉 𓆩 𝗖𝗢𝗡𝗙𝗜𝗚 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𓆪 🐉

📌 *Uso:*
${usedPrefix}onw welcome
${usedPrefix}offw bye
${usedPrefix}onw kick

*Opciones:* welcome, bye, kick`, m)
  }

  let isEnable = action === 'on'
  let estado = isEnable? '🟢 Activado' : '🔴 Desactivado'

  if (type === 'welcome' || type === 'bienvenida') chat.welcome = isEnable
  else if (type === 'bye' || type === 'despedida') chat.bye = isEnable
  else if (type === 'kick' || type === 'expulsar') chat.kick = isEnable
  else return m.reply(`❌ Opciones: welcome, bye, kick`)

  await conn.reply(m.chat, `🐉 𓆩 ${type.toUpperCase()} 𓆪 🐉\n\n${estado}`, m)
}

handler.help = ['onw <welcome/bye/kick>', 'offw <welcome/bye/kick>']
handler.tags = ['config']
handler.command = /^(onw|offw)$/i // NUEVOS COMANDOS
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType ||!m.isGroup) return true
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat) return true

  const userJid = m.messageStubParameters?.[0] || m.participant
  if (!userJid) return true

  // DEBUG: descomenta esto para ver si entra al before
  // console.log("STUBTYPE:", m.messageStubType, "CHAT:", chat)

  let pp
  try { pp = await conn.profilePictureUrl(userJid, 'image') }
  catch { pp = 'https://files.evogb.win/qS154V.jpg' }

  const userTag = `@${userJid.split('@')[0]}`
  const groupName = groupMetadata.subject
  const groupDesc = groupMetadata.desc || 'Sin descripción'
  const membersCount = groupMetadata.participants.length
  let txt = '', audio = null

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    if (!chat.welcome) return true
    audio = chat.audiowelcome
    txt = chat.customWelcome?.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc).replace(/@count/gi, membersCount) ||
`🐉 𓆩 𝗡𝗨𝗘𝗩𝗢 𝗚𝗨𝗘𝗥𝗘𝗥𝗢 𓆪 🐉\n\n⚡ *${userTag}* se unió a *${groupName}*\n📊 *Miembro N°:* ${membersCount}`
  }
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    if (!chat.bye) return true
    audio = chat.audiobye
    txt = chat.customBye?.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@count/gi, membersCount) ||
`🐉 𓆩 𝗦𝗘 𝗙𝗨𝗘 𓆪 🐉\n\n🏃‍♂️ *${userTag}* abandonó *${groupName}*\n📉 *Quedamos:* ${membersCount}`
  }
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    if (!chat.kick) return true
    audio = chat.audiokick
    txt = chat.customKick?.replace(/@user/gi, userTag).replace(/@group/gi, groupName) ||
`🐉 𓆩 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉\n\n⚡ *${userTag}* fue eliminado de *${groupName}*`
  }

  if (txt) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: txt, mentions: [userJid] })
    if (audio) {
      if (Buffer.isBuffer(audio)) await conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg', ptt: false })
      else if (typeof audio === 'string' && audio.startsWith('http')) await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false })
    }
  }
  return true
}

export default handler