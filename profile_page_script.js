// ====== AUTH GUARD ======
const userId = localStorage.getItem("userId");

if (!userId || localStorage.getItem("loggedIn") !== "true") {
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
}

// ====== LOAD PROFILE ======
window.onload = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load profile");
      return;
    }

    // Inputs
    document.getElementById("fullName").value = data.name || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("username").value = data.username || "";

    // Header display
    document.querySelector(".profile-name").innerText = data.name || "User";
    document.querySelector(".email").innerHTML =
      `<i class="fa-solid fa-envelope"></i> ${data.email || ""}`;

    // Profile image
    const profilePic = document.querySelector(".profile-picture");
    profilePic.src = data.profilePhoto || "pictures/user.png";
    profilePic.onerror = () => (profilePic.src = "pictures/user.png");

  } catch (err) {
    console.error(err);
    alert("Server error while loading profile");
  }
};
// ====== SAVE PROFILE ======
async function saveProfile() {
  const profilePic = document.querySelector(".profile-picture");

  const body = {
    name: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    username: document.getElementById("username").value.trim()
  };

  // ONLY send image if user selected a new one
  if (profilePic.src.startsWith("data:image")) {
    body.profilePhoto = profilePic.src;
  }

  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Profile update failed");
      return;
    }

    // Update cache & UI
    localStorage.setItem("username", data.user.username);
    if (data.user.profilePhoto) {
      localStorage.setItem("profilePic", data.user.profilePhoto);
    }

    document.querySelector(".profile-name").innerText = data.user.name;
    document.querySelector(".email").innerHTML =
      `<i class="fa-solid fa-envelope"></i> ${data.user.email}`;

    alert("Profile updated successfully!");

  } catch (err) {
    console.error(err);
    alert("Server error while updating profile");
  }
}

// ====== PHOTO UPLOAD ======
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("photoInput");
  const img = document.querySelector(".profile-picture");

  if (!input || !img) return;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      alert("Photo selected. Click SAVE to apply.");
    };
    reader.readAsDataURL(file);
  });
});
