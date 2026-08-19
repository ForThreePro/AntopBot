import ytSearch from 'yt-search'

let handler = async (m, { conn, text }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) return m.reply(`🐱 𓆩 ***𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🐱\n\n✨ *¿Qué quieres buscar?*\n📌 *Ejemplo:* ${m.prefix}google garfield comiendo lasaña`)

    await m.react('🔍')

    try {
        let search = await ytSearch(text)
        let results = search.videos.slice(0, 5)

        if (!results.length) {
            await m.react('❌')
            return m.reply('🍕 *No encontré resultados.*')
        }

        let txt = `🐱 𓆩 𝗕𝗨𝗦𝗖𝗔𝗗𝗢𝗥 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𓆪 🐱

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADOS\`\` —˙𖦹.🍕꒷

🔎 *Buscando:* ${text}

${results.map((v, i) => {
            return `*${i + 1}.* *${v.title}*
🕒 *Duración:* ${v.timestamp}
👁️ *Vistas:* ${v.views}
👤 *Canal:* ${v.author.name}
🔗 ${v.url}`
        }).join('\n\n')}

👤 *Solicitado por:* ${user}
🏷 *Grupo:* ${groupName}

━━━━━━━━━━━━━━
*Powered by*: ***Garfield Bot Oficial*** 🍕
*Tip:* Usa .ytmp4 o .ytmp3 + el link`

        await conn.reply(m.chat, txt, m, { mentions: [m.sender] })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('🍕 *Error:* No se pudo realizar la búsqueda.')
    }
}

handler.help = ['google <busqueda>']
handler.tags = ['search']
handler.command = /^google$/i

export default handler