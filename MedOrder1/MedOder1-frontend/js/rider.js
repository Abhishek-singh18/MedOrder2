// js/rider.js

import { authenticatedFetch } from "./api.js";

// We need a backend endpoint for riders to fetch their assigned orders (Not fully implemented yet, but assumed)
async function getRiderAssignedOrders() {
  // NOTE: This endpoint needs to be implemented in the backend (e.g., /api/orders/rider/myassignments)
  // The backend would search Order collection where rider == req.user._id
  return authenticatedFetch(`/orders/rider/myassignments`, "GET");
}

async function handleStatusUpdate(orderId, newStatus) {
  try {
    await authenticatedFetch(`/orders/${orderId}/status`, "PUT", {
      status: newStatus,
    });
    alert(`Order ${orderId.substring(20)} status updated to ${newStatus}.`);
    displayRiderDeliveries(); // Refresh the list
  } catch (error) {
    alert(`Failed to update status: ${error.message}`);
  }
}

async function displayRiderDeliveries() {
  const container = document.getElementById("rider-deliveries-list");
  if (localStorage.getItem("role") !== "rider") {
    container.innerHTML =
      '<p class="alert alert-warning">Please login as a Rider.</p>';
    return;
  }

  try {
    // Mock data since the backend endpoint is not fully built
    const deliveries = [
      {
        _id: "mock-order-1",
        deliveryStatus: "Processing",
        shippingAddress: { address: "123 Main St" },
      },
      {
        _id: "mock-order-2",
        deliveryStatus: "Out For Delivery",
        shippingAddress: { address: "456 Oak Ave" },
      },
    ]; // Replace with actual API call: const deliveries = await getRiderAssignedOrders();

    // Render list of deliveries with status buttons
    let listHTML = "";
    deliveries.forEach((order) => {
      listHTML += `
                <div class="card" style="margin-bottom: 1rem; padding: 15px; background: white;">
                    <h4>Order ID: ${order._id.substring(20)}</h4>
                    <p>Address: ${order.shippingAddress.address}</p>
                    <p>Status: <strong>${order.deliveryStatus}</strong></p>
                    <p>Actions:</p>
                    <button class="btn btn-sm" onclick="handleStatusUpdate('${
                      order._id
                    }', 'Out For Delivery')">Start Delivery</button>
                    <button class="btn btn-sm btn-secondary" onclick="handleStatusUpdate('${
                      order._id
                    }', 'Delivered')">Mark Delivered</button>
                </div>
            `;
    });
    container.innerHTML = listHTML;
  } catch (error) {
    container.innerHTML = `<p class="alert alert-danger">Failed to load deliveries: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("rider-deliveries-list")) {
    displayRiderDeliveries();
  }
});

// Expose handleStatusUpdate globally for onClick attributes
window.handleStatusUpdate = handleStatusUpdate;
