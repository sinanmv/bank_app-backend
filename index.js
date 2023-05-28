// import express 
const express = require("express");

// import cors
const cors = require("cors")

// import logic.js
const logic = require('./services/logic')
// import jwttoken
const jwt = require('jsonwebtoken')

// Create a server using Express
const server = express()

// use cors in server app
server.use(cors({
    origin:"http://localhost:4200"
}))

    
process.on('uncaughtException',function(err){
    console.log(err);
    });

// Parse json data to the js in server app
server.use(express.json())

// To resolve client requests - 5000 /
// server.get("/",(req,res)=>{
//     res.send('GET METHOD')
// })

server.post("/",(req,res)=>{
    res.send("POST METHOD")
})
//Setup port for the server
server.listen(5000,()=>{
    console.log("listening on port 5000");
})
// application specific middleware
const appMiddleware = (req,res,next)=>{
    next()
    console.log('application specific middle ware');
}
// use appication specific middle ware
server.use(appMiddleware)

// middleware  for verifying token to check user is loggined or not
const jwtMiddleware = (req,res,next)=>{
    // get token from req header
    const token =req.headers['verify-token']
    // console.log(token); //token  ---------verify token
    try{

        const data = jwt.verify(token,'superkey2023')
         console.log(data);
         req.currentAccno = data.loginAccno
        next()
    }
    catch{
        res.status(401).json({message:"please login"})
    }
    console.log("Router specific middleware");
}

// Bank Request
// request
// login
// balance enquiry
// fund transfer

// register api call
server.post("/register",(req,res)=>{
    console.log("register called");

    logic.register(req.body.accno,req.body.username,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
    // res.send("Register request received")
    // res.status(200).json({message:'Request Received'})
})
// login api call
server.post('/login',(req,res)=>{
    console.log("inside login api call");
    console.log(req.body);
    logic.login(req.body.accno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})

// getbalance api call
server.get('/getbalance/:accno',jwtMiddleware,(req,res)=>{
    console.log(req.params);
    logic.getBalance(req.params.accno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log("inside fund transfer"); //for test
    console.log(req.body);
    logic.fundTransfer(req.currentAccno,req.body.password,req.body.toaccno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

server.get('/transaction-history',jwtMiddleware,(req,res)=>{
    console.log("inside transaction histroy");
    logic.getTransactionHistory(req.currentAccno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('Inside deleteAccount');
    logic.deleteUserAccount(req.currentAccno).then((result)=>{
    res.status(result.statusCode).json(result)
    })
})
