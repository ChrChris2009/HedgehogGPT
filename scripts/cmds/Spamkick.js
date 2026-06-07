module.exports.config = {
 name: "spamkick",
 version: "1.0.0",
 role: 0, 
 author: "chris st",
 usePrefix: true,
 description: { 
  en: "Automatically kick a user who spams messages in a group chat"
 },
 category: "group",
 guide: { en:"[on/off] or [settings]"},
 countDown: 5
};

module.exports.onChat = async ({ api, event, usersData, commandName }) => {
 const { senderID, threadID } = event;
 if (!global.antispam) global.antispam = new Map();

 const threadInfo = global.antispam.has(threadID) ? global.antispam.get(threadID) : { users: {} };
 if (!(senderID in threadInfo.users)) {
  threadInfo.users[senderID] = { count: 1, time: Date.now() };
 } else {
  threadInfo.users[senderID].count++;
  const timePassed = Date.now() - threadInfo.users[senderID].time;
  const messages = threadInfo.users[senderID].count;
  const timeLimit = 80000;
  const messageLimit = 14;

  if (messages > messageLimit && timePassed < timeLimit) {
   if(global.GoatBot.config.adminBot.includes(senderID)) return;
   api.removeUserFromGroup(senderID, threadID, async (err) => {
    if (err) {
     console.error(err);
    } else {
     const userName = await usersData.getName(senderID);
     api.sendMessage({
      body: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🛑 | 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗘\n╰┈➤ L'utilisateur ${userName} a été retiré pour cause de spam.\n\n🆔 ID : ${senderID}\n⚡ Réagis à ce message pour le réinviter.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`
     }, threadID, (error, info) => {
      global.GoatBot.onReaction.set(info.messageID, { 
       commandName, 
       uid: senderID,
       messageID: info.messageID
      });
     });
    }
   });

   threadInfo.users[senderID] = { count: 1, time: Date.now() };
  } else if (timePassed > timeLimit) {
   threadInfo.users[senderID] = { count: 1, time: Date.now() };
  }
 }

 global.antispam.set(threadID, threadInfo);
};

module.exports.onReaction = async ({ api, event, Reaction, threadsData, usersData , role }) => {
 const { uid, messageID } = Reaction;
 const { adminIDs, approvalMode } = await threadsData.get(event.threadID);
 const botID = api.getCurrentUserID();
 if (role < 1) return;
 var msg = "";

 try {
  await api.addUserToGroup(uid, event.threadID);
  const userName = await usersData.getName(uid);
  if (approvalMode === true && !adminIDs.includes(botID)){
   msg = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ✅ | 𝗔𝗣𝗣𝗥𝗢𝗕𝗔𝗧𝗜𝗢𝗡\n╰┈➤ ${userName} a été ajouté à la liste d'attente.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`;
   await api.unsendMessage(messageID);
  }
  else{
   msg = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🟢 | 𝗥𝗘𝗧𝗢𝗨𝗥\n╰┈➤ ${userName} a été réintégré dans le groupe.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`;
   await api.unsendMessage(messageID);
  }
 }
 catch (err) {
  const userName = await usersData.getName(uid);
  msg = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ❌ | 𝗘𝗥𝗥𝗘𝗨𝗥\n╰┈➤ Impossible de réajouter ${userName}.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`;
 }
 api.sendMessage(msg, event.threadID);
};

module.exports.onStart = async ({ api, event, args }) => {
 switch (args[0]) {
  case "on":
   if (!global.antispam) global.antispam = new Map();
   global.antispam.set(event.threadID, { users: {} });
   api.sendMessage(`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🛡️ | 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗜𝗢𝗡\n╰┈➤ Le système anti-spam de l'Éclair Jaune est désormais actif ici.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`, event.threadID, event.messageID);
   break;
  case "off":
   if (global.antispam && global.antispam.has(event.threadID)) {
    global.antispam.delete(event.threadID);
    api.sendMessage(`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⚠️ | 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗜𝗢𝗡\n╰┈➤ La barrière anti-spam a été désactivée.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`, event.threadID, event.messageID);
   } else {
    api.sendMessage(`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ℹ️ | 𝗦𝗧𝗔𝗧𝗨𝗧\n╰┈➤ La protection n'est pas active dans cette zone.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`, event.threadID, event.messageID);
   }
   break;
  default:
   api.sendMessage(`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⚙️ | 𝗚𝗨𝗜𝗗𝗘\n╰┈➤ Utilisation des commandes de garde :\n\n⚡/spamkick on : Activer la barrière\n⚡/spamkick off : Désactiver la barrière\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`, event.threadID, event.messageID);
 }
};
