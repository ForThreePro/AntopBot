import axios from 'axios'
import FormData from 'form-data'
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

// CONFIG API STELLAR
const api = {
    url: 'https://api.stellarwa.xyz',
    key: 'proyectsV2'
}

function generateUniqueFilename(mime) {
  const ext = mime.split('/')[1] || 'jpg'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${id}.${ext}`
}

async function uploadToUguu(buffer, mime) {
  const body = new FormData()
  body.append('files[]', buffer, generateUniqueFilename(mime))
  const res = await axios.post('https://uguu.se/upload.php', body, {
    headers: body.getHeaders(),
    timeout: 30000
  })
  const url = res.data?.files?.[0]?.url
  if (!url) throw 'No se pudo subir a Uguu'
  return url
}

async function upscaleImage(url) {
  const apiUrl = `${api.url}/tools/upscale?url=${encodeURIComponent(url)}&key=${api.key}`
  const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 })
  if (!res.data) throw 'Stellar HD no devolvió imagen'
  return Buffer.from(res.data)
}

let handler = async (m, { conn, usedPrefix, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''

    if (!mime) return m.reply(`Responde a una imagen con: ${usedPrefix + command}`)
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Solo se acepta imagen JPG/PNG`)
    }

    try {
      await m.react('⏳')

      // Proceso: Descargar > Uguu > HD
      const buffer = await q.download()
      const uploadedUrl = await uploadToUguu(buffer, mime)
      const hdBuffer = await upscaleImage(uploadedUrl)

      // Enviar imagen HD
      await conn.sendMessage(m.chat, {
        image: hdBuffer,
        caption: `*Resultado HD 2x*\nKey: proyects`
      }, { quoted: m })

      // Enviar también como documento
      await conn.sendMessage(m.chat, {
        document: hdBuffer,
        fileName: 'hd.png',
        mimetype: 'image/png',
        caption: `Documento HD 2x`
      }, { quoted: m })

      await m.react('✅')

    } catch (err) {
      await m.react('❌')
      await m.reply(`Error: ${err.message || err}`)
    }
}

handler.help = ['hd', 'upscale', 'remini']
handler.tags = ['tools', 'ai']
handler.command = /^(hd|upscale|remini)$/i
export default handler