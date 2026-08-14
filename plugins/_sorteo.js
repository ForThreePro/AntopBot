import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')
let temp = {} // Para guardar datos temporales

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat
    let user = m.sender

    // PASO 1:.lista Maria | 91 | Bot
    if (command === 'lista') {
        await m.react('📝')
        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`*Uso corto:*\n${usedPrefix}lista Nombre | Numero | Premio\n*Ej:* ${usedPrefix}lista Maria | 91 | Bot`)

        temp[user] = { nombre: partes[0].trim(), numero: partes[1].trim(), premio: partes[2].trim() }

        // Mandamos los días en 1 sola línea con botones
        await conn.sendMessage(m.chat, {
            text: `👤 ${temp[user].nombre}\n🎁 ${temp[user].premio}\n\n*Elige el día:*`,
            footer: '🐉 SON GOKU BOT',
            templateButtons: [
                {index: 1, quickReplyButton: {displayText: 'Lun', id: `.dia lunes`}},
                {index: 2, quickReplyButton: {displayText: 'Mar', id: `.dia martes`}},
                {index: 3, quickReplyButton: {displayText: 'Mie', id: `.dia miercoles`}},
                {index: 4, quickReplyButton: {displayText: 'Jue', id: `.dia jueves`}},
                {index: 5, quickReplyButton: {displayText: 'Vie', id: `.dia viernes`}},
            ],
            templateButtons: [
                {index: 6, quickReplyButton: {displayText: 'Sab', id: `.dia sabado`}},
                {index: 7, quickReplyButton: {displayText: 'Dom', id: `.dia domingo`}},
                {index: 8, quickReplyButton: {displayText: 'Hoy', id: `.dia hoy`}},
            ]
        }, { quoted: m })
    }

    // PASO 2:.dia jueves
    if (command === 'dia') {
        await m.react('✅')
        let dia = text.toLowerCase().trim()
        if (!temp[user]) return m.reply(`❌ Primero usa.lista`)

        let {nombre, numero, premio} = temp[user]
        let sorteos = cargar()

        sorteos.push({ id: Date.now(), grupo, nombre, numero, premio, dia, estado: 'registrado' })
        guardar(sorteos)
        delete temp[user] // Borramos lo temporal

        await conn.reply(m.chat, `✅ *Agregado al día ${dia}*\n👤 ${nombre}\n📱 ${numero}\n🎁 ${premio}`, m)
    }

    // VER
    if (command === 'ver') {
        await m.react('📋')
        let dia = text.toLowerCase().trim()
        if (!dia) return m.reply(`*Uso:* ${usedPrefix}ver jueves`)
        let delDia = sorteos.filter(s => s.grupo === grupo && s.dia === dia)
        if (delDia.length === 0) return m.reply(`📭 Vacío`)
        let mensaje = `📋 *${dia.toUpperCase()}*\n\n` + delDia.map((s,i)=>`*${i+1}.* ${s.nombre} - ${s.numero}\n🎁 ${s.premio}`).join('\n\n')
        await conn.reply(m.chat, mensaje, m)
    }
}

handler.help = ['lista', 'dia', 'ver']
handler.tags = ['sorteos']
handler.command = ['lista', 'dia', 'ver']
handler.group = true
handler.admin = false

export default handler