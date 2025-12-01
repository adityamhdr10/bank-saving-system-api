const { sequelize } = require("./src/config/db");
const { Customer, Account, DepositoType, Transaction } = require("./models");

async function migrate() {
  try {
    console.log("Starting database migration...");

    // Test connection
    await sequelize.authenticate();
    console.log("✓ Database connected");

    // Sync all models (create tables)
    // force: false = tidak akan drop existing tables
    await sequelize.sync({ force: false });
    console.log("✓ All tables created successfully");

    console.log("\nDatabase schema:");
    console.log("- customers");
    console.log("- deposito_types");
    console.log("- accounts");
    console.log("- transactions");

    console.log("\n✓ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
