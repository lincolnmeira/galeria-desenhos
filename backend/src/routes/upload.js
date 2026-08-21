const express = require("express");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /upload - envia uma imagem e recebe a URL de volta
router.post("/", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada" });
  }

  res.json({ imageUrl: req.file.path });
});

module.exports = router;