const router = require("express").Router();
const Blog = require("../models/Blog.js");
const TournamentMatch = require("../models/Tournaments.js");
const verifyToken = require("../middleware/verifyToken.js");

// Yeni blog ekleme ve otomatik turnuva eşleşmesi
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const newBlog = new Blog({
      title,
      content,
      category,
      image,
      author: req.user.id
    });

    await newBlog.save();

    // Yeni blog ile eşleşecek diğer blogları bul
    const otherBlogs = await Blog.find({ 
      _id: { $ne: newBlog._id },
      author: { $ne: req.user.id }
    });

    // Her blogla eşleşme oluştur
    for (const other of otherBlogs) {
      const existingMatch = await TournamentMatch.findOne({
        $or: [
          { blog1: newBlog._id, blog2: other._id },
          { blog1: other._id, blog2: newBlog._id }
        ]
      });

      if (!existingMatch) {
        const newMatch = new TournamentMatch({
          round: 1,
          blog1: newBlog._id,
          blog2: other._id,
          blog1Author: newBlog.author,
          blog2Author: other.author,
          category: newBlog.category,
          completed: false,
          votes: []
        });
        await newMatch.save();
        console.log(`Yeni eşleşme oluşturuldu: "${newBlog.title}" vs "${other.title}"`);
      }
    }

    res.status(200).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Tüm blogları listeleme (kategori filtreli)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let blogs;
    if (category) {
      blogs = await Blog.find({ category }).populate("author", "username _id avatar");
    } else {
      blogs = await Blog.find().populate("author", "username _id avatar");
    }
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Kullanıcının kendi bloglarını çekme (profil sayfası için)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).populate("author", "username _id avatar");
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bloglar alınamadı" });
  }
});

// Blog güncelleme
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Yetkiniz yok" });

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Blog silme
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Yetkiniz yok" });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog silindi" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
