let frasesAmor = [
  // Las 8 originales
  "Ustedes 2 tienen química de café con pan a las 10pm ❤️",
  "Si el amor fuera wifi, ustedes tendrían señal completa 💘",
  "Destino dijo: tú + tú = problemas bonitos 😏",
  "Cuidado, cupido acaba de marcar territorio aquí 💌",
  "Pareja oficial de robarse la última galleta 🍪💕",
  "El universo los juntó porque juntos son un caos lindo",
  "Modo dúo desbloqueado: complicidad nivel 100%",
  "Si esto fuera telenovela, ya habría beso con lluvia",

  // +100 nuevas tiernas
  "Ustedes dos son de esas miradas que duran 3 horas",
  "Si sonríen juntos, el grupo se derrite 💕",
  "Tienen cara de 'vamos por un helado y hablamos tonterías'",
  "Cupido usó flecha premium con ustedes",
  "Me dan vibras de mantita y peli un domingo",
  "Ustedes son el 'buenos días' que todos queremos",
  "Juntos hacen que el chisme se vea bonito",
  "Su energía dice: equipo para todo",
  "Si el amor fuera playlist, ustedes serían la canción repetida",
  "Parecen hechos del mismo abrazo",
  "Nivel de ternura: peligroso para los solteros",
  "Ustedes son de los que se cuidan el último sorbo",
  "Tienen química de memes internos a las 2am",
  "El destino hizo match antes que Tinder",
  "Se ven como inicio de historia bonita",
  "Juntos convierten un 'hola' en mariposas",
  "Ustedes son evidencia de que sí existe lo bonito",
  "Pareja oficial de compartir audífonos",
  "Si se pierden, que sea agarrados de la mano",
  "Tienen esa complicidad que no necesita palabras",
  "Ustedes son el motivo del 'aww' del grupo",
  "Se nota que se eligen todos los días",
  "Modo acurruque activado",
  "Con ustedes el 'nosotros' suena perfecto",
  "Son de los que se ríen de las mismas tonterías",
  "Parecen sacados de una carta de amor",
  "Ustedes hacen que creer en el amor sea fácil",
  "Tienen abrazo de 'todo va a estar bien'",
  "Si esto fuera libro, ya estaría subrayado",
  "Ustedes son mi dosis de ternura del día",
  "Se cuidan hasta en los detalles chiquitos",
  "Pareja con derecho a robarse sonrisas",
  "Juntos brillan el doble",
  "Ustedes son café calientito en día frío",
  "Tienen cara de planes a futuro",
  "Su conexión se escucha desde aquí",
  "Ustedes son el team 'yo te tapo'",
  "Se ven como un domingo sin apuro",
  "El universo dijo: estos dos sí",
  "Parecen hechos para darse paz",
  "Ustedes son de besos en la frente",
  "Tienen química de notas de voz largas",
  "Con ustedes todo se siente más bonito",
  "Son de los que se guardan el último pedazo",
  "Pareja certificada en hacerse reír",
  "Ustedes son hogar",
  "Se miran como si fuera la primera vez",
  "Tienen esa magia de quedarse callados y estar bien",
  "Ustedes son constelación propia",
  "Parecen promesa cumplida",
  "Juntos hacen que el tiempo se quede",
  "Ustedes son de los que se eligen en el caos",
  "Tienen nivel de ternura desbloqueado",
  "Se ven como abrazo después de un mal día",
  "Ustedes son prueba de que lo simple es lo mejor",
  "Pareja de caminar lento y hablar mucho",
  "Con ustedes dan ganas de creer en cuentos",
  "Ustedes son mi escena favorita",
  "Se nota que se cuidan el corazón",
  "Tienen química de chocolate compartido",
  "Ustedes son de los que suman en silencio",
  "Parecen inicio de todos los 'para siempre'",
  "Juntos hacen que lo cotidiano sea especial",
  "Ustedes son de 'ven, te abrazo'",
  "Tienen esa risa que contagia",
  "Se ven como carta escrita a mano",
  "Ustedes son equipo titular",
  "Pareja de guardarse secretos bonitos",
  "Con ustedes el mundo pesa menos",
  "Ustedes son de miradas que dicen todo",
  "Tienen vibra de picnic y charla larga",
  "Se eligen bonito",
  "Ustedes son de los que se acompañan sin pedirlo",
  "Parecen canción que no cansas",
  "Juntos son refugio",
  "Ustedes son de los que celebran lo pequeño",
  "Tienen cara de futuro compartido",
  "Se ven como paz en forma de persona",
  "Ustedes son de 'cuenta conmigo siempre'",
  "Pareja de apodos ridículos y mucho amor",
  "Con ustedes todo tiene más color",
  "Ustedes son de los que se esperan",
  "Tienen química de frazada para dos",
  "Se miran y ya gané el día",
  "Ustedes son de los que se cuidan el sueño",
  "Parecen hechos de paciencia y cariño",
  "Juntos son mi parte favorita del grupo",
  "Ustedes son de los que se eligen sin apuro",
  "Tienen esa ternura que abraza",
  "Se ven como inicio y final feliz",
  "Ustedes son de notas pegadas en la refri",
  "Pareja de reírse hasta que duela",
  "Con ustedes dan ganas de enamorarse",
  "Ustedes son de los que se sostienen",
  "Tienen magia de 'aquí estoy'",
  "Se ven como capítulo bonito",
  "Ustedes son de los que hacen equipo real",
  "Parecen amor en modo fácil",
  "Juntos son calma",
  "Ustedes son de los que se eligen hoy y mañana",
  "Tienen cara de 'quédate un ratito más'",
  "Se nota que se quieren bonito",
  "Ustedes son de los que convierten un hola en casa"
]

let handler = async (m, { conn, groupMetadata }) => {
  let participantes = groupMetadata.participants.map(p => p.id)

  if (participantes.length < 4) {
    return m.reply('Necesito mínimo 4 personas en el grupo para sacar 2 parejas 😅')
  }

  // Mezclar y sacar 4 personas random
  let mezclados = participantes.sort(() => Math.random() - 0.5)
  let seleccionados = mezclados.slice(0, 4)

  // Formar 2 parejas
  let parejas = []
  for (let i = 0; i < seleccionados.length; i += 2) {
    parejas.push([seleccionados[i], seleccionados[i+1]])
  }

  // Armar el mensaje
  let texto = `💞 *FORMANDO 2 PAREJAS RANDOM* 💞\n\n`

  for (let i = 0; i < parejas.length; i++) {
    let [p1, p2] = parejas[i]
    let frase = frasesAmor[Math.floor(Math.random() * frasesAmor.length)]

    texto += `*Pareja ${i+1}*\n`
    texto += `👉 @${p1.split('@')[0]} + @${p2.split('@')[0]}\n`
    texto += `_${frase}_\n\n`
  }

  texto += `Que el amor los acompañe... o el chisme 😂`

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: seleccionados
  }, { quoted: m })
}

handler.help = ['formarpareja']
handler.tags = ['fun']
handler.command = /^(formarpareja|parejas)$/i
handler.group = true

export default handler