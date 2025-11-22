// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  document.getElementById("logout-btn").addEventListener("click", logout);
});

// Function to check if user is logged in and update the navbar
function updateNav() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const navAuth = document.getElementById("nav-auth");
  const navProfile = document.getElementById("nav-profile");
  const navHistory = document.getElementById("nav-history");
  const logoutBtn = document.getElementById("logout-btn");

  if (token) {
    navAuth.style.display = "none";
    navProfile.style.display = "inline";
    navHistory.style.display = "inline";
    logoutBtn.style.display = "inline";

    // Optional: Hide/Show role-specific links (e.g., Seller Dashboard)
    // if (userRole === 'seller') { ... }
  } else {
    navAuth.style.display = "inline";
    navProfile.style.display = "none";
    navHistory.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// Function to handle logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  // Clear cart or other local data if necessary

  updateNav();
  window.location.href = "index.html"; // Redirect to home page
}

// Utility function to navigate between pages (can be used for better routing later)
function navigate(path) {
  window.location.href = path;
}
