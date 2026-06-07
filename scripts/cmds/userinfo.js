module.exports = {
  config: {
    name: "userinfo",
    version: "1.0.1",
    author: "Arjhil",
    longDescription: "Get User Information.",
    shortDescription: "Get user information.",
    category: "𝗜𝗡𝗙𝗢",
    countdown: 5,
  },

  onStart: async function ({ api, event, args }) {
    let { threadID, senderID, messageID } = event;

    const getUserInfo = async (targetID) => {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const userInfo = await api.getUserInfo(targetID);

        const userName = userInfo[targetID].name || "Name not available";
        const uid = targetID;
        const gender = userInfo[targetID].gender || "Gender not available";
        const birthday = userInfo[targetID].birthday || "Birthday not available";

        // Construct Facebook profile link
        const fbLink = `https://www.facebook.com/profile.php?id=${uid}`;

        // Get profile picture URL
        const profilePicURL = userInfo[targetID].profileUrl || "";

        // Get user status (online, offline, idle)
        const userStatus = userInfo[targetID].isOnline ? "Online 🟢" : "Offline 🔴";

        // Check friendship status (friends or not)
        const areFriends = userInfo[targetID].isFriend ? "Yes ✅" : "No ❌";

        // Additional social media links (if available)
        const socialMediaLinks = userInfo[targetID].socialMediaLinks || "No additional social media links available";

        const userInfoMessage = `
        🌟 User Information 🌟

        📝 Name: ${userName}
        🆔 UID: ${uid}
        👤 Gender: ${gender}
        🎂 Birthday: ${birthday}
        📊 Status: ${userStatus}
        🤝 Friends: ${areFriends}
        🌐 Facebook Link: ${fbLink}

        🖼 Profile Picture: ${profilePicURL}

        🔗 Additional Social Media Links:
        ${socialMediaLinks}
        `;

        api.sendMessage(userInfoMessage, threadID, (error, info) => {
          if (!error) {
            api.sendTypingIndicator(threadID);

            // Add a delay to simulate typing
            setTimeout(() => {
              // Add emoji reactions to the message
              api.setMessageReaction("❤", info.messageID);
              api.setMessageReaction("😊", info.messageID);
              api.setMessageReaction("👍", info.messageID);
            }, 1000);
          }
        });
      } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching user information.", threadID, messageID);
      }
    };

    if (!args[0]) {
      // If no UID is provided, use the sender's UID
      getUserInfo(senderID);
    } else if (args[0].indexOf("@") !== -1) {
      // If the message mentions a user, extract UID from mentions
      const mentionedUID = Object.keys(event.mentions)[0];
      if (mentionedUID) {
        getUserInfo(mentionedUID);
      }
    } else {
      api.sendMessage("Invalid command usage. Use `userinfo` or `userinfo @mention`.", threadID, messageID);
    }
  },
};
