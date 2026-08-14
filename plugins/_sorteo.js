import fs from 'fs'
const ARCHIVO = './sorteos.json'
if (!fs.existsSync(ARCHIVO)) fs.writeFileSync(ARCHIVO, '[]')
let temp = {}

function cargar() { return JSON.parse(fs.readFileSync(ARCHIVO)) }
function guardar(data) { fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2)) }

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sorteos = cargar()
    let grupo = m.chat
    let user = m.sender

    if (command === 'lista') {
        await m.react('📝')
        let partes = text.split('|')
        if (partes.length < 3) return m.reply(`*Uso:* ${usedPrefix}lista Nombre | Numero | Premio`)

        temp[user] = { nombre: partes[0].trim(), numero: partes[1].trim(), premio: partes[2].trim() }

        // FORZAR BOTONES CON sendButton
        let buttons = [
            {buttonId: `.dia lunes`, buttonText: {displayText: 'Lunes'}, type: 1},
            {buttonId: `.dia martes`, buttonText: {displayText: 'Martes'}, type: 1},
            {buttonId: `.dia miercoles`, buttonText: {displayText: 'Miercoles'}, type: 1},
        ]
        let buttons2 = [
            {buttonId: `.dia jueves`, buttonText: {displayText: 'Jueves'}, type: 1},
            {buttonId: `.dia viernes`, buttonText: {displayText: 'Viernes'}, type: 1},
            {buttonId: `.dia sabado`, buttonText: {displayText: 'Sabado'}, type: 1},
        ]
        let buttons3 = [
            {buttonId: `.dia domingo`, buttonText: {displayText: 'Domingo'}, type: 1},
            {buttonId: `.dia hoy`, buttonText: {displayText: 'HOY'}, type: 1},
        ]

        await conn.sendButton(m.chat,
            `✨ *NUEVO SORTEO* ✨\n\n👤 *Nombre:* ${temp[user].nombre}\n📱 *Numero:* ${temp[user].numero}\n🎁 *Premio:* ${temp[user].premio}\n\n*Elige el día:*`,
            '🐉 SON GOKU BOT 💥',
            null,
            buttons,
            m
        )
        await conn.sendButton(m.chat, ' ', '', null, buttons2, m)
        await conn.sendButton(m.chat, ' ', '', null, buttons3, m)
    }

    if (command === 'dia') {
        await m.react('✅')
        let dia = text.toLowerCase().trim()
        if (!temp[user]) return m.reply(`❌ Primero usa.lista`)

        let {nombre, numero, premio} = temp[user]
        let sorteos = cargar()
        sorteos.push({ id: Date.now(), grupo, nombre, numero, premio, dia, estado: 'registrado' })
        guardar(sorteos)
        delete temp[user]

        await conn.reply(m.chat, `✅ *Agregado al día ${dia}*\n👤 ${nombre}\n📱 ${numero}\n🎁 ${premio}`, m)
    }

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