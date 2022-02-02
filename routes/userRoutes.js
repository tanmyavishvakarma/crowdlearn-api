const express = require("express");
const router = express.Router();
const registertemplatecopy = require("../models/user");
const verifyToken = require("../middleware/verifyToken")

router.get("/find", verifyToken ,async (req, res) => {
  // yaha pe req.user ayega
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
});

module.exports = router;
