import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchStickerVideo = async (text) => {
const response = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, { params: { text }, responseType: 'arraybuffer' })
if (!response.data) throw new Error('🍕 error al obtener el video de la api.')
return response.data
}

const handler = async (m, { conn, text }) => {
try {
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}
let texto1 = packstickers.text1 || global.packsticker
let texto2 = packstickers.text2 || global.packsticker2

text = m.quoted?.text || text
if (!text) return conn.sendMessage(m.chat, { text: `🐱 𓆩 ***𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🐱\n\n🍕 *responde a un mensaje o ingresa un texto para crear el sticker*` }, { quoted: m })

await m.react('🕒')
const videoBuffer = await fetchStickerVideo(text)
const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
await m.react('✅')

} catch (e) {
await m.react('❌')
conn.sendMessage(m.chat, { text: `🐱 𓆩 ***𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🐱\n\n😿 *se ha producido un problema*\n┆ usa *report* para informarlo.\n\n*Detalle:* ${e.message}` }, { quoted: m })
}}

handler.tags = ['sticker']
handler.help = ['bratv']
handler.command = ['bratv']

export default handler