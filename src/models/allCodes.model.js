"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class allCodes extends Model {
    static associate(models) {
      allCodes.hasMany(models.users, {
        foreignKey: "roleKey",
        as: "roleData",
      });
      allCodes.hasMany(models.users, {
        foreignKey: "genderKey",
        as: "genderData",
      });
      allCodes.hasMany(models.users, {
        foreignKey: "userStatusKey",
        as: "userStatusData",
      });
      // --------------------------------------

      allCodes.hasMany(models.roomTypes, {
        foreignKey: "roomTypeKey",
        as: "roomTypeDataRoomTypes",
      });
      allCodes.hasMany(models.roomTypes, {
        foreignKey: "bedTypeKey",
        as: "bedTypeData",
      });
      // --------------------------------------

      allCodes.hasMany(models.rooms, {
        foreignKey: "roomTypeKey",
        as: "roomTypeDataRooms",
      });

      allCodes.hasMany(models.rooms, {
        foreignKey: "roomStatusKey",
        as: "roomStatusData",
      });
      // --------------------------------------

      allCodes.hasMany(models.bookings, {
        foreignKey: "paymentTypeKey",
        as: "paymentTypeDataBookings",
      });
      allCodes.hasMany(models.bookings, {
        foreignKey: "paymentStatusKey",
        as: "paymentStatusData",
      });
      allCodes.hasMany(models.bookings, {
        foreignKey: "bookingStatusKey",
        as: "bookingStatusData",
      });
      // --------------------------------------

      allCodes.hasMany(models.amenities, {
        foreignKey: "amenitiesTypeKey",
        as: "amenitiesTypeData",
      });
    }
  }
  allCodes.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      keyMap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valueEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valueVi: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "allCodes",
      freezeTableName: true,
    }
  );
  return allCodes;
};
