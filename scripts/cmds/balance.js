module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.2",
		author: "chris st",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "Consulter la réserve de Ryos (argent) de votre compte ou d'un ninja mentionné."
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn} : Voir votre solde actuel"
				+ "\n   {pn} <@tag> : Voir les finances du ninja ciblé"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		en: {
			money: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 💰 | 𝗩𝗢𝗧𝗥𝗘 𝗧𝗥𝗘́𝗦𝗢𝗥𝗘𝗥𝗜𝗘
╰┈➤ Après vérification dans les registres financiers du Bureau des Missions, votre solde est le suivant :

💴 Compte : %1 Ryos

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Solde certifié par 𝗠𝗜𝗡𝗔𝗧𝗢.`,

			moneyOf: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📊 | 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗘 𝗗𝗘𝗦 𝗔𝗟𝗟𝗜𝗔𝗡𝗖𝗘́𝗦
╰┈➤ Voici l'état des finances actuel pour le ninja demandé :

👤 Ninja : %1
💴 Solde : %2 Ryos

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Rapport financier de <b>𝗠𝗜𝗡𝗔𝗧𝗢</b>.`
		}
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney.toLocaleString()) + '\n';
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", userData.money.toLocaleString()));
	}
};
