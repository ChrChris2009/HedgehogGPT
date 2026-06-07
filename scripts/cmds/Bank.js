const { getTime } = global.utils;

module.exports.config = {
  name: "bank",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Les Ombres",
  description: "The Ultimate Financial Experience",
  commandCategory: "Economy",
  usages: "[balance/deposit/withdraw/invest/stocks/crypto/...]",
  cooldowns: 2
};

// ===== MARKET DATA =====
const STOCKS = {
  AAPL: { name: "Apple Inc", base: 180, vol: 0.05 },
  TSLA: { name: "Tesla", base: 250, vol: 0.08 },
  GOOGL: { name: "Google", base: 140, vol: 0.04 },
  MSFT: { name: "Microsoft", base: 380, vol: 0.03 },
  NVDA: { name: "NVIDIA", base: 800, vol: 0.1 }
};

const CRYPTO = {
  BTC: { name: "Bitcoin", base: 45000, vol: 0.12 },
  ETH: { name: "Ethereum", base: 3000, vol: 0.15 },
  SOL: { name: "Solana", base: 100, vol: 0.18 },
  DOGE: { name: "Dogecoin", base: 0.08, vol: 0.25 }
};

const BONDS = {
  GOV10Y: { name: "Government 10Y", rate: 0.05, price: 1000, days: 10 },
  CORP5Y: { name: "Corporate 5Y", rate: 0.08, price: 5000, days: 5 }
};

const BUSINESSES = {
  lemonade: { name: "Lemonade Stand", price: 50000, income: 500, level: 1 },
  cafe: { name: "Coffee Shop", price: 500000, income: 5000, level: 1 },
  restaurant: { name: "Restaurant", price: 2000000, income: 20000, level: 1 },
  mall: { name: "Shopping Mall", price: 20000000, income: 200000, level: 1 },
  tech: { name: "Tech Company", price: 100000000, income: 1000000, level: 1 }
};

const PROPERTIES = {
  apartment: { name: "Studio Apartment", price: 200000, rent: 1000 },
  house: { name: "Suburban House", price: 500000, rent: 3000 },
  mansion: { name: "Luxury Mansion", price: 5000000, rent: 50000 },
  penthouse: { name: "Sky Penthouse", price: 20000000, rent: 250000 }
};

const LUXURY = {
  watch: { name: "Rolex Watch", price: 50000, resale: 0.7 },
  yacht: { name: "Private Yacht", price: 10000000, resale: 0.6 },
  jet: { name: "Private Jet", price: 50000000, resale: 0.5 },
  island: { name: "Private Island", price: 200000000, resale: 0.8 }
};

const CARS = {
  civic: { name: "Honda Civic", price: 25000, resale: 0.6 },
  bmw: { name: "BMW M3", price: 80000, resale: 0.7 },
  ferrari: { name: "Ferrari 488", price: 300000, resale: 0.8 },
  bugatti: { name: "Bugatti Chiron", price: 3000000, resale: 0.9 }
};

const INSURANCE = {
  basic: { name: "Basic Coverage", price: 10000, cover: 0.5, claim: 50000 },
  premium: { name: "Premium", price: 100000, cover: 0.8, claim: 500000 },
  elite: { name: "Elite Protection", price: 1000000, cover: 1.0, claim: 5000000 }
};

// ===== MARKET PRICES =====
function getPrice(asset, base, vol) {
  const seed = Math.floor(getTime() / 60000); // change every minute
  const rng = Math.sin(seed + asset.length) * 10000;
  const change = (rng - Math.floor(rng)) * vol * 2 - vol;
  return Math.floor(base * (1 + change));
}

module.exports.onStart = async function({ api, event, args, usersData, currencies, message }) {
  const { senderID } = event;
  const cmd = args[0]?.toLowerCase();
  const user = await usersData.get(senderID);
  const money = await currencies.getData(senderID);

  // Init bank data
  if (!user.data.bank) {
    user.data.bank = {
      balance: 0,
      loan: 0,
      credit: 100,
      premium: 0,
      stocks: {},
      crypto: {},
      bonds: [],
      businesses: [],
      properties: [],
      cars: [],
      luxury: [],
      insurance: null,
      vault: 0,
      achievements: [],
      history: [],
      lastDaily: 0,
      lastWork: 0,
      lastCollect: 0,
      lastRent: 0,
      lastRob: 0
    };
  }
  const b = user.data.bank;

  const addHistory = (type, amount) => {
    b.history.unshift({ type, amount, time: getTime() });
    if (b.history.length > 50) b.history.pop();
  };

  const isPremium = () => b.premium > getTime();

  // ===== HELP =====
  if (!cmd) {
    return message.reply(`🏦 𝐁𝐀𝐍𝐊𝐈𝐍𝐆 𝐒𝐘𝐒𝐓𝐄𝐌 ━━━━━━━━━━━━━━━━\n💎 𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐅𝐢𝐧𝐚𝐧𝐜𝐢𝐚𝐥 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞 💎\n\n💰 𝐁𝐀𝐒𝐈𝐂 𝐁𝐀𝐍𝐊𝐈𝐍𝐆 ━━━━━━━━━━━━━\n🏦 balance | deposit | withdraw | transfer\n💳 loan | repay | history | daily | work\n\n📈 𝐈𝐍𝐕𝐄𝐒𝐓𝐌𝐄𝐍𝐓𝐒 ━━━━━━━━━━━━━\n🚀 invest | stocks | crypto | bonds\n📊 portfolio | market | dividend\n\n🏢 𝐁𝐔𝐒𝐈𝐍𝐄𝐒 ━━━━━━━━━━━━━\n🏢 business | business_collect\n🛒 shop\n\n🏠 𝐑𝐄𝐀𝐋 𝐄𝐒𝐓𝐀𝐓𝐄 ━━━━━━━━━━━━━\n🏠 property | house | rent\n\n💎 𝐋𝐔𝐗𝐔𝐑𝐘 ━━━━━━━━━━━━━\n💎 luxury | car\n\n🎰 𝐆𝐀𝐌𝐈𝐍𝐆 ━━━━━━━━━━━━━\n🎲 gamble | lottery | slots\n🃏 blackjack | roulette | rob\n\n⭐ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ━━━━━━━━━━━━━\n💎 premium | vault | insurance\n📊 credit | achievements | leaderboard`);
  }

  // ===== BASIC BANKING =====
  if (cmd == "balance") {
    const net = b.balance + money.money - b.loan;
    const stocksVal = Object.entries(b.stocks).reduce((s, [k, v]) => s + v * getPrice(k, STOCKS[k]?.base || 100, 0.05), 0);
    const cryptoVal = Object.entries(b.crypto).reduce((s, [k, v]) => s + v * getPrice(k, CRYPTO[k]?.base || 100, 0.1), 0);
    const total = net + stocksVal + cryptoVal + b.vault;
    return message.reply(`🏦 𝐁𝐀𝐍𝐊 𝐁𝐀𝐋𝐀𝐍𝐂𝐄\n💵 Wallet: $${money.money.toLocaleString()}\n🏦 Bank: $${b.balance.toLocaleString()}\n🔐 Vault: $${b.vault.toLocaleString()}\n📊 Stocks: $${Math.floor(stocksVal).toLocaleString()}\n₿ Crypto: $${Math.floor(cryptoVal).toLocaleString()}\n💳 Loan: $${b.loan.toLocaleString()}\n📈 Credit: ${b.credit}/1000\n${isPremium()? "💎 Premium Active" : ""}\n\n💰 Net Worth: $${Math.floor(total).toLocaleString()}`);
  }

  if (cmd == "deposit") {
    const amount = args[1] == "all"? money.money : parseInt(args[1]);
    if (!amount || amount <= 0) return message.reply("Usage: bank deposit <amount>");
    if (money.money < amount) return message.reply("❌ Fonds insuffisants");
    await currencies.decreaseMoney(senderID, amount);
    b.balance += amount;
    addHistory("deposit", amount);
    await usersData.set(senderID, user);
    return message.reply(`✅ Déposé: $${amount.toLocaleString()}\n🏦 Nouveau solde: $${b.balance.toLocaleString()}`);
  }

  if (cmd == "withdraw") {
    const amount = args[1] == "all"? b.balance : parseInt(args[1]);
    if (!amount || amount <= 0) return message.reply("Usage: bank withdraw <amount>");
    if (b.balance < amount) return message.reply("❌ Solde bancaire insuffisant");
    b.balance -= amount;
    await currencies.increaseMoney(senderID, amount);
    addHistory("withdraw", amount);
    await usersData.set(senderID, user);
    return message.reply(`✅ Retiré: $${amount.toLocaleString()}\n💵 Wallet: $${(money.money + amount).toLocaleString()}`);
  }

  if (cmd == "transfer") {
    const target = Object.keys(event.mentions)[0];
    const amount = parseInt(args[2]);
    if (!target ||!amount || amount <= 0) return message.reply("Usage: bank transfer @user <amount>");
    if (money.money < amount) return message.reply("❌ Fonds insuffisants");
    await currencies.decreaseMoney(senderID, amount);
    await currencies.increaseMoney(target, amount);
    addHistory("transfer_out", amount);
    const tUser = await usersData.get(target);
    if (!tUser.data.bank) tUser.data.bank = { history: [] };
    tUser.data.bank.history.unshift({ type: "transfer_in", amount, from: senderID, time: getTime() });
    await usersData.set(target, tUser);
    await usersData.set(senderID, user);
    return message.reply(`✅ Transféré $${amount.toLocaleString()} à ${event.mentions[target]}`);
  }

  if (cmd == "loan") {
    const amount = parseInt(args[1]);
    const maxLoan = b.credit * 1000;
    if (!amount || amount <= 0) return message.reply(`Usage: bank loan <amount>\nMax: $${maxLoan.toLocaleString()}`);
    if (b.loan > 0) return message.reply("❌ Rembourse ton prêt d'abord");
    if (amount > maxLoan) return message.reply(`❌ Limite: $${maxLoan.toLocaleString()}\nAugmente ton crédit avec bank repay`);
    b.loan = amount;
    await currencies.increaseMoney(senderID, amount);
    addHistory("loan", amount);
    await usersData.set(senderID, user);
    return message.reply(`💳 Prêt approuvé: $${amount.toLocaleString()}\n📈 Intérêt: 10% par jour\n💰 Rembourse: bank repay <amount>`);
  }

  if (cmd == "repay") {
    const amount = args[1] == "all"? Math.min(money.money, b.loan) : parseInt(args[1]);
    if (!amount || amount <= 0) return message.reply("Usage: bank repay <amount>");
    if (b.loan == 0) return message.reply("✅ Aucun prêt à rembourser");
    if (money.money < amount) return message.reply("❌ Fonds insuffisants");
    const pay = Math.min(amount, b.loan);
    await currencies.decreaseMoney(senderID, pay);
    b.loan -= pay;
    b.credit = Math.min(1000, b.credit + Math.floor(pay / 1000));
    addHistory("repay", pay);
    await usersData.set(senderID, user);
    return message.reply(`✅ Remboursé: $${pay.toLocaleString()}\n💳 Dette restante: $${b.loan.toLocaleString()}\n📈 Credit: ${b.credit}/1000`);
  }

  if (cmd == "history") {
    if (b.history.length == 0) return message.reply("📋 Aucune transaction");
    let msg = `📋 𝐓𝐑𝐀𝐍𝐒𝐀𝐂𝐓𝐈𝐎𝐍 𝐇𝐈𝐒𝐓𝐎𝐑𝐘\n\n`;
    b.history.slice(0, 10).forEach(h => {
      const date = new Date(h.time).toLocaleString();
      msg += `${h.type}: $${h.amount.toLocaleString()} - ${date}\n`;
    });
    return message.reply(msg);
  }

  if (cmd == "daily") {
    if (now - b.lastDaily < 86400000) {
      const h = Math.floor((86400000 - (now - b.lastDaily)) / 3600000);
      return message.reply(`⏰ Reviens dans ${h}h`);
    }
    b.lastDaily = now;
    const base = 5000;
    const bonus = isPremium()? base : 0;
    const total = base + bonus;
    await currencies.increaseMoney(senderID, total);
    addHistory("daily", total);
    await usersData.set(senderID, user);
    return message.reply(`🎁 Daily Bonus: $${total.toLocaleString()}${isPremium()? " [2x Premium]" : ""}`);
  }

  if (cmd == "work") {
    if (now - b.lastWork < 3600000) {
      const m = Math.ceil((3600000 - (now - b.lastWork)) / 60000);
      return message.reply(`⏰ Reviens dans ${m}min`);
    }
    b.lastWork = now;
    const jobs = [
      { name: "Livreur", pay: 500 },
      { name: "Serveur", pay: 800 },
      { name: "Développeur", pay: 2000 },
      { name: "Trader", pay: 5000 }
    ];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const pay = job.pay * (isPremium()? 2 : 1);
    await currencies.increaseMoney(senderID, pay);
    addHistory("work", pay);
    await usersData.set(senderID, user);
    return message.reply(`💼 Tu as travaillé comme ${job.name}\n💰 Gagné: $${pay.toLocaleString()}${isPremium()? " [2x Premium]" : ""}`);
  }

  // ===== INVESTMENTS =====
  if (cmd == "market") {
    let msg = `📈 𝐋𝐈𝐕𝐄 𝐌𝐀𝐑𝐊𝐄𝐓\n\n📊 STOCKS:\n`;
    for (const [k, v] of Object.entries(STOCKS)) {
      msg += `${k}: $${getPrice(k, v.base, v.vol).toLocaleString()}\n`;
    }
    msg += `\n₿ CRYPTO:\n`;
    for (const [k, v] of Object.entries(CRYPTO)) {
      msg += `${k}: $${getPrice(k, v.base, v.vol).toLocaleString()}\n`;
    }
    return message.reply(msg);
  }

  if (cmd == "stocks") {
    const sub = args[1];
    if (!sub || sub == "list") {
      let msg = `📊 𝐒𝐓𝐎𝐂𝐊𝐒\n`;
      for (const [k, v] of Object.entries(STOCKS)) {
        const price = getPrice(k, v.base, v.vol);
        const owned = b.stocks[k] || 0;
        msg += `${k} - ${v.name}\n$${price.toLocaleString()} [Owned: ${owned}]\n\n`;
      }
      return message.reply(msg + `Usage: bank stocks buy <symbol> <qty>`);
    }
    if (sub == "buy") {
      const symbol = args[2]?.toUpperCase();
      const qty = parseInt(args[3]);
      if (!STOCKS[symbol] ||!qty || qty <= 0) return message.reply("Usage: bank stocks buy <symbol> <qty>");
      const price = getPrice(symbol, STOCKS[symbol].base, STOCKS[symbol].vol);
      const cost = price * qty;
      if (money.money < cost) return message.reply(`❌ Coût: $${cost.toLocaleString()}`);
      await currencies.decreaseMoney(senderID, cost);
      b.stocks[symbol] = (b.stocks[symbol] || 0) + qty;
      addHistory("stock_buy", cost);
      await usersData.set(senderID, user);
      return message.reply(`✅ Acheté ${qty} ${symbol} @ $${price.toLocaleString()}\n💰 Total: $${cost.toLocaleString()}`);
    }
    if (sub == "sell") {
      const symbol = args[2]?.toUpperCase();
      const qty = args[3] == "all"? b.stocks[symbol] : parseInt(args[3]);
      if (!b.stocks[symbol] ||!qty || qty <= 0) return message.reply("❌ Tu n'as pas cette action");
      const price = getPrice(symbol, STOCKS[symbol].base, STOCKS[symbol].vol);
      const gain = price * qty;
      b.stocks[symbol] -= qty;
      if (b.stocks[symbol] <= 0) delete b.stocks[symbol];
      await currencies.increaseMoney(senderID, gain);
      addHistory("stock_sell", gain);
      await usersData.set(senderID, user);
      return message.reply(`✅ Vendu ${qty} ${symbol} @ $${price.toLocaleString()}\n💰 Gagné: $${gain.toLocaleString()}`);
    }
  }

  if (cmd == "crypto") {
    const sub = args[1];
    if (!sub || sub == "list") {
      let msg = `₿ 𝐂𝐑𝐘𝐏𝐓𝐎\n\n`;
      for (const [k, v] of Object.entries(CRYPTO)) {
        const price = getPrice(k, v.base, v.vol);
        const owned = b.crypto[k] || 0;
        msg += `${k} - ${v.name}\n$${price.toLocaleString()} [Owned: ${owned}]\n\n`;
      }
      return message.reply(msg + `Usage: bank crypto buy <symbol> <qty>`);
    }
    if (sub == "buy") {
      const symbol = args[2]?.toUpperCase();
      const qty = parseFloat(args[3]);
      if (!CRYPTO[symbol] ||!qty || qty <= 0) return message.reply("Usage: bank crypto buy <symbol> <qty>");
      const price = getPrice(symbol, CRYPTO[symbol].base, CRYPTO[symbol].vol);
      const cost = Math.floor(price * qty);
      if (money.money < cost) return message.reply(`❌ Coût: $${cost.toLocaleString()}`);
      await currencies.decreaseMoney(senderID, cost);
      b.crypto[symbol] = (b.crypto[symbol] || 0) + qty;
      addHistory("crypto_buy", cost);
      await usersData.set(senderID, user);
      return message.reply(`✅ Acheté ${qty} ${symbol} @ $${price.toLocaleString()}`);
    }
    if (sub == "sell") {
      const symbol = args[2]?.toUpperCase();
      const qty = args[3] == "all"? b.crypto[symbol] : parseFloat(args[3]);
      if (!b.crypto[symbol] ||!qty || qty <= 0) return message.reply("❌ Tu n'as pas ce crypto");
      const price = getPrice(symbol, CRYPTO[symbol].base, CRYPTO[symbol].vol);
      const gain = Math.floor(price * qty);
      b.crypto[symbol] -= qty;
      if (b.crypto[symbol] <= 0.0001) delete b.crypto[symbol];
      await currencies.increaseMoney(senderID, gain);
      addHistory("crypto_sell", gain);
      await usersData.set(senderID, user);
      return message.reply(`✅ Vendu ${qty} ${symbol} @ $${price.toLocaleString()}\n💰 Gagné: $${gain.toLocaleString()}`);
    }
  }

  if (cmd == "portfolio") {
    let msg = `📊 𝐏𝐎𝐑𝐓𝐅𝐎𝐋𝐈𝐎\n\n📈 STOCKS:\n`;
    let stockVal = 0;
    for (const [k, v] of Object.entries(b.stocks)) {
      const price = getPrice(k, STOCKS[k].base, STOCKS[k].vol);
      const val = price * v;
      stockVal += val;
      msg += `${k}: ${v} × $${price.toLocaleString()} = $${val.toLocaleString()}\n`;
    }
    msg += `\n₿ CRYPTO:\n`;
    let cryptoVal = 0;
    for (const [k, v] of Object.entries(b.crypto)) {
      const price = getPrice(k, CRYPTO[k].base, CRYPTO[k].vol);
      const val = Math.floor(price * v);
      cryptoVal += val;
      msg += `${k}: ${v} × $${price.toLocaleString()} = $${val.toLocaleString()}\n`;
    }
    msg += `\n💰 Total: $${(stockVal + cryptoVal).toLocaleString()}`;
    return message.reply(msg);
  }

  // ===== BUSINESS =====
  if (cmd == "business") {
    const sub = args[1];
    if (!sub || sub == "list") {
      let msg = `🏢 𝐁𝐔𝐒𝐈𝐍𝐄𝐒𝐄𝐒\n\n`;
      for (const [k, v] of Object.entries(BUSINESSES)) {
        const owned = b.businesses.filter(x => x.type == k).length;
        msg += `${v.name}\n💰 $${v.price.toLocaleString()} | 📈 $${v.income.toLocaleString()}/5h\nOwned: ${owned}\n\n`;
      }
      return message.reply(msg + `Usage: bank business buy <type>`);
    }
    if (sub == "buy") {
      const type = args[2];
      if (!BUSINESSES[type]) return message.reply("❌ Business invalide");
      const biz = BUSINESSES[type];
      if (money.money < biz.price) return message.reply(`❌ Coût: $${biz.price.toLocaleString()}`);
      await currencies.decreaseMoney(senderID, biz.price);
      b.businesses.push({ type, level: 1, income: biz.income });
      addHistory("business_buy", biz.price);
      await usersData.set(senderID, user);
      return message.reply(`✅ Acheté: ${biz.name}\n📈 Revenu: $${biz.income.toLocaleString()}/5h`);
    }
  }

  if (cmd == "business_collect") {
    if (now - b.lastCollect < 18000000) {
      const h = Math.ceil((18000000 - (now - b.lastCollect)) / 3600000);
      return message.reply(`⏰ Reviens dans ${h}h`);
    }
    if (b.businesses.length == 0) return message.reply("❌ Aucun business. bank business buy");
    b.lastCollect = now;
    const income = b.businesses.reduce((s, x) => s + x.income, 0) * (isPremium()? 2 : 1);
    await currencies.increaseMoney(senderID, income);
    addHistory("business_income", income);
    await usersData.set(senderID, user);
    return message.reply(`💰 Revenus collectés: $${income.toLocaleString()}${isPremium()? " [2x Premium]" : ""}`);
  }

  // ===== PROPERTY =====
  if (cmd == "property") {
    const sub = args[1];
    if (!sub || sub == "list") {
      let msg = `🏠 𝐏𝐑𝐎𝐏𝐄𝐑𝐓𝐈𝐄𝐒\n\n`;
      for (const [k, v] of Object.entries(PROPERTIES)) {
        msg += `${v.name}\n💰 $${v.price.toLocaleString()} | 💵 Rent: $${v.rent.toLocaleString()}/day\n\n`;
      }
      return message.reply(msg + `Usage: bank property buy <type>`);
    }
    if (sub == "buy") {
      const type = args[2];
      if (!PROPERTIES[type]) return message.reply("❌ Propriété invalide");
      const prop = PROPERTIES[type];
      if (money.money < prop.price) return message.reply(`❌ Coût: $${prop.price.toLocaleString()}`);
      await currencies.decreaseMoney(senderID, prop.price);
      b.properties.push({ type, rent: prop.rent });
      addHistory("property_buy", prop.price);
      await usersData.set(senderID, user);
      return message.reply(`✅ Acheté: ${prop.name}\n💵 Loyer: $${prop.rent.toLocaleString()}/jour`);
    }
  }

  if (cmd == "rent") {
    if (now - b.lastRent < 86400000) {
      const h = Math.ceil((86400000 - (now - b.lastRent)) / 3600000);
      return message.reply(`⏰ Reviens dans ${h}h`);
    }
    if (b.properties.length == 0) return message.reply("❌ Aucune propriété");
    b.lastRent = now;
    const income = b.properties.reduce((s, x) => s + x.rent, 0);
    await currencies.increaseMoney(senderID, income);
    addHistory("rent", income);
    await usersData.set(senderID, user);
    return message.reply(`💰 Loyer collecté: $${income.toLocaleString()}`);
  }

  // ===== GAMING =====
  if (cmd == "gamble") {
    const amount = parseInt(args[1]);
    if (!amount || amount <= 0) return message.reply("Usage: bank gamble <amount>");
    if (money.money < amount) return message.reply("❌ Fonds insuffisants");
    const win = Math.random() > 0.5;
    if (win) {
      await currencies.increaseMoney(senderID, amount);
      addHistory("gamble_win", amount);
      return message.reply(`🎲 Tu as gagné! +$${amount.toLocaleString()}`);
    } else {
      await currencies.decreaseMoney(senderID, amount);
      addHistory("gamble_loss", amount);
      return message.reply(`🎲 Tu as perdu! -$${amount.toLocaleString()}`);
    }
  }

  if (cmd == "rob") {
    if (now - b.lastRob < 43200000) {
      const h = Math.ceil((43200000 - (now - b.lastRob)) / 3600000);
      return message.reply(`⏰ Cooldown: ${h}h`);
    }
    b.lastRob = now;
    const allUsers = await usersData.getAll();
    const top = allUsers.filter(u => u.data.bank).sort((a, b) => (b.data.bank.balance + b.money) - (a.data.bank.balance + a.money)).slice(0, 10);
    if (top.length == 0) return message.reply("❌ Aucune cible");
    const target = top[Math.floor(Math.random() * top.length)];
    const success = Math.random() < 0.69;
    if (success) {
      const steal = Math.floor(target.data.bank.balance * 0.1);
      if (steal <= 0) return message.reply("💨 La cible est pauvre");
      target.data.bank.balance -= steal;
      await currencies.increaseMoney(senderID, steal);
      addHistory("rob_win", steal);
      await usersData.set(target.userID, target);
      await usersData.set(senderID, user);
      return message.reply(`🏴‍☠️ Vol réussi!\n💰 Volé: $${steal.toLocaleString()} à ${target.name}`);
    } else {
      const fine = Math.floor(money.money * 0.05);
      await currencies.decreaseMoney(senderID, fine);
      b.credit = Math.max(0, b.credit - 10);
      addHistory("rob_loss", fine);
      await usersData.set(senderID, user);
      return message.reply(`🚔 Tu t'es fait attraper!\n💸 Amende: $${fine.toLocaleString()}\n📉 Credit -10`);
    }
  }

  // ===== PREMIUM =====
  if (cmd == "premium") {
    if (args[1] == "buy") {
      if (isPremium()) return message.reply("✅ Premium déjà actif");
      const cost = 10000000;
      if (money.money < cost) return message.reply(`❌ Coût: $${cost.toLocaleString()}`);
      await currencies.decreaseMoney(senderID, cost);
      b.premium = now + 2592000000; // 30 jours
      addHistory("premium_buy", cost);
      await usersData.set(senderID, user);
      return message.reply(`💎 Premium activé 30 jours!\n✨ 2x earnings | 🎁 Bonus exclusifs`);
    }
    const left = b.premium > now? Math.ceil((b.premium - now) / 86400000) : 0;
    return message.reply(`💎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌\n\nStatus: ${isPremium()? `Actif - ${left} jours` : "Inactif"}\n💰 Prix: $10,000,000 / 30 jours\n✨ Avantages: 2x work/daily/business\nUsage: bank premium buy`);
  }

  if (cmd == "leaderboard") {
    const allUsers = await usersData.getAll();
    const top = allUsers
   .filter(u => u.data.bank)
   .map(u => ({
        name: u.name,
        worth: u.money + u.data.bank.balance + u.data.bank.vault
      }))
   .sort((a, b) => b.worth - a.worth)
   .slice(0, 10);
    let msg = `🏆 𝐋𝐄𝐀𝐃𝐄𝐑𝐁𝐎𝐀𝐑𝐃\n\n`;
    top.forEach((u, i) => {
      const medal = i == 0? "🥇" : i == 1? "🥈" : i == 2? "🥉" : `${i + 1}.`;
      msg += `${medal} ${u.name}\n💰 $${u.worth.toLocaleString()}\n\n`;
    });
    return message.reply(msg);
  }

  return message.reply(`❌ Commande inconnue. Tape: bank`);
};
