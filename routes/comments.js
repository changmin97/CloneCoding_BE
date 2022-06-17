const express = require("express");
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
//필요한 스키마 연결해주세요
//브랜치 확인용 commit

module.exports = router;