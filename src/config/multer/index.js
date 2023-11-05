import multer from "multer";
import imageFilter from "../../utils/imageFilter";

const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage: storage,
  fileFilter: imageFilter,
});

const uploadMultiple = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("files", 10);

export const validateUploadMultiple = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return next({
        statusCode: 400,
        message: "You have uploaded a file that exceeds the allowed limit",
      });
    } else if (err) {
      return next(err);
    } else {
      return next();
    }
  });
};
