let products = [];
let filteredProducts = [];
let selectedProduct = null;
let selectedSize = null;
let selectedColor = null;

document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('../backend/products.php');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    products = await response.json();
    
    products = products.map((product, index) => ({
      id: product.id,
      name: product.name,
      brand: product.name.toLowerCase().includes('jordan') ? 'jordan' : 
             product.name.toLowerCase().includes('nike') ? 'nike' :
             product.name.toLowerCase().includes('adidas') ? 'adidas' :
             product.name.toLowerCase().includes('puma') ? 'puma' :
             product.name.toLowerCase().includes('converse') ? 'converse' :
             product.name.toLowerCase().includes('salomon') ? 'salomon' :
             product.name.toLowerCase().includes('vans') ? 'vans' : 'other',
      price: parseFloat(product.price),
      category: product.name.toLowerCase().includes('air') ? 'basketball' :
               product.name.toLowerCase().includes('ultraboost') ? 'running' :
               product.name.toLowerCase().includes('skate') ? 'skate' : 'casual',
      images: [product.image],
      description: product.description || 'No description available',
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: ["#000000", "#FFFFFF", "#FF0000"]
    }));
    
    filteredProducts = [...products];
    renderProducts();
    setupFilters();
    updateCartCount();
  } catch (error) {
    console.error('Error loading products:', error);
    // Show error message to user
    const grid = document.getElementById('productsGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-message">
          <p>Failed to load products. Please try again later.</p>
          <button onclick="window.location.reload()">Retry</button>
        </div>`;
    }
  }
});

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" onclick="openModal(${product.id})">
      <div class="product-image">
        <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'">
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-brand">${product.brand}</div>
        <div class="product-price">$${product.price}</div>
      </div>
    </div>
  `).join('');
}

function setupFilters() {
  const brandFilter = document.getElementById('brandFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');

  brandFilter.removeEventListener('change', applyFilters);
  categoryFilter.removeEventListener('change', applyFilters);
  priceFilter.removeEventListener('change', applyFilters);

  brandFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  priceFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
  const brandFilter = document.getElementById('brandFilter').value;
  const categoryFilter = document.getElementById('categoryFilter').value;
  const priceFilter = document.getElementById('priceFilter').value;

  filteredProducts = products.filter(product => {
    let matches = true;

    if (brandFilter && product.brand.toLowerCase() !== brandFilter) {
      matches = false;
    }

    if (categoryFilter && product.category !== categoryFilter) {
      matches = false;
    }

    if (priceFilter) {
      if (priceFilter === '0-100' && product.price > 100) {
        matches = false;
      } else if (priceFilter === '100-200' && (product.price < 100 || product.price > 200)) {
        matches = false;
      } else if (priceFilter === '200+' && product.price < 200) {
        matches = false;
      }
    }

    return matches;
  });

  renderProducts();
}

function openModal(productId) {
  selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;

  const modal = document.getElementById('productModal');
  const mainImage = document.getElementById('modalMainImage');
  const thumbnails = document.getElementById('modalThumbnails');
  const productName = document.getElementById('modalProductName');
  const productBrand = document.getElementById('modalProductBrand');
  const productPrice = document.getElementById('modalProductPrice');
  const productDescription = document.getElementById('modalProductDescription');
  const sizeOptions = document.getElementById('modalSizeOptions');
  const colorOptions = document.getElementById('modalColorOptions');

  mainImage.src = selectedProduct.images[0];
  productName.textContent = selectedProduct.name;
  productBrand.textContent = selectedProduct.brand;
  productPrice.textContent = `$${selectedProduct.price}`;
  productDescription.textContent = selectedProduct.description;

  thumbnails.innerHTML = selectedProduct.images.map((image, index) => `
    <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', ${index})">
      <img src="${image}" alt="Thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=Img'">
    </div>
  `).join('');

  // Render size options
  sizeOptions.innerHTML = selectedProduct.sizes.map(size => `
    <button class="size-option" onclick="selectSize('${size}')">${size}</button>
  `).join('');

  // Render color options
  colorOptions.innerHTML = selectedProduct.colors.map(color => `
    <div class="color-option" style="background-color: ${color}" onclick="selectColor('${color}')"></div>
  `).join('');

  // Reset selections
  selectedSize = null;
  selectedColor = null;

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  selectedProduct = null;
  selectedSize = null;
  selectedColor = null;
}

function changeMainImage(imageSrc, index) {
  const mainImage = document.getElementById('modalMainImage');
  const thumbnails = document.querySelectorAll('.thumbnail');

  mainImage.src = imageSrc;

  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

function selectSize(size) {
  const sizeButtons = document.querySelectorAll('.size-option');
  sizeButtons.forEach(btn => {
    btn.classList.toggle('selected', btn.textContent === size);
  });
  selectedSize = size;
}

function selectColor(color) {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.classList.toggle('selected', option.style.backgroundColor === color);
  });
  selectedColor = color;
}

function addToCart() {
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }

  if (!selectedColor) {
    alert('Please select a color');
    return;
  }

  const item = {
    id: selectedProduct.id,
    name: selectedProduct.name,
    brand: selectedProduct.brand,
    price: selectedProduct.price,
    size: selectedSize,
    color: selectedColor,
    image: selectedProduct.images[0],
    quantity: 1
  };


  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItemIndex = cart.findIndex(cartItem => 
    cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  triggerCartUpdate();
  closeModal();
}


function buyNow() {
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }

  if (!selectedColor) {
    alert('Please select a color');
    return;
  }

  addToCart();

  window.location.href = '../cart_page/cart.html';
}

function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('active');
}
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});