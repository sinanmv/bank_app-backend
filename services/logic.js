// import db.js

const {response}  = require('express');
const db = require('./db')

// import jwt token
const jwt = require('jsonwebtoken')

// logic for register - asynchronus function - promise -
const register = (accno, username, password) => {
    //console.log("register Works");
    // accno in db
    // yes
    console.log("inside registered");
    return db.User.findOne({accno}).then((response) => {
        console.log("find on worked");
        // console.log(req.body);
        if (response) {
            return {
                statusCode: 401,
                message: 'accno Already Registered'
            }
        }
        else {
            // Create new Object for registration
            const newUser = new db.User({
                accno,
                username,
                password,
                balance: 2000,
                transaction: []
            })
            newUser.save()
            // To send reponse back to the client
            return {
                statusCode: 200,
                message: 'successfully registered'
            }
        }
        // to save in database
    })
}
// logic for login - asynchronus function - promise -
const login=(accno,password)=>{
    console.log("Inside  the login function");
    return db.User.findOne({accno,password}).then((result)=>{
        // accno present in database
        if(result){
            // token generated
            const token = jwt.sign({loginAccno:accno},'superkey2023')
            return{

                statusCode:200,
                message:"Successfully logged in",
                currentUser:result.username,
                token, // send to the client
                currentAccno:accno //send to the client --login.ts
            }

        }
        // accno not present in database
        else
        {
            return{
                statusCode:401,
                message:"Invalid Data"
            }
        }
    })
}

// logic for balance enquiry
const getBalance=(accno)=>{
    return db.User.findOne({accno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else
        {
            return{
                statusCode:401,
                message:'Invalid Data'
            }
        }
    })
}

const fundTransfer=(fromacc,fromaccpswd,toacc,amt)=>{
    // convert into number amt
    console.log(fromacc);
    let amount = parseInt(amt)
    // check fromacc and pswd
    return db.User.findOne({
        accno:fromacc,
        password:fromaccpswd
    }).then((debitdetails)=>{
        console.log("debit test");
        if(debitdetails){
            return db.User.findOne({accno:toacc}).then((creditdetails)=>{
                if(creditdetails){
                    console.log("credit");
                    // check the balance
                    if(debitdetails.balance > amount)
                    {
                        debitdetails.balance -= amount
                        debitdetails.transaction.push({
                            type:"debit",
                            amount,
                            fromacc,
                            toacc
                        })
                         
                        debitdetails.save()

                        // update to the to accno
                        creditdetails.balance += amount
                        creditdetails.transaction.push({
                            type:"credit",
                            fromacc,
                            toacc,
                            amount

                        })
                        creditdetails.save()

                        return {
                            statusCode:200,
                            message:"fund transfer successfully"
                        }
                    }
                    else
                    {
                        // insufficent balance
                        return{
                            statusCode:401,
                            message:'insufficient balance'
                        }
                    }
                }
                else
            {
                // invalid data
                return{
                    statusCode:401,
                    message:'Invalid account number'
                }
            }
            })
        }
        else{
            // invalid data
            return{
                statusCode:401,
                message:'Invalid Data'
            }
        }
    }
    
    )
}
const getTransactionHistory = (accno)=>{
    return db.User.findOne({accno}).then((result)=>{
        if(result)
        {
            return {
                statusCode:200,
                transaction:result.transaction
            }
        }
        else
        {
            return{
                statusCode:401,
                message:'invalid Data'
            }
        }
    })
}

const deleteUserAccount =(accno)=>{
    return db.User.deleteOne({accno}).then((result)=>{
        return {
            statusCode:200,
            message:"Account deleted successfully"
        }
    })
}

// export  
module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactionHistory,
    deleteUserAccount
}

