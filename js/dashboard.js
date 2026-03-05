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

if (!token) {
  window.location.href = "/login.html";
}

// Student Dashboard

// Authentication check
if (!token || role !== "student") {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login.html";
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
});

// API helper function
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
    document.getElementById("stuName").textContent = me.name;

    // Render courses
    const coursesEl = document.getElementById("myCourses");
    coursesEl.innerHTML = "";
    (me.courses || []).forEach((c) => {
      const d = document.createElement("div");
      d.className = "course-card";
      d.innerHTML = `<strong>${c.title}</strong><div class="small-muted">â‚¹${(
        c.price / 100
      ).toFixed(2)}</div>`;
      coursesEl.appendChild(d);
    });

    // Render transactions
    const tb = document.querySelector("#txTable tbody");
    tb.innerHTML = "";
    (me.transactions || []).forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${new Date(t.createdAt).toLocaleString()}</td>
                      <td>${t.courseTitle}</td>
                      <td>â‚¹${(t.amount / 100).toFixed(2)}</td>
                      <td>${t.status}</td>
                      <td>${
                        t.status === "paid"
                          ? `<a href="#" onclick="downloadReceipt('${t._id}')">Download</a>`
                          : "-"
                      }</td>`;
      tb.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load student data:", err);
    alert("Failed to load your data. Please try again.");
  }
}

// Download receipt function
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
      const j = await res.json();
      alert(j.message || "Receipt not available");
    }
  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
}

// Initialize the dashboard
loadMe();
// Admin Dashboard

// Authentication check
if (!token || role !== "admin") {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
}

// Fetch dashboard statistics and student data
async function fetchStats() {
  try {
    const [sRes, oRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/api/admin/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!sRes.ok || !oRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const students = await sRes.json();
    const ordersStats = await oRes.json();

    // Update statistics
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalRevenue").textContent =
      ordersStats.totalRevenue
        ? (ordersStats.totalRevenue / 100).toFixed(2)
        : "0.00";
    document.getElementById("recentRegs").textContent =
      ordersStats.recentRegistrations || 0;

    // Update student table
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";

    students.slice(0, 12).forEach((u) => {
      const courses = (u.courses || []).map((c) => c.title).join(", ");
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${u.name}</td>
                      <td>${u.email}</td>
                      <td>${courses}</td>
                      <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                      <td><button class="btn btn-outline" onclick="viewStudent('${
                        u._id
                      }')">View</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Stats load failed", err);
    alert("Failed to load dashboard data. Please try again.");
  }
}

// Navigate to student detail view
function viewStudent(id) {
  window.location.href = `/manage-site.html?viewStudent=${id}`;
}

// Initialize dashboard
fetchStats();
// Admin logout
document.getElementById("adminLogoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
});

// transaction account
data.transactions.forEach((t) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${new Date(t.date).toLocaleDateString()}</td>
    <td>${t.courseTitle}</td>
    <td>â‚¹${t.amount / 100}</td>
    <td>${t.status}</td>
    <td>
      ${
        t.status === "paid"
          ? `<a href="${API_BASE}/api/payments/receipt/${t.id}" target="_blank" class="btn btn-primary btn-sm">Download</a>`
          : "â€”"
      }
    </td>
  `;
  tbody.appendChild(row);
});

