"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("photos", {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      roomTypeId: { type: DataTypes.UUID },
      userId: { type: DataTypes.UUID },
      postId: { type: DataTypes.UUID },
      serviceId: { type: DataTypes.UUID },

      url: { type: DataTypes.TEXT, allowNull: false },
      publicId: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },

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
    await queryInterface.dropTable("photos");
  },
};
