import db from "../models";
import { Op } from "sequelize";
import dayjs from "dayjs";

export const getAllStatistics = async (req, res, next) => {
  try {
    const { count: users } = await db.users.findAndCountAll({
      where: { roleKey: { [Op.ne]: "R1" } },
    });
    const { count: roomTypes } = await db.roomTypes.findAndCountAll({
      where: {},
    });
    const { count: rooms } = await db.rooms.findAndCountAll({
      where: {},
    });
    const { count: reviews } = await db.reviews.findAndCountAll({
      where: {},
    });

    const { count: bookingsCompleted, rows: bookingsData } =
      await db.bookings.findAndCountAll({
        where: { bookingStatusKey: { [Op.eq]: "SB4" } },
      });

    const { count: bookings } = await db.bookings.findAndCountAll({
      where: { bookingStatusKey: { [Op.notIn]: ["SB4", "SB5"] } },
    });

    const { count: bookingsCancelled } = await db.bookings.findAndCountAll({
      where: { bookingStatusKey: { [Op.eq]: "SB5" } },
    });

    const totalProfit = bookingsData.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    const revenue = bookingsData.map((item) => {
      return {
        date: dayjs(item?.createdAt).format("DD/MM"),
        profit: item?.totalPrice,
      };
    });

    const data = {
      users,
      roomTypes,
      rooms,
      reviews,
      bookingsCompleted,
      bookings,
      bookingsCancelled,
      totalProfit,
      revenue,
    };

    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};

export const getBookingsCalendar = async (req, res, next) => {
  try {
    const data = await db.bookings.findAll({
      where: { bookingStatusKey: { [Op.notIn]: ["SB4", "SB5"] } },
      include: [
        {
          model: db.payments,
          as: "paymentData",
          include: [
            {
              model: db.allCodes,
              as: "paymentTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.allCodes,
              as: "paymentStatusData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
        {
          model: db.allCodes,
          as: "bookingStatusData",
          attributes: ["valueVi", "valueEn"],
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
              ],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};
