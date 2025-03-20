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

// Get single inventory item
router.get("/:id", async (req, res, next) => {
  try {
    const item = inventoryController.getInventoryItem(req.params.id);
    res.json(item);
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

// Update inventory quantities (decrease)
router.patch("/:id", async (req, res, next) => {
  try {
    const updated = inventoryController.updateInventoryQuantity(
      req.params.id,
      req.body.quantity
    );
    res.json({ success: updated });
  } catch (error) {
    next(error);
  }
});

// Restock inventory (increase quantities)
router.post("/restock", async (req, res, next) => {
  try {
    const restocked = inventoryController.restockInventory(req.body.products);
    res.json({ success: restocked });
  } catch (error) {
    next(error);
  }
});

// Bulk update inventory quantities
router.patch("/", async (req, res, next) => {
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
