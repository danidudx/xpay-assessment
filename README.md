# E-commerce Order Management API

A RESTful API for managing e-commerce orders with inventory tracking and order processing capabilities.

## Features

- Create, read, update, and cancel orders
- Inventory management system
- Order processing queue
- Pagination & filteration for lists
- Input validation
- Error handling
- Automatic port selection

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will automatically find an available port starting from 5000.

## API Reference

### Orders

#### Create Order

- **POST** `/api/orders`
- Creates a new order with customer information and products

**Request Body:**

```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "products": [
    {
      "id": "product123",
      "quantity": 2
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": "order123",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "products": [...],
  "status": "pending",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Get All Orders

- **GET** `/api/orders`
- Returns a list of all orders

#### Get Specific Order

- **GET** `/api/orders/:id`
- Returns details of a specific order

#### Update Order

- **PATCH** `/api/orders/:id`
- Updates an existing order

**Request Body:**

```json
{
  "customerInfo": {
    "name": "Updated Name"
  },
  "products": [...],
  "status": "pending"
}
```

#### Cancel Order

- **DELETE** `/api/orders/:id`
- Cancels a specific order

#### Process Next Order

- **POST** `/api/orders/process-next`
- Processes the next order in the queue

### Inventory

#### Get Inventory

- **GET** `/api/inventory`
- Returns all inventory items

#### Check Availability

- **POST** `/api/inventory/check-availability`
- Checks if products are available in inventory

#### Update Inventory

- **POST** `/api/inventory/update`
- Updates inventory quantities

## Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message explaining the error:

```json
{
  "error": "Error message here"
}
```

## Development

### Project Structure

```
src/
  ├── controllers/    # Business logic
  ├── middleware/     # Custom middleware
  ├── models/         # Data models
  ├── routes/         # API routes
  ├── utils/          # Utility functions
  └── server.js       # Application entry point
```

### Design Decisions

1. **In-Memory Storage**: Uses Map for order storage and queue management
2. **Modular Architecture**: Separates concerns into controllers, models, and routes
3. **Automatic Port Selection**: Finds available port automatically
4. **Input Validation**: Validates all incoming requests
5. **Queue-based Processing**: Implements FIFO order processing
