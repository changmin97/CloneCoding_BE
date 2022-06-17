require("dotenv").config();
const express = require("express");
const User = require("../schemas/user");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const jwt = require("jsonwebtoken");

//피드백:1 조건부족 이메일형식아닐때 "이메일 형식이아닙니다." / 길이, 2 return 넣기
// 3 jsonwebtoken 모듈안쓰심 4 안쓰는 스키마 지움

//생각해보니까 아이디 중복,닉네임중복 라우터 따로 만들어야함
//잘 작동합니다 bb

//이제 암호화 해주시면 될것같습니다! bcrypt 쓰는법
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

module.exports = router;
