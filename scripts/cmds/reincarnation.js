const fs = require("fs-extra");

const botName = "Minato Namikaze";

module.exports = {
	config: {
		name: "reincarnation",
		version: "1.1",
		author: "chris st",
		countDown: 5,
		role: 2,

		description: {
			vi: "Khởi động lại bot",
			en: "Réincarné minato"
		},

		category: "Owner",

		guide: {
			vi: "   {pn}: Khởi động lại bot",
			en: "   restart : Redémarrer le bot"
		}
	},

	langs: {
		en: {

			restartting:
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚡ | 𝗠𝗜𝗡𝗔𝗧𝗢
╰┈➤ Je vais me réincarner afin de restaurer
toutes mes capacités.

⏳ Veuillez patienter quelques instants...

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`,

			restarted:
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ✅ | 𝗠𝗜𝗡𝗔𝗧𝗢
╰┈➤ Ma réincarnation est terminée.

🚀 Tous mes systèmes sont de nouveau opérationnels.

⏰ Temps de reconnexion : %1 seconde(s)

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
		}
	},

	onLoad: function ({ api }) {

		const pathFile =
`${__dirname}/tmp/restart.txt`;

		if (fs.existsSync(pathFile)) {

			const [tid, time] =
				fs.readFileSync(
					pathFile,
					"utf-8"
				).split(" ");

			const totalTime =
				((Date.now() - time) / 1000)
				.toFixed(2);

			api.sendMessage(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ✅ | 𝗠𝗜𝗡𝗔𝗧𝗢
╰┈➤ Je suis revenu parmi vous.

⚡ Toutes mes fonctions sont désormais actives.

⏰ Temps de reconnexion : ${totalTime}s

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`,
				tid
			);

			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({
		message,
		event,
		getLang
	}) {

		const pathFile =
`${__dirname}/tmp/restart.txt`;

		fs.writeFileSync(
			pathFile,
			`${event.threadID} ${Date.now()}`
		);

		await message.reply(
			getLang("restartting")
		);

		process.exit(2);
	}
};
