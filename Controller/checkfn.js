const {User,verifyUser}=require("../Models/users");

async function checksignin(req,res){
    const{email,password}=req.body;
    try{
        const token=await verifyUser(email,password);
        return res.cookie('token',token).redirect("/");
    }
    catch(error){
        res.render("signin",{
            error:"Incorrect password Please Retry!!",
        });
    }
}

async function checksignup(req,res){
    const { email, password, fullname } = req.body;
    try {
        await User.create({
            fullname,
            password,
            email,
        });
        res.redirect("/");
    } catch (error) {
        console.error("Error creating User:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports={
    checksignup,
    checksignin
}
