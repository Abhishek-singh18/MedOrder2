// js/cart.js (Updated with update/remove functions)

// ... (existing cartItems, saveCart, getCartItems, clearCart functions) ...

// Function to update item quantity
function updateQuantity(medicineId, newQty) {
    const item = cartItems.find(item => item.medicineId === medicineId);
    if (item) {
        if (newQty <= 0) {
            // If quantity is 0 or less, remove the item
            removeFromCart(medicineId);
        } else {
            item.qty = newQty;
            saveCart();
        }
    }
}

// Function to remove an item completely
function removeFromCart(medicineId) {
    cartItems = cartItems.filter(item => item.medicineId !== medicineId);
    saveCart();
}

// Function to calculate totals
function calculateTotals(cart) {
    const shippingPrice = 5.00; // Fixed delivery fee
    
    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxRate = 0.05; // 5% tax
    const taxPrice = itemsPrice * taxRate;
    const totalAmount = itemsPrice + shippingPrice + taxPrice;

    return {
        itemsPrice: parseFloat(itemsPrice.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2))
    };
}

export { addToCart, getCartItems, clearCart, saveCart, updateQuantity, removeFromCart, calculateTotals };