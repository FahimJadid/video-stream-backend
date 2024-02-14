import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file uploaded successfully
    // console.log("file uploaded successfully on cloudinary", response);
    // console.log("file uploaded successfully on cloudinary", response.url);

    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload completed successfully
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload failed
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    // delete file from cloudinary
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
