require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const Post = require("../schemas/post");

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

  try {
    const myToken = verifyToken(tokenValue);
    if (myToken == "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
      console.log(userInfo);
      const nickname = userInfo.nickname;
      let refresh_token;
      User.findOne({ where: nickname }).then((u) => {
        refresh_token = u.refresh_token;
        const myRefreshToken = verifyToken(refresh_token);
        if (myRefreshToken == "jwt expired") {
          res.send({ errorMessage: "로그인이 필요합니다." });
        } else {
          const myNewToken = jwt.sign({ nickname: u.nickname }, process.env.SECRET_KEY, {
            expiresIn: "1200s",
          });
          res.send({ message: "new token", myNewToken });
        }
      });
    } else {
      const { nickname } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      User.findOne({ nickname }).then((u) => {
        res.locals.user = u;
        next();
      });
    }
  } catch (err) {
    res.send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}

module.exports = (req, res, next) => {
  Post.find({}).then((post) => {
    res.locals.post = post;
    next();
  });
};
