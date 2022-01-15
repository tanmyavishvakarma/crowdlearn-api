
const { request, response } = require('express')
const express=require('express')
const router = express.Router()
const bcrypt=require('bcrypt')
const cookieparser=require('cookie-parser')
const bodyParser=require("body-parser")
const registertemplatecopy=require('../models/user')
const jwt=require('jsonwebtoken') 
const nodemailer = require('nodemailer');
const res = require('express/lib/response')


router.post('/register',async (request,response)=>{
    const registeruser=new registertemplatecopy({
        username:request.body.username,
        email:request.body.email,

    })
    registeruser.save()
    .catch(error=>{
        response.json(error)
    })
    const otp=Math.floor(100000 + Math.random() * 900000)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: false,
        port: 535,
        auth: {
          user: "crowdlearn69@gmail.com",
          pass: "abcd@1234",
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 5 * 60 * 1000,
      });
      transporter
        .sendMail({
          to: registeruser.email,
          from: "crowdlearn69@gmail.com",
          subject: 'Registration successful',
          html: `<h2>WELCOME TO CROWDLEARN</h2> Your ONE-TIME-PASSWORD is ${otp}`
        })
  
        .catch((err) => {
          console.log(err);
        });
      const token=jwt.sign({username:registeruser.username},"jwtsecret")
      console.log(token)
      response.status(200).json({auth:true,token:token,otp:otp});
      

});

const verifyToken=(req,res,next)=>{
  const token=req.headers["x-access-token"];
  console.log(token);
  if(!token){
    res.status(401)
  }else{
    jwt.verify(token,"jwtsecret",(err,decoded)=>{
      if(err){
        res.json({isAuthenticated:false,status:401})
      }else{
        req.userId=decoded.id
        next()
      }
     
    })
  }
}

router.get('/find',async(req,res)=>{
    registertemplatecopy.find({})
        .then(posts=>{
            res.json(posts)
            res.send(posts)  
   
        }).catch(err => {
            console.log(err)
          })
})

module.exports=router