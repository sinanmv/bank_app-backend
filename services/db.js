// Database connection with NODEJS 

// import mongoose
const mongoose = require('mongoose')

// Define  a connection string between express and mongodb
mongoose
    .connect('mongodb+srv://sinanmv:sinan@cluster0.yjjkwcm.mongodb.net/bankdetails?retryWrites=true&w=majority')
    .catch (error => console.log(error));

// create a model and schema for storing data into the database
// model-User
const User=mongoose.model('users',{
    accno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]

})
// export the collection
module.exports={
    User
}
