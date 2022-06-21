const mongoose = require("mongoose")


const { Schema } = mongoose; 
const postSchema = new Schema({
     postId: { type: Number, required: true, }, 
     title: { type: String, required: true }, 
     content: { type: String, required: true }, 
     imageUrl: { type: String, required: true }, 
     word: {type: String},
     createAt: { type: Date, default: Date.now() },
     nickname : { type : String, required: true },
});

module.exports = mongoose.model("Post", postSchema);