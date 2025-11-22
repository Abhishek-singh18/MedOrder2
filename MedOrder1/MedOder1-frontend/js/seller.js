// js/seller.js

import { authenticatedFetch } from "./api.js"; // Assuming you expose authenticatedFetch

// --- Inventory Management ---
async function getSellerInventory() {
  // Reuse getMedicines API (may need filtering logic on backend for seller's own items)
  // For now, let's assume we use a dedicated seller endpoint or filter locally if needed
  try {
    const medicines = await authenticatedFetch("/medicines", "GET");

    // Filter: Since the /medicines route is public, let's filter the results by the logged-in seller
    const sellerId = localStorage.getItem("userId");
    const sellerMedicines = medicines.filter(
      (med) => med.seller._id === sellerId
    );

    // Render seller inventory table here...
  } catch (error) {
    console.error("Failed to load inventory:", error);
  }
}

// --- Order Management ---
async function displaySellerOrders() {
  const container = document.getElementById("seller-orders-list");
  try {
    const orders = await authenticatedFetch("/orders/seller", "GET");
    container.innerHTML = ""; // Clear previous content

    if (orders.length === 0) {
      container.innerHTML =
        '<p class="alert alert-info">No new orders to fulfill.</p>';
      return;
    }

    // Render table of orders, including customer address, items, and status control
    let tableHTML = `<table class="order-table"><thead>...</thead><tbody>`;
    orders.forEach((order) => {
      // Example rendering logic
      tableHTML += `<tr>
                 <td>${order._id.substring(20)}</td>
                 <td>${order.customer.name}</td>
                 <td>${order.shippingAddress.address}</td>
                 <td>${order.totalAmount.toFixed(2)}</td>
                 <td>${order.deliveryStatus}</td>
                 <td><button class="btn btn-sm assign-rider" data-order-id="${
                   order._id
                 }">Assign Rider</button></td>
             </tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
  } catch (error) {
    container.innerHTML = `<p class="alert alert-danger">Failed to load orders: ${error.message}</p>`;
  }
}

// ... (DOM loaded listeners for tabs, inventory, and order list) ...
