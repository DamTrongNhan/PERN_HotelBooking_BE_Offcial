import passport from "../config/passport";
import {
  createBookingWithVnpay,
  getVnpayResult,
  checkBookingStatus,
  repayment,
} from "../controllers/bookingsVnpay.controller";

import {
  validateBookings,
  validateBookingsParams,
  body,
  bookingStatus,
} from "../middlewares/bookingsVnpay.middleware";

export default (router) => {
  router.post(
    "/bookingsVnpay/createBookingWithVnpay/",
    validateBookings(body),
    passport.authenticate("jwt", { session: false }),
    createBookingWithVnpay
  );
  router.get("/bookingsVnpay/vnpay_return", getVnpayResult);
  router.get(
    "/bookingsVnpay/checkBookingStatus/:bookingCode",
    validateBookingsParams(bookingStatus),
    checkBookingStatus
  );
  router.post(
    "/bookingsVnpay/repayment/",
    validateBookings(body),
    passport.authenticate("jwt", { session: false }),
    repayment
  );
};
