import * as Yup from "yup";

export const validatePosts = (schema) => async (req, res, next) => {
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
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    content: Yup.string().required("Content is required"),
  }),
  file: Yup.object({
    file: Yup.mixed().required("File is required"),
  }),
});

export const validatePostsParams = (schema) => async (req, res, next) => {
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
