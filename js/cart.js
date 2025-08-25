const DEVICES = [
  {
    image: "img/image__1_-removebg-preview.png",
    id: 1,
    name: "Matrack ELD",
    description:
      "MaTrack ELD is fully FMCSA Compliant Electronic Logging Device. It is engineered with Bluetooth Low Energy Technology...",
    price: 0,
    monthlyPlans: [
      { price: 19.95, label: "Basic Plan" },
      { price: 24.95, label: "Premium Plan" },
    ],
    country: ["For USA", "For Canada"],
    type: "Electronic Logging Device",
  },
  {
    image: "img/image (3).png",
    id: 2,
    name: "MA Asset Classic",
    description:
      "The MA-Asset Classic is considered to be our standard in the world of asset tracking systems, simple sturdy and with enduring battery power, this piece of equipment practically sells itself.",
    price: 50,
    monthlyPlans: [{ price: 11.95, label: "Standard Plan" }],
    type: "Asset Tracker",
  },
  {
    image: "img/image (4).png",
    id: 3,
    name: "MA Hardwire Silver",
    description:
      "Our weather-proof Hardwired Tracker is a sophisticated and convenient tool for making sure your property is safe.",
    price: 135,
    monthlyPlans: [{ price: 119.6, label: "Standard Plan" }],
    type: "Asset Tracker",
  },
  {
    image: "img/image (5).png",
    id: 4,
    name: "MA Hardwire Classic",
    description:
      "A discreet, tamper resistant device specialized for Fleets and Transport Services.",
    price: 135,
    monthlyPlans: [{ price: 50, label: "Standard Plan" }],
    type: "Asset Tracker",
  },
  {
    image: "img/image (3).png",
    id: 5,
    name: "Matrack OBD",
    description:
      "An excellent means for tracking any vehicle. It is completely integrated with the On Board Diagnostics system so you can stay on top of Vehicle Health/Performance issues.",
    price: 85,
    monthlyPlans: [{ price: 14.95, label: "Standard Plan" }],
    type: "Vehicle Tracker",
  },
  {
    image: "img/image (4).png",
    id: 6,
    name: "MA Hardwire Classic",
    description:
      "A discreet, tamper resistant device specialized for Fleets and Transport Services.",
    price: 50,
    monthlyPlans: [{ price: 14.95, label: "Standard Plan" }],
    type: "Vehicle Tracker",
  },
  {
    image: "img/image (5).png",
    id: 7,
    name: "MA Hardwire Silver",
    description:
      "Our weather-proof Hardwired Tracker is a sophisticated and convenient tool for making sure your property is safe.",
    price: 135,
    monthlyPlans: [{ price: 14.95, label: "Standard Plan" }],
    type: "Vehicle Tracker",
  },
];

// Format amount utility function
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Cart management for order summary page
const orderSummary = {
  cartItems: {},

  // Load cart from localStorage with error handling
  loadCartFromStorage: function () {
    try {
      const savedItems = localStorage.getItem("cartItems");
      if (savedItems) {
        this.cartItems = JSON.parse(savedItems);
        console.log("Cart loaded successfully:", this.cartItems);
        return true;
      } else {
        console.log("No cart items found in localStorage");
        this.cartItems = {};
        return false;
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      this.cartItems = {};
      return false;
    }
  },

  // Generate order item HTML
  generateOrderItemHTML: function (cartItem) {
    const device = cartItem.device;
    const quantity = cartItem.quantity;
    const deviceTotal = cartItem.deviceTotal;
    const monthlyTotal = cartItem.monthlyTotal;

    // Determine if device has monthly cost
    const hasMonthlyPlan = device.monthlyPlans[0].price > 0;
    const priceDisplay = hasMonthlyPlan
      ? `${formatAmount(deviceTotal)} + ${formatAmount(monthlyTotal)}/mo`
      : formatAmount(deviceTotal);

    return `
      <div class="order-item">
        <div class="item-image">
          <div>
            <img
              src="${device.image}"
              alt="${device.name}"
              style="width: 100px; margin-top: 23px"
            />
          </div>
        </div>
        <div class="item-details">
          <div class="item-name">${device.name} x ${quantity}</div>
        </div>
        <div>
          <div class="item-price">${priceDisplay}</div>
        </div>
      </div>
    `;
  },

  // Calculate totals
  calculateTotals: function () {
    return Object.values(this.cartItems).reduce(
      (totals, item) => {
        totals.deviceTotal += item.deviceTotal;
        totals.monthlyTotal += item.monthlyTotal;
        return totals;
      },
      { deviceTotal: 0, monthlyTotal: 0 }
    );
  },

  renderOrderSummary: function () {
    const orderSummaryContainer = document.querySelector(".order-summary");

    if (!orderSummaryContainer) {
      console.error("Order summary container not found");
      return;
    }

    // Check if cart is empty
    if (Object.keys(this.cartItems).length === 0) {
      this.renderEmptyCart(orderSummaryContainer);
      this.renderCustomOrderSummary(); // Add this line
      return;
    }

    // Generate order items HTML
    const orderItemsHTML = Object.values(this.cartItems)
      .map((item) => this.generateOrderItemHTML(item))
      .join("");

    // Calculate totals
    const totals = this.calculateTotals();
    const grandTotal = totals.deviceTotal;

    // Update the order summary HTML
    orderSummaryContainer.innerHTML = `
    <h2>Order summary</h2>
    
    ${orderItemsHTML}
    
    <div class="totals">
      <div class="total-row">
        <span class="total-label">Monthly Total</span>
        <span class="total-value">${formatAmount(totals.monthlyTotal)}/mo</span>
      </div>
      <div class="total-row">
        <span class="total-label">Device Total</span>
        <span class="total-value">${formatAmount(totals.deviceTotal)}</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-value">Grand Total</span>
        <span class="total-label-2">${formatAmount(grandTotal)}</span>
      </div>
    </div>
  `;

    // Also render the custom order summary
    this.renderCustomOrderSummary(); // Add this line
  },

  // Render empty cart state
  renderEmptyCart: function (container) {
    container.innerHTML = `
      <h2>Order summary</h2>
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <a href="index.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
  },

  generateCustomOrderItemHTML: function (cartItem) {
    const device = cartItem.device;
    const quantity = cartItem.quantity;
    const deviceTotal = cartItem.deviceTotal;
    const monthlyTotal = cartItem.monthlyTotal;

    // Determine if device has monthly cost
    const hasMonthlyPlan = device.monthlyPlans[0].price > 0;
    const priceDisplay = hasMonthlyPlan
      ? `${formatAmount(deviceTotal)} + ${formatAmount(monthlyTotal)}/mo`
      : formatAmount(deviceTotal);

    return `
    <div class="custom-order-item-row">
      <div class="custom-order-image-wrapper">
        <img src="${device.image}" alt="${device.name}" />
      </div>
      <div class="custom-order-item-description">
        <div class="custom-order-item-title">${device.name} x ${quantity}</div>
      </div>
      <div class="custom-order-item-price">${priceDisplay}</div>
    </div>
  `;
  },

  renderCustomOrderSummary: function () {
    const customOrderContainer = document.querySelector(
      ".custom-order-summary-container"
    );

    if (!customOrderContainer) {
      console.log("Custom order summary container not found");
      return;
    }

    // Check if cart is empty
    if (Object.keys(this.cartItems).length === 0) {
      // Update the grand total display to $0.00
      const grandTotalDisplay =
        customOrderContainer.querySelector(".font--heading");
      const finalTotalDisplay = customOrderContainer.querySelector(
        ".custom-total-final-label"
      );

      if (grandTotalDisplay) grandTotalDisplay.textContent = "$0.00";
      if (finalTotalDisplay) finalTotalDisplay.textContent = "$0.00";

      // Clear the content section
      const contentSection = customOrderContainer.querySelector(
        ".custom-toggle-order-content-section"
      );
      if (contentSection) {
        contentSection.innerHTML =
          '<p class="empty-cart-message">Your cart is empty.</p>';
      }
      return;
    }

    // Generate order items HTML
    const customOrderItemsHTML = Object.values(this.cartItems)
      .map((item) => this.generateCustomOrderItemHTML(item))
      .join("");

    // Calculate totals
    const totals = this.calculateTotals();
    const grandTotal = totals.deviceTotal;

    // Update the grand total in the header
    const grandTotalDisplay =
      customOrderContainer.querySelector(".font--heading");
    if (grandTotalDisplay) {
      grandTotalDisplay.textContent = formatAmount(grandTotal);
    }

    // Update the content section
    const contentSection = customOrderContainer.querySelector(
      ".custom-toggle-order-content-section"
    );
    if (contentSection) {
      contentSection.innerHTML = `
      ${customOrderItemsHTML}
      
      <div class="custom-order-total-section">
        <div class="custom-order-total-line">
          <span class="custom-total-label-text">Monthly Total</span>
          <span class="custom-total-price-value">${formatAmount(
            totals.monthlyTotal
          )}/mo</span>
        </div>
        <div class="custom-order-total-line">
          <span class="custom-total-label-text">Device Total</span>
          <span class="custom-total-price-value">${formatAmount(
            totals.deviceTotal
          )}</span>
        </div>
        <div class="custom-order-total-line custom-order-grand-total-highlight">
          <span class="custom-total-price-value price--set">Grand Total</span>
          <span
            class="custom-total-final-label"
            style="color: var(--dark-grey-color); font-weight: 600; font-size: 18px;"
          >${formatAmount(grandTotal)}</span>
        </div>
      </div>
    `;
    }
  },

  // Initialize order summary page
  init: function () {
    console.log("Initializing order summary...");

    // Load cart from localStorage
    const cartLoaded = this.loadCartFromStorage();

    if (!cartLoaded) {
      console.log("No cart data found or error loading cart");
    }

    // Render the order summary
    this.renderOrderSummary();

    // Listen for storage changes (if user updates cart in another tab)
    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") {
        console.log("Cart updated in another tab, reloading...");
        this.loadCartFromStorage();
        this.renderOrderSummary();
      }
    });
  },
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  orderSummary.init();
});

window.addEventListener("storage", (e) => {
  if (e.key === "cartItems") {
    console.log("Cart updated in another tab, reloading...");
    this.loadCartFromStorage();
    this.renderOrderSummary();
  }
});
