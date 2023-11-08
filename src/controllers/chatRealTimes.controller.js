import db from "../models/index";
import _ from "lodash";
import { Op } from "sequelize";

export const getAllMemberChat = async (req, res, next) => {
  try {
    const userIdLoggedIn = req.user.id;

    const allChats = await db.memberChat.findAll({
      where: {
        [Op.or]: [{ userId1: userIdLoggedIn }, { userId2: userIdLoggedIn }],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.contentChat,
          as: "contentChatData",
        },
        {
          model: db.users,
          as: "user1InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
        {
          model: db.users,
          as: "user2InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    return res.status(200).json({ data: allChats });
  } catch (error) {
    return next(error);
  }
};

export const getMemberChat = async (req, res, next) => {
  try {
    const userIdLoggedIn = req.user.id;
    const { userId } = req.body;

    const chat = await db.memberChat.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ userId1: userIdLoggedIn }, { userId2: userId }] },
          { [Op.and]: [{ userId2: userIdLoggedIn }, { userId1: userId }] },
        ],
      },
      include: [
        {
          model: db.contentChat,
          as: "contentChatData",
        },
        {
          model: db.users,
          as: "user1InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
        {
          model: db.users,
          as: "user2InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
      ],
      raw: false,
      nest: true,
    });
    if (!_.isEmpty(chat)) {
      return res.status(200).json({ data: chat });
    } else {
      const newMemberChat = await db.memberChat.create({
        userId1: userIdLoggedIn,
        userId2: userId,
      });

      if (newMemberChat) {
        const chat = await db.memberChat.findOne({
          where: { userId1: userIdLoggedIn, userId2: userId },
          include: [
            {
              model: db.contentChat,
              as: "contentChatData",
            },
            {
              model: db.users,
              as: "user1InfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
            {
              model: db.users,
              as: "user2InfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!_.isEmpty(chat)) {
          return res.status(200).json({ data: chat });
        } else {
          return next({ statusCode: 404, message: "Not found" });
        }
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    }
  } catch (err) {
    return next(err);
  }
};

export const getAllContentChat = async (req, res, next) => {
  try {
    const { id: memberChatId } = req.params;

    const contentChat = await db.contentChat.findAll({
      where: { memberChatId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.users,
          as: "senderInfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: { model: db.photos, as: "avatarData", attributes: ["url"] },
        },
        {
          model: db.users,
          as: "readerInfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: { model: db.photos, as: "avatarData", attributes: ["url"] },
        },
      ],
      raw: false,
      nest: true,
    });
    return res.status(200).json({ data: contentChat });
  } catch (err) {
    return next(err);
  }
};

export const createContentChat = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const data = req.body;
    const contentChat = await db.contentChat.create({ senderId, ...data });
    if (contentChat) {
      return res.status(200).json({ data: contentChat });
    } else {
      return next({ statusCode: 404, message: "Not found" });
    }
  } catch (err) {
    return next(err);
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${req.query.search}%` } },
            { lastName: { [Op.iLike]: `%${req.query.search}%` } },
            { email: { [Op.iLike]: `%${req.query.search}%` } },
          ],
        }
      : {};

    const users = await db.users.findAll({
      where: {
        ...keyword,
        id: { [Op.ne]: req.user.id },
        roleKey: { [Op.ne]: "R1" },
      },
      include: [{ model: db.photos, as: "avatarData", attributes: ["url"] }],
      raw: false,
      nest: true,
    });

    res.status(200).json({ data: users });
  } catch (error) {
    return next(error);
  }
};

export const getMemberChatAdmin = async (req, res, next) => {
  try {
    const userIdLoggedIn = req.user.id;

    const { id: userIdAdmin } = await db.users.findOne({
      where: { roleKey: "R1" },
    });

    if (!userIdAdmin) {
      return next({ statusCode: 404, message: "Admin not found" });
    }

    const chat = await db.memberChat.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ userId1: userIdLoggedIn }, { userId2: userIdAdmin }] },
          { [Op.and]: [{ userId2: userIdLoggedIn }, { userId1: userIdAdmin }] },
        ],
      },
      include: [
        {
          model: db.contentChat,
          as: "contentChatData",
        },
        {
          model: db.users,
          as: "user1InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
        {
          model: db.users,
          as: "user2InfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
      ],
      raw: false,
      nest: true,
    });
    if (!_.isEmpty(chat)) {
      return res.status(200).json({ data: chat });
    } else {
      const newMemberChat = await db.memberChat.create({
        userId1: userIdLoggedIn,
        userId2: userIdAdmin,
      });

      if (newMemberChat) {
        const chat = await db.memberChat.findOne({
          where: { userId1: userIdLoggedIn, userId2: userIdAdmin },
          include: [
            {
              model: db.contentChat,
              as: "contentChatData",
            },
            {
              model: db.users,
              as: "user1InfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
            {
              model: db.users,
              as: "user2InfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!_.isEmpty(chat)) {
          return res.status(200).json({ data: chat });
        } else {
          return next({ statusCode: 404, message: "Not found" });
        }
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    }
  } catch (err) {
    return next(err);
  }
};
