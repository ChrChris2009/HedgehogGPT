const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.6",
		author: "chris st",
		countDown: 5,
		role: 2,
		description: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "Gérer les privilèges des administrateurs (Hokage Style)"
		},
		category: "box chat",
		guide: {
			vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
				+ '\n	  {pn} [list | -l]: Liệt kê danh sách admin',
			en: '   {pn} [add | -a] <uid | @tag>: Ajouter un ninja aux admins'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Retirer un ninja des admins'
				+ '\n	  {pn} [list | -l]: Afficher le Conseil des Admins'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin từ trước rồi:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin",
			removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin",
			listAdmin: "👑 | Danh sách admin:\n%1"
		},
		en: {
			added: `⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘\n╰┈➤ Par décret du Hokage, %1 nouveau(x) membre(s) rejoigne(nt) les hautes fonctions du village :\n\n%2\n━━━━━━━━━━━━━━━━━━━\n✨ Le village est entre de bonnes mains.`,
			
			alreadyAdmin: `\n⚠️ 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡\n╰┈➤ %1 ninja(s) possèdent déjà ces privilèges administratifs :\n%2`,
			
			missingIdAdd: `⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘\n╰┈➤ S'il te plaît, mentionne le ninja ou indique son UID pour que je puisse lui accorder ce statut.\n━━━━━━━━━━━━━━━━━━━\n✨ Reste vigilant.`,
			
			removed: `⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘\n╰┈➤ J'ai retiré les privilèges de gestion à %1 ninja(s) sur ce rapport :\n\n%2\n━━━━━━━━━━━━━━━━━━━\n✨ Changement appliqué instantanément.`,
			
			notAdmin: `\n⚠️ 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡\n╰┈➤ %1 ninja(s) ne figuraient pas parmi les hauts gradés :\n%2`,
			
			missingIdRemove: `⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘\n╰┈➤ Précise l'UID ou taggue la personne à qui je dois retirer ces droits.\n━━━━━━━━━━━━━━━━━━━\n✨ Ordre du Quatrième Hokage.`,
			
			listAdmin: `⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 📜 | 𝗖𝗢𝗡𝗦𝗘𝗜𝗟 𝗗𝗘𝗦 𝗔𝗗𝗠𝗜𝗡𝗦\n╰┈➤ Voici la liste des ninjas de confiance qui veillent sur ce groupe :\n\n%1\n━━━━━━━━━━━━━━━━━━━\n✨ Protégeons ensemble notre volonté du feu.`
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};

