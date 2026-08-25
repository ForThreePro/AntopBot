import { join } from 'path'
import { promises as fs } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
import yts from "yt-search"
import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys'

const execFileAsync = promisify(execFile)

// HANDLER PRINCIPAL
const handler = async (m, { conn, args, text, usedPrefix, command }) => {

  // COMANDO:.play
  if (command === 'play') {
    if (!text) return m.reply(`🕸️ *SHADOW PLAY*\n\n*Uso:* ${usedPrefix}${command} <nombre o link de YouTube>\n*Ejemplo:* ${usedPrefix}${command} Feid Luna`)
    await conn.react(m.chat, "⏳", m.key)
    return await playCommand(conn, m, text)
  }

  // COMANDO:.tiktok /.tt
  if (['tiktok', 'tt'].includes(command)) {
    if (!args[0]) return m.reply(`[ 🕸️ ] *SHADOW TIKTOK*\n\n*Uso:* ${usedPrefix + command} <link de tiktok>`)
    if (!args[0].match(/(https?:\/\/)?(www\.)?(vm\.|vt\.|www\.)?tiktok\.com\//)) return m.reply(`[ ⚠️ ] Ese enlace no pertenece al reino de TikTok.`)
    await conn.react(m.chat, "⏳", m.key)
    return await tiktokCommand(conn, m, args[0])
  }

  // COMANDO:.audivd /.audio
  if (['audivd', 'audio'].includes(command)) {
    const q = m.quoted? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    if (!/video/.test(mime)) return m.reply('✨ *Shadow Garden — Análisis*\n\n❌ Responde a un video para extraer su audio.')
    await conn.react(m.chat, "⏳", m.key)
    return await audivdCommand(conn, m, q)
  }
}

// FUNCION.PLAY
async function playCommand(conn, m, text) {
  try {
    let url = text.trim()
    let video = {}

    const isUrl = /^https?:\/\//i.test(url)
    if (isUrl) {
      if (!isYouTubeUrl(url)) return m.reply("🚫 Ese link no es de YouTube.")
      const videoId = extractVideoId(url)
      if (!videoId) return m.reply("🚫 ID inválido")
      const res = await yts({ videoId })
      video = formatVideo(res)
    } else {
      const res = await yts.search({ query: url, pages: 1 })
      if (!res?.videos?.length) return m.reply("🚫 No encontré nada.")
      video = formatVideo(res.videos[0])
    }

    const { title, author, duration, views, thumbnail, url: videoUrl } = video
    const vistas = formatViews(views)

    let thumbBuffer
    try { thumbBuffer = (await conn.getFile(thumbnail)).data }
    catch { thumbBuffer = Buffer.from(await (await fetch("https://i.ibb.co/83pbxQN/5eecaebbc7c3.jpg")).arrayBuffer()) }

    const caption = `╭━━━〔 🕸️ SHADOW PLAY 〕━━━╮
┃ 🎼 *Título:* ${title}
┃ 📺 *Canal:* ${author}
┃ 👁️ *Vistas:* ${vistas}
┃ ⏳ *Duración:* ${duration}
╰━━━〔 ⚡ Extrayendo audio... 〕━━━╯`

    await conn.sendMessage(m.chat, { image: thumbBuffer, caption }, { quoted: m })
    await downloadYouTubeAudio(conn, m, videoUrl)
    await conn.react(m.chat, "✅", m.key)

  } catch (e) {
    await conn.react(m.chat, "❌", m.key)
    m.reply(`[ 🩸 ] Error: ${e.message}`)
  }
}

// FUNCION.TIKTOK
async function tiktokCommand(conn, m, url) {
  try {
    await m.reply('[ ⏳ ] Invocando el arte prohibido...')
    const tiktokData = await tiktokdl(url)
    if (!tiktokData?.data) return m.reply('[ 🕳️ ] La sombra no pudo extraer el contenido.')

    const videoURL = tiktokData.data.play
    const title = tiktokData.data.title || 'Sin título'
    const author = tiktokData.data.author?.nickname || 'Desconocido'

    const businessHeader = {
      key: { remoteJid: m.chat, participant: '0@s.whatsapp.net', fromMe: false },
      message: {
        locationMessage: {
          name: '𝙩𝙞𝙠𝙩𝙤𝙠 👑',
          jpegThumbnail: Buffer.from(await (await fetch('https://files.catbox.moe/dsgmid.jpg')).arrayBuffer()),
          vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Shadow Garden\nEND:VCARD'
        }
      }
    }

    const media = await generateWAMessageContent({ video: { url: videoURL } }, { upload: conn.waUploadToServer, jid: m.chat })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: { text: `📜 *TIKTOK EXTRAIDO*\n\n> ${title}\n> @${author}` },
            footer: { text: '⚔️ Shadow Garden' },
            header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copiar', copy_code: '*I LOVE Shadow-Bot*' }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'Abrir TikTok', url: url }) }
              ]
            })
          })
        }
      }
    }, { quoted: businessHeader })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await conn.react(m.chat, "✅", m.key)

  } catch (error) {
    await conn.react(m.chat, "❌", m.key)
    m.reply(`[ 🩸 ] Error: ${error.message}`)
  }
}

// FUNCION.AUDIVD
async function audivdCommand(conn, m, q) {
  let tempVideo, tempAudio
  try {
    await m.reply('🕸️ *Extrayendo audio para analizar...*')
    const videoBuffer = await q.download()
    if (!videoBuffer) throw new Error('No se pudo obtener el buffer del video.')

    const tempDir = join(process.cwd(), './tmp')
    await fs.stat(tempDir).catch(() => fs.mkdir(tempDir, { recursive: true }))

    tempVideo = join(tempDir, `${Date.now()}.mp4`)
    tempAudio = join(tempDir, `${Date.now()}.mp3`)
    await fs.writeFile(tempVideo, videoBuffer)

    await execFileAsync('ffmpeg', ['-y', '-i', tempVideo, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '128k', tempAudio], { timeout: 120000 })
    const audioBuffer = await fs.readFile(tempAudio)

    let searchQuery = q.m.msg?.caption || q.m.text || "audio"
    searchQuery = searchQuery.replace(/[#*_`]/g, '').substring(0, 100)

    await m.reply(`🔍 *Analizando...*\nBuscando: *${searchQuery}*`)
    const res = await yts.search({ query: searchQuery, pages: 1 })

    if (res?.videos?.length) {
      const video = res.videos[0]
      await m.reply(`🎵 *Música detectada*\n\n> *${video.title}*\n> *${video.author.name}*\n\n*Descargando versión original...*`)
      await downloadYouTubeAudio(conn, m, video.url)
    } else {
      await m.reply('🔊 *No se detectó música. Enviando audio del video...*')
      await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', fileName: `audio_extraido.mp3` }, { quoted: m })
    }
    await conn.react(m.chat, "✅", m.key)

  } catch (e) {
    await conn.react(m.chat, "❌", m.key)
    m.reply('❌ Fallo al procesar: ' + e.message)
  } finally {
    await fs.unlink(tempVideo).catch(() => {})
    await fs.unlink(tempAudio).catch(() => {})
  }
}

// FUNCION COMPARTIDA PARA DESCARGAR YT
async function downloadYouTubeAudio(conn, m, url) {
  const apiUrl = `https://api-gohan-v1.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`
  const r = await fetch(apiUrl)
  const data = await r.json()
  if (!data?.status) throw new Error("No se pudo obtener el audio.")
  await conn.sendMessage(m.chat, {
    audio: { url: data.result.download_url },
    mimetype: "audio/mpeg",
    fileName: `${cleanName(data.result.title)}.mp3`
  }, { quoted: m })
}

async function tiktokdl(url) {
  const tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  return await (await fetch(tikwm, { signal: AbortSignal.timeout(20000) })).json()
}

const formatVideo = (v) => ({ title: v.title, author: v.author?.name, duration: v.timestamp, views: v.views, thumbnail: v.thumbnail, url: v.url })
const cleanName = (name) => String(name).replace(/[^\w\s._-]/gi, "").substring(0, 60)
const formatViews = (n) => { n = Number(n); if (!n) return "0"; if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`; return n.toString() }
const isYouTubeUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)
const extractVideoId = (url) => url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || null

handler.help = ['play <texto>', 'tiktok <link>', 'audivd']
handler.tags = ['descargas', 'tools']
handler.command = ['play', 'tiktok', 'tt', 'audivd', 'audio']
handler.limit = true

export default handler