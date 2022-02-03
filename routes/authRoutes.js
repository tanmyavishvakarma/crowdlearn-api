
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const registertemplatecopy = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// generates transporter of nodemailer
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

// takes a user generates a JWT token on the basis of whatever is present in the "user"(email , username) or (email)
function createToken(user) {
  console.log(user)
  if ( user._id) {
    return jwt.sign(
      { username: user.username, email: user.email ,id:user._id},
      "jwtsecret"
    );

  } else {
    return jwt.sign({ email: user.email,username:user.username }, "jwtsecret");
  }
}

// generates a random 6 digit number
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}


// REGISTER:
// registering user for the firrst time
router.post("/register", async (request, response) => {
  // if the request does not contain some required parameters send 400
  if (
    request.body.username === undefined ||
    request.body.email === undefined ||
    request.body.username === "" ||
    request.body.email === ""
  ) {
    response.status(400).json({ message: "bad request missing parameters" });
  }
  // else we generate a otp and start the registering process
  else {
    // generate an otp
    const otp = generateOTP();

    // then we find the user with the provided email
    // if it does not exist we send error 409(conflict) "user not found"
    // else we continue with the process
    const user = await registertemplatecopy.findOne({
      email: request.body.email,
    });
    if (!user) {
      // register the user in Mongo and save
      const registeruser = new registertemplatecopy({
        username: request.body.username,
        email: request.body.email,
      });
      await registeruser.save().catch((err) => {
        console.log(err);
      });

      // send a mail to the email provided using nodemailer
      transporter.sendMail({
        to: registeruser.email,
        from: "crowdlearn69@gmail.com",
        subject: "CROWD LEARNT OTP",
        html: `<h2>WELCOME TO CROWDLEARN</h2> Your ONE-TIME-PASSWORD is ${otp}`,
      });
      // make a token and send it to the frontEnd
      const token = createToken(registeruser);
      response.status(201).json({ token: token, otp: otp.toString() });
    } else {
      response.status(409).json({ message: "user already exits please login" });
    }
  }
});

// LOGIN:
// gets email from flutter
// if the fields are missing give error : 400
// else find that email in the database
// if exists : send OTP
// if does not exist send status 404

router.post("/login", async (request, response) => {
  // if the request does not contain some required parameters send 400
  if (request.body.email === undefined || request.body.email === "") {
    response.status(400).json({ message: "bad request missing parameters" });
  } else {
    // generate an otp
    const otp = generateOTP();
    // check database
    const user = await registertemplatecopy.findOne({
      email: request.body.email,
    });
    // if user exists generate a JWT token to front end else send 404
    if (!user) {
      response.status(404).json({ message: "User does not exist" });
    } else {
      // user is not verified return unauthorized
      if (user.verified === false) {
        // delete the existing copy
        await registertemplatecopy.deleteOne({ email: request.body.email });
        response.status(401).json({ message: "Unauthorized" });
      } else {
        transporter.sendMail({
          to: request.body.email,
          from: "crowdlearn69@gmail.com",
          subject: "CROWD LEARN LOGIN OTP ",
          html: `<h2>CROWD LEARN LOGIN ATTEMPT</h2> Your NEW ONE-TIME-PASSWORD is ${otp}`,
        });
        const token = createToken(user);
        response
          .status(200)
          .json({ token: token, otp: otp.toString(), user: user });
      }
    }
  }
});

// When user asks for a new otp on login or register
router.post("/resendotp", async (request, response) => {
  // if the request does not contain some required parameters send 401
  if (
    request.body.username === undefined ||
    request.body.email === undefined ||
    request.body.username === "" ||
    request.body.email === ""
  ) {
    response.status(400).json({ message: "bad request missing parameters" });
  } else {
    //we get a current time
    var currentTime = new Date();
    currentTime = currentTime.getTime();

    // get the user who asked for the otp
    const user = await registertemplatecopy.findOne({
      email: request.body.email,
    });
    const otp = generateOTP();
    const token = createToken(user);
    if (!user) {
      response.status(404).json({ message: "User does not exist" });
    } else {
      // get the number of tries that user has already made
      var numberOfTries = user.otpTries;

      // if it is more than 3 we wait for 30 seconds to resend the otp again
      if (numberOfTries + 1 > 3) {
        if (
          parseInt(currentTime.toString()) -
            parseInt(user.otpTime.toString()) >=
          30000
        ) {
          // update the last otp sent to this current time
          await registertemplatecopy.findOneAndUpdate(
            { email: request.body.email },
            { otpTime: currentTime }
          );

          // send mail to user at email
          transporter.sendMail({
            to: request.body.email,
            from: "crowdlearn69@gmail.com",
            subject: "CROWD LEARN OTP",
            html: `<h2>WELCOME TO CROWDLEARN</h2> Your NEW ONE-TIME-PASSWORD is ${otp}`,
          });

          response.status(200).json({
            token: token,
            otp: otp.toString(),
          });
        } else {
           response
            .status(429)
            .json({ message: "too many unsuccessful tries" });
        }
      } else {
        await registertemplatecopy.findOneAndUpdate(
          { email: request.body.email },
          { otpTries: numberOfTries + 1, otpTime: currentTime }
        );

        transporter.sendMail({
          to: request.body.email,
          from: "crowdlearn69@gmail.com",
          subject: "CROWD LEARN OTP",
          html: `<h2>WELCOME TO CROWDLEARN</h2> Your NEW ONE-TIME-PASSWORD is ${otp}`,
        });

        response.status(200).json({
          token: token,
          otp: otp.toString(),
        });
      }
    }
  }
});

router.put("/verifyuser/:email", async (req, res) => {
  await registertemplatecopy
    .findOneAndUpdate(
      { email: req.params.email },
      { verified: true , otpTries: 0 }
    )
    .then((data) => {
      if (!data) {
        res.status(400).send({
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
//yo
module.exports = router;
