import passport from "../config/passport";

import {
  signIn,
  signUp,
  signOut,
  requestRefreshToken,
  oathWithGoogle,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authentication.controller";

import {
  validateAuth,
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  loginRareLimit,
} from "../middlewares/authentication.middleware";

export default (router) => {
  router.post(
    "/auth/signIn",
    // loginRareLimit,
    validateAuth(signInSchema),
    signIn
  );

  router.post("/auth/signUp", validateAuth(signUpSchema), signUp);

  router.post(
    "/auth/signOut",
    passport.authenticate("jwt", { session: false }),
    signOut
  );

  router.post("/auth/refreshToken", requestRefreshToken);

  router.get("/auth/oauth/google", oathWithGoogle);

  router.post(
    "/auth/forgotPassword",
    validateAuth(forgotPasswordSchema),
    forgotPassword
  );
  router.post("/auth/verifyOTP", validateAuth(verifyOTPSchema), verifyOTP);

  router.post(
    "/auth/resetPassword",
    validateAuth(resetPasswordSchema),
    resetPassword
  );
};
