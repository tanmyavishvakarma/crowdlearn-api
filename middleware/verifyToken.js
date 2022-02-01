module.exports=(req,res,next)=>{
    const token = req.headers["x-access-token"];
    console.log(token);
    if (!token) {
      return res.status(401).json({message:"You must be logged in token invalid"});
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