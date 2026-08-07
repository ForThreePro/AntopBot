let handler = async (m, { conn, command }) => {

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🛸 *[ SON GOKU PREM ]* 🌌

> *Reiniciando sistema, por favor espere...*`)
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await m.react('👑')
            await conn.groupParticipantsUpdate(m.chat, [conn.user.jid], 'promote')
            await m.reply(`🐉 *Administrador asignado* 
Ya tengo poderes de admin en este grupo 💥`)
        } catch (e) {
            await m.react('❌')
            m.reply('❌ *Error:* No pude asignarme admin. Revisa que yo no sea admin ya o que no tengas permisos')
        }
    }
}

handler.help = ['reset', 'autoadmin']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin']
handler.rowner = true

export default handler