require("dotenv").config();
const express = require("express");
const User = require("../schemas/user");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
//필요한 스키마 연결해주세요


module.exports = router;