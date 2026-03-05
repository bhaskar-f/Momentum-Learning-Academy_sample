const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");

const COURSE_REQUEST_TIMEOUT_MS = 5000;
const token = localStorage.getItem("token");

// Ensure student is logged in
if (!token) {
  alert("Please login to register for a course.");
  window.location.href = "login.html";
}

async function loadCourses() {
  const container = document.getElementById("coursesContainer");
  if (!container) return;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    COURSE_REQUEST_TIMEOUT_MS
  );

  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Failed to load courses: ${res.status}`);
    }

    const courses = await res.json();
    const fragment = document.createDocumentFragment();
    container.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.classList.add("course_card");

      card.innerHTML = `
        <img src="${course.imageUrl || "placeholder.jpg"}" alt="${
        course.title
      }" class="course_img" loading="lazy" decoding="async" />
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>â‚¹${course.price / 100}</strong></p>
        <button class="course_btn" data-id="${course._id}">Register Now</button>
      `;

      fragment.appendChild(card);
    });

    container.appendChild(fragment);

    container.querySelectorAll(".course_btn").forEach((btn) => {
      btn.addEventListener("click", () => registerCourse(btn.dataset.id));
    });
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Failed to load courses", err);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function registerCourse(courseId) {
  try {
    // Step 1: create order on backend
    const res = await fetch(`${API_BASE}/api/payments/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseIds: [courseId] }),
    });

    const data = await res.json();

    if (!data.orderId) {
      alert("Failed to create order");
      return;
    }

    // Step 2: open Razorpay checkout
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "ABC Coaching",
      description: "Course Registration",
      handler: async function (response) {
        // Step 3: verify payment
        const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.ok) {
          alert("Course registered successfully! Receipt sent to your email.");
          window.location.href = "/student-dashboard.html";
        } else {
          alert("Payment verification failed.");
        }
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment failed", err);
  }
}

loadCourses();
