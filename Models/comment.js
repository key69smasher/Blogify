const mongoose= require("mongoose");

const commentschema=mongoose.Schema({
    Content:{
        type:String,
        require:true
    },
    CreatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    blogid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"blog"
    }
},{timestamps:true});

const comment=mongoose.model("comment",commentschema);
module.exports=comment;