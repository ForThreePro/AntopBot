import { WAMessageStubType } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `💙 𐔌 ꒱ *𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 𐔌 ꒱ 💙\n\n🫐 *Solo admins pueden usar este comando*`, m)
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, `🫧 𐔌 ꒱ *𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔* 𐔌 ꒱ 🫧\n\n🟢 *Activada con audios* 💙`, m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, `🫧 𐔌 ꒱ *𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔* 𐔌 ꒱ 🫧\n\n🔴 *Desactivada* 🌀`, m)
  } else {
    await conn.reply(m.chat, `💙 𐔌 ꒱ *𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 𐔌 ꒱ 💙\n\n📌 *Uso:* ${m.prefix}bienvenida on/off 🦋`, m)
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

    let pp
    try {
      pp = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      pp = 'https://files.evogb.win/OdOIUP.jpg' // ← img en url FALLBACK ANTITOP
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = '', audio = null

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        audio = chat.audiowelcome
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🫧 𐔌 ꒱ ***𝗡𝗨𝗘𝗩𝗢 𝗕𝗘𝗕𝗘 𝗔𝗟 𝗚𝗥𝗨𝗣𝗢*** 𐔌 ꒱ 🫧\n\n💙 *${userTag}* llegó a *${groupName}* 🦋\n🫐 *Miembro N°:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        audio = chat.audiobye
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🌀 𐔌 ꒱ ***𝗦𝗘 𝗗𝗘𝗦𝗣𝗜𝗗𝗘*** 𐔌 ꒱ 🌀\n\n🫐 *${userTag}* salió de *${groupName}* 💙\n📉 *Quedamos:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        audio = chat.audiokick
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🪼 𐔌 ꒱ ***𝗙𝗨𝗘 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢*** 𐔌 ꒱ 🪼\n\n🥊 *${userTag}* fue sacado de *${groupName}*`
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
          await conn.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        } else if (typeof audio === 'string' && audio.startsWith('http')) {
          await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        }
      }
    }
  } catch (e) {
    console.error("Error en Bienvenida Audio:", e)
  }
  return!0
}

export default handler