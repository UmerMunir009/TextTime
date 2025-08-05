const jwt = require("jsonwebtoken");

module.exports.generateToken = (userData) => {
  const payLoad = {...userData}
  return jwt.sign(payLoad, process.env.JWT_SECRETE_KEY, { expiresIn: "5d" });
};


module.exports.verifyJWTToken = (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
      resolve({ err, decoded });
    });
  });
};