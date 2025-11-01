// src/utils/fetchQuotes.js
const axios = require("axios");
const cheerio = require("cheerio");

// 🧠 Cache control
let cachedQuotes = null;
let lastUpdated = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

// 🧩 List of live and mock sources
const sources = [
  "https://wise.com/es/currency-converter/brl-to-usd-rate",
  "https://nubank.com.br/taxas-conversao/",
  "https://www.nomadglobal.com"
];

async function fetchQuotes() {
  const now = Date.now();

  // ✅ Serve cached data if still fresh
  if (cachedQuotes && now - lastUpdated < CACHE_DURATION) {
    console.log("⚡ Serving from cache (data < 60s old)");
    return cachedQuotes;
  }

  console.log("🔄 Fetching fresh data...");
  const results = [];

  for (const src of sources) {
    try {
      const { data } = await axios.get(src, { timeout: 10000 });

      let buy = null;
      let sell = null;

      // 🌐 Handle JSON APIs
      if (src.includes("exchangerate.host")) {
        buy = data.result;
      } else if (src.includes("open.er-api")) {
        buy = data.rates.USD;
      } else if (src.includes("v6.exchangerate-api")) {
        buy = data.conversion_rates.USD;
      }

      // If still null, fallback to HTML parsing (legacy)
      if (!buy && typeof data === "string") {
        const $ = cheerio.load(data);
        const text = $("body").text();
        const match = text.match(/1\s*BRL\s*=\s*([\d.,]+)/);
        if (match && match[1]) buy = parseFloat(match[1].replace(",", "."));
      }

      // 🧩 Fallback: generate mock data if all else fails
      if (!buy || isNaN(buy)) {
        buy = parseFloat((Math.random() * (5.2 - 5.0) + 5.0).toFixed(2));
        sell = parseFloat((buy + 0.05).toFixed(2));
        results.push({
          buy_price: buy,
          sell_price: sell,
          source: src + " (mocked)"
        });
        console.warn(`⚠️  Using mock data for ${src}`);
        continue;
      }

      sell = parseFloat((buy * 1.01).toFixed(4)); // small markup for demo

      results.push({
        buy_price: buy,
        sell_price: sell,
        source: src
      });
    } catch (err) {
      console.error(`❌ Error fetching from ${src}:`, err.message);
      // Fallback mock data in case of failure
      const randomBuy = parseFloat((Math.random() * (5.2 - 5.0) + 5.0).toFixed(2));
      const randomSell = parseFloat((randomBuy + 0.05).toFixed(2));
      results.push({
        buy_price: randomBuy,
        sell_price: randomSell,
        source: src + " (mocked)"
      });
    }
  }

  // ✅ Update cache
  cachedQuotes = results;
  lastUpdated = now;
  console.log("✅ Cache updated at:", new Date(lastUpdated).toLocaleTimeString());

  return results;
}

module.exports = fetchQuotes;
