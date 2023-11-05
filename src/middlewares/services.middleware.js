import * as Yup from "yup";

export const validateServices = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: JSON.parse(req.body.data),
      file: req.file,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const body = Yup.object({
  body: Yup.object({
    type: Yup.string().required("Type is required"),
    keyMap: Yup.string().max(10).required("Key map is required"),
    titleVi: Yup.string().required("Title vi is required"),
    titleEn: Yup.string().required("Title en is required"),
    descriptionVi: Yup.string().required("Description vi is required"),
    descriptionEn: Yup.string().required("Description en is required"),
    price: Yup.number().required("Price is required"),
  }),
  file: Yup.object().required(),
});

export const update = Yup.object({
  body: Yup.object({
    type: Yup.string().required("Type is required"),
    keyMap: Yup.string().max(10).required("Key map is required"),
    titleVi: Yup.string().required("Title vi is required"),
    titleEn: Yup.string().required("Title en is required"),
    descriptionVi: Yup.string().required("Description vi is required"),
    descriptionEn: Yup.string().required("Description en is required"),
    price: Yup.number().required("Price is required"),
  }),
  file: Yup.object().nullable(),
});

export const validateServicesParams = (schema) => async (req, res, next) => {
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
