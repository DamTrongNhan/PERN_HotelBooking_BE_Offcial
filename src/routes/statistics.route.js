import passport from "../config/passport";
import { getAllStatistics } from "../controllers/statistics.controller";

export default (router) => {
  router.get(
    "/statistics/getAllStatistics",
    passport.authenticate("jwt", { session: false }),
    getAllStatistics
  );
};
