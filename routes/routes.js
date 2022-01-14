
const { request, response } = require('express')
const express=require('express')
const router = express.Router()
const bcrypt=require('bcrypt')
const cookieparser=require('cookie-parser')
const bodyParser=require("body-parser")
const registertemplatecopy=require('../models/models')



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