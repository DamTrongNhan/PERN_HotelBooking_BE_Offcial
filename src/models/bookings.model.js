"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    static associate(models) {
      bookings.belongsTo(models.allCodes, {
        foreignKey: "paymentTypeKey",
        targetKey: "keyMap",
        as: "paymentTypeDataBookings",
      });
      bookings.belongsTo(models.allCodes, {
        foreignKey: "paymentStatusKey",
        targetKey: "keyMap",
        as: "paymentStatusData",
      });
      bookings.belongsTo(models.allCodes, {
        foreignKey: "bookingStatusKey",
        targetKey: "keyMap",
        as: "bookingStatusData",
      });
      // ----------------------------------------
      bookings.belongsTo(models.users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userDataBookings",
      });
      // ----------------------------------------

      bookings.belongsTo(models.rooms, {
        foreignKey: "roomId",
        targetKey: "id",
        as: "roomDataBookings",
      });
      // ----------------------------------------

      bookings.hasMany(models.servicesBooking, {
        foreignKey: "bookingId",
        as: "serviceTypeDataBookings",
      });
    }
  }
  bookings.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      roomId: { type: DataTypes.UUID, allowNull: false },

      paymentTypeKey: { type: DataTypes.STRING, allowNull: false },
      paymentStatusKey: { type: DataTypes.STRING, allowNull: false },

      bookingStatusKey: {
        type: DataTypes.STRING,
        defaultValue: "SB0",
        allowNull: false,
      },

      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING, allowNull: false },
      CIC: { type: DataTypes.STRING, allowNull: false },

      checkIn: { type: DataTypes.DATE, allowNull: false },
      checkOut: { type: DataTypes.DATE, allowNull: false },
      days: { type: DataTypes.INTEGER, allowNull: false },
      adult: { type: DataTypes.INTEGER, allowNull: false },
      child: { type: DataTypes.INTEGER, allowNull: false },

      totalPrice: { type: DataTypes.FLOAT, allowNull: false },

      bookingCode: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      verifyBookingToken: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      cancelTime: {
        type: DataTypes.DATE,
      },

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
      modelName: "bookings",
      freezeTableName: true,
    }
  );
  return bookings;
};
