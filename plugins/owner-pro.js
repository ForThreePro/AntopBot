import { exec } from "child_process"

let handler = async (m, { conn, command }) => {
    const owner = "@whois.yallico"

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

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

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        if (m.react) await m.react('🌀')

        await conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

> *Actualizando módulos del repositorio...*`, m)

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                if (m.react) await m.react('❌')
                return conn.reply(m.chat, `🐉 𓆩 𝗘𝗥𝗢𝗥 𓆪 🐉

*Fallo en la actualización.*

\`\`${err.message}\`\`\`

*Owner*: ${owner}`, m)
            }

            if (stdout.includes('Already up to date.')) {
                if (m.react) await m.react('✅')
                return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

*El sistema ya se encuentra en su versión más reciente.*

*Owner*: ${owner}`, m)
            }

            if (m.react) await m.react('✅')
            return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

*Actualización aplicada con éxito.*

*Cambios:*
\`\`${stdout}\`\`

*Owner*: ${owner}`, m)
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler