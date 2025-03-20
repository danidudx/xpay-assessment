# E-commerce Order Management API

A RESTful API for managing e-commerce orders with inventory tracking and order processing capabilities.

## Features

- Create, read, update, and cancel orders
- Inventory management system
- Order processing queue
- Pagination & Filteration
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
- Returns a list of all orders with pagination and filtering support

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter orders by status (e.g., 'pending', 'processing', 'completed', 'cancelled')

**Example Request:**

```
GET /api/orders?page=2&limit=10&status=pending
```

**Response:** `200 OK`

```json
{
  "data": [
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
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  }
}
```

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

   - Provides fast read/write operations
   - Suitable for prototype and development environments
   - Data is not persisted across server restarts

2. **Modular Architecture**: Separates concerns into controllers, models, and routes

   - Improves code maintainability and testability
   - Enables easier feature additions and modifications
   - Follows the Single Responsibility Principle

3. **Automatic Port Selection**: Finds available port automatically

   - Prevents port conflicts in development environments
   - Enables multiple instances to run simultaneously
   - Falls back to next available port if default is occupied

4. **Input Validation**: Validates all incoming requests

   - Ensures data integrity and consistency
   - Prevents invalid data from entering the system
   - Provides clear error messages for invalid inputs

5. **Queue-based Processing**: Implements FIFO order processing
   - Ensures fair order processing
   - Prevents system overload
   - Enables future implementation of priority queues

### Implementation Assumptions

1. **Data Persistence**

   - Data is stored in-memory and will be lost on server restart
   - No transaction support or rollback capabilities
   - Suitable for development and testing purposes

2. **Authentication & Authorization**

   - No authentication required (can be added as needed)
   - All endpoints are publicly accessible
   - Suitable for internal network usage

3. **Error Handling**

   - All errors are logged and returned with appropriate HTTP status codes
   - No retry mechanism for failed operations
   - Client is responsible for handling retries

4. **System Boundaries**
   - No external service dependencies
   - Suitable for small to medium-sized e-commerce operations
