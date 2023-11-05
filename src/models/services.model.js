"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class services extends Model {
    static associate(models) {
      services.hasMany(models.servicesBooking, {
        foreignKey: "serviceTypeKey",
        as: "serviceTypeData",
      });
      services.hasOne(models.photos, {
        foreignKey: "serviceId",
        as: "thumbnailDataServices",
      });
    }
  }
  services.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      keyMap: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      titleVi: { type: DataTypes.STRING, allowNull: false },
      titleEn: { type: DataTypes.STRING, allowNull: false },
      descriptionVi: { type: DataTypes.TEXT, allowNull: false },
      descriptionEn: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.FLOAT, allowNull: false },

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
      modelName: "services",
      freezeTableName: true,
    }
  );
  return services;
};
