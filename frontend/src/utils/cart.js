
let cartItems = [];
const subscribers = [];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    notifySubscribers();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    notifySubscribers();
}

export function subscribe(callback) {
    subscribers.push(callback);
    return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
            subscribers.splice(index, 1);
        }
    };
}

function notifySubscribers() {
    subscribers.forEach(callback => callback(cartItems));
}

export function getCartItems() {
    return [...cartItems];
}

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

export function updateQuantity(itemId, newQuantity, size) {
    const item = cartItems.find(i => i.id === itemId && (!size || i.size === size));
    
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
    }
    
    return getCartItems();
}

export function changeQuantity(itemId, change, size) {
    const item = cartItems.find(i => i.id === itemId && (!size || i.size === size));
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart();
    }
    
    return getCartItems();
}

export function removeItem(itemId, size) {
    const itemIndex = cartItems.findIndex(i => i.id === itemId && (!size || i.size === size));
    
    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
        saveCart();
    }
    
    return getCartItems();
}

export function clearCart() {
    cartItems = [];
    saveCart();
    return [];
}

export function getOrderSummary() {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount
    };
}

export function getCartItemCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
}

loadCart();
