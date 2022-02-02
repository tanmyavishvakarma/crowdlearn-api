
const express = require("express");
const router = express.Router();
const registertemplatecopy=require("../models/user")
const sessionCopy=require("../models/session")
const verifyToken = require("../middleware/verifyToken")
// const nodemailer = require("nodemailer");

router.post("/create", verifyToken ,async (req,res)=>{
    const session = new sessionCopy({
        user: req.body.userId,
    });
    await session.save().then(async (data)=>{
        await registertemplatecopy.findOneAndUpdate({_id:req.body.userId} ,{ $push: { sessions: data._id } },) 
    })   
    res.status(201).json(session)
})


module.exports = router;