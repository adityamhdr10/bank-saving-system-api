const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { testConnection } = require("./src/config/db");

// Import routes
const customerRoutes = require("./src/routes/customerRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const depositoRoutes = require("./src/routes/depositoRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bank Saving System API",
    version: "1.0.0",
    endpoints: {
      customers: "/api/customers",
      accounts: "/api/accounts",
      depositoTypes: "/api/deposito-types",
      transactions: "/api/transactions",
    },
  });
});

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposito-types", depositoRoutes);
app.use("/api/transactions", transactionRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// ============================================
// START SERVER
// ============================================

async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log("🚀 Bank Saving System API Server");
      console.log("=".repeat(50));
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}`);
      console.log("=".repeat(50));
      console.log("\nAvailable Endpoints:");
      console.log(`  • GET    http://localhost:${PORT}/`);
      console.log(`  • CRUD   http://localhost:${PORT}/api/customers`);
      console.log(`  • CRUD   http://localhost:${PORT}/api/accounts`);
      console.log(`  • CRUD   http://localhost:${PORT}/api/deposito-types`);
      console.log(
        `  • POST   http://localhost:${PORT}/api/transactions/deposit`
      );
      console.log(
        `  • POST   http://localhost:${PORT}/api/transactions/withdraw`
      );
      console.log("=".repeat(50));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
