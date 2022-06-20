require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인이 필요한 기능입니다.",
      });
      return;
    }
    const { nickname } = jwt.verify(authToken, process.env.SECRET_KEY);
    User.findOne({ nickname }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }
};
