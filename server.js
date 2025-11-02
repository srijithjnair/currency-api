// server.js

const express = require("express");
const cors = require("cors");
const fetchQuotes = require("./src/utils/fetchQuotes");
const path = require("path");

const app = express();
app.use(cors());

const morgan = require("morgan");
app.use(morgan("dev"));

// Serve static UI from /public
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Quotes route - DATA SOURCE LAYER
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await fetchQuotes();
    res.json(quotes);
  } catch (error) {
    console.error("❌ Error fetching quotes:", error.message);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});


// Average route - AGGREGATION LAYER
app.get("/average", async (req, res) => {
  try {
    const quotes = await fetchQuotes(); // fetch same data as /quotes

    console.log("Quotes fetched for average:", quotes);//Debug line

    // If no data returned, handle gracefully
    if (!quotes || quotes.length === 0) {
      return res.status(500).json({ error: "No quotes data available" });
    }

    // Compute totals
    let totalBuy = 0;
    let totalSell = 0;

    for (const q of quotes) {
      totalBuy += q.buy_price;
      totalSell += q.sell_price;
    }

    // Calculate averages
    const average_buy_price = parseFloat((totalBuy / quotes.length).toFixed(4));
    const average_sell_price = parseFloat((totalSell / quotes.length).toFixed(4));

    // Return result
    res.json({
      average_buy_price,
      average_sell_price,
      total_sources: quotes.length
    });

  } catch (error) {
    console.error("❌ Error calculating averages:", error.message);
    res.status(500).json({ error: "Failed to calculate averages" });
  }
});


// Slippage route - ANALYTICAL LAYER
app.get("/slippage", async (req, res) => {
  try {
    console.log("⚙️  /slippage endpoint hit");

    const quotes = await fetchQuotes(); // fetch the quotes first

    console.log("Fetched Quotes:", quotes);//Debug line

    // If no data returned, handle gracefully
    if (!quotes || quotes.length === 0) {
      return res.status(500).json({ error: "No quotes data available" });
    }

    // Calculate the average (just like /average endpoint)
    let totalBuy = 0;
    let totalSell = 0;

    for (const q of quotes) {
      totalBuy += q.buy_price;
      totalSell += q.sell_price;
    }

    const average_buy = totalBuy / quotes.length;
    const average_sell = totalSell / quotes.length;

    // Now calculate slippage for each source
    const slippage = quotes.map(q => {
      const buyDiff = ((q.buy_price - average_buy) / average_buy).toFixed(4);
      const sellDiff = ((q.sell_price - average_sell) / average_sell).toFixed(4);

      return {
        source: q.source,
        buy_price_slippage: parseFloat(buyDiff),
        sell_price_slippage: parseFloat(sellDiff)
      };
    });

    res.json({
      average_buy,
      average_sell,
      slippage
    });

  } catch (error) {
    console.error("❌ Error calculating slippage:", error.message);
    res.status(500).json({ error: "Failed to calculate slippage" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
