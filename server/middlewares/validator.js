module.exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMsg = error.details[0].message;
      const err = errorMsg.replace(/"/g, "");
      return res.status(400).json({ status: 400, error: err });
    }
    next();
  };
};
