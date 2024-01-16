"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const app = express();
dotenv.config();
const port = process.env.PORT;
const JWTSecurityKey = "KEY";
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer);
app.get("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
});
httpServer.listen(port, () => {
    console.log("Server running on PORT: " + port);
});
