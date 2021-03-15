module.exports = class Room {
  constructor(name) {
    this.name = name;
    this.playerList = new Map();
    this.dynamicObjectList = new Map();
    this.spawnPoint = { x: -60, y: 330 };
    this.possibleColors = [
      "#4cd9b0",
      "#9efffe",
      "#ffa8ed",
      "#fdc158",
      "#f74099",
      "#fc8456",
    ];
    this.dynamicObjectList.set("imdRobo", {
      danceFloor: false,
      activate: function () {
        this.danceFloor = Math.abs(this.danceFloor - 1);
        return this.danceFloor;
      },
      getStatus: function () {
        return { isActive: this.danceFloor };
      },
    });
  }

  getAllPlayer() {
    return this.playerList;
  }

  updateDynamicObjects(objectId) {
    return this.dynamicObjectList.get(objectId).activate();
  }

  getAllDynamicObjectStatuses() {
    let result = [];
    this.dynamicObjectList.forEach((element, key) => {
      result.push({ key: key, values: element.getStatus() });
    });
    return result;
  }

  addPlayer(player) {
    let newPlayer = player;
    newPlayer.position = this.spawnPoint;
    if (!newPlayer.color) {
      newPlayer.color = this.possibleColors[
        Math.floor(Math.random() * this.possibleColors.length)
      ];
    }
    this.playerList.set(newPlayer.id, newPlayer);
    console.log(
      `Neuer Spieler ${newPlayer.name} ist dem Raum ${this.name} beigetreten`
    );
    console.log(this.playerList);
    return newPlayer;
  }

  getPlayer(id) {
    if (this.playerList.has(id)) {
      return this.playerList.get(id);
    }
    return;
  }

  deletePlayer(id) {
    this.playerList.delete(id);
  }
};
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
