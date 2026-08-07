import util from 'util'
import path from 'path'

let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, text }) {
    if (!groupMetadata) return m.reply('🐉 *Este comando solo funciona en grupos*')
    if (!text) return m.reply(`🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

*Ejemplo de uso:*
.top *Mejores en PVP*
.top *Más activos*`)

    let ps = groupMetadata.participants.map(v => v.id)
    if (ps.length < 10) return m.reply('⚡ *Se necesitan mínimo 10 miembros en el grupo*')

    let a = ps.getRandom()
    let b = ps.getRandom()
    let c = ps.getRandom()
    let d = ps.getRandom()
    let e = ps.getRandom()
    let f = ps.getRandom()
    let g = ps.getRandom()
    let h = ps.getRandom()
    let i = ps.getRandom()
    let j = ps.getRandom()
    let k = Math.floor(Math.random() * 70)

    let emojis = ['🤓','😅','😂','😳','😎','🥵','😱','🤑','🙄','💩','🍑','🤨','🥴','🔥','👇🏻','😔','👀','🌚','🗿']
    let x = pickRandom(emojis)

    let vn = `https://hansxd.nasihosting.com/sound/sound${k}.mp3`

    let top = `🐉 𓆩 𝗧𝗢𝗣 𝟭𝟬 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\` ${text.toUpperCase()} \`\` —˙𖦹.🏆꒷

 ⤷ ┇ *RANKING* ：✿ 。

${x} *1.* ${user(a)}
${x} *2.* ${user(b)}
${x} *3.* ${user(c)}
${x} *4.* ${user(d)}
${x} *5.* ${user(e)}
${x} *6.* ${user(f)}
${x} *7.* ${user(g)}
${x} *8.* ${user(h)}
${x} *9.* ${user(i)}
${x} *10.* ${user(j)}

━━━━━━━━━━━
*Powered by*: SON GOKU PREM 💥`

    m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j]})
}

handler.help = ['top <texto>']
handler.tags = ['fun']
handler.command = /^(top)$/i
handler.group = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

Array.prototype.getRandom = function() {
    return this[Math.floor(Math.random() * this.length)]
}