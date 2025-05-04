const jwt=require("jsonwebtoken");
const secret=process.env.JWT_SECRET ;

function setuser(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageUrl:user.profileUrl,
        role:user.role
    }
    return jwt.sign(payload,secret);
}

function getuser(token){
    return jwt.verify(token,secret);
}

module.exports={
    setuser,
    getuser
}