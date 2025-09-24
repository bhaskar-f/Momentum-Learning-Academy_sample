const API_BASE = "http://localhost:3000";

document
  .getElementById("resetPasswordForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");

    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Password reset successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Failed to reset password");
    }
  });
