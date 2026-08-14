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
        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`*Uso:* ${usedPrefix}lista Nombre | Numero | Premio`)

        let [nombre, numero, premio] = partes.map(v => v.trim())
        let idTemp = Date.now()

        sorteos.push({ id: idTemp, grupo, nombre, numero, premio, dia: null, estado: 'pendiente' })
        guardar(sorteos)

        let txt = `*← Datos: 🌈 !!*
Selecciona el dia para anotar tu sorteo

*👤 Nombre:* ${nombre}
*📱 Número:* ${numero}
*🎁 Premio:* ${premio}`

        // ESTE ES EL BOTON QUE ABRE LA LISTA
        await conn.sendMessage(m.chat, {
            text: txt,
            footer: 'Betza Bot',
            templateButtons: [
                {index: 1, quickReplyButton: {displayText: 'Seleccionar dia', id: `abrir_lista_${idTemp}`}}
            ]
        }, { quoted: m })
    }
}

// DETECTOR - ESTA PARTE VA OBLIGATORIA
handler.before = async (m, { conn }) => {
    let sorteos = cargar()
    
    // 1. CUANDO TOCAN "Seleccionar dia"
    let btnId = m.message?.templateButtonReplyMessage?.selectedId
    if (btnId?.startsWith('abrir_lista_')) {
        let idTemp = btnId.replace('abrir_lista_', '')
        
        const sections = [{
            title: "SELECCIONA UN DIA PARA REGISTRAR TU SORTEO",
            rows: [
                {title: "Lunes", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_lunes`},
                {title: "Martes", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_martes`},
                {title: "Miércoles", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_miercoles`},
                {title: "Jueves", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_jueves`},
                {title: "Viernes", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_viernes`},
                {title: "Sábado", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_sabado`},
                {title: "Domingo", description: "Registra tu sorteo en este dia", rowId: `set_${idTemp}_domingo`},
                {title: "HOY", description: "Sorteo extra", rowId: `set_${idTemp}_hoy`},
            ]
        }]

        await conn.sendMessage(m.chat, {
            text: "Elige el día",
            footer: "Betza Bot",
            title: "Seleccionar dia",
            buttonText: "Seleccionar",
            sections
        }, { quoted: m })
        return true
    }

    // 2. CUANDO ELIGEN DE LA LISTA
    let rowId = m.message?.listResponseMessage?.singleSelectReply?.selectedRowId
    if (rowId?.startsWith('set_')) {
        let [, idTemp, dia] = rowId.split('_')
        let sorteos = cargar()
        let sorteo = sorteos.find(s => s.id == idTemp && s.estado === 'pendiente')
        
        if (sorteo) {
            sorteo.dia = dia
            sorteo.estado = 'registrado'
            guardar(sorteos)
            await conn.reply(m.chat, `✅ *Se agrego 1 sorteo(s) al dia ${dia}*\n\n*Sorteo agregado* 🎉\n\n👤 ${sorteo.nombre}\n📱 ${sorteo.numero}\n🎁 ${sorteo.premio}`, m)
        }
        return true
    }
}

handler.help = ['lista']
handler.tags = ['sorteos']
handler.command = ['lista']
handler.group = true
handler.admin = false

export default handler