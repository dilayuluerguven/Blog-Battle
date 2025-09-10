const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı bilgileri alınamadı" });
  }
});

router.put("/me", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    const { username, email } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Blog.deleteMany({ author: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Hesabınız ve bloglarınız başarıyla silindi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hesap silinirken bir hata oluştu." });
  }
});

module.exports = router;
