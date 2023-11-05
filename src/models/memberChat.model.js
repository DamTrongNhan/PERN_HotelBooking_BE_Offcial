"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class memberChat extends Model {
    static associate(models) {
      memberChat.hasOne(models.contentChat, {
        foreignKey: "memberChatId",
        as: "contentChatData",
      });
      memberChat.belongsTo(models.users, {
        foreignKey: "adminId",
        targetKey: "id",
        as: "adminInfoData",
      });
      memberChat.belongsTo(models.users, {
        foreignKey: "customerId",
        targetKey: "id",
        as: "customerInfoData",
      });
    }
  }
  memberChat.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.UUID,
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
      modelName: "memberChat",
      freezeTableName: true,
    }
  );
  return memberChat;
};
