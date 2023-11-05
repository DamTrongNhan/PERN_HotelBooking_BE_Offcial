import * as Yup from "yup";

export const validateRooms = (schema) => async (req, res, next) => {
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
    number: Yup.number().required("Number is required"),
    roomTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room type key is required"),
  }),
});

export const updateStatus = Yup.object({
  body: Yup.object({
    roomStatusKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room status key is required"),
  }),
});

export const validateRoomsParams = (schema) => async (req, res, next) => {
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

export const roomTypeKeyParams = Yup.object({
  params: Yup.object({
    roomTypeKey: Yup.string().required("Room type key is required"),
  }),
});

export const validateRoomsQuery = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      query: req.query,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};
export const getAllAvailable = Yup.object({
  query: Yup.object({
    roomTypeKey: Yup.string().required("Room type key is required"),
    checkIn: Yup.date().required("Check in is required"),
    checkOut: Yup.date().required("Check out is required"),
  }),
});
export const checkAvailable = Yup.object({
  query: Yup.object({
    roomId: Yup.string().required("Room id is required"),
    checkIn: Yup.date().required("Check in is required"),
    checkOut: Yup.date().required("Check out is required"),
  }),
});
