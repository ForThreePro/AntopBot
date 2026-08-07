import fs from 'fs'
import os from 'os'

let handler = async (m, { command }) => {
    await m.react('⏳')

    if (command === 'cleartmp') {
        const tmpPath = './tmp'
        if (fs.existsSync(tmpPath)) {
            fs.readdirSync(tmpPath).forEach(file => fs.unlinkSync(`${tmpPath}/${file}`))
        }
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐋𝐈𝐌𝐏𝐈𝐄𝐙𝐀\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗖𝗔𝗖𝗛𝗘 𝗣𝗨𝗥𝗜𝗙𝗜𝗖𝗔𝗗𝗢 ：✿ 。

──愛 *𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢* ╏ 🔥
🔥 ➛ Caché temporal eliminado
🔥 ➛ Memoria liberada con éxito

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ El bot está más ligero

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"He purificado los restos del entrenamiento"* 💥`
        return m.reply(texto)
    }

    if (command === 'cpu') {
        let cpu = os.loadavg()[0].toFixed(2)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐂𝐏𝐔\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗣𝗥𝗢𝗖𝗘𝗦𝗔𝗗𝗢𝗥 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Carga CPU: ${cpu}%

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Si supera 90% el bot va lento

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Mi ki se está enfocando al ${cpu}%"* 💥`
        return m.reply(texto)
    }

    if (command === 'ram') {
        const used = process.memoryUsage()
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐑𝐀𝐌\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗠𝗘𝗠𝗢𝗥𝗜𝗔 𝗘𝗡 𝗨𝗦𝗢 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Consumo RAM: ${ram} MB

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Memoria usada por el proceso

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Tengo suficiente energía para seguir"* 💥`
        return m.reply(texto)
    }

    if (command === 'uptime') {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐔𝐏𝐓𝐈𝐌𝐄\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗧𝗜𝗘𝗠𝗣𝗢 𝗔𝗖𝗧𝗜𝗩𝗢 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🌌
🌌 ➛ Tiempo activo: ${uptime}

──愛 *𝗡𝗢𝗧𝗔* ╏ ⚡
⚡ ➛ Desde que se inició el bot

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Llevo entrenando ${uptime} sin parar"* 💥`
        return m.reply(texto)
    }

    if (command === 'info') {
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)
        const used = process.memoryUsage()
        let cpu = os.loadavg()[0].toFixed(2)
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)

        let texto = `
🐉 𓆩 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 𓆪 🐉

.⃟𖥔 ݁. 𖦹˙— \`\`𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐃𝐄 𝐒𝐈𝐒𝐓𝐄𝐌𝐀\`\` —˙𖦹.🏆꒷

 ⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 ：✿ 。

──愛 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 🔥
🔥 ➛ Uptime: ${muptime}
🔥 ➛ Memoria RAM: ${ram} MB
🔥 ➛ Carga CPU: ${cpu}%

──愛 *𝗗𝗘𝗧𝗔𝗟𝗘𝗦* ╏ 🌌
🌌 ➛ Desarrollado por: Sebastián Barboza
🌌 ➛ Estado: Operativo

━━━━━━━━━━━
*Owner*: @whois.yallico
> *"Todos mis sistemas están al 100%"* 💥`
        return m.reply(texto)
    }
}

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['cleartmp', 'cpu', 'ram', 'uptime', 'info']
handler.tags = ['main']
handler.command = /^(cleartmp|cpu|ram|uptime|info)$/i
handler.rowner = true

export default handler