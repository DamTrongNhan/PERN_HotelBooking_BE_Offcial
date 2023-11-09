import bcrypt from "bcrypt";
import _ from "lodash";
import db from "../models";
import { handleUploadSingle, handleDestroySingle } from "../utils/handleUpload";
import getUriFromMulter from "../utils/getUriFromMulter";

export const createUser = (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const { email } = data;
  db.users
    .findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "Email has been used" });
      }
      db.users
        .create(data)
        .then((createUser) => {
          if (createUser) {
            if (!_.isEmpty(req.file)) {
              let dataURI = getUriFromMulter(req.file);
              handleUploadSingle(dataURI, "user")
                .then((avatar) => {
                  if (avatar) {
                    db.photos
                      .create({
                        userId: createUser.id,
                        url: avatar.url,
                        publicId: avatar.public_id,
                        type: "AvatarUser",
                      })
                      .then((createAvatar) => {
                        if (createAvatar) {
                          return res
                            .status(200)
                            .json({ message: "Account successfully created" });
                        } else {
                          return next({
                            statusCode: 404,
                            message: "Not found",
                          });
                        }
                      })
                      .catch((err) => {
                        return next(err);
                      });
                  } else {
                    return next({ statusCode: 404, message: "Not found" });
                  }
                })
                .catch((error) => next(error));
            } else {
              return res
                .status(200)
                .json({ message: "Account successfully created" });
            }
          } else {
            return next({ statusCode: 404, message: "Not found" });
          }
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
};
export const getUser = (req, res, next) => {
  const id = req.params.id;
  db.users
    .findOne({
      where: { id },
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        {
          model: db.photos,
          as: "avatarData",
          attributes: ["url"],
        },
        {
          model: db.allCodes,
          as: "genderData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.allCodes,
          as: "roleData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.allCodes,
          as: "userStatusData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    })
    .then((user) => {
      if (user) {
        return res.status(200).json({ data: user });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllUsers = (req, res, next) => {
  db.users
    .findAll({
      where: { roleKey: "R2" },
      order: [["createdAt", "ASC"]],
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        {
          model: db.photos,
          as: "avatarData",
          attributes: ["url"],
        },
        {
          model: db.allCodes,
          as: "genderData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.allCodes,
          as: "roleData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.allCodes,
          as: "userStatusData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
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

export const updateUser = (req, res, next) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);

  db.users
    .findOne({ where: { id } })
    .then((user) => {
      if (user) {
        db.users
          .update(data, { where: { id } })
          .then(([updateUser]) => {
            if (updateUser !== 0) {
              if (!_.isEmpty(req.file)) {
                db.photos
                  .findOne({ where: { userId: user.id } })
                  .then((photo) => {
                    if (photo) {
                      handleDestroySingle(photo.publicId)
                        .then((destroyAvatar) => {
                          if (destroyAvatar) {
                            let dataURI = getUriFromMulter(req.file);
                            handleUploadSingle(dataURI, "user")
                              .then((uploadAvatar) => {
                                if (uploadAvatar) {
                                  db.photos
                                    .update(
                                      {
                                        publicId: uploadAvatar?.public_id,
                                        url: uploadAvatar?.url,
                                      },
                                      { where: { userId: user.id } }
                                    )
                                    .then(([updatePhoto]) => {
                                      if (updatePhoto !== 0) {
                                        return res.status(200).json({
                                          message:
                                            "User information updated successfully",
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

                      handleUploadSingle(dataURI, "user")
                        .then((uploadPhoto) => {
                          if (uploadPhoto) {
                            db.photos
                              .create({
                                userId: user.id,
                                publicId: uploadPhoto?.public_id,
                                url: uploadPhoto?.url,
                                type: "AvatarUser",
                              })
                              .then((createPhoto) => {
                                if (createPhoto) {
                                  return res.status(200).json({
                                    message:
                                      "User information updated successfully",
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
                return res
                  .status(200)
                  .json({ message: "User information updated successfully" });
              }
            } else {
              return next({ statusCode: 404, message: "Not Found" });
            }
          })
          .catch((err) => next(err));
      } else {
        return next({ statusCode: 404, message: "Not Found" });
      }
    })
    .catch((err) => next(err));
};
export const deleteUser = (req, res, next) => {
  const id = req.params.id;
  db.users
    .destroy({ where: { id } })
    .then((userDestroy) => {
      if (userDestroy) {
        db.photos
          .findOne({ where: { userId: id } })
          .then((photo) => {
            if (photo) {
              {
                db.photos
                  .destroy({
                    where: { userId: id },
                  })
                  .then((destroyPhoto) => {
                    if (destroyPhoto) {
                      handleDestroySingle(photo.publicId)
                        .then((destroySingle) => {
                          if (destroySingle) {
                            return res
                              .status(200)
                              .json({ message: "Delete user successfully" });
                          }
                        })
                        .catch((error) => next(error));
                    } else {
                      return res
                        .status(200)
                        .json({ message: "Delete user successfully" });
                    }
                  })
                  .catch((error) => next(error));
              }
            } else {
              return res
                .status(200)
                .json({ message: "Delete user successfully" });
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

export const updatePassword = (req, res, next) => {
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  db.users
    .findOne({ where: { id } })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(oldPassword, user.password)
          .then((isMatch) => {
            if (isMatch) {
              bcrypt
                .genSalt(10)
                .then((salt) => {
                  bcrypt
                    .hash(newPassword, salt)
                    .then((hash) => {
                      db.users
                        .update({ password: hash }, { where: { id } })
                        .then(([updatePassword]) => {
                          if (updatePassword !== 0) {
                            return res.status(200).json({
                              message: "Updated password successfully",
                            });
                          } else {
                            return next({
                              statusCode: 404,
                              message: "Not Found",
                            });
                          }
                        })
                        .catch((err) => {
                          return next(err);
                        });
                    })
                    .catch((error) => next(error));
                })
                .catch((error) => next(error));
            } else return res.status(401).json({ message: "Wrong password" });
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
export const updateUserStatus = (req, res, next) => {
  const id = req.params.id;
  const { userStatusKey } = req.body;
  db.users
    .update({ userStatusKey }, { where: { id } })
    .then(([updateUserStatus]) => {
      if (updateUserStatus !== 0) {
        return res.status(200).json({
          message: "The user status has been successfully updated.",
        });
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    })
    .catch((error) => next(error));
};
