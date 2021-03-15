const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const Player = require("./server/player.js");
const RoomManager = require("./server/roomManager.js");

const port = 4224;
const roomManager = new RoomManager();

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/../index.html");
});

server.listen(port, function () {
  console.log(`Server is listening on ${server.address().port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("playerDisconnected", { id: socket.id });
    roomManager.deletePlayer(socket.id);
  });

  socket.on("requestReconnectionConnection", (data) => {
    console.log(data);
  });

  socket.on("requestConnection", (data) => {
    let newPlayerData = roomManager
      .room("startRoom")
      .addPlayer(new Player(socket.id, data.name, data.color, { x: 0, y: 0 }));
    if (newPlayerData) {
      socket.emit("connectionAllowed", {
        player: newPlayerData,
        otherPlayers: Array.from(
          roomManager.getRoomOfPlayer(socket.id).getAllPlayer()
        ),
        dynamicObjects: roomManager.getAllDynamicObjects(socket.id),
      });
      socket.broadcast.emit("newPlayerJoined", newPlayerData);
    }
  });

  socket.on("playerMoved", (data) => {
    if (data) {
      roomManager.updatePlayerPosition(data);
      socket.broadcast.emit("otherPlayerMoved", data);
    }
  });

  socket.on("dynamicObjectTriggered", (data) => {
    let update = roomManager.roomUpdateDynamicObjects(socket.id, data.id);
    if (update) {
      socket.emit("enableFloor");
      socket.broadcast.emit("enableFloor", data);
    } else {
      socket.emit("disableFloor");
      socket.broadcast.emit("disableFloor", data);
    }
  });
});
