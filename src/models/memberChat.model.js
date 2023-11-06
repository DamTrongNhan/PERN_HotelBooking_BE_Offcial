"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class memberChat extends Model {
    static associate(models) {
      memberChat.hasMany(models.contentChat, {
        foreignKey: "memberChatId",
        as: "contentChatData",
      });
      // --------------------------------------------

      memberChat.belongsTo(models.users, {
        foreignKey: "userId1",
        targetKey: "id",
        as: "user1InfoData",
      });
      memberChat.belongsTo(models.users, {
        foreignKey: "userId2",
        targetKey: "id",
        as: "user2InfoData",
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

      userId1: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId2: {
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
