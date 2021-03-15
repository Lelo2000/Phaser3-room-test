/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class OtherPlayer {
  constructor(scene, id, name, color, position) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.color = color;
    this.direction = "front";

    //Spielerobjekte
    this.sprite = scene.add
      .sprite(position.x, position.y, "catGhosts", 1)
      .setOrigin(0)
      .setScale(0.2, 0.2);
    this.sprite.setTint(parseInt(color.replace(/^#/, ""), 16));
    this.nameText = scene.add.text(this.sprite.x, this.sprite.y, name, {
      font: "24px Arial",
      fill: "#ffffff",
      wordWrap: true,
      wordWrapWidth: this.sprite.width + 20,
      align: "center",
    });
    this.nameText.setOrigin(0.5);

    //Moving

    this.isSpinning = false;
  }

  setDirection(direction) {
    this.direction = direction;
    switch (direction) {
      case "up":
        this.sprite.setFrame(0).setScale(0.2, 0.2);
        break;
      case "right":
        this.sprite.setFrame(3).setScale(0.2, 0.2);
        break;
      case "left":
        this.sprite.setFrame(1).setScale(0.2, 0.2);
        break;
      case "down":
        this.sprite.setFrame(2).setScale(0.2, 0.2);
        break;
    }
  }

  update() {
    //update Text Position
    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - this.sprite.displayHeight / 2 - 18;
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  setNewPosition(position) {
    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
