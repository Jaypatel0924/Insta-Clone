import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
    location:{
        placeName:{type:String, default:''},
        latitude:{type:Number},
        longitude:{type:Number}
    },
    taggedUsers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    mentions:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    savedCount:{type:Number, default:0}
}, {timestamps:true});
export const Post = mongoose.model('Post', postSchema);