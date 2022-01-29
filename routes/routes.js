const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const registertemplatecopy = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const res = require("express/lib/response");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    return res.status(401);
  } else {
    jwt.verify(token, "jwtsecret", (err, user) => {
      if (err) {
        return res.status(403);
      } else {
        req.user = user;
        next();
      }
    });
  }
};

router.post("/register", async (request, response) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 535,
    auth: {
      user: "crowdlearn69@gmail.com",
      pass: "abcd@1234",
    },
    tls: {
      rejectUnauthorized: false,
    },
    // connectionTimeout: 5 * 60 * 1000,
  });
  if (
    request.body.username === undefined ||
    request.body.email === undefined ||
    request.body.username === "" ||
    request.body.email === ""
  ) {
    response.status(401).json({ message: "bad request missing parameters" });
  } else {
    const registeruser = new registertemplatecopy({
      username: request.body.username,
      email: request.body.email,
    });
    console.log(registeruser);
    await registeruser.save().catch((err) => {
      console.log(err);
    });
    transporter.sendMail({
      to: registeruser.email,
      from: "crowdlearn69@gmail.com",
      subject: "CROWD LEARNT OTP",
      html: `<h2>WELCOME TO CROWDLEARN</h2> Your ONE-TIME-PASSWORD is ${otp}`,
    });

    const token = jwt.sign({ username: registeruser.username }, "jwtsecret");

    response.status(200).json({ token: token, otp: otp.toString() });
  }
});

router.post("/login", async (request, response) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 535,
    auth: {
      user: "crowdlearn69@gmail.com",
      pass: "abcd@1234",
    },
    tls: {
      rejectUnauthorized: false,
    },
    // connectionTimeout: 5 * 60 * 1000,
  });
  if (
    request.body.username === undefined ||
    request.body.email === undefined ||
    request.body.username === "" ||
    request.body.email === ""
  ) {
    response.status(401).json({ message: "bad request missing parameters" });
  } else {
    transporter.sendMail({
      to: request.body.email,
      from: "crowdlearn69@gmail.com",
      subject: "CROWD LEARNT OTP",
      html: `<h2>WELCOME TO CROWDLEARN</h2> Your NEW ONE-TIME-PASSWORD is ${otp}`,
    });
    const token = jwt.sign({ username: request.body.username }, "jwtsecret");
    response
      .status(200)
      .json({ token: token, otp: otp.toString(), otpstatus: "otp-resent" });
  }
});

router.post("/resendotp", async (request, response) => {
  const user = await registertemplatecopy.findOne({
    email: request.body.email,
  });
  const numberoftries = user.otptries;
  await registertemplatecopy.findOneAndUpdate(
    { email: request.body.email },
    { otptries: numberoftries + 1 }
  );
  if (numberoftries + 1 >= 3) {
    console.log("Tries ", numberoftries);
    return response
      .status(403)
      .json({ message: "too many unsuccessful tries" });
  } else {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      port: 535,
      auth: {
        user: "crowdlearn69@gmail.com",
        pass: "abcd@1234",
      },
      tls: {
        rejectUnauthorized: false,
      },
      // connectionTimeout: 5 * 60 * 1000,
    });
    if (
      request.body.username === undefined ||
      request.body.email === undefined ||
      request.body.username === "" ||
      request.body.email === ""
    ) {
      response.status(401).json({ message: "bad request missing parameters" });
    } else {
      transporter.sendMail({
        to: request.body.email,
        from: "crowdlearn69@gmail.com",
        subject: "CROWD LEARNT OTP",
        html: `<h2>WELCOME TO CROWDLEARN</h2> Your NEW ONE-TIME-PASSWORD is ${otp}`,
      });
      const token = jwt.sign({ username: request.body.username }, "jwtsecret");
      response
        .status(400)
        .json({
          token: token,
          otp: otp.toString(),
          otpstatus: "otp did not match",
        });
    }
  }
});

router.put("/verifyuser/:email", async (req, res) => {
  registertemplatecopy
    .findOneAndUpdate({ email: req.params.email }, { verified: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Update Unsuccessful`,
        });
      } else {
        res.status(200).send("Update Succesful");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error in updating",
      });
    });
});

router.get("/find", async (req, res) => {
  registertemplatecopy
    .find({})
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
