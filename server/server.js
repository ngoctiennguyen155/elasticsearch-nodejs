// import 
const express = require('express')
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const signinController = require('./controllers/signin')
const signupController = require('./controllers/signup')
const updateController = require('./controllers/updateUser')
const deleteUserController = require('./controllers/deleteUser')
const getAllUserController = require('./controllers/getAllUsers')

const {updateUser, getAllUsers,deleteUser} =require('./features')
const checktoken = require("./middleware/validatetoken")
// funcs
const loginLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 10, // allow 5 requests to go at full-speed, then...
    delayMs: 500, // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
    maxDelayMs: 60 * 1000
});
const signupLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 10, // allow 5 requests to go at full-speed, then...
    delayMs: 500, // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
    maxDelayMs: 60 * 1000
});
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  const createAccountLimiter = rateLimit({
    windowMs: 30 * 1000, // 1 min window
    max: 5, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });

//middleware
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     next();
// })
app.use(require('cors')())
//app.enable("trust proxy");// only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// routes
// signin
app.post('/signin',loginLimiter,signinController);
//signup
app.post('/signup',signupLimiter,signupController)
//update user
app.put('/update',loginLimiter,updateController)
//index (get all account)
app.get('/',checktoken,getAllUserController)
//
app.delete("/:id",deleteUserController);



// test slow down request
app.get('/test',loginLimiter,(req,res)=>{
    const user ={
        _id: "Vwk4tHcB6vcM-1nyRVUM"
    }
   // updateUser(user);
    res.status(200).json({status: "200"})
})



// listen
app.listen(5000);