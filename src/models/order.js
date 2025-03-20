const { v4: uuidv4 } = require("uuid");

class Order {
  constructor(customerInfo, products) {
    this.id = uuidv4();
    this.customerInfo = customerInfo;
    this.products = products;
    this.status = "pending";
    this.createdAt = new Date();
  }
}

class OrderManager {
  constructor() {
    this.orders = new Map();
    this.orderQueue = [];
  }

  createOrder(customerInfo, products) {
    const order = new Order(customerInfo, products);
    this.orders.set(order.id, order);
    this.orderQueue.push(order.id);
    return order;
  }

  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  getAllOrders(page = 1, limit = 10, status = null) {
    let filteredOrders = Array.from(this.orders.values());

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages,
      },
    };
  }

  cancelOrder(orderId) {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = "cancelled";
      return true;
    }
    return false;
  }

  processNextOrder() {
    if (this.orderQueue.length === 0) {
      return null;
    }

    const orderId = this.orderQueue.shift();
    const order = this.orders.get(orderId);

    if (order && order.status === "pending") {
      order.status = "processed";
      return order;
    }

    return null;
  }

  updateOrder(orderId, updates) {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    if (order.status !== "pending") {
      throw new Error("Cannot update non-pending orders");
    }

    // Update allowed fields
    if (updates.customerInfo) {
      order.customerInfo = { ...order.customerInfo, ...updates.customerInfo };
    }

    if (updates.products) {
      order.products = updates.products;
    }

    if (
      updates.status &&
      updates.status !== "processed" &&
      updates.status !== "cancelled"
    ) {
      order.status = updates.status;
    }

    order.updatedAt = new Date();
    return order;
  }
}

module.exports = new OrderManager();
