const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const registertemplatecopy = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const verifyToken = require("../middleware/verifyToken");
const requestCopy = require("../models/request");
const subjectCopy = require("../models/subject");

router.post("/create", verifyToken, async (req, res) => {
  if (
    req.body.class === undefined ||
    req.body.class === "" ||
    req.body.category === undefined ||
    req.body.category === "" ||
    req.body.topic === undefined ||
    req.body.topic === "" 
  ) {
    // console.log("aagye yaha tk\n\n\n\n\n");
    return res.status(400).json({ message: "bad request missing parameters" });
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
      const request = new requestCopy({
        user: req.user.id,
        subject: id,
      });
      await request
        .save()
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
      res.status(201).json(request);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getAll", async (req, res) => {
    // yaha pe req.user ayega
    requestCopy
      .find({})
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

module.exports = router;
