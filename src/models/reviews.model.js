"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    static associate(models) {
      reviews.belongsTo(models.users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userDataReviews",
      });
      // ------------------------------------

      reviews.belongsTo(models.roomTypes, {
        foreignKey: "roomTypeId",
        targetKey: "id",
        as: "roomTypesDataReviews",
      });
    }
  }
  reviews.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      roomTypeId: { type: DataTypes.UUID, allowNull: false },

      star: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.TEXT, allowNull: false },

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
      modelName: "reviews",
      freezeTableName: true,
    }
  );
  return reviews;
};
