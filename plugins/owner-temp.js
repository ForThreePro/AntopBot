import fs from 'fs'
import path from 'path'

const filePath = './temp_groups.json'

// CARGAR GRUPOS TEMPORALES AL INICIAR
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]')
global.tempGroups = JSON.parse(fs.readFileSync(filePath))

// FUNCION PARA GUARDAR
function saveTempGroups() {
  fs.writeFileSync(filePath, JSON.stringify(global.tempGroups, null, 2))
}

// VERIFICADOR CADA 1 MINUTO
setInterval(async () => {
  if (!global.conn) return
  const now = Date.now()
  let toRemove = []

  for (let i of global.tempGroups) {
    if (now >= i.exitTime) {
      try {
        await global.conn.groupLeave(i.id)
        console.log(`[TEMP] Sali del grupo: ${i.name}`)
        toRemove.push(i.id)
      } catch (e) {
        console.log('[TEMP ERROR]', e)
      }
    }
  }

  // Eliminar los que ya salio
  if (toRemove.length > 0) {
    global.tempGroups = global.tempGroups.filter(v =>!toRemove.includes(v.id))
    saveTempGroups()
  }
}, 60000) // 60000ms = 1 minuto

// FUNCION PARA REACCIONES
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

// CONVERTIR MS A TEXTO LEGIBLE
function msToTime(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor((ms % 86400000) / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let result = []
  if (d > 0) result.push(`${d}d`)
  if (h > 0) result.push(`${h}h`)
  if (m > 0) result.push(`${m}m`)
  return result.join(' ') || '0m'
}

let handler = async (m, { conn, args, command }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos')
    if (!args[0]) return m.reply(`Ejemplo: *${command} 30d*\n\nFormatos: 1m 5h 2d 1d5h30m`)

    // Convertir tiempo a ms
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
    if (ms < 60000) return m.reply('❌ El tiempo mínimo es 1 minuto')

    const exitTime = Date.now() + ms
    const groupId = m.chat
    const groupName = await conn.getName(groupId)

    // Si ya existe lo actualiza
    let index = global.tempGroups.findIndex(v => v.id === groupId)
    if (index!== -1) global.tempGroups.splice(index, 1)

    // Guardar
    global.tempGroups.push({
      id: groupId,
      name: groupName,
      exitTime: exitTime,
      addedBy: m.sender
    })
    saveTempGroups()

    const fecha = new Date(exitTime).toLocaleString('es-PE', { timeZone: 'America/Lima' })

    const caption = `╭─「 TEMPORIZADOR ACTIVADO 」
│
│ 🏠 *GRUPO:* ${groupName}
│ ⏰ *SALIDA EN:* ${msToTime(ms)}
│ 📅 *FECHA:* ${fecha}
│
╰───────────────────────
Usa *tempcancel* para cancelar.`

    await m.reply(caption)
    await react(conn, m, "✅")

  } catch (e) {
    console.error(e)
    await react(conn, m, "❌")
    await m.reply(`❌ Error: ${e.message}`)
  }
}

// HANDLER PARA CANCELAR
handler.before = async (m, { conn, command }) => {
  if (command === 'tempcancel') {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos')

    let index = global.tempGroups.findIndex(v => v.id === m.chat)
    if (index === -1) return m.reply('❌ Este grupo no tiene temporizador activo.')

    const groupName = global.tempGroups[index].name
    global.tempGroups.splice(index, 1)
    saveTempGroups()

    await m.reply(`╭─「 TEMPORIZADOR CANCELADO 」
│
│ 🏠 *GRUPO:* ${groupName}
│ ✅ *ESTADO:* Ya no se saldra automaticamente
│
╰───────────────────────`)
    await react(conn, m, "🗑️")
  }
}

handler.help = ['temporizador 30d', 'tempcancel'];
handler.tags = ['group'];
handler.command = ['temporizador', 'temp', 'tempcancel'];
handler.admin = true // solo admins

export default handler;