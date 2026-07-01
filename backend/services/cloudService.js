const { cloudinary } = require("../config/cloudinary");

const uploadImage = async (filePath, folder = "chardham") => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return { url: result.secure_url, publicId: result.public_id };
};

const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
