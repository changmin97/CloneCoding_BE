const express = require("express");
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const user = require("../schemas/user");

// 메인페이지
router.get('/main',(req,res)=>{
    res.json({ result : true })
})
// 게시물 조회 메인
router.get("/post", authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  try {
    const posts = await Post.find({}).sort({ createAt: -1 });
    res.send(posts);
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: "실패했습니다." });
  }
});
// 게시물 상세 조회 메인 상세
router.get("/post/postdetail/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postDetail = await Post.findOne({
      postId,
    });
    res.status(200).json({ postDetail });
  } catch (error) {
    res.status(400).json({ success: false, errorMessage: "실패했습니다." });
  }
});

// 게시물 작성
router.post("/post/upload", authMiddleware, async (req, res) => {
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
  });
  res.json({ post: createdPost });
});
//게시글 수정
router.put('post/postdetail/edit/:postId',authMiddleware, async(req,res)=>{
    const { postId } = req.params
    const [existPost] = await Post.findOne({ PostId: Number(postId)})
    const user = res.locals.user
    const {content, title, name } = req.body
    
    if(user.nickname !== existPost.nickname){
        return res.status(400).json({ result : false, message : "본인의 게시글만 수정 가능합니다."})
    }
    if(user.nickname === existPost.nickname){
        await Post.updateOne({listId}, {$set: {content, title, name} } )
        return res.status(200).json({ result: true })
    }
    if(!content||!title||!name){
        return res.status(400).json({ result: true })
    }
//여기도 merge후 콘솔 찍어보면서 findone으로 고치기, 아래 코드도 틀릴경우만 if문으로 묶고 성공은 풀기로 수정하자 기여운창민아,
})

// 게시물 삭제
router.delete("/post/postdetail/delete/:postId", authMiddleware, async (req, res, next) => {

  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const deletePost = await Post.findOneAndDelete(Number(postId));
    if (deletePost.nickname !== user.nickname) {
      return res.json({
        result: false,
        Message: "타인의 게시글은 삭제할 수 없습니다.",
      });
    }
    return res.json({
      success: true,
      Message: `${deletePost} "삭제되었습니다"`,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "실패했습니다." });
  }
});

module.exports = router;
