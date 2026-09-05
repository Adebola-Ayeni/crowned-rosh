// ===============================
// MOBILE MENU
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});


// Close mobile menu when link is clicked

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("show");

    });

});


// ===============================
// PRODUCT MODAL
// ===============================

const productButtons =
    document.querySelectorAll(".product-btn");

const productModal =
    document.getElementById("productModal");

const closeModal =
    document.getElementById("closeModal");

const modalProduct =
    document.getElementById("modalProduct");


productButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productName =
            button.dataset.product;

        modalProduct.textContent =
            productName;

        productModal.classList.add("show");

    });

});


closeModal.addEventListener("click", function () {

    productModal.classList.remove("show");

});


// Close modal by clicking background

productModal.addEventListener("click", function (event) {

    if (event.target === productModal) {

        productModal.classList.remove("show");

    }

});


// ===============================
// SCENT SELECTION
// ===============================

const scentOptions =
    document.querySelectorAll(".scent-option");

scentOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        const product =
            modalProduct.textContent;

        const scent =
            option.textContent.trim();

        const message =
            `Hello Crowned Rosh, I would like to order ${product} in ${scent}.`;

        const whatsappNumber =
            "2349026778830";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(
            whatsappURL,
            "_blank"
        );

    });

});


// ===============================
// CURRENT YEAR
// ===============================

document.getElementById("year").textContent =
    new Date().getFullYear();