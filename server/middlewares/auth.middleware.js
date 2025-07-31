const { verifyJWTToken } = require("../utils/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");

const authenticate = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header || !header.startsWith("Bearer")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.INVALID_AUTH_TOKEN });
  }

  const accessToken = header.split(" ")[1];
  if (accessToken) {
    const result = await verifyJWTToken(accessToken);
    if (result.err) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: TEXTS.INVALID_AUTH_TOKEN });
    } else {
      req.user = result.decoded;
      next();
    }
  } else {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.NO_AUTH_GIVEN });
  }
};

module.exports = {
  authenticate,
};
