const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    avatar: { type: String },
  },

  { timestamps: true }
);
const User = mongoose.model("users", UserSchema);

module.exports = User;
