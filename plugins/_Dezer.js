const rmbg = await import('../../storage/script/removebg.js');

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Umhhh... y la foto??')
    await m.react('⏳')
    let dor = await rmbg.removeBg(await q.download());
    let buffer = Buffer.from(dor, 'base64');
    await conn.sendMessage(m.chat, { image: buffer, caption: 'Se eliminó con éxito el fondo de la foto.' }, { quoted: m })
    await m.react('✅')
}

handler.help = ['removebg']
handler.tags = ['tools']
handler.command = ['removebg']
handler.limit = true

export default handler