const express =require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const authRoutes=require('./routes/authRoutes')
const sessionRoutes=require('./routes/sessionRoutes')
const userRoutes=require('./routes/userRoutes')
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

// app.use(session({
//     secret:'secret',
//     resave:true,
//     saveUninitialized:true
// }))

// app.use(cookieparser("secret"))

app.use(express.json())
app.use('/auth',authRoutes)
app.use('/session',sessionRoutes)
app.use('/user',userRoutes)
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
  console.log("server is running succesfully")
})

module.exports = app;

