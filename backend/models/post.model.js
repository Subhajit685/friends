import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        default : ''
    },
    postImage : [
        {
            type : String,
            required : true
        }
    ],
    postAuthor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'  
        }
    ],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'  
        }
    ]
}, {timestamps : true})

const Post = mongoose.model("Post", postSchema)

export default Post