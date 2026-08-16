import yts from 'yt-search'
import fetch from 'node-fetch'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
  const key2 = Buffer.from('ZWt1c2Fz', 'base64').toString('utf-8').split('').reverse().join('')

  // ============ YTMP4 ============
  if (command === 'ytmp4') {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n🚩 *Ingresa un enlace de YouTube*\n📌 *Ejemplo:* ${usedPrefix + command} https://youtube.com/...`)
    let res = await yts(text)
    let vid = res.videos[0]
    if (!vid) return m.reply(`🌿 *No se encontró el video.*`)

    let apiUrl = `https://api.evogb.org/dl/ytmp4?url=${encodeURIComponent(vid.url)}&quality=720&key=${key}`
    let json = await (await fetch(apiUrl)).json()
    if (!json.status) return m.reply(`❌ *Error al procesar el video.*`)

    let cap = `🐸 𓆩 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗠𝗣𝟰 𓆪 🐸\n\n🎶 *Título:* ${vid.title}\n⏳ *Duración:* ${vid.timestamp}\n📁 *Formato:* MP4 720p\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
    await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption: cap }, { quoted: m })
    await conn.sendMessage(m.chat, { video: { url: json.data.dl }, mimetype: 'video/mp4' }, { quoted: m })
  }

  // ============ YTMP3 ============
  if (command === 'ytmp3') {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n🚩 *Ingresa un enlace de YouTube*\n📌 *Ejemplo:* ${usedPrefix + command} https://youtube.com/...`)
    let res = await yts(text)
    let vid = res.videos[0]
    if (!vid) return m.reply(`🌿 *No se encontró el video.*`)

    let apiUrl = `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(vid.url)}&key=${key}`
    let json = await (await fetch(apiUrl)).json()
    if (!json.status) return m.reply(`❌ *Error al procesar el audio.*`)

    let cap = `🐸 𓆩 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗠𝗣𝟯 𓆪 🐸\n\n🎶 *Título:* ${vid.title}\n⏳ *Duración:* ${vid.timestamp}\n📁 *Formato:* MP3\n\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
    await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption: cap }, { quoted: m })
    await conn.sendMessage(m.chat, { audio: { url: json.data.dl }, mimetype: 'audio/mpeg' }, { quoted: m })
  }

  // ============ PLAY / PLAY2 ============
  if (command === 'play' || command === 'play2') {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n🚩 *Escribe lo que deseas buscar*\n📌 *Ejemplo:* ${usedPrefix + command} king nasir`)
    await m.react('🔍')
    let res = await yts(text)
    let vid = res.videos[0]
    if (!vid) { await m.react('❌'); return m.reply(`🌿 *No se encontraron resultados.*`) }
    await m.react('⏳')

    let isVideo = command === 'play2'
    let apiUrl = isVideo
    ? `https://api.evogb.org/dl/ytmp4?url=${encodeURIComponent(vid.url)}&quality=720&key=${key}`
      : `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(vid.url)}&key=${key}`
    let json = await (await fetch(apiUrl)).json()
    if (!json.status) { await m.react('❌'); return m.reply(`❌ *Error al procesar la descarga.*`) }

    let cap = `🐸 𓆩 𝗣𝗟𝗔𝗬 𓆪 🐸\n\n🎶 *Título:* ${vid.title}\n⏳ *Duración:* ${vid.timestamp}\n👤 *Autor:* ${vid.author.name}\n📁 *Formato:* ${isVideo? 'VIDEO MP4' : 'AUDIO MP3'}\n\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
    await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption: cap }, { quoted: m })

    let ext = isVideo? 'mp4' : 'mp3'
    let tmpFilePath = path.join(tmpdir(), `${Date.now()}.${ext}`)
    await new Promise((resolve, reject) => {
      let process = ffmpeg(json.data.dl)
      if (isVideo) process.videoCodec('libx264').audioCodec('aac').format('mp4').outputOptions(['-movflags +faststart', '-pix_fmt yuv420p'])
      else process.audioCodec('libmp3lame').format('mp3')
      process.on('end', () => resolve(true)).on('error', (err) => reject(err)).save(tmpFilePath)
    })
    let mediaBuffer = fs.readFileSync(tmpFilePath)
    await conn.sendMessage(m.chat, { [isVideo? 'video' : 'audio']: mediaBuffer, mimetype: isVideo? 'video/mp4' : 'audio/mpeg' }, { quoted: m })
    if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
    await m.react('✅')
  }

  // ============ TIKTOK ============
  if (command === 'tiktok' || command === 'tiktoksearch') {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n🚩 *Ingresa un enlace o búsqueda de TikTok*`)
    try {
      if (command === 'tiktoksearch') {
        let res = await (await fetch(`https://api.evogb.org/search/tiktok?query=${text}&key=${key}`)).json()
        let video = res.data[0]
        let caption = `🐸 𓆩 𝗧𝗜𝗞𝗧𝗢𝗞 𝗦𝗘𝗔𝗥𝗖𝗛 𓆪 🐸\n\n*Título:* ${video.title}\n*Autor:* ${video.author.nickname}\n\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
        await conn.sendFile(m.chat, video.dl, 'tiktok.mp4', caption, m)
      } else {
        let res = await (await fetch(`https://api.evogb.org/dl/tiktok?url=${text}&key=${key}`)).json()
        let data = res.data
        await conn.sendFile(m.chat, Array.isArray(data.dl)? data.dl[0] : data.dl, 'tiktok.mp4', data.title, m)
      }
      await m.react('✅')
    } catch { throw 'Error al obtener el video' }
  }

  // ============ SPOTIFY ============
  if (command === 'spotify') {
    if (!text) return m.reply(`🐸 𓆩 𝗦𝗔𝗣𝗜𝗧𝗢 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠 𓆪 🐸\n\n🚩 *Escribe el nombre de la canción*\n📌 *Ejemplo:* ${usedPrefix + command} Lupita`)
    await m.react('🔍')
    try {
      let searchRes = await fetch(`https://api.evogb.org/search/spotify?query=${encodeURIComponent(text)}&key=${key}`)
      let searchData = await searchRes.json()
      if (!searchData.status ||!searchData.result[0]) { await m.react('❌'); return m.reply(`🌿 *No se encontraron resultados para:* ${text}`) }
      await m.react('⏳')
      let song = searchData.result[0]
      let dlRes = await fetch(`https://api.evogb.org/dl/spotify?url=${encodeURIComponent(song.link)}&key=${key}`)
      let dlData = await dlRes.json()
      if (!dlData.status) { await m.react('❌'); return m.reply(`❌ *Error al obtener el enlace de descarga.*`) }

      let cap = `🐸 𓆩 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𓆪 🐸\n\n🎶 *Título:* ${dlData.data.name}\n👤 *Artista:* ${dlData.data.artist}\n💿 *Álbum:* ${dlData.data.album}\n⏳ *Duración:* ${dlData.data.duration}\n📅 *Año:* ${dlData.data.year}\n\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
      await conn.sendMessage(m.chat, { image: { url: dlData.data.image }, caption: cap }, { quoted: m })
      await conn.sendMessage(m.chat, { audio: { url: dlData.data.url }, mimetype: 'audio/mpeg' }, { quoted: m })
      await m.react('✅')
    } catch (e) { await m.react('❌'); m.reply(`🌿 *Ocurrió un error:* ${e.message}`) }
  }

  // ============ MEDIAFIRE ============
  if (command === 'mediafire' || command === 'mf' || command === 'mediafiredl') {
    if (!text) return conn.reply(m.chat, `🐸 𓆩 𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𓆪 🐸\n\n*Formato:* ${usedPrefix + command} [link]`, m)
    await m.react('📥')
    try {
      let response = await fetch(`https://api.evogb.org/dl/mediafire?url=${encodeURIComponent(text)}&key=${key}`)
      let result = await response.json()
      if (!result.status ||!result.data) { await m.react('⚠️'); return m.reply('❌ No se pudo localizar el archivo.') }
      let { name, size, date, dl } = result.data
      let caption = `🐸 𓆩 𝗔𝗥𝗖𝗛𝗜𝗩𝗢 𓆪 🐸\n\n🏷 *Nombre:* ${name}\n⚖ *Tamaño:* ${size}\n📅 *Fecha:* ${date}\n\n━━━━━━━━━━━\n*Powered by*: SAPITO BOT PREM 🍃`
      await conn.sendFile(m.chat, dl, name, caption, m)
      await m.react('✅')
    } catch { await m.react('❌'); m.reply('❌ Error en el servidor de descarga.') }
  }

  // ============ FACEBOOK ============
  if (command === 'fb' || command === 'facebook') {
    if (!text) return conn.reply(m.chat, '🐸 *Ingresa un enlace de Facebook*', m)
    await m.react('⏳')
    try {
      const { data } = await axios.get(`https://api.evogb.org/dl/facebook?url=${encodeURIComponent(text)}&key=${key2}`)
      if (!data.status) return m.reply('Error al procesar.')
      await conn.sendMessage(m.chat, { video: { url: data.resultados[0].url }, mimetype: 'video/mp4' }, { quoted: m })
      await m.react('✅')
    } catch { await m.react('❌') }
  }

  // ============ INSTAGRAM ============
  if (command === 'ig' || command === 'instagram') {
    if (!text) return conn.reply(m.chat, '🐸 *Ingresa un enlace de Instagram*', m)
    await m.react('⏳')
    try {
      const { data } = await axios.get(`https://api.evogb.org/dl/instagram?url=${encodeURIComponent(text)}&key=${key2}`)
      if (!data.status) return m.reply('Error al procesar.')
      await conn.sendMessage(m.chat, { video: { url: data.data[0].url }, mimetype: 'video/mp4' }, { quoted: m })
      await m.react('✅')
    } catch { await m.react('❌') }
  }
}

handler.help = ['ytmp4 <url>', 'ytmp3 <url>', 'play <busqueda>', 'play2 <busqueda>', 'tiktok <link>', 'tiktoksearch <busqueda>', 'spotify <busqueda>', 'mediafire <link>', 'fb <link>', 'ig <link>']
handler.tags = ['downloader']
handler.command = /^(ytmp4|ytmp3|play|play2|tiktok|tiktoksearch|spotify|mediafire|mf|mediafiredl|fb|facebook|ig|instagram)$/i

export default handler