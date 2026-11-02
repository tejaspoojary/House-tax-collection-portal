// 1. Sample data (fake properties for the demo)


// 2. Get the elements from the page
const checkBtn = document.getElementById("checkBtn");
const input = document.getElementById("propertyId");
const result = document.getElementById("result");

// 3. Function that runs when the button is clicked
// Reads the search box and finds matches by ID or owner name
function showResult() {
  const query = input.value.trim().toLowerCase();

  if (!query) {
    result.innerHTML = `<div class="card error">Please enter a property ID or an owner name.</div>`;
    return;
  }

  const matches = properties.filter(p =>
    p.id.toLowerCase() === query ||
    p.owner.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    result.innerHTML = `<div class="card error">No property found. Try an ID like H101, or part of the owner's name.</div>`;
  } else if (matches.length === 1) {
    showProperty(matches[0]);
  } else {
    result.innerHTML = `
      <div class="card">
        <h3>${matches.length} properties found</h3>
        ${matches.map(p => `
          <div class="match" onclick="openProperty('${p.id}')">
            <strong>${p.owner}</strong>
            <span>${p.id} · ${p.address}</span>
          </div>
        `).join("")}
      </div>
    `;
  }
}

// Called when the user clicks one of several matches
function openProperty(id) {
  showProperty(properties.find(p => p.id === id));
}

// Shows the details card for one property
function showProperty(property) {
  const statusClass = property.status === "Paid" ? "paid" : "pending";

  result.innerHTML = `
    <div class="card">
      <h3>Property ${property.id}</h3>
      <p><strong>Owner:</strong> ${property.owner}</p>
      <p><strong>Address:</strong> ${property.address}</p>
      <p><strong>Tax due:</strong> ₹${property.taxDue}</p>
      <p><strong>Due date:</strong> ${property.dueDate}</p>
      <p><strong>Status:</strong> <span class="${statusClass}">${property.status}</span></p>
      ${property.status === "Pending"
        ? `<button class="pay-btn" onclick="startPayment('${property.id}')">Pay ₹${property.taxDue}</button>`
        : ""}
    </div>
  `;
}
// 4. Connect the button to the function
checkBtn.addEventListener("click", showResult);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") showResult();
});
// Shows the payment screen
let selectedMethod = "UPI";

// Shows the payment screen
function startPayment(id) {
  const p = properties.find(x => x.id === id);
  selectedMethod = "UPI";

  result.innerHTML = `
    <div class="card pay-card">
      <h3>Complete your payment</h3>

      <div class="summary">
        <div><span>Property</span><strong>${p.id} · ${p.owner}</strong></div>
        <div class="total"><span>Amount to pay</span><strong>₹${p.taxDue}</strong></div>
      </div>

      <p class="section-label">Choose payment method</p>
      <div class="methods">
        <button type="button" class="method active" data-method="UPI" onclick="selectMethod('UPI')">📱 UPI</button>
        <button type="button" class="method" data-method="Card" onclick="selectMethod('Card')">💳 Card</button>
        <button type="button" class="method" data-method="Net Banking" onclick="selectMethod('Net Banking')">🏦 Net Banking</button>
      </div>

      <div id="methodFields"></div>
      <p class="form-error" id="formError"></p>

      <button class="pay-btn" id="payNowBtn" onclick="payNow('${p.id}')">Pay ₹${p.taxDue}</button>
      <p class="secure-note">🔒 Demo payment only. Do not enter real card or bank details.</p>
    </div>
  `;

  renderFields();
}

// Highlights the chosen tile and swaps the fields
function selectMethod(method) {
  selectedMethod = method;
  document.querySelectorAll(".method").forEach(b => {
    b.classList.toggle("active", b.dataset.method === method);
  });
  document.getElementById("formError").textContent = "";
  renderFields();
}

// Shows different fields for each method
function renderFields() {
  const box = document.getElementById("methodFields");

  if (selectedMethod === "UPI") {
    box.innerHTML = `
      <label>UPI ID</label>
      <input type="text" id="upiId" placeholder="name@bank">
    `;
  } else if (selectedMethod === "Card") {
    box.innerHTML = `
      <label>Card number</label>
      <input type="text" id="cardNo" placeholder="1234 5678 9012 3456" maxlength="19">
      <div class="row">
        <div><label>Expiry</label><input type="text" id="expiry" placeholder="MM/YY" maxlength="5"></div>
        <div><label>CVV</label><input type="password" id="cvv" placeholder="•••" maxlength="3"></div>
      </div>
    `;
  } else {
    box.innerHTML = `
      <label>Select your bank</label>
      <select id="bank">
        <option>State Bank of India</option>
        <option>HDFC Bank</option>
        <option>ICICI Bank</option>
        <option>Canara Bank</option>
        <option>Axis Bank</option>
      </select>
    `;
  }
}

// Validates, shows a spinner, then completes the payment
function payNow(id) {
  let error = "";

  if (selectedMethod === "UPI") {
    const upi = document.getElementById("upiId").value.trim();
    if (!/^[\w.\-]+@[\w]+$/.test(upi)) error = "Enter a valid UPI ID, like name@bank.";
  } else if (selectedMethod === "Card") {
    const no = document.getElementById("cardNo").value.replace(/\s/g, "");
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;
    if (!/^\d{16}$/.test(no)) error = "Card number must be 16 digits.";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) error = "Expiry must look like MM/YY.";
    else if (!/^\d{3}$/.test(cvv)) error = "CVV must be 3 digits.";
  }

  if (error) {
    document.getElementById("formError").textContent = error;
    return;
  }

  const btn = document.getElementById("payNowBtn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>Processing...`;

  setTimeout(() => confirmPayment(id, selectedMethod), 2000);
}

// Marks the tax as paid and shows the receipt
function confirmPayment(id, method) {
  const p = properties.find(x => x.id === id);
  const amount = p.taxDue;
  const receiptNo = "RCPT" + Date.now();
  const paidOn = new Date().toLocaleString("en-IN");

  p.taxDue = 0;
  p.status = "Paid";
    payments.push({ receiptNo, id: p.id, owner: p.owner, amount, method, paidOn });
  saveData();

  result.innerHTML = `
    <div class="card receipt">
      <h3>✅ Payment successful</h3>
      <p><strong>Receipt no:</strong> ${receiptNo}</p>
      <p><strong>Property:</strong> ${p.id}</p>
      <p><strong>Owner:</strong> ${p.owner}</p>
      <p><strong>Amount paid:</strong> ₹${amount}</p>
      <p><strong>Method:</strong> ${method}</p>
      <p><strong>Paid on:</strong> ${paidOn}</p>
      <button class="pay-btn" onclick="window.print()">Print receipt</button>
    </div>
  `;
}