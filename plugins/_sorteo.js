import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']

async function mostrarLista(conn, m, sorteos, grupo) {
    let todos = sorteos.filter(s => s.grupo === grupo)
    let nombreGrupo = await conn.getName(grupo)
    let foto = await conn.profilePictureUrl(grupo, 'image').catch(_ => null)

    let mensaje = `╭───⊰ 🎯 *SORTEOS SEMANALES* ⊱───╮\n`
    mensaje += `│ 🏷️ *GRUPO:* ${nombreGrupo}\n`
    mensaje += `╰──────────────────────────────╯\n\n`

    DIAS.forEach(dia => {
        let normales = todos.filter(s => s.dia === dia && !s.extra)
        let extras = todos.filter(s => s.dia === dia && s.extra)

        mensaje += `📅 *${dia.toUpperCase()}*\n`
        
        if (normales.length === 0 && extras.length === 0) {
            mensaje += `   └─ _Sin sorteos_\n\n`
        } else {
            let contador = 1
            normales.forEach((s)=> {
                mensaje += `   ├─ #${contador} 👤 ${s.nombre}\n`
                mensaje += `   │  📱 ${s.numero}\n`
                mensaje += `   │  🎁 ${s.premio}\n`
                mensaje += `   │  🕐 ${s.fecha} ${s.hora}\n`
                contador++
            })
            extras.forEach((s)=> {
                mensaje += `   ├─ ⭐ EXTRA #${contador} 👤 ${s.nombre}\n`
                mensaje += `   │  📱 ${s.numero}\n`
                mensaje += `   │  🎁 ${s.premio}\n`
                mensaje += `   │  🕐 ${s.fecha} ${s.hora}\n`
                contador++
            })
            mensaje += `\n`
        }
    })
    mensaje += `╭─── Total: ${todos.length} sorteos ───╮`

    if (foto) {
        await conn.sendMessage(grupo, { image: { url: foto }, caption: mensaje }, { quoted: m })
    } else {
        await conn.reply(grupo, mensaje, m)
    }
}

let handler = async (m, { conn, text, usedPrefix, command, isAdmin }) => {
    let sorteos = cargar()
    let grupo = m.chat

    if (command === 'lista') {
        await m.react('✅')

        if (text === 'ver') {
            return await mostrarLista(conn, m, sorteos, grupo)
        }

        let partes = text.split('/')
        if (partes.length < 3) return m.reply(`*Uso:* ${usedPrefix}lista Nombre / Numero / Premio [extra]\n*Ej:* ${usedPrefix}lista Maria / 926993155 / Bot`)

        let nombre = partes[0].trim()
        let numero = partes[1].trim()
        let premio = partes[2].trim()

        let esExtra = premio.toLowerCase().includes('extra')
        if(esExtra) premio = premio.replace(/extra/i, '').trim()

        let fechaHora = new Date().toLocaleString('es-PE', {
            timeZone: 'America/Lima',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        })
        let [fecha, hora] = fechaHora.split(', ')
        let diaNum = new Date().toLocaleString('es-PE', {timeZone: 'America/Lima', weekday: 'long'})
        let dia = diaNum.toLowerCase()

        sorteos.push({ id: Date.now(), grupo, dia, nombre, numero, premio, fecha, hora, extra: esExtra })
        guardar(sorteos)

        await m.reply(esExtra ? `⭐ *SORTEO EXTRA ANOTADO* ⭐` : `✅ *ANOTADO PARA ${dia.toUpperCase()}* ✅`)
        await mostrarLista(conn, m, sorteos, grupo)
    }

    if (command === 'delall') {
        if (!isAdmin) return m.reply('❌ *Solo admins pueden borrar todo*')
        sorteos = sorteos.filter(s => s.grupo !== grupo)
        guardar(sorteos)
        await m.react('🗑️')
        return await conn.reply(m.chat, `🗑️ *Se borró toda la lista del grupo*`, m)
    }
}

handler.help = ['lista', 'delall']
handler.tags = ['sorteos']
handler.command = ['lista', 'delall']
handler.group = true

export default handler