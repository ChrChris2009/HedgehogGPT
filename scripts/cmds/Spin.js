module.exports = {
 config: {
  name: "spin",
  version: "4.0",
  author: "chris st",
  countDown: 5,
  role: 0,
  description: "Tourne la roue et gagne ou perds de l'argent",
  category: "jeu",
  guide: {
   fr: "{p}spin <montant>\n{p}spin top"
  }
 },

 onStart: async function ({ message, event, args, usersData }) {
  const senderID = event.senderID;
  const subCommand = args[0];

  // 🏆 Classement
  if (subCommand === "top") {
   const allUsers = await usersData.getAll();

   const top = allUsers
    .filter(u => typeof u.data?.totalSpinWin === "number" && u.data.totalSpinWin > 0)
    .sort((a, b) => b.data.totalSpinWin - a.data.totalSpinWin)
    .slice(0, 10);

   if (top.length === 0) {
    return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
Classement vide

╭┈ ❒ 🏆 | 𝗖𝗟𝗔𝗦𝗦𝗘𝗠𝗘𝗡𝗧
╰┈➤ Je n'ai encore trouvé aucun ninja assez chanceux pour entrer dans le classement.

⚡ Continue de tourner la roue et montre-moi ce dont tu es capable.

━━━━━━━━━━━━━━━━━━━
⚡ Je suis Minato Namikaze`
    );
   }

   const result = top.map((user, i) => {
    const name = user.name || `Utilisateur ${user.userID?.slice(-4) || "??"}`;
    return `${i + 1}. ${name} • 💸 ${user.data.totalSpinWin}$`;
   }).join("\n");

   return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
Top gagnants

🏆 𝗧𝗢𝗣 𝟭𝟬 𝗗𝗘𝗦 𝗚𝗔𝗚𝗡𝗔𝗡𝗧𝗦

${result}

━━━━━━━━━━━━━━━━━━━
⚡ Impressionnant... Ces ninjas ont réussi à accumuler une véritable fortune.

⚡ Penses-tu pouvoir les dépasser ?

━━━━━━━━━━━━━━━━━━━
⚡ Je suis Minato Namikaze`
   );
  }

  const betAmount = parseInt(subCommand, 10);

  if (!subCommand || isNaN(betAmount) || betAmount <= 0) {
   return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
Mauvaise utilisation

╭┈ ❒ ❌ | 𝗘𝗥𝗥𝗘𝗨𝗥
╰┈➤ Tu t'es trompé dans l'utilisation de la commande.

🎰 /spin <montant>
🏆 /spin top

⚡ Concentre-toi et réessaie.

━━━━━━━━━━━━━━━━━━━
⚡ Je suis Minato Namikaze`
   );
  }

  const userData = await usersData.get(senderID) || {};
  userData.money = userData.money || 0;
  userData.data = userData.data || {};
  userData.data.totalSpinWin = userData.data.totalSpinWin || 0;

  if (userData.money < betAmount) {
   return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
Pas assez d'argent

╭┈ ❒ 💰 | 𝗦𝗢𝗟𝗗𝗘
╰┈➤ Tu veux tenter ta chance, mais ton portefeuille n'est pas prêt pour ça.

💵 Ton solde actuel : ${userData.money}$

⚡ Reviens quand tu auras suffisamment d'argent.

━━━━━━━━━━━━━━━━━━━
⚡ Je suis Minato Namikaze`
   );
  }

  userData.money -= betAmount;

  const outcomes = [
   {
    text: "💥 La chance t'a abandonné cette fois... Tu perds tout.",
    multiplier: 0
   },
   {
    text: "😕 Tu sauves une partie de ta mise, mais ce n'est pas une victoire.",
    multiplier: 0.5
   },
   {
    text: "⚖️ Équilibre parfait. Tu récupères exactement ce que tu as misé.",
    multiplier: 1
   },
   {
    text: "✨ Belle performance ! Tu doubles ta mise.",
    multiplier: 2
   },
   {
    text: "🔥 Impressionnant ! Ta mise est triplée.",
    multiplier: 3
   },
   {
    text: "💎 JACKPOT LÉGENDAIRE ! La roue t'accorde une récompense x10 !",
    multiplier: 10
   }
  ];

  const result = outcomes[Math.floor(Math.random() * outcomes.length)];
  const reward = Math.floor(betAmount * result.multiplier);

  userData.money += reward;

  if (reward > betAmount) {
   const profit = reward - betAmount;
   userData.data.totalSpinWin += profit;
  }

  await usersData.set(senderID, userData);

  return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
Résultats de la roue

╭┈ ❒ 🎰 | 𝗥𝗢𝗨𝗘 𝗗𝗨 𝗗𝗘𝗦𝗧𝗜𝗡
╰┈➤ ${result.text}

💸 Mise : ${betAmount}$
🎁 Récompense : ${reward}$
💰 Solde actuel : ${userData.money}$

━━━━━━━━━━━━━━━━━━━
⚡ Je suis Minato Namikaze.

⚡ La chance favorise ceux qui osent prendre des risques. Continue d'avancer et tente à nouveau ta destinée.

⚡ Minato Namikaze`
  );
 }
};
   
