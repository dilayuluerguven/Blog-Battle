const router = require("express").Router();
const TournamentMatch = require("../models/Tournaments.js");
const Blog = require("../models/Blog.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/", async (req, res) => {
  try {
    let matches = await TournamentMatch.find()
      .populate({ path: "blog1", populate: { path: "author", select: "username email" } })
      .populate({ path: "blog2", populate: { path: "author", select: "username email" } })
      .populate("winner");

    if (matches.length === 0) {
      const blogs = await Blog.find().populate("author", "username email");

      if (blogs.length >= 2) {
        const usedPairs = new Set();

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
              }
            }
          }
        }

        matches = await TournamentMatch.find()
          .populate({ path: "blog1", populate: { path: "author", select: "username email" } })
          .populate({ path: "blog2", populate: { path: "author", select: "username email" } })
          .populate("winner");
      }
    }

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:matchId/vote", verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { blogId } = req.body;
    const userId = req.user.id;

    const match = await TournamentMatch.findById(matchId)
      .populate({ path: "blog1", populate: { path: "author", select: "_id username email" } })
      .populate({ path: "blog2", populate: { path: "author", select: "_id username email" } });

    if (!match) return res.status(404).json({ error: "Maç bulunamadı" });

    if (match.votes.some(v => v.user.toString() === userId)) {
      return res.status(403).json({ error: "Bu maçta zaten oy kullandınız!" });
    }

    const blogToVote = [match.blog1._id.toString(), match.blog2._id.toString()].includes(blogId);
    if (!blogToVote) return res.status(400).json({ error: "Geçersiz blog seçimi" });

    const chosenBlog =
      blogId === match.blog1._id.toString() ? match.blog1 : match.blog2;

    if (chosenBlog.author._id.toString() === userId) {
      return res.status(403).json({ error: "Kendi blogunuza oy veremezsiniz!" });
    }

    match.votes.push({ user: userId, blog: blogId });

    if (match.votes.length >= 2) {
      const voteCounts = {};
      match.votes.forEach(v => {
        voteCounts[v.blog] = (voteCounts[v.blog] || 0) + 1;
      });
      const winnerBlogId = Object.keys(voteCounts).reduce((a, b) =>
        voteCounts[a] > voteCounts[b] ? a : b
      );
      match.completed = true;
      match.winner = winnerBlogId;
    }

    await match.save();

    const updatedMatch = await TournamentMatch.findById(matchId)
      .populate({ path: "blog1", populate: { path: "author", select: "username email" } })
      .populate({ path: "blog2", populate: { path: "author", select: "username email" } })
      .populate("winner");

    res.status(200).json({ match: updatedMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
