const { errorHelper } = require("../../../utils/index.js");

module.exports = async (req, res, next) => {
  let token = req.header("Authorization");

  try {
    if (!token) return res.status(401).json(errorHelper("00006", req));

    next();
  } catch (err) {
    return res.status(401).json(errorHelper("00012", req, err.message));
  }
};
