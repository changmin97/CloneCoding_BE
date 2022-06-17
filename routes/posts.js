const express = require("express");
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
//필요한 스키마 연결해주세요

//메인페이지
router.get('/main',(req,res)=>{
    res.json({ result : true })
})

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
//여기도 merge후 콘솔 찍어보면서 findone으로 고치기, 아래 코드도 틀릴경우만 if문으로 묶고 성공은 풀기로 수정하자 창민아,
})

module.exports = router;