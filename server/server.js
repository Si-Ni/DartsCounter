const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const auth = require("./src/routes/auth.route");
const api = require("./src/routes/api.route");
const rateLimiter = require("./src/middlewares/rateLimit.middleware");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./src/services/db.service");

const app = express();
const PORT = 4000 || process.env.PORT;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("/", auth);
app.use("/api", api);
app.use(cookieParser());
app.set("trust proxy", 1);
dotenv.config();

const server = app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const { createLobby, joinLobby, leaveLobby, disconnect } = require("./src/services/lobby.service")(io);
const { handleGameStarted } = require("./src/services/gameServices/game.service")(io);
const { handlePointsThrown } = require("./src/services/gameServices/standardGame.service")(io);

const onConnection = (socket) => {
  console.log("New connection:", socket.id);

  socket.on("lobby:create", createLobby);
  socket.on("lobby:join", joinLobby);
  socket.on("lobby:leave", leaveLobby);
  socket.on("disconnect", disconnect);

  socket.on("game:gameStarted", handleGameStarted);

  socket.on("standardGame:sendThrownPoints", handlePointsThrown);
};

io.on("connection", onConnection);

connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../client/dist/index.html"));
});
