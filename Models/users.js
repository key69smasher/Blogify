const mongoose=require("mongoose");
const{setuser}=require("../services/auth");
const {createHmac,randomBytes}=require("crypto");


const userSchema= mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        require:true
    },
    profileUrl:{
        type:String,
        default:"/image/download.jpeg"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{timestamp:true});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex"); 
    const createhash = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = createhash;
    next();
});

async function verifyUser(email,password){
    const user=await User.findOne({email});
    if(!user)throw new Error("No such User is defined");
    const hashedpass=user.password;
    const salt = user.salt;
    const newpass=createHmac("sha256",salt)
        .update(password)
        .digest("hex");
    if(hashedpass==newpass)return setuser(user);
    throw new Error("Wrong Password");
}

const User=mongoose.model('user',userSchema);
module.exports={User,verifyUser};