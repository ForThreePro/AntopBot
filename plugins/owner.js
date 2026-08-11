import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginsDir = path.join(__dirname, '../plugins')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.owner.some(([number]) => number === m.sender.split('@')[0]))
        return m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *ERROR* 」─╮\n│ ❌ *Solo Owner*\n╰─────────────`)

    // ============ ADD PLUGIN ============
    if (command === 'addplugin' || command === 'añadir') {
        if (!m.quoted) return m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *AÑADIR PLUGIN* 」─╮\n│ 🚩 *Responde a un.js*\n│ 📌 *Ejemplo:* ${usedPrefix}addplugin menu.js\n╰─────────────`)

        let name = text || m.quoted.fileName || `plugin_${Date.now()}.js`
        if (!name.endsWith('.js')) name += '.js'
        let filePath = path.join(pluginsDir, name)

        try {
            let media = await m.quoted.download()
            fs.writeFileSync(filePath, media)
            await m.react('✅')
            m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *PLUGIN AÑADIDO* 」─╮\n│ 📄 *Archivo:* ${name}\n│ 📁 *Ruta:* plugins/${name}\n╰─────────────\n> *Reinicia el bot para aplicar*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Error al guardar: ${e.message}`)
        }
    }

    // ============ EDIT PLUGIN ============
    if (command === 'editplugin' || command === 'editar') {
        let name = text
        if (!name) return m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *EDITAR PLUGIN* 」─╮\n│ 🚩 *Uso:* ${usedPrefix}editar nombre.js\n│ 📌 *Luego responde con el código nuevo*\n╰─────────────`)

        if (!name.endsWith('.js')) name += '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`❌ *No existe:* ${name}`)

        if (!m.quoted ||!m.quoted.text) {
            let currentCode = fs.readFileSync(filePath, 'utf-8')
            await conn.sendMessage(m.chat, {
                document: { url: filePath },
                mimetype: 'text/javascript',
                fileName: name,
                caption: `𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *EDITAR* 」─╮\n│ 📄 *Archivo:* ${name}\n│ 💌 *Responde a este archivo con el código nuevo*\n╰─────────────`
            }, { quoted: m })
            return
        }

        try {
            let newCode = m.quoted.text
            fs.writeFileSync(filePath, newCode)
            await m.react('✅')
            m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *PLUGIN EDITADO* 」─╮\n│ ✏️ *Archivo:* ${name}\n╰─────────────\n> *Reinicia el bot para aplicar*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Error: ${e.message}`)
        }
    }

    // ============ GET PLUGIN ============
    if (command === 'getplugin' || command === 'get') {
        if (!text) return m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *OBTENER PLUGIN* 」─╮\n│ 🚩 *Uso:* ${usedPrefix}getplugin nombre.js\n│ 📌 *Lista:* ${usedPrefix}plugins\n╰─────────────`)

        let name = text.endsWith('.js')? text : text + '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`❌ *No existe el plugin:* ${name}`)

        try {
            let code = fs.readFileSync(filePath, 'utf-8')
            if (code.length > 4000) {
                // Si es muy largo lo manda como documento
                await conn.sendMessage(m.chat, {
                    document: { url: filePath },
                    mimetype: 'text/javascript',
                    fileName: name,
                    caption: `𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *CÓDIGO* 」─╮\n│ 📄 *Archivo:* ${name}\n╰─────────────`
                }, { quoted: m })
            } else {
                // Si es corto lo manda en texto
                m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *${name}* 」─╮\n\`\`\`js\n${code}\n\`\`\n╰─────────────`)
            }
            await m.react('✅')
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Error: ${e.message}`)
        }
    }

    // ============ DEL PLUGIN ============
    if (command === 'delplugin' || command === 'eliminar') {
        if (!text) return m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *ELIMINAR PLUGIN* 」─╮\n│ 🚩 *Uso:* ${usedPrefix}delplugin nombre.js\n│ 📌 *Lista:* ${usedPrefix}plugins\n╰─────────────`)

        let name = text.endsWith('.js')? text : text + '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`❌ *No existe el plugin:* ${name}`)

        try {
            fs.unlinkSync(filePath)
            await m.react('✅')
            m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *PLUGIN ELIMINADO* 」─╮\n│ 🗑️ *Archivo:* ${name}\n╰─────────────\n> *Reinicia el bot para aplicar*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Error al eliminar: ${e.message}`)
        }
    }

    // ============ LIST PLUGINS ============
    if (command === 'plugins' || command === 'plist') {
        let files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))
        if (files.length === 0) return m.reply('No hay plugins')
        let list = files.map((v, i) => `│ ${i + 1}. ${v}`).join('\n')
        m.reply(`𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓. 🩰\n\n╭─「 *LISTA DE PLUGINS* 」─╮\n${list}\n╰─────────────\n> *Total:* ${files.length}`)
    }
}

handler.help = ['addplugin', 'editplugin', 'getplugin', 'delplugin', 'plugins']
handler.tags = ['owner']
handler.command = /^(addplugin|añadir|editplugin|editar|getplugin|get|delplugin|eliminar|plugins|plist)$/i

export default handler