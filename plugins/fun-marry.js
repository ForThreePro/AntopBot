let handler = async (m, { conn, command, text }) => {
  let yo = m.sender
  let who = m.quoted?.sender || m.mentionedJid[0]

  if(!global.db.data.casados) global.db.data.casados = {}
  let casados = global.db.data.casados

  // BUSCAR POR NOMBRE
  if(!who && text) {
    let nombreBuscado = text.replace(command, '').replace('@','').trim().toLowerCase()
    if(nombreBuscado) {
      let group = await conn.groupMetadata(m.chat)
      let participante = group.participants.find(p => {
        let nombre = conn.getName(p.id) || p.id.split('@')[0]
        return nombre.toLowerCase().includes(nombreBuscado)
      })
      if(participante) who = participante.id
    }
  }

  if(command == 'marry'){
    if(!who) return m.reply(`💍 *Úsalo así:*\n1. Responde a su mensaje con *.marry*\n2. *.marry @usuario*\n3. *.marry Romi2* 🥺`)
    if(who === yo) return m.reply(`🌸 *No te puedes casar contigo mismo*`)
    if(casados[yo] || casados[who]) return m.reply(`😿 *Uno de los 2 ya está casado*\nUsen *.divorce* primero`)

    casados[yo] = who
    casados[who] = yo

    let numYo = yo.split('@')[0]
    let numWho = who.split('@')[0]

    let txt = `ᯇ 💒 𝗕𝗢𝗗𝗔 𝗕𝗢𝗧 💒 ୧

@${numYo} 💍 @${numWho}

"Hoy 2 corazones decidieron caminar juntos.
Cuidarse, reír, abrazarse fuerte
y elegirse hasta en los días grises" ✨

──愛 *𝗝𝗨𝗥𝗔𝗠𝗘𝗡𝗧𝗢* ╏ 🕊️
"Prometo ser tu hogar, tu risa y tu paz.
Amarte hoy, mañana y siempre"

> *Que Dios bendiga esta bonita unión* 🎉💫`

    await conn.sendMessage(m.chat, { text: txt, mentions: [yo, who] }, { quoted: m })
  }

  if(command == 'divorce'){
    if(!casados[yo]) return m.reply(`😔 *No estás casado con nadie*`)

    let pareja = casados[yo]
    let numYo = yo.split('@')[0]
    let numPareja = pareja.split('@')[0]

    delete casados[yo]
    delete casados[pareja]

    let txt = `ᯇ 💔 𝗗𝗜𝗩𝗢𝗥𝗖𝗜𝗢 𝗕𝗢𝗧 💔 ୧

@${numYo} 💔 @${numPareja}

"A veces soltar también es quererse.
Gracias por los bonitos recuerdos que compartieron" 🥺

──愛 *𝗔𝗖𝗧𝗔* ╏ 🕊️
"Se firma el adiós con respeto y cariño"

> *Les deseo sanar y ser felices* 🕊️🤍`

    await conn.sendMessage(m.chat, { text: txt, mentions: [yo, pareja] }, { quoted: m })
  }

  if(command == 'couple' || command == 'pareja'){
    let parejas = Object.keys(casados)
    if(parejas.length === 0) return m.reply(`😔 *No hay parejas casadas aún*`)

    let lista = []
    let mencionados = []
    let vistos = new Set()

    for(let i = 0; i < parejas.length; i++) {
      let p1 = parejas[i]
      let p2 = casados[p1]

      if(vistos.has(p1) || vistos.has(p2)) continue

      vistos.add(p1)
      vistos.add(p2)

      let num1 = p1.split('@')[0]
      let num2 = p2.split('@')[0]

      lista.push(`💍 @${num1} & @${num2}`)
      mencionados.push(p1, p2)
    }

    if(lista.length === 0) return m.reply(`😔 *No hay parejas casadas aún*`)

    let txt = `ᯇ 💒 𝗧𝗢𝗗𝗔𝗦 𝗟𝗔𝗦 𝗣𝗔𝗥𝗘𝗝𝗔𝗦 💒 ୧

${lista.join('\n')}

──愛 *Total:* ${lista.length} pareja(s) 💕
> *El amor está en el aire* ✨`

    await conn.sendMessage(m.chat, { text: txt, mentions: mencionados }, { quoted: m })
  }
}

handler.help = ['marry <@responder/nombre>', 'divorce', 'couple']
handler.tags = ['fun']
handler.command = /^(marry|divorce|couple|pareja)$/i
handler.group = true
export default handler