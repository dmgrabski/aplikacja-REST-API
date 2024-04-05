const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || token !== user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
