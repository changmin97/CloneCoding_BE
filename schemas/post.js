const mongoose = require("mongoose")

const { Schema } = mongoose;
  const postSchema = new Schema({
    postId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    createAt : {
      type: Date,
      default: Date.now
    }
});

//적절하게 수정하신후 이문구 지워주세요
module.exports = mongoose.model("Post", postSchema);