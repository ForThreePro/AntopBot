import yts from "yt-search"
import fetch from "node-fetch"

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🎶 Ingresa el nombre o enlace del video de YouTube.")

  await react(conn, m, "🕘")

  try {
    let url = text.trim()
    let title = "Desconocido"
    let authorName = "Desconocido"
    let durationTimestamp = "Desconocida"
    let views = 0
    let thumbnail = ""

    const isUrl = /^https?:\/\/\S+/i.test(url)

    if (isUrl) {
      if (!isYouTubeUrl(url)) {
        return m.reply("🚫 El enlace no es válido de YouTube.")
      }

      const videoId = extractVideoId(url)
      if (!videoId) {
        return m.reply("🚫 No pude extraer el ID del video.")
      }

      const res = await yts({ videoId })
      if (!res) return m.reply("🚫 No pude obtener información del video.")

      title = res.title || title
      authorName = res.author?.name || authorName
      durationTimestamp = res.timestamp || durationTimestamp
      views = res.views || views
      thumbnail = res.thumbnail || thumbnail
      url = res.url || url
    } else {
      const res = await yts(url)
      if (!res?.videos?.length) return m.reply("🚫 No encontré nada.")

      const video = res.videos[0]
      title = video.title || title
      authorName = video.author?.name || authorName
      durationTimestamp = video.timestamp || durationTimestamp
      views = video.views || views
      url = video.url || url
      thumbnail = video.thumbnail || thumbnail
    }

    const vistas = formatViews(views)
    const fallbackThumbRes = await fetch("https://i.ibb.co/83pbxQN/5eecaebbc7c3.jpg")
    const fallbackThumb = Buffer.from(await fallbackThumbRes.arrayBuffer())

    const fkontak = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        locationMessage: {
          name: `『 ${title} 』`,
          jpegThumbnail: fallbackThumb
        }
      }
    }

    const caption = `
╭─「 INFORMACIÓN DEL VIDEO 」
│
│ 🎵 TÍTULO: ${title}
│ 📺 CANAL: ${authorName}
│ 👁️ VISTAS: ${vistas}
│ ⏳ DURACIÓN: ${durationTimestamp}
│ 🌐 ENLACE: ${url}
│
╰───────────────────────
Descargando audio...
`

    let thumb = fallbackThumb
    if (thumbnail) {
      try {
        thumb = (await conn.getFile(thumbnail)).data
      } catch {
        thumb = fallbackThumb
      }
    }

    await conn.sendMessage(
      m.chat,
      { image: thumb, caption },
      { quoted: fkontak }
    )

    await downloadMedia(conn, m, url, fkontak)
    await react(conn, m, "✅")
  } catch (e) {
    console.error(e)
    await m.reply("❌ Error: " + e.message)
    await react(conn, m, "⚠️")
  }
}

const downloadMedia = async (conn, m, url, quotedMsg) => {
  try {
    const sent = await conn.sendMessage(
      m.chat,
      { text: "⏳ Descargando audio..." },
      { quoted: m }
    )

    const apiUrl = `https://api-gohan-v1.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`
    const r = await fetch(apiUrl)

    if (!r.ok) return m.reply(`🚫 Error HTTP ${r.status} al obtener el audio.`)

    const data = await r.json()
    if (!data?.status ||!data?.result?.download_url) {
      return m.reply("🚫 No se pudo obtener el audio.")
    }

    const fileUrl = data.result.download_url
    const fileTitle = cleanName(data.result.title || "audio")

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: fileUrl },
        mimetype: "audio/mpeg",
        fileName: `${fileTitle}.mp3`,
        ptt: false
      },
      { quoted: quotedMsg }
    )

    try {
      await conn.sendMessage(
        m.chat,
        {
          text: `✅ DESCARGA COMPLETADA\n\n🎵 TÍTULO: ${fileTitle}`,
          edit: sent.key
        }
      )
    } catch {
      await m.reply(`✅ DESCARGA COMPLETADA\n\n🎵 TÍTULO: ${fileTitle}`)
    }
  } catch (e) {
    console.error(e)
    await m.reply("❌ Error: " + e.message)
    await react(conn, m, "💀")
  }
}

// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const cleanName = (name) =>
  String(name).replace(/[^\w\s._-]/gi, "").substring(0, 50)

const formatViews = (views) => {
  const n = Number(views)
  if (!n || Number.isNaN(n)) return "No disponible"
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

const isYouTubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)
}

const extractVideoId = (url) => {
  const match =
    url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&/]|\b)/) ||
    url.match(/youtu\.be\/([0-9A-Za-z_-]{11})/)
  return match?.[1] || null
}

handler.command = ["play"]
handler.tags = ["descargas"]
handler.help = ['play <nombre/link>']
handler.register = false

export default handler