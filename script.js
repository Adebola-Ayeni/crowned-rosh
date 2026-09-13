// Navigation Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => navLinks.classList.toggle("show"));
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
});

// Cart State (stored as items with quantity)
let cart = [];
let selectedProduct = null;
let deliveryFee = 0;

// DOM Elements
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalProduct = document.getElementById("modalProduct");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");

// Checkout Modal Elements
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutModal = document.getElementById("closeCheckoutModal");
const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const deliveryZoneSelect = document.getElementById("deliveryZone");
const addressGroup = document.getElementById("addressGroup");
const custAddress = document.getElementById("custAddress");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryDelivery = document.getElementById("summaryDelivery");
const summaryGrandTotal = document.getElementById("summaryGrandTotal");
const copyAccBtn = document.getElementById("copyAccBtn");

// 1. Open Scent Selection Modal for Diffusers
document.querySelectorAll(".product-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedProduct = {
            name: btn.dataset.product,
            price: parseInt(btn.dataset.price)
        };
        modalProduct.textContent = selectedProduct.name;
        productModal.classList.add("show");
    });
});

closeModal.addEventListener("click", () => productModal.classList.remove("show"));

// 2. Select Scent for Diffuser & Add to Cart
document.querySelectorAll(".scent-option").forEach(option => {
    option.addEventListener("click", () => {
        const scent = option.dataset.scent;
        addToCart(selectedProduct.name, selectedProduct.price, scent);
        productModal.classList.remove("show");
        openCart();
    });
});

// 3. Direct Add to Cart for Perfume Oil (No Scent)
document.querySelectorAll(".direct-add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.product;
        const price = parseInt(btn.dataset.price);
        addToCart(name, price, null);
        openCart();
    });
});

// Core Cart Helper Functions (Bug Fix: Groups duplicates & handles quantities)
function addToCart(name, price, scent) {
    const key = scent ? `${name} (${scent})` : name;
    const existingIndex = cart.findIndex(item => item.key === key);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            key: key,
            name: name,
            price: price,
            scent: scent,
            quantity: 1
        });
    }
    updateCartUI();
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Your bag is currently empty.</p>`;
        cartTotalElement.textContent = "₦0";
        return;
    }

    cartItemsContainer.innerHTML = "";
    const subtotal = calculateSubtotal();

    cart.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                ${item.scent ? `<p>Fragrance: ${item.scent}</p>` : ''}
                <strong>₦${(item.price * item.quantity).toLocaleString()}</strong>
            </div>
            <div class="cart-qty-controls">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalElement.textContent = `₦${subtotal.toLocaleString()}`;
}

window.updateQuantity = updateQuantity;

// Cart Drawer Handlers
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout Modal Open/Close
proceedToCheckoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }
    closeCart();
    updateCheckoutSummary();
    checkoutModal.classList.add("show");
});

closeCheckoutModal.addEventListener("click", () => checkoutModal.classList.remove("show"));

// Dynamic Delivery Fee Calculation
deliveryZoneSelect.addEventListener("change", () => {
    const selectedOption = deliveryZoneSelect.options[deliveryZoneSelect.selectedIndex];
    deliveryFee = parseInt(selectedOption.dataset.fee || 0);
    
    // Toggle address field requirement on pickup vs delivery
    if (deliveryZoneSelect.value === "Pickup") {
        addressGroup.style.display = "none";
        custAddress.removeAttribute("required");
    } else {
        addressGroup.style.display = "flex";
        custAddress.setAttribute("required", "true");
    }
    
    updateCheckoutSummary();
});

function updateCheckoutSummary() {
    const subtotal = calculateSubtotal();
    const grandTotal = subtotal + deliveryFee;

    summarySubtotal.textContent = `₦${subtotal.toLocaleString()}`;
    summaryDelivery.textContent = deliveryFee === 0 ? "Free" : `₦${deliveryFee.toLocaleString()}`;
    summaryGrandTotal.textContent = `₦${grandTotal.toLocaleString()}`;
}

// Copy Bank Account Number
copyAccBtn.addEventListener("click", () => {
    const accNum = document.getElementById("accountNum").textContent;
    navigator.clipboard.writeText(accNum);
    copyAccBtn.textContent = "Copied! ✓";
    setTimeout(() => copyAccBtn.textContent = "Copy No.", 2000);
});

// Final Order Submission to WhatsApp
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const zone = deliveryZoneSelect.value;
    const address = custAddress.value.trim();
    const subtotal = calculateSubtotal();
    const total = subtotal + deliveryFee;

    let summary = `👑 *NEW ORDER - CROWNED ROSH*\n\n`;
    summary += `👤 *Customer:* ${name}\n`;
    summary += `📞 *Phone:* ${phone}\n`;
    summary += `📍 *Delivery Option:* ${zone}\n`;
    if (zone !== "Pickup") {
        summary += `🏠 *Address:* ${address}\n`;
    } else {
        summary += `📍 *Pickup Point:* Tipper-Garage, Tanke Ilorin\n`;
    }
    summary += `\n🛒 *ORDER ITEMS:*\n`;

    cart.forEach((item, i) => {
        const itemLine = item.scent ? `${item.name} (${item.scent})` : item.name;
        summary += `${i + 1}. ${itemLine} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });

    summary += `\nSubtotal: ₦${subtotal.toLocaleString()}\n`;
    summary += `Delivery Fee: ${deliveryFee === 0 ? 'Free' : '₦' + deliveryFee.toLocaleString()}\n`;
    summary += `*Total Amount:* ₦${total.toLocaleString()}\n\n`;
    summary += `💳 *Payment Method:* Bank Transfer\n`;
    summary += `*(Account: Crowned Rosh Global Ventures Limited / Moniepoint MFB)*\n\n`;
    summary += `I have made/will make the transfer now. Please confirm my order!`;

    const whatsappURL = `https://wa.me/2349026778830?text=${encodeURIComponent(summary)}`;
    window.open(whatsappURL, "_blank");
});

// Current Year
document.getElementById("year").textContent = new Date().getFullYear();