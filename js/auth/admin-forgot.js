const API_BASE = "http://localhost:3000";

document
  .getElementById("adminForgotForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    const res = await fetch(`${API_BASE}/api/admin/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Reset link sent to your admin email.");
      window.location.href = "admin-login.html";
    } else {
      alert(data.message || "Failed to send reset link");
    }
  });
