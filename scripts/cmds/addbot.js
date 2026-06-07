const { threadsData: globalThreadsData } = global.db;

module.exports = {
  config: {
    name: "addbot",
    version: "1.0",
    author: "chris st",
    role: 1,
    shortDescription: "ajouter automatiquement un utilisateur spécifique à tous les groupes (conversations) où le bot est actuellement présent.",
    longDescription: "ajouter automatiquement un utilisateur spécifique à tous les groupes (conversations) où le bot est actuellement présent..",
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: {
      en: "{pn} <uid>"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    // Gestion dynamique de la date et de l'heure pour les styles
    const optionsDate = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateNow = new Date().toLocaleDateString('fr-FR', optionsDate);
    const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: true });

    const permission = ["61568806302361"]; // Remplacez par l'ID utilisateur de l'administrateur
    
    // 1. Réponse si l'utilisateur n'a pas la permission
    if (!permission.includes(event.senderID)) {
      return message.reply(
`.‎🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗶𝗻𝗮𝘁𝗼 𝗡𝗮𝗺𝗶𝗸𝗮𝘇𝗲⚡
━━━━━━━━━━━━━━━━━━━
👤𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${event.senderID}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ❌ Tu es trop faible pour utiliser cette commande.

⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Ceci est une annonce de l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`
      );
    }

    const uidToAdd = args[0];
    
    // 2. Réponse si l'UID est manquant ou invalide
    if (!uidToAdd || isNaN(uidToAdd)) {
      return message.reply(
`.‎🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗶𝗻𝗮𝘁𝗼 𝗡𝗮𝗺𝗶𝗸𝗮𝘇𝗲⚡
━━━━━━━━━━━━━━━━━━━
👤𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${event.senderID}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ❌ Veuillez fournir un ID utilisateur (UID) valide.

⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Ceci est une annonce de l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`
      );
    }

    try {
      const allThreads = await globalThreadsData.getAll();
      const addedToGroups = [];
      const failedToAdd = [];

      for (const thread of allThreads) {
        try {
          await api.addUserToGroup(uidToAdd, thread.threadID);
          addedToGroups.push(thread.threadID);
        } catch (error) {
          failedToAdd.push({ threadID: thread.threadID, error: error.message });
        }
      }

      // 3. Réponse principale de succès et d'échecs partiels
      let replyMessage = 
`.‎🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗶𝗻𝗮𝘁𝗼 𝗡𝗮𝗺𝗶𝗸𝗮𝘇𝗲⚡
━━━━━━━━━━━━━━━━━━━
👤𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${event.senderID}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ✅ L'utilisateur avec l'UID ${uidToAdd} a été ajouté avec succès à ${addedToGroups.length} groupe(s).`;

      if (failedToAdd.length > 0) {
        replyMessage += `\n\n❌ Échec de l'ajout dans ${failedToAdd.length} groupe(s) :`;
        failedToAdd.forEach(f => {
          replyMessage += `\n• ${f.threadID} : ${f.error}`;
        });
      }

      replyMessage += `\n\n⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Ceci est une annonce de l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`;

      message.reply(replyMessage);

    } catch (error) {
      console.error("Error in addbot command:", error);
      
      // 4. Réponse en cas d'erreur critique du système
      message.reply(
`.‎🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗶𝗻𝗮𝘁𝗼 𝗡𝗮𝗺𝗶𝗸𝗮𝘇𝗲⚡
━━━━━━━━━━━━━━━━━━━
👤𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${event.senderID}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ❌ Une erreur est survenue lors du traitement de la commande.

⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Ceci est une annonce de l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`
      );
    }
  }
};
