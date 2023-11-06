"use strict";
import bcrypt from "bcrypt";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.belongsTo(models.allCodes, {
        foreignKey: "roleKey",
        targetKey: "keyMap",
        as: "roleData",
      });
      users.belongsTo(models.allCodes, {
        foreignKey: "genderKey",
        targetKey: "keyMap",
        as: "genderData",
      });
      users.belongsTo(models.allCodes, {
        foreignKey: "userStatusKey",
        targetKey: "keyMap",
        as: "userStatusData",
      });
      // ------------------------------------

      users.hasMany(models.bookings, {
        foreignKey: "userId",
        as: "userDataBookings",
      });
      // ------------------------------------

      users.hasMany(models.reviews, {
        foreignKey: "userId",
        as: "userDataReviews",
      });
      // ------------------------------------

      users.hasOne(models.photos, { foreignKey: "userId", as: "avatarData" });
      // ------------------------------------

      users.hasMany(models.memberChat, {
        foreignKey: "userId1",
        as: "user1InfoData",
      });
      users.hasMany(models.memberChat, {
        foreignKey: "userId2",
        as: "user2InfoData",
      });
      // ------------------------------------

      users.hasMany(models.contentChat, {
        foreignKey: "senderId",
        as: "senderInfoData",
      });
      users.hasMany(models.contentChat, {
        foreignKey: "readerId",
        as: "readerInfoData",
      });
    }
  }
  users.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      CIC: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      birthday: {
        type: DataTypes.DATE,
      },
      roleKey: {
        type: DataTypes.STRING,
        defaultValue: "R2",
        allowNull: false,
      },
      genderKey: {
        type: DataTypes.STRING,
      },
      userStatusKey: {
        type: DataTypes.STRING,
        defaultValue: "SU1",
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
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
      modelName: "users",
      freezeTableName: true,
    }
  );
  users.beforeCreate(async (user, options) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    } catch (error) {
      console.error(error);
    }
  });
  return users;
};
