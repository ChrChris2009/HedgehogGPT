const fs = require("fs-extra");
const axios = require("axios");
const { createReadStream } = require("fs");
const { join } = require("path");

module.exports = {
  config: {
    name: "album",
    aliases: ["gallery"],
    version: "2.1",
    author: "Chris St + Minato Style",
    countDown: 5,
    role: 0,
    shortDescription: "Système d’album personnel",
    longDescription: "Stockage et gestion de médias avec style Minato Namikaze",
    category: "utility",
    guide: {
      en: `
📁 ALBUM COMMANDES :

➤ Ajouter :
{p}album add [titre] (répondre à un média)

➤ Voir catégories :
{p}album image
{p}album video
{p}album audio

➤ Afficher :
{p}album show [titre]

➤ Supprimer :
{p}album del [titre]

➤ Tout voir :
{p}album all
`
    },
  },

  onStart: async function ({ api, event, args }) {
    const senderID = event.senderID;
    const command = args[0];
    const title = args.slice(1).join(" ");

    try {
      const albumPath = `./albums/${senderID}`;
      const imagePath = `${albumPath}/images`;
      const videoPath = `${albumPath}/videos`;
      const audioPath = `${albumPath}/audios`;

      await fs.ensureDir(imagePath);
      await fs.ensureDir(videoPath);
      await fs.ensureDir(audioPath);

      // =========================
      // 📥 ADD
      // =========================
      if (
        command === "add" &&
        title &&
        event.messageReply &&
        event.messageReply.attachments &&
        event.messageReply.attachments.length > 0
      ) {
        const attachment = event.messageReply.attachments[0];
        const type = attachment.type.split("/")[0];
        const url = attachment.url;

        let filePath = "";

        if (type === "photo") {
          filePath = join(imagePath, `${title}.png`);
        } else if (type === "video") {
          filePath = join(videoPath, `${title}.mp4`);
        } else if (type === "audio") {
          filePath = join(audioPath, `${title}.mp3`);
        } else {
          return api.sendMessage(
            `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗘𝗥𝗧
━━━━━━━━━━━━━━━━━━━
❌ Type non reconnu dans le flux de données.`,
            event.threadID,
            event.messageID
          );
        }

        if (await fs.pathExists(filePath)) {
          return api.sendMessage(
            `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗗𝗨𝗣𝗟𝗜𝗖𝗔𝗧𝗘 𝗔𝗟𝗘𝗥𝗧
━━━━━━━━━━━━━━━━━━━
⚠️ Ce titre existe déjà dans le système.

📁 Titre : ${title}`,
            event.threadID,
            event.messageID
          );
        }

        const response = await axios.get(url, { responseType: "stream" });
        const fileStream = fs.createWriteStream(filePath);

        response.data.pipe(fileStream);

        return new Promise((resolve, reject) => {
          fileStream.on("finish", () => {
            api.sendMessage(
              `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗦𝗖𝗘𝗟𝗟𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠
━━━━━━━━━━━━━━━━━━━
⚡ Mission accomplie.

📁 Titre : ${title}
📦 Statut : Stocké avec succès

🌀 Minato a sécurisé ton fichier.`,
              event.threadID,
              event.messageID
            );
            resolve();
          });

          fileStream.on("error", reject);
        });
      }

      // =========================
      // 📂 LIST
      // =========================
      else if (["audio", "video", "image"].includes(command)) {
        const folder = join(albumPath, command + "s");
        const files = await fs.readdir(folder);

        if (files.length === 0) {
          return api.sendMessage(
            `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗦𝗖𝗔𝗡
━━━━━━━━━━━━━━━━━━━
📭 Aucun fichier détecté dans : ${command}`,
            event.threadID,
            event.messageID
          );
        }

        let message =
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗕𝗨𝗠 𝗦𝗖𝗔𝗡
━━━━━━━━━━━━━━━━━━━
⚡ Analyse du système...

📂 Type : ${command.toUpperCase()}
━━━━━━━━━━━━━━━━━━━`;

        files.forEach((file, i) => {
          message += `\n${i + 1}. ${file.replace(/\.[^/.]+$/, "")}`;
        });

        message += `\n\n━━━━━━━━━━━━━━━━━━━
🌀 Minato : sélection disponible`;

        api.sendMessage(message, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "album",
              senderID,
              messageType: command,
              files,
            });
          }
        });
      }

      // =========================
      // 👁️ SHOW
      // =========================
      else if (command === "show" || command === "view") {
        let found = false;

        for (let type of ["audio", "video", "image"]) {
          const filePath = join(
            albumPath,
            type + "s",
            `${title}.${type === "image" ? "png" : type === "video" ? "mp4" : "mp3"}`
          );

          if (await fs.pathExists(filePath)) {
            api.sendMessage(
              {
                body:
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥
━━━━━━━━━━━━━━━━━━━
⚡ Fichier localisé...

📁 Titre : ${title}
🌀 Transmission en cours`,
                attachment: createReadStream(filePath),
              },
              event.threadID,
              event.messageID
            );

            found = true;
            break;
          }
        }

        if (!found) {
          return api.sendMessage(
            `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗘𝗥𝗧
━━━━━━━━━━━━━━━━━━━
❌ Aucun fichier trouvé.

📁 Titre : ${title}`,
            event.threadID,
            event.messageID
          );
        }
      }

      // =========================
      // 🗑️ DELETE
      // =========================
      else if (command === "del") {
        let deleted = false;

        for (let type of ["audio", "video", "image"]) {
          const filePath = join(
            albumPath,
            type + "s",
            `${title}.${type === "image" ? "png" : type === "video" ? "mp4" : "mp3"}`
          );

          if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath);

            api.sendMessage(
              `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗨𝗗𝗜𝗧
━━━━━━━━━━━━━━━━━━━
⚡ Fichier supprimé avec succès.

📁 Titre : ${title}
🌀 Aucune trace restante.`,
              event.threadID,
              event.messageID
            );

            deleted = true;
            break;
          }
        }

        if (!deleted) {
          return api.sendMessage(
            `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗘𝗥𝗧
━━━━━━━━━━━━━━━━━━━
❌ Aucun fichier trouvé.

📁 Titre : ${title}`,
            event.threadID,
            event.messageID
          );
        }
      }

      // =========================
      // 📊 ALL
      // =========================
      else if (command === "all") {
        let message =
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗚𝗟𝗢𝗕𝗔𝗟 𝗦𝗖𝗔𝗡
━━━━━━━━━━━━━━━━━━━
⚡ Analyse complète du système...

`;

        for (let type of ["audio", "video", "image"]) {
          const files = await fs.readdir(join(albumPath, type + "s"));

          if (files.length > 0) {
            message += `📂 ${type.toUpperCase()} :\n`;

            files.forEach((file, i) => {
              message += `${i + 1}. ${file.replace(/\.[^/.]+$/, "")}\n`;
            });

            message += `\n`;
          }
        }

        if (message.trim() === "") {
          message += `📭 Aucun fichier enregistré dans le système.`;
        }

        message += `━━━━━━━━━━━━━━━━━━━
🌀 Minato : scan terminé`;

        api.sendMessage(message, event.threadID, event.messageID);
      }

      // =========================
      // ❌ INVALID
      // =========================
      else {
        api.sendMessage(
          `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗣𝗥𝗢𝗧𝗢𝗖𝗢𝗟
━━━━━━━━━━━━━━━━━━━
❌ Commande invalide.

⚡ Utilise : album add / show / del / all`,
          event.threadID,
          event.messageID
        );
      }
    } catch (err) {
      console.error(err);
      api.sendMessage(
        `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗖𝗥𝗜𝗧𝗜𝗖𝗔𝗟 𝗙𝗔𝗜𝗟𝗨𝗥𝗘
━━━━━━━━━━━━━━━━━━━
❌ Erreur système détectée.

🌀 Redémarrage recommandé.`,
        event.threadID
      );
    }
  },

  // =========================
  // 🔁 REPLY
  // =========================
  onReply: async function ({ api, event, Reply, args }) {
    const { commandName, senderID, messageType, files } = Reply;

    if (commandName !== "album" || senderID !== event.senderID) return;

    const index = parseInt(args[0]);

    if (isNaN(index) || index <= 0 || index > files.length) {
      return api.sendMessage(
        `🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗘𝗥𝗧
━━━━━━━━━━━━━━━━━━━
❌ Sélection invalide.`,
        event.threadID,
        event.messageID
      );
    }

    const file = files[index - 1];
    const filePath = join("./albums", senderID, messageType + "s", file);

    try {
      api.sendMessage(
        {
          body:
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗧𝗔𝗥𝗚𝗘𝗧
━━━━━━━━━━━━━━━━━━━
⚡ Fichier sélectionné

📁 ${file.replace(/\.[^/.]+$/, "")}`,
          attachment: createReadStream(filePath),
        },
        event.threadID
      );
    } catch (e) {
      api.sendMessage(
        `❌ Erreur de transmission.`,
        event.threadID
      );
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};