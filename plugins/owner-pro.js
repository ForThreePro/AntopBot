import { exec } from "child_process"

let handler = async (m, { conn, command }) => {
    const owner = "@whois.yallico"

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗥𝗘𝗦𝗘𝗧* 🐸

*━━━━━━━━━━*
*🔄 REINICIANDO SISTEMA*

> _Por favor espera unos segundos..._

*━━━━━━━━━━*`)
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await m.react('👑')
            await conn.groupParticipantsUpdate(m.chat, [conn.user.jid], 'promote')
            await m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗔𝗗𝗠𝗜𝗡* 🐸

*━━━━━━━━━━*
*✅ ADMINISTRADOR ASIGNADO*

*➤* Ya tengo poderes de *admin* en este grupo

*━━━━━━━━━━*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR*

*➤* No pude asignarme *admin*
*➤* Revisa que ya no sea admin o que tengas permisos

*━━━━━━━━━━*`)
        }
    }

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        if (m.react) await m.react('🌀')

        await conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗨𝗣𝗗𝗔𝗧𝗘* 🐸

*━━━━━━━━━━*
*🌀 ACTUALIZANDO MODULOS*

> _Obteniendo cambios del repositorio..._

*━━━━━━━━━━*`, m)

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                if (m.react) await m.react('❌')
                return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR EN LA ACTUALIZACION*

*➤* Detalle: 
\`\`${err.message}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
            }

            if (stdout.includes('Already up to date.')) {
                if (m.react) await m.react('✅')
                return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*✅ SISTEMA ACTUALIZADO*

*➤* El sistema ya está en su *versión más reciente*

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
            }

            if (m.react) await m.react('✅')
            return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*✅ ACTUALIZACION APLICADA*

*📋 Cambios:*
\`\`${stdout}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler