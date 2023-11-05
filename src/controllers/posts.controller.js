import db from "../models";

export const createPost = (req, res, next) => {
  db.posts
    .create(req.body)
    .then((createPost) => {
      if (createPost)
        return res.status(200).json({ message: "Post successfully created" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const getPost = (req, res, next) => {
  const id = req.params.id;
  db.posts
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else next({ statusPost: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const getAllPosts = (req, res, next) => {
  db.posts
    .findAll({
      order: [["createdAt", "DESC"]],
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

export const updatePost = (req, res, next) => {
  const id = req.params.id;
  db.posts
    .findOne({ where: { id } })
    .then((data) => {
      if (data) {
        db.posts
          .update(req.body, { where: { id } })
          .then(([data]) => {
            if (data !== 0) {
              return res
                .status(200)
                .json({ message: "Post information updated successfully" });
            } else {
              return next({ statusCode: 404, message: "Not Found" });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else next({ statusPost: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
export const deletePost = (req, res, next) => {
  const id = req.params.id;
  db.posts
    .destroy({ where: { id } })
    .then((data) => {
      if (data) {
        return res.status(200).json({ message: "Delete post successfully" });
      } else next({ statusPost: 404, message: "Not Found" });
    })
    .catch((err) => {
      return next(err);
    });
};
