import db from "../models";
import { Op } from "sequelize";

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

    const data = {
      users,
      roomTypes,
      rooms,
      reviews,
      bookingsCompleted,
      bookings,
      bookingsCancelled,
      totalProfit,
    };

    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};
