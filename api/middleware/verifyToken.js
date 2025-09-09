const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token eksik!" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // token içindeki kullanıcı bilgisi
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token geçersiz veya süresi dolmuş!" });
  }
};

module.exports = verifyToken;
