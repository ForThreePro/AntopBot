import fs from 'fs'
const ARCHIVO = './sorteos.json'

// Crear archivo si no existe
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() {
    return JSON.parse(fs.readFileSync(ARCHIVO))
}
function guardar(data) {
    fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat

    // COMANDO .lista
    if (command === 'lista') {
        await m.react('📝')
        
        if (!text) return m.reply(`❌ *Formato incorrecto*\n\n*Uso:* ${usedPrefix}lista Nombre | Número | Premio\n\n*Ejemplo:* ${usedPrefix}lista Maria | 987654321 | Audifonos`)

        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`❌ Faltan datos\n*Uso:* Nombre | Número | Premio`)

        let [nombre, numero, premio] = partes.map(v => v.trim())
        let idTemp = Date.now()

        sorteos.push({ id: idTemp, grupo, nombre, numero, premio, dia: null, estado: 'pendiente', fecha: new Date().toLocaleDateString('es-PE') })
        guardar(sorteos)

        let mensaje = `✨ *Datos: 🌈!!*\nSelecciona el día para anotar tu sorteo\n\n👤 *Nombre:* ${nombre}\n📱 *Número:* ${numero}\n🎁 *Premio:* ${premio}`

        await conn.sendMessage(m.chat, {
            text: mensaje,
            footer: '🐉 SON GOKU BOT 💥',
            buttons: [
                { buttonId: `seleccionar_dia_${idTemp}`, buttonText: { displayText: '📅 Seleccionar día' }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m })
    }

    // COMANDO .ver
    if (command === 'ver') {
        await m.react('📋')
        let dia = text.toLowerCase().trim()
        if (!dia) return m.reply(`*Uso:* ${usedPrefix}ver jueves\n*Días:* lunes, martes, miercoles, jueves, viernes, sabado, domingo, hoy`)

        let delDia = sorteos.filter(s => s.grupo === grupo && s.dia === dia && s.estado === 'registrado')

        if (delDia.length === 0) return m.reply(`📭 No hay sorteos para *${dia}*`)

        let mensaje = `📋 *SORTEOS DEL DÍA: ${dia.toUpperCase()}*\n\n`
        delDia.forEach((s, i) => {
            mensaje += `*${i + 1}.* 👤 ${s.nombre}\n   📱 ${s.numero}\n   🎁 ${s.premio}\n\n`
        })
        mensaje += `*Total:* ${delDia.length} sorteo(s)`

        await conn.reply(m.chat, mensaje, m)
    }

    // COMANDO .borrar
    if (command === 'borrar') {
        await m.react('🗑️')
        let num = parseInt(text)
        if (!num) return m.reply(`*Uso:* ${usedPrefix}borrar 1\n\nPrimero usa ${usedPrefix}ver jueves para ver el número`)

        let delDia = sorteos.filter(s => s.grupo === grupo && s.estado === 'registrado')
        let sorteo = delDia[num - 1]
        
        if (!sorteo) return m.reply(`❌ No existe el sorteo #${num}`)

        sorteos = sorteos.filter(s => s.id !== sorteo.id)
        guardar(sorteos)
        await conn.reply(m.chat, `✅ Sorteo #${num} eliminado: ${sorteo.nombre}`, m)
    }
}

// DETECTOR DE BOTONES Y LISTAS
handler.before = async (m, { conn }) => {
    let sorteos = cargar()
    
    // CUANDO TOCAN EL BOTÓN "Seleccionar día"
    if (m.message?.buttonsResponseMessage) {
        let buttonId = m.message.buttonsResponseMessage.selectedButtonId
        if (buttonId.startsWith('seleccionar_dia_')) {
            let idTemp = buttonId.replace('seleccionar_dia_', '')
            
            const sections = [{
                title: "SELECCIONA UN DIA PARA REGISTRAR TU SORTEO",
                rows: [
                    { title: "Lunes", rowId: `dia_lunes_${idTemp}` },
                    { title: "Martes", rowId: `dia_martes_${idTemp}` },
                    { title: "Miércoles", rowId: `dia_miercoles_${idTemp}` },
                    { title: "Jueves", rowId: `dia_jueves_${idTemp}` },
                    { title: "Viernes", rowId: `dia_viernes_${idTemp}` },
                    { title: "Sábado", rowId: `dia_sabado_${idTemp}` },
                    { title: "Domingo", rowId: `dia_domingo_${idTemp}` },
                    { title: "HOY", rowId: `dia_hoy_${idTemp}`, description: "Sorteo extra" },
                ]
            }]

            await conn.sendMessage(m.chat, {
                text: "Elige el día del sorteo",
                footer: "🐉 SON GOKU BOT 💥",
                title: "📅 Días disponibles",
                buttonText: "Seleccionar",
                sections
            }, { quoted: m })
            return true
        }
    }

    // CUANDO ELIGEN DE LA LISTA
    if (m.message?.listResponseMessage) {
        let rowId = m.message.listResponseMessage.singleSelectReply.selectedRowId
        if (rowId.startsWith('dia_')) {
            let partes = rowId.split('_')
            let dia = partes[1]
            let idTemp = partes[2]

            let sorteo = sorteos.find(s => s.id == idTemp && s.estado === 'pendiente')
            if (sorteo) {
                sorteo.dia = dia
                sorteo.estado = 'registrado'
                guardar(sorteos)

                await conn.reply(m.chat, `✅ *Se agregó 1 sorteo(s) al día ${dia}*\n\n*Sorteo agregado* 🎉\n\n👤 ${sorteo.nombre}\n📱 ${sorteo.numero}\n🎁 ${sorteo.premio}`, m)
            }
            return true
        }
    }
}

handler.help = ['lista', 'ver', 'borrar']
handler.tags = ['sorteos']
handler.command = ['lista', 'ver', 'borrar']
handler.group = true
handler.admin = true // solo admins pueden usar .lista y .borrar

export default handler