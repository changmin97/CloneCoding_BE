const mongoose = require("mongoose")
// mongoose.Schema.Types.String.checkRequired((v) => v != null)


const { Schema } = mongoose; 
const postSchema = new Schema({
     postId: { type: Number, required: true, }, 
     title: { type: String, required: true }, 
     content: { type: String, required: true }, 
     imageUrl: { type: String, required: true }, 
     word: {type: String},
     createAt: { type: Date, required: true },
     nickname : { type : String, required: true },
});


// const { Schema } = mongoose;
//   const postSchema = new Schema({
//     postId: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     content : {
//         type: String,
//         required: true
//     },
//     imageUrl : {
//       type: String,
//       required: true
//     },
//     createAt: {
//         type: Date, 
//         default: Date.now
//     }
// });

module.exports = mongoose.model("Post", postSchema);