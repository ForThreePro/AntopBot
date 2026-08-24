import axios from 'axios'

const API_URL = 'https://api.stellarwa.xyz/search/deezer'
const API_KEY = 'api-b6GCD'

let handler = async (m, { conn, text, usedPrefix }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) return m.reply(`🎵 𓆩 ***𝗗𝗘𝗘𝗭𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛*** 𓆪 🎵\n\n✨ *¿Qué canción deseas buscar?*\n📌 *Ejemplo:* ${usedPrefix}deezer Bad Bunny`)

    await m.react('🔍')
    try {
        let { data } = await axios.get(`${API_URL}?query=${encodeURIComponent(text)}&key=${API_KEY}`)
        
        if (!data?.result || data.result.length === 0) {
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
*Powered by*: ***Sapito Bot***`

        await conn.sendMessage(m.chat, { 
            image: { url: data.result[0].thumbnail },
            caption: caption,
            mentions: [m.sender]
        }, { quoted: m })
        
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