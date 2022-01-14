
const { request, response } = require('express')
const express=require('express')
const router = express.Router()
const bcrypt=require('bcrypt')
const cookieparser=require('cookie-parser')
const bodyParser=require("body-parser")
const registertemplatecopy=require('../models/user')

const nodemailer = require('nodemailer');


router.post('/register',async (request,response)=>{
    const registeruser=new registertemplatecopy({
        username:request.body.username,
    })
    registeruser.save()
    .then(data=>{
        response.json(data)
    })
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
          to: "siddharthbharmoria@gmail.com",
          from: "crowdlearn69@gmail.com",
          subject: 'Registration successful',
          html: `<h2>WELCOME TO CROWDLEARN</h2> Your ONE-TIME-PASSWORD is ${otp}`
        })
  
        .catch((err) => {
          console.log(err);
        });
});
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