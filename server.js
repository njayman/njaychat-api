import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import socketio from "socket.io";
import cors from "cors";

const {
  PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_DATABASE,
} = process.env;
const app = express();
const server = createServer(app);
const io = socketio(server);

app.use(cors);
app.use(express.json());

//mongodb connection
const mongoUri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`;
const mongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };

mongoose.connect(mongoUri, mongoOptions);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database is up and running!");
});

//app.use("/api", userRouter);

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
});

const port = PORT;
server.listen(port, () => console.log(`Listening on port ${port}`));
