const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/inventoryController");
const inventoryManager = require("../models/inventory");

// Initialize controller with dependency injection
const inventoryController = new InventoryController(inventoryManager);

// Get all inventory items
router.get("/", async (req, res, next) => {
  try {
    const inventory = inventoryController.getInventory();
    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Check product availability
router.post("/check-availability", async (req, res, next) => {
  try {
    const isAvailable = inventoryController.checkProductAvailability(
      req.body.products
    );
    res.json({ available: isAvailable });
  } catch (error) {
    next(error);
  }
});

// Update inventory quantities
router.post("/update", async (req, res, next) => {
  try {
    const updated = inventoryController.updateInventoryQuantities(
      req.body.products
    );
    res.json({ success: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
