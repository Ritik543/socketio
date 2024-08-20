import express from "express";
import { WebSocketServer } from "ws";
 import {createServer} from "http"
 import {Server} from "socket.io"
// import { Socket } from "socket.io";
import cors from "cors";
const app = express();


const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET", "HEAD"],
        credentials:true,
    },
});
app.use(cors({
    origin:"*",
    methods:["GET", "HEAD", "OPTIONS"],
    credentials:true,
}));

io.on("connection",(socket)=>{
    console.log("connection on " , socket.id);
    socket.on("message",(data)=>{
            // console.log("message is ", data);
            io.to(data.room).emit("room", data);
    })


    socket.on("join",(data)=>{
        console.log("user joined " , data);    
        socket.join(data);
            
    });
    

})



server.listen(8080,()=>{
        console.log("server listening on 8080");
    })




// const server = app.listen(8080,()=>{
//     console.log("server listening on 8080");
// })

// const wss = new WebSocketServer({server});

// wss.on("connection",(ws)=>{
//     ws.on("message",(data)=>{
// console.log("data from client : " + data);
// ws.send("thanks buddy");
// ws.send("kya hal chaal ");
//     })

// })