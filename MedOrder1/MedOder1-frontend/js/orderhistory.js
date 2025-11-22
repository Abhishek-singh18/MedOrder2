// js/order-history.js

import { getOrderHistory } from "./api.js";

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

async function displayOrderHistory() {
  const container = document.getElementById("orders-list");

  if (localStorage.getItem("role") !== "customer") {
    container.innerHTML =
      '<p class="alert alert-warning">Please login as a Customer to view your orders.</p>';
    return;
  }

  try {
    const orders = await getOrderHistory();
    container.innerHTML = ""; // Clear loading message

    if (orders.length === 0) {
      container.innerHTML =
        '<p class="alert alert-info">You have not placed any orders yet.</p>';
      return;
    }

    // Generate Table Structure
    let tableHTML = `
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

    orders.forEach((order) => {
      const statusClass = order.deliveryStatus
        .toLowerCase()
        .replace(/\s/g, "-");

      tableHTML += `
                <tr>
                    <td>${order._id.substring(18)}</td>
                    <td>${formatDate(order.createdAt)}</td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td>${order.isPaid ? "Paid" : "Pending"}</td>
                    <td class="status-${statusClass}">${
        order.deliveryStatus
      }</td>
                    <td><a href="delivery-track.html?orderId=${
                      order._id
                    }" class="btn btn-sm">Track Details</a></td>
                </tr>
            `;
    });

    tableHTML += "</tbody></table>";
    container.innerHTML = tableHTML;
  } catch (error) {
    container.innerHTML = `<p class="alert alert-danger">Failed to load order history: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("orders-list")) {
    displayOrderHistory();
  }
});
