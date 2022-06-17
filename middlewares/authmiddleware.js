require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = authorization.split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({errorMessage: "로그인 후 이용 가능한 기능입니다.",});
  }

  try {
    const nickname = jwt.verify(authToken, process.env.SECRET_KEY);
    User.findOne({ nickname }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
};

// const token = jwt.sign({ userId: Users.userId }, "my-secret-key");
//     console.log(`${username}님이 로그인 하셨습니다.`)
