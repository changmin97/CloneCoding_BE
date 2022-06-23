const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const User = require("../schemas/user");

async function main(req, res, next) {
  res.json({ result: true });
}

async function mainPost(req, res, next) {
  try {
    const posts = await Post.find({}).sort("-postId");
    res.send(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "메인 게시물을 불러올 수 없습니다.",
      message: error.message,
    });
  }
}

async function postDetail(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const postDetail = await Post.findOne({ postId });
    const existcomments = await Comment.find({ postId });
    console.log(postDetail);
    return res.status(200).json({ postDetail, existcomments });
  } catch (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: "상세 게시물을 불러올 수 없습니다.",
        message: error.message,
      });
  }
}

async function postUpload(req, res, next) {
  try {
    const { nickname } = res.locals.user;
    console.log(res.locals.user);
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
    });

    return res.json({ post: createdPost });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ success: false, message: "게시물을 업로드 에러" });
  }
}

async function postEdit(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const [existPost] = await Post.find({ postId });
    const { user } = res.locals;
    const { title, content, imageUrl } = req.body;
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
    return res
      .status(400)
      .json({ success: false, message: "게시글 수정 에러" });
  }
}

async function postRomove(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const [targetPost] = await Post.find({ postId })
    const {nickname} = res.locals.user
    
    if(nickname !== targetPost.nickname){
      return res.json({ result : false , message : "타인의 게시글은 삭제할 수 없습니다."})
    }

    await Post.deleteOne({ postId })
    return res.json({ result : true , message : "성공적으로 삭제되었습니다."})
    
  } catch (error) {
    return res
      .status(400)
      .json(
        {
        result: false,
        Message: "게시글 삭제 에러",
        message: error.message,
      });
  }
}

async function postSearch(req, res, next) {
  const { word } = req.params;
  const { title } = req.body;
  let postArr = [];
  try {
    if (word == "") {
      const posts = await Post.find({}).sort({ createAt: -1 });
      res.send(posts);
    }
    let posts = await Post.find({ title });
    for (let i in posts) {
      if (posts[i].title.includes(word)) {
        postArr.push(posts[i]);
      }
    }
    return res.status(200).send(postArr);
  } catch (error) {
    return res.status(400).json({ result: false, Message: "search Error" });
  }
}

async function myPage(req, res, next) {
  const { nickname } = res.locals.user;
  const posts = await Post.find({ nickname });
  const [targetUser] = await User.find({ nickname });
  const {email} = targetUser
  const { bookmarkList } = targetUser;
  res.json({
    nickname,
    posts,
    bookmarkList,
    email,
  });
}

async function addBookmark(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (!postId) {
      return res
        .status(400)
        .json({
          result: false,
          Message: "북마크할 게시글이 존재하지 않습니다.",
        });
    }
    const { nickname } = res.locals.user;
    const [targetPost] = await Post.find({ postId });
    const { imageUrl } = targetPost;
    await User.updateOne({ nickname }, { $push: { bookmarkList: imageUrl } });
    return res.json({
      result: true,
      message: `${postId}번 사진이 북마크에 저장되었습니다.`,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ result: false, Message: "북마크저장중 오류가 났습니다." });
  }
}

module.exports = {
  main,
  mainPost,
  postDetail,
  postUpload,
  postEdit,
  postRomove,
  postSearch,
  myPage,
  addBookmark,
};
