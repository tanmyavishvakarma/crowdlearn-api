const express = require("express");
const router = express.Router();
const registertemplatecopy = require("../models/user");
const sessionCopy = require("../models/session");
const verifyToken = require("../middleware/verifyToken");
const subjectCopy = require("../models/subject");
const likeCopy = require("../models/like");

router.post("/create", verifyToken, async (req, res) => {
    
  if (
    req.body.class === undefined ||
    req.body.class === "" ||
    req.body.epochTime === undefined ||
    req.body.epochTime === "" ||
    req.body.category === undefined ||
    req.body.category === "" ||
    req.body.topic === undefined ||
    req.body.topic === "" ||
    req.body.glink === undefined ||
    req.body.glink === "" ||
    req.body.dateToBeHeld === undefined ||
    req.body.dateToBeHeld === ""
  ) {
    // console.log("aagye yaha tk\n\n\n\n\n");
    return res
      .status(400)
      .json({ message: "bad request missing parameters" });
  }
  
  const subject = new subjectCopy({
    class: req.body.class,
    category: req.body.category,
    topic: req.body.topic,
  });
  await subject
    .save()
    .then(async (data) => {
      if (!data) {
        return response.status(404).json({ message: "Data does not exist" });
      }
      
      const id = data._id;
      const session = new sessionCopy({
        user: req.user.id,
        subject: id,
        glink: req.body.glink,
        dateToBeHeld: req.body.dateToBeHeld,
        epochTime:req.body.epochTime,
      });
      await session
        .save()
        .then(async (data) => {
          if (!data) {
            return response
              .status(404)
              .json({ message: "Data does not exist" });
          }
          await registertemplatecopy.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { sessions: data._id } }
          );
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
      res.status(201).json(session);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getAll", async (req, res) => {
  // yaha pe req.user ayega
  var currentTime = new Date();
  currentTime = currentTime.getTime();
 
  sessionCopy
    .find({})
    .where('epochTime').gte(currentTime)
    .sort({epochTime:1})
    .populate("subject")
    .populate("user")
    .then((data) => {
      if (!data) {
        res.status(404).json({ message: "Data Not Found" });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal error" });
    });
});


router.post("/likes",verifyToken,async (req, res) => {
  console.log(req.user);
  const user = await likeCopy.findOne({
    user: req.user.id,
  });
  if (!user) {
    // register the user in Mongo and save
    const likeUser = new likeCopy({
      user: req.user.id,
      $push:{session: req.body.sessionId}
    });
    await likeUser.save().catch((err) => {
      console.log(err);
    });
  }else{
    await likeCopy.findOneAndUpdate({
      user:req.user.id,
    },{
      $push:{session: req.body.sessionId}
    })
  }
  await sessionCopy
    .findByIdAndUpdate({_id: req.body.sessionId},{$inc:{numLikes:1}})
    .then((data) => {
      if (!data) {
        res.status(404).json({ message: "Data Not Found" });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal error" });
    });
})

// router.put("/likes/:status",async (req, res) => {
//   var incr=0;
//   var decr=0;
//   if(req.params.status=="like") {
//     incr=1;
//     decr=0;
//   }
//   else{
//     incr=0;
//     decr=1;
//   }
//   await sessionCopy
//     .findByIdAndUpdate({_id: req.body.sessionId},{$inc:{likes:incr,dislikes:decr}})
//     .then((data) => {
//       if (!data) {
//         res.status(404).json({ message: "Data Not Found" });
//       } else {
//         res.status(200).json(data);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ message: "Internal error" });
//     });
// });

module.exports = router;
