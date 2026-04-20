const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    contents:{
        type: String,
        required: true
    },
    socketId:String,

    createdAt:{
        type:Date,
        default:Date.now,
        index:true
    }
});



module.exports = mongoose.model("Message",messageSchema);