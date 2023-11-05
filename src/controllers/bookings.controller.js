import db from "../models";
import { Op } from "sequelize";
import dayjs from "dayjs";

import {
  sendConfirmation,
  sendThankYouEmail,
  sendCancel,
} from "../utils/sendMail";

let buildUrlConfirm = (token, bookingId) => {
  let result = "";
  result = `${process.env.REACT_URL}/verify-booking?token=${token}&bookingId=${bookingId}`;
  return result;
};

export const createBooking = (req, res, next) => {
  const { language, checkIn, checkOut, ...others } = req.body;
  const data = { ...others };

  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  if (checkInDate > checkOutDate) {
    return res.status(400).json({ message: "Invalid time" });
  }

  db.bookings
    .create({
      ...data,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      paymentStatusKey: "SP1",
    })
    .then((createBooking) => {
      if (createBooking) {
        db.bookDates
          .create({
            bookingId: createBooking.id,
            roomId: createBooking.roomId,
            checkIn: createBooking.checkIn,
            checkOut: createBooking.checkOut,
          })
          .then((createBookDates) => {
            if (createBookDates) {
              sendConfirmation({
                email: createBooking.email,
                firstName: createBooking.firstName,
                lastName: createBooking.lastName,
                bookingCode: createBooking.bookingCode,
                checkIn: createBooking.checkIn,
                checkOut: createBooking.checkOut,
                days: createBooking.days,
                adult: createBooking.adult,
                child: createBooking.child,
                language,
                urlConfirm: buildUrlConfirm(
                  createBooking.verifyBookingToken,
                  createBooking.id
                ),
              })
                .then((info) => {
                  if (info) {
                    return res.status(200).json({
                      message: "Room booked successfully",
                      bookingCode: createBooking.bookingCode,
                    });
                  } else {
                    return next({ statusCode: 404, message: "Not found" });
                  }
                })
                .catch((error) => next(error));
            } else {
              return next({ statusCode: 404, message: "Not found" });
            }
          })
          .catch((error) => next(error));
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    })
    .catch((err) => next(err));
};

export const updateBookingStatus = (req, res, next) => {
  const id = req.params.id;
  const { bookingStatusKey, roomId, email, language } = req.body;

  const statusMap = {
    SB1: "SB0",
    SB2: "SB1",
    SB3: "SB2",
    SB4: "SB3",
  };
  const updatedConditions = statusMap[bookingStatusKey] || "";

  if (bookingStatusKey === "SB5") {
    const cancelTime = dayjs().toDate();
    db.bookings
      .update(
        { bookingStatusKey, cancelTime },
        {
          where: {
            id,
            bookingStatusKey: { [Op.notIn]: ["SB1", "SB2", "SB3", "SB4"] },
          },
        }
      )
      .then(([updateBooking]) => {
        if (updateBooking !== 0) {
          db.bookDates
            .destroy({ where: { roomId, bookingId: id } })
            .then(() => {
              sendCancel({ email, language })
                .then(() => {
                  return res.status(200).json({
                    message: "Cancellation of booking successful",
                  });
                })
                .catch((err) => {
                  return next(err);
                });
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          return next({
            statusCode: 400,
            message: "Confirmed reservations cannot be canceled",
          });
        }
      })

      .catch((err) => {
        return next(err);
      });
  } else {
    db.bookings
      .update(
        { bookingStatusKey },
        { where: { id, bookingStatusKey: updatedConditions } }
      )
      .then(([updateBooking]) => {
        if (updateBooking !== 0) {
          if (bookingStatusKey === "SB2") {
            db.bookings
              .update(
                { paymentStatusKey: "SP2" },
                { where: { id, paymentStatusKey: "SP1" } }
              )
              .then(([updatePaymentStatus]) => {
                if (updatePaymentStatus !== 0) {
                  return res.status(200).json({
                    message: "The customer has checked in.",
                  });
                } else {
                  return next({
                    statusCode: "404",
                    message: "Not found",
                  });
                }
              })
              .catch((err) => {
                return next(err);
              });
          } else if (bookingStatusKey === "SB3") {
            db.bookDates
              .destroy({ where: { roomId, bookingId: id } })
              .then(() => {
                db.rooms
                  .update(
                    { roomStatusKey: "SR3" },
                    { where: { id: roomId, roomStatusKey: "SR1" } }
                  )
                  .then(([updateRoomStatus]) => {
                    if (updateRoomStatus !== 0) {
                      sendThankYouEmail({ email, language })
                        .then((sendThankYou) => {
                          if (sendThankYou) {
                            return res.status(200).json({
                              message: "The customer has checked out",
                            });
                          } else {
                            return next({
                              statusCode: "404",
                              message: "Not found",
                            });
                          }
                        })
                        .catch((err) => {
                          return next(err);
                        });
                    } else {
                      return next({ statusCode: "404", message: "Not found" });
                    }
                  })
                  .catch((err) => {
                    return next(err);
                  });
              })
              .catch((error) => next(error));
          } else if (bookingStatusKey === "SB4") {
            db.rooms
              .increment("numberBookings", { where: { id: roomId } })
              .then(() => {
                db.rooms
                  .update(
                    { roomStatusKey: "SR1" },
                    { where: { id: roomId, roomStatusKey: "SR3" } }
                  )
                  .then(([updateRoomStatus]) => {
                    if (updateRoomStatus !== 0) {
                      return res.status(200).json({
                        message: "The booking has been completed",
                      });
                    } else {
                      return next({ statusCode: "404", message: "Not found" });
                    }
                  })
                  .catch((err) => {
                    return next(err);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          } else {
            return res.status(404).json({
              message: "The booking status has been successfully updated.",
            });
          }
        } else {
          return next({
            statusCode: 404,
            message: "Reservations that have been updated cannot be returned.",
          });
        }
      })
      .catch((err) => {
        return next(err);
      });
  }
};

export const verifyBooking = (req, res, next) => {
  const { token, bookingId } = req.body;
  db.bookings
    .findOne({ where: { id: bookingId, verifyBookingToken: token } })
    .then((booking) => {
      if (booking) {
        db.bookings
          .update(
            { bookingStatusKey: "SB1" },
            {
              where: {
                id: bookingId,
                verifyBookingToken: token,
                bookingStatusKey: { [Op.eq]: "SB0" },
              },
            }
          )
          .then(([verifyBooking]) => {
            if (verifyBooking !== 0) {
              return res.status(200).json({ message: "Reservation confirmed" });
            } else {
              return next({
                statusCode: 404,
                message: "Reservation has been confirmed",
              });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        return next({
          statusCode: 404,
          message: "No booking found",
        });
      }
    })
    .catch((err) => next(err));
};

export const getAllBookings = (req, res, next) => {
  db.bookings
    .findAll({
      order: [["createdAt", "ASC"]],
      where: {
        bookingStatusKey: {
          [Op.notIn]: ["SB4", "SB5"],
        },
      },
      include: [
        {
          model: db.allCodes,
          as: "bookingStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentTypeDataBookings",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.users,
          as: "userDataBookings",
          include: [
            {
              model: db.photos,
              as: "avatarData",
              attributes: ["url"],
            },
            {
              model: db.allCodes,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "userStatusData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.rooms,
          as: "roomDataBookings",
          include: [
            {
              model: db.allCodes,
              as: "roomTypeDataRooms",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.roomTypes,
              as: "roomTypesDataRooms",
              include: [
                {
                  model: db.allCodes,
                  as: "bedTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.photos,
                  as: "photosDataRoomTypes",
                  attributes: ["url", "type"],
                },
                {
                  model: db.amenities,
                  as: "amenitiesData",
                  include: [
                    {
                      model: db.allCodes,
                      as: "amenitiesTypeData",
                      attributes: ["valueVi", "valueEn"],
                    },
                  ],
                },
              ],
            },
          ],
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

export const getAllBookingHistories = (req, res, next) => {
  db.bookings
    .findAll({
      order: [["createdAt", "ASC"]],
      where: {
        bookingStatusKey: {
          [Op.in]: ["SB4", "SB5"],
        },
      },
      include: [
        {
          model: db.allCodes,
          as: "bookingStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentTypeDataBookings",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.users,
          as: "userDataBookings",
          include: [
            {
              model: db.photos,
              as: "avatarData",
              attributes: ["url"],
            },
            {
              model: db.allCodes,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "userStatusData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.rooms,
          as: "roomDataBookings",
          include: [
            {
              model: db.allCodes,
              as: "roomTypeDataRooms",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.roomTypes,
              as: "roomTypesDataRooms",
              include: [
                {
                  model: db.allCodes,
                  as: "bedTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.photos,
                  as: "photosDataRoomTypes",
                  attributes: ["url", "type"],
                },
                {
                  model: db.amenities,
                  as: "amenitiesData",
                  include: [
                    {
                      model: db.allCodes,
                      as: "amenitiesTypeData",
                      attributes: ["valueVi", "valueEn"],
                    },
                  ],
                },
              ],
            },
          ],
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

export const getBooking = (req, res, next) => {
  const id = req.params.id;

  db.bookings
    .findOne({
      order: [["createdAt", "ASC"]],
      where: {
        id,
        bookingStatusKey: {
          [Op.notIn]: ["SB4", "SB5"],
        },
      },
      include: [
        {
          model: db.allCodes,
          as: "bookingStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentTypeDataBookings",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.users,
          as: "userDataBookings",
          include: [
            {
              model: db.photos,
              as: "avatarData",
              attributes: ["url"],
            },
            {
              model: db.allCodes,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "userStatusData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.rooms,
          as: "roomDataBookings",
          include: [
            {
              model: db.allCodes,
              as: "roomTypeDataRooms",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.roomTypes,
              as: "roomTypesDataRooms",
              include: [
                {
                  model: db.allCodes,
                  as: "bedTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.photos,
                  as: "photosDataRoomTypes",
                  attributes: ["url", "type"],
                },
                {
                  model: db.amenities,
                  as: "amenitiesData",
                  include: [
                    {
                      model: db.allCodes,
                      as: "amenitiesTypeData",
                      attributes: ["valueVi", "valueEn"],
                    },
                  ],
                },
              ],
            },
          ],
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
