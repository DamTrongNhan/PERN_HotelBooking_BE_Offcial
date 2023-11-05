import passport from "../config/passport";
import {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controller";
import {
  validatePosts,
  body,
  validatePostsParams,
  params,
} from "../middlewares/posts.middleware";
export default (router) => {
  router.post(
    "/posts/createPost/",
    validatePosts(body),
    passport.authenticate("jwt", { session: false }),
    createPost
  );

  router.get("/posts/getPost/:id", getPost);

  router.get("/posts/getAllPosts", getAllPosts);

  router.put(
    "/posts/updatePost/:id",
    validatePostsParams(params),
    validatePosts(body),
    passport.authenticate("jwt", { session: false }),
    updatePost
  );

  router.delete(
    "/posts/deletePost/:id",
    validatePostsParams(params),
    passport.authenticate("jwt", { session: false }),
    deletePost
  );
};
