// routes/match.js
const router = require("express").Router();
const Blog = require("../models/Blog.js");
const TournamentMatch = require("../models/Tournaments.js");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("blog match")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


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

    if (blog.author._id.toString() === userId) {
      return res.status(403).json({ error: "Kendi blogunuza oy veremezsiniz!" });
    }

    const alreadyVoted = blog.votes.some(v => v.user.toString() === userId);
    if (alreadyVoted) return res.status(403).json({ error: "Bu bloga zaten oy verdiniz!" });

    blog.votes.push({ user: userId });
    await blog.save();

    await Notification.create({
      user: blog.author._id, 
      blog: blog._id,
      message: `${req.user.username} bloğunuza oy verdi!`,
    });

    res.status(200).json({
      message: "Oy verildi ve blog sahibine bildirim gönderildi!",
      votesCount: blog.votes.length,
      blog
    });

  } catch (err) {
    res.status(400).json(err);
  }
});


router.post("/create-match", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username email");
    if (blogs.length < 2) return res.status(400).json({ error: "Yeterli blog yok" });

    const usedPairs = new Set();
    const matchesCreated = [];

    for (let i = 0; i < blogs.length; i++) {
      for (let j = i + 1; j < blogs.length; j++) {
        if (blogs[i].author._id.toString() !== blogs[j].author._id.toString()) {
          const pairKey = [blogs[i]._id, blogs[j]._id].sort().join("-");
          if (!usedPairs.has(pairKey)) {
            const newMatch = new TournamentMatch({
              round: 1,
              blog1: blogs[i]._id,
              blog2: blogs[j]._id,
              category: blogs[i].category,
              completed: false,
              votes: []
            });
            await newMatch.save();
            usedPairs.add(pairKey);
            matchesCreated.push(newMatch);

await Notification.create({
  user: blogs[i].author._id, 
  blog: blogs[i]._id,
  match: newMatch._id,
  message: "Yazın şu an oylamada!"
});

await Notification.create({
  user: blogs[j].author._id, 
  blog: blogs[j]._id,
  match: newMatch._id,
  message: "Yazın şu an oylamada!"
});


          }
        }
      }
    }

    res.status(200).json({ message: "Eşleşmeler oluşturuldu", matches: matchesCreated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
