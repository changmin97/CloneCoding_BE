const express = require("express");
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const moment = require('moment')

// 메인페이지
router.get("/main", (req, res) => {
  res.json({ result: true });
});

// 게시물 조회 메인
router.get("/post", authMiddleware, async (req, res, next) => {
  try {
    const posts = await Post.find({}).sort({ createAt: -1 });
    res.send(posts);
  } catch (error) {
    res.status(500).json({ success: false, message: "실패했습니다." }); 
  }
});
// 게시물 상세 조회 메인 상세
router.get(
  "/post/postdetail/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const postDetail = await Post.findOne({ postId });
      const existcomments = await Comment.find({ postId });
      return res.status(200).json({ postDetail, existcomments });
    } catch (error) {
      return res.status(400).json({ success: false, message: "실패했습니다." });
    }
  }
);

// 게시물 상세 조회 메인 상세
router.get(
  "/post/postdetail/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const postDetail = await Post.findOne({ postId });
      const existcomments = await Comment.find({ postId });
      return res.status(200).json({ postDetail, existcomments });
    } catch (error) {
      res.status(400).json({ result: false, errorMessage: "실패했습니다." });
    }
  }
);

// 게시물 작성
router.post("/post/upload", authMiddleware, async (req, res) => {

try {
  var createAt = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')
    const { nickname } = res.locals.user;
    console.log(nickname)
    const { title, content, imageUrl } = req.body;
    const maxPostId = await Post.findOne().sort("-postId");
    let postId = 1;
    if (maxPostId) {
      postId = maxPostId.postId + 1;
    }
    const createdPost = await Post.create({
      postId,
      title,
      content,
      imageUrl,
      nickname,
      createAt,
    });
    return res.json({ post: createdPost });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: "실패했습니다." });
  }
});

//게시글 수정
router.put(
  "/post/postdetail/edit/:postId",
  authMiddleware,
  async (req, res) => {
    try {
      const postId = Number(req.params.postId);
      const [existPost] = await Post.find({ postId });
      const { user } = res.locals;
      const { title, content, imageUrl } = req.body;
      console.log("user.nickname 정보입니다.", user.nickname);
      console.log("existPost.nick 정보입니다.", existPost.nickname);
      console.log(existPost);
      if (user.nickname !== existPost.nickname) {
        return res
          .status(400)
          .json({ result: false, message: "본인의 게시글만 수정 가능합니다." });
      }
      if (!content || !title || !imageUrl) {
        return res
          .status(400)
          .json({ result: false, message: "빈값을 채워주세요" });
      }

      await Post.updateOne({ postId }, { $set: { title, content, imageUrl } });
      return res.status(200).json({ result: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: "실패했습니다." });
    }
  }
);

// 게시물 삭제
router.delete(
  "/post/postdetail/remove/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { nickname } = req.body;
      const { postId } = req.params;
      const { user } = res.locals;
      const deletePost = await Post.findOneAndDelete(Number(postId));
      
      if (user.nickname) {
        return res.json({
          success: true,
          Message: `${deletePost} "삭제되었습니다"`,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ result: false, Message: "실패했습니다." });
    }
  }
);

// 게시물 검색
router.get("/post/search/:word", authMiddleware, async (req, res, next) => {
  const { word } = req.params;
  const { title } = req.body;
  let postArr = [];

  try {
    let posts = await Post.find({ title });
    for (let i in posts) {
      if (posts[i].title.includes(word)) {
        postArr.push(posts[i]);
      }
    }
    return res.status(200).send(postArr);
  } catch (error) {
    return res.status(400).json({ result: false, Message: "실패했습니다." });
  }
});

router.get("/mypage", authMiddleware, async (req, res, next) => {
  const { nickname } = res.locals.user;
  const posts = await Post.find({nickname});

  res.json({
    nickname,
    posts
  })
});


module.exports = router;
