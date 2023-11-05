import * as Yup from "yup";

export const validateUsers = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: JSON.parse(req.body.data),
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const body = Yup.object({
  body: Yup.object({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Phone is invalid")
      .required("Phone is required"),
    password: Yup.string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password does not match!")
      .required("Confirm password is required."),

    firstName: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    lastName: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    CIC: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    country: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    genderKey: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    birthday: Yup.date().nullable(),
  }),
});

export const bodyUpdate = Yup.object({
  body: Yup.object({
    phone: Yup.string()
      .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Phone is invalid")
      .required("Phone is required"),
    firstName: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    lastName: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    CIC: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    country: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    genderKey: Yup.string().max(32, "Maximum of 32 characters").nullable(),
    birthday: Yup.date().nullable(),
  }),
});

export const validateUsersStatus = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const updateStatus = Yup.object({
  body: Yup.object({
    userStatusKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room status key is required"),
  }),
});

export const validateUpdatePassword = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};
export const passwordUpdate = Yup.object({
  body: Yup.object({
    oldPassword: Yup.string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("Old password is required"),
    newPassword: Yup.string()
      .min(8, "Minimum of 8 characters")
      .max(32, "Maximum of 32 characters")
      .required("New password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Password does not match!")
      .required("Confirm new password is required."),
  }),
});

export const validateUsersParams = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const params = Yup.object({
  params: Yup.object({
    id: Yup.string().required(),
  }),
});
