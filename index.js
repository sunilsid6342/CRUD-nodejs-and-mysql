const express=require("express");
const app=express()
const bodyparser=require('body-parser')
const path = require('path');
const multer=require("multer")
const mysql=require("./db/config").con

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

app.get("/",async (req,resp)=>{
    const sql="select * from userdata";
    mysql.query(sql,function(err, result){
        if(err) throw err;
        resp.render('Home',{result});
    });
    
});

app.get("/addcontact",(req,resp)=>{
    resp.render('AddContact');
});

app.post("/addcontact",uploads,async (req,resp)=>{
    const sql="insert into userdata (name,email,pno,img ) values (?,?,?,?)";
    mysql.query(sql,[req.body.name,req.body.email,req.body.number,req.file.filename],function(err, result){
        if(err) throw err;
    });
    resp.redirect('/');
});

app.get("/editcontact/:id",async (req,resp)=>{
    const param=req.params.id;
    const sql="select * from userdata where ids = "+param;
    mysql.query(sql,function(err, result){
        if(err) throw err;
        const data=result[0]
        resp.render('EditContact',{data});
    });
    
});

app.post("/editcontact/:id",async (req,resp)=>{
    const param=req.params.id;
    const sql="UPDATE userdata SET name=?, email=? , pno=?  where ids = "+param;
    mysql.query(sql,[req.body.name,req.body.email,req.body.number],function(err, result){
        if(err) throw err;
        const data=result[0]
        resp.render('EditContact',{data});
    });
    resp.redirect('/');
});

app.get("/delete/:id",async (req,resp)=>{
    const param=req.params.id;
    const sql="DELETE FROM userdata WHERE ids="+param
    mysql.query(sql,function(err,result){
        if(err) throw err;
        console.log(result);
    });
    resp.redirect('/');
    
});



app.listen(5000);