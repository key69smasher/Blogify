const mongoose=require("mongoose");

const blogSchema= mongoose.Schema({
    Title : {
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    coverImageUrl:{
        type:String
    },
    CreatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", 
            default: [],
        },
    ],
},{timestamps:true});

const blog=mongoose.model("blog",blogSchema);
module.exports=blog; 
