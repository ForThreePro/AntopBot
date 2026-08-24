import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "MEJORA CALIDAD 🔥🥷",
        jpegThumbnail: await (await fetch('https://files.catbox.moe/zzdz89.jpg')).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Unlimited;;;\n" +
          "FN:Unlimited\n" +
          "ORG:Unlimited\n" +
          "TITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\n" +
          "X-WA-BIZ-NAME:Unlimited\n" +
          "END:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  }


  if (!/image\/(jpe?g|png)/i.test(mime)) {
    const mensajeError = `
🔴 *Formato no soportado*

Este comando solo funciona con imágenes en formato *JPG* o *PNG*.

📌 *Instrucciones:*
1. Envía una imagen o responde a una.
2. Escribe el comando: *${usedPrefix + command}*

💡 Consejo: mejora imágenes borrosas o pixeladas.
`.trim()

    await conn.sendMessage(m.chat, {
      text: mensajeError,
      mentions: conn.parseMention(mensajeError)
    }, { quoted: fkontak })

    return
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const media = await quoted.download()
    const ext = mime.split('/')[1]
    const filename = `mejorada_${Date.now()}.${ext}`

    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'es'
    }

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()

    if (!json?.result_url || !json.result_url.startsWith('http')) {
      throw new Error('No se pudo obtener la imagen mejorada desde Pixelcut.')
    }

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    const mensajeFinal = `
✨ *Imagen mejorada exitosamente*

📈 Resolución duplicada con mayor nitidez.

🔍 Ideal para mejorar calidad en fotos borrosas o pixeladas.
`.trim()

    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: mensajeFinal
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`❌ *Error al mejorar la imagen:*\n${err.message || err}`)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = /^hd$/i

export default handler