let handler = async (m, { conn }) => {
    
    if (!m.quoted) return m.reply(`❌ *Error*\nResponde DIRECTO a la foto/video de "ver 1 vez"`)
    
    let q = m.quoted
    
    // DETECCION FORZADA v2
    let msg = q.message || q.msg
    let type = Object.keys(msg)[0]
    let content = msg[type]
    
    let isViewOnce = content?.viewOnce 
                    || q.isViewOnce 
                    || q.mtype?.includes('viewOnce')
                    || content?.imageMessage?.viewOnce
                    || content?.videoMessage?.viewOnce

    if (!isViewOnce) 
        return m.reply(`❌ No detecté "ver 1 vez"\n\n1. Asegúrate de responder a la foto con ①\n2. No la abras antes\n3. El bot debe estar prendido cuando llega`)

    let media
    try {
        media = await q.download()
    } catch (e) {
        return m.reply(`💀 *Ya expiró*\nYa viste ese "ver 1 vez" o se borró del servidor.`)
    }
    
    if (!media) return m.reply(`❌ No se pudo descargar`)

    let caption = content.caption || content.text || ''
    let who = `@${q.sender.split('@')[0]}`

    // Enviar según tipo real
    if (type === 'imageMessage') {
        await conn.sendMessage(m.chat, { 
            image: media, 
            caption: `📸 *ANTI VER 1 VEZ*\n👤 De: ${who}\n👀 Guardado por: @${m.sender.split('@')[0]}\n\n${caption}`,
            mentions: [q.sender, m.sender] 
        })
        
    } else if (type === 'videoMessage') {
        await conn.sendMessage(m.chat, { 
            video: media, 
            caption: `🎥 *ANTI VER 1 VEZ*\n👤 De: ${who}\n👀 Guardado por: @${m.sender.split('@')[0]}\n\n${caption}`,
            mentions: [q.sender, m.sender] 
        })
        
    } else if (type === 'audioMessage') {
        await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/mp4', 
            ptt: content.ptt
        })
    } else {
        return m.reply(`❌ Solo fotos, videos y audios`)
    }

    await conn.sendMessage(m.chat, { react: { text: '🔓', key: m.key } })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: q.key } })
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['ver']
handler.group = true
handler.private = true

export default handler