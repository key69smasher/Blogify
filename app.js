const express= require("express");
const app=express();
const { default: mongoose } = require("mongoose");
const cookieParser =require("cookie-parser");
require("dotenv").config();

const {checkauthentication}=require("./Middleware/authentication");
const entranceRoutes = require("./Routes/entrance");
const blogRoutes = require("./Routes/blog");
const blog=require('./Models/blogs');

const path=require("path");


mongoose.connect(process.env.MongoUrl)
    .then(()=> console.log("database is connected"))
    .catch((error)=> console.log(`there is a error ${error}`) );

app.set("view engine","ejs");
app.set("views", path.resolve("./Views"));

const PORT=process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/',checkauthentication(),async(req,res)=>{
    const AllBlog=await blog.find({}).sort({CreatedBy:-1});
    res.render("homepage",{
        user:req.user,
        blog:AllBlog
    });
});

app.get('/MyBlogs',checkauthentication(),async(req,res)=>{
    const AllBlog=await blog.find({CreatedBy:req.user._id}).sort({createdAt:-1});
    res.render("my_blogs",{
        user:req.user,
        blog:AllBlog
    });
});

app.get('/About_us',checkauthentication(),(req,res)=>{
    res.render("About",{
        user:req.user
    });
})

app.use('/user',entranceRoutes);

app.use('/blog',checkauthentication(),blogRoutes);

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('./');
});

app.listen(PORT,()=>{ 
    console.log("connected to server");
})