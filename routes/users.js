require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("../controller/users")

// 회원가입
router.post("/signup", userController.signup)
// 로그인
router.post("/login", userController.login)

// 로그아웃

module.exports = router;
