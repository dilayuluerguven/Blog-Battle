const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // burada
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // burada
      }
    ]
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
