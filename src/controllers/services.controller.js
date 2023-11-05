import db from "../models";
import _ from "lodash";
import { handleUploadSingle, handleDestroySingle } from "../utils/handleUpload";
import getUriFromMulter from "../utils/getUriFromMulter";

export const createService = (req, res, next) => {
  const data = JSON.parse(req.body.data);

  db.services
    .create(data)
    .then((createService) => {
      if (createService)
        if (!_.isEmpty(req.file)) {
          let dataURI = getUriFromMulter(req.file);
          handleUploadSingle(dataURI, "service")
            .then((thumbnail) => {
              db.photos
                .create({
                  serviceId: createService.id,
                  url: thumbnail.url,
                  publicId: thumbnail.public_id,
                  type: "ThumbnailService",
                })
                .then((createThumbnail) => {
                  if (createThumbnail) {
                    return res
                      .status(200)
                      .json({ message: "Service successfully created" });
                  } else {
                    return next({ statusCode: 404, message: "Not found" });
                  }
                })
                .catch((err) => {
                  return next(err);
                });
            })
            .catch((error) => next(error));
        } else {
          return res
            .status(200)
            .json({ message: "Service successfully created" });
        }
    })
    .catch((err) => {
      return next(err);
    });
};
export const getService = (req, res, next) => {
  const id = req.params.id;
  db.services
    .findOne({
      where: { id },
      include: {
        model: db.photos,
        as: "thumbnailDataServices",
        attributes: ["url"],
      },
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllServices = (req, res, next) => {
  db.services
    .findAll({
      order: [["createdAt", "ASC"]],
      include: {
        model: db.photos,
        as: "thumbnailDataServices",
        attributes: ["url"],
      },
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
export const getAllServicesByType = (req, res, next) => {
  const type = req.params.type;
  db.services
    .findAll({
      order: [["createdAt", "ASC"]],
      where: { type },
      include: {
        model: db.photos,
        as: "thumbnailDataServices",
        attributes: ["url"],
      },
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      }
    })
    .catch((err) => {
      return next(err);
    });
};

export const updateService = (req, res, next) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);

  db.services
    .findOne({ where: { id } })
    .then((service) => {
      if (service) {
        db.services
          .update(data, { where: { id } })
          .then(([updateService]) => {
            if (updateService !== 0) {
              if (!_.isEmpty(req.file)) {
                db.photos
                  .findOne({ where: { serviceId: service.id } })
                  .then((photo) => {
                    if (photo) {
                      handleDestroySingle(photo.publicId)
                        .then((destroyPhoto) => {
                          if (destroyPhoto) {
                            let dataURI = getUriFromMulter(req.file);
                            handleUploadSingle(dataURI, "service")
                              .then((uploadPhoto) => {
                                if (uploadPhoto) {
                                  db.photos
                                    .update(
                                      {
                                        publicId: uploadPhoto?.public_id,
                                        url: uploadPhoto?.url,
                                      },
                                      { where: { serviceId: service.id } }
                                    )
                                    .then(([updatePhoto]) => {
                                      if (updatePhoto !== 0) {
                                        return res.status(200).json({
                                          message:
                                            "Service information updated successfully",
                                        });
                                      } else {
                                        return next({
                                          statusCode: "404",
                                          message: "Not found",
                                        });
                                      }
                                    })
                                    .catch((err) => next(err));
                                } else {
                                  return next({
                                    statusCode: "404",
                                    message: "Not found",
                                  });
                                }
                              })
                              .catch((error) => next(error));
                          } else {
                            return next({
                              statusCode: "404",
                              message: "Not found",
                            });
                          }
                        })
                        .catch((error) => next(error));
                    } else {
                      let dataURI = getUriFromMulter(req.file);

                      handleUploadSingle(dataURI, "service")
                        .then((uploadPhoto) => {
                          if (uploadPhoto) {
                            db.photos
                              .create({
                                serviceId: service.id,
                                publicId: uploadPhoto?.public_id,
                                url: uploadPhoto?.url,
                                type: "ThumbnailService",
                              })
                              .then((createPhoto) => {
                                if (createPhoto) {
                                  return res.status(200).json({
                                    message:
                                      "Service information updated successfully",
                                  });
                                } else {
                                  return next({
                                    statusCode: "404",
                                    message: "Not found",
                                  });
                                }
                              })
                              .catch((err) => next(err));
                          } else {
                            return next({
                              statusCode: "404",
                              message: "Not found",
                            });
                          }
                        })
                        .catch((error) => next(error));
                    }
                  })
                  .catch((error) => next(error));
              } else {
                return res.status(200).json({
                  message: "Service information updated successfully",
                });
              }
            } else {
              return next({ statusCode: 404, message: "Not Found" });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        return next({ statusCode: 404, message: "Not Found" });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
export const deleteService = (req, res, next) => {
  const id = req.params.id;

  db.services
    .destroy({ where: { id } })
    .then((serviceDestroy) => {
      if (serviceDestroy) {
        db.photos
          .findOne({ where: { serviceId: id } })
          .then((photo) => {
            if (photo) {
              {
                db.photos
                  .destroy({
                    where: { serviceId: id },
                  })
                  .then((destroyPhoto) => {
                    if (destroyPhoto) {
                      handleDestroySingle(photo.publicId)
                        .then((destroySingle) => {
                          if (destroySingle) {
                            return res
                              .status(200)
                              .json({ message: "Delete service successfully" });
                          }
                        })
                        .catch((error) => next(error));
                    } else {
                      return res
                        .status(200)
                        .json({ message: "Delete service successfully" });
                    }
                  })
                  .catch((error) => next(error));
              }
            } else {
              return res
                .status(200)
                .json({ message: "Delete service successfully" });
            }
          })
          .catch((err) => next(err));
      } else {
        return next({ statusCode: 404, message: "Not Found" });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
