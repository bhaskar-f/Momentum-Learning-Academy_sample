const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");
async function loadHomeCourses() {
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
        <a href="/course-registration.html" class="course_btn">Learn More</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load courses", err);
  }
}

loadHomeCourses();

