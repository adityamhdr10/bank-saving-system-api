const { testConnection } = require("./config/db");
const { Customer, Account, DepositoType, Transaction } = require("./models");

async function test() {
  await testConnection();

  // Test query
  const customers = await Customer.findAll();
  console.log(`Found ${customers.length} customers`);

  const depositoTypes = await DepositoType.findAll();
  console.log(`Found ${depositoTypes.length} deposito types`);

  process.exit(0);
}

test();
