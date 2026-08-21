const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "galeria-desenhos",
    allowed_formats: ["png"],
  },
});

const upload = multer({ storage });

module.exports = upload;