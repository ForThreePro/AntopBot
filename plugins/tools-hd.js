import fetch from "node-fetch"
import FormData from "form-data"
import crypto from "crypto"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    let q = m.quoted? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let urlTarget = text? text.trim() : ''
    let start = Date.now() // INICIO DEL TIEMPO

    if (!urlTarget &&!/image\/(jpe?g|png)/.test(mime)) {
        return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘 𝗨𝗦𝗢 ：✿ 。

──愛 *𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗜𝗢𝗡* ╏ ❄️
⚠️ ➛ Responde a una imagen o envia un link
⚠️ ➛ Ejemplo: ${usedPrefix + command}
⚠️ ➛ Formatos: *JPG / PNG*

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`, m)
    }

    await m.react('⏳')
    try {
        let finalUrl = urlTarget

        if (!finalUrl && /image\/(jpe?g|png)/.test(mime)) {
            let imgBuffer = await q.download()
            let ext = mime.split('/')[1] || 'jpg'
            let filename = 'media-' + crypto.randomBytes(8).toString('hex') + '.' + ext

            let formulario = new FormData()
            formulario.append('file', imgBuffer, { filename, contentType: mime })

            let resUpload = await fetch(`https://api.evogb.org/tools/upload?key=${key}`, {
                method: 'POST',
                body: formulario,
                headers: {
                   ...formulario.getHeaders(),
                    'User-Agent': 'Mozilla/5.0'
                }
            })
            let jsonUpload = await resUpload.json()
            if (jsonUpload.status && jsonUpload.url) {
                finalUrl = jsonUpload.url
            } else {
                await m.react('❌')
                return m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ：✿ 。

──愛 *𝗗𝗘𝗧𝗔𝗟𝗟𝗘* ╏ ❄️
⚠️ ➛ Error al subir la imagen
⚠️ ➛ ${jsonUpload?.message || 'Sin respuesta'}

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`)
            }
        }

        let resDl = await fetch(`https://api.evogb.org/tools/upscale?method=url&url=${encodeURIComponent(finalUrl)}&key=${key}`)
        let contentType = resDl.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            let jsonDl = await resDl.json()
            await m.react('❌')
            return m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘 𝗔𝗣𝗜 ：✿ 。

──愛 *𝗗𝗘𝗧𝗔𝗟𝗟𝗘* ╏ ❄️
⚠️ ➛ ${jsonDl.message || 'No se pudo mejorar la imagen'}

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`)
        }

        let buffer = await resDl.buffer()
        let time = ((Date.now() - start) / 1000).toFixed(2) // CALCULAR TIEMPO

        let info = `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.✨꒷

 ⤷ ┇ 𝗜𝗠𝗔𝗚𝗘𝗡 𝗠𝗘𝗝𝗢𝗥𝗔𝗗𝗔 ：✿ 。
꒰ ◞⁺⊹ ．Mejora con Ki completada •

  ꒱ ׁ. ᘏ 𝗗𝗔𝗧𝗢𝗦 ׅ 𝆬 ָ֢ ෆ
✨ ➛ Tiempo: ${time} segundos
✨ ➛ Comando: ${command}
✨ ➛ Calidad: *Nivel 4K Super Saiyajin*

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369
> *"El poder del ki aumenta la resolucion"* ⚡`

        await conn.sendMessage(m.chat, { image: buffer, caption: info }, { quoted: m })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ：✿ 。

──愛 *𝗔𝗩𝗜𝗦𝗢* ╏ ❄️
⚠️ ➛ Error de sistema
⚠️ ➛ Intenta de nuevo en unos segundos

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`)
    }
}

handler.help = ['upscale', 'remini', 'hd', 'mejorar']
handler.tags = ['tools']
handler.command = /^(upscale|remini|hd|mejorar)$/i

export default handler