import axios from 'axios';
import FormData from 'form-data';

const REMOVE_BG_KEY = '3SqybUm2S1uEb9yGzErTrdfP' // tu key de remove.bg

let handler = async (m, { conn, prefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) return m.reply(`📸 Responde a una imagen con el comando *${prefix}${command}*`);
    if (!mime.startsWith('image')) return m.reply(`⚠️ Solo se admiten imágenes.`);

    // Reacción de procesamiento
    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    const media = await q.download();

    // PASO 1: MEJORAR CON IHANCER AI
    const enhancedBuffer = await ihancer(media, { method: 1, size: 'high' });

    // PASO 2: QUITAR FONDO CON REMOVE.BG
    const formData = new FormData()
    formData.append('image_file', enhancedBuffer, { filename: 'hd.png', contentType: 'image/png' })
    formData.append('size', 'auto') 

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_KEY,
        ...formData.getHeaders()
      },
      body: formData
    })

    if (!response.ok) throw new Error(`Error remove.bg: ${response.statusText}`)
    const resultBuffer = Buffer.from(await response.arrayBuffer())

    const caption = `╭╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╮
┃  ✨ *GARFIEL BOT*
┃
┃ ⚙️ *Proceso:* HD AI + Remove BG
┃ 🔝 *Calidad:* High Max
┃ ✅ *Estado:* Fondo eliminado
┃ 🔥 *By:* Whois Developers
╰╾━━━━╼ 〔 🚀 〕 ╾━━━━╼╯
*Power & Speed Style*`;

    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption
    }, { quoted: m });

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await m.reply(`⚠️ Ocurrió un error: ${e.message}`);
  }
};

async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    const _size = ['low', 'medium', 'high']
    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Se requiere una imagen')
    if (method < 1 || method > 4) throw new Error('Métodos disponibles: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Calidades disponibles: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `didier_${Date.now()}.jpg`)

    const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
        headers: {
            ...form.getHeaders(),
            'accept-encoding': 'gzip',
            'host': 'ihancer.com',
            'user-agent': 'Dart/3.5 (dart:io)'
        },
        responseType: 'arraybuffer'
    })
    return Buffer.from(data)
}

handler.help = ['removebg', 'rbg'];
handler.tags = ['tools', 'ai'];
handler.command = ['removebg', 'rbg'];
handler.limit = true;

export default handler;