const mongoose = require("mongoose")

const { Schema } = mongoose;
  const postSchema = new Schema({
    postId: {
        type: Number,
        required: true,
        unique: true
    },
    product: {
        type: String,
        required: true
    },
    nickname : {
        type: String
    },
    content : {
        type: String,
        required: true
    },
    image : {
      type: String,
      required: true
    }
});

//적절하게 수정하신후 이문구 지워주세요
module.exports = mongoose.model("Post", postSchema);