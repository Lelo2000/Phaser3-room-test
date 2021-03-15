import StartScene from "./start-scene.js";
import ConnectionScene from "./connection-scene.js";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  parent: "game",
  dom: {
    createContainer: true,
  },
  scene: [ConnectionScene, StartScene],
};

const game = new Phaser.Game(config);
