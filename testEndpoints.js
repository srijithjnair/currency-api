const axios = require("axios");

async function testAPI() {
  try {
    console.log("Testing /quotes...");
    const quotes = await axios.get("http://localhost:3000/quotes");
    console.log("✅ /quotes working:", quotes.data.length, "sources");

    console.log("Testing /average...");
    const avg = await axios.get("http://localhost:3000/average");
    console.log("✅ /average working:", avg.data);

    console.log("Testing /slippage...");
    const slip = await axios.get("http://localhost:3000/slippage");
    console.log("✅ /slippage working:", slip.data.slippage.length, "entries");

  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testAPI();
