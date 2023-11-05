import passport from "../config/passport";
import { uploadSingle } from "../config/multer";

import {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateUserStatus,
} from "../controllers/users.controller";

import {
  validateUsers,
  validateUpdatePassword,
  body,
  bodyUpdate,
  validateUsersStatus,
  updateStatus,
  passwordUpdate,
  validateUsersParams,
  params,
} from "../middlewares/users.middleware";

export default (router) => {
  router.post(
    "/users/createUser/",
    uploadSingle.single("file"),
    validateUsers(body),
    passport.authenticate("jwt", { session: false }),
    createUser
  );

  router.get(
    "/users/getUser/:id",
    passport.authenticate("jwt", { session: false }),
    getUser
  );

  router.get(
    "/users/getAllUsers",
    passport.authenticate("jwt", { session: false }),
    getAllUsers
  );

  router.put(
    "/users/updateUser/:id",
    validateUsersParams(params),
    uploadSingle.single("file"),
    validateUsers(bodyUpdate),
    passport.authenticate("jwt", { session: false }),
    updateUser
  );
  router.put(
    "/users/updatePassword/:id",
    validateUsersParams(params),
    validateUpdatePassword(passwordUpdate),
    passport.authenticate("jwt", { session: false }),
    updatePassword
  );

  router.delete(
    "/users/deleteUser/:id",
    validateUsersParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteUser
  );

  router.put(
    "/users/updateUserStatus/:id",
    validateUsersParams(params),
    validateUsersStatus(updateStatus),
    passport.authenticate("jwt", { session: false }),
    updateUserStatus
  );
};
