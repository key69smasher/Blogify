const express=require("express");
const router=express.Router();
const multer=require('multer');
const path=require('path');

const blog=require('../Models/blogs');
const comment=require('../Models/comment');

const storage=multer.diskStorage({
    destination:function(req,res,cb){
        return cb(null ,path.resolve("./public/uploads"));
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
})
const upload=multer({storage:storage});

router.get("/addnew",(req,res)=>{
    return res.render("addblog",{
        user:req.user,
    })
})

router.post("/addnew",upload.single("coverImg"),async (req,res)=>{
    if(req.user===null)res.redirect('/user/signin');
    const {Title,body}=req.body;
    const blogData = {
        Title,
        body,
        CreatedBy: req.user._id,
        like: []
    };
    if (req.file) {
        blogData.coverImageUrl = `/uploads/${req.file.filename}`;
    }

    const Blog = await blog.create(blogData);
    res.redirect(`/blog/${Blog._id}`);
})

router.get('/:id',async(req,res)=>{
    const blogid=req.params.id;
    const article=await blog.findOne({_id:blogid}).populate("CreatedBy");
    const comments=await comment.find({blogid}).populate("CreatedBy");
    return res.render("blog",{
        Blog:article,
        comments:comments,
        user:req.user
    })
})

router.post('/comment/:blogid',async(req,res)=>{
    const blogid=req.params.blogid;
    const Content=req.body.comment;
    const CreatedBy=req.user._id;
    await comment.create({
        blogid,
        Content,
        CreatedBy 
    });
    res.redirect(`/blog/${blogid}`);
})

router.post('/like/:id', async (req, res) => {
    const blogId = req.params.id;
    const userId = req.body.userId;
    try {
        const Blog = await blog.findById(blogId);

        if (Blog.like.includes(userId)) {
            Blog.like = Blog.like.filter(id => id.toString() !== userId.toString());
        } else {
            Blog.like.push(userId);
        }
        await Blog.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating like:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const blogId = req.params.id;

    try {
        await blog.findByIdAndDelete(blogId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports=router;