require("dotenv").config();
const express = require("express");
const User = require("../schemas/user");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
//필요한 스키마 연결해주세요

// 회원가입
router.post("/signup", async (req, res) => {
    const { email, nickname, password, passwordCheck } = req.body;

    // 비밀번호와 비밀번호 확인란이 일치하지 않을 경우
    if (password !== passwordCheck) {
        res.status(400).send({
            errorMessage: "비밀번호 확인란이 일치하지 않습니다.",
            result: false,
        });
        return;
    }

    const existUsers = await User.findOne({
        $or: [{ email }, { nickname }],
    });
    if (existUsers) {
        res.status(400).send({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
            result: false,
        });
        return;
    }

    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({
        result: true,
    });
});

// 로그인
router.post("/login", async (req, res) => {

});

module.exports = router;
