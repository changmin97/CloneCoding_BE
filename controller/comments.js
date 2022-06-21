const Comment = require("../schemas/comment");

async function commentPost(req, res, next) {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const { nickname } = res.locals.user;

    const maxCommentId = await Comment.findOne({ postId }).sort({
      commentId: -1,
    });
    let commentId = 1;

    if (maxCommentId) {
      commentId = maxCommentId.commentId + 1;
    }
    await Comment.create({ postId, commentId, nickname, comment });
    return res.json({ result: true });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
}

async function commentDelete(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    const { nickname } = res.locals.user;
    console.log(nickname);
    const [existcomment] = await Comment.find({
      $and: [{ postId }, { commentId }],
    });
    console.log(existcomment);
    if (existcomment.nickname !== nickname) {
      return res.status(400).json({
        result: false,
        message: "타인의 댓글은 삭제 불가능합니다.",
      });
    }
    await Comment.deleteOne({ commentId });
    return res.status(200).json({ result: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function commentPut(req, res, next) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { comment } = req.body;
    const { nickname } = res.locals.user;
    const [existscomment] = await Comment.find({
      $and: [{ postId }, { commentId }],
    });
    if (existscomment.nickname !== nickname) {
      return res.json({
        result: false,
        message: "타인의 댓글은 수정 불가능합니다.",
      });
    }

    await Comment.updateOne(
      { $and: [{ postId }, { commentId }] },
      { $set: { comment } }
    );
    return res.status(200).json({ result: true });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
}

module.exports = {
    commentPost,
    commentDelete,
    commentPut,
}