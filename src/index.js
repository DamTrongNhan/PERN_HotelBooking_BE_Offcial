import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
// import cors from "./middlewares/cors";
import "dotenv/config";
import connectDB from "./config/database/connectDB.js";
import Routes from "./routes/index";
import createIO from "./config/socket/index.js";

let port = process.env.PORT || 8080;

const app = express();
app.use(
  cors({
    origin: process.env.REACT_URL,
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, uid",
    // preflightContinue: true,
    // optionsSuccessStatus: 200,
    // exposedHeaders: "Content-Range,X-Content-Range,Authorization",
  })
);
// app.use(cors);
app.use(express.json({ limit: "80mb" }));
app.use(express.urlencoded({ limit: "80mb", extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

connectDB();

Routes(app);

app.use((req, res, next) =>
  next({ statusCode: 404, message: "Resource not found" })
);

app.use((err, req, res, next) =>
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" })
);

const server = app.listen(port, () =>
  console.log(`Server NodeJs is running on ${port}: http://localhost:${port}`)
);

const io = createIO(server);

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    if (!newMessage?.senderId) return console.log("Sender is not defined");
    socket.in(newMessage?.readerId).emit("message received", newMessage);
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userId);
  // });
});
