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

        // VER TODO - TABLA
        if (text === 'ver') {
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos.length === 0) return m.reply(`📭 *No hay sorteos registrados*`)

            let mensaje = `📊 *REGISTRO DE SORTEOS*\n`
            mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`

            DIAS.forEach(dia => {
                let delDia = todos.filter(s => s.dia === dia)
                if (delDia.length > 0) {
                    mensaje += `*${dia.toUpperCase()}*\n`
                    mensaje += `N° | NOMBRE | NUMERO | PREMIO | TIPO\n`
                    mensaje += `---|-----------|------------|--------------|------\n`
                    delDia.forEach((s,i)=> {
                        let tipo = s.extra? 'EXTRA' : 'NORMAL'
                        mensaje += `${i+1} | ${s.nombre.padEnd(9)} | ${s.numero.padEnd(10)} | ${s.premio.padEnd(12)} | ${tipo}\n`
                    })
                    mensaje += `\n`
                }
            })
            mensaje += `━━━━━━━━━━━━━━━━━━━━\n`
            mensaje += `_Para borrar:.lista del N°_`
            return await conn.reply(m.chat, mensaje, m)
        }

        // BORRAR
        if (text.startsWith('del')) {
            let num = parseInt(text.split(' ')[1])
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos[num-1]) {
                sorteos = sorteos.filter(s => s.id!== todos[num-1].id)
                guardar(sorteos)
                return await conn.reply(m.chat, `🗑️ *Registro #${num} eliminado*`, m)
            }
        }

        // AGREGAR
        let partes = text.split(' ')
        if (partes.length < 3) return m.reply(`*Uso:* ${usedPrefix}lista Nombre Numero Premio [extra]`)

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

        let tipo = esExtra? '⭐ EXTRA' : 'NORMAL'
        let diseño = `📝 *NUEVO REGISTRO*\n`
        diseño += `━━━━━━━━━━━━━━━━━━━━\n`
        diseño += `*Día:* ${dia}\n`
        diseño += `*Nombre:* ${nombre}\n`
        diseño += `*Número:* ${numero}\n`
        diseño += `*Premio:* ${premio}\n`
        diseño += `*Tipo:* ${tipo}\n`
        diseño += `*Fecha:* ${fecha} ${hora}\n`
        diseño += `━━━━━━━━━━━━━━━━━━━━`

        await conn.reply(m.chat, diseño, m)
    }
}

handler.help = ['lista']
handler.tags = ['sorteos']
handler.command = ['lista']
handler.group = true

export default handler