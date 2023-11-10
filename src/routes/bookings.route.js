import passport from "../config/passport";
import {
  createBooking,
  updateBookingStatus,
  getAllBookings,
  getAllBookingHistories,
  getBooking,
  verifyBooking,
  getAllBookingsByUserId,
  getAllBookingHistoriesByUserId,
  getBookingByBookingCode,
} from "../controllers/bookings.controller";

import {
  validateBookings,
  validateBookingsParams,
  body,
  updateStatus,
  params,
  verify,
} from "../middlewares/bookings.middleware";

export default (router) => {
  router.post(
    "/bookings/createBooking/",
    validateBookings(body),
    passport.authenticate("jwt", { session: false }),
    createBooking
  );

  router.put(
    "/bookings/updateBookingStatus/:id",
    validateBookingsParams(params),
    validateBookings(updateStatus),
    passport.authenticate("jwt", { session: false }),
    updateBookingStatus
  );

  router.put(
    "/bookings/verifyBooking",
    validateBookings(verify),
    passport.authenticate("jwt", { session: false }),
    verifyBooking
  );

  router.get(
    "/bookings/getAllBookings",
    passport.authenticate("jwt", { session: false }),
    getAllBookings
  );
  router.get(
    "/bookings/getAllBookingHistories",
    passport.authenticate("jwt", { session: false }),
    getAllBookingHistories
  );

  router.get(
    "/bookings/getAllBookingsByUserId/:id",
    validateBookingsParams(params),
    passport.authenticate("jwt", { session: false }),
    getAllBookingsByUserId
  );

  router.get(
    "/bookings/getAllBookingHistoriesByUserId",
    validateBookingsParams(params),
    passport.authenticate("jwt", { session: false }),
    getAllBookingHistoriesByUserId
  );

  router.get(
    "/bookings/getBooking/:id",
    validateBookingsParams(params),
    passport.authenticate("jwt", { session: false }),
    getBooking
  );

  router.get(
    "/bookings/getBookingByBookingCode/:id",
    validateBookingsParams(params),
    passport.authenticate("jwt", { session: false }),
    getBookingByBookingCode
  );
};
