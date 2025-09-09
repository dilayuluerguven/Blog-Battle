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
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
