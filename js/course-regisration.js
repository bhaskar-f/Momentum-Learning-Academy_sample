const API_BASE = "http://localhost:3000"; // backend URL
const token = localStorage.getItem("token");

// Ensure student is logged in
if (!token) {
  alert("Please login to register for a course.");
  window.location.href = "login.html";
}

async function loadCourses() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    const courses = await res.json();

    const container = document.getElementById("coursesContainer");
    container.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.classList.add("course_card");

      card.innerHTML = `
        <img src="${course.imageUrl || "placeholder.jpg"}" alt="${
        course.title
      }" class="course_img" />
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>₹${course.price / 100}</strong></p>
        <button class="course_btn" data-id="${course._id}">Register Now</button>
      `;

      container.appendChild(card);
    });

    document.querySelectorAll(".course_btn").forEach((btn) => {
      btn.addEventListener("click", () => registerCourse(btn.dataset.id));
    });
  } catch (err) {
    console.error("Failed to load courses", err);
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
