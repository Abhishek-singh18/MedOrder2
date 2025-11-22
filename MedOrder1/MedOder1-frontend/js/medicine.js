// js/medicine.js

import { getMedicines } from "./api.js";
import { addToCart } from "./cart.js";
import { getCurrentUser } from "./auth.js"; // Assume you add a utility in auth.js to get role/id

// Function to render a single medicine card HTML
function renderMedicineCard(medicine) {
  return `
        <div class="medicine-card">
            <img src="${medicine.imageUrl}" alt="${medicine.name}">
            <div class="card-content">
                <h4>${medicine.name}</h4>
                <p>${medicine.description.substring(0, 70)}...</p>
                <div class="price">$${medicine.price.toFixed(2)}</div>
                <p><small>Stock: ${medicine.stockQuantity}</small></p>
                <button 
                    class="add-to-cart-btn" 
                    data-id="${medicine._id}"
                    data-name="${medicine.name}"
                    data-price="${medicine.price}"
                    data-seller-id="${medicine.seller._id}"
                    ${medicine.stockQuantity === 0 ? "disabled" : ""}
                >
                    ${
                      medicine.stockQuantity > 0
                        ? "Add to Cart"
                        : "Out of Stock"
                    }
                </button>
            </div>
        </div>
    `;
}

// Main function to fetch and display medicines
async function displayMedicines(keyword = "") {
  const grid = document.getElementById("medicine-list-grid");
  grid.innerHTML = '<p id="loading-message">Loading medicines...</p>';

  try {
    const medicines = await getMedicines(keyword);
    grid.innerHTML = ""; // Clear loading message

    if (medicines.length === 0) {
      grid.innerHTML =
        "<p>No medicines found matching your search criteria.</p>";
      return;
    }

    medicines.forEach((medicine) => {
      grid.innerHTML += renderMedicineCard(medicine);
    });

    // Add event listeners to all 'Add to Cart' buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const { id, name, price, sellerId } = e.currentTarget.dataset;
        const imageUrl =
          e.currentTarget.parentElement.parentElement.querySelector("img").src;

        // Ensure only Customers can add to cart
        if (localStorage.getItem("role") !== "customer") {
          alert("Please login as a Customer to place an order.");
          return;
        }

        addToCart(id, name, parseFloat(price), sellerId, imageUrl);
      });
    });
  } catch (error) {
    grid.innerHTML = `<p style="color: red;">Failed to load medicines: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initial load
  if (document.getElementById("medicine-list-grid")) {
    displayMedicines();

    // Setup search/filter listener
    document
      .getElementById("apply-filter-btn")
      .addEventListener("click", () => {
        const keyword = document.getElementById("search-input").value;
        // For simplicity, only using keyword search here. Filter logic can be added later.
        displayMedicines(keyword);
      });
  }
});

export { displayMedicines };
