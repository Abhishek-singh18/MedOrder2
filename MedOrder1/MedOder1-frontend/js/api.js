// js/api.js (Update the postData and add an authenticatedFetch utility)

// ... existing code ...

// Reusable function for authenticated requests
async function authenticatedFetch(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated. Please log in.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Pass the JWT token
  };

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error(`${method} API Call Failed:`, endpoint, error);
    throw error;
  }
}

// Update the exported functions
async function createOrder(orderData) {
  return authenticatedFetch("/orders", "POST", orderData);
}

async function payOrder(orderId, paymentData) {
  return authenticatedFetch(`/orders/${orderId}/pay`, "PUT", paymentData); // Use PUT for update
}

async function getOrderHistory() {
  return authenticatedFetch("/orders/myorders", "GET");
}

async function getOrderDetails(orderId) {
  return authenticatedFetch(`/orders/${orderId}`, "GET");
}

// Final Export List
export {
  registerUser,
  loginUser,
  getMedicines,
  createOrder,
  payOrder,
  getOrderHistory,
  getOrderDetails,
};
