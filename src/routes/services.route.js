import passport from "../config/passport";
import { uploadSingle } from "../config/multer";

import {
  getService,
  getAllServices,
  getAllServicesByType,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller";

import {
  validateServices,
  body,
  update,
  validateServicesParams,
  params,
  typeParams,
} from "../middlewares/services.middleware";

export default (router) => {
  router.post(
    "/services/createService/",
    uploadSingle.single("file"),
    validateServices(body),
    passport.authenticate("jwt", { session: false }),
    createService
  );

  router.get("/services/getService/:id", validateServices(params), getService);

  router.get("/services/getAllServices", getAllServices);

  router.get(
    "/services/getAllServicesByType/:type",
    validateServicesParams(typeParams),
    passport.authenticate("jwt", { session: false }),
    getAllServicesByType
  );

  router.put(
    "/services/updateService/:id",
    uploadSingle.single("file"),
    validateServicesParams(params),
    validateServices(update),
    passport.authenticate("jwt", { session: false }),
    updateService
  );

  router.delete(
    "/services/deleteService/:id",
    validateServicesParams(params),
    passport.authenticate("jwt", { session: false }),
    deleteService
  );
};
