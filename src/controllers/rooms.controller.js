import db from "../models";

import dayjs from "dayjs";
import { Op } from "sequelize";

export const createRoom = (req, res, next) => {
  const data = req.body;

  db.rooms
    .create(data)
    .then((createRoom) => {
      if (createRoom) {
        return res.status(200).json({ message: "Room successfully created" });
      } else next({ statusCode: 404, message: "Not found" });
    })
    .catch((err) => next(err));
};

export const updateRoom = (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  db.rooms
    .update(data, { where: { id } })
    .then(([updateRoom]) => {
      if (updateRoom !== 0) {
        return res.status(200).json({
          message: "Room information updated successfully",
        });
      } else {
        return next({ statusCode: 404, message: "Not Found" });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
export const updateRoomStatus = (req, res, next) => {
  const id = req.params.id;
  const { roomStatusKey } = req.body;
  db.rooms
    .update({ roomStatusKey }, { where: { id } })
    .then(([updateRoomStatus]) => {
      if (updateRoomStatus !== 0) {
        return res.status(200).json({
          message: "The room status has been successfully updated.",
        });
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    })
    .catch((error) => next(error));
};

export const deleteRoom = (req, res, next) => {
  const id = req.params.id;

  db.rooms
    .destroy({ where: { id } })
    .then((destroyRoom) => {
      if (destroyRoom) {
        return res.status(200).json({ message: "Delete Room successfully" });
      } else return next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllRooms = (req, res, next) => {
  db.rooms
    .findAll({
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRooms",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "roomStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.roomTypes,
          as: "roomTypesDataRooms",
        },
      ],
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
export const getRoom = (req, res, next) => {
  const id = req.params.id;

  db.rooms
    .findOne({
      where: { id, roomStatusKey: { [Op.ne]: "SR2" } },
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRooms",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "roomStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.roomTypes,
          as: "roomTypesDataRooms",
        },
      ],
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllRoomsByRoomTypeKey = (req, res, next) => {
  const roomTypeKey = req.params.roomTypeKey;

  db.rooms
    .findAll({
      where: { roomTypeKey },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRooms",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "roomStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.roomTypes,
          as: "roomTypesDataRooms",
        },
      ],
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data.length > 0) {
        return res.status(200).json({ data });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllRoomsAvailableByRoomTypeKey = (req, res, next) => {
  const { roomTypeKey, checkIn, checkOut } = req.query;
  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  db.bookDates
    .findAll({
      where: {
        checkIn: { [Op.lte]: checkOutDate },
        checkOut: { [Op.gte]: checkInDate },
      },
      attributes: ["roomId"],
    })
    .then((bookedRoomIds) => {
      const bookedRoomIdsArray = bookedRoomIds.map(
        (bookDates) => bookDates.roomId
      );

      db.rooms
        .findAll({
          order: [["createdAt", "ASC"]],
          where: {
            roomTypeKey,
            roomStatusKey: {
              [Op.ne]: "SR2",
            },
            id: {
              [Op.notIn]: bookedRoomIdsArray,
            },
          },
        })
        .then((availableRooms) => {
          return res.status(200).json({ data: availableRooms });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

export const checkRoomAvailable = (req, res, next) => {
  const { checkIn, checkOut, roomId } = req.query;
  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  if (checkInDate > checkOutDate) {
    return res
      .status(400)
      .json({ isAvailable: false, message: "Invalid time" });
  } else {
    db.bookDates
      .findAll({
        where: {
          roomId,
          checkIn: {
            [Op.lte]: checkOutDate,
          },
          checkOut: {
            [Op.gte]: checkInDate,
          },
        },
        raw: true,
      })
      .then((bookings) => {
        if (bookings.length === 0) {
          return res.status(200).json({ isAvailable: true });
        } else {
          return res.status(409).json({
            isAvailable: false,
            message: "The room is not available for this time period.",
          });
        }
      })
      .catch((err) => next(err));
  }
};
