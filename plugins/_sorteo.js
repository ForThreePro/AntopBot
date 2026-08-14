import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

const DIAS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']

// FUNCION PARA MOSTRAR LA LISTA
function mostrarLista(sorteos, grupo) {
    let todos = sorteos.filter(s => s.grupo === grupo)
    if (todos.length === 0) return `📭 *No hay sorteos registrados*`

    let mensaje = `╭─〔 📋 *SORTEOS DE LA SEMANA* 〕─╮\n\n`
    DIAS.forEach(dia => {
        let normales = todos.filter(s => s.dia === dia &&!s.extra)
        let extras = todos.filter(s => s.dia === dia && s.extra)

        if (normales.length > 0) {
            mensaje += `│ *${dia.toUpperCase()}*\n`
            normales.forEach((s,i)=> {
                mensaje += `│ ${i+1}. 👤 ${s.nombre}\n`
                mensaje += `│ 📱 ${s.numero}\n`
                mensaje += `│ 🎁 ${s.premio}\n`
                mensaje += `│ 🕐 ${s.fecha} ${s.hora}\n\n`
            })
        }
        if (extras.length > 0) {
            mensaje += `│ *${dia.toUpperCase()} - EXTRAS ⭐*\n`
            extras.forEach((s,i)=> {
                mensaje += `│ ${i+1}. 👤 ${s.nombre}\n`
                mensaje += `│ 📱 ${s.numero}\n`
                mensaje += `│ 🎁 ${s.premio}\n`
                mensaje += `│ 🕐 ${s.fecha} ${s.hora}\n\n`
            })
        }
    })
    mensaje += `╰────────────────────────╯`
    return mensaje
}

let handler = async (m, { conn, text, usedPrefix, command, isAdmin }) => {
    let sorteos = cargar()
    let grupo = m.chat

    if (command === 'lista') {
        await m.react('✅')

        // SI ES.lista ver
        if (text === 'ver') {
            let lista = mostrarLista(sorteos, grupo)
            return await conn.reply(m.chat, lista, m)
        }

        // SI ES PARA AGREGAR:.lista Maria / 926993155 / Bot
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

        // AL ANOTAR, MUESTRA LA LISTA COMPLETA DIRECTO
        let listaActualizada = mostrarLista(sorteos, grupo)
        let aviso = esExtra? `⭐ *SORTEO EXTRA ANOTADO* ⭐\n\n` : `✅ *ANOTADO PARA ${dia.toUpperCase()}* ✅\n\n`
        await conn.reply(m.chat, aviso + listaActualizada, m)
    }

    if (command === 'delall') {
        if (!isAdmin) return m.reply('❌ *Solo admins pueden borrar todo*')
        sorteos = sorteos.filter(s => s.grupo!== grupo)
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