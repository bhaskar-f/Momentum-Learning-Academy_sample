const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");

const COURSE_REQUEST_TIMEOUT_MS = 4000;

function buildCourseCard(course) {
  const card = document.createElement("div");
  card.classList.add("course_card");
  card.innerHTML = `
    <img src="${course.imageUrl || "placeholder.jpg"}" alt="${
    course.title
  }" class="course_img" loading="lazy" decoding="async" />
    <h3>${course.title}</h3>
    <p>${course.description || ""}</p>
    <a href="/course-registration.html" class="course_btn">Learn More</a>
  `;
  return card;
}

async function loadHomeCourses() {
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
    if (!res.ok) throw new Error(`Failed to load courses: ${res.status}`);

    const courses = await res.json();
    if (!Array.isArray(courses) || courses.length === 0) return;

    const fragment = document.createDocumentFragment();
    courses.forEach((course) => {
      fragment.appendChild(buildCourseCard(course));
    });

    container.replaceChildren(fragment);
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Failed to load courses", err);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function scheduleCourseLoad() {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => void loadHomeCourses(), { timeout: 1500 });
    return;
  }
  window.setTimeout(() => void loadHomeCourses(), 0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleCourseLoad, {
    once: true,
  });
} else {
  scheduleCourseLoad();
}
