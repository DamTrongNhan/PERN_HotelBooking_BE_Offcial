import * as yup from "yup";
import { rateLimit } from "express-rate-limit";
export const validateAuth = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const signInSchema = yup.object({
  body: yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("Password is required"),
  }),
});

export const signUpSchema = yup.object({
  body: yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password does not match!")
      .required("Confirm password is required."),
  }),
});

export const forgotPasswordSchema = yup.object({
  body: yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    language: yup
      .string()
      .max(32, "Maximum of 32 characters")
      .required("Language is required"),
  }),
});

export const verifyOTPSchema = yup.object({
  body: yup.object({
    otp: yup.string().required("otp is required"),
  }),
});

export const resetPasswordSchema = yup.object({
  body: yup.object({
    token: yup.string().required("Token is required"),
    newPassword: yup
      .string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("Password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Password does not match!")
      .required("Confirm new password is required."),
  }),
});

// -----------------
// 3h with 10 time access
export const loginRareLimit = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
