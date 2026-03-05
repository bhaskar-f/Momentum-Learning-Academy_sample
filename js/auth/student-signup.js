const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mobile, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("âœ… Signup successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert("âŒ Signup failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("âš ï¸ Could not reach server.");
  }
});

