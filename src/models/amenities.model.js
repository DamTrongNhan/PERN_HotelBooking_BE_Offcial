"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class amenities extends Model {
    static associate(models) {
      amenities.belongsTo(models.allCodes, {
        foreignKey: "amenitiesTypeKey",
        targetKey: "keyMap",
        as: "amenitiesTypeData",
      });
      // ---------------------------------------

      amenities.belongsTo(models.roomTypes, {
        foreignKey: "roomTypeId",
        targetKey: "id",
        as: "amenitiesData",
      });
    }
  }
  amenities.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      roomTypeId: { type: DataTypes.UUID, allowNull: false },
      amenitiesTypeKey: { type: DataTypes.STRING, allowNull: false },

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
      modelName: "amenities",
      freezeTableName: true,
    }
  );
  return amenities;
};
