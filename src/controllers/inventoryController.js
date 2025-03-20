const InventoryManager = require("../models/inventory");
const { ValidationError, NotFoundError } = require("../utils/errors");

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

  getInventoryItem(id) {
    if (!id) {
      throw new ValidationError("Product ID is required");
    }

    try {
      return this.inventoryManager.getProduct(id);
    } catch (error) {
      throw error;
    }
  }

  checkProductAvailability(products) {
    if (!products || !Array.isArray(products)) {
      throw new ValidationError("Products must be a non-empty array");
    }

    if (products.length === 0) {
      throw new ValidationError("Products array cannot be empty");
    }

    products.forEach((item) => {
      if (!item || typeof item !== "object") {
        throw new ValidationError("Each product must be an object");
      }
      if (!item.id || typeof item.quantity === "undefined") {
        throw new ValidationError(
          "Invalid product format. Each product must have 'id' and 'quantity' fields"
        );
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new ValidationError("Quantity must be a positive number");
      }
    });

    const mappedProducts = products.map((item) => ({
      productId: item.id,
      quantity: parseInt(item.quantity, 10),
    }));

    return this.inventoryManager.checkAvailability(mappedProducts);
  }

  updateInventoryQuantity(id, quantity) {
    if (!id) {
      throw new ValidationError("Product ID is required");
    }
    if (typeof quantity !== "number" || quantity < 0) {
      throw new ValidationError("Quantity must be a non-negative number");
    }

    const products = [{ id, quantity }];
    return this.updateInventoryQuantities(products);
  }

  updateInventoryQuantities(products) {
    if (!Array.isArray(products)) {
      throw new ValidationError("Products must be an array");
    }

    try {
      const mappedProducts = products.map((item) => ({
        productId: item.id,
        quantity: parseInt(item.quantity, 10),
      }));

      this.inventoryManager.updateInventory(mappedProducts);
      return true;
    } catch (error) {
      throw error;
    }
  }

  restockInventory(products) {
    if (!Array.isArray(products)) {
      throw new ValidationError("Products must be an array");
    }

    try {
      const mappedProducts = products.map((item) => {
        if (!item || typeof item !== "object") {
          throw new ValidationError("Each product must be an object");
        }
        if (!item.id || typeof item.quantity === "undefined") {
          throw new ValidationError(
            "Invalid product format. Each product must have 'id' and 'quantity' fields"
          );
        }
        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new ValidationError("Quantity must be a positive number");
        }
        return {
          productId: item.id,
          quantity: parseInt(item.quantity, 10),
        };
      });

      this.inventoryManager.restockInventory(mappedProducts);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InventoryController;
