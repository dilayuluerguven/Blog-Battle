require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({msg: 'backend started'});
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
  })
  .catch(err => console.error(err));
  app.use("/uploads", express.static("uploads"));

  const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const blogRoutes = require("./routes/blogs");
app.use("/api/blogs", blogRoutes);

const matchRoutes = require("./routes/match");
app.use("/api/match", matchRoutes);

const tournamentRoutes = require("./routes/tournament");
app.use("/api/tournament", tournamentRoutes);

const userRoutes=require("./routes/users");
app.use("/api/users",userRoutes);

