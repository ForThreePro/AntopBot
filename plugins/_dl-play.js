import fetch from "node-fetch"
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text.trim()) return await conn.reply(m.chat, '🫐 Oops~ Pásame el nombre o link de la canción lindo 💙', m)

        const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
        const query = videoMatch? 'https://youtu.be/' + videoMatch[1] : text
        const search = await yts(query)
        const result = videoMatch? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]
        if (!result) throw '🌀 No encontré nada con ese nombre...'

        const { title, thumbnail, timestamp, views, videoId, author, seconds } = result
        if (seconds > 1800) throw '⏱️ Ay no~ El video pasa de 30 minutos y no puedo procesarlo'

        const vistas = formatViews(views)
        const canal = author.name
        const shortUrl = `https://youtu.be/${videoId}`

        const info = `╭─「 🪼 ANTITOP MUSIC 」
│
│ 💙 TÍTULO: ${title}
│ 👤 CANAL: ${canal}
│ 👁️ VISTAS: ${vistas}
│ ⏱️ DURACIÓN: ${timestamp}
│ 🔗 LINK: ${shortUrl}
│
╰──────── 𐔌 ꒱ ────────`

        const thumb = (await conn.getFile(thumbnail)).data // ← aquí hay img en url

        const [_, mediaUrl] = await Promise.all([
            conn.sendMessage(m.chat, { image: thumb, caption: info }, { quoted: m }),
            getMediaUrl(shortUrl)
        ])

        if (!mediaUrl) throw '❌ No pude sacar el audio... intenta con otra canción'

        await conn.sendMessage(m.chat, {
            audio: { url: mediaUrl },
            fileName: `Antitop_${title}.mp3`,
            mimetype: 'audio/mpeg'
        }, { quoted: m })

    } catch (e) {
        return await conn.reply(m.chat, typeof e === 'string'? e : '🌀 Ups, ocurrió un error: ' + e.message, m)
    }
}

async function getMediaUrl(url) {
    try {
        const res = await fetch(`https://api.sventy.store/api/ytdl?url=${encodeURIComponent(url)}`).then(r => r.json())
        return res.data?.download || null
    } catch {
        return null
    }
}

function formatViews(views) {
    if (views === undefined) return "No disponible"
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
    return views.toString()
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio', 'ytaudio']
handler.tags = ['descargas']
handler.group = true

export default handler