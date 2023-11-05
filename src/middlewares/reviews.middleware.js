import * as Yup from "yup";

export const validateReviews = (schema) => async (req, res, next) => {
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
    userId: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("User id is required"),
    roomTypeId: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("Room type id is required"),
    star: Yup.number().max(5, "Maximum 5 stars").required("Star is required"),
    review: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("Review is required"),
  }),
});

export const validateReviewsParams = (schema) => async (req, res, next) => {
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

export const validateReviewsQuery = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      query: req.query,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};
export const query = Yup.object({
  query: Yup.object({
    page: Yup.number().required(),
    size: Yup.number().required(),
    roomTypeId: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("Room type id is required"),
  }),
});
