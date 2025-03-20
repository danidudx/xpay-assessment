const express = require("express");
const net = require("net");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Function to check if a port is available
const checkPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => {
      resolve(false);
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (!(await checkPortAvailable(port))) {
    port++;
  }
  return port;
};

// Start the server
const startServer = async () => {
  const preferredPort = process.env.PORT || 5000;
  const port = await findAvailablePort(preferredPort);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch(console.error);

module.exports = app;
