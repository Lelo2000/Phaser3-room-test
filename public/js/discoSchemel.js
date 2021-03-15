/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class DiscoSchemel {
  constructor(scene, position) {
    this.scene = scene;
    // this.sprite = scene.physics.add
    //   .staticSprite(position.x - 32, position.y - 16, "discoSchemel")
    //   .setSize(64, 32);
    this.activationZone = scene.matter.add.circle(
      position.x - 32,
      position.y - 16,
      100,
      {
        isSensor: true,
      }
    );
    // scene.physics.enable(this.activationZone);

    this.color = new Phaser.Display.Color();
    this.isActive = true;
    // this.sprite.setTint(parseInt(color.replace(/^#/, ""), 16));
  }

  activateEvent() {
    this.isActive = Math.abs(this.isActive - 1);
  }

  update(time) {
    // if (this.isActive) {
    //   if (Math.floor(time) % 100 === 0) {
    //     this.color.random(50);
    //     this.sprite.setTint(this.color.color);
    //   }
    // }
  }

  destroy() {
    this.sprite.destroy();
  }
}
