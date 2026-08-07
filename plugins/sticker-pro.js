import { addExif, sticker } from '../lib/sticker.js'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    await m.react('⏳')

    // 1. WM / TAKE / ROBAR - SIN MARCA
    if (command === 'wm' || command === 'take' || command === 'robar') {
        if (!m.quoted) return error('Responde a un *Sticker*')
        let [packname,...author] = text.split('|')
        author = (author || []).join('|')
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) return error('Responde a un *Sticker*')
        let img = await m.quoted.download()
        if (!img) return error('Responde a un *Sticker*')

        try {
            let stiker = await addExif(img, packname || '', author || '')
            await conn.sendFile(m.chat, stiker, 'wm.webp', '', m)
            await m.react('✅')
        } catch (e) {
            console.error(e)
            await m.react('❌')
            error('Error al editar el sticker')
        }
    }

    // 2. S / STICKER / STIKER - SIN MARCA
    if (command === 's' || command === 'sticker' || command === 'stiker') {
        let q = m.quoted? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!/webp|image|video/g.test(mime)) return error('Responde a una imagen, video o gif')
        let img = await q.download()
        let stiker = await sticker(img, false, '', '')
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
        await m.react('✅')
    }

    // 3. QC / QUOTLY - AHORA TAMBIEN SIN MARCA
    if (command === 'qc' || command === 'quotly') {
        let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : null
        let authorName, txt, pp

        if (!args.length &&!(m.quoted && m.quoted.text)) return error('Ingresa un texto para el sticker quotly')

        if (mentionedJid && args.join(" ").includes("/")) {
            const joined = args.slice(1).join(" ")
            const [authorNameRaw,...textParts] = joined.split("/")
            authorName = authorNameRaw?.trim() || "Anónimo"
            txt = textParts.join("/").trim()
            pp = await conn.profilePictureUrl(mentionedJid, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
        } else if (!mentionedJid && args.join(" ").includes("/")) {
            const joined = args.join(" ")
            const [authorNameRaw,...textParts] = joined.split("/")
            authorName = authorNameRaw?.trim() || "Anónimo"
            txt = textParts.join("/").trim()
            pp = "https://files.catbox.moe/dpeqsr.jpg"
        } else if (!mentionedJid && args.length >= 1) {
            txt = args.join(" ")
            authorName = await conn.getName(m.sender).catch(() => "Anónimo")
            pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
        } else if (m.quoted && m.quoted.text) {
            txt = m.quoted.text
            authorName = await conn.getName(m.sender).catch(() => "Anónimo")
            pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
        } else {
            return error('Formato inválido')
        }

        if (!txt) return error('Ingresa un texto para el sticker')
        if (txt.length > 30) return error('Máximo 30 caracteres')

        const obj = {
            "type": "quote", "format": "png", "backgroundColor": "#000", "width": 512, "height": 768, "scale": 2,
            "messages": [{"entities": [], "avatar": true, "from": { "id": 1, "name": authorName || "Anónimo", "photo": { "url": pp } }, "text": txt, "replyMessage": {}}]
        }

        try {
            const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, { headers: { 'Content-Type': 'application/json' }})
            const buffer = Buffer.from(json.data.result.image, 'base64')
            const stiker = await sticker(buffer, false, '', '') // <-- AQUI LO CAMBIE, YA NO USA CONFIG

            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m)
                await m.react('✅')
            } else {
                await m.react('❌')
            }
        } catch (e) {
            console.error(e)
            await m.react('❌')
            error('Error al generar el sticker')
        }
    }

    // 4. EMOJIMIX / MIX
    if (command === 'emojimix' || command === 'mix') {
        let [emoji1, emoji2] = text.split(/[&+\s]+/)
        if (!emoji1 ||!emoji2) return error(`Uso: ${usedPrefix}emojimix 😃+🔥`)

        let url = `https://api.evogb.org/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}&key=sasuke`
        try {
            await conn.sendMessage(m.chat, { sticker: { url: url } }, { quoted: m })
            await m.react('✅')
        } catch (e) {
            await m.react('❌')
            error(`Error: ${e.message}`)
        }
    }

    function error(msg) {
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐄𝐑𝐎𝐑\`\` —˙𖦹.🏆꒷

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ ${msg}

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Algo salió mal en la técnica"* 💥`
        m.reply(texto)
    }
}

handler.help = ['wm <nombre>|<autor>', 's', 'qc <texto>', 'emojimix <emoji1>+<emoji2>']
handler.tags = ['sticker']
handler.command = /^(wm|take|robar|s|sticker|stiker|qc|quotly|emojimix|mix)$/i

export default handler