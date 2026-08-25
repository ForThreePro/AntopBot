import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
import crypto from "crypto";

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    info: "/v2/info",
    download: "/download",
    cdn: "/random-cdn"
  },
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://yt.savetube.me",
    referer: "https://yt.savetube.me/",
    "user-agent": "Postify/1.0.0"
  },
  crypto: {
    hexToBuffer: (hex) => Buffer.from(hex.match(/.{1,2}/g).join(""), "hex"),
    decrypt: async (enc) => {
      const secretKey = "C5D58EF67A7584E4A29F6C35BBC4EB12";
      const data = Buffer.from(enc, "base64");
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);
      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    },
  },
  isUrl: (str) => {
    try {
      new URL(str);
      return /youtube.com|youtu.be/.test(str);
    } catch { return false }
  },
  youtube: (url) => {
    const patterns = [
      /youtube.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of patterns) {
      if (pattern.test(url)) return url.match(pattern)[1];
    }
    return null;
  },
  request: async (endpoint, data = {}, method = "post") => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith("http")? "" : savetube.api.base}${endpoint}`,
        data: method === "post"? data : undefined,
        params: method === "get"? data : undefined,
        headers: savetube.headers
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  },
  getCDN: async () => {
    const res = await savetube.request(savetube.api.cdn, {}, "get");
    return res.status? { status: true, data: res.data.cdn } : res;
  },
  download: async (link, type = "audio") => {
    if (!savetube.isUrl(link)) return { status: false, error: "URL inválida" };
    const id = savetube.youtube(link);
    if (!id) return { status: false, error: "No se pudo obtener ID" };

    const cdnx = await savetube.getCDN();
    if (!cdnx.status) return cdnx;
    const cdn = cdnx.data;

    const videoInfo = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
    if (!videoInfo.status) return videoInfo;

    const decrypted = await savetube.crypto.decrypt(videoInfo.data.data);

    const downloadData = await savetube.request(`https://${cdn}${savetube.api.download}`, {
      id,
      downloadType: type,
      quality: type === "audio"? "mp3" : "720p",
      key: decrypted.key
    });

    if (!downloadData.data?.data?.downloadUrl) return { status: false, error: "No se pudo obtener link" };

    return {
      status: true,
      result: {
        title: decrypted.title || "Desconocido",
        author: decrypted.channel || "Desconocido",
        views: decrypted.viewCount || "0",
        duration: decrypted.lengthSeconds || "0",
        uploaded: decrypted.uploadedAt || "Desconocido",
        format: type === "audio"? "mp3" : "mp4",
        download: downloadData.data.downloadUrl,
        thumbnail: decrypted.thumbnail
      }
    };
  }
};

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text?.trim()) {
    return m.reply(`🎧 *Uso:* ${usedPrefix}${command} <link o nombre>\n\n*Ejemplos:*\n${usedPrefix}play Bad Bunny\n${usedPrefix}mp4 https://youtu.be/xxx`);
  }

  await m.react("🔎");
  try {
    let url, title, thumbnail, author, views, duration, uploaded;

    if (savetube.isUrl(text)) {
      const id = savetube.youtube(text);
      const search = await yts({ videoId: id });
      url = text;
      title = search.title;
      thumbnail = search.thumbnail;
      author = search.author.name;
      views = search.views.toLocaleString();
      duration = search.timestamp;
      uploaded = search.ago;
    } else {
      const search = await yts.search({ query: text, pages: 1 });
      if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");
      const v = search.videos[0];
      url = v.url;
      title = v.title;
      thumbnail = v.thumbnail;
      author = v.author.name;
      views = v.views.toLocaleString();
      duration = v.timestamp;
      uploaded = v.ago;
    }

    const info = `★ *${global.botname || 'Bot'}* ★

┏ *Título:* ${title}
┃ *Canal:* ${author}
┃ *Vistas:* ${views}
┃ *Duración:* ${duration}
┃ *Publicado:* ${uploaded}
┗ *Descargando...*`;

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: { documentMessage: { title: title, fileName: global.botname || "Bot" } }
    }

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: info
    }, { quoted: fkontak });

    if (["mp3", "play"].includes(command)) {
      await m.react("🎧");
      const dl = await savetube.download(url, "audio");
      if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);

      await conn.sendMessage(m.chat, {
        audio: { url: dl.result.download },
        mimetype: "audio/mpeg",
        fileName: `${dl.result.title}.mp3`
      }, { quoted: fkontak });
      await m.react("✅");
    }

    if (["mp4", "play2"].includes(command)) {
      await m.react("🎬");
      const dl = await savetube.download(url, "video");
      if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);

      await conn.sendMessage(m.chat, {
        video: { url: dl.result.download },
        fileName: `${dl.result.title}.mp4`,
        mimetype: "video/mp4",
        caption: `🎬 ${dl.result.title}`
      }, { quoted: fkontak });
      await m.react("✅");
    }

  } catch (error) {
    console.error(error);
    await m.react("❌");
    m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.help = ["play", "play2", "mp3", "mp4"];
handler.tags = ["downloader"];
handler.command = ["play", "play2", "mp3", "mp4"];
handler.limit = true;

export default handler;