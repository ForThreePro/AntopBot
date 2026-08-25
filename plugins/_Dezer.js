import axios from 'axios';
import FormData from 'form-data';

const REMOVE_BG_KEY = '3SqybUm2S1uEb9yGzErTrdfP'

// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

let handler = async (m, { conn, prefix, command }) => {
  try {
    let q = m.quoted? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) return m.reply(`📸 Responde a una imagen con el comando *${prefix}${command}*`);
    if (!mime.startsWith('image')) return m.reply(`⚠️ Solo se admiten imágenes.`);

    await react(conn, m, "⚡");
    await m.reply('⏳ Procesando imagen HD + Quitar fondo...')

    const media = await q.download();

    // PASO 1: HD
    const enhancedBuffer = await ihancer(media, { method: 1, size: 'high' });

    // PASO 2: REMOVE BG
    const formData = new FormData()
    formData.append('image_file', enhancedBuffer, { filename: 'hd.png', contentType: 'image/png' })
    formData.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': REMOVE_BG_KEY,...formData.getHeaders() },
      body: formData
    })

    if (!response.ok) throw new Error(`Error remove.bg: ${response.statusText}`)
    const resultBuffer = Buffer.from(await response.arrayBuffer())

    const caption = `╭─「 PROCESADO CON IA 」
│
│ ⚙️ PROCESO: HD + Quitar Fondo
│ 🔝 CALIDAD: Alta
│ 📦 FORMATO: PNG Sin Fondo
│
╰───────────────────────`

    // 1. ENVIAR IMAGEN NORMAL PRIMERO
    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: caption
    }, { quoted: m });

    // 2. PREGUNTAR SI QUIERE DOCUMENTO
    await conn.sendMessage(m.chat, {
      text: `¿Deseas recibir esta imagen como DOCUMENTO sin compresión?`,
      footer: 'Responde: si o no',
      buttons: [
        {
          buttonId: `.docsi_${m.sender}`,
          buttonText: { displayText: '✅ SI, ENVIAR DOCUMENTO' },
          type: 1
        },
        {
          buttonId: `.docno_${m.sender}`,
          buttonText: { displayText: '❌ NO' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m });

    // GUARDAR TEMPORAL
    global.resultadosHD = global.resultadosHD || {}
    global.resultadosHD[m.sender] = resultBuffer

    await react(conn, m, "✅");

  } catch (e) {
    console.error(e);
    await react(conn, m, "❌");
    await m.reply(`❌ Ocurrió un error: ${e.message}`);
  }
};

// HANDLER PARA BOTONES
handler.before = async (m, { conn }) => {
  if (!m.message?.buttonsResponseMessage) return
  const buttonId = m.message.buttonsResponseMessage.selectedButtonId

  if (buttonId?.startsWith('.docsi_')) {
    const sender = buttonId.split('_')[1]
    const buffer = global.resultadosHD?.[sender]
    if (!buffer) return m.reply('❌ El proceso expiró. Vuelve a usar el comando.')

    await conn.sendMessage(m.chat, {
      document: buffer,
      mimetype: 'image/png',
      fileName: `HD_NoBG_${Date.now()}.png`,
      caption: '✅ DOCUMENTO ENVIADO SIN COMPRESIÓN'
    }, { quoted: m })

    delete global.resultadosHD[sender]
  }

  if (buttonId?.startsWith('.docno_')) {
    delete global.resultadosHD[m.sender]
    await m.reply('👍 Entendido.')
  }
}

async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    const _size = ['low', 'medium', 'high']
    if (!buffer ||!Buffer.isBuffer(buffer)) throw new Error('Se requiere una imagen')
    if (method < 1 || method > 4) throw new Error('Métodos disponibles: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Calidades disponibles: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `file_${Date.now()}.jpg`)

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
handler.tags = ['tools'];
handler.command = ['removebg', 'rbg']; // <-- AQUI ESTAN LOS 2 COMANDOS
handler.limit = true;

export default handler;