"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("roomTypes", {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      roomTypeKey: { type: DataTypes.STRING, allowNull: false },
      bedTypeKey: { type: DataTypes.STRING, allowNull: false },

      pricePerNight: { type: DataTypes.FLOAT, allowNull: false },
      occupancy: { type: DataTypes.INTEGER, allowNull: false },
      size: { type: DataTypes.STRING, allowNull: false },
      checkInOutTime: { type: DataTypes.STRING, allowNull: false },

      featuresVi: { type: DataTypes.TEXT, allowNull: false },
      featuresEn: { type: DataTypes.TEXT, allowNull: false },
      descriptionVi: { type: DataTypes.TEXT, allowNull: false },
      descriptionEn: { type: DataTypes.TEXT, allowNull: false },

      numberBookings: { type: DataTypes.INTEGER, defaultValue: 0 },

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
    await queryInterface.dropTable("roomTypes");
  },
};
