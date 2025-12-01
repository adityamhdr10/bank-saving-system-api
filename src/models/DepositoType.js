const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DepositoType = sequelize.define(
  "DepositoType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Deposito type name cannot be empty",
        },
      },
    },
    yearly_return: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Yearly return must be positive",
        },
        max: {
          args: [100],
          msg: "Yearly return cannot exceed 100%",
        },
      },
    },
  },
  {
    tableName: "deposito_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = DepositoType;
