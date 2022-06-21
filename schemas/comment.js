const mongoose = require("mongoose");

const { Schema } = mongoose;
  const commentSchema = new Schema({
    postId: {type: Number},
    nickname : {type: String},
    commentId: {type: Number, required: true},
    comment : {type: String, required: true},
    createAt:{type: Date, default: Date.now()}
});

//적절하게 수정하신후 이문구 지워주세요
module.exports = mongoose.model("Comment", commentSchema);