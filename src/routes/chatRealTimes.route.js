import passport from "../config/passport";
import {
  getAllMemberChat,
  getMemberChat,
  getMemberChatAdmin,
  createContentChat,
  getAllContentChat,
  allUsers,
} from "../controllers/chatRealTimes.controller";

import {
  validateChatRealTimes,
  getMemberSchema,
  createContentChatSchema,
  validateChatRealTimesParams,
  id,
} from "../middlewares/chatRealTimes.middleware";

export default (router) => {
  router.get(
    "/chatRealTimes/getAllMemberChat",
    passport.authenticate("jwt", { session: false }),
    getAllMemberChat
  );

  router.post(
    "/chatRealTimes/getMemberChat",
    validateChatRealTimes(getMemberSchema),
    passport.authenticate("jwt", { session: false }),
    getMemberChat
  );
  router.get(
    "/chatRealTimes/getMemberChatAdmin",
    passport.authenticate("jwt", { session: false }),
    getMemberChatAdmin
  );

  router.post(
    "/chatRealTimes/createContentChat",
    validateChatRealTimes(createContentChatSchema),
    passport.authenticate("jwt", { session: false }),
    createContentChat
  );

  router.get(
    "/chatRealTimes/getAllContentChat/:id",
    validateChatRealTimesParams(id),
    passport.authenticate("jwt", { session: false }),
    getAllContentChat
  );

  router.get(
    "/chatRealTimes/getAllUsers",
    passport.authenticate("jwt", { session: false }),
    allUsers
  );
};
