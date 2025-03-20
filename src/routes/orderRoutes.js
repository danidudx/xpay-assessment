const express = require("express");
const router = express.Router();
const orderManager = require("../models/order");
const inventoryManager = require("../models/inventory");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { customerInfo, products } = req.body;

    // Validate input
    if (
      !customerInfo ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Check inventory availability
    await inventoryManager.checkAvailability(products);

    // Create order
    const order = orderManager.createOrder(customerInfo, products);

    // Update inventory
    inventoryManager.updateInventory(products);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  const result = orderManager.getAllOrders(page, limit, status);
  res.json(result);
});

// Get specific order
router.get("/:id", (req, res) => {
  const order = orderManager.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Cancel order
router.delete("/:id", (req, res) => {
  const success = orderManager.cancelOrder(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ message: "Order cancelled successfully" });
});

// Process next order in queue
router.post("/process-next", (req, res) => {
  const order = orderManager.processNextOrder();
  if (!order) {
    return res.status(404).json({ message: "No orders in queue" });
  }
  res.json({ message: "Order processed successfully", order });
});

// Update order
router.patch("/:id", async (req, res) => {
  try {
    const { customerInfo, products, status } = req.body;
    const updates = {};

    if (customerInfo) updates.customerInfo = customerInfo;
    if (status) updates.status = status;

    if (products) {
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Invalid products data" });
      }
      // Check inventory availability for updated products
      await inventoryManager.checkAvailability(products);
      updates.products = products;

      // Update inventory
      inventoryManager.updateInventory(products);
    }

    const updatedOrder = orderManager.updateOrder(req.params.id, updates);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
