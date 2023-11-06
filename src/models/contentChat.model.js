"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contentChat extends Model {
    static associate(models) {
      contentChat.belongsTo(models.memberChat, {
        foreignKey: "memberChatId",
        as: "contentChatData",
      });
      // ---------------------------------------

      contentChat.belongsTo(models.users, {
        foreignKey: "senderId",
        targetKey: "id",
        as: "senderInfoData",
      });
      contentChat.belongsTo(models.users, {
        foreignKey: "readerId",
        targetKey: "id",
        as: "readerInfoData",
      });
    }
  }
  contentChat.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      memberChatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      readerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: { type: DataTypes.TEXT, allowNull: false },

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
      modelName: "contentChat",
      freezeTableName: true,
    }
  );
  return contentChat;
};
