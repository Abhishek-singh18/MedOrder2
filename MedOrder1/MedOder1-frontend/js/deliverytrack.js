// js/delivery-track.js

import { getOrderDetails } from "./api.js";

const STATUS_STEPS = ["Pending", "Processing", "Out For Delivery", "Delivered"];

function renderTrackingTimeline(currentStatus) {
  const timeline = document.getElementById("tracking-timeline");
  timeline.innerHTML = STATUS_STEPS.map((step, index) => {
    const currentStatusIndex = STATUS_STEPS.indexOf(currentStatus);
    const isActive = index <= currentStatusIndex ? "active" : "";
    const isCurrent = index === currentStatusIndex ? "current" : "";

    return `
            <div class="timeline-step ${isActive} ${isCurrent}">
                <div class="dot"></div>
                <div class="label">${step}</div>
            </div>
        `;
  }).join("");
}

async function displayOrderTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const container = document.getElementById("tracking-details");

  if (!orderId) {
    container.innerHTML = '<p class="alert alert-danger">Invalid order ID.</p>';
    return;
  }

  document.getElementById("tracking-order-id").textContent = orderId;

  try {
    const order = await getOrderDetails(orderId);
    const status = order.deliveryStatus;

    // 1. Render Status Timeline
    renderTrackingTimeline(status);
    document.getElementById("current-status").textContent = status;

    // 2. Render Rider Info (if assigned)
    const riderInfoDiv = document.getElementById("rider-info");
    if (order.rider) {
      riderInfoDiv.innerHTML = `
                <h4>Rider Assigned 🏍️</h4>
                <p>Name: ${order.rider.name}</p>
                <p>Contact: ${order.rider.phone || "N/A"}</p>
            `;
    } else if (status === "Out For Delivery") {
      riderInfoDiv.innerHTML =
        '<p class="alert alert-info">Rider details coming soon! (Assigned shortly)</p>';
    } else {
      riderInfoDiv.innerHTML = "<p>Awaiting assignment...</p>";
    }
  } catch (error) {
    container.innerHTML = `<p class="alert alert-danger">Failed to load tracking details: ${error.message}</p>`;
  }

  // Auto-refresh the tracking page every 10 seconds (Simulated live update)
  setTimeout(displayOrderTracking, 10000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tracking-timeline")) {
    displayOrderTracking();
  }
});
