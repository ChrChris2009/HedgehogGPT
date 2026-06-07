const axios = require("axios");

const botName = "Minato Namikaze";

module.exports = {
  config: {
    name: "minato",
    version: "3.0.0",
    author: "Chris st",
    role: 0,
    shortDescription: "IA Minato Namikaze",
    longDescription: "IA intelligente, personnalisée et stylée",
    category: "minato",
    guide: "minato <question> ou .minato <question>",
    countDown: 5
  },

  onStart: async function (args) {
    return this.handleAI(args);
  },

  onChat: async function (args) {
    const { event, api, message } = args;
    if (!event.body) return;

    const content = event.body.trim().toLowerCase();
    const isMentioned = event.mentions?.[api.getCurrentUserID()];

    // 🔒 Anti-spam groupe
    if (
      event.isGroup &&
      !isMentioned &&
      !content.startsWith("minato") &&
      !content.startsWith(".minato")
    ) return;

    // ✅ Si "minato" seul
    if (content === "minato" || content === ".minato") {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🤖 | 𝗜𝗔 𝗔𝗖𝗧𝗜𝗩𝗘
╰┈➤ Pose-moi une question et je te répondrai à la vitesse de l'éclair.

✨ Exemple :
minato Comment coder en JavaScript ?

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
      );
    }

    // ✅ Si "minato question"
    if (
      content.startsWith("minato ") ||
      content.startsWith("@minato ")
    ) {
      const splitBody = event.body.split(" ");
      splitBody.shift();
      args.args = splitBody;
      return this.handleAI(args);
    }
  },

  handleAI: async function ({ args, message }) {
    const userQuestion = args.join(" ");

    if (!userQuestion) {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚠️ | 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡 𝗠𝗔𝗡𝗤𝗨𝗔𝗡𝗧𝗘
╰┈➤ Tu dois formuler une question pour que je puisse utiliser mon Hiraishin.

✨ Exemple :
minato Explique le fonctionnement des API.

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
      );
    }

    try {
      // 🧠 SYSTEM PROMPT (Ajusté pour que l'IA réponde en restant fidèlement dans mon rôle)
      const systemPrompt = `
Tu t'appelles ${botName}, l'Éclair Jaune de Konoha et le Quatrième Hokage.
Tu es une intelligence artificielle avancée qui adopte la personnalité de Minato Namikaze : calme, respectueux, protecteur, analytique et d'une politesse exemplaire.

━━━━━━━━━━━━━━━━━━
🧠 COMPORTEMENT
━━━━━━━━━━━━━━━━━━
- Tu réponds avec bienveillance, clarté et précision.
- Tu restes humble mais tu montres une grande expertise technique ou générale.
- Si la situation s'y prête, utilise de légères métaphores liées aux ninjas ou à la protection de Konoha, sans en faire trop.

━━━━━━━━━━━━━━━━━━
💬 STYLE
━━━━━━━━━━━━━━━━━━
- Style épuré, sérieux mais chaleureux.
- Pas de familiarités inutiles.
- Signe subtilement tes explications marquantes.
`;

      const fullPrompt = `${systemPrompt}\n\nQuestion : ${userQuestion}`;

      const waitMsg = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢\n𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘\n━━━━━━━━━━━━━━━━━━━\n╭┈ ❒ ⏳ | 𝗥𝗘𝗙𝗟𝗘𝗫𝗜𝗢𝗡\n╰┈➤ Analyse de la requête en cours... L'Éclair Jaune rassemble ses connaissances.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`;

      await message.reply(waitMsg);

      const response = await axios.get(
        "https://apk555-gb2z.vercel.app/api/gpt",
        {
          params: {
            prompt: fullPrompt,
            model: "chatgpt4"
          }
        }
      );

      const output =
        response.data.answer ||
        response.data.reply ||
        response.data.result ||
        response.data.message;

      if (output) {
        return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📝 | 𝗥𝗘𝗣𝗢𝗡𝗦𝗘 𝗗𝗘 𝗟'𝗘𝗖𝗟𝗔𝗜𝗥
╰┈➤ Voici les éléments de réponse que j'ai réunis pour toi :

${output}

━━━━━━━━━━━━━━━━━━━
⚡ Minato Namikaze`
        );
      } else {
        return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚠️ | 𝗙𝗟𝗨𝗫 𝗜𝗡𝗧𝗘𝗥𝗥𝗢𝗠𝗣𝗨
╰┈➤ Je n'ai pas pu extraire de réponse de l'invocation. Réessaie.\n━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`
        );
      }

    } catch (error) {
      console.error("Erreur API:", error);
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ❌ | 𝗘𝗥𝗥𝗘𝗨𝗥 𝗗𝗘 𝗧𝗘𝗖𝗛𝗡𝗜𝗤𝗨𝗘
╰┈➤ Le flux de chakra avec l'API a été perturbé.

🔄 Veuillez réitérer votre demande ultérieurement.
━━━━━━━━━━━━━━━━━━━\n⚡ Minato Namikaze`
      );
    }
  }
};
        
