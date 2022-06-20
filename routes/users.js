require("dotenv").config();
const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const SALT_NUM = process.env.SALT_NUM

// 회원가입 조건
const signUpSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  nickname: Joi.string()
    .pattern(new RegExp("^[0-9A-Za-z가-힣]{2,10}$"))
    .required(),
  password: Joi.string().pattern(new RegExp("^[0-9A-Za-z]{4,16}$")).required(),
  passwordCheck: Joi.string(),
});
// 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { email, nickname, password, passwordCheck } =
      await signUpSchema.validateAsync(req.body);

    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).send({
        message: "사용중인 이메일입니다.",
        result: false,
      });
      return;
    }
    const existnickname = await User.findOne({ nickname });
    if (existnickname) {
      res.status(400).send({
        message: "사용중인 닉네임입니다.",
        result: false,
      });
      return;
    }
    // 비밀번호와 비밀번호 확인란이 일치하지 않을 경우
    if (password !== passwordCheck) {
      res.status(400).send({
        message: "비밀번호 확인란이 일치하지 않습니다.",
        result: false,
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화
    
    const user = new User({ email, nickname, password: hashedPassword });
    await user.save();
    res.status(201).send({
      message: "회원가입에 성공하였습니다.",
      result: true,
    });
  } catch (err) {
    res.status(400).send(console.error(err));
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  let bcpassword = "";
  if (user) {
    bcpassword = await bcrypt.compare(password, user.password);
  }
  if (!bcpassword) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      result: false,
    });
    return;
  }

  const accessToken = jwt.sign({ nickname: user.nickname }, process.env.SECRET_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
    expiresIn: "10d",
  });
  await user.update(
    { refreshToken },
    { where: { nickname: user.nickname } }
  )
  res.send({
    accessToken
  });
});

module.exports = router;
