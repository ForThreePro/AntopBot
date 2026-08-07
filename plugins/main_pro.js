import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    await m.react('⏳')

    if (command === 'cleartmp') {
        const tmpPath = './tmp'
        if (fs.existsSync(tmpPath)) {
            fs.readdirSync(tmpPath).forEach(file => fs.unlinkSync(`${tmpPath}/${file}`))
        }
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐋𝐈𝐌𝐏𝐈𝐄𝐙𝐀\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗖𝗔𝗖𝗛𝗘 𝗣𝗨𝗥𝗜𝗙𝗜𝗖𝗔𝗗𝗢 ：✿ 。

──愛 *𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢* ╏ 🔥
🔥 ➛ Caché temporal eliminado
🔥 ➛ Memoria liberada con éxito

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ El bot está más ligero

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"He purificado los restos del entrenamiento"* 💥`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'cpu') {
        let cpu = os.loadavg()[0].toFixed(2)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐂𝐏𝐔\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗣𝗥𝗢𝗖𝗘𝗦𝗔𝗗𝗢𝗥 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Carga CPU: ${cpu}%

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Si supera 90% el bot va lento

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Mi ki se está enfocando al ${cpu}%"* 💥`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'ram') {
        const used = process.memoryUsage()
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐑𝐀𝐌\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗠𝗘𝗠𝗢𝗥𝗜𝗔 𝗘𝗡 𝗨𝗦𝗢 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Consumo RAM: ${ram} MB

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Memoria usada por el proceso

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Tengo suficiente energía para seguir"* 💥`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'uptime') {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐔𝐏𝐓𝐈𝐌𝐄\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗧𝗜𝗘𝗠𝗣𝗢 𝗔𝗖𝗧𝗜𝗩𝗢 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Tiempo activo: ${uptime}

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Desde que se inició el bot

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Llevo entrenando ${uptime} sin parar"* 💥`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'info') {
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)
        const used = process.memoryUsage()
        let cpu = os.loadavg()[0].toFixed(2)
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)

        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐃𝐄 𝐒𝐈𝐒𝐓𝐄𝐌𝐀\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🔥
🔥 ➛ Uptime: ${muptime}
🔥 ➛ Memoria RAM: ${ram} MB
🔥 ➛ Carga CPU: ${cpu}%

──愛 *𝗗𝗘𝗧𝗔𝗟𝗘𝗦* ╏ 🌌
🌌 ➛ Desarrollado por: Sebastián Barboza
🌌 ➛ Estado: Operativo

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Todos mis sistemas están al 100%"* 💥`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'tts' || command === 'gtts' || command === 'ttss') {
        let q = m.quoted? m.quoted : m
        let txt = text || q.text || q.caption || q.body || ''

        if (!txt) {
            let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐄𝐑𝐎𝐑\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗙𝗔𝗟𝗧𝗔 𝗧𝗘𝗫𝗧𝗢 ：✿ 。

──愛 *𝗨𝗦𝗢* ╏ 🔥
🔥 ➛ Escribe el texto que deseas convertir a audio
🔥 ➛ O responde a un mensaje

──愛 *𝗘𝗝𝗘𝗠𝗣𝗟𝗢* ╏ 🌌
🌌 ➛ ${usedPrefix}tts Hola, ¿cómo estás?

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Necesito escuchar tus palabras guerrero"* 💥`
            await m.react('❌')
            return m.reply(texto)
        }

        await m.react('🎙️')

        let lang = 'es'
        let url = googleTTS.getAudioUrl(txt, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `${Date.now()}.opus`)

        await new Promise((resolve, reject) => {
            ffmpeg(url)
               .audioCodec('libopus')
               .toFormat('opus')
               .outputOptions([
                    '-avoid_negative_ts make_zero',
                    '-ac 1',
                    '-b:a 64k'
                ])
               .on('end', () => resolve(true))
               .on('error', (err) => reject(err))
               .save(tmpFilePath)
        })

        let audioBuffer = fs.readFileSync(tmpFilePath)

        let caption = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐓𝐄𝐗𝐓 𝐓𝐎 𝐒𝐏𝐄𝐂𝐇\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗔𝗨𝗗𝗜𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 ：✿ 。

──愛 *𝗜𝗡𝗙𝗢* ╏ 🔥
🔥 ➛ Idioma: Español
🔥 ➛ Voz: Google TTS

──愛 *𝗧𝗘𝗫𝗧𝗢* ╏ 🌌
🌌 ➛ "${txt}"

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"He convertido tu ki en sonido"* 💥`

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
        await m.react('✅')
    }
}

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['cleartmp', 'cpu', 'ram', 'uptime', 'info', 'tts <texto>']
handler.tags = ['main', 'tools']
handler.command = /^(cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
handler.rowner = true

export default handler