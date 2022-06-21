const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const commentController = require("../controller/comments");

//댓글 작성
router.post("/post/postdetail/:postId/comment", authMiddleware, commentController.commentPost);
  
//댓글 삭제
router.delete("/post/postdetail/:postId/:commentId", authMiddleware, commentController.commentDelete);

//댓글 수정
router.put("/post/postdetail/:postId/:commentId", authMiddleware, commentController.commentPut);
  
module.exports = router;
