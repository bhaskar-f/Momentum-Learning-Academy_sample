// Preloader

// Wait for the page to fully load

// Show loader for 4 seconds
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  // Keep loader visible for 4 seconds
  // setTimeout(() => {
  loader.style.display = "none";
  content.style.display = "block";
  // }, 500); // 4000ms = 4 seconds
});

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }

  // Hero slider
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");
  const heroSection = document.getElementById("hero");
  let current = 0;
  let interval;
  let isHovering = false;

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    current = i;
  }
  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }
  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }
  function startAutoSlide() {
    interval = setInterval(nextSlide, 3000);
  }
  function stopAutoSlide() {
    clearInterval(interval);
  }

  // Track hover state
  heroSection.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  heroSection.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  leftArrow.addEventListener("click", (e) => {
    // Only allow click if hovering over hero section
    if (isHovering) {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });
  rightArrow.addEventListener("click", (e) => {
    // Only allow click if hovering over hero section
    if (isHovering) {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    }
  });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(i);
      startAutoSlide();
    })
  );
  showSlide(current);
  startAutoSlide();

  // Courses section

  // Course slider functionality
  const coursesRow = document.getElementById("coursesContainer");
  const leftArrowCourse = document.querySelector(".course_arrow.left");
  const rightArrowCourse = document.querySelector(".course_arrow.right");

  if (coursesRow) {
    const scrollAmount = 300; // Adjust scroll amount as needed

    leftArrowCourse.addEventListener("click", () => {
      coursesRow.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    rightArrowCourse.addEventListener("click", () => {
      coursesRow.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });

    // Hide arrows based on scroll position
    coursesRow.addEventListener("scroll", () => {
      const isAtStart = coursesRow.scrollLeft === 0;
      const isAtEnd =
        coursesRow.scrollLeft + coursesRow.clientWidth >=
        coursesRow.scrollWidth;

      leftArrowCourse.style.opacity = isAtStart ? "0.5" : "1";
      rightArrowCourse.style.opacity = isAtEnd ? "0.5" : "1";
    });
  }

  // Dropdown navigation functionality
  const dropdownLinks = document.querySelectorAll(
    ".dropdown-menu a[data-course]"
  );

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const courseId = link.getAttribute("data-course");
      const targetCard = document.getElementById(courseId);

      if (targetCard) {
        // Scroll to the course section first
        document.getElementById("course_section").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // After a short delay, scroll to the specific card
        setTimeout(() => {
          targetCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Add a highlight effect to the target card
          targetCard.style.transform = "scale(1.05)";
          targetCard.style.boxShadow = "0 8px 32px rgba(67, 106, 145, 0.3)";

          // Remove highlight after 2 seconds
          setTimeout(() => {
            targetCard.style.transform = "";
            targetCard.style.boxShadow = "";
          }, 2000);
        }, 500);
      }
    });
  });

  // Testimonials functionality
  const testimonials = document.querySelectorAll(".testimonial");
  const indicators = document.querySelectorAll(".indicator");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const testimonialContainer = document.querySelector(".testimonials");

  if (testimonials.length > 0) {
    let currentIndex = 0;
    let interval;

    // Function to update testimonial display
    function updateTestimonial() {
      testimonials.forEach((testimonial) =>
        testimonial.classList.remove("active")
      );
      indicators.forEach((indicator) => indicator.classList.remove("active"));

      testimonials[currentIndex].classList.add("active");
      indicators[currentIndex].classList.add("active");
    }

    // Function to move to next testimonial
    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateTestimonial();
    }

    // Function to move to previous testimonial
    function prevTestimonial() {
      currentIndex =
        (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial();
    }

    // Set up automatic cycling
    function startAutoCycle() {
      interval = setInterval(nextTestimonial, 5000); // 4s display + 1s transition = 5s total
    }

    // Initialize
    updateTestimonial();
    startAutoCycle();

    // Event listeners for controls
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        clearInterval(interval);
        nextTestimonial();
        startAutoCycle();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        clearInterval(interval);
        prevTestimonial();
        startAutoCycle();
      });
    }

    // Indicator click events
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        clearInterval(interval);
        currentIndex = index;
        updateTestimonial();
        startAutoCycle();
      });
    });

    // Pause on hover
    if (testimonialContainer) {
      testimonialContainer.addEventListener("mouseenter", () => {
        clearInterval(interval);
      });

      testimonialContainer.addEventListener("mouseleave", () => {
        startAutoCycle();
      });
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Manual Slider
  // ==========================
  const track = document.querySelector(".gallery-track");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (track && prevBtn && nextBtn) {
    let position = 0;
    const slideWidth = 270;

    nextBtn.addEventListener("click", () => {
      if (Math.abs(position) < track.scrollWidth - track.clientWidth) {
        position -= slideWidth;
        track.style.transform = `translateX(${position}px)`;
      }
    });

    prevBtn.addEventListener("click", () => {
      if (position < 0) {
        position += slideWidth;
        track.style.transform = `translateX(${position}px)`;
      }
    });
  }

  // ==========================
  // Lightbox
  // ==========================
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.style.cssText = `
    display:none; position:fixed; top:0; left:0;
    width:100%; height:100%; background:rgba(0,0,0,0.8);
    align-items:center; justify-content:center; z-index:9999;
  `;
  lightbox.innerHTML = `
    <span style="position:absolute;top:20px;right:35px;font-size:40px;color:#fff;cursor:pointer">&times;</span>
    <img id="lightbox-img" style="max-width:80%;max-height:80%;border-radius:8px;" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = lightbox.querySelector("span");

  function activateLightbox() {
    document.querySelectorAll(".gallery-img").forEach((img) => {
      img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
      });
    });
  }

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  activateLightbox();

  // ==========================
  // AJAX Load Full Gallery
  // ==========================
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const fullGallerySection = document.getElementById("full-gallery");
  const galleryContainer = document.getElementById("gallery-container");

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", () => {
      fetch("gallery-content.html")
        .then((response) => response.text())
        .then((data) => {
          galleryContainer.innerHTML = data;
          fullGallerySection.style.display = "block";
          viewMoreBtn.style.display = "none"; // hide button
          activateLightbox(); // re-attach lightbox for new images
        })
        .catch((err) => console.error("Error loading gallery:", err));
    });
  }

  // ==========================
  // Contact Form Handling
  // ==========================
  const contactForm = document.getElementById("contact-form");
  const formAlert = document.getElementById("form-alert");

  if (contactForm) {
    // Form validation
    const validateField = (field) => {
      const value = field.value.trim();
      const fieldName = field.name;
      const feedback = field.parentNode.querySelector(".form-feedback");

      // Remove existing validation classes
      field.classList.remove("is-valid", "is-invalid");
      feedback.classList.remove("valid-feedback", "invalid-feedback");
      feedback.textContent = "";

      let isValid = true;
      let message = "";

      // Required field validation
      if (field.hasAttribute("required") && !value) {
        isValid = false;
        message = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required.`;
      }
      // Email validation
      else if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = "Please enter a valid email address.";
        }
      }
      // Phone validation
      else if (field.type === "tel" && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          message = "Please enter a valid phone number.";
        }
      }

      // Apply validation styling
      if (isValid && value) {
        field.classList.add("is-valid");
        feedback.classList.add("valid-feedback");
        feedback.textContent = "Looks good!";
      } else if (!isValid) {
        field.classList.add("is-invalid");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = message;
      }

      return isValid;
    };

    // Real-time validation
    const formFields = contactForm.querySelectorAll("input, textarea, select");
    formFields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) {
          validateField(field);
        }
      });
    });

    // Form submission
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate all fields
      let isFormValid = true;
      formFields.forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
          // Reset button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;

          // Show success message
          formAlert.className = "mt-3 alert-success";
          formAlert.innerHTML =
            '<i class="fas fa-check-circle me-2"></i>Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
          formAlert.style.display = "block";

          // Reset form
          contactForm.reset();
          formFields.forEach((field) => {
            field.classList.remove("is-valid", "is-invalid");
            const feedback = field.parentNode.querySelector(".form-feedback");
            feedback.classList.remove("valid-feedback", "invalid-feedback");
            feedback.textContent = "";
          });

          // Scroll to alert
          formAlert.scrollIntoView({ behavior: "smooth", block: "center" });

          // Hide alert after 5 seconds
          setTimeout(() => {
            formAlert.style.display = "none";
          }, 5000);
        }, 2000);
      } else {
        // Show error message
        formAlert.className = "mt-3 alert-danger";
        formAlert.innerHTML =
          '<i class="fas fa-exclamation-triangle me-2"></i>Please correct the errors above and try again.';
        formAlert.style.display = "block";
        formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
});
