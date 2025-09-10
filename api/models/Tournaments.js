const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
});

const tournamentSchema = new mongoose.Schema({
  round: { type: Number, default: 1 },
  blog1: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  blog2: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  category: String,
  votes: [voteSchema],
  completed: { type: Boolean, default: false },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }
});

module.exports = mongoose.model("TournamentMatch", tournamentSchema);
