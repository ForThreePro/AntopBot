import fs from 'fs'

const filePath = './temp_groups.json'

// LISTA DE NUMEROS AUTORIZADOS
// Pon tu numero con codigo de pais sin + ni espacios
const OWNER_NUMBERS = [
  '51927174369' // tu numero
]

if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]')
global.tempGroups = JSON.parse(fs.readFileSync(filePath))

function saveTempGroups() {
  fs.writeFileSync(filePath, JSON.stringify(global.tempGroups, null, 2))
}

// VERIFICADOR CADA 30 SEGUNDOS
setInterval(async () => {
  if (!global.conn) return
  const now = Date.now()
  let toRemove = []

  for (let i of global.tempGroups) {
    const timeLeft = i.exitTime - now

    // AVISO 5 MINUTOS ANTES
    if (timeLeft <= 300000 && timeLeft > 0 &&!i.warned) {
      try {
        await global.conn.sendMessage(i.id, {
          text: `⏰ *AVISO*\nEl bot se saldrá de este grupo en 5 minutos por temporizador.`
        })
        i.warned = true
        saveTempGroups()
      } catch {}
    }

    // HORA DE SALIR
    if (now >= i.exitTime) {
      let attempts = 0
      while (attempts < 3) {
        try {
          await global.conn.sendMessage(i.id, { text: '⏰ Temporizador finalizado. Saliendo...' })
          await new Promise(r => setTimeout(r, 1500))
          await global.conn.groupLeave(i.id)
          console.log(`[TEMP] Sali del grupo: ${i.name}`)
          break
        } catch (e) {
          attempts++
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      toRemove.push(i.id)
    }
  }

  if (toRemove.length > 0) {
    global.tempGroups = global.tempGroups.filter(v =>!toRemove.includes(v.id))
    saveTempGroups()
  }
}, 30000)

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text, key: m.key } }) } catch {}
}

function msToTime(ms) {
  if (ms < 0) ms = 0
  let d = Math.floor(ms / 86400000)
  let h = Math.floor((ms % 86400000) / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  let result = []
  if (d > 0) result.push(`${d}d`)
  if (h > 0) result.push(`${h}h`)
  if (m > 0) result.push(`${m}m`)
  if (s > 0 && d === 0) result.push(`${s}s`)
  return result.join(' ') || '0s'
}

// FUNCION PARA VERIFICAR SI ES OWNER
function isOwner(m) {
  let sender = m.sender.replace('@s.whatsapp.net', '')
  return OWNER_NUMBERS.includes(sender)
}

let handler = async (m, { conn, args, command }) => {
  // BLOQUEO PARA NO AUTORIZADOS
  if (!isOwner(m)) return m.reply('❌ No tienes permiso para usar este comando.')

  // COMANDO: TEMPLIST
  if (command === 'templist') {
    if (global.tempGroups.length === 0) return m.reply('❌ No hay grupos con temporizador activo.')

    let list = global.tempGroups.map((v, i) => {
      let timeLeft = v.exitTime - Date.now()
      return `│ ${i+1}. *${v.name}*\n│ ⏰ Falta: ${msToTime(timeLeft)}`
    }).join('\n')

    return m.reply(`╭─「 LISTA DE TEMPORIZADORES 」
│
${list}
│
╰───────────────────────`)
  }

  // COMANDO: TEMPORIZADOR
  if (!m.isGroup) return m.reply('❌ Solo en grupos')
  if (!args[0]) return m.reply(`Ejemplo: *temporizador 30d*\nFormatos: 1m 5h 2d 1d5h30m`)

  let time = args[0].toLowerCase()
  let ms = 0
  let regex = /(\d+)([dhm])/g
  let match
  while ((match = regex.exec(time))!== null) {
    let val = parseInt(match[1])
    let type = match[2]
    if (type === 'd') ms += val * 86400000
    if (type === 'h') ms += val * 3600000
    if (type === 'm') ms += val * 60000
  }
  if (ms < 60000) return m.reply('❌ Mínimo 1 minuto')

  const exitTime = Date.now() + ms
  const groupId = m.chat
  const groupName = await conn.getName(groupId)

  let index = global.tempGroups.findIndex(v => v.id === groupId)
  if (index!== -1) global.tempGroups.splice(index, 1)

  global.tempGroups.push({ id: groupId, name: groupName, exitTime, addedBy: m.sender, warned: false })
  saveTempGroups()

  const fecha = new Date(exitTime).toLocaleString('es-PE', { timeZone: 'America/Lima' })

  await m.reply(`╭─「 TEMPORIZADOR ACTIVADO 」
│
│ 🏠 *GRUPO:* ${groupName}
│ ⏰ *SALIDA EN:* ${msToTime(ms)}
│ 📅 *FECHA:* ${fecha}
│
╰───────────────────────
Usa *tempcancel* para cancelar.`)
  await react(conn, m, "✅")
}

// CANCELAR
handler.before = async (m, { conn, command }) => {
  if (command === 'tempcancel') {
    // BLOQUEO PARA NO AUTORIZADOS
    if (!isOwner(m)) return m.reply('❌ No tienes permiso para usar este comando.')

    if (!m.isGroup) return m.reply('❌ Solo en grupos')
    let index = global.tempGroups.findIndex(v => v.id === m.chat)
    if (index === -1) return m.reply('❌ No hay temporizador activo.')
    const groupName = global.tempGroups[index].name
    global.tempGroups.splice(index, 1)
    saveTempGroups()
    await m.reply(`╭─「 TEMPORIZADOR CANCELADO 」
│
│ 🏠 *GRUPO:* ${groupName}
│ ✅ *ESTADO:* Cancelado
│
╰───────────────────────`)
    await react(conn, m, "🗑️")
  }
}

handler.help = ['temporizador 30d', 'tempcancel', 'templist'];
handler.tags = ['group'];
handler.command = ['temporizador', 'temp', 'tempcancel', 'templist'];
handler.admin = false

export default handler;