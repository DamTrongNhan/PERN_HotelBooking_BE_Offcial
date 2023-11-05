"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class roomTypes extends Model {
    static associate(models) {
      roomTypes.belongsTo(models.allCodes, {
        foreignKey: "roomTypeKey",
        targetKey: "keyMap",
        as: "roomTypeDataRoomTypes",
      });

      roomTypes.belongsTo(models.allCodes, {
        foreignKey: "bedTypeKey",
        targetKey: "keyMap",
        as: "bedTypeData",
      });
      // ---------------------------------

      roomTypes.hasMany(models.rooms, {
        foreignKey: "roomTypeKey",
        as: "roomTypesDataRooms",
      });
      // ---------------------------------

      roomTypes.hasMany(models.photos, {
        foreignKey: "roomTypeId",
        as: "photosDataRoomTypes",
      });
      // ---------------------------------

      roomTypes.hasMany(models.amenities, {
        foreignKey: "roomTypeId",
        as: "amenitiesData",
      });
      // ---------------------------------

      roomTypes.hasMany(models.reviews, {
        foreignKey: "roomTypeId",
        as: "roomTypesDataReviews",
      });
    }
  }
  roomTypes.init(
    {
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
      size: { type: DataTypes.INTEGER, allowNull: false },
      checkInOutTime: { type: DataTypes.STRING, allowNull: false },

      featuresVi: { type: DataTypes.TEXT, allowNull: false },
      featuresEn: { type: DataTypes.TEXT, allowNull: false },
      descriptionVi: { type: DataTypes.TEXT, allowNull: false },
      descriptionEn: { type: DataTypes.TEXT, allowNull: false },

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
      modelName: "roomTypes",
      freezeTableName: true,
    }
  );
  return roomTypes;
};
