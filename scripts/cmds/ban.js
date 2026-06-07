const { findUid } = global.utils;
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "ban",
		version: "1.4",
		author: "NTKhang & Minato",
		countDown: 5,
		role: 1,
		description: {
			vi: "Cấm thành viên khỏi box chat",
			en: "Ban user from box chat"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} [@tag|uid|link fb|reply] [<lý do cấm>|để trống nếu không có lý do]: Cấm thành viên khỏi box chat"
				+ "\n   {pn} check: Kiểm tra thành viên bị cấm và kick thành viên đó ra khỏi box chat"
				+ "\n   {pn} unban [@tag|uid|link fb|reply]: Bỏ cấm thành viên khỏi box chat"
				+ "\n   {pn} list: Xem danh sách thành viên bị cấm",
			en: "   {pn} [@tag|uid|fb link|reply] [<reason>]: Exclure un membre"
				+ "\n   {pn} check: Expulser les bannis présents"
				+ "\n   {pn} unban [@tag|uid|fb link|reply]: Réintégrer un membre"
				+ "\n   {pn} list: Voir la liste des exclus"
		}
	},

	langs: {
		vi: {
			notFoundTarget: "⚠️ | Vui lòng tag người cần cấm hoặc nhập uid hoặc link fb hoặc phản hồi tin nhắn của người cần cấm",
			notFoundTargetUnban: "⚠️ | Vui lòng tag người cần bỏ cấm hoặc nhập uid hoặc link fb hoặc phản hồi tin nhắn của người cần bỏ cấm",
			userNotBanned: "⚠️ | Người mang id %1 không bị cấm khỏi box chat này",
			unbannedSuccess: "✅ | Đã bỏ cấm %1 khỏi box chat!",
			cantSelfBan: "⚠️ | Bạn không thể tự cấm chính mình!",
			cantBanAdmin: "❌ | Bạn không thể cấm quản trị viên!",
			existedBan: "❌ | Người này đã bị cấm từ trước!",
			noReason: "Không có lý do",
			bannedSuccess: "✅ | Đã cấm %1 khỏi box chat!",
			needAdmin: "⚠️ | Bot cần quyền quản trị viên để kick thành viên bị cấm",
			noName: "Người dùng facebook",
			noData: "📑 | Không có thành viên nào bị cấm trong box chat này",
			listBanned: "📑 | Danh sách thành viên bị cấm trong box chat này (trang %1/%2)",
			content: "%1/ %2 (%3)\nLý do: %4\nThời gian cấm: %5\n\n",
			needAdminToKick: "⚠️ | Thành viên %1 (%2) bị cấm khỏi box chat, nhưng bot không có quyền quản trị viên để kick thành viên này, vui lòng cấp quyền quản trị viên cho bot để kick thành viên này",
			bannedKick: "⚠️ | %1 đã bị cấm khỏi box chat từ trước!\nUID: %2\nLý do: %3\nThời gian cấm: %4\n\nBot đã tự động kick thành viên này"
		},
		en: {
			notFoundTarget: `LNVR\n⚠️ | Cible introuvable. Mentionne le perturbateur, entre son UID/lien ou réponds à son message.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			notFoundTargetUnban: `LNVR\n⚠️ | Qui souhaites-tu gracier ? Mentionne-le, entre son UID/lien ou réponds à son message.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			userNotBanned: `LNVR\n⚠️ | L'identité %1 ne figure pas sur notre liste d'exil de ce territoire.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			unbannedSuccess: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ✅ | 𝗚𝗥𝗔𝗖𝗘 𝗔𝗖𝗖𝗢𝗥𝗗𝗘𝗘\n╰┈➤ %1 est de nouveau autorisé à fouler les terres de ce groupe.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			cantSelfBan: `LNVR\n⚠️ | Un ninja ne s'impose pas l'exil à lui-même. Tu ne peux pas te bannir.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			cantBanAdmin: `LNVR\n❌ | Impossible. Cet individu fait partie du conseil supérieur (Admin). Je ne peux pas le bannir.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			existedBan: `LNVR\n❌ | Cet individu a déjà été banni et scellé hors de ce groupe auparavant.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			noReason: "Aucun motif spécifié",
			bannedSuccess: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🛑 | 𝗦𝗘𝗡𝗧𝗘𝗡𝗖𝗘 𝗗'𝗘𝗫𝗜𝗟\n╰┈➤ %1 a été banni du groupe. Justice est faite.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			needAdmin: `LNVR\n⚠️ | J'ai besoin des privilèges d'administrateur du groupe pour appliquer la technique de répulsion sur le banni.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			noName: "Ninja Anonyme",
			noData: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 📑 | 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗘 𝗩𝗜𝗗𝗘\n╰┈➤ Aucun membre n'est actuellement banni de ce territoire.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			listBanned: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n📑 | 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗘 𝗗𝗘𝗦 𝗘𝗫𝗖𝗟𝗨𝗦 (Page %1/%2)\n📢 Voici la liste des ninjas frappés d'exil :`,
			content: "🏅 N°%1 | %2 (%3)\n✍️ Motif : %4\n📅 Date du sceau : %5\n\n",
			needAdminToKick: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⚠️ | 𝗕𝗔𝗥𝗥𝗜𝗘𝗥𝗘 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗦𝗔𝗡𝗧𝗘\n╰┈➤ Le banni %1 (%2) a tenté de s'infiltrer. Attribuez-moi le rôle d'administrateur pour que je puisse l'expulser immédiatement.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			bannedKick: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 🛑 | 𝗜𝗡𝗧𝗥𝗨𝗦𝗜𝗢𝗡 𝗕𝗟𝗢𝗤𝗨𝗘𝗘\n╰┈➤ Le fugitif %1 a tenté de revenir !\n\n🆔 UID : %2\n✍️ Motif initial : %3\n📅 Date d'exil : %4\n\n⚡ L'Éclair Jaune a appliqué le Hiraishin : Intrus expulsé automatiquement.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, usersData, api }) {
		const { members, adminIDs } = await threadsData.get(event.threadID);
		const { senderID } = event;
		let target;
		let reason;

		const dataBanned = await threadsData.get(event.threadID, 'data.banned_ban', []);

		if (args[0] == 'unban') {
			if (!isNaN(args[1]))
				target = args[1];
			else if (args[1]?.startsWith('https'))
				target = await findUid(args[1]);
			else if (Object.keys(event.mentions || {}).length)
				target = Object.keys(event.mentions)[0];
			else if (event.messageReply?.senderID)
				target = event.messageReply.senderID;
			else {
				let missingMsg = getLang('notFoundTargetUnban').replace('LNVR\n', '');
				return api.sendMessage(missingMsg, event.threadID, event.messageID);
			}

			const index = dataBanned.findIndex(item => item.id == target);
			if (index == -1) {
				let notBannedMsg = getLang('userNotBanned', target).replace('LNVR\n', '');
				return api.sendMessage(notBannedMsg, event.threadID, event.messageID);
			}

			dataBanned.splice(index, 1);
			await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
			const userName = members[target]?.name || await usersData.getName(target) || getLang('noName');

			return api.sendMessage(getLang('unbannedSuccess', userName), event.threadID, event.messageID);
		}
		else if (args[0] == "check") {
			if (!dataBanned.length)
				return;
			for (const user of dataBanned) {
				if (event.participantIDs.includes(user.id))
					api.removeUserFromGroup(user.id, event.threadID);
			}
		}

		if (event.messageReply?.senderID) {
			target = event.messageReply.senderID;
			reason = args.join(' ');
		}
		else if (Object.keys(event.mentions || {}).length) {
			target = Object.keys(event.mentions)[0];
			reason = args.join(' ').replace(event.mentions[target], '');
		}
		else if (!isNaN(args[0])) {
			target = args[0];
			reason = args.slice(1).join(' ');
		}
		else if (args[0]?.startsWith('https')) {
			target = await findUid(args[0]);
			reason = args.slice(1).join(' ');
		}
		else if (args[0] == 'list') {
			if (!dataBanned.length)
				return message.reply(getLang('noData'));
			const limit = 20;
			const page = parseInt(args[1] || 1) || 1;
			const start = (page - 1) * limit;
			const end = page * limit;
			const data = dataBanned.slice(start, end);
			let msg = '';
			let count = 0;
			for (const user of data) {
				count++;
				const name = members[user.id]?.name || await usersData.getName(user.id) || getLang('noName');
				const time = user.time;
				msg += getLang('content', start + count, name, user.id, user.reason, time);
			}
			return message.reply(getLang('listBanned', page, Math.ceil(dataBanned.length / limit)) + '\n\n' + msg + '━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze');
		}

		if (!target) {
			let notFoundMsg = getLang('notFoundTarget').replace('LNVR\n', '');
			return message.reply(notFoundMsg);
		}
		if (target == senderID) {
			let selfBanMsg = getLang('cantSelfBan').replace('LNVR\n', '');
			return message.reply(selfBanMsg);
		}
		if (adminIDs.includes(target)) {
			let adminBanMsg = getLang('cantBanAdmin').replace('LNVR\n', '');
			return message.reply(adminBanMsg);
		}

		const banned = dataBanned.find(item => item.id == target);
		if (banned) {
			let existedMsg = getLang('existedBan').replace('LNVR\n', '');
			return message.reply(existedMsg);
		}

		const name = members[target]?.name || (await usersData.getName(target)) || getLang('noName');
		const time = moment().tz(global.GoatBot.config.timeZone).format('HH:mm:ss DD/MM/YYYY');
		const data = {
			id: target,
			time,
			reason: reason || getLang('noReason')
		};

		dataBanned.push(data);
		await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
		message.reply(getLang('bannedSuccess', name), () => {
			if (members.some(item => item.userID == target)) {
				if (adminIDs.includes(api.getCurrentUserID())) {
					if (event.participantIDs.includes(target))
						api.removeUserFromGroup(target, event.threadID);
				}
				else {
					let needAdminMsg = getLang('needAdmin').replace('LNVR\n', '');
					message.send(needAdminMsg, (err, info) => {
						global.GoatBot.onEvent.push({
							messageID: info.messageID,
							onStart: ({ event }) => {
								if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
									const { TARGET_ID } = event.logMessageData;
									if (TARGET_ID == api.getCurrentUserID()) {
										api.removeUserFromGroup(target, event.threadID, () => global.GoatBot.onEvent = global.GoatBot.onEvent.filter(item => item.messageID != info.messageID));
									}
								}
							}
						});
					});
				}
			}
		});
	},

	onEvent: async function ({ event, api, threadsData, getLang, message }) {
		if (event.logMessageType == "log:subscribe") {
			const { threadID } = event;
			const dataBanned = await threadsData.get(threadID, 'data.banned_ban', []);
			const usersAdded = event.logMessageData.addedParticipants;

			for (const user of usersAdded) {
				const { userFbId, fullName } = user;
				const banned = dataBanned.find(item => item.id == userFbId);
				if (banned) {
					const reason = banned.reason || getLang('noReason');
					const time = banned.time;
					return api.removeUserFromGroup(userFbId, threadID, err => {
						if (err)
							return message.send(getLang('needAdminToKick', fullName, userFbId), (err, info) => {
								global.GoatBot.onEvent.push({
									messageID: info.messageID,
									onStart: ({ event }) => {
										if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
											const { TARGET_ID } = event.logMessageData;
											if (TARGET_ID == api.getCurrentUserID()) {
												api.removeUserFromGroup(userFbId, event.threadID, () => global.GoatBot.onEvent = global.GoatBot.onEvent.filter(item => item.messageID != info.messageID));
											}
										}
									}
								});
							});
						else
							message.send(getLang('bannedKick', fullName, userFbId, reason, time));
					});
				}
			}
		}
	}
};
					
