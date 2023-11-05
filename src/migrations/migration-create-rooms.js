"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rooms", {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      number: { type: DataTypes.INTEGER, allowNull: false },

      roomTypeKey: { type: DataTypes.STRING, allowNull: false },
      roomStatusKey: {
        type: DataTypes.STRING,
        defaultValue: "SR1",
        allowNull: false,
      },

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
    await queryInterface.dropTable("rooms");
  },
};
