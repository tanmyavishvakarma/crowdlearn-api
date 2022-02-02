
const express = require("express");
const router = express.Router();
const registertemplatecopy=require("../models/user")
const sessionCopy=require("../models/session")
const verifyToken = require("../middleware/verifyToken")
const subjectCopy = require("../models/subject")
// const nodemailer = require("nodemailer");

router.post("/create", verifyToken ,async (req,res)=>{
    const subject = new subjectCopy({
        class : req.body.class,
        category : req.body.category,
        topic : req.body.topic
    });
    await subject.save().then(async (data)=>{
        const id = data._id;
        const session = new sessionCopy({
            user: req.body.userId,
            subject : id,
            glink : req.body.glink,
            dateToBeHeld : req.body.dateToBeHeld
        });
        await session.save().then(async (data)=>{
            await registertemplatecopy.findOneAndUpdate({_id:req.body.userId} ,{ $push: { sessions: data._id } },) 
        })   
        res.status(201).json(session)
    })
})

router.get("/getAll" ,async (req, res) => {
    // yaha pe req.user ayega
      sessionCopy
        .find({})
        .populate("subject")
        .populate("user")
        .then((data) => {
          if(!data){
              res.status(404).json({ message: "User Not Found" });
          }
          else{
              res.status(200).json(data);
          }
          
        })
        .catch((err) => {
          console.log(err);
        });
  });
  

module.exports = router;