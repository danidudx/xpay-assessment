const InventoryManager = require("../models/inventory");
const { ValidationError } = require("../utils/errors");

class InventoryController {
  constructor(inventoryManager) {
    this.inventoryManager = inventoryManager;
  }

  getInventory() {
    try {
      return this.inventoryManager.getInventory();
    } catch (error) {
      throw new Error("Failed to fetch inventory");
    }
  }

  checkProductAvailability(products) {
    if (!Array.isArray(products)) {
      throw new ValidationError("Products must be an array");
    }

    products.forEach((item) => {
      if (!item.productId || !item.quantity) {
        throw new ValidationError("Invalid product format");
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new ValidationError("Quantity must be a positive number");
      }
    });

    return this.inventoryManager.checkAvailability(products);
  }

  updateInventoryQuantities(products) {
    if (!Array.isArray(products)) {
      throw new ValidationError("Products must be an array");
    }

    try {
      this.checkProductAvailability(products);
      this.inventoryManager.updateInventory(products);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

// Export the class instead of an instance to allow dependency injection
module.exports = InventoryController;