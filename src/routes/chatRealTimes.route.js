import passport from "../config/passport";
import {
  getAllMemberChatByAdminId,
  getMemberChatByCustomerId,
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
    "/chatRealTimes/getAllMemberChatByAdminId/:id",
    validateChatRealTimesParams(id),
    passport.authenticate("jwt", { session: false }),
    getAllMemberChatByAdminId
  );

  router.post(
    "/chatRealTimes/getMemberChatByCustomerId",
    validateChatRealTimes(getMemberSchema),
    passport.authenticate("jwt", { session: false }),
    getMemberChatByCustomerId
  );

  router.post(
    "/chatRealTimes/createContentChat/",
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
    "/chatRealTimes/getAllUsers/",
    passport.authenticate("jwt", { session: false }),
    allUsers
  );
};
