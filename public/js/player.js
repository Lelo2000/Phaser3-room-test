/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
  constructor(scene, id, name, color, position, isControlled) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.color = color;
    this.direction = "front";

    //Spielerobjekte
    this.sprite = scene.matter.add
      .sprite(position.x, position.y, "catGhosts", 0, {
        inertia: Infinity,
        inverseInertia: 1 / Infinity,
      })
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
    this.activationEvent;
    this.activationButton = this.scene.add.sprite(
      100,
      this.scene.canvas.height - 50,
      "activationButton"
    );
    this.activationButton.setScrollFactor(0, 0);
    this.activationButton.setInteractive();
    this.activationButton.on("pointerup", () => {
      this.activateActivationEvent();
      this.blockMovementClick = true;
      this.moveToGoalPosition = false;
    });
    this.canAction = false;
    this.activationButton.setVisible(false);
    this.blockMovementClick = false;

    //Moving
    this.keys = scene.input.keyboard.addKeys("w,s,a,d,left,right,up,down");

    this.isControlled = isControlled;
    this.oldPosition = { x: 0, y: 0 };
    this.goalPosition = position;
    this.moveToGoalPosition = false;
    if (this.isControlled) {
      this.scene.input.on("pointerup", () => {
        if (!this.blockMovementClick) {
          this.moveToGoalPosition = true;
          this.goalPosition.x = this.scene.input.activePointer.worldX;
          this.goalPosition.y = this.scene.input.activePointer.worldY;
        } else {
          this.blockMovementClick = false;
        }
      });
    }
    this.isSpinning = false;
    this.scene.input.keyboard.on("keydown", (event) => {
      if (event.keyCode === 80) {
        this.isSpinning = Math.abs(this.isSpinning - 1);
      }
    });
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

  activateActivationEvent() {
    window.dispatchEvent(this.activationEvent);
    this.removeActivationEvent();
  }

  setActivationEvent(event) {
    this.activationEvent = event;
    this.activationButton.setInteractive();
    this.activationButton.setVisible(true);
    this.canAction = true;
  }

  removeActivationEvent() {
    this.activationButton.disableInteractive();
    this.activationButton.setVisible(false);
    this.canAction = false;
  }

  update() {
    if (!this.isSpinning) {
      this.sprite.setAngle(0);
    }

    if (this.isControlled) {
      const keys = this.keys;
      const sprite = this.sprite;
      const speed = 2;
      // Stop any previous movement from the last frame
      // this.scene.matter.Body.setVelocity(this.sprite, 0);
      sprite.setVelocity(0);

      // Horizontal movement
      if (keys.left.isDown || keys.a.isDown) {
        sprite.setVelocityX(-speed);
      } else if (keys.right.isDown || keys.d.isDown) {
        sprite.setVelocityX(speed);
      }
      if (sprite.x !== this.oldPosition.x || sprite.y !== this.oldPosition.y) {
        window.dispatchEvent(new CustomEvent("playerMoved"));
      }

      // Vertical movement
      if (keys.up.isDown || keys.w.isDown) {
        sprite.setVelocityY(-speed);
      } else if (keys.down.isDown || keys.s.isDown) {
        sprite.setVelocityY(speed);
      }

      //mouse Movement
      if (this.moveToGoalPosition) {
        if (Math.abs(sprite.x - this.goalPosition.x) >= speed) {
          if (this.sprite.x < this.goalPosition.x) {
            this.sprite.setVelocityX(speed);
          } else if (this.sprite.x > this.goalPosition.x) {
            this.sprite.setVelocityX(-speed);
          }
        }

        if (Math.abs(sprite.y - this.goalPosition.y) >= speed) {
          if (this.sprite.y < this.goalPosition.y) {
            this.sprite.setVelocityY(speed);
          } else if (this.sprite.y > this.goalPosition.y) {
            this.sprite.setVelocityY(-speed);
          }
        }
      }

      if (
        Math.abs(sprite.y - this.goalPosition.y) <= speed &&
        Math.abs(sprite.x - this.goalPosition.x) <= speed &&
        this.moveToGoalPosition
      ) {
        this.moveToGoalPosition = false;
      }
      // Normalize and scale the velocity so that sprite can't move faster along a diagonal
      // sprite.velocity.normalize().scale(speed);
      let normalizedVector = new Phaser.Math.Vector2(
        sprite.body.velocity.x,
        sprite.body.velocity.y
      )
        .normalize()
        .scale(speed);
      sprite.setVelocity(normalizedVector.x, normalizedVector.y);
      if (
        Math.abs(this.sprite.body.velocity.x) >
        Math.abs(this.sprite.body.velocity.y)
      ) {
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.setFrame(3).setScale(0.2, 0.2);
          this.direction = "right";
        } else if (this.sprite.body.velocity.x < 0) {
          this.sprite.setFrame(1).setScale(0.2, 0.2);
          this.direction = "left";
        }
      } else {
        if (this.sprite.body.velocity.y > 0) {
          this.sprite.setFrame(2).setScale(0.2, 0.2);
          this.direction = "down";
        } else if (this.sprite.body.velocity.y < 0) {
          this.sprite.setFrame(0).setScale(0.2, 0.2);
          this.direction = "up";
        }
      }

      this.oldPosition = { x: this.sprite.x, y: this.sprite.y };
    }
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

  stop() {
    this.moveToGoalPosition = false;
    this.sprite.setVelocity(0);
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
