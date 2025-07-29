
let cartItems = [];
const subscribers = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    notifySubscribers();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    notifySubscribers();
}

// Subscribe to cart changes
export function subscribe(callback) {
    subscribers.push(callback);
    // Return unsubscribe function
    return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
            subscribers.splice(index, 1);
        }
    };
}

// Notify all subscribers of cart changes
function notifySubscribers() {
    subscribers.forEach(callback => callback(cartItems));
}

// Get current cart items
export function getCartItems() {
    return [...cartItems];
}

// Add item to cart
export function addToCart(item) {
    const existingItem = cartItems.find(i => i.id === item.id && i.size === item.size);
    
    if (existingItem) {
        existingItem.quantity += item.quantity || 1;
    } else {
        cartItems.push({
            ...item,
            quantity: item.quantity || 1
        });
    }
    
    saveCart();
    return getCartItems();
}

// Update item quantity
export function updateQuantity(itemId, newQuantity, size) {
    const item = cartItems.find(i => i.id === itemId && (!size || i.size === size));
    
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
    }
    
    return getCartItems();
}

// Change item quantity by delta
export function changeQuantity(itemId, change, size) {
    const item = cartItems.find(i => i.id === itemId && (!size || i.size === size));
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart();
    }
    
    return getCartItems();
}

// Remove item from cart
export function removeItem(itemId, size) {
    const itemIndex = cartItems.findIndex(i => i.id === itemId && (!size || i.size === size));
    
    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
        saveCart();
    }
    
    return getCartItems();
}

// Clear the cart
export function clearCart() {
    cartItems = [];
    saveCart();
    return [];
}

// Calculate order summary
export function getOrderSummary() {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount
    };
}

// Get cart item count
export function getCartItemCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
}

// Initialize cart
loadCart();
