import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply("《✧》 Ingresa el texto para el vídeo.")

  try {
    const apiUrl = `${global.api.url2}/canvas/bratvideo?text=${encodeURIComponent(args.join(" "))}`
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(res.data, 'binary')

    // Convertir a sticker sin wm, sin nada
    const stiker = await sticker(buffer, false, '', '')

    if (!stiker) return m.reply('《✧》 No se pudo convertir el vídeo en sticker.')

    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('《✧》 Error al generar el vídeo.')
  }
}

handler.help = ['bratv']
handler.tags = ['tools']
handler.command = ['bratv']
handler.limit = true

export default handler