const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");
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

