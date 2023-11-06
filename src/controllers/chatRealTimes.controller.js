import db from "../models/index";
import _ from "lodash";
import { Op } from "sequelize";

export const getAllMemberChatByAdminId = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const allChats = await db.memberChat.findAll({
      where: { adminId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.contentChat,
          as: "contentChatData",
        },
        {
          model: db.users,
          as: "adminInfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
        {
          model: db.users,
          as: "customerInfoData",
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

export const getMemberChatByCustomerId = async (req, res, next) => {
  try {
    const { customerId, adminId } = req.body;
    const chat = await db.memberChat.findOne({
      where: { customerId },
      include: [
        {
          model: db.contentChat,
          as: "contentChatData",
        },
        {
          model: db.users,
          as: "adminInfoData",
          attributes: ["firstName", "lastName", "email", "id"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url"] },
          ],
        },
        {
          model: db.users,
          as: "customerInfoData",
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
        adminId,
        customerId,
      });

      if (newMemberChat) {
        const chat = await db.memberChat.findOne({
          where: { customerId },
          include: [
            {
              model: db.contentChat,
              as: "contentChatData",
            },
            {
              model: db.users,
              as: "adminInfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
            {
              model: db.users,
              as: "customerInfoData",
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
      include: [
        {
          model: db.memberChat,
          as: "contentChatData",
          attributes: ["adminId", "customerId"],
          include: [
            {
              model: db.users,
              as: "adminInfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
            {
              model: db.users,
              as: "customerInfoData",
              attributes: ["firstName", "lastName", "email", "id"],
              include: [
                { model: db.photos, as: "avatarData", attributes: ["url"] },
              ],
            },
          ],
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
    const data = req.body;
    const contentChat = await db.contentChat.create(data);
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
