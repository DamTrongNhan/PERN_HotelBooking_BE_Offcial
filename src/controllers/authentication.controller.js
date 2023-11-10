import db from "../models";
import "dotenv/config";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "../config/passport";
const speakeasy = require("speakeasy");

import { getGoogleOauthToken, getGoogleUser } from "../utils/oathWithGoogle";
import { sendForgotPassword } from "../utils/sendMail";
import { generateRandomPassword } from "../utils/randomPassword";

export const signIn = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, { session: false }, async (errorLogin) => {
      if (errorLogin) {
        return next(errorLogin);
      }
      const refreshToken = jwt.sign(
        { id: user.id, roleKey: user.roleKey },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
      );

      const accessToken = jwt.sign(
        {
          id: user.id,
          roleKey: user.roleKey,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
      );
      // res.cookie("refreshToken", refreshToken, {
      //   // httpOnly: true,
      //   // secure: false,
      //   // path: "/",
      //   // sameSite: "strict",
      // });
      await db.users.update(
        { refreshToken },
        {
          where: { id: user.id },
        }
      );
      const {
        id,
        firstName,
        lastName,
        roleKey,
        avatarData: { url: avatarUrl },
      } = user;

      return res.status(200).json({
        message: "Login successfully",
        data: {
          id,
          firstName,
          lastName,
          roleKey,
          avatarUrl,
        },
        accessToken,
        refreshToken,
      });
    });
  })(req, res, next);
};

export const signOut = async (req, res, next) => {
  try {
    await db.users.update({ refreshToken: "" }, { where: { id: req.user.id } });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("data");
    req.user = null;
    return res.status(200).json({ message: "Sign Out successfully" });
  } catch (err) {
    return next(err);
  }
};

export const signUp = (req, res, next) => {
  const { email, password } = req.body;
  db.users
    .findOne({ where: { email: email.toLowerCase() } })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "Email has been used" });
      }
      db.users
        .create({ email: email.toLowerCase(), password })
        .then((createUser) => {
          if (createUser)
            return res
              .status(200)
              .json({ message: "Account successfully created" });
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
};

export const requestRefreshToken = (req, res, next) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next({ statusCode: 401, message: "You're not authenticated" });
  }
  db.users
    .findOne({ where: { refreshToken } })
    .then((result) => {
      if (!result) {
        return next({ statusCode: 403, message: "Refresh token is not valid" });
      } else {
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
          (err, user) => {
            if (err) {
              return next(err);
            }
            db.users
              .update({ refreshToken: "" }, { where: { id: user.id } })
              .then(([destroyRefreshToken]) => {
                if (destroyRefreshToken !== 0) {
                  const newRefreshToken = jwt.sign(
                    { id: user.id, roleKey: user.roleKey },
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
                  );

                  const newAccessToken = jwt.sign(
                    {
                      id: user.id,
                      roleKey: user.roleKey,
                    },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
                  );

                  db.users
                    .update(
                      { refreshToken: newRefreshToken },
                      {
                        where: { id: user.id },
                      }
                    )
                    .then(([updateRefreshToken]) => {
                      if (updateRefreshToken !== 0) {
                        // res.cookie("refreshToken", newRefreshToken, {
                        //   // httpOnly: true,
                        //   // secure: false,
                        //   // path: "/",
                        //   // sameSite: "strict",
                        // });
                        return res.status(200).json({
                          accessToken: newAccessToken,
                          refreshToken: newRefreshToken,
                        });
                      } else {
                        return next({ statusCode: 404, message: "Not Found" });
                      }
                    });
                } else {
                  return next({ statusCode: 404, message: "Not Found" });
                }
              })
              .catch((err) => next(err));
          }
        );
      }
    })
    .catch((err) => next(err));
};

export const oathWithGoogle = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return next({
        statusCode: 401,
        message: "Authorization code not provided!",
      });
    }

    const { id_token, access_token } = await getGoogleOauthToken(code);

    const googleUser = await getGoogleUser(id_token, access_token);

    if (!googleUser.verified_email) {
      return next({
        statusCode: 403,
        message: "Google account not verified",
      });
    }

    const user = await db.users.findOne({
      where: { email: googleUser.email.toLowerCase() },
      include: [
        {
          model: db.photos,
          as: "avatarData",
          attributes: ["url"],
        },
      ],
      raw: false,
      nest: true,
    });

    if (user) {
      const refreshToken = jwt.sign(
        { id: user.id, roleKey: user.roleKey },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
      );

      const accessToken = jwt.sign(
        {
          id: user.id,
          roleKey: user.roleKey,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
      );

      await db.users.update(
        { refreshToken },
        {
          where: { id: user.id },
        }
      );
      const {
        id,
        firstName,
        lastName,
        roleKey,
        avatarData: { url: avatarUrl },
      } = user;

      res.cookie(
        "data",
        JSON.stringify({ id, firstName, lastName, roleKey, avatarUrl }),
        {
          expires: new Date(Date.now() + 1 * 60 * 1000),
        }
      );

      res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 1 * 60 * 1000),
      });
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 1 * 60 * 1000),
      });

      return res.redirect(process.env.REACT_URL);
    } else {
      const randomPassword = generateRandomPassword(8);

      const createUser = await db.users.create({
        email: googleUser.email.toLowerCase(),
        password: randomPassword,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
      });

      const { url } = await db.photos.create({
        userId: createUser.id,
        url: googleUser.picture,
        type: "AvatarUser",
        publicId: createUser.id,
      });

      const refreshToken = jwt.sign(
        { id: createUser.id, roleKey: createUser.roleKey },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
      );

      const accessToken = jwt.sign(
        {
          id: createUser.id,
          roleKey: createUser.roleKey,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
      );

      await db.users.update(
        { refreshToken },
        {
          where: { id: createUser.id },
        }
      );
      const { id, firstName, lastName, roleKey } = createUser;

      res.cookie(
        "data",
        JSON.stringify({ id, firstName, lastName, roleKey, avatarUrl: url }),
        {
          expires: new Date(Date.now() + 5 * 60 * 1000),
        }
      );

      res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 5 * 60 * 1000),
      });
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.redirect(process.env.REACT_URL);
    }
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = (req, res, next) => {
  const { email, language } = req.body;
  db.users
    .findOne({ where: { email } })
    .then((user) => {
      if (user) {
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
          secret: secret.base32,
          encoding: "base32",
        });
        req.app.locals.OTP = otp;
        req.app.locals.emailOTP = email;

        setTimeout(() => {
          req.app.locals.OTP = null;
        }, 5 * 60 * 1000);

        sendForgotPassword({
          email,
          language,
          otp,
        })
          .then(() => {
            return res.status(200).json({
              message: "We have sent the OTP to your gmail. Please check it.",
            });
          })
          .catch((err) => {
            return next(err);
          });
      } else next({ statusCode: 404, message: "Account does not exist" });
    })
    .catch((err) => {
      return next(err);
    });
};

export const verifyOTP = (req, res, next) => {
  const { otp } = req.body;
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    const resetPasswordToken = jwt.sign(
      {
        email: req.app.locals.emailOTP,
      },
      process.env.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRE }
    );

    req.app.locals.OTP = null;
    req.app.locals.emailOTP = null;
    req.app.locals.resetSession = true;

    return res
      .status(201)
      .json({ message: "Verification successful", resetPasswordToken });
  } else {
    return next({ statusCode: 400, message: "Invalid OTP" });
  }
};

export const resetPassword = (req, res, next) => {
  const { newPassword, token } = req.body;

  if (!req.app.locals.resetSession) {
    return next({ statusCode: 403, message: "Session expired!" });
  } else {
    jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET, (err, decoded) => {
      if (err) {
        return next({ statusCode: 403, message: "Invalid token" });
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => {
            bcrypt
              .hash(newPassword, salt)
              .then((hash) => {
                db.users
                  .update(
                    { password: hash },
                    { where: { email: decoded.email } }
                  )
                  .then(([updatePassword]) => {
                    if (updatePassword !== 0) {
                      req.app.locals.resetSession = false;
                      return res.status(200).json({
                        message: "Reset password successfully",
                      });
                    } else {
                      return next({ statusCode: 404, message: "Not Found" });
                    }
                  })
                  .catch((err) => {
                    return next(err);
                  });
              })
              .catch((error) => next(error));
          })
          .catch((error) => next(error));
      }
    });
  }
};
