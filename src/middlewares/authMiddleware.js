const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
      };
    } catch (error) {
      console.error("Token verification fallback error:", error.message);
      return res.status(401).json({
        message: "Not authorized, session token has expired or is invalid.",
      });
    }
    next();
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, missing security access token.",
    });
  }
};
