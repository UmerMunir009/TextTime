const jwt = require("jsonwebtoken");

module.exports.generateToken = (userData) => {
  const payLoad = {...userData}
  return jwt.sign(payLoad, process.env.JWT_SECRETE_KEY, { expiresIn: "10h" });
};

module.exports.verifyJWTToken = async (token) => {
    return jwt.verify(token, `${process.env.JWT_SECRETE_KEY}`, (err, decoded) => {
      return { err: err, decoded: decoded };
    });
  };