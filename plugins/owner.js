import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginsDir = path.join(__dirname, '../plugins')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.owner.some(([number]) => number === m.sender.split('@')[0]))
        return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗢𝗪𝗡𝗘𝗥* 🐱

*━━━━━━━━━━*
*❌ ACCESO DENEGADO*

*➤* Solo *Owner* puede usar este comando

*━━━━━━━━━━*`)

    // ============ ADD PLUGIN ============
    if (command === 'addplugin' || command === 'añadir') {
        if (!m.quoted) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗔𝗗𝗗 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Responde a un archivo *.js*
*➤* Ejemplo: *${usedPrefix}addplugin menu.js*

*━━━━━━━━━━*`)

        let name = text || m.quoted.fileName || `plugin_${Date.now()}.js`
        if (!name.endsWith('.js')) name += '.js'
        let filePath = path.join(pluginsDir, name)

        try {
            let media = await m.quoted.download()
            fs.writeFileSync(filePath, media)
            await m.react('✅')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗔𝗗 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*✅ PLUGIN AÑADIDO*

*📄 Archivo:* *${name}*
*📁 Ruta:* *plugins/${name}*

*━━━━━━━━━━*
> _Reinicia el bot para aplicar los cambios_`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* Error al guardar: ${e.message}

*━━━━━━━━━━*`)
        }
    }

    // ============ EDIT PLUGIN ============
    if (command === 'editplugin' || command === 'editar') {
        let name = text
        if (!name) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗘𝗗𝗜𝗧 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Uso: *${usedPrefix}editar nombre.js*
*➤* Luego responde con el código nuevo

*━━━━━━━━━━*`)

        if (!name.endsWith('.js')) name += '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* No existe: *${name}*

*━━━━━━━━━━*`)

        if (!m.quoted ||!m.quoted.text) {
            let currentCode = fs.readFileSync(filePath, 'utf-8')
            await conn.sendMessage(m.chat, {
                document: { url: filePath },
                mimetype: 'text/javascript',
                fileName: name,
                caption: `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗘𝗗𝗜𝗧* 🐱

*━━━━━━━━━━*
*📄 Archivo:* *${name}*
*💌 Responde a este archivo con el código nuevo*

*━━━━━━━━━━*`
            }, { quoted: m })
            return
        }

        try {
            let newCode = m.quoted.text
            fs.writeFileSync(filePath, newCode)
            await m.react('✅')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗘𝗗𝗜𝗧 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*✅ PLUGIN EDITADO*

*✏️ Archivo:* *${name}*

*━━━━━━━━━━*
> _Reinicia el bot para aplicar los cambios_`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* ${e.message}

*━━━━━━━━━━*`)
        }
    }

    // ============ GET PLUGIN ============
    if (command === 'getplugin' || command === 'get') {
        if (!text) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗚𝗘𝗧 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Uso: *${usedPrefix}getplugin nombre.js*
*➤* Lista: *${usedPrefix}plugins*

*━━━━━━━━━━*`)

        let name = text.endsWith('.js')? text : text + '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* No existe el plugin: *${name}*

*━━━━━━━━━━*`)

        try {
            let code = fs.readFileSync(filePath, 'utf-8')
            if (code.length > 4000) {
                await conn.sendMessage(m.chat, {
                    document: { url: filePath },
                    mimetype: 'text/javascript',
                    fileName: name,
                    caption: `🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗖𝗢𝗗𝗜𝗚𝗢* 🐱

*━━━━━━━━━━*
*📄 Archivo:* *${name}*

*━━━━━━━━━━*`
                }, { quoted: m })
            } else {
                m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - ${name}* 🐱

*━━━━━━━━━━*
\`\`js
${code}
\`\`
*━━━━━━━━━━*`)
            }
            await m.react('✅')
        } catch (e) {
            await m.react('❌')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* ${e.message}

*━━━━━━━━━━*`)
        }
    }

    // ============ DEL PLUGIN ============
    if (command === 'delplugin' || command === 'eliminar') {
        if (!text) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗗𝗘𝗟 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*⚠️ ERROR DE USO*

*➤* Uso: *${usedPrefix}delplugin nombre.js*
*➤* Lista: *${usedPrefix}plugins*

*━━━━━━━━━━*`)

        let name = text.endsWith('.js')? text : text + '.js'
        let filePath = path.join(pluginsDir, name)

        if (!fs.existsSync(filePath))
            return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* No existe el plugin: *${name}*

*━━━━━━━━━━*`)

        try {
            fs.unlinkSync(filePath)
            await m.react('✅')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗗𝗘𝗟 𝗣𝗟𝗨𝗚𝗜𝗡* 🐱

*━━━━━━━━━━*
*✅ PLUGIN ELIMINADO*

*🗑️ Archivo:* *${name}*

*━━━━━━━━━━*
> _Reinicia el bot para aplicar los cambios_`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* Error al eliminar: ${e.message}

*━━━━━━━━━━*`)
        }
    }

    // ============ LIST PLUGINS ============
    if (command === 'plugins' || command === 'plist') {
        let files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))
        if (files.length === 0) return m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🐱

*━━━━━━━━━━*
*📂 No hay plugins instalados*

*━━━━━━━━━━*`)
        let list = files.map((v, i) => `*${i + 1}.* ${v}`).join('\n')
        m.reply(`🐱 *𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗣𝗟𝗨𝗚𝗜𝗡𝗦* 🐱

*━━━━━━━━━━*
${list}

*━━━━━━━━━━*
*Total:* *${files.length}* plugins`)
    }
}

handler.help = ['addplugin', 'editplugin', 'getplugin', 'delplugin', 'plugins']
handler.tags = ['owner']
handler.command = /^(addplugin|añadir|editplugin|editar|getplugin|get|delplugin|eliminar|plugins|plist)$/i

export default handler