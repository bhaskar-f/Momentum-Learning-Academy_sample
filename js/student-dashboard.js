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

// Authentication check
if (!token || role !== "student") {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login.html";
});

// API helper
async function api(url, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Load student data
async function loadMe() {
  try {
    const me = await api("/api/student/me");
    console.log("Student API response:", me);
    document.getElementById("stuName").textContent = me.name;

    // Courses
    const coursesEl = document.getElementById("myCourses");
    coursesEl.innerHTML = "";
    (me.courses || []).forEach((c) => {
      const d = document.createElement("div");
      d.className = "course-card";
      d.innerHTML = `
        <strong>${c.title}</strong>
        <div class="small-muted">â‚¹${(c.price / 100).toFixed(2)}</div>
      `;
      coursesEl.appendChild(d);
    });

    // Transactions
    const tb = document.querySelector("#transactionsTable tbody");
    tb.innerHTML = "";
    (me.transactions || []).forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(t.createdAt).toLocaleString()}</td>
        <td>${t.courseTitle}</td>
        <td>â‚¹${(t.amount / 100).toFixed(2)}</td>
        <td>${t.status}</td>
        <td>
          ${
            t.status === "paid"
              ? `
                <a href="#" onclick="downloadReceipt('${t._id}')">Download</a>
                | <a href="#" onclick="resendReceipt('${t._id}')">Resend Email</a>
              `
              : "-"
          }
        </td>`;
      tb.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load student data:", err);
    const card = document.querySelector(".card");
    const errBox = document.createElement("div");
    errBox.className = "error-box";
    errBox.textContent = "âš ï¸ Could not load your data. Please refresh.";
    card.prepend(errBox);
  }
}

// Receipt download
async function downloadReceipt(orderId) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      alert("Receipt not available");
    }
  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
}

// Resend function
async function resendReceipt(orderId) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/resend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Receipt email resent successfully!");
    } else {
      alert(data.message || "Failed to resend receipt.");
    }
  } catch (err) {
    console.error(err);
    alert("Error resending receipt.");
  }
}

loadMe();

