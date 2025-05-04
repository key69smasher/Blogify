const express=require("express");
const route=express.Router();

const {checksignup,checksignin}=require ("../Controller/checkfn");

route.post('/signin',checksignin);

route.post('/signup',checksignup);

route.get('/signin',(req,res)=>{
    res.render("signin");
});
route.get('/signup',(req,res)=>{
    res.render("signup");
});

module.exports=route;