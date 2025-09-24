const API_BASE = "http://localhost:3000";

document
  .getElementById("adminLoginForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      window.location.href = "admin-dashboard.html";
    } else {
      alert(data.message || "Admin login failed");
    }
  });
