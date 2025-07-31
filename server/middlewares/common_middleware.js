const { CommisionRates, familyChat, familyUser } = require("../../models");
async function roleCheckMiddleware(req, res, next) {
  const { familyId } = req.body;
  const userId = req.user.id;

  try {
    const user = await familyUser.findOne({
      where: { userId: userId, familyId: familyId },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found or not authorized" });
    }
    if (user.role === "Owner" || user.role === "Member") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Invalid role." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = roleCheckMiddleware;
