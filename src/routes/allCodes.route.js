import passport from "../config/passport";
import {
  getCode,
  getAllCodes,
  getAllCodesByType,
  createCode,
  updateCode,
  deleteCode,
} from "../controllers/allCodes.controller";
import {
  validateAllCodes,
  body,
  validateAllCodesParams,
  typeParams,
  params,
} from "../middlewares/allCodes.middleware";
export default (router) => {
  router.post(
    "/allCodes/createCode/",
    validateAllCodes(body),
    passport.authenticate("jwt", { session: false }),
    createCode
  );

  router.get("/allCodes/getCode/:id", getCode);

  router.get(
    "/allCodes/getAllCodes",
    passport.authenticate("jwt", { session: false }),
    getAllCodes
  );

  router.get(
    "/allCodes/getAllCodesByType/:type",
    validateAllCodesParams(typeParams),
    getAllCodesByType
  );

  router.put(
    "/allCodes/updateCode/:id",
    validateAllCodesParams(params),
    validateAllCodes(body),
    passport.authenticate("jwt", { session: false }),
    updateCode
  );

  router.delete(
    "/allCodes/deleteCode/:id",
    validateAllCodesParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteCode
  );
};
