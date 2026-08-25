import fetch from 'node-fetch';

const handler = async (m, { args, conn, command, prefix }) => {
  const emoji = '🎵'

  if (!args[0]) {
    let ejemplos = ['Adele Hello', 'Sia Unstoppable', 'Maroon 5 Memories', 'Karol G Provenza', 'Natalia Jiménez Creo en mí'];
    let random = ejemplos[Math.floor(Math.random() * ejemplos.length)];
    return m.reply(`${emoji} *Ejemplo de uso:* ${(prefix || '.') + command} ${random}`);
  }

  await conn.sendMessage(m.chat, { react: { text: '⏱', key: m.key } });

  const query = encodeURIComponent(args.join(' '));
  const searchUrl = `https://api.delirius.store/search/spotify?q=${query}`;

  try {
    const res = await fetch(searchUrl);
    const json = await res.json();

    if (!json.status ||!json.data || json.data.length === 0) {
      return m.reply('❌ No encontré la canción que estás buscando.');
    }

    const track = json.data[0];
    if (!track ||!track.url) {
      return m.reply('⚠️ Resultado inválido de la API.');
    }

    // Buscar descarga
    const downloadUrl = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(track.url)}`;
    const dlRes = await fetch(downloadUrl).then(r => r.json()).catch(() => null);

    const audioUrl = dlRes?.data?.url;
    if (!audioUrl) {
      return m.reply('⚠️ Error al obtener el enlace de descarga. Intenta con otra canción.');
    }

    const caption = `
╔═══『 SPOTIFY ${emoji} 』
║ ✦ *Título:* ${track.title}
║ ✦ *Artista:* ${track.artist}
║ ✦ *Álbum:* ${track.album}
║ ✦ *Duración:* ${track.duration}
║ ✦ *Popularidad:* ${track.popularity}%
║ ✦ *Publicado:* ${track.publish}
║ ✦ *Link:* ${track.url}
╚═════════════════╝
*Powered by Delirius API*`;

    await conn.sendMessage(m.chat, {
      image: { url: track.image },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${track.title} - ${track.artist}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('⚠️ Ocurrió un error al buscar o descargar la canción. La API puede estar saturada.');
  }
};

handler.help = ['spotify <canción>'];
handler.tags = ['busqueda', 'descargas'];
handler.command = ['spotify', 'spt'];
handler.limit = true;

export default handler;