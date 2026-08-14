import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat

    if (command === 'lista') {
        await m.react('📝')
        if (!text) return m.reply(`❌ *Formato incorrecto*\n\n*Uso:* ${usedPrefix}lista Nombre | Número | Premio`)

        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`❌ Faltan datos`)

        let [nombre, numero, premio] = partes.map(v => v.trim())
        let idTemp = Date.now()

        sorteos.push({ id: idTemp, grupo, nombre, numero, premio, dia: null, estado: 'pendiente' })
        guardar(sorteos)

        // CAMBIO CLAVE: Usar templateButtons para que funcione en grupos
        await conn.sendMessage(m.chat, {
            text: `✨ *Datos: 🌈!!*\nSelecciona el día para anotar tu sorteo\n\n👤 *Nombre:* ${nombre}\n📱 *Número:* ${numero}\n🎁 *Premio:* ${premio}`,
            footer: '🐉 SON GOKU BOT 💥',
            templateButtons: [
                { index: 1, quickReplyButton: { displayText: '📅 Seleccionar día', id: `seleccionar_dia_${idTemp}` } }
            ]
        }, { quoted: m })
    }

    if (command === 'ver') {
        await m.react('📋')
        let dia = text.toLowerCase().trim()
        if (!dia) return m.reply(`*Uso:* ${usedPrefix}ver jueves`)

        let delDia = sorteos.filter(s => s.grupo === grupo && s.dia === dia && s.estado === 'registrado')
        if (delDia.length === 0) return m.reply(`📭 No hay sorteos para *${dia}*`)

        let mensaje = `📋 *SORTEOS DEL DÍA: ${dia.toUpperCase()}*\n\n`
        delDia.forEach((s, i) => { mensaje += `*${i + 1}.* 👤 ${s.nombre}\n 📱 ${s.numero}\n 🎁 ${s.premio}\n\n` })
        await conn.reply(m.chat, mensaje, m)
    }
}

// DETECTOR DE BOTONES - ESTA ES LA PARTE IMPORTANTE
handler.before = async (m, { conn }) => {
    if (!m.message) return

    let sorteos = cargar()

    // 1. DETECTAR BOTÓN QUICK REPLY
    let buttonId = m.message?.templateButtonReplyMessage?.selectedId || m.message?.buttonsResponseMessage?.selectedButtonId
    if (buttonId && buttonId.startsWith('seleccionar_dia_')) {
        let idTemp = buttonId.replace('seleccionar_dia_', '')

        await conn.sendMessage(m.chat, {
            text: "Elige el día del sorteo",
            footer: "🐉 SON GOKU BOT 💥",
            title: "📅 Días disponibles",
            buttonText: "Seleccionar",
            sections: [{
                title: "SELECCIONA UN DIA",
                rows: [
                    { title: "Lunes", rowId: `dia_lunes_${idTemp}` },
                    { title: "Martes", rowId: `dia_martes_${idTemp}` },
                    { title: "Miércoles", rowId: `dia_miercoles_${idTemp}` },
                    { title: "Jueves", rowId: `dia_jueves_${idTemp}` },
                    { title: "Viernes", rowId: `dia_viernes_${idTemp}` },
                    { title: "Sábado", rowId: `dia_sabado_${idTemp}` },
                    { title: "Domingo", rowId: `dia_domingo_${idTemp}` },
                    { title: "HOY", rowId: `dia_hoy_${idTemp}` },
                ]
            }]
        }, { quoted: m })
        return true // IMPORTANTE: esto hace que el bot lo procese
    }

    // 2. DETECTAR LISTA
    let rowId = m.message?.listResponseMessage?.singleSelectReply?.selectedRowId
    if (rowId && rowId.startsWith('dia_')) {
        let partes = rowId.split('_')
        let dia = partes[1]
        let idTemp = partes[2]

        let sorteo = sorteos.find(s => s.id == idTemp && s.estado === 'pendiente')
        if (sorteo) {
            sorteo.dia = dia
            sorteo.estado = 'registrado'
            guardar(sorteos)
            await conn.reply(m.chat, `✅ *Se agregó 1 sorteo(s) al día ${dia}*\n\n👤 ${sorteo.nombre}\n📱 ${sorteo.numero}\n🎁 ${sorteo.premio}`, m)
        }
        return true
    }
}

handler.help = ['lista', 'ver']
handler.tags = ['sorteos']
handler.command = ['lista', 'ver']
handler.group = true
handler.admin = true

export default handler