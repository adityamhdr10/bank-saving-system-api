const Customer = require("./Customer");
const Account = require("./Account");
const DepositoType = require("./DepositoType");
const Transaction = require("./Transaction");

// Define relationships
Customer.hasMany(Account, {
  foreignKey: "customer_id",
  as: "accounts",
});

Account.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

DepositoType.hasMany(Account, {
  foreignKey: "deposito_type_id",
  as: "accounts",
});

Account.belongsTo(DepositoType, {
  foreignKey: "deposito_type_id",
  as: "depositoType",
});

Account.hasMany(Transaction, {
  foreignKey: "account_id",
  as: "transactions",
});

Transaction.belongsTo(Account, {
  foreignKey: "account_id",
  as: "account",
});

module.exports = {
  Customer,
  Account,
  DepositoType,
  Transaction,
};
