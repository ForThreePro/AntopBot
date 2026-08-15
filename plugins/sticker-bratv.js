import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 - 𝗕𝗥𝗔𝗧 𝗩𝗜𝗗𝗘𝗢* 🐸

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Ingresa el texto para el *vídeo*
*➤* Ejemplo: *bratv hola sapito*

*━━━━━━━━━━*`)

  try {
    await m.react('⏳')
    const apiUrl = `${global.api.url2}/canvas/bratvideo?text=${encodeURIComponent(args.join(" "))}`
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(res.data, 'binary')

    // Convertir a sticker sin wm, sin nada
    const stiker = await sticker(buffer, false, '', '')

    if (!stiker) return m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR*

*➤* No se pudo convertir el *vídeo* en *sticker*

*━━━━━━━━━━*`)

    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    return m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR DE SISTEMA*

*➤* Error al generar el *vídeo*
*➤* Intenta de nuevo

*━━━━━━━━━━*`)
  }
}

handler.help = ['bratv <texto>']
handler.tags = ['sticker']
handler.command = ['bratv']
handler.limit = true

export default handler