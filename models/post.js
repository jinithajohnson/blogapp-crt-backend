const mongoose=require("mongoose")
const { usermodel } = require("./blog")


const postSchema=mongoose.Schema(
    {
        userId: {

            type:mongoose.Schema.Types.ObjectId
        },
        Message:String,

        postedDate: {
            type:Date,
            default:Date.now
        }
    }
)
var postModel=mongoose.model("posts",postSchema)
module.exports=postModel

