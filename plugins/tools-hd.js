import fetch from "node-fetch"
import FormData from "form-data"
import crypto from "crypto"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    let q = m.quoted? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let urlTarget = text? text.trim() : ''
    let start = Date.now()

    if (!urlTarget &&!/image\/(jpe?g|png)/.test(mime)) {
        return conn.reply(m.chat, `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗛𝗗* 🐱

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*Instrucciones:*
*➤* Responde a una *imagen JPG/PNG*
*➤* O envia un *link de imagen*
*➤* Ejemplo: *${usedPrefix + command}*

*Formatos:* *JPG | PNG*

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`, m)
    }

    await m.react('⏳')
    try {
        let finalUrl = urlTarget

        if (!finalUrl && /image\/(jpe?g|png)/.test(mime)) {
            let imgBuffer = await q.download()
            let ext = mime.split('/')[1] || 'jpg'
            let filename = 'garfield-' + crypto.randomBytes(8).toString('hex') + '.' + ext

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
                return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗛𝗗* 🐱

*━━━━━━━━━━*
*❌ ERROR AL SUBIR*

*➤* No se pudo subir la imagen
*➤* Detalle: ${jsonUpload?.message || 'Sin respuesta'}

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`)
            }
        }

        let resDl = await fetch(`https://api.evogb.org/tools/upscale?method=url&url=${encodeURIComponent(finalUrl)}&key=${key}`)
        let contentType = resDl.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            let jsonDl = await resDl.json()
            await m.react('❌')
            return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗛𝗗* 🐱

*━━━━━━━━━━*
*❌ ERROR DE API*

*➤* ${jsonDl.message || 'No se pudo mejorar la imagen'}

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`)
        }

        let buffer = await resDl.buffer()
        let time = ((Date.now() - start) / 1000).toFixed(2)

        let info = `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗛𝗗* 🐱

*━━━━━━━━━━*
*✅ IMAGEN MEJORADA*

*📊 DATOS*
*➤ Tiempo:* ${time} segundos
*➤ Comando:* *${command}*
*➤ Calidad:* *4K Ultra HD*
*➤ Bot:* ***Garfield Bot Oficial***

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369
> _"Mejorado con IA por Garfield Bot"_ ✨`

        await conn.sendMessage(m.chat, { image: buffer, caption: info }, { quoted: m })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗛𝗗* 🐱

*━━━━━━━━━━*
*❌ ERROR DE SISTEMA*

*➤* Error al procesar la imagen
*➤* Intenta de nuevo en unos segundos

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`)
    }
}

handler.help = ['upscale', 'remini', 'hd', 'mejorar']
handler.tags = ['tools']
handler.command = /^(upscale|remini|hd|mejorar)$/i

export default handler