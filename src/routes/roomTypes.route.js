import passport from "../config/passport";
import { validateUploadMultiple } from "../config/multer";

import {
  getRoomType,
  getAllRoomTypes,
  getAllRoomTypesByRoomTypeKey,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getAllGallery,
  getAllRoomTypesWithPagination,
} from "../controllers/roomTypes.controller";

import {
  validateRoomTypes,
  body,
  bodyUpdate,
  validateRoomTypesParams,
  params,
  roomTypeKeyParams,
  validateRoomTypesQuery,
  query,
} from "../middlewares/roomTypes.middleware";

export default (router) => {
  router.post(
    "/roomTypes/createRoomType/",
    validateUploadMultiple,
    validateRoomTypes(body),
    passport.authenticate("jwt", { session: false }),
    createRoomType
  );

  router.put(
    "/roomTypes/updateRoomType/:id",
    validateRoomTypesParams(params),
    validateUploadMultiple,
    validateRoomTypes(bodyUpdate),
    passport.authenticate("jwt", { session: false }),
    updateRoomType
  );

  router.delete(
    "/roomTypes/deleteRoomType/:id",
    validateRoomTypesParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteRoomType
  );

  router.get("/roomTypes/getAllRoomTypes", getAllRoomTypes);

  router.get(
    "/roomTypes/getRoomType/:id",
    validateRoomTypesParams(params),
    getRoomType
  );

  router.get(
    "/roomTypes/getAllRoomTypesByRoomTypeKey/:roomTypeKey",
    validateRoomTypesParams(roomTypeKeyParams),
    getAllRoomTypesByRoomTypeKey
  );

  router.get(
    "/roomTypes/getAllRoomTypesWithPagination",
    validateRoomTypesQuery(query),
    getAllRoomTypesWithPagination
  );

  router.get(
    "/roomTypes/getAllGallery",
    validateRoomTypesQuery(query),
    getAllGallery
  );
};
