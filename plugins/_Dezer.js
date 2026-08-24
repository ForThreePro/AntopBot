import axios from 'axios'

const API_URL = 'https://api.stellarwa.xyz/tools/newsletter'
const API_KEY = 'api-b6GCD'

let handler = async (m, { conn, text, usedPrefix }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) return m.reply(`📢 𓆩 ***𝗡𝗘𝗪𝗦𝗟𝗘𝗧𝗧𝗘𝗥 𝗜𝗡𝗙𝗢*** 𓆪 📢\n\n✨ *Manda el link del canal*\n📌 *Ejemplo:* ${usedPrefix}newsletter https://whatsapp.com/channel/0029VaisGFT3AzNMAqLVCJ2Z`)

    await m.react('🔍')
    try {
        let { data } = await axios.get(`${API_URL}?query=${encodeURIComponent(text)}&key=${API_KEY}`)
        
        if (!data?.status || !data?.data) {
            await m.react('❌')
            return m.reply(`❌ *No se pudo obtener info del canal*`)
        }

        let info = data.data
        let meta = info.thread_metadata
        let name = meta.name?.text || 'Sin nombre'
        let desc = meta.description?.text || 'Sin descripción'
        let followers = meta.subscribers_count || '0'
        let invite = meta.invite ? `https://whatsapp.com/channel/${meta.invite}` : text

        let caption = `📢 𓆩 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗖𝗔𝗡𝗔𝗟 𓆪 📢

.⃟𖥔 ݁. 𖦹˙— \`\`DETALLES\`\` —˙𖦹.📢꒷

*🏷 Nombre:* ${name}
*👥 Seguidores:* ${followers}
*📝 Descripción:* ${desc}
*✅ Estado:* ${info.state?.type || 'N/A'}
*🔗 Link:* ${invite}

👤 *Solicitado por:* ${user}
🏷 *Grupo:* ${groupName}

━━━━━━━━━━━
*Powered by*: ***Sapito Bot***`

        // Si tiene foto de perfil la manda
        if (meta.picture?.direct_path) {
            await conn.sendMessage(m.chat, {
                image: { url: `https://pps.whatsapp.net${meta.picture.direct_path}` },
                caption: caption,
                mentions: [m.sender]
            }, { quoted: m })
        } else {
            await m.reply(caption, { mentions: [m.sender] })
        }
        
        await m.react('✅')
    } catch (e) { 
        console.log(e)
        await m.react('❌')
        m.reply(`❌ *Error al obtener el canal*\n${e.message}`)
    }
}

handler.help = ['newsletter <link>']
handler.tags = ['tools']
handler.command = /^(newsletter|canal)$/i

export default handler