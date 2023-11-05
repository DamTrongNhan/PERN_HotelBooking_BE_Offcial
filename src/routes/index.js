import express from "express";

import authenticationRoute from "./authentication.route";
import usersRoute from "./users.route";
import bookingsRoute from "./bookings.route";
import bookingsVnpayRoute from "./bookingsVnpay.route";
import roomsRoute from "./rooms.route";
import roomTypesRoute from "./roomTypes.route";
import allCodesRoute from "./allCodes.route";
import servicesRoute from "./services.route";
import reviewsRoute from "./reviews.route";
import postsRoute from "./posts.route";
import chatRealTimesRoute from "./chatRealTimes.route";

const router = express.Router();

export default (app) => {
  authenticationRoute(router);
  usersRoute(router);
  bookingsRoute(router);
  bookingsVnpayRoute(router);
  roomsRoute(router);
  roomTypesRoute(router);
  allCodesRoute(router);
  servicesRoute(router);
  reviewsRoute(router);
  postsRoute(router);
  chatRealTimesRoute(router);

  return app.use("/api/v1/", router);
};
