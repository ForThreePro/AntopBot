let handler = async (m, { conn }) => {

  let q = m.quoted ? m.quoted : m

  let isSticker = q.mtype === 'stickerMessage' || (q.mimetype || '').includes('webp')

  if (!isSticker) {
    return m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Responde a un *sticker* 
*➤* Ejemplo: Responde al sticker + *toimg*

*━━━━━━━━━━*`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } })

    let media = await q.download()

    await conn.sendMessage(
      m.chat,
      {
        image: media,
        caption: `🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━━━━━━━━━*
*✅ STICKER CONVERTIDO*

*➤* Tu *sticker* ya es *imagen JPG*
*➤* Bot: *SAPITO BOT PREM*

*━━━━━━━━━━━━━━━━━━*`
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`🐸 *𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧* 🐸

*━━━━━━━━━━*
*❌ ERROR*

*➤* No pude convertir el *sticker*
*➤* Intenta con otro sticker

*━━━━━━━━━━*`)
  }

}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg','stickerimg','simg']

export default handler