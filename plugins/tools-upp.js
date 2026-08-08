import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"

let handler = async (m, { conn }) => {
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 ：✿ 。

──愛 *𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗜𝗢𝗡* ╏ ❄️
⚠️ ➛ Responde a un archivo valido
⚠️ ➛ Formatos: *Imagen, Video, Audio, Doc*

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error()

    let txt = `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.🌌꒷

 ⤷ ┇ 𝗥𝗘𝗣𝗢𝗥𝗧𝗘 𝗗𝗘 𝗦𝗨𝗕𝗜𝗗𝗔 ：✿ 。
꒰ ◞⁺⊹ ．Archivo en la nube •

  ꒱ ׁ. ᘏ 𝗗𝗔𝗧𝗢𝗦 ׅ 𝆬 ָ֢ ෆ
🌌 ➛ Enlace: ${link.url}
🌌 ➛ ID: ${link.id || 'N/A'}
🌌 ➛ Tamaño: ${formatBytes(media.length)}
🌌 ➛ Servidor: *evogb.win*
🌌 ➛ Bot: *SON GOKU PREM*

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369
> *"Subido a la nube por Goku"* ☁️⚡`

    await conn.sendFile(m.chat, media, 'goku.' + link.url.split('.').pop(), txt, m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.reply(m.chat, `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.⚠️꒷

 ⤷ ┇ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘 𝗦𝗨𝗕𝗜𝗗𝗔 ：✿ 。

──愛 *𝗔𝗩𝗜𝗦𝗢* ╏ ❄️
⚠️ ➛ No se pudo subir el archivo
⚠️ ➛ Intenta con otro archivo

━━━━━━━━━━━
*Owner*: @whois.yallico | *Numero*: +51 927 174 369`, m)
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