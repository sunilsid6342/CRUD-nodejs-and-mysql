const express=require("express");
const app=express()
const bodyparser=require('body-parser')
const path = require('path');
const multer=require("multer")
require("./db/config")
const User=require("./db/User")

app.use(bodyparser.urlencoded({extended:false}))

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "uploads/")));

const uploads=multer({
    storage: multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,"uploads")
        },
        filename:function(req,file,cb){
            cb(null,file.fieldname+"_"+Date.now()+"_"+ file.originalname);
        }
    })
}).single("userfile");

app.get("/profile",(req,resp)=>{
    const data={
        name: 'peter',
        email: 'peter@gmail.com',
        contry: "Delhi",
        skills: ['php','js','node js','java']
    }
    resp.render('profile',{data});
});


app.get("/",async (req,resp)=>{
    const user=await User.find();
    console.log(user);
    resp.render('Home',{user});
});

app.get("/addcontact",(req,resp)=>{
    resp.render('AddContact');
});

app.post("/addcontact",uploads,async (req,resp)=>{
    
    const user=await User({name:req.body.name,email:req.body.email,number:req.body.number,img:req.file.filename});
    user.save();
    resp.redirect('/');
});

app.get("/editcontact/:id",async (req,resp)=>{
    
    const user=await User.find({_id:req.params.id});
    
    const sa=user[0]
    
    resp.render('EditContact',{sa});
});

app.post("/editcontact/:id",async (req,resp)=>{
    console.log(req.body)
    const user=await User.updateOne(
        {_id:req.params.id},
        {
            $set: req.body
        }
        );
    
    resp.redirect('/');
});

app.get("/delete/:id",async (req,resp)=>{
    
    const user=await User.deleteOne({_id:req.params.id});
    resp.redirect('/');
});



app.listen(5000);