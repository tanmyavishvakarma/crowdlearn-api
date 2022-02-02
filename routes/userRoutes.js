const express = require("express");
const router = express.Router();
const registertemplatecopy = require("../models/User");


router.get("/find", async (req, res) => {
  if (req.body.email === undefined || req.body.email === "") {
    res.status(400).json({ message: "bad request missing parameters" });
  } else {
    registertemplatecopy
      .findOne({ email: req.body.email })
      .populate("sessions")
      .then((user) => {
        if(!user){
            res.status(404).json({ message: "User Not Found" });
        }
        else{
            res.status(200).json(user);
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
