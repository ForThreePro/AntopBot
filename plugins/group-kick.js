let handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

*Uso:*
.${command} @user → Para expulsar
.${command} → Responde al mensaje del user

> *Solo admins*`, m)

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) return conn.reply(m.chat, `🤖 *No puedo eliminarme a mí mismo.*`, m)
        if (mentionedJid === ownerGroup) return conn.reply(m.chat, `🩸 *No puedo eliminar al propietario del grupo.*`, m)
        if (mentionedJid === ownerBot) return conn.reply(m.chat, `🦠 *No puedo eliminar al dueño del bot.*`, m)
        if (isAdmin) return conn.reply(m.chat, `⚠️ *No puedo expulsar a un administrador.*`, m)

        await m.react('👢')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        conn.reply(m.chat, `🐉 𓆩 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`KICK\`\` —˙𖦹.🏆꒷

👢 *Usuario:* @${mentionedJid.split('@')[0]}
👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`, m, { mentions: [mentionedJid, m.sender] })
    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat, `❌ *Se ha producido un problema.*\n> *Error:* ${e.message}`, m)
    }
}

handler.help = ['kick @user']
handler.tags = ['grupos']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler