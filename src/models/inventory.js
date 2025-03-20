const { NotFoundError, InsufficientStockError } = require("../utils/errors");

class InventoryManager {
  constructor() {
    this.inventory = new Map();
    this.initializeInventory();
  }

  initializeInventory() {
    const sampleProducts = [
      { id: "P1", name: "Laptop", quantity: 10, price: 999.99 },
      { id: "P2", name: "Smartphone", quantity: 20, price: 599.99 },
      { id: "P3", name: "Headphones", quantity: 50, price: 99.99 },
      { id: "P4", name: "Tablet", quantity: 15, price: 399.99 },
      { id: "P5", name: "Smartwatch", quantity: 30, price: 199.99 },
    ];

    sampleProducts.forEach((product) => {
      this.inventory.set(product.id, { ...product });
    });
  }

  checkAvailability(products) {
    for (const item of products) {
      const product = this.inventory.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }
      if (item.quantity < 0) {
        throw new Error(`Invalid quantity for product ${product.name}`);
      }
      if (product.quantity < item.quantity) {
        throw new InsufficientStockError(
          `Insufficient quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }
    }
    return true;
  }

  updateInventory(products) {
    products.forEach((item) => {
      const product = this.inventory.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }
      const newQuantity = product.quantity - item.quantity;
      if (newQuantity < 0) {
        throw new InsufficientStockError(
          `Cannot update inventory for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }
      product.quantity = newQuantity;
    });
  }

  restockInventory(products) {
    products.forEach((item) => {
      const product = this.inventory.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }
      if (item.quantity < 0) {
        throw new Error(`Invalid restock quantity for product ${product.name}`);
      }
      product.quantity += item.quantity;
    });
  }

  getInventory() {
    return Array.from(this.inventory.values());
  }

  getProduct(productId) {
    const product = this.inventory.get(productId);
    if (!product) {
      throw new NotFoundError(`Product ${productId} not found`);
    }
    return product;
  }
}

// Create and export a singleton instance
const inventoryManager = new InventoryManager();
Object.freeze(inventoryManager);

module.exports = inventoryManager;
