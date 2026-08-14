import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat

    try {
        // 1. COMANDO .lista Dia | Nombre | Numero | Premio
        if (command === 'lista') {
            await m.react('📝')
            
            let partes = text.split('|')
            if (partes.length < 4) return m.reply(`❌ *Formato nuevo:*\n${usedPrefix}lista DIA | Nombre | Número | Premio\n\n*Ejemplo:* ${usedPrefix}lista jueves | Maria | 91 | Bot\n*Días:* lunes martes miercoles jueves viernes sabado domingo hoy`)

            let [dia, nombre, numero, premio] = partes.map(v => v.trim().toLowerCase())
            dia = dia.toLowerCase()

            sorteos.push({ 
                id: Date.now(), 
                grupo, 
                nombre, 
                numero, 
                premio, 
                dia, 
                estado: 'registrado',
                fecha: new Date().toLocaleDateString('es-PE')
            })
            guardar(sorteos)

            await conn.reply(m.chat, `✅ *Se agregó 1 sorteo(s) al día ${dia}*\n\n👤 ${nombre}\n📱 ${numero}\n🎁 ${premio}`, m)
        }

        // 2. COMANDO .ver
        if (command === 'ver') {
            await m.react('📋')
            let dia = text.toLowerCase().trim()
            if (!dia) return m.reply(`*Uso:* ${usedPrefix}ver jueves`)

            let delDia = sorteos.filter(s => s.grupo === grupo && s.dia === dia && s.estado === 'registrado')
            if (delDia.length === 0) return m.reply(`📭 No hay sorteos para *${dia}*`)

            let mensaje = `📋 *SORTEOS DEL DÍA: ${dia.toUpperCase()}*\n\n`
            delDia.forEach((s, i) => { mensaje += `*${i + 1}.* 👤 ${s.nombre}\n   📱 ${s.numero}\n   🎁 ${s.premio}\n\n` })
            await conn.reply(m.chat, mensaje, m)
        }

    } catch(e) {
        await m.react('❌')
        await conn.reply(m.chat, `Error: ${e.message}`, m)
        console.log(e)
    }
}

handler.help = ['lista', 'ver']
handler.tags = ['sorteos']
handler.command = ['lista', 'ver']
handler.group = true
handler.admin = false // OJO: LO QUITÉ PARA PROBAR

export default handler