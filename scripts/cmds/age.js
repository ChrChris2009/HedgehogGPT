const { GoatWrapper } = require("fca-liane-utils");
const request = require("request");

module.exports.config = {
	name: "en",
	version: "1.0.1",
	role: 0,
	author: "chris st",
	description: "Traduction de texte (version FR stylisée)",
	category: "media",
	usages: "[langue] [texte]",
	countDowns: 5,
	dependencies: {
		"request": ""
	}
};

module.exports.onStart = async ({ api, event, args }) => {
	var content = args.join(" ");

	if (content.length === 0 && event.type !== "message_reply") {
		return global.utils.throwError(this.config.name, event.threadID, event.messageID);
	}

	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);

	if (event.type === "message_reply") {
		translateThis = event.messageReply.body;
		if (content.indexOf("-> ") !== -1)
			lang = content.substring(content.indexOf("-> ") + 3);
		else
			lang = global.GoatBot.config.language;
	} else if (content.indexOf(" -> ") === -1) {
		translateThis = content;
		lang = global.GoatBot.config.language;
	}

	// 📅 Date & heure
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const year = now.getFullYear();
	const currentTime = `${hours}:${minutes}`;
	const currentDate = `${day}/${month}/${year}`;

	request(
		encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`),
		(err, response, body) => {
			if (err) {
				return api.sendMessage("❌ Une erreur est survenue lors de la traduction.", event.threadID, event.messageID);
			}

			const retrieve = JSON.parse(body);
			let text = "";

			retrieve[0].forEach(item => {
				if (item[0]) text += item[0];
			});

			const fromLang = retrieve[2];

			// 🔔 STYLE NOTIFICATION FINAL
			const message = `
🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
 MINATO NAMIKAZE
━━━━━━━━━━━━━━━━━━━
👤 𝗔𝗗𝗠𝗜𝗡 / 𝗢𝗪𝗡𝗘𝗥 :
• Chris st
━━━━━━━━━━━━━━━━━━━
╭┈ 📬 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 :
╰┈➤ ${text}

🌍 𝗧𝗥𝗔𝗗𝗨𝗖𝗧𝗜𝗢𝗡 :
• De : ${fromLang.toUpperCase()}
• Vers : ${lang.toUpperCase()}

👥 𝗦𝗧𝗔𝗧𝗨𝗦 :
• Traduction réussie ✔️

🕒 𝗛𝗘𝗨𝗥𝗘 : ${currentTime}
📆 𝗗𝗔𝗧𝗘 : ${currentDate}

━━━━━━━━━━━━━━━━━━━
ℹ️ Bot : 𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧
`.trim();

			api.sendMessage(message, event.threadID, event.messageID);
		}
	);
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });