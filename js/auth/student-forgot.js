const API_BASE = "http://localhost:3000";

document
  .getElementById("studentForgotForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("studentEmail").value;

    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Password reset link sent! Check your email.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Failed to send reset link");
    }
  });
