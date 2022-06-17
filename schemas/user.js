const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
  ID:{
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    requried: true
  }
});


//적절하게 수정하신후 이문구 지워주세요
module.exports = mongoose.model("User", UserSchema);