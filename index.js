const express = require("express");
const {createServer} = require("node:http");
const {join} = require("node:path");
const {Server} = require("socket.io");
const connectDB = require("./db");
const Message = require("./models/message");

const app = express();
const server = createServer(app);
connectDB();
const io = new Server(server, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, 
      skipMiddlewares: true
    }
  });

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
});

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    if (socket.recovered) {
      console.log("Recovered via Socket.IO");
    } else {
      console.log("Fresh connection → use DB recovery");
    }
  
    socket.on('chat message',async (msg)=>{
       try{
        const savedMessage = await Message.create({
          contents:msg,
          socketId:socket.id
        })
        io.emit('chat message',savedMessage);

       }catch(err){
        console.error('Error saving message',err);
       }

    })

    socket.on("recover messages", async (lastMessageId) => {
      try {
        let messages;
    
        if (lastMessageId) {
          messages = await Message.find({
            _id: { $gt: lastMessageId }
          }).sort({ createdAt: 1 });
        } else {
        
          messages = await Message.find()
            .sort({ createdAt: 1 });
        }
    
        socket.emit("missed messages", messages);
    
      } catch (err) {
        console.error("Recovery error:", err);
      }
    });
  
    socket.on('disconnect', (reason) => {
      console.log('user disconnected:', socket.id, reason);
    });
  });

server.listen(3000,()=>{
    console.log("the server is running on port 3000");
});