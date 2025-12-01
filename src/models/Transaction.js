const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("deposit", "withdraw"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: "Amount must be greater than 0",
        },
      },
    },
    balance_before: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    balance_after: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    interest_earned: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    months_held: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // hanya ada created_at
  }
);

module.exports = Transaction;
