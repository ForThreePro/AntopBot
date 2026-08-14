import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat
    let sender = m.sender

    // 1. COMANDO .lista
    if (command === 'lista') {
        await m.react('📝')
        if (!text) return m.reply(`❌ *Formato incorrecto*\n\n*Uso:* ${usedPrefix}lista Nombre | Número | Premio`)

        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`❌ Faltan datos`)

        let [nombre, numero, premio] = partes.map(v => v.trim())
        let idTemp = Date.now()

        sorteos.push({ id: idTemp, grupo, sender, nombre, numero, premio, dia: null, estado: 'pendiente' })
        guardar(sorteos)

        // EN VEZ DE BOTON, MANDAMOS LA LISTA DIRECTO
        const sections = [{
            title: "SELECCIONA UN DIA PARA REGISTRAR TU SORTEO",
            rows: [
                { title: "Lunes", rowId: `.setdia lunes ${idTemp}` },
                { title: "Martes", rowId: `.setdia martes ${idTemp}` },
                { title: "Miércoles", rowId: `.setdia miercoles ${idTemp}` },
                { title: "Jueves", rowId: `.setdia jueves ${idTemp}` },
                { title: "Viernes", rowId: `.setdia viernes ${idTemp}` },
                { title: "Sábado", rowId: `.setdia sabado ${idTemp}` },
                { title: "Domingo", rowId: `.setdia domingo ${idTemp}` },
                { title: "HOY", rowId: `.setdia hoy ${idTemp}` },
            ]
        }]

        await conn.sendMessage(m.chat, {
            text: `✨ *Datos: 🌈!!*\nSelecciona el día para anotar tu sorteo\n\n👤 *Nombre:* ${nombre}\n📱 *Número:* ${numero}\n🎁 *Premio:* ${premio}`,
            footer: '🐉 SON GOKU BOT 💥',
            title: "📅 Días disponibles",
            buttonText: "Seleccionar",
            sections
        }, { quoted: m })
    }

    // 2. COMANDO .setdia - Este se ejecuta cuando eliges de la lista
    if (command === 'setdia') {
        await m.react('✅')
        let [dia, idTemp] = text.split(' ')
        if (!dia || !idTemp) return

        let sorteo = sorteos.find(s => s.id == idTemp && s.estado === 'pendiente' && s.sender === sender)
        if (!sorteo) return m.reply(`❌ Ese sorteo ya fue registrado o expiró`)

        sorteo.dia = dia
        sorteo.estado = 'registrado'
        guardar(sorteos)

        await conn.reply(m.chat, `✅ *Se agregó 1 sorteo(s) al día ${dia}*\n\n👤 ${sorteo.nombre}\n📱 ${sorteo.numero}\n🎁 ${sorteo.premio}`, m)
    }

    // 3. COMANDO .ver
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
}

handler.help = ['lista', 'ver']
handler.tags = ['sorteos']
handler.command = ['lista', 'ver', 'setdia'] // OJO: agregamos setdia
handler.group = true
handler.admin = true

export default handler