let handler = async (m, { conn }) => {
    
    if (!m.quoted) return m.reply(`❌ *Error*\nResponde a una foto, video o audio de "ver 1 vez" con *.ver*`)
    
    let q = m.quoted
    
    if (!q.isViewOnce && !q.msg?.viewOnce) 
        return m.reply(`❌ Ese mensaje no es de "ver 1 vez"`)

    let media
    try {
        media = await q.download()
    } catch (e) {
        return m.reply(`💀 *Ya fue*\nEse "ver 1 vez" ya se abrió o expiró.`)
    }
    
    if (!media) return m.reply(`❌ No se pudo descargar`)

    let caption = q.text || q.caption || ''
    let who = `@${m.sender.split('@')[0]}`

    if (q.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { 
            image: media, 
            caption: `📸 *Guardado con .ver*\n👤 Por: ${who}\n\n${caption}`,
            mentions: [m.sender] 
        }, { quoted: m })
        
    } else if (q.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { 
            video: media, 
            caption: `🎥 *Guardado con .ver*\n👤 Por: ${who}\n\n${caption}`,
            mentions: [m.sender] 
        }, { quoted: m })
        
    } else if (q.mtype === 'audioMessage' || q.mtype === 'pttMessage') {
        await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/mp4', 
            ptt: true
        }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['ver']
handler.group = true

export default handler