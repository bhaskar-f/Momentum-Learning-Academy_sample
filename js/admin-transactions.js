// const API_BASE = "http://localhost:3000";
// const token = localStorage.getItem("token");
// const role = localStorage.getItem("role");

// if (!token || role !== "admin") {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/admin-login.html";
// }

// async function loadTransactions() {
//   try {
//     const res = await fetch(`${API_BASE}/api/admin/transactions`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!res.ok) throw new Error("Failed to fetch transactions");

//     const transactions = await res.json();
//     const tbody = document.querySelector("#transactionsTable tbody");
//     tbody.innerHTML = "";

//     transactions.forEach((t) => {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${new Date(t.createdAt).toLocaleString()}</td>
//         <td>${t.student?.name || "N/A"}</td>
//         <td>${t.course?.title || "N/A"}</td>
//         <td>â‚¹${(t.amount / 100).toFixed(2)}</td>
//         <td>${t.status}</td>
//         <td>${
//           t.status === "paid"
//             ? `<a href="${API_BASE}/api/payments/receipt/${t._id}" target="_blank">Download</a>`
//             : "-"
//         }</td>
//       `;
//       tbody.appendChild(tr);
//     });
//   } catch (err) {
//     console.error(err);
//     alert("Could not load transactions.");
//   }
// }

// // Logout
// document.getElementById("adminLogoutBtn").addEventListener("click", () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/admin-login.html";
// });

// loadTransactions();
const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
}

async function loadTransactions() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch transactions");

    const transactions = await res.json();
    const tbody = document.querySelector("#transactionsTable tbody");
    tbody.innerHTML = "";

    transactions.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(t.createdAt).toLocaleString()}</td>
        <td>${t.student?.name || "N/A"}</td>
        <td>${t.course?.title || "N/A"}</td>
        <td>â‚¹${(t.amount / 100).toFixed(2)}</td>
        <td>${t.status}</td>
        <td>${
          t.status === "paid"
            ? `<a href="${API_BASE}/api/orders/${t._id}/receipt" target="_blank">Download</a>`
            : "-"
        }</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Could not load transactions.");
  }
}

// Logout
document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
});

loadTransactions();

