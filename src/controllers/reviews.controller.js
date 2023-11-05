import db from "../models";
import { getPagination, getPagingData } from "../utils/pagination";

export const createReview = (req, res, next) => {
  db.reviews
    .create(req.body)
    .then((createReview) => {
      if (createReview)
        return res.status(200).json({ message: "Review successfully created" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const updateReview = (req, res, next) => {
  const id = req.params.id;
  db.reviews
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        db.reviews
          .update(req.body, { where: { id } })
          .then(([data]) => {
            if (data !== 0) {
              return res
                .status(200)
                .json({ message: "Review information updated successfully" });
            } else {
              return next({ statusCode: 404, message: "Not Found" });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else next({ statusReview: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const deleteReview = (req, res, next) => {
  const id = req.params.id;
  db.reviews
    .destroy({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ message: "Delete review successfully" });
      } else next({ statusReview: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllReviews = (req, res, next) => {
  db.reviews
    .findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.users,
          as: "userDataReviews",
          attributes: ["firstName", "lastName", "email"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url", "type"] },
          ],
        },
        {
          model: db.roomTypes,
          as: "roomTypesDataReviews",
          attributes: ["roomTypeKey"],
          include: [
            {
              model: db.allCodes,
              as: "roomTypeDataRoomTypes",
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

export const getReview = (req, res, next) => {
  const id = req.params.id;
  db.reviews
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else next({ statusReview: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllReviewsByRoomTypeIdWithPagination = (req, res, next) => {
  const { page, size, roomTypeId } = req.query;
  const { limit, offset } = getPagination(page, size);

  db.reviews
    .findAndCountAll({
      where: { roomTypeId },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: db.users,
          as: "userDataReviews",
          attributes: ["firstName", "lastName", "email"],
          include: [
            { model: db.photos, as: "avatarData", attributes: ["url", "type"] },
          ],
        },
      ],
      raw: false,
      nest: true,
    })
    .then((reviews) => {
      if (reviews) {
        const response = getPagingData(reviews, page, limit);
        return res.status(200).json(response);
      } else {
        return next({ statusCode: 404, message: "No reviews found" });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
