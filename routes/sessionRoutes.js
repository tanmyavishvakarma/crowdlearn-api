const express = require("express");
const router = express.Router();
const registertemplatecopy = require("../models/user");
const sessionCopy = require("../models/session");
const verifyToken = require("../middleware/verifyToken");
const subjectCopy = require("../models/subject");
// const nodemailer = require("nodemailer");

router.post("/create", verifyToken, async (req, res) => {
  if (
    request.body.class === undefined ||
    request.body.class === "" ||
    request.body.category === undefined ||
    request.body.category === "" ||
    request.body.topic === undefined ||
    request.body.topic === "" ||
    request.body.glink === undefined ||
    request.body.glink === "" ||
    request.body.dateToBeHeld === undefined ||
    request.body.dateToBeHeld === ""
  ) {
    return response
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
        user: req.body.userId,
        subject: id,
        glink: req.body.glink,
        dateToBeHeld: req.body.dateToBeHeld,
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
            { _id: req.body.userId },
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
  sessionCopy
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
