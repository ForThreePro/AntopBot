import fetch from "node-fetch"
import FormData from "form-data"
import crypto from "crypto"

const REMOVE_BG_KEY = '3SqybUm2S1uEb9yGzErTrdfP' // tu key de remove.bg
const EVOG_KEY = Buffer.from('c2FzdWtl', 'base64').toString('utf-8') // key de evogb

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`📷 𓆩 ***𝗥𝗘𝗠𝗢𝗩𝗘 𝗕𝗚 + 𝗛𝗗*** 𓆪 📷\n\n⚠️ *Responde a una imagen JPG/PNG*\n📌 *Ejemplo:* ${usedPrefix + command}`)
    }

    await m.react('⏳')
    let start = Date.now()
    
    try {
        // PASO 1: Descargar imagen
        let imgBuffer = await q.download()
        let ext = mime.split('/')[1] || 'jpg'
        
        // PASO 2: Subir a evogb para tener URL
        let filename = 'temp-' + crypto.randomBytes(8).toString('hex') + '.' + ext
        let formulario = new FormData()
        formulario.append('file', imgBuffer, { filename, contentType: mime })

        let resUpload = await fetch(`https://api.evogb.org/tools/upload?key=${EVOG_KEY}`, {
            method: 'POST',
            body: formulario,
            headers: { ...formulario.getHeaders(), 'User-Agent': 'Mozilla/5.0' }
        })
        let jsonUpload = await resUpload.json()
        if (!jsonUpload.status || !jsonUpload.url) throw new Error('Error al subir imagen')

        let urlImg = jsonUpload.url

        // PASO 3: Mejorar a HD con evogb
        let resHd = await fetch(`https://api.evogb.org/tools/upscale?method=url&url=${encodeURIComponent(urlImg)}&key=${EVOG_KEY}`)
        let bufferHd = await resHd.buffer()

        // PASO 4: Quitar fondo con remove.bg
        let formData = new FormData()
        formData.append('image_file', bufferHd, { filename: 'hd.png' })
        formData.append('size', 'auto')

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': REMOVE_BG_KEY },
            body: formData
        })

        if (!response.ok) throw new Error(`Error remove.bg: ${response.statusText}`)
        const resultBuffer = Buffer.from(await response.arrayBuffer())

        let time = ((Date.now() - start) / 1000).toFixed(2)
        
        let caption = `📷 𓆩 𝗛𝗗 + 𝗥𝗘𝗠𝗢𝗩𝗘 𝗕𝗚 𓆪 📷

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESO COMPLETADO\`\` —˙𖦹.📷꒷

*✅ Estado:* Imagen mejorada a 4K + Fondo eliminado
*⚡ Tiempo:* ${time} segundos
*📦 Calidad:* Ultra HD

━━━━━━━━━━━
*Powered by*: ***Sapito Bot***`

        await conn.sendMessage(m.chat, { image: resultBuffer, caption }, { quoted: m })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error:* ${e.message}`)
    }
}

handler.help = ['removebghd', 'hdremovebg']
handler.tags = ['tools']
handler.command = /^(removebghd|hdremovebg)$/i
handler.limit = true

export default handler