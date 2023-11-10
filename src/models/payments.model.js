"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    static associate(models) {
      payments.belongsTo(models.allCodes, {
        foreignKey: "paymentTypeKey",
        targetKey: "keyMap",
        as: "paymentTypeData",
      });
      payments.belongsTo(models.allCodes, {
        foreignKey: "paymentStatusKey",
        targetKey: "keyMap",
        as: "paymentStatusData",
      });
      // -------------------------------------

      payments.belongsTo(models.bookings, {
        foreignKey: "bookingCode",
        targetKey: "bookingCode",
        as: "paymentData",
      });
    }
  }
  payments.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      bookingCode: { type: DataTypes.UUID, allowNull: false },

      paymentTypeKey: { type: DataTypes.STRING, allowNull: false },
      paymentStatusKey: { type: DataTypes.STRING, allowNull: false },

      details: { type: DataTypes.TEXT },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "payments",
      freezeTableName: true,
    }
  );
  return payments;
};
