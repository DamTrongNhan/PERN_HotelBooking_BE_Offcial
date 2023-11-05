import * as Yup from "yup";

export const validateChatRealTimes = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

export const getMemberSchema = Yup.object({
  body: Yup.object({
    adminId: Yup.string().required("Admin id is required"),
    customerId: Yup.string().required("Customer id is required"),
  }),
});
export const createContentChatSchema = Yup.object({
  body: Yup.object({
    memberChatId: Yup.string().required("Member chat id is required"),
    senderId: Yup.string().required("Sender id is required"),
    message: Yup.string().required("Message id is required"),
  }),
});

export const validateChatRealTimesParams =
  (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        params: req.params,
      });
      return next();
    } catch (err) {
      return res.status(400).json({ type: err.name, message: err.message });
    }
  };

export const id = Yup.object({
  params: Yup.object({
    id: Yup.string().required(),
  }),
});
