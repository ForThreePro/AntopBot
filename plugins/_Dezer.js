import axios from 'axios'

let handler = async (m, { conn, text }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) return m.reply(`🎵 𓆩 ***𝗗𝗘𝗘𝗭𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛*** 𓆪 🎵\n\n✨ *¿Qué canción deseas buscar?*\n📌 *Ejemplo:* ${m.prefix}deezer the weeknd`)

    await m.react('🔍')
    try {
        let { data } = await axios.get(`https://api.stellarwa.xyz/search/deezer?q=${encodeURIComponent(text)}&apikey=api-b6GCD`)
        if (!data.status || !data.result || data.result.length === 0) {
            await m.react('❌')
            return m.reply(`🎵 *No se encontraron resultados para:* ${text}`)
        }

        let res = data.result.slice(0, 5).map((v, i) => 
`*${i+1}.* *${v.title}*
👤 *Artista:* ${v.artist} | 💿 *Álbum:* ${v.album}
⏳ *Duración:* ${v.duration}
🔗 ${v.url}`).join('\n\n')

        let caption = `🎵 𓆩 𝗗𝗘𝗘𝗭𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛 𓆪 🎵

.⃟𖥔 ݁. 𖦹˙— \`\`TOP 5 RESULTADOS\`\` —˙𖦹.🎵꒷

${res}

👤 *Solicitado por:* ${user}
🏷 *Grupo:* ${groupName}

━━━━━━━━━━━
*Powered by*: ***Sapito Bot*** 
*Tip:* Responde con el número para descargar la canción`

        m.reply(caption, m.chat, { mentions: [m.sender] })
        await m.react('✅')
    } catch (e) { 
        console.log(e)
        await m.react('❌')
        m.reply(`❌ *Error al buscar en Deezer*`)
    }
}

handler.help = ['deezer <busqueda>']
handler.tags = ['descarga']
handler.command = /^(deezer|dz)$/i

export default handler