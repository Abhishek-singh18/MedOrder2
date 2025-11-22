// js/checkout.js

import {
  getCartItems,
  calculateTotals,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "./cart.js";
import { postData } from "./api.js";

// --- Rendering Functions ---

function renderCart() {
  const items = getCartItems();
  const container = document.getElementById("cart-items-container");
  const emptyMessage = document.getElementById("empty-cart-message");

  // Show/hide empty message
  if (items.length === 0) {
    container.innerHTML = `<p class="alert alert-info">Your cart is currently empty.</p>`;
    document.getElementById("place-order-btn").disabled = true;
    updateSummary(calculateTotals([])); // Update summary with zero totals
    return;
  }

  document.getElementById("place-order-btn").disabled = false;

  // Render each item
  container.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.medicineId}">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Unit Price: $${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button class="qty-btn" data-action="minus" data-id="${
                  item.medicineId
                }">-</button>
                <span class="item-qty">${item.qty}</span>
                <button class="qty-btn" data-action="plus" data-id="${
                  item.medicineId
                }">+</button>
            </div>
            <div class="item-price">$${(item.price * item.qty).toFixed(2)}</div>
            <button class="btn-remove" data-id="${
              item.medicineId
            }">Remove</button>
        </div>
    `
    )
    .join("");

  // Update summary section
  updateSummary(calculateTotals(items));
  attachEventListeners();
}

function updateSummary(totals) {
  document.getElementById(
    "summary-items-price"
  ).textContent = `$${totals.itemsPrice.toFixed(2)}`;
  document.getElementById(
    "summary-shipping-price"
  ).textContent = `$${totals.shippingPrice.toFixed(2)}`;
  document.getElementById(
    "summary-tax-price"
  ).textContent = `$${totals.taxPrice.toFixed(2)}`;
  document.getElementById(
    "summary-total-amount"
  ).textContent = `$${totals.totalAmount.toFixed(2)}`;
}

// --- Event Handlers ---

function handleQuantityChange(e) {
  const btn = e.currentTarget;
  const medicineId = btn.dataset.id;
  const action = btn.dataset.action;
  const itemElement = btn.closest(".cart-item");
  let currentQty = parseInt(itemElement.querySelector(".item-qty").textContent);

  let newQty = currentQty;
  if (action === "plus") {
    newQty = currentQty + 1;
  } else if (action === "minus") {
    newQty = currentQty - 1;
  }

  updateQuantity(medicineId, newQty);
  renderCart(); // Re-render the cart to show updated totals/items
}

function handleRemoveItem(e) {
  const medicineId = e.currentTarget.dataset.id;
  removeFromCart(medicineId);
  renderCart();
}

function attachEventListeners() {
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", handleQuantityChange);
  });
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", handleRemoveItem);
  });
}

// --- Checkout Function ---

async function handleCheckout(e) {
  e.preventDefault();
  document.getElementById("place-order-btn").disabled = true; // Prevent double submit

  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    document.getElementById("place-order-btn").disabled = false;
    return;
  }

  const { itemsPrice, shippingPrice, taxPrice, totalAmount } =
    calculateTotals(cartItems);

  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!address) {
    alert("Please enter a full delivery address.");
    document.getElementById("place-order-btn").disabled = false;
    return;
  }

  // Transform cart items into the backend's expected `orderItems` structure
  const orderItems = cartItems.map((item) => ({
    name: item.name,
    qty: item.qty,
    price: item.price,
    medicine: item.medicineId,
    seller: item.sellerId, // Need the seller ID from the product listing
  }));

  const orderData = {
    orderItems,
    shippingAddress: {
      address: address,
      city: "Sample City", // In a real app, parse this from the address input
      postalCode: "123456",
    },
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalAmount,
  };

  try {
    // 1. Place the order
    const orderResult = await postData("/orders", orderData, true); // Assuming postData takes a boolean for auth

    // 2. Simulate Payment (Since we only simulated the gateway logic in the backend)
    // In a real app, you redirect to Stripe/Razorpay, then they hit your /pay endpoint.
    const paymentData = {
      id: `PAY-${Date.now()}`,
      status: "COMPLETED",
    };
    await postData(`/orders/${orderResult._id}/pay`, paymentData, true);

    alert(`Order successfully placed and paid! Order ID: ${orderResult._id}`);
    clearCart(); // Clear local cart after successful order
    window.location.href = `order-history.html?orderId=${orderResult._id}`; // Redirect to tracking/history
  } catch (error) {
    alert(
      `Order failed: ${error.message}. Please check stock or login status.`
    );
    document.getElementById("place-order-btn").disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-items-container")) {
    renderCart();
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckout);
  }
});
