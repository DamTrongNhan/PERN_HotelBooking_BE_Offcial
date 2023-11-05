"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class servicesBooking extends Model {
    static associate(models) {
      servicesBooking.belongsTo(models.services, {
        foreignKey: "serviceTypeKey",
        targetKey: "keyMap",
        as: "serviceTypeData",
      });
      // ---------------------------------------

      servicesBooking.belongsTo(models.bookings, {
        foreignKey: "bookingId",
        targetKey: "id",
        as: "serviceTypeDataBookings",
      });
    }
  }
  servicesBooking.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      bookingId: { type: DataTypes.UUID, allowNull: false },
      serviceTypeKey: { type: DataTypes.STRING, allowNull: false },

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
      modelName: "servicesBooking",
      freezeTableName: true,
    }
  );
  return servicesBooking;
};
