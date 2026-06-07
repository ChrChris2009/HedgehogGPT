module.exports = {
  config: {
    name: "bio",
    version: "1.3",
    author: "chris st",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: " ",
      en: "change bot bio ",
    },
    longDescription: {
      vi: " ",
      en: "change bot bio ",
    },
    category: "owner",
    guide: {
      en: "{pn} <Text>",
    },
  },
  onStart: async function ({ args, message, api, event }) {
    const GODPermission = global.GoatBot.config.GOD || [];
    const adminBotPermission = global.GoatBot.config.adminBot || [];

    // Vérifie si l'utilisateur est un admin du bot ou un créateur (GOD)
    const isAdmin = adminBotPermission.includes(event.senderID);
    const isGod = GODPermission.includes(event.senderID);

    if (!isAdmin && !isGod) {
      return api.sendMessage("Seuls les administrateurs du bot peuvent utiliser cette commande.", event.threadID, event.messageID);
    }

    const newBio = args.join(" ");
    api.changeBio(newBio);
    message.reply("change bot bio to: " + newBio);
  },
};
