import os from 'os'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let loadMsg = await conn.reply(m.chat, `🐉 𓆩 𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗠𝗘𝗡𝗨 𓆪 🐉\n\n⏳ *Espere un momento...*\n> Cargando sistema Saiyan...`, m)

  let taguser = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender
  let img = { url: 'https://files.evogb.win/qS154V.jpg' }

  let uptime = process.uptime() * 1000
  let _uptime = clockString(uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalcmd = Object.values(global.plugins).filter(p => p.help &&!p.disabled).length
  let start = performance.now()
  let end = performance.now()
  let ping = (end - start).toFixed(2)

  let owner = global.owner?.[0]?.[0] || '51927174369'
  let ownerTag = `@${owner}`
  let numBot = conn.user.jid.split('@')[0]

  let help = Object.values(global.plugins).filter(p => p.help &&!p.disabled)
  let groups = {}
  for (let plugin of help) {
    let category = plugin.tags? plugin.tags[0] : 'otros'
    if (!groups[category]) groups[category] = []
    if (Array.isArray(plugin.help)) groups[category].push(...plugin.help)
    else groups[category].push(plugin.help)
  }

  // 1 EMOJI POR CATEGORÍA
  const icons = {
    search: '🔍', // BUSQUEDA
    download: '⬇️', // DESCARGAS
    game: '🎮', // JUEGOS
    rpg: '⚔️', // RPG
    config: '⚙️', // CONFIG
    group: '👥', // GRUPOS
    owner: '👑', // OWNER
    info: 'ℹ️', // INFO
    fun: '😂', // DIVERSION
    anime: '🌸', // ANIME
    sticker: '🧩', // STICKERS
    tools: '🛠️', // HERRAMIENTAS
    nsfw: '🔞', // NSFW
    audio: '🎵', // AUDIO
    prem: '🍃', // PREM
    otros: '📁' // OTROS
  }

  const categoryNames = {
    search: 'BUSQUEDA', download: 'DESCARGAS', game: 'JUEGOS', rpg: 'RPG',
    config: 'CONFIG', group: 'GRUPOS', owner: 'OWNER', info: 'INFO',
    fun: 'DIVERSION', anime: 'ANIME', sticker: 'STICKERS', tools: 'HERRAMIENTAS',
    nsfw: 'NSFW', audio: 'AUDIO', prem: 'PREM', otros: 'OTROS'
  }

  let menu = `🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉\n\n`
  menu += `⤷ ┇ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 ﹒ 3.0 DBZ ：✿ 。\n`
  menu += `꒰ ◞⁺⊹ ．estado: *EN LINEA* • ${_uptime}\n\n`
  menu += ` ꒱ ׁ. ᘏ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗔𝗖𝗧𝗜𝗩𝗢 ׅ 𝆬 ָ֢ ෆ\n`
  menu += `🦦 ࣪ ꕀ @${taguser.split('@')[0]}. ˚. ᵎᵎ\n`
  menu += `> *Bienvenido al sistema Saiyan*\n\n`
  menu += `──愛 *INFORMACION DEL BOT* ╏ 💥\n`
  menu += `*Usuarios*: ${totalreg} | *Comandos*: ${totalcmd}\n`
  menu += `*Owner*: ${ownerTag}\n`
  menu += `*Numero*: +${numBot}\n\n`
  menu += ` ׅ 埃斯 : 𝖲𝖨𝖲𝖳𝖤𝖬𝖠 ﹙ 🌑 ﹚\n`
  menu += `> ﹒ RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}gb\n`
  menu += ` ᶻz　*${new Date().toLocaleDateString('es', {weekday: 'long', timeZone: 'America/Lima'})}* ─ ${new Date().toLocaleDateString('es', {timeZone: 'America/Lima'})} ─ ${new Date().toLocaleTimeString('es', {timeZone: 'America/Lima'})}　⋌\n\n`
  menu += `© ❛ *ping*. ${ping}ms\n`
  menu += `名 ─ *modo:* public﹔\n\n`
  menu += `> ❍ 𝖴𝗌𝖺. 𝖺𝗇𝗍𝖾𝗌 𝖽𝖾 𝖼𝖺𝖽𝖺 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗉𝖺𝗋𝖺 𝖺𝖼𝗍𝗂𝗏𝖺𝗋𝗅𝗈\n`

  for (let category in groups) {
    let icon = icons[category] || '📁'
    let catName = categoryNames[category] || category.toUpperCase()
    menu += `.⃟𖥔 ݁. 𖦹˙— \`\`𝐏𝐫𝐞𝐦\`\` —˙𖦹.${icon}꒷\n`
    for (let cmd of groups[category]) {
      menu += `${icon} ➛.${cmd}\n`
    }
    menu += ` ㅤ└──.✦ ── ⊰ ̟!!.✦. ˙\n\n`
  }

  menu += `━━━━━━━━━━━\n`
  menu += `🐉 *SON GOKU PREM BOT* 🐉\n`
  menu += `*Owner*: ${ownerTag}\n`
  menu += `*Contacto*: +${numBot}\n`
  menu += `*Version*: 3.0 DBZ\n`
  menu += `*Power*: Nivel Dios\n`
  menu += `> "No subestimes mi poder... o serás polvo" ⚡\n`
  menu += `━━━━━━━━━━━`

  await conn.sendMessage(m.chat, { delete: loadMsg.key })
  await conn.sendMessage(m.chat, {
    image: img,
    caption: menu,
    mentions: [taguser, owner]
  }, { quoted: m })
}

handler.help = ['menu', 'help', 'menú']
handler.tags = ['info']
handler.command = /^(menu|help|menú)$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms)? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms)? '--' : Math.floor(ms / 60000) % 60
  return [h, m].map(v => v.toString().padStart(2, 0)).join('h ') + 'm'
}
