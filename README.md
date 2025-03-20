# E-commerce Order Management API

A RESTful API for managing e-commerce orders with inventory tracking and order processing capabilities.

## Features

- Create, read, update, and cancel orders
- Inventory management system
- Order processing queue
- Pagination and filtering for orders
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
- Returns a paginated list of orders with optional filtering

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by order status ("pending", "processed", "cancelled")

**Response:** `200 OK`

```json
{
  "orders": [
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
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Get Specific Order

- **GET** `/api/orders/:id`
- Returns details of a specific order

**Response:** `200 OK`

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

#### Update Order

- **PATCH** `/api/orders/:id`
- Updates an existing order
- Only pending orders can be updated

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

**Response:** `200 OK`

```json
{
  "id": "order123",
  "customerInfo": {
    "name": "Updated Name",
    "email": "john@example.com"
  },
  "products": [...],
  "status": "pending",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

#### Cancel Order

- **DELETE** `/api/orders/:id`
- Cancels a specific order

**Response:** `200 OK`

```json
{
  "message": "Order cancelled successfully"
}
```

#### Process Next Order

- **POST** `/api/orders/process-next`
- Processes the next order in the queue

**Response:** `200 OK`

```json
{
  "message": "Order processed successfully",
  "order": {
    "id": "order123",
    "status": "processed",
    ...
  }
}
```

### Inventory

#### Get Inventory

- **GET** `/api/inventory`
- Returns all inventory items

#### Check Availability

- **POST** `/api/inventory/check-availability`
- Checks if products are available in inventory

**Request Body:**

```json
{
  "products": [
    {
      "id": "product123",
      "quantity": 2
    }
  ]
}
```

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

Common error scenarios:

- Invalid pagination parameters
- Order not found
- Invalid order data
- Cannot update non-pending orders
- Insufficient inventory

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
6. **Pagination**: Efficient data retrieval with customizable page size
7. **Status Filtering**: Easy order tracking by status

## License

MIT
