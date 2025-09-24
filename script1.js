const courses = document.getElementById("courses");
const leftArrow = document.querySelector(".course_arrow.left");
const rightArrow = document.querySelector(".course_arrow.right");

const scrollAmount = 300; // adjust as needed

leftArrow.addEventListener("click", () => {
  courses.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

rightArrow.addEventListener("click", () => {
  courses.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

// Optional: adjust opacity
courses.addEventListener("scroll", () => {
  leftArrow.style.opacity = courses.scrollLeft === 0 ? "0.5" : "1";
  rightArrow.style.opacity =
    courses.scrollLeft + courses.clientWidth >= courses.scrollWidth
      ? "0.5"
      : "1";
});
