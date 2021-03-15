const Room = require("./room");

module.exports = class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.rooms.set("startRoom", new Room("startRoom"));
  }

  room(id) {
    if (this.rooms.has(id)) {
      return this.rooms.get(id);
    }
    return false;
  }

  getPlayer(id) {
    let searchedPlayer;
    this.rooms.forEach((room) => {
      if (room.getPlayer(id)) {
        searchedPlayer = room.getPlayer(id);
      }
    });
    return searchedPlayer;
  }
  getAllDynamicObjects(playerId) {
    let room = this.getRoomOfPlayer(playerId);
    if (room) {
      return room.getAllDynamicObjectStatuses();
    }
  }
  roomUpdateDynamicObjects(playerId, objectId) {
    let room = this.getRoomOfPlayer(playerId);
    if (room) {
      return room.updateDynamicObjects(objectId);
    }
  }

  getRoomOfPlayer(id) {
    let searchedRoom;
    this.rooms.forEach((room) => {
      if (room.getPlayer(id)) {
        searchedRoom = room;
      }
    });
    return searchedRoom;
  }

  deletePlayer(id) {
    let room = this.getRoomOfPlayer(id);
    if (room) {
      room.deletePlayer(id);
      console.log(
        `Ein Spieler hat den Raum ${room.name} verlasse. Neue Raumliste:`
      );
      console.log(room.playerList);
    }
  }

  updatePlayerPosition(data) {
    let player = this.getPlayer(data.id);
    if (player) {
      player.position = data.position;
      player.direction = data.direction;
    }
  }
};
