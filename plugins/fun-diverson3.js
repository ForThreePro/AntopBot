let handler = async (m, { conn, command, text, participants }) => {

    // ===== COMANDO TOP LIBRE CON ESTILO =====
    if (command === 'top') {
        await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } })

        let titulo = text.trim()? text.trim().toUpperCase() : 'DEL GRUPO'

        let miembros = participants.map(u => u.id)
        if(miembros.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas en el grupo')

        let cantidad = miembros.length >= 5? 5 : miembros.length
        let randoms = []
        while(randoms.length < cantidad){
            let rand = miembros[Math.floor(Math.random() * miembros.length)]
            if(!randoms.includes(rand)) randoms.push(rand)
        }

        let txt = `💎 *『 TOP ${cantidad} ${titulo} 』* 💎\n\n`
        let medallas = ['🥇','🥈','🥉','🏅','🎖️']
        randoms.forEach((v, i) => {
            txt += `${medallas[i] || '🏅'} @${v.split('@')[0]}\n`
        })
        txt += `\n⚡ *Sorteado por el algoritmo divino* ⚡`

        return await conn.reply(m.chat, txt, m, { mentions: randoms })
    }

    // ===== DETECTAR USUARIO =====
    let who = m.mentionedJid[0]
            || m.quoted?.sender
            || (conn.parseMention(text)[0])
            || (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

    if (who === '@s.whatsapp.net' ||!who) who = null

    let necesitaPersona = ['abrazar','kabrazo','lesbiana','pajero','pajera','puto','puta','manco','manca','rata','prostituto','prostituta','sinpoto','sintetas','kiss','love','personalidad','sorteo'].includes(command)

    if (necesitaPersona &&!who) {
        return m.reply(`❌ *Error 404* ❌\nTienes que:\n1. *Tocar @* y elegir a la persona\n2. *Responder* al mensaje +.comando\n3..comando 519123456`)
    }

    let user = `@${m.sender.split('@')[0]}`
    let target = who? `@${who.split('@')[0]}` : user

    // ===== TODAS LAS RESPUESTAS CON ESTILO =====
    const respuestas = {
        quiensoy: [`🌟 ${user} eres una leyenda viviente ✨`],
        abrazar: [`🫂 *${user} abraza fuertisimo a ${target}* 🫂`],
        kabrazo: [`🤙 *K-BRAZO GEY ACTIVADO* 🤙\n${user} abraza a ${target} estilo kbro 💪😏`],
        lesbiana: [`🌈 *ANÁLISIS GAYDAR* 🌈\n${target} tiene 99.9% de ser lesbiana`],
        pajero: [`😈 *ALERTA PAJERO* 😈\n${target} vive en el 5vs5 🫠`],
        pajera: [`😏 *ALERTA PAJERA* 😏\n${target} te descubrimos`],
        puto: [`😡 ${target} ¡PUTO!`],
        puta: [`😡 ${target} ¡PUTA!`],
        manco: [`🎮 *${target} ERES MANCO CERTIFICADO* 🎮💀`],
        manca: [`🎮 *${target} ERES MANCA OFICIAL* 🎮💀`],
        rata: [`🐀 *RATA DETECTADA* 🐀\n${target} devuelve lo robado`],
        prostituto: [`💰 *${target} ABRE ONLYFANS* 💰`],
        prostituta: [`💰 *${target} ABRE ONLYFANS* 💰`],
        sinpoto: [`🍑 *${target} SIN POTO CONFIRMADO* 🍑`],
        sintetas: [`🛂 *${target} AEROPUERTO INTERNACIONAL* 🛂`],
        chipi: [`🎶 Chipi chipi chapa chapa ${target} 🎶`],
        chiste: [`🤡 ¿Qué le dice un techo a otro? Techo de menos 🏠`],
        facto: [`🧠 *FACTO* 🧠\nDormir > Todo`],
        genio: [`🧠 ${user} CI: 999 - Eres un genio`],
        kiss: [`💋 *${user} besa apasionadamente a ${target}* 💋`],
        love: [`❤️ ${user} ama con locura a ${target}`],
        personalidad: [`🎭 ${target} eres: 70% caos, 20% ternura, 10% problemas`],
        pregunta: [`✅ SÍ`],
        sorteo: [`🎊 *¡EL GANADOR ES!* 🎊\n🏆 ${target} 🏆`],
        verdad: [`❓ *VERDAD* ❓\n¿Cual es tu secreto más oscuro ${target}?`]
    }

    if (!respuestas[command]) return

    let res = respuestas[command][Math.floor(Math.random() * respuestas[command].length)]
    await conn.reply(m.chat, res, m, { mentions: who? [who, m.sender] : [m.sender] })
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
}

handler.help = [
'top (cualquier texto)',
'abrazar @usuario',
'kabrazo @usuario',
'lesbiana @usuario',
'pajero @usuario',
'pajera @usuario',
'puto @usuario',
'puta @usuario',
'manco @usuario',
'manca @usuario',
'rata @usuario',
'prostituto @usuario',
'prostituta @usuario',
'sinpoto @usuario',
'sintetas @usuario',
'kiss @usuario',
'love @usuario',
'personalidad @usuario',
'sorteo @usuario',
'quiensoy',
'chipi',
'chiste',
'facto',
'genio',
'pregunta',
'verdad'
]
handler.tags = ['diversión']
handler.command = ['quiensoy','abrazar','kabrazo','lesbiana','pajero','pajera','puto','puta','manco','manca','rata','prostituto','prostituta','sinpoto','sintetas','chipi','chiste','facto','genio','kiss','love','personalidad','pregunta','sorteo','top','verdad']
handler.group = true

export default handler