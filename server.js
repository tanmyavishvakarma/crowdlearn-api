const express =require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const routes=require('./routes/routes')
const cors=require('cors')
const bodyParser=require("body-parser")
const session=require("express-session") 
const cookieparser=require('cookie-parser')

dotenv.config();
mongoose
  .connect(process.env.DB_CONNECT, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

app.use(cookieparser("secret"))

app.use(express.json())
app.use('/',routes)
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
  console.log("server is running succesfully")
})

module.exports = app;


// router.put('/verifyuser',async (req,res)=>{
//   User.findByIdAndUpdate({email: req.params.email},{verified:true})
//   .then(data => {
      
//       if (!data) {
//         res.status(404).send({
//           message: `Update Unsuccessful`
//         });
//       } else {
//           // const token = generateJwtToken(savedUser._id, savedUser.role);
//           // const { _id, name, email,mobile, role } = savedUser;
//           // res.status(200).json({
//           //   token,
//           //   user: { _id, name, email,mobile, role },
//           // });
//           res.status(200).send("Update Succesful")
//       }   
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error in updating" 
//       });
//     }); 
 

// });