import ytSearch from 'yt-search'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n✨ *¿Qué quieres buscar?*\n📌 *Ejemplo:* ${m.prefix}google sapito bailando`)

    await m.react('🔍')

    try {
        let search = await ytSearch(text)
        let results = search.videos.slice(0, 5)

        if (!results.length) {
            await m.react('❌')
            return m.reply('🌿 *No encontré resultados.*')
        }

        let txt = `🐸 𓆩 𝗕𝗨𝗦𝗖𝗔𝗗𝗢𝗥 𝗦𝗔𝗣𝗜𝗧𝗢 𓆪 🐸

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADOS\`\` —˙𖦹.🍃꒷

🔎 *Buscando:* ${text}

${results.map((v, i) => {
            return `*${i + 1}.* *${v.title}*
🕒 *Duración:* ${v.timestamp}
👁️ *Vistas:* ${v.views}
👤 *Canal:* ${v.author.name}
🔗 ${v.url}`
        }).join('\n\n')}

━━━━━━━━━━━━━━
*Powered by*: SAPITO BOT PREM 🍃
*Tip:* Usa .ytmp4 o .ytmp3 + el link`

        await conn.reply(m.chat, txt, m)
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('🌿 *Error:* No se pudo realizar la búsqueda.')
    }
}

handler.help = ['google <busqueda>']
handler.tags = ['search']
handler.command = /^google$/i

export default handler