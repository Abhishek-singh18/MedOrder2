// js/auth.js

import { registerUser, loginUser } from "./api.js";

// Function to handle the registration process
async function handleRegistration(e) {
  e.preventDefault();
  const form = e.target;

  // Collect data from the form
  const userData = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
    role: form.role.value, // 'customer' or 'seller'
    address: form.address.value,
    phone: form.phone.value,
  };

  try {
    const result = await registerUser(userData);

    // Store JWT and user details
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.role);
    localStorage.setItem("userId", result._id);

    alert(
      `Registration Successful! Welcome, ${result.name} as a ${result.role}.`
    );
    window.location.href = "index.html"; // Redirect to home page
  } catch (error) {
    alert(error.message || "Registration failed. Please try again.");
  }
}

// Function to handle the login process
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;

  const loginData = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const result = await loginUser(loginData);

    // Store JWT and user details
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.role);
    localStorage.setItem("userId", result._id);

    alert(`Login Successful! Welcome back, ${result.name}.`);

    // Redirect based on role
    if (result.role === "seller") {
      window.location.href = "seller-dashboard.html"; // Seller specific page
    } else {
      window.location.href = "medicine-list.html"; // Customer specific page
    }
  } catch (error) {
    alert(error.message || "Login failed. Invalid credentials.");
  }
}

// Attach event listeners when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
