require("dotenv").config();
const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({
        result: true,
    });
});

// 로그인
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
            result: false,
        });
        return;
    }

    res.send({
        token: jwt.sign({ userId: user.userId }, process.env.SECRET_KEY),
        result: true,
    });
});

/* 남은 일
    아이디, 닉네임 중복체크 구현
    회원가입 시 비밀번호 암호화 */

// 아이디(이메일) 중복체크
router.get("/idCheck/:username", async (req, res) => {
    const email = req.params.username;
    const existUser = await User.findOne({ email });
    
    if (existUser) {
        res.status(400).send({
            errorMessage: "사용중인 이메일입니다.",
            result: false,
        });
        return;
    }

    res.send({
        errorMessage: "사용 가능한 이메일입니다.",
        result: true,
    });
});

// 닉네임 중복체크
router.get("/nicknameCheck/:nickname", async (req, res) => {
    const nickname = req.params.nickname;
    const existnickname = await User.findOne({ nickname });
    
    if (existnickname) {
        res.status(400).send({
            errorMessage: "사용중인 닉네임입니다.",
            result: false,
        });
        return;
    }

    res.send({
        errorMessage: "사용 가능한 닉네임입니다.",
        result: true,
    });
});

module.exports = router;
