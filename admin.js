const pendingList = properties.filter(p => p.status === "Pending");
const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
const totalPending = properties.reduce((sum, p) => sum + p.taxDue, 0);

// Summary numbers
document.getElementById("collected").textContent = "₹" + totalCollected;
document.getElementById("pending").textContent = "₹" + totalPending;
document.getElementById("paidCount").textContent = properties.length - pendingList.length;
document.getElementById("pendingCount").textContent = pendingList.length;

// Defaulters table
document.getElementById("defaulters").innerHTML = pendingList.length
  ? pendingList.map(p => `
      <tr><td>${p.id}</td><td>${p.owner}</td><td>${p.address}</td><td>₹${p.taxDue}</td></tr>
    `).join("")
  : `<tr><td colspan="4">No pending dues 🎉</td></tr>`;

// Payments table
document.getElementById("paymentsBody").innerHTML = payments.length
  ? payments.map(p => `
      <tr><td>${p.receiptNo}</td><td>${p.id}</td><td>${p.owner}</td><td>₹${p.amount}</td><td>${p.method}</td><td>${p.paidOn}</td></tr>
    `).join("")
  : `<tr><td colspan="6">No payments yet</td></tr>`;