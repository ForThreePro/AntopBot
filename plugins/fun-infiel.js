let handler = async (m, { conn, command }) => {

    let who = m.mentionedJid[0] || m.quoted?.sender || null
    if (!who) return m.reply(`❌ *Error 404* ❌\nUsa: *.${command} @persona*\nO responde a un mensaje con *.${command}*`)

    let user = `@${m.sender.split('@')[0]}`
    let target = `@${who.split('@')[0]}`

    let pp
    try {
        pp = await conn.profilePictureUrl(who, 'image')
    } catch {
        pp = 'https://i.imgur.com/2yW7L1m.jpg'
    }

    let caption = ''
    let react = '🔍'

    if (command === 'infiel') {
        const esInfiel = Math.random() < 0.6
        const infiel = [`🔍 ${user} ATRAPÓ A UN INFIEL: ${target} 💔`,`🚨 ${user} pilló a ${target} siendo INFIEL. 2 WhatsApp`,`😱 ${user}: ${target} es INFIEL. "Es mi primo"`]
        const fiel = [`💚 ${user} ESCANEÓ A ${target} Y SALIÓ: 100% FIEL`,`✅ ${user} verificó a ${target}: Es de los buenos`,`🛡️ ${user}: ${target} PASÓ EL DETECTOR. FIEL`]
        caption = esInfiel? infiel[Math.floor(Math.random() * infiel.length)] : fiel[Math.floor(Math.random() * fiel.length)]
        react = esInfiel? '💔' : '💚'

    } else if (command === 'cachoso') {
        const nivel = Math.floor(Math.random() * 101)
        caption = `📊 ${user} escaneó a ${target}\n\nNivel de Cachoso: *${nivel}%*\n${nivel > 70? '🚨 PELIGRO: Manos largas' : nivel > 40? '⚠️ Ojito, es coqueto' : '😇 Es sano'}`
        react = '😏'

    } else if (command === 'ex') {
        const exs = Math.floor(Math.random() * 10) + 1
        caption = `💔 ${user} investigó a ${target}\n\nTiene *${exs} exs*\n${exs > 5? '🤡 Experto en dejar gente' : exs > 2? '😅 Tiene experiencia' : '👶 Inocente'}`
        react = '💔'

    } else if (command === 'segunda') {
        const esSegunda = Math.random() < 0.5
        caption = esSegunda? `🟡 ${user} descubrió que ${target} es LA SEGUNDA 😱` : `🟢 ${user}: ${target} es la PRIMERA y ÚNICA 💚`
        react = esSegunda? '🟡' : '🟢'

    } else if (command === 'toxico') { // NUEVO
        const nivel = Math.floor(Math.random() * 101)
        caption = `☠️ ${user} analizó la toxicidad de ${target}\n\nNivel Tóxico: *${nivel}%*\n${nivel > 80? '💀 Revisa su cel a cada rato' : nivel > 50? '😒 Celoso nivel Dios' : '😌 Tranquilo y sano'}`
        react = '☠️'

    } else if (command === 'redflag') { // NUEVO
        const flags = ['Tiene "mejor amiga"','Oculta el cel','Responde cada 5 horas','Le da like a todas','Dice "confía en mí"','Tiene 2 Instagram']
        const flag = flags[Math.floor(Math.random() * flags.length)]
        caption = `🚩 ${user} encontró RED FLAG en ${target}\n\n> ${flag}\nCorre pe causa`
        react = '🚩'

    } else if (command === 'amante') { // NUEVO
        const num = Math.floor(Math.random() * 5)
        caption = `👀 ${user} stalkeó a ${target}\n\nTiene *${num} amantes* detectados\n${num > 2? '🔥 Don Juan' : num > 0? '😏 Algo es algo' : '😇 Santo'}`
        react = '😈'

    } else if (command === 'compatibilidad') { // NUEVO
        const compa = Math.floor(Math.random() * 101)
        caption = `💘 ${user} + ${target}\n\nCompatibilidad: *${compa}%*\n${compa > 80? '💍 Boda a la vista' : compa > 50? '❤️ Sí hay futuro' : '💔 Mejor amigos nomás'}`
        react = '💘'
    }

    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: caption,
        mentions: [who, m.sender]
    })
    await conn.sendMessage(m.chat, { react: { text: react, key: m.key } })
}

handler.help = ['infiel @', 'cachoso @', 'ex @', 'segunda @', 'toxico @', 'redflag @', 'amante @', 'compatibilidad @']
handler.tags = ['fun']
handler.command = ['infiel', 'cachoso', 'ex', 'segunda', 'toxico', 'redflag', 'amante', 'compatibilidad']
handler.group = true

export default handler