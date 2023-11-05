import * as Yup from "yup";

export const validateRoomTypes = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: JSON.parse(req.body.data),
      files: req.files,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const body = Yup.object({
  body: Yup.object({
    roomTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room type key is required"),
    bedTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Bed Type Key is required"),

    pricePerNight: Yup.number().required("Price Per Night is required"),
    occupancy: Yup.number()
      .max(10, "Maximum of 10 quantities")
      .required("Quantity Guests is required"),
    checkInOutTime: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("Check In and Check Out Time is required"),
    size: Yup.number()
      .max(200, "Maximum of 200 m2")
      .required("Size is required"),

    featuresVi: Yup.string().nullable(),
    featuresEn: Yup.string().nullable(),
    descriptionVi: Yup.string().nullable(),
    descriptionEn: Yup.string().nullable(),

    newAllAmenities: Yup.array()
      .of(Yup.object().required())
      .min(1, "Amenities are empty")
      .required(),
  }),
  files: Yup.array()
    .of(Yup.object().required())
    .min(1, "Files are empty")
    .required(),
});

export const bodyUpdate = Yup.object({
  body: Yup.object({
    roomTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room type key is required"),
    bedTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Bed Type Key is required"),

    pricePerNight: Yup.number().required("Price Per Night is required"),
    occupancy: Yup.number()
      .max(10, "Maximum of 10 quantities")
      .required("Quantity Guests is required"),
    checkInOutTime: Yup.string()
      .max(100, "Maximum of 100 characters")
      .required("Check In and Check Out Time is required"),
    size: Yup.number()
      .max(200, "Maximum of 200 m2")
      .required("Size is required"),

    featuresVi: Yup.string().nullable(),
    featuresEn: Yup.string().nullable(),
    descriptionVi: Yup.string().nullable(),
    descriptionEn: Yup.string().nullable(),

    newAllAmenities: Yup.array()
      .of(Yup.object().required())
      .min(1, "Amenities are empty")
      .required(),
  }),
  files: Yup.array().of(Yup.object().nullable()).nullable(),
});

export const validateRoomTypesParams = (schema) => async (req, res, next) => {
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
    roomTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Room Type Key is required"),
  }),
});

export const validateRoomTypesQuery = (schema) => async (req, res, next) => {
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
  }),
});
