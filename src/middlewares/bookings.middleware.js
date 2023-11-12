import * as Yup from "yup";

export const validateBookings = (schema) => async (req, res, next) => {
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
    roomId: Yup.string()
      .max(50, "Maximum of 50 characters")
      .required("Room Code Key is required"),
    userId: Yup.string()
      .max(50, "Maximum of 50 characters")
      .required("Room Code Key is required"),

    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Phone is invalid")
      .required("Phone is required"),
    firstName: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Last name is required"),
    CIC: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Citizen ID is required"),
    country: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Country is required"),
    paymentTypeKey: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Payment type key is required"),

    checkIn: Yup.date().required("Check in is required"),
    checkOut: Yup.date().required("Check out is required"),
    days: Yup.number().required("Days is required"),
    adult: Yup.number().required("Adult is required"),
    child: Yup.number().required("Child is required"),

    totalPrice: Yup.number().required("Total price is required"),

    language: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Language is required"),
  }),
});

export const updateStatus = Yup.object({
  body: Yup.object({
    bookingStatusKey: Yup.string()
      .max(50, "Maximum of 50 characters")
      .required("Status booking key is required"),
    roomId: Yup.string()
      .max(50, "Maximum of 50 characters")
      .required("Room ID is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    language: Yup.string()
      .max(32, "Maximum of 32 characters")
      .required("Language is required"),
  }),
});

export const verify = Yup.object({
  body: Yup.object({
    token: Yup.string().required("Token is required"),
    bookingId: Yup.string().required("Booking ID is required"),
  }),
});

export const validateBookingsParams = (schema) => async (req, res, next) => {
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

export const validateBookingsQuery = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      query: req.query,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const bookingTypeAdmin = Yup.object({
  query: Yup.object({
    type: Yup.string().required(),
  }),
});
export const bookingTypeUser = Yup.object({
  query: Yup.object({
    type: Yup.string().required(),
    userId: Yup.string().required(),
  }),
});
