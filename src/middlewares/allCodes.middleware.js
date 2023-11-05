import * as Yup from "yup";

export const validateAllCodes = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const body = Yup.object({
  body: Yup.object({
    keyMap: Yup.string().max(10).required("Key Map is required"),
    type: Yup.string().required("Type is required"),
    valueVi: Yup.string().required("Value Vi is required"),
    valueEn: Yup.string().required("Value En is required"),
  }),
});

export const validateAllCodesParams = (schema) => async (req, res, next) => {
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
export const typeParams = Yup.object({
  params: Yup.object({
    type: Yup.string().required(),
  }),
});
