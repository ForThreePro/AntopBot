import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"

let handler = async (m, { conn }) => {
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗡𝗜𝗩𝗘𝗟 𝗗𝗜𝗢𝗦* 🐸

*━━━━━━━━━━*
*⚠️ ERROR DE USO ⚠️*

*Instrucciones:*
*➤* Responde a una _imagen, video, audio o documento_
*➤* Formatos: *Imagen | Video | Audio | Doc*

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error()

    let txt = `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗥𝗘𝗣𝗢𝗥𝗧𝗘* 🐸

*━━━━━━━━━━━━━━━━━━*
*✅ ARCHIVO SUBIDO CORRECTAMENTE*

*📊 DATOS DEL ARCHIVO*
*➤ Enlace:* ${link.url}
*➤ ID:* ${link.id || 'N/A'}
*➤ Peso:* ${formatBytes(media.length)}
*➤ Servidor:* _evogb.win_
*➤ Bot:* *SAPITO BOT PREM*

*━━━━━━━━━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369
> _"Guardado en la nube por Sapito Bot"_ ☁️⚡`

    await conn.sendFile(m.chat, media, 'sapito.' + link.url.split('.').pop(), txt, m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.reply(m.chat, `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗡𝗜𝗩𝗘𝗟 𝗗𝗜𝗢𝗦* 🐸

*━━━━━━━━━━*
*❌ ERROR DE SUBIDA ❌*

*Aviso:*
*➤* No se pudo subir el archivo
*➤* Intenta con otro archivo

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`, m)
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error()
  return await response.json()
}

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['upp', 'tourl'];
export default handler