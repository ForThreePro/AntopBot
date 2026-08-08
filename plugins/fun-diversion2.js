let handler = async (m, { conn, command, text, participants }) => {

    let who = m.mentionedJid[0] || m.quoted?.sender || (conn.parseMention(text)[0]) || (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    if (who === '@s.whatsapp.net' ||!who) who = null

    let necesitaPersona = ['pelea','cachetear','curar','robar','mata','insultar'].includes(command)
    if (necesitaPersona &&!who) return m.reply(`❌ *Error 404* ❌\nTienes que:\n1. *Tocar @*\n2. *Responder* +.comando\n3..comando 519123456`)

    let user = `@${m.sender.split('@')[0]}`
    let target = who? `@${who.split('@')[0]}` : user

    const juegos = {
        pelea: [
            `⚔️ *${user} reta a duelo a ${target}* ⚔️\nResultado: ${target} perdió 100 de vida 💀`,
            `🥊 *${user} vs ${target}*\nGanador: ${user} por KO 🔥`,
            `💥 ${user} le mete una paliza a ${target}\n${target} quedó en el piso`,
            `🩸 ${user} hace fatality a ${target}\nFINISH HIM!`,
            `🏆 ${user} gana la pelea contra ${target}\nFlawless victory`,
            `💢 ${user} destroza a ${target} en 3 segundos`,
            `⚡ ${user} usa ultimate y borra a ${target} del mapa`
        ],
        cachetear: [
            `👋 *${user} ZAS! cachetea a ${target}* 👋\n${target} quedó mareado`,
            `💢 ${user} le mete tremenda cachetada a ${target} por noob`,
            `😡 *SLAP* ${user} → ${target}\nDaño crítico x2`,
            `🤚 ${user} cachetea 5 veces a ${target}\nCombo x5`,
            `🥴 ${target} recibió cachetada de ${user}\nPerdió 50 de dignidad`,
            `💥 *BOFETADA LEGENDARIA* ${user} → ${target}`,
            `👏 ${user} aplaudió la cara de ${target}`
        ],
        curar: [
            `💊 *${user} cura a ${target}* 💊\n+100 de vida recuperada ❤️`,
            `✨ ${user} usa poción en ${target}\n${target} está full HP`,
            `🩹 ${user} venda a ${target}\nYa no sangra bro`,
            `🏥 ${user} llevó a ${target} al hospital\nFactura: $0`,
            `🌿 ${user} usa hierbas mágicas en ${target}\nCuración natural`,
            `⚡ ${user} revivió a ${target} con un desfibrilador`,
            `😇 ${user} reza por ${target} y se cura`
        ],
        robar: [
            `🤲 *${user} le robó todo a ${target}* 🤲\n${target} se quedó en 0`,
            `💰 ${user} asaltó a ${target}\nBotín: $999999`,
            `🦹 ${user} le sacó la cartera a ${target}\nCorre que viene la poli`,
            `🏃 ${user} robó y corrió. ${target} se quedó llorando`,
            `🎒 ${user} le vació la mochila a ${target}`,
            `💳 ${user} clonó la tarjeta de ${target}`,
            `🕵️ ${user} en modo ladrón: ${target} no se dio ni cuenta`
        ],
        mata: [
            `🔪 *${user} MATÓ a ${target}* 🔪\nF por ${target} 💀`,
            `💀 ${user} hizo 1 tiro a la cabeza a ${target}\nHS - Headshot`,
            `☠️ ${user} *te bajó* ${target}\nRespawn en 3...2...1`,
            `🩸 *${user} acuchilló a ${target}*\nMisión cumplida`,
            `🔫 ${user} le metió 3 balazos a ${target}\nNo sobrevivió`,
            `💣 ${user} tiró una bomba y se llevó a ${target}`,
            `⚰️ ${target} fue eliminado por ${user}\nGG`
        ],
        insultar: [
            `🤡 ${user} a ${target}: Eres más perdido que señal de wifi en el baño`,
            `💀 ${user} a ${target}: Tu IQ es negativo, felicidades`,
            `🐒 ${user} a ${target}: Pareces lag en forma de persona`,
            `🧠 ${user} a ${target}: Te faltan neuronas y te sobra cara`,
            `📉 ${user} a ${target}: Eres el error 404 de la evolución`,
            `🤦 ${user} a ${target}: Si la estupidez doliera, estarías en UCI`,
            `💩 ${user} a ${target}: Tienes menos chispa que foco fundido`,
            `🦥 ${user} a ${target}: Eres más lento que tortuga con wifi`,
            `🥔 ${user} a ${target}: Tienes cara de papa sin sal`,
            `📱 ${user} a ${target}: Tu cerebro tiene 1% de batería`
        ]
    }

    if (!juegos[command]) return

    let res = juegos[command][Math.floor(Math.random() * juegos[command].length)]
    await conn.reply(m.chat, res, m, { mentions: [who, m.sender] })
    await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } })
}

handler.help = [
'pelea @usuario',
'cachetear @usuario',
'curar @usuario',
'robar @usuario',
'mata @usuario',
'insultar @usuario'
]
handler.tags = ['diversión']
handler.command = ['pelea','cachetear','curar','robar','mata','insultar']
handler.group = true

export default handler