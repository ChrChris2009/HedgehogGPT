module.exports = {
  config: {
    name: "call",
    aliases: ["report", "calling"],
    version: "9.9",
    author: "chris st",
    countDown: 1,
    role: 0,
    description: "Ajoute mon créateur/propriétaire dans ce groupe.",
    category: "contact admin",
    usages: "user",
  },

  onStart: async function ({ api, message, event, usersData, threadsData }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();
    const targetUserID = "61568806302361";
    const targetUserName = "chris st";

    // 1. Récupération des données du propriétaire officiel du bot
    const ownerID = global.GoatBot.config.GOD[0] || botID;
    let ownerName = "L'Éclair Jaune de Konoha";
    try {
      const ownerInfo = await usersData.getName(ownerID);
      if (ownerInfo) ownerName = ownerInfo;
    } catch (e) {
      console.error("Impossible de récupérer le nom du propriétaire :", e);
    }

    // Préparation des statistiques et du temps pour la notification
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const optionsDate = { weekday: 'long', month: 'long', day: 'numeric' };
    const now = new Date();
    
    const timeNow = now.toLocaleTimeString('en-US', optionsTime);
    const dateNow = now.toLocaleDateString('fr-FR', optionsDate);

    const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == botID)?.inGroup);
    let totalMembers = 0;
    let totalMale = 0;
    let totalFemale = 0;

    allThreadID.forEach(t => {
      if (t.members) {
        totalMembers += t.members.length;
        totalMale += t.members.filter(m => m.gender === "MALE").length;
        totalFemale += t.members.filter(m => m.gender === "FEMALE").length;
      }
    });

    if (totalMale === 0 && totalFemale === 0 && totalMembers > 0) {
      totalMale = Math.floor(totalMembers * 0.75);
      totalFemale = totalMembers - totalMale;
    }

    const displayTotalMembers = totalMembers || 100;
    const displayTotalMale = totalMale || 75;
    const displayTotalFemale = totalFemale || 25;
    const displayDate = dateNow.charAt(0).toUpperCase() + dateNow.slice(1);

    // Fonction pour générer le message stylisé Minato
    const generateMessage = (messageContent, mentions = []) => {
      return {
        body: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗜𝗡𝗔𝗧𝗢-𝗕𝗢𝗧⚡
━━━━━━━━━━━━━━━━━━━
👤 𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${ownerName}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ${messageContent}

👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${displayTotalMembers}
🚹 𝗠𝗔𝗟𝗘: ${displayTotalMale} | 🚺 𝗙𝗘𝗠𝗔𝗟Ｅ: ${displayTotalFemale}
⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${displayDate}
━━━━━━━━━━━━━━━━━━━
ℹ️ | C'est une annonce officielle du 𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`,
        mentions
      };
    };

    try {
      // Récupération des informations du groupe actuel
      const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
      const participants = participantIDs.map(id => parseInt(id));
      const admins = adminIDs.map(admin => parseInt(admin.id));

      // Cas 1 : Le Boss est déjà présent
      if (participants.includes(parseInt(targetUserID))) {
        const text = `Pas d'inquiétude, mon Boss est déjà sur le champ de bataille ici ! ✅ Tu peux l'interpeller directement en mentionnant @${targetUserName}.`;
        const msg = generateMessage(text, [{ id: targetUserID, tag: targetUserName }]);
        return api.sendMessage(msg, threadID, messageID);
      }

      // Tentative d'invocation (ajout) du Boss
      await api.addUserToGroup(parseInt(targetUserID), threadID);

      // Cas 2 : Le groupe nécessite une approbation et le bot n'est pas admin
      if (approvalMode && !admins.includes(botID)) {
        const text = `Le Hiraishin a fonctionné ! J'ai déposé la demande d'invocation. Mon Boss a été inscrit avec succès dans la liste d'approbation du groupe ✅.`;
        const msg = generateMessage(text, [{ id: targetUserID, tag: targetUserName }]);
        return api.sendMessage(msg, threadID, messageID);
      } 
      // Cas 3 : Ajout direct réussi
      else {
        const text = `Technique d'invocation réussie ! À la vitesse de l'éclair, j'ai amené mon Boss @${targetUserName} directement dans votre salon ✅.`;
        const msg = generateMessage(text, [{ id: targetUserID, tag: targetUserName }]);
        return api.sendMessage(msg, threadID, messageID);
      }
    } catch (error) {
      console.error("Error adding user to group:", error);
      const errorText = `Désolé, ma technique spatio-temporelle a échoué... Impossible de faire venir le Boss dans cette zone pour le moment ❎.`;
      return api.sendMessage(generateMessage(errorText), threadID, messageID);
    }
  }
};
