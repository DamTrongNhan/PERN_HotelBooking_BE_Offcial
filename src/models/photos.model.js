"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class photos extends Model {
    static associate(models) {
      photos.belongsTo(models.roomTypes, {
        foreignKey: "roomTypeId",
        targetKey: "id",
        as: "photosDataRoomTypes",
      });
      // ---------------------------------

      photos.belongsTo(models.users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "avatarData",
      });
      // ---------------------------------

      photos.belongsTo(models.posts, {
        foreignKey: "postId",
        targetKey: "id",
        as: "thumbnailDataPost",
      });
      // ---------------------------------

      photos.belongsTo(models.services, {
        foreignKey: "serviceId",
        targetKey: "id",
        as: "thumbnailDataServices",
      });
    }
  }
  photos.init(
    {
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
    },
    {
      sequelize,
      modelName: "photos",
      freezeTableName: true,
    }
  );
  return photos;
};
