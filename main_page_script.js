// scripts/main_page_script.js
// Requires config.js

/* ======================
   GLOBAL STATE
====================== */
let selectedDate = localStorage.getItem("selectedDate") || "";
const userId = localStorage.getItem("userId");

/* ======================
   AUTH GUARD
====================== */
if (localStorage.getItem("loggedIn") !== "true" || !userId) {
  window.location.href = "login.html";
}

/* ======================
   TASKS
====================== */
async function addTask(priority = false) {
  if (!selectedDate) {
    alert("Please select a date first");
    return;
  }

  const inputId = priority ? "priorityText" : "taskText";
  const input = document.getElementById(inputId);
  const text = input.value.trim();

  if (!text) return;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: selectedDate,
        text,
        priority
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add task");
      return;
    }

    input.value = "";
    loadTasksForDate();
  } catch (err) {
    console.error(err);
    alert("Server error while adding task");
  }
}

/* Wrapper for High Priority Button */
function addPriorityTask() {
  addTask(true);
}

async function loadTasksForDate() {
  if (!selectedDate) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${userId}/${selectedDate}`);
    const tasks = await res.json();

    if (!res.ok || !Array.isArray(tasks)) {
      console.error("Invalid task response");
      return;
    }

    const taskList = document.getElementById("taskList");
    const priorityList = document.getElementById("priorityList");

    taskList.innerHTML = "";
    priorityList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.priority ? "⚠️ " + task.text : task.text;

      if (task.priority) {
        li.style.color = "red";
        li.style.fontWeight = "700";
      }

      li.onclick = async () => {
        try {
          const del = await fetch(`${API_BASE}/tasks/${task._id}`, {
            method: "DELETE"
          });

          if (!del.ok) {
            alert("Failed to delete task");
            return;
          }

          loadTasksForDate();
        } catch (err) {
          console.error(err);
        }
      };

      task.priority
        ? priorityList.appendChild(li)
        : taskList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

/* ======================
   NOTES
====================== */
function saveNotes() {
  const notes = document.getElementById("notesArea").value;
  localStorage.setItem(`notes-${userId}`, notes);
  alert("Notes saved");
}

/* ======================
   PROFILE
====================== */
function loadUserProfile() {
  document.getElementById("username").innerText =
    localStorage.getItem("username") || "User";

  const img = document.getElementById("profilePic");
  img.src = localStorage.getItem("profilePic") || "pictures/user.png";
  img.onerror = () => (img.src = "pictures/user.png");
}

/* ======================
   CALENDAR
====================== */
function generateCalendar() {
  const calendar = document.getElementById("calendar");
  const now = new Date();

  calendar.innerHTML = `<h3>${now.toLocaleString("default", {
    month: "long"
  })} ${now.getFullYear()}</h3>`;

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(day => {
    const header = document.createElement("div");
    header.className = "calendar-header";
    header.innerText = day;
    grid.appendChild(header);
  });

  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).getDay();

  const totalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.innerText = day;

    const dateISO = new Date(
      now.getFullYear(),
      now.getMonth(),
      day
    ).toISOString().split("T")[0];

    if (dateISO === selectedDate) {
      cell.classList.add("active");
    }

    cell.onclick = () => {
      selectedDate = dateISO;
      localStorage.setItem("selectedDate", selectedDate);

      document
        .querySelectorAll(".calendar-day")
        .forEach(d => d.classList.remove("active"));

      cell.classList.add("active");
      loadTasksForDate();
    };

    grid.appendChild(cell);
  }

  calendar.appendChild(grid);

  if (selectedDate) loadTasksForDate();
}

/* ======================
   LOGOUT
====================== */
function logoutUser() {
  localStorage.clear();
  window.location.href = "first_page.html";
}

/* ======================
   INIT
====================== */
window.onload = () => {
  loadUserProfile();
  generateCalendar();

  const savedNotes = localStorage.getItem(`notes-${userId}`);
  if (savedNotes) {
    document.getElementById("notesArea").value = savedNotes;
  }
};
