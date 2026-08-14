import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

const DIAS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat

    if (command === 'lista2') { // CAMBIE EL NOMBRE PARA QUE NO CHOQUE
        // VER TODO
        if (text === 'ver') {
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos.length === 0) return m.reply(`📭 No hay sorteos registrados`)

            let mensaje = `📊 REGISTRO DE SORTEOS\n`
            mensaje += `━━━━━━━━━━━━\n\n`
            DIAS.forEach(dia => {
                let delDia = todos.filter(s => s.dia === dia)
                if (delDia.length > 0) {
                    mensaje += `*${dia.toUpperCase()}*\n`
                    delDia.forEach((s,i)=> {
                        let tipo = s.extra? 'EXTRA' : 'NORMAL'
                        mensaje += `${i+1}. ${s.nombre} - ${s.numero} - ${s.premio} [${tipo}]\n`
                        mensaje += ` 🕐 ${s.fecha} ${s.hora}\n\n`
                    })
                }
            })
            return m.reply(mensaje)
        }

        // BORRAR
        if (text.startsWith('del')) {
            let num = parseInt(text.split(' ')[1])
            let todos = sorteos.filter(s => s.grupo === grupo)
            if (todos[num-1]) {
                sorteos = sorteos.filter(s => s.id!== todos[num-1].id)
                guardar(sorteos)
                return m.reply(`🗑️ Registro #${num} eliminado`)
            }
        }

        // AGREGAR
        let partes = text.split(' ')
        if (partes.length < 3) return m.reply(`Uso: ${usedPrefix}lista2 Nombre Numero Premio [extra]\nEj: ${usedPrefix}lista2 Maria 91 Bot`)

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
        m.reply(`✅ ANOTADO: ${dia.toUpperCase()}\n\n👤 ${nombre}\n📱 ${numero}\n🎁 ${premio}\n🕐 ${fecha} ${hora}\nTipo: ${tipo}`)
    }
}

handler.help = ['lista2']
handler.tags = ['sorteos']
handler.command = ['lista2'] // USA.lista2 PARA QUE NO CHOQUE CON EL OTRO
handler.group = true

export default handler