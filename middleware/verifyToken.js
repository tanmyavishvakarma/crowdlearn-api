const jwt = require("jsonwebtoken");
const express = require("express");

// module.exports=(req,res,next)=>{
//     // const token = req.headers["x-access-token"];
//     // const token = req.body.token
    
//     // next();
//     if (!token) {
//       return res.status(400).json({message:"Missing token"});
//     } else {
//       jwt.verify(token, "jwtsecret", (err, user) => {
//         if (err) {
//           return res.status(403).json({message : "Unauthorized"});
//         } else {
//           // req.user = user;
//           // console.log(user);
//           next();
//         }
//       });
//     }
//   };

  module.exports=(req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      // console.log(bearerToken);
      jwt.verify(bearerToken, "jwtsecret", (err, user) => {
        if (err) {
          res.status(403).json({message : "Unauthorized"});
        } else {
          req.user = user;
          // console.log(user);
          next();
        }
      });
    } else {
      // Forbidden
      res.status(400).json({message : "Token Not present"});
    }
  }