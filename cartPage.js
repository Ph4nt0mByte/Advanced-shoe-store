
let cartItems = [];

function changeQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        updateQuantityDisplay(itemId, item.quantity);
        updateOrderSummary();
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        triggerCartUpdate();
    }
}

function updateQuantityDisplay(itemId, quantity) {
    const qtyDisplay = document.getElementById(`qty-${itemId}`);
    if (qtyDisplay) {
        qtyDisplay.textContent = quantity;
    }
}

function removeItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
        renderCartItems();
        updateOrderSummary();
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        triggerCartUpdate();
    }
}

function updateOrderSummary() {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function displayEmptyCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add some shoes to get started!</p>
            <a href="../products_page/products.html" class="continue-shopping-btn">Continue Shopping</a>
        </div>
    `;
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cartItems.length === 0) {
        displayEmptyCart();
        return;
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-brand">${item.brand}</p>
                <p class="item-size">Size: ${item.size}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span class="qty-display" id="qty-${item.id}">${item.quantity}</span>
                <button class="qty-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-price">
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    renderCartItems();
    updateOrderSummary();
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length > 0) {
                window.location.href = '../checkout_page/checkout.html';
            } else {
                alert('Your cart is empty. Add some items before checking out.');
            }
        });
    }
});
