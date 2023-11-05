import db from "../models";

export const createCode = (req, res, next) => {
  db.allCodes
    .create(req.body)
    .then((createCode) => {
      if (createCode)
        return res.status(200).json({ message: "Code successfully created" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const getCode = (req, res, next) => {
  const id = req.params.id;
  db.allCodes
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllCodes = (req, res, next) => {
  db.allCodes
    .findAll({
      order: [["createdAt", "ASC"]],
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
export const getAllCodesByType = (req, res, next) => {
  const type = req.params.type;
  db.allCodes
    .findAll({
      order: [["createdAt", "ASC"]],
      where: { type },
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

export const updateCode = (req, res, next) => {
  const id = req.params.id;
  db.allCodes
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        db.allCodes
          .update(req.body, { where: { id } })
          .then(([data]) => {
            if (data !== 0) {
              return res
                .status(200)
                .json({ message: "Code information updated successfully" });
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
export const deleteCode = (req, res, next) => {
  const id = req.params.id;
  db.allCodes
    .destroy({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ message: "Delete Code successfully" });
      } else next({ statusCode: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
