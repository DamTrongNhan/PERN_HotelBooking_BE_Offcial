import passport from "../config/passport";
import {
  getReview,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsByRoomTypeIdWithPagination,
  getAllReviewsByUserId,
} from "../controllers/reviews.controller";
import {
  validateReviews,
  body,
  bodyUpdate,
  validateReviewsParams,
  params,
  validateReviewsQuery,
  query,
} from "../middlewares/reviews.middleware";
export default (router) => {
  router.post(
    "/reviews/createReview/",
    validateReviews(body),
    passport.authenticate("jwt", { session: false }),
    createReview
  );

  router.put(
    "/reviews/updateReview/:id",
    validateReviewsParams(params),
    validateReviews(bodyUpdate),
    passport.authenticate("jwt", { session: false }),
    updateReview
  );

  router.delete(
    "/reviews/deleteReview/:id",
    validateReviewsParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteReview
  );

  router.get("/reviews/getAllReviews", getAllReviews);

  router.get(
    "/reviews/getReview/:id",
    passport.authenticate("jwt", { session: false }),
    getReview
  );

  router.get(
    "/reviews/getAllReviewsByRoomTypeIdWithPagination",
    validateReviewsQuery(query),
    getAllReviewsByRoomTypeIdWithPagination
  );

  router.get(
    "/reviews/getAllReviewsByUserId/:id",
    validateReviewsParams(params),
    passport.authenticate("jwt", { session: false }),
    getAllReviewsByUserId
  );
};
