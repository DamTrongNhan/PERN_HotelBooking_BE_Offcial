import _ from "lodash";
import db from "../models";
import { handleUploadSingle, handleDestroySingle } from "../utils/handleUpload";
import getUriFromMulter from "../utils/getUriFromMulter";

import { getPagination, getPagingData } from "../utils/pagination";

export const createRoomType = (req, res, next) => {
  const data = JSON.parse(req.body.data);

  db.roomTypes
    .create(data)
    .then((createRoomType) => {
      if (createRoomType) {
        if (!_.isEmpty(data.newAllAmenities)) {
          const allAmenitiesKey = data.newAllAmenities.map((item) => {
            return {
              roomTypeId: createRoomType.id,
              amenitiesTypeKey: item.keyMap,
            };
          });
          db.amenities
            .bulkCreate(allAmenitiesKey)
            .then(() => {
              if (!_.isEmpty(req.files)) {
                const uploadPromises = req.files.map((file) => {
                  let dataURIPhoto = getUriFromMulter(file);
                  return handleUploadSingle(dataURIPhoto, "roomType");
                });

                Promise.all(uploadPromises)
                  .then((photos) => {
                    photos = photos.map((item) => {
                      return {
                        roomTypeId: createRoomType.id,
                        url: item.url,
                        publicId: item.public_id,
                        type: "photosRoomType",
                      };
                    });

                    db.photos
                      .bulkCreate(photos)
                      .then((createPhotos) => {
                        if (createPhotos) {
                          return res.status(200).json({
                            message: "Room type successfully created",
                          });
                        } else
                          return next({
                            statusCode: 404,
                            message: "Not found",
                          });
                      })
                      .catch((error) => next(error));
                  })
                  .catch((error) => {
                    return next(error);
                  });
              } else {
                return res
                  .status(200)
                  .json({ message: "Room type successfully created" });
              }
            })
            .catch((err) => next(err));
        } else {
          return res
            .status(200)
            .json({ message: "Room type successfully created" });
        }
      }
    })
    .catch((err) => next(err));
};

export const updateRoomType = (req, res, next) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);

  db.roomTypes
    .findOne({ where: { id } })
    .then((roomTypes) => {
      if (roomTypes) {
        db.roomTypes
          .update(data, { where: { id } })
          .then(([updateRoomType]) => {
            if (updateRoomType !== 0) {
              if (!_.isEmpty(data.newAllAmenities)) {
                db.amenities
                  .destroy({ where: { roomTypeId: id } })
                  .then(() => {
                    db.amenities
                      .bulkCreate(data.newAllAmenities)
                      .then(() => {
                        if (!_.isEmpty(req.files)) {
                          db.photos
                            .findAll({ where: { roomTypeId: id } })
                            .then((arrayPhotos) => {
                              if (arrayPhotos) {
                                const destroyPromises = arrayPhotos.map(
                                  (photo) => {
                                    return handleDestroySingle(photo.publicId);
                                  }
                                );

                                Promise.all(destroyPromises)
                                  .then((result) => {
                                    if (result) {
                                      const uploadPromises = req.files.map(
                                        (file) => {
                                          let dataURIPhoto =
                                            getUriFromMulter(file);
                                          return handleUploadSingle(
                                            dataURIPhoto,
                                            "roomType"
                                          );
                                        }
                                      );

                                      Promise.all(uploadPromises)
                                        .then((photos) => {
                                          photos = photos.map((item) => {
                                            return {
                                              roomTypeId: id,
                                              url: item.url,
                                              publicId: item.public_id,
                                              type: "photosRoomType",
                                            };
                                          });

                                          db.photos
                                            .destroy({
                                              where: { roomTypeId: id },
                                            })
                                            .then((deletePhotos) => {
                                              if (deletePhotos) {
                                                db.photos
                                                  .bulkCreate(photos)
                                                  .then((createPhotos) => {
                                                    if (createPhotos) {
                                                      return res
                                                        .status(200)
                                                        .json({
                                                          message:
                                                            "Room type information updated successfully",
                                                        });
                                                    } else
                                                      return next({
                                                        statusCode: 404,
                                                        message: "Not found",
                                                      });
                                                  })
                                                  .catch((error) =>
                                                    next(error)
                                                  );
                                              } else
                                                return next({
                                                  statusCode: 404,
                                                  message: "Not found",
                                                });
                                            })
                                            .catch((error) => next(error));
                                        })
                                        .catch((error) => {
                                          return next(error);
                                        });
                                    }
                                  })
                                  .catch((error) => next(error));
                              } else {
                                const uploadPromises = req.files.map((file) => {
                                  let dataURIPhoto = getUriFromMulter(file);
                                  return handleUploadSingle(
                                    dataURIPhoto,
                                    "roomType"
                                  );
                                });

                                Promise.all(uploadPromises)
                                  .then((photos) => {
                                    photos = photos.map((item) => {
                                      return {
                                        roomTypeId: id,
                                        url: item.url,
                                        publicId: item.public_id,
                                        type: "photosRoomType",
                                      };
                                    });

                                    db.photos
                                      .bulkCreate(photos)
                                      .then((createPhotos) => {
                                        if (createPhotos) {
                                          return res.status(200).json({
                                            message:
                                              "Room type information updated successfully",
                                          });
                                        } else
                                          return next({
                                            statusCode: 404,
                                            message: "Not found",
                                          });
                                      })
                                      .catch((error) => next(error));
                                  })
                                  .catch((error) => {
                                    return next(error);
                                  });
                              }
                            })
                            .catch((err) => {
                              return next(err);
                            });
                        } else {
                          return res.status(200).json({
                            message:
                              "Room type information updated successfully",
                          });
                        }
                      })
                      .catch((error) => {
                        return next(error);
                      });
                  })
                  .catch((error) => {
                    return next(error);
                  });
              } else {
                return res.status(200).json({
                  message: "Room type information updated successfully",
                });
              }
            } else {
              return next({ statusCode: 404, message: "Not Found" });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const deleteRoomType = (req, res, next) => {
  const id = req.params.id;

  db.roomTypes
    .destroy({ where: { id } })
    .then((destroyRoomType) => {
      if (destroyRoomType) {
        db.amenities
          .destroy({ where: { roomTypeId: id } })
          .then(() => {
            db.photos
              .findAll({ where: { roomTypeId: id } })
              .then((photos) => {
                if (!_.isEmpty(photos)) {
                  const destroyPromises = photos.map((photo) => {
                    return handleDestroySingle(photo.publicId);
                  });

                  Promise.all(destroyPromises)
                    .then((result) => {
                      if (result) {
                        db.photos
                          .destroy({ where: { roomTypeId: id } })
                          .then((destroyPhotos) => {
                            if (destroyPhotos) {
                              return res.status(200).json({
                                message: "Delete room type successfully",
                              });
                            } else {
                              return next({
                                statusCode: 404,
                                message: "Not found",
                              });
                            }
                          })
                          .catch((error) => next(error));
                      }
                    })
                    .catch((error) => next(error));
                } else {
                  return res
                    .status(200)
                    .json({ message: "Delete room type successfully" });
                }
              })
              .catch((error) => next(error));
          })
          .catch((err) => next(err));
      } else return next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const getAllRoomTypes = (req, res, next) => {
  db.roomTypes
    .findAll({
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRoomTypes",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "bedTypeData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.photos,
          as: "photosDataRoomTypes",
          attributes: ["url", "type"],
        },
        {
          model: db.amenities,
          as: "amenitiesData",
          include: [
            {
              model: db.allCodes,
              as: "amenitiesTypeData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
      ],
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

export const getRoomType = (req, res, next) => {
  const id = req.params.id;

  db.roomTypes
    .findOne({
      where: { id },
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRoomTypes",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "bedTypeData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.photos,
          as: "photosDataRoomTypes",
          attributes: ["url", "type"],
        },
        {
          model: db.amenities,
          as: "amenitiesData",
          include: [
            {
              model: db.allCodes,
              as: "amenitiesTypeData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
      ],
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

export const getAllRoomTypesByRoomTypeKey = (req, res, next) => {
  const roomTypeKey = req.params.roomTypeKey;

  db.roomTypes
    .findAll({
      where: { roomTypeKey },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRoomTypes",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "bedTypeData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.photos,
          as: "photosDataRoomTypes",
          attributes: ["url", "type"],
        },
        {
          model: db.amenities,
          as: "amenitiesData",
          include: [
            {
              model: db.allCodes,
              as: "amenitiesTypeData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data.length > 0) {
        return res.status(200).json({ data });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllRoomTypesWithPagination = (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  db.roomTypes
    .findAndCountAll({
      order: [["createdAt", "ASC"]],
      limit: limit,
      offset: offset,
      distinct: true,
      include: [
        {
          model: db.allCodes,
          as: "roomTypeDataRoomTypes",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "bedTypeData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.photos,
          as: "photosDataRoomTypes",
          attributes: ["url", "type"],
        },
        {
          model: db.amenities,
          as: "amenitiesData",
          include: [
            {
              model: db.allCodes,
              as: "amenitiesTypeData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    })
    .then((roomTypes) => {
      if (roomTypes) {
        const response = getPagingData(roomTypes, page, limit);
        return res.status(200).json(response);
      } else return next({ statusCode: 404, message: "No room types found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllGallery = (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    db.photos
      .findAndCountAll({
        where: { type: "photosRoomType" },
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
      })
      .then((photos) => {
        if (photos) {
          const response = getPagingData(photos, page, limit);
          return res.status(200).json(response);
        } else return next({ statusCode: 404, message: "No photos found" });
      });
  } catch (err) {
    return next(err);
  }
};
