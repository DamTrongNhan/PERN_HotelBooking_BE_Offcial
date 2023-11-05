import passport from "../config/passport";

import {
  getRoom,
  getAllRooms,
  getAllRoomsByRoomTypeKey,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailable,
  getAllRoomsAvailableByRoomTypeKey,
  updateRoomStatus,
} from "../controllers/rooms.controller";

import {
  validateRooms,
  body,
  validateRoomsQuery,
  checkAvailable,
  getAllAvailable,
  updateStatus,
  validateRoomsParams,
  params,
  roomTypeKeyParams,
} from "../middlewares/rooms.middleware";

export default (router) => {
  router.post(
    "/rooms/createRoom/",
    validateRooms(body),
    passport.authenticate("jwt", { session: false }),
    createRoom
  );

  router.put(
    "/rooms/updateRoom/:id",
    validateRoomsParams(params),
    validateRooms(body),
    passport.authenticate("jwt", { session: false }),
    updateRoom
  );

  router.put(
    "/rooms/updateRoomStatus/:id",
    validateRoomsParams(params),
    validateRooms(updateStatus),
    passport.authenticate("jwt", { session: false }),
    updateRoomStatus
  );

  router.delete(
    "/rooms/deleteRoom/:id",
    validateRoomsParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteRoom
  );

  router.get("/rooms/getAllRooms", getAllRooms);

  router.get(
    "/rooms/getRoom/:id",
    validateRoomsParams(params),
    passport.authenticate("jwt", { session: false }),
    getRoom
  );

  router.get(
    "/rooms/getAllRoomsByRoomTypeKey/:roomTypeKey",
    validateRoomsParams(roomTypeKeyParams),
    getAllRoomsByRoomTypeKey
  );

  router.get(
    "/rooms/getAllRoomsAvailableByRoomTypeKey",
    validateRoomsQuery(getAllAvailable),
    getAllRoomsAvailableByRoomTypeKey
  );

  router.get(
    "/rooms/checkRoomAvailable",
    validateRoomsQuery(checkAvailable),
    passport.authenticate("jwt", { session: false }),
    checkRoomAvailable
  );
};
