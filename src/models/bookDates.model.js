"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookDates extends Model {
    static associate(models) {
      bookDates.belongsTo(models.rooms, {
        foreignKey: "roomId",
        targetKey: "id",
        as: "bookDatesData",
      });
    }
  }
  bookDates.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      bookingId: { type: DataTypes.UUID, allowNull: false },
      roomId: { type: DataTypes.UUID, allowNull: false },

      checkIn: { type: DataTypes.DATE, allowNull: false },
      checkOut: { type: DataTypes.DATE, allowNull: false },

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
      modelName: "bookDates",
      freezeTableName: true,
    }
  );
  return bookDates;
};
