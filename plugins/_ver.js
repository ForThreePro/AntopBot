let handler = async (m, { conn }) => {
    
    if (!m.quoted) return m.reply(`❌ *Error*\nTienes que responder DIRECTO a la foto/video de "ver 1 vez"`)
    
    let q = m.quoted
    
    // Detecta viewOnce de 2 formas por si acaso
    let isViewOnce = q.isViewOnce || q.msg?.viewOnce || q.msg?.imageMessage?.viewOnce || q.msg?.videoMessage?.viewOnce
    
    if (!isViewOnce) 
        return m.reply(`❌ Ese mensaje no es de "ver 1 vez"\n\nResponde a la foto con el circulito ①`)

    let media
    try {
        media = await q.download()
    } catch (e) {
        return m.reply(`💀 *Ya fue*\nYa abriste ese "ver 1 vez" y se borró.`)
    }
    
    let caption = q.text || q.caption || ''
    let who = `@${q.sender.split('@')[0]}` // ahora sale quien envió la foto

    if (q.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { 
            image: media, 
            caption: `📸 *Desbloqueado por ${@m.sender.split('@')[0]}*\nEnviado por: ${who}\n\n${caption}`,
            mentions: [q.sender, m.sender] 
        }, { quoted: m })
        
    } else if (q.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { 
            video: media, 
            caption: `🎥 *Desbloqueado por @${m.sender.split('@')[0]}*\nEnviado por: ${who}\n\n${caption}`,
            mentions: [q.sender, m.sender] 
        }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['ver']
handler.group = true
handler.private = true

export default handler