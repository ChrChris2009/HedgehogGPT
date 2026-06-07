const moment = require("moment-timezone");
const axios = require("axios");

const CASH_API_URL = "https://cash-api-five.vercel.app/api/cash";

async function getUserCash(userId) {
    try {
        const response = await axios.get(`${CASH_API_URL}/${userId}`);
        if (response.data.success) return response.data.data.cash;
    } catch (error) {
        console.error("Cash API Error:", error.message);
    }
    return 0;
}

async function updateUserCash(userId, amount) {
    try {
        await axios.post(`${CASH_API_URL}/${userId}/add`, { amount });
    } catch (error) {
        console.error("Cash API Update Error:", error.message);
    }
}

function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return "0";
    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

module.exports = {
    config: {
        name: "daily",
        version: "2.0",
        author: "NTKhang, updated by Itachi Soma & Minato",
        countDown: 5,
        role: 0,
        description: {
            vi: "Nhận quà hàng ngày",
            en: "Receive daily gift"
        },
        category: "economy",
        guide: {
            vi: "   {pn}: Nhận quà hàng ngày"
                + "\n   {pn} info: Xem thông tin quà hàng ngày",
            en: "   {pn}"
                + "\n   {pn} info: View daily gift information"
        },
        envConfig: {
            rewardFirstDay: {
                coin: 20000,
                exp: 100
            }
        }
    },

    langs: {
        vi: {
            monday: "Thứ 2",
            tuesday: "Thứ 3",
            wednesday: "Thứ 4",
            thursday: "Thứ 5",
            friday: "Thứ 6",
            saturday: "Thứ 7",
            sunday: "Chủ nhật",
            alreadyReceived: "Bạn đã nhận quà rồi",
            received: "Bạn đã nhận được %1 coin và %2 exp"
        },
        en: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday",
            alreadyReceived: "⚠️ Tu as déjà récupéré ton allocation aujourd'hui.",
            received: "Tu as reçu %1$ et %2 exp"
        }
    },

    onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang, api }) {
        const reward = envCommands[commandName].rewardFirstDay;
        
        if (args[0] == "info") {
            let msg = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ 📈 | 📋 𝗣𝗥𝗘𝗩𝗜𝗦𝗜𝗢𝗡𝗦 𝗗𝗘𝗦 𝗚𝗔𝗜𝗡𝗦\n`;
            for (let i = 1; i < 8; i++) {
                const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
                const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
                const day = i == 7 ? getLang("sunday") :
                    i == 6 ? getLang("saturday") :
                        i == 5 ? getLang("friday") :
                            i == 4 ? getLang("thursday") :
                                i == 3 ? getLang("wednesday") :
                                    i == 2 ? getLang("tuesday") :
                                        getLang("monday");
                msg += `╰┈➤ 🗓️ ${day} : +${formatNumber(getCoin)}$ | +${getExp} exp\n`;
            }
            msg += `━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`;
            return message.reply(msg);
        }

        const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        const date = new Date();
        const currentDay = date.getDay();
        const { senderID } = event;

        const userData = await usersData.get(senderID);
        if (userData.data.lastTimeGetReward === dateTime) {
            return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚠️ | 𝗗𝗘𝗝𝗔 𝗥𝗘𝗖𝗟𝗔𝗠𝗘
╰┈➤ Vos ressources ont déjà été distribuées pour aujourd'hui. Revenez demain.

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
            );
        }

        const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
        const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
        
        userData.data.lastTimeGetReward = dateTime;
        await usersData.set(senderID, {
            exp: userData.exp + getExp,
            data: userData.data
        });

        await updateUserCash(senderID, getCoin);
        const newCash = await getUserCash(senderID);

        const dayName = currentDay == 0 ? getLang("sunday") :
            currentDay == 1 ? getLang("monday") :
                currentDay == 2 ? getLang("tuesday") :
                    currentDay == 3 ? getLang("wednesday") :
                        currentDay == 4 ? getLang("thursday") :
                            currentDay == 5 ? getLang("friday") :
                                getLang("saturday");

        return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 💰 | 𝗔𝗟𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡 𝗗𝗨 𝗝𝗢𝗨𝗥
╰┈➤ Vos fonds quotidiens ont été transférés avec succès.

🗓️ Journée : ${dayName}
💵 Gain : +${formatNumber(getCoin)}$
✨ Expérience : +${getExp} XP
💳 Nouveau Solde : ${formatNumber(newCash)}$

━━━━━━━━━━━━━━━━━━━
⚡ Reste fort et continue à t'entraîner.

⚡ Minato Namikaze`
        );
    }
};
