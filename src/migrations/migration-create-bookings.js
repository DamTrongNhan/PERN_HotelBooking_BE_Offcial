"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

      // advance by jwt
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bookings");
  },
};
