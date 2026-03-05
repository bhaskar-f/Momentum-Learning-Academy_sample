// const API_BASE = "http://localhost:3000";
// const token = localStorage.getItem("token");
// const role = localStorage.getItem("role");

// if (!token || role !== "admin") {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/admin-login.html";
// }

// async function loadReports() {
//   try {
//     const res = await fetch(`${API_BASE}/api/admin/reports`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) throw new Error("Failed to fetch reports");
//     const data = await res.json();

//     // Revenue chart
//     new Chart(document.getElementById("revenueChart"), {
//       type: "line",
//       data: {
//         labels: data.revenue.labels,
//         datasets: [
//           {
//             label: "Revenue (â‚¹)",
//             data: data.revenue.values,
//             borderColor: "#003161",
//             fill: false,
//           },
//         ],
//       },
//     });

//     // Course popularity chart
//     new Chart(document.getElementById("courseChart"), {
//       type: "bar",
//       data: {
//         labels: data.courses.labels,
//         datasets: [
//           {
//             label: "Enrollments",
//             data: data.courses.values,
//             backgroundColor: "#007bff",
//           },
//         ],
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     alert("Could not load reports.");
//   }
// }

// // Logout
// document.getElementById("adminLogoutBtn").addEventListener("click", () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/admin-login.html";
// });

// loadReports();
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

async function loadReports() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch reports");
    const data = await res.json();

    // Revenue chart
    new Chart(document.getElementById("revenueChart"), {
      type: "line",
      data: {
        labels: data.revenue.labels,
        datasets: [
          {
            label: "Revenue (â‚¹)",
            data: data.revenue.values,
            borderColor: "#003161",
            backgroundColor: "rgba(0, 49, 97, 0.1)",
            fill: true,
          },
        ],
      },
    });

    // Course popularity chart
    new Chart(document.getElementById("courseChart"), {
      type: "bar",
      data: {
        labels: data.courses.labels,
        datasets: [
          {
            label: "Enrollments",
            data: data.courses.values,
            backgroundColor: "#007bff",
          },
        ],
      },
    });
  } catch (err) {
    console.error(err);
    alert("Could not load reports.");
  }
}

// Logout
document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/admin-login.html";
});

loadReports();

