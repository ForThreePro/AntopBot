import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`🌸 *Usá bien el comando pues cerote:* \n\n✨ *Ejemplo:* ${usedPrefix + command} https://www.tiktok.com/@usuario/video/123456789`);
  }

  try {
    await conn.reply(m.chat, '😏 *Calmate pues mija, ya estoy jalando el audio...* 🎧', m);

    const res = await tiktokdl(args[0]);

    if (!res || !res.data || !res.data.music_info || !res.data.music_info.play) {
      return m.reply('❌ *Nel mano, no jalo ni verga ese audio.*\nVerificá que el link sea válido pues 🙄.');
    }

    const audio = res.data.music_info.play;
    const info = res.data;

    const texto = `
💋 *Mirá lo que te traje pues mija, tu rolita del TikTok está lista:*  

📌 *Título:* ${info.title || 'Ni nombre tiene esa mierda'}
🎤 *Sonido:* ${info.music_info?.title || 'Un chorizo ahí sin info'}
🧑🏻‍💻 *Usuario:* @${info.author?.unique_id || 'un don nadie'}
🫧 *Nombre:* ${info.author?.nickname || 'Desconocido'}
📅 *Publicado:* ${info.create_time || 'Ni sabe'}

🔥 *Estadísticas de esa babosada:*
💗 Likes: ${info.digg_count}
💬 Comentarios: ${info.comment_count}
🔁 Compartido: ${info.share_count}
👁️‍🗨️ Vistas: ${info.play_count}
⬇️ Descargas: ${info.download_count}

🔗 https://tiktok.com/@${info.author?.unique_id || ''}/video/${info.video_id || ''}
`.trim();

    await conn.sendFile(m.chat, audio, 'tiktok-audio.mp3', texto, m, null, {
      mimetype: 'audio/mp4'
    });

  } catch (e) {
    console.error(e);
    m.reply(`🚫 *Puta, algo tronó pues:* \n\n${e.message}`);
  }
};

handler.help = ['ttmp3', 'tiktokmp3'];
handler.tags = ['descargas'];
handler.command = /^ttmp3|tiktokmp3$/i;

export default handler;

// Función para descargar desde TikWM
async function tiktokdl(url) {
  const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
  const res = await fetch(api);
  const json = await res.json();
  return json;
}