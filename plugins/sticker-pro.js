import { addExif, sticker } from '../lib/sticker.js'
import axios from 'axios'
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('⏳')

    // 1. WM / TAKE / ROBAR
    if (command === 'wm' || command === 'take' || command === 'robar') {
        if (!m.quoted) return error('Responde a un *Sticker*')
        let [packname,...author] = text.split('|')
        author = (author || []).join('|')
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) return error('Responde a un *Sticker*')
        let img = await m.quoted.download()
        if (!img) return error('Responde a un *Sticker*')

        try {
            let stiker = await addExif(img, packname || global.packname, author || global.author)
            await conn.sendFile(m.chat, stiker, 'wm.webp', '', m)
            await m.react('✅')
        } catch (e) {
            console.error(e)
            await m.react('❌')
        }
    }

    // 2. S / STICKER / STIKER
    if (command === 's' || command === 'sticker' || command === 'stiker') {
        let q = m.quoted? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!/webp|image|video/g.test(mime)) return error('Responde a una imagen, video o gif')
        let img = await q.download()
        let stiker = await sticker(img, false, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
        await m.react('✅')
    }

    // 3. QC / QUOTLY
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
            "type": "quote",
            "format": "png",
            "backgroundColor": "#000",
            "width": 512,
            "height": 768,
            "scale": 2,
            "messages": [{
                "entities": [],
                "avatar": true,
                "from": { "id": 1, "name": authorName || "Anónimo", "photo": { "url": pp } },
                "text": txt,
                "replyMessage": {}
            }]
        }

        try {
            const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, {
                headers: { 'Content-Type': 'application/json' }
            })
            const buffer = Buffer.from(json.data.result.image, 'base64')
            const stiker = await sticker(buffer, false, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m)
            await m.react('✅')
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

    // 5. BRAT
    if (command === 'brat') {
        let q = m.quoted? m.quoted : m
        let txt = text || q.text || q.caption || q.body || ''
        if (!txt) return error(`Escribe el texto para el sticker Brat`)

        await m.react('🖌️')
        let isAnimated = false
        let apiUrl = `https://api.evogb.org/tools/brat?text=${encodeURIComponent(txt)}&animated=${isAnimated}&key=sasuke`

        let response = await fetch(apiUrl)
        if (!response.ok) return error('Error al generar el sticker')

        let inputBuffer = await response.buffer()
        let ext = 'png'
        let tmpInput = path.join(tmpdir(), `${Date.now()}.${ext}`)
        let tmpOutput = path.join(tmpdir(), `${Date.now()}.webp`)

        fs.writeFileSync(tmpInput, inputBuffer)

        await new Promise((resolve, reject) => {
            ffmpeg(tmpInput)
              .videoFilters('scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000')
              .toFormat('webp')
              .on('end', () => resolve(true))
              .on('error', (err) => reject(err))
              .save(tmpOutput)
        })

        let stickerBuffer = fs.readFileSync(tmpOutput)
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

        if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput)
        if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput)
        await m.react('✅')
    }

    function error(msg) {
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐄𝐑𝐑𝐎𝐑\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗔𝗩𝗜𝗦𝗢 ：✿ 。

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ ${msg}

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Algo salió mal en la técnica"* 💥`
        m.reply(texto)
    }
}

handler.help = ['wm <nombre>|<autor>', 's', 'qc <texto>', 'emojimix <emoji1>+<emoji2>', 'brat <texto>']
handler.tags = ['sticker']
handler.command = /^(wm|take|robar|s|sticker|stiker|qc|quotly|emojimix|mix|brat)$/i

export default handler