let handler = async (m, { conn, usedPrefix, command }) => {

if (!m.quoted) return conn.reply(m.chat, `💙 𐔌 ꒱ ***𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𐔌 ꒱ 💙

*Uso:* 🫧 Responde al mensaje que deseas eliminar con *${usedPrefix + command}* 🦋`, m)

try {
let delet = m.message.extendedTextMessage.contextInfo.participant
let bang = m.message.extendedTextMessage.contextInfo.stanzaId
await m.react('🗑️')
return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
 } catch {
await m.react('🗑️')
return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}
}

handler.help = ['del @msg']
handler.tags = ['grupos']
handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler