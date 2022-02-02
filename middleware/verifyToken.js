const jwt = require("jsonwebtoken");
const express = require("express");

module.exports=(req,res,next)=>{
    // const token = req.headers["x-access-token"];
    // const token = req.body.token
    
    next();
    // if (!token) {
    //   return res.status(400).json({message:"Missing token"});
    // } else {
    //   jwt.verify(token, "jwtsecret", (err, user) => {
    //     if (err) {
    //       return res.status(403).json({message : "Unauthorized"});
    //     } else {
    //       // req.user = user;
    //       // console.log(user);
    //       next();
    //     }
    //   });
    // }
  };