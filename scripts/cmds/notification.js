const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "chris st & Minato",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <tin nhắn>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
			errorSendingNotification: "Có lỗi xảy ra khi gửi đến %1 nhóm:\n%2"
		},
		en: {
			missingMessage: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⚠️ | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗠𝗔𝗡𝗤𝗨𝗔𝗡𝗧\n╰┈➤ Quel est le message urgent que je dois transmettre à tous les groupes ?\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			
			notification: `🔔 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗢𝗙𝗙𝗜𝗖𝗜𝗘𝗟 𝗗𝗨 𝟰𝗲 𝗛𝗢𝗞𝗔𝗚𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 📢 | 𝗔𝗩𝗜𝗦 𝗚𝗟𝗢𝗕𝗔𝗟\n╰┈➤ Transmis par l'Éclair Jaune de Konoha :\n\n⚠️ (Merci de ne pas répondre directement à cette annonce)`,
			
			sendingNotification: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⚡ | 𝗗𝗘𝗣𝗟𝗢𝗜𝗘𝗠𝗘𝗡𝗧\n╰┈➤ Initialisation du Hiraishin. Diffusion du message officiel vers %1 groupes en cours...\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			
			sentNotification: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ✅ | 𝗠𝗜𝗦𝗦𝗜𝗢𝗡 𝗥𝗘𝗨𝗦𝗦𝗜𝗘\n╰┈➤ Le message a été déposé avec succès dans %1 zones stratégiques.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			
			errorSendingNotification: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ❌ | 𝗘𝗖𝗛𝗘𝗖 𝗗𝗘 𝗧𝗥𝗔𝗡𝗦𝗠𝗜𝗦𝗦𝗜𝗢𝗡\n╰┈➤ Mes kunais n'ont pas pu atteindre %1 groupes de discussion.\n\nDétails des perturbations : %2\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(getLang("missingMessage"));
		
		const formSend = {
			body: `${getLang("notification")}\n\n💬 Message :\n${args.join(" ")}\n\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
			)
		};

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const { errorDescription } = e;
				if (!sendError.some(item => item.errorDescription == errorDescription))
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
				else
					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
			}
		}

		let msg = "";
		if (sendSucces > 0)
			msg += getLang("sentNotification", sendSucces) + "\n";
		if (sendError.length > 0)
			msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));
		message.reply(msg);
	}
};
