import passport from "../config/passport";
import {
  createBooking,
  updateBookingStatus,
  getAllBookings,
  getAllBookingHistories,
  getBooking,
  verifyBooking,
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
    "/bookings/getBooking/:id",
    validateBookingsParams(params),
    passport.authenticate("jwt", { session: false }),
    getBooking
  );
};
