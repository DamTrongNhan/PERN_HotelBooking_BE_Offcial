import cloudinary from "../config/cloudinary";

export const handleUploadSingle = (file, type) => {
  const folderMap = {
    user: "NhanManor/accountUser",
    roomType: "NhanManor/roomTypes",
    service: "NhanManor/thumbnailService",
  };

  const folder = folderMap[type] || "Unknown";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(file, {
        resource_type: "auto",
        folder: folder,
      })
      .then((cldRes) => {
        resolve(cldRes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleDestroySingle = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .destroy(public_id)
      .then((cldRes) => {
        resolve(cldRes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
