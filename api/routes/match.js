const router = require("express").Router();
const Blog = require("../models/Blog.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/random", async (req, res) => {
  try {
    const blogs = await Blog.aggregate([{ $sample: { size: 2 } }]);
    const blogsPopulated = await Blog.populate(blogs, {
      path: "author",
      select: "username email",
    });
    res.status(200).json(blogsPopulated);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 }); 
    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/vote", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username email");
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });

    const userId = req.user.id;

    if (!blog.votes || !Array.isArray(blog.votes)) blog.votes = [];

    const alreadyVoted = blog.votes.some(v => v.user.toString() === userId);
    if (alreadyVoted) return res.status(403).json({ error: "Bu bloga zaten oy verdiniz!" });

    blog.votes.push({ user: userId });
    await blog.save();

    res.status(200).json({
      message: "Oy verildi!",
      votesCount: blog.votes.length,
      blog
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
