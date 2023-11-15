import passport from "../config/passport";
import {
  getAllStatistics,
  getBookingsCalendar,
} from "../controllers/statistics.controller";

export default (router) => {
  router.get(
    "/statistics/getAllStatistics",
    passport.authenticate("jwt", { session: false }),
    getAllStatistics
  );
  router.get(
    "/statistics/getBookingsCalendar",
    passport.authenticate("jwt", { session: false }),
    getBookingsCalendar
  );
};
