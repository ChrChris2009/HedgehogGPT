module.exports = {
  config: {
    name: "lord",
    aliases: ["lrd"],
    version: "1.2",
    author: "chris st & Minato",
    countDown: 10,
    role: 0,
    shortDescription: "Défie le destin avec l'Éclair Jaune",
    longDescription: "Un test de rapidité et de chance face aux techniques du Quatrième Hokage. Ta détermination fera-t-elle la différence ?",
    category: "game",
    guide: "{pn} <kunai/rasengan> <montant>"
  },

  onStart: async function ({ args, message, usersData, event }) {
    const betType = args[0]?.toLowerCase();
    const betAmount = parseInt(args[1]);
    const userData = await usersData.get(event.senderID);

    // Validation du type de pari sous le thème de Minato
    if (!["kunai", "rasengan"].includes(betType)) {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚡ | 𝗖𝗛𝗢𝗜𝗫 𝗗𝗨 𝗧𝗘𝗖𝗛𝗡𝗜𝗖𝗜𝗘𝗡
╰┈➤ Choisis ta technique pour ce défi : 

🗡️ '𝗸𝘂𝗻𝗮𝗶' (pour les chiffres de 1 à 3)
🌀 '𝗿𝗮𝘀𝗲𝗻𝗴𝗮𝗻' (pour les chiffres de 4 à 6)

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
      );
    }

    // Validation du montant minimum
    if (!Number.isInteger(betAmount) || betAmount < 50) {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🍃 | 𝗠𝗜𝗦𝗘 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗦𝗔𝗡𝗧𝗘
╰┈➤ Un entraînement sérieux demande de l'engagement. Il te faut au moins 50$ pour participer.

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
      );
    }

    // Vérification des fonds du joueur
    if (betAmount > userData.money) {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 💰 | 𝗥𝗘𝗦𝗦𝗢𝗨𝗥𝗖𝗘𝗦 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗦𝗔𝗡𝗧𝗘𝗦
╰┈➤ Tes réserves de chakra financier sont trop basses pour assumer cette mise.

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
      );
    }

    // Lancement des 3 dés du destin
    const dice = [1, 2, 3, 4, 5, 6];
    const results = [];
    for (let i = 0; i < 3; i++) {
      results.push(dice[Math.floor(Math.random() * dice.length)]);
    }

    // Calcul des dés selon le choix (Kunai = 1-3, Rasengan = 4-6)
    const kunaiCount = results.filter(num => num >= 1 && num <= 3).length;
    const rasenganCount = results.filter(num => num >= 4 && num <= 6).length;
    
    // Détermination de la tendance gagnante (Majorité)
    const dominantSide = kunaiCount > rasenganCount ? "kunai" : "rasengan";
    const resultString = results.join(" ‖ ");

    // Alignement avec le taux de réussite d'origine (40%)
    const isCoreWin = betType === dominantSide;
    const finalWin = (isCoreWin && Math.random() <= 0.4) || (!isCoreWin && Math.random() > 0.4);

    if (finalWin) {
      const winAmount = 2 * betAmount;
      userData.money += winAmount;
      await usersData.set(event.senderID, userData);
      
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚡ | 𝗩𝗜𝗖𝗧𝗢𝗜𝗥𝗘 𝗘𝗖𝗟𝗔𝗜𝗥
╰┈➤ 🔥 [ ${resultString} ] 🔥

Impressionnant ! Tu as su anticiper mes mouvements avec brio.
Tu remportes 💸 ${winAmount}$ ! 

━━━━━━━━━━━━━━━━━━━
⚡ Que cette fortune renforce tes capacités.
⚡ Minato Namikaze`
      );
    } else {
      userData.money -= betAmount;
      await usersData.set(event.senderID, userData);
      
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 💨 | 𝗧𝗘𝗟𝗘𝗣𝗢𝗥𝗧𝗔𝗧𝗜𝗢𝗡 𝗥𝗘𝗨𝗦𝗦𝗜𝗘
╰┈➤ 🍃 [ ${resultString} ] 🍃

Tu as été un peu trop lent face à mon Hiraishin... L'opportunité s'est envolée.
Tu perds 📉 ${betAmount}$ sur cette action.

━━━━━━━━━━━━━━━━━━━
⚡ L'échec est le fondement de toute grande maîtrise. Persévère.
⚡ Minato Namikaze`
      );
    }
  }
};
