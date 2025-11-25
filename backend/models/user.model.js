import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profilePicture:{type:String,default:''},
    bio:{type:String, default:''},
    gender:{type:String,enum:['male','female']},
    website:{type:String, default:''},
    isPrivate:{type:Boolean, default:false},
    isVerified:{type:Boolean, default:false},
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    followRequests:[{type:mongoose.Schema.Types.ObjectId, ref:'FollowRequest'}],
    posts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    stories:[{type:mongoose.Schema.Types.ObjectId, ref:'Story'}],
    reels:[{type:mongoose.Schema.Types.ObjectId, ref:'Reel'}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    savedCollections:[{type:String, default:'Saved'}],
    blockedUsers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    accountSwitches:[{
        accountName:{type:String},
        accountType:{type:String, enum:['personal','business','creator']},
        createdAt:{type:Date, default:Date.now}
    }]
},{timestamps:true});
export const User = mongoose.model('User', userSchema);