const express = require("express");
const router = express.Router();
const postController = require("../controller/posts")
const authMiddleware = require("../middlewares/authmiddleware");

// 메인페이지
router.get("/main", postController.main)

// 게시물 조회 메인
router.get("/post", authMiddleware, postController.mainPost)
  
// 게시물 상세 조회 메인 상세
router.get("/post/postdetail/:postId", authMiddleware, postController.postDetail)
  
// 게시물 작성
router.post("/post/upload", authMiddleware, postController.postUpload)

//게시글 수정
router.put("/post/postdetail/edit/:postId", authMiddleware, postController.postEdit)
  
// 게시물 삭제
router.delete("/post/postdetail/remove/:postId", authMiddleware, postController.postRomove)
  
// 게시물 검색
router.get("/post/search/:word", authMiddleware, postController.postSearch)
  
// 마이페이지
router.get("/mypage", authMiddleware, postController.myPage)
  
module.exports = router;