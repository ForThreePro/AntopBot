import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

const DIAS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat

    if (command === 'lista') {
        await m.react('✅')

        // VER TODO
        if (text === 'ver') {
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos.length === 0) return m.reply(`📭 *No hay sorteos registrados*`)

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
            return await conn.reply(m.chat, mensaje, m)
        }

        // BORRAR
        if (text.startsWith('del')) {
            let num = parseInt(text.split(' ')[1])
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos[num-1]) {
                sorteos = sorteos.filter(s => s.id!== todos[num-1].id)
                guardar(sorteos)
                return await conn.reply(m.chat, `🗑️ *Sorteo #${num} eliminado*`, m)
            }
        }

        // AGREGAR
        let partes = text.split(' ')
        if (partes.length < 3) return m.reply(`*Uso:* ${usedPrefix}lista Nombre Numero Premio [extra]\n*Ej:* ${usedPrefix}lista Maria 91 Bot`)

        let esExtra = partes[partes.length-1].toLowerCase() === 'extra'
        if(esExtra) partes.pop()

        let nombre = partes[0]
        let numero = partes[1]
        let premio = partes.slice(2).join(' ')

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

        let diseño = esExtra
       ? `╭─〔 ⭐ *SORTEO EXTRA* 〕─╮\n│\n│ 👤 *Nombre:* ${nombre}\n│ 📱 *Número:* ${numero}\n│ 🎁 *Premio:* ${premio}\n│ 🕐 *Fecha:* ${fecha} ${hora}\n│\n╰──────────────────╯`
        : `╭─〔 ✅ *ANOTADO: ${dia.toUpperCase()}* 〕─╮\n│\n│ 👤 *Nombre:* ${nombre}\n│ 📱 *Número:* ${numero}\n│ 🎁 *Premio:* ${premio}\n│ 🕐 *Fecha:* ${fecha} ${hora}\n│\n╰──────────────────╯`

        await conn.reply(m.chat, diseño, m)
    }
}

handler.help = ['lista']
handler.tags = ['sorteos']
handler.command = ['lista']
handler.group = true

export default handler