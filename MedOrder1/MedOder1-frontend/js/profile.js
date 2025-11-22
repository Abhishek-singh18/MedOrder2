document.addEventListener("DOMContentLoaded", () => {
  const userNameElement = document.getElementById("user-name");
  const userEmailElement = document.getElementById("user-email");
  const userRoleElement = document.getElementById("user-role");
  const roleSpecificContent = document.getElementById("role-specific-content");
  const logoutBtn = document.getElementById("logout-btn");

  // 1. Function to fetch and display user data
  const fetchUserProfile = async () => {
    // Get the token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, redirect to login page
      alert("You must be logged in to view this page.");
      window.location.href = "/login.html"; // Adjust this path if needed
      return;
    }

    try {
      // Make an authenticated request to the backend profile API
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Pass the token using the Bearer scheme
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle 401 (Unauthorized) or 403 (Forbidden) errors
        if (response.status === 401) {
          throw new Error("Session expired or invalid token.");
        }
        throw new Error("Failed to fetch profile data.");
      }

      const userData = await response.json();

      // 2. Populate the HTML elements
      userNameElement.textContent = userData.name || "N/A";
      userEmailElement.textContent = userData.email || "N/A";
      userRoleElement.textContent = userData.role || "customer";

      // 3. Display role-specific content
      if (userData.role === "seller") {
        roleSpecificContent.innerHTML = `
                    <p class="role-message">
                        <i class="fas fa-store"></i> You are a **Seller**.
                    </p>
                    <button class="btn btn-primary">Manage Inventory</button>
                `;
      } else if (userData.role === "rider") {
        roleSpecificContent.innerHTML = `
                    <p class="role-message">
                        <i class="fas fa-biking"></i> You are a **Rider**.
                    </p>
                    <button class="btn btn-primary">View New Orders</button>
                `;
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      // Clear token and redirect on critical error
      localStorage.removeItem("token");
      alert(`Error: ${error.message}. Redirecting to login.`);
      window.location.href = "/login.html";
    }
  };

  // 4. Logout Functionality
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "/login.html"; // Adjust this path
  });

  // Run the main function
  fetchUserProfile();
});
