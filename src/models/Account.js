const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
    },
    deposito_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "deposito_types",
        key: "id",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: "Balance cannot be negative",
        },
      },
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Account;
