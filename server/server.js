const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.static("public"));

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"] });
});

// app.listen(8080, () => {
//     console.log("Server started on 8080");
// });

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log("message received");
        socket.emit("receive_message", "hello from server");
    });
});

server.listen(4000, () => {
    console.log("listening on *:4000");
});
