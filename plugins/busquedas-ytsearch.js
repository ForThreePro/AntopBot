import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n✨ *¿Qué deseas buscar en YouTube?*\n📌 *Ejemplo:* ${m.prefix}ytsearch king nasir`)

    await m.react('🔍')
    try {
        let { data } = await axios.get(`https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(text)}`)
        if (!data.data || data.data.length === 0) {
            await m.react('❌')
            return m.reply(`🌿 *No se encontraron resultados para:* ${text}`)
        }

        let res = data.data.slice(0, 5).map((v, i) => 
`*${i+1}.* *${v.title}*
⏳ *Duración:* ${v.duration} | 👁️ *Vistas:* ${v.views}
👤 *Canal:* ${v.author}
🔗 ${v.url}`).join('\n\n')

        let caption = `🐸 𓆩 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗦𝗘𝗔𝗥𝗖𝗛 𓆪 🐸

.⃟𖥔 ݁. 𖦹˙— \`\`TOP 5 RESULTADOS\`\` —˙𖦹.🍃꒷

${res}

━━━━━━━━━━━
*Powered by*: SAPITO BOT PREM 🍃
*Tip:* Usa .ytmp4 o .ytmp3 con el link`

        m.reply(caption)
        await m.react('✅')
    } catch { 
        await m.react('❌')
        m.reply(`❌ *Error al buscar en YouTube*`)
    }
}

handler.help = ['yts <busqueda>']
handler.tags = ['search']
handler.command = /^(yts|ytsearch)$/i

export default handler