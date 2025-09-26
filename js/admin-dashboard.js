const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Authentication check
if (!token || role !== "admin") {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
});

// Load stats and students
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

    if (!sRes.ok || !oRes.ok) throw new Error("Failed to fetch data");

    const students = await sRes.json();
    const ordersStats = await oRes.json();

    // Stats
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalRevenue").textContent =
      ordersStats.totalRevenue
        ? (ordersStats.totalRevenue / 100).toFixed(2)
        : "0.00";
    document.getElementById("recentRegs").textContent =
      ordersStats.recentRegistrations || 0;

    // Students table
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";
    students.slice(0, 12).forEach((u) => {
      const courses = (u.courses || []).map((c) => c.title).join(", ");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${courses}</td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-outline" onclick="viewStudent('${
            u._id
          }')">View</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Stats load failed", err);
    alert("Failed to load dashboard data.");
  }
}

function viewStudent(id) {
  window.location.href = `/manage-site.html?viewStudent=${id}`;
}

fetchStats();
