const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
    }catch(err){
        console.error("DB connection error",err);
    }
}

module.exports = connectDB;
