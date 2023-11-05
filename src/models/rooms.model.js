"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    static associate(models) {
      rooms.belongsTo(models.allCodes, {
        foreignKey: "roomTypeKey",
        targetKey: "keyMap",
        as: "roomTypeDataRooms",
      });

      rooms.belongsTo(models.allCodes, {
        foreignKey: "roomStatusKey",
        targetKey: "keyMap",
        as: "roomStatusData",
      });
      // ---------------------------------

      rooms.belongsTo(models.roomTypes, {
        foreignKey: "roomTypeKey",
        targetKey: "roomTypeKey",
        as: "roomTypesDataRooms",
      });
      // ---------------------------------

      rooms.hasMany(models.bookDates, {
        foreignKey: "roomId",
        as: "bookDatesData",
      });
      // ---------------------------------

      rooms.hasMany(models.bookings, {
        foreignKey: "roomId",
        as: "roomDataBookings",
      });
    }
  }
  rooms.init(
    {
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
    },
    {
      sequelize,
      modelName: "rooms",
      freezeTableName: true,
    }
  );
  return rooms;
};
