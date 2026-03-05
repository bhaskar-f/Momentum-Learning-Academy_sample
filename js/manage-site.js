const API_BASE =
  (localStorage.getItem("API_BASE_URL") ||
    ((window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : ""))
  .trim()
  .replace(/\/+$/, "");
const token = localStorage.getItem("token");

// Authentication check
if (!token || localStorage.getItem("role") !== "admin") {
  window.location.href = "/admin-login.html";
}

// Tab switching functionality
document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    document
      .querySelectorAll(".panel")
      .forEach((p) => (p.style.display = "none"));
    document.getElementById("panel-" + t.dataset.tab).style.display = "block";
  });
});

// Helper: call API with auth
async function api(url, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers["Authorization"] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (multipart/form-data)
  if (!opts.headers["Content-Type"] && !(opts.body instanceof FormData)) {
    opts.headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${url}`, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "API error");
  }
  return res.json();
}

// Upload helper - posts to /api/admin/upload with FormData {file} => returns {url}
async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

/* ---------- Courses CRUD ---------- */
let editingCourseId = null;

async function loadCourses() {
  try {
    const data = await api("/api/admin/courses", { method: "GET" });
    const tbody = document.querySelector("#coursesList tbody");
    tbody.innerHTML = "";

    data.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.title}</td><td>${(c.price / 100).toFixed(2)}</td>
        <td>
          <button class="btn-sm" onclick="editCourse('${c._id}')">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteCourse('${
            c._id
          }')">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load courses:", err);
    alert("Failed to load courses");
  }
}

window.editCourse = async (id) => {
  try {
    const c = await api("/api/admin/courses/" + id);
    document.getElementById("courseTitle").value = c.title;
    document.getElementById("courseDesc").value = c.description || "";
    document.getElementById("coursePrice").value = c.price / 100;
    editingCourseId = c._id;
    document.getElementById("courseFormTitle").textContent = "Edit Course";
  } catch (err) {
    console.error("Failed to load course:", err);
    alert("Failed to load course details");
  }
};

document.getElementById("resetCourseBtn").addEventListener("click", () => {
  editingCourseId = null;
  document.getElementById("courseFormTitle").textContent = "Add Course";
  document.getElementById("courseTitle").value = "";
  document.getElementById("courseDesc").value = "";
  document.getElementById("coursePrice").value = "";
  document.getElementById("courseImage").value = "";
});

document.getElementById("saveCourseBtn").addEventListener("click", async () => {
  try {
    const title = document.getElementById("courseTitle").value.trim();
    const description = document.getElementById("courseDesc").value.trim();
    const price = Math.round(
      parseFloat(document.getElementById("coursePrice").value || 0) * 100
    );
    const file = document.getElementById("courseImage").files[0];

    if (!title) {
      alert("Please enter a course title");
      return;
    }

    let imageUrl = null;
    if (file) {
      const u = await uploadFile(file);
      imageUrl = u.url || u.data?.url || null;
    }

    if (editingCourseId) {
      await api(`/api/admin/courses/${editingCourseId}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, price, imageUrl }),
      });
      editingCourseId = null;
      document.getElementById("courseFormTitle").textContent = "Add Course";
    } else {
      await api("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify({ title, description, price, imageUrl }),
      });
    }

    await loadCourses();
    document.getElementById("courseTitle").value = "";
    document.getElementById("courseDesc").value = "";
    document.getElementById("coursePrice").value = "";
    document.getElementById("courseImage").value = "";
    alert("Course saved successfully");
  } catch (err) {
    console.error("Failed to save course:", err);
    alert("Save failed: " + err.message);
  }
});

window.deleteCourse = async (id) => {
  if (!confirm("Are you sure you want to delete this course?")) return;

  try {
    await api(`/api/admin/courses/${id}`, { method: "DELETE" });
    await loadCourses();
    alert("Course deleted successfully");
  } catch (err) {
    console.error("Failed to delete course:", err);
    alert("Delete failed: " + err.message);
  }
};

/* ---------- Events CRUD ---------- */
let editingEventId = null;

async function loadEvents() {
  try {
    const data = await api("/api/admin/events", { method: "GET" });
    const tbody = document.querySelector("#eventsList tbody");
    tbody.innerHTML = "";

    data.forEach((ev) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${ev.title}</td><td>${new Date(
        ev.date
      ).toLocaleDateString()}</td>
        <td>
          <button class="btn-sm" onclick="editEvent('${ev._id}')">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteEvent('${
            ev._id
          }')">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load events:", err);
    alert("Failed to load events");
  }
}

window.editEvent = async (id) => {
  try {
    const e = await api("/api/admin/events/" + id);
    document.getElementById("eventTitle").value = e.title;
    document.getElementById("eventDate").value = e.date
      ? e.date.split("T")[0]
      : "";
    document.getElementById("eventDesc").value = e.description || "";
    editingEventId = id;
    document.getElementById("eventFormTitle").textContent = "Edit Event";
  } catch (err) {
    console.error("Failed to load event:", err);
    alert("Failed to load event details");
  }
};

document.getElementById("resetEventBtn").addEventListener("click", () => {
  editingEventId = null;
  document.getElementById("eventFormTitle").textContent = "Add Event";
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventDesc").value = "";
});

document.getElementById("saveEventBtn").addEventListener("click", async () => {
  try {
    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDesc").value.trim();

    if (!title || !date) {
      alert("Please enter both title and date");
      return;
    }

    if (editingEventId) {
      await api(`/api/admin/events/${editingEventId}`, {
        method: "PUT",
        body: JSON.stringify({ title, date, description }),
      });
      editingEventId = null;
      document.getElementById("eventFormTitle").textContent = "Add Event";
    } else {
      await api("/api/admin/events", {
        method: "POST",
        body: JSON.stringify({ title, date, description }),
      });
    }

    await loadEvents();
    alert("Event saved successfully");
  } catch (err) {
    console.error("Failed to save event:", err);
    alert("Event save failed: " + err.message);
  }
});

window.deleteEvent = async (id) => {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    await api(`/api/admin/events/${id}`, { method: "DELETE" });
    await loadEvents();
    alert("Event deleted successfully");
  } catch (err) {
    console.error("Failed to delete event:", err);
    alert("Delete failed: " + err.message);
  }
};

/* ---------- Testimonials CRUD ---------- */
let editingTestId = null;

async function loadTestimonials() {
  try {
    const data = await api("/api/admin/testimonials", { method: "GET" });
    const tbody = document.querySelector("#testimonialsList tbody");
    tbody.innerHTML = "";

    data.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${t.author}</td><td>${t.text.substring(0, 50)}${
        t.text.length > 50 ? "..." : ""
      }</td>
        <td>
          <button class="btn-sm" onclick="editTest('${t._id}')">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteTest('${
            t._id
          }')">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    alert("Failed to load testimonials");
  }
}

window.editTest = async (id) => {
  try {
    const t = await api("/api/admin/testimonials/" + id);
    document.getElementById("testAuthor").value = t.author;
    document.getElementById("testText").value = t.text;
    editingTestId = id;
    document.getElementById("testimonialFormTitle").textContent =
      "Edit Testimonial";
  } catch (err) {
    console.error("Failed to load testimonial:", err);
    alert("Failed to load testimonial details");
  }
};

document.getElementById("resetTestBtn").addEventListener("click", () => {
  editingTestId = null;
  document.getElementById("testimonialFormTitle").textContent =
    "Add Testimonial";
  document.getElementById("testAuthor").value = "";
  document.getElementById("testText").value = "";
  document.getElementById("testImage").value = "";
});

document.getElementById("saveTestBtn").addEventListener("click", async () => {
  try {
    const author = document.getElementById("testAuthor").value.trim();
    const text = document.getElementById("testText").value.trim();
    const file = document.getElementById("testImage").files[0];

    if (!author || !text) {
      alert("Please enter both author name and testimonial text");
      return;
    }

    let imageUrl = null;
    if (file) {
      const u = await uploadFile(file);
      imageUrl = u.url || u.data?.url || null;
    }

    if (editingTestId) {
      await api(`/api/admin/testimonials/${editingTestId}`, {
        method: "PUT",
        body: JSON.stringify({ author, text, imageUrl }),
      });
      editingTestId = null;
      document.getElementById("testimonialFormTitle").textContent =
        "Add Testimonial";
    } else {
      await api("/api/admin/testimonials", {
        method: "POST",
        body: JSON.stringify({ author, text, imageUrl }),
      });
    }

    await loadTestimonials();
    alert("Testimonial saved successfully");
  } catch (err) {
    console.error("Failed to save testimonial:", err);
    alert("Save failed: " + err.message);
  }
});

window.deleteTest = async (id) => {
  if (!confirm("Are you sure you want to delete this testimonial?")) return;

  try {
    await api(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    await loadTestimonials();
    alert("Testimonial deleted successfully");
  } catch (err) {
    console.error("Failed to delete testimonial:", err);
    alert("Delete failed: " + err.message);
  }
};

/* ---------- Hero ---------- */
async function loadHero() {
  try {
    const h = await api("/api/admin/hero", { method: "GET" });
    const el = document.getElementById("currentHero");

    if (h && h.imageUrl) {
      el.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
                        <img src="${
                          h.imageUrl
                        }" style="height:64px;border-radius:6px">
                        <div>
                          <strong>${h.title || ""}</strong>
                          <div class="small-muted">${h.subtitle || ""}</div>
                        </div>
                      </div>`;
      document.getElementById("heroTitle").value = h.title || "";
      document.getElementById("heroSub").value = h.subtitle || "";
    } else {
      el.innerHTML = '<div class="small-muted">No hero content set</div>';
    }
  } catch (err) {
    console.error("Failed to load hero content:", err);
  }
}

document.getElementById("saveHeroBtn").addEventListener("click", async () => {
  try {
    const title = document.getElementById("heroTitle").value.trim();
    const subtitle = document.getElementById("heroSub").value.trim();
    const file = document.getElementById("heroImage").files[0];

    let imageUrl = null;
    if (file) {
      const u = await uploadFile(file);
      imageUrl = u.url || u.data?.url || null;
    }

    await api("/api/admin/hero", {
      method: "POST",
      body: JSON.stringify({ title, subtitle, imageUrl }),
    });

    await loadHero();
    alert("Hero content saved successfully");
  } catch (err) {
    console.error("Failed to save hero content:", err);
    alert("Hero save failed: " + err.message);
  }
});

/* ---------- Gallery ---------- */
async function loadGallery() {
  try {
    const data = await api("/api/admin/gallery", { method: "GET" });
    const tbody = document.querySelector("#galleryList tbody");
    tbody.innerHTML = "";

    data.forEach((g) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><img src="${g.imageUrl}" style="height:48px;border-radius:6px"/></td>
        <td><button class="btn-sm btn-danger" onclick="deleteGallery('${g._id}')">Delete</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load gallery:", err);
    alert("Failed to load gallery");
  }
}

document
  .getElementById("uploadGalleryBtn")
  .addEventListener("click", async () => {
    try {
      const files = document.getElementById("galleryImage").files;
      if (!files.length) {
        alert("Please select at least one image");
        return;
      }

      for (const f of files) {
        const u = await uploadFile(f);
        // create gallery item
        await api("/api/admin/gallery", {
          method: "POST",
          body: JSON.stringify({ imageUrl: u.url || u.data?.url }),
        });
      }

      await loadGallery();
      alert("Images uploaded successfully");
    } catch (err) {
      console.error("Failed to upload images:", err);
      alert("Upload failed: " + err.message);
    }
  });

window.deleteGallery = async (id) => {
  if (!confirm("Are you sure you want to delete this image?")) return;

  try {
    await api(`/api/admin/gallery/${id}`, { method: "DELETE" });
    await loadGallery();
    alert("Image deleted successfully");
  } catch (err) {
    console.error("Failed to delete image:", err);
    alert("Delete failed: " + err.message);
  }
};

/* Initialize all data on page load */
(async () => {
  try {
    await Promise.all([
      loadCourses(),
      loadEvents(),
      loadTestimonials(),
      loadHero(),
      loadGallery(),
    ]);
  } catch (err) {
    console.error("Failed to initialize page:", err);
    alert("Failed to load page data");
  }
})();

