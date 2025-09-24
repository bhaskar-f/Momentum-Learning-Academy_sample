const API_BASE = "http://localhost:3000";

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
