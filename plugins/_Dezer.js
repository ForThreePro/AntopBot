import api from "#izumi/api";

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = q?.msg?.mimetype || q?.mimetype || "";

        if (!/image/.test(mime)) return m.reply(`⚠️ Reply Gambar / Kirim Gambar Caption Buat ${usedPrefix + command}`);

        const media = await q.download();
        const { result: re } = await (await api.uploadEnd('/tools/removebg', { type: "image", buffer: media, mimetype: "image/jpeg" })).data;

        await conn.sendMessage(m.chat, {
            image: {
                url: re
            },
            caption: ` 📷 Remove Background Gambar\n\n 🔗Url: ${re || ""}`
        }, {
            quoted: m
        })
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

handler.help = handler.command = ["removebg", "rbg", "removebackground"];
handler.tags = ["tools"];
handler.limit = true;

export default handler;