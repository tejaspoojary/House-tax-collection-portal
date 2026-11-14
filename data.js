// Default sample data
const defaultProperties = [
   { id: "H101", owner: "Tejas",   address: "12, Gandhi Road",  taxDue: 2400, dueDate: "31 Oct 2026", status: "Pending" },
  { id: "H102", owner: "Sujith", address: "45, Nehru Street", taxDue: 5000,    dueDate: "31 Oct 2026", status: "Pending" },
  { id: "H103", owner: "Shrisha", address: "7, Park Avenue",   taxDue: 3800, dueDate: "31 Oct 2026", status: "Pending" },
  { id: "H104", owner: "Vishwas",   address: "23, Lake View",    taxDue: 1500, dueDate: "31 Oct 2026", status: "Pending" },
  { id: "H105", owner: "Skanda",   address: "9, Market Lane",   taxDue: 3000,    dueDate: "31 Oct 2026", status: "Pending" }
];

const defaultPayments = [
  { receiptNo: "RCPT1001", id: "H102", owner: "Anita Sharma", amount: 1800, method: "UPI",         paidOn: "12/10/2026, 10:15:00 am" },
  { receiptNo: "RCPT1002", id: "H105", owner: "Imran Khan",   amount: 2100, method: "Net Banking", paidOn: "15/10/2026, 4:40:00 pm" }
];
const DATA_VERSION = "v1";
if (localStorage.getItem("dataVersion") !== DATA_VERSION) {
  localStorage.removeItem("properties");
  localStorage.removeItem("payments");
  localStorage.setItem("dataVersion", DATA_VERSION);
}

// Load saved data, or use the defaults the first time
let properties = JSON.parse(localStorage.getItem("properties")) || defaultProperties;
let payments = JSON.parse(localStorage.getItem("payments")) || defaultPayments;

function saveData() {
  localStorage.setItem("properties", JSON.stringify(properties));
  localStorage.setItem("payments", JSON.stringify(payments));
}

function resetData() {
  localStorage.removeItem("properties");
  localStorage.removeItem("payments");
  location.reload();
}
