const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

// Destructure the exported functions from orderController
const { confirmOrder, getOrders } = require("../controllers/orderController");

// POST /api/orders/order → confirm an order (requires authentication)
router.post("/order", authenticate, confirmOrder);

// GET /api/orders/ → get all orders (no authentication here, add auth if needed)
router.get("/", getOrders);

module.exports = router;
