import fetch from "node-fetch"
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text.trim()) return conn.reply(m.chat, `✨ *¡Ups! Ingresa el nombre o link de YouTube.* \n\n> *Ejemplo:* ${usedPrefix + command} Yan Block - 444`, m)

        await m.react('🔍')

        // Busqueda en YouTube
        const search = await yts(text)
        const result = search.all[0]
        if (!result) throw '❌ No se encontraron resultados para tu búsqueda.'

        const { title, thumbnail, timestamp, views, url, author } = result

        // --- INFO DEL VIDEO ---
        const info = `╔══🎬 *YOUTUBE DOWNLOADER* 🎬══╗\n` +
                     `║ \n` +
                     `║ 📌 *Título:* ${title}\n` +
                     `║ 👤 *Canal:* ${author.name}\n` +
                     `║ ⏳ *Duración:* ${timestamp}\n` +
                     `║ 👁️ *Vistas:* ${views.toLocaleString()}\n` +
                     `║ 🔗 *Link:* ${url}\n` +
                     `║ \n` +
                     `╚═════════════════════╝\n\n` +
                     `> 🚀 *Enviando archivo de Delirius API...*`

        await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

        // Determinar si es audio o video
        const isAudio = /^(play|yta|ytmp3|playaudio)$/i.test(command)

        // Configuración de la URL de la API de Delirius
        // ytmp3 para audio, ytmp4 para video
        const type = isAudio ? 'ytmp3' : 'ytmp4'
        const apiUrl = `https://api.delirius.store/download/${type}?url=${encodeURIComponent(url)}`

        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json.status || !json.data?.download) {
            throw '🤯 El servidor de Delirius no respondió correctamente o el link es inválido.'
        }

        const downloadUrl = json.data.download

        if (isAudio) {
            // Enviar como Audio/Mensaje de voz
            await conn.sendMessage(m.chat, { 
                audio: { url: downloadUrl }, 
                fileName: `${title}.mp3`, 
                mimetype: 'audio/mpeg' 
            }, { quoted: m })
        } else {
            // Enviar como Video
            await conn.sendMessage(m.chat, { 
                video: { url: downloadUrl }, 
                caption: `✅ *Aquí tienes:* ${title}`,
                fileName: `${title}.mp4`,
                mimetype: 'video/mp4'
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        return conn.reply(m.chat, `⚠️ *ERROR* ⚠️\n\n> _Motivo: ${e.message || e}_`, m)
    }
}

handler.command = /^(play|yta|ytmp3|play2|ytv|ytmp4|playaudio|mp4)$/i
handler.group = false

export default handler