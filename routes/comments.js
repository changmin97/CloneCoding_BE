const express = require("express");
const Comment = require("../schemas/comment");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const moment = require('momnet')


//댓글 작성
router.post("/post/postdetail/:postId/comment", authMiddleware, async (req, res) => {
    try {
      const createAt = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')
      const { postId } = req.params;
      const { comment } = req.body;
      const { nickname } = res.locals.user;
      
      const maxCommentId = await Comment.findOne({ postId }).sort({commentId: -1,});
      let commentId = 1;

      if (maxCommentId) {
        commentId = maxCommentId.commentId + 1;
      }
  
      await Comment.create({postId,commentId,nickname,comment,createAt});
      return res.json({ result : true });

    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  //댓글 삭제
  router.delete("/post/postdetail/:postId/:commentId", authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.params;
      const { nickname } = res.locals.user;
      const existcomment = await Comment.find({$and: [{ postId }, { commentId }],});
      // merge후 콘솔 찍어보면서 findone으로 고치기, 아래 코드도 틀릴경우만 if문으로 묶고 성공은 풀기로 수정하자 창민아
      if (nickname === existcomment[0].nickname) {
        await Comment.deleteOne({ commentId });
        return res.status(200).json({ result: true });
      } 
      else if (existcomment[0].nickname !== nickname) {
        return res.status(400).json({ 
            result : false,
            message: "타인의 댓글은 삭제 불가능합니다.",
         });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  // //댓글 수정
// router.put("post/postdetail/:postId/:commentId", authMiddleware, async (req, res) => {
//   const { postId } = req.params;
//   const { commentId } = req.params;
//   const { comment } = req.body;
//   const username = res.locals.user.username;
//   const existscomment = await Comment.find({$and: [{ postId }, { commentId }],});
// // merge후 콘솔 찍어보면서 findone으로 고치기, 아래 코드도 틀릴경우만 if문으로 묶고 성공은 풀기로 수정하자 창민아

//   if (existscomment[0].username !== username) {
//     return res.json({ errorMessage: "타인의 댓글은 수정 불가능합니다." });
//   }

//   await Comment.updateOne({ $and: [{ postId }, { commentId }] },{ $set: { comment } });
//   return res.status(200).json({ result : true });
// });
  
module.exports = router;