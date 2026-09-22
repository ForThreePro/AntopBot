import moment from 'moment-timezone'
import crypto from 'crypto'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (command === 'setabrir' || command === 'setcerrar') {
        if (!m.quoted) return m.reply('🎀✨ Responde a un sticker con .setabrir o .setcerrar pe')
        try {
            let q = m.quoted
            let fileSha256 = q.msg?.fileSha256 || q.message?.stickerMessage?.fileSha256
            if (!fileSha256) {
                let buffer = await q.download()
                fileSha256 = crypto.createHash('sha256').update(buffer).digest()
            }
            let hash = Buffer.from(fileSha256).toString('base64')

            if (command === 'setabrir') {
                chat.stickerAbrir = hash
                console.log('[SETABRIR] Guardado:', hash)
            } else {
                chat.stickerCerrar = hash
                console.log('[SETCERRAR] Guardado:', hash)
            }

            let estado = command === 'setabrir' ? 'ABRIR' : 'CERRAR'
            let icon = command === 'setabrir' ? '🟢' : '🔴'
            await react(icon)

            let msg = `🎀 𓆩 𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𓆪 ✨💙

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ ${estado} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`GUARDADO\`\` ${icon} —˙𖦹.꒷
🎀 Este sticker quedó super kawaii ✨

── *📊 INFO ANTITOP* ╏ 💙
${icon} ➛ Tipo: *${estado}*
👑 ➛ Por: @${m.sender.split('@')[0]}
🔑 ➛ Hash: ${hash.slice(0,12)}...
✨ ➛ Estado: *Guardado*

━━━━━━━━━━━
🎀 *ANTITOP BOT - EDITION* ✨💙
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m })

        } catch (e) {
            console.log(e)
            return m.reply(`❌ Error: ${e.message}`)
        }
    }

    if (['resetsticker','delsticker','clearsticker','delabrir','delcerrar'].includes(command)) {
        let borrado = []
        if (['resetsticker','delsticker','clearsticker','delabrir'].includes(command) && chat.stickerAbrir) {
            delete chat.stickerAbrir
            borrado.push('🟢 ABRIR')
        }
        if (['resetsticker','delsticker','clearsticker','delcerrar'].includes(command) && chat.stickerCerrar) {
            delete chat.stickerCerrar
            borrado.push('🔴 CERRAR')
        }

        if (!borrado.length) {
            await react('❌')
            return m.reply(`🎀 𓆩 𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𓆪 ✨💙

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ RESET ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`VACIO\`\` ⚠️ —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No hay stickers configurados
💡 ➛ Usa .setabrir / .setcerrar

━━━━━━━━━━━
🎀 *ANTITOP BOT - EDITION* ✨💙
━━━━━━━━━━━`)
        }

        await react('🗑️')
        let msg = `🎀 𓆩 𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𓆪 ✨💙

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ ELIMINADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESETEADO\`\` 🗑️ —˙𖦹.꒷
🎀 Sticker eliminado, configura uno nuevo pe ✨

── *📊 BORRADOS* ╏ 💙
${borrado.map(b => `🗑️ ➛ ${b}`).join('\n')}
👑 ➛ Por: @${m.sender.split('@')[0]}

── *📝 NOTA* ╏ 🎀
🔒 ➛ Ya no se abrirá ni cerrará con sticker
💡 ➛ Configura de nuevo con .setabrir / .setcerrar

━━━━━━━━━━━
🎀 *ANTITOP BOT - EDITION* ✨💙
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m })
    }
}

handler.before = async function(m, { conn }) {
    if (m.mtype !== 'stickerMessage') return
    if (!m.isGroup) return
    if (!global.db.data.chats[m.chat]) return
    let chat = global.db.data.chats[m.chat]
    if (!chat.stickerAbrir && !chat.stickerCerrar) return

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    try {
        let fileSha256 = m.msg?.fileSha256 || m.message?.stickerMessage?.fileSha256
        if (!fileSha256) return
        let hash = Buffer.from(fileSha256).toString('base64')

        let isClose, estado, icon, reactEmoji, nota, msgAntitop

        if (chat.stickerAbrir && hash === chat.stickerAbrir) {
            isClose = 'not_announcement'; estado = 'ABIERTO'; icon = '🔓'; reactEmoji = '🎀'; 
            nota = '💬 ➛ Todos pueden hablar ahora'
            msgAntitop = '🎀✨ Grupo abierto, ¡hora de chismear! 💙'
        } else if (chat.stickerCerrar && hash === chat.stickerCerrar) {
            isClose = 'announcement'; estado = 'CERRADO'; icon = '🔒'; reactEmoji = '✨'; 
            nota = '🔒 ➛ Solo admins pueden hablar'
            msgAntitop = '💙✨ Grupo cerrado, modo tranquilito activado 🎀'
        } else return

        await conn.groupSettingUpdate(m.chat, isClose)
        await react(reactEmoji)

        let msg = `🎀 𓆩 𝗔𝗡𝗧𝗜𝗧𝗢𝗣 𝗕𝗢𝗧 𓆪 ✨💙

⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ ${estado} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` ${icon} —˙𖦹.꒷
${msgAntitop}

── *📊 INFO ANTITOP* ╏ 💙
${icon} ➛ Estado: *${estado}*
👑 ➛ Por: @${m.sender.split('@')[0]}

── *📝 NOTA* ╏ 🎀
${nota}

━━━━━━━━━━━
🎀 *ANTITOP BOT - EDITION* ✨💙
━━━━━━━━━━━`
        await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] }, { quoted: m })

    } catch (e) {
        console.log('[ERROR BEFORE]:', e)
    }
}

handler.help = ['setabrir', 'setcerrar', 'resetsticker', 'delabrir', 'delcerrar']
handler.tags = ['grupo']
handler.command = ['setabrir', 'setcerrar', 'resetsticker', 'delsticker', 'clearsticker', 'delabrir', 'delcerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler