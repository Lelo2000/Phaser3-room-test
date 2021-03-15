/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class FloorManager {
  constructor(scene) {
    this.scene = scene;
    this.floorArray = [];
    this.color = new Phaser.Display.Color();
    this.isActive = this.scene.inputData.dynamicObjects[0].values.isActive;
    this.nextColorSwitch = 600;
    this.lastTimeSwitched = 0;
  }

  enable() {
    this.isActive = true;
  }

  disable() {
    this.isActive = false;
  }

  addFloorTile(tile) {
    this.floorArray.push(tile);
  }
  randomizeColor() {
    this.floorArray.forEach((element) => {
      this.color.random(50);
      element.setTint(this.color.color);
    });
  }

  update(time) {
    if (this.isActive) {
      if (time - this.lastTimeSwitched > this.nextColorSwitch) {
        this.nextColorSwitch = Phaser.Math.Between(300, 1000);
        this.lastTimeSwitched = time;
        this.randomizeColor();
      }
    }
  }

  destroy() {
    this.sprite.destroy();
    ssssssssssssssss;
    this.nameText.destroy();
  }
}
