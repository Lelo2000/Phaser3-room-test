module.exports = class Player {
  constructor(id, name, color, position) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.position = position;
    this.direction = "front";
  }
};
