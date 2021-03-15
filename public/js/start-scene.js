import Player from "./player.js";
import DiscoSchemel from "./discoSchemel.js";
import FloorManager from "./discoFloor.js";
import OtherPlayer from "./otherPlayer.js";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
    this.socket;
    this.inputData;
    this.player;
    this.otherPlayers = new Map();
    this.dynamicObjects = new Map();
    this.danceFloorManager;
  }

  preload() {
    //this.load.setBaseURL("localhost:8080/public/");
    this.load.pack("MainHub", "../assets/map-package.json");
    this.load.svg("activationButton", "../assets/activate_button.svg", {
      scale: 1,
    });
    this.load.svg("wool-ball", "../assets/wool-ball.svg", {
      scale: 0.1,
    });
  }

  init(data) {
    this.inputData = data;
    this.playerData = data.player;
    this.otherPlayersData = new Map(data.otherPlayers);
    this.socket = data.socket;
    this.canvas = this.sys.game.canvas;
  }

  create() {
    window.addEventListener("playerMoved", () => {
      this.socket.emit("playerMoved", {
        id: this.player.id,
        position: this.player.getPosition(),
        direction: this.player.direction,
      });
    });

    window.addEventListener("triggerDynamicObject", (e) => {
      this.triggerDynamicObject(e.detail);
      this.socket.emit("dynamicObjectTriggered", e.detail);
    });
    this.socket.on("otherPlayerMoved", (data) => {
      if (data.id && data.position && data.direction) {
        if (this.otherPlayers.has(data.id)) {
          this.otherPlayers.get(data.id).setNewPosition(data.position);
          this.otherPlayers.get(data.id).setDirection(data.direction);
        }
      }
    });
    this.socket.on("newPlayerJoined", (data) => {
      this.addOtherPlayer(
        data.id,
        data.name,
        data.color,
        data.position,
        data.direction
      );
    });
    this.socket.on("playerDisconnected", (data) => {
      this.removeOtherPlayer(data.id);
    });

    this.socket.on("enableFloor", () => {
      this.danceFloorManager.enable();
      this.roboClosed.setVisible(!this.danceFloorManager.isActive);
    });

    this.socket.on("disableFloor", () => {
      this.danceFloorManager.disable();
      this.roboClosed.setVisible(!this.danceFloorManager.isActive);
    });

    this.socket.on("playerDisconnected", (data) => {
      this.removeOtherPlayer(data.id);
    });
    this.socket.on("reconnect", () => {
      console.log("reconnect");
      this.socket.emit("requestReconnectionConnection", { data: this.player });
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected");
    });

    const map = this.make.tilemap({ key: "winterIf-map" });
    const tiles = map.addTilesetImage(
      map.tilesets[0].name,
      map.tilesets[0].name
    );
    const wallGaps = map.createLayer("wall-gaps", tiles, 0, 0);
    const belowPlayer = map.createLayer("Ground", tiles, 0, 0);
    const world = map.createLayer("door-and-robot", tiles, 0, 0);
    const dancefloor = map.createLayer("dancefloor", tiles, 0, 0);

    let imdRobo = map.findObject(
      "Objektebene",
      (obj) => obj.name === "imdRobo"
    );

    this.danceFloorManager = new FloorManager(this);
    dancefloor.forEachTile((tile) => {
      if (tile.index != -1) {
        let danceTile = this.add.sprite(
          tile.pixelX + 32,
          tile.pixelY + 16,
          "danceFloorTile"
        );
        this.danceFloorManager.addFloorTile(danceTile);
      }
    });
    this.danceFloorManager.randomizeColor();
    this.dynamicObjects.set(
      imdRobo.properties[0].value,
      this.createDynamicObject(imdRobo.properties[0].value, {
        x: imdRobo.x - 420,
        y: imdRobo.y + 100,
      })
    );
    this.roboClosed = this.matter.add.image(
      imdRobo.x - 454,
      imdRobo.y + 78,
      "roboHeadClosed",
      0,
      { isStatic: true }
    );
    this.roboClosed.setVisible(!this.danceFloorManager.isActive);

    this.initOtherPlayers();
    this.player = new Player(
      this,
      this.socket.id,
      this.playerData.name,
      this.playerData.color,
      this.playerData.position,
      true
    );
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setZoom(1, 1);

    world.setCollisionByProperty({ collide: true });
    belowPlayer.setCollisionByProperty({ collide: true });
    wallGaps.setCollisionByProperty({ collide: true });

    this.matter.world.convertTilemapLayer(world);
    this.matter.world.convertTilemapLayer(belowPlayer);
    this.matter.world.convertTilemapLayer(world);

    // this.matter.world.createDebugGraphic();

    //leftTop
    this.matter.add.rectangle(0, 240, 3000, 100, {
      isStatic: true,
      angle: -0.464781,
    });
    this.matter.add.rectangle(-760, 650, 600, 100, {
      isStatic: true,
      angle: -0.464781,
    });

    //leftBottom
    this.matter.add.rectangle(350, 1450, 3000, 100, {
      isStatic: true,
      angle: 0.464781,
    });
    //leftBottom2
    this.matter.add.rectangle(1550, 1650, 3000, 100, {
      isStatic: true,
      angle: 0.464781,
    });

    //rightTop
    this.matter.add.rectangle(350, 240, 3000, 100, {
      isStatic: true,
      angle: 0.464781,
    });

    //rightBottom
    this.matter.add.rectangle(1000, 1000, 3000, 100, {
      isStatic: true,
      angle: -0.464781,
    });

    //rightBottom2
    this.matter.add.rectangle(40, 1050, 500, 100, {
      isStatic: true,
      angle: -0.464781,
    });

    this.matter.add
      .image(500, 700, "wool-ball", 0, {
        restitution: 0.5,
      })
      .setCircle(25);

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // world.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    // camera.setBounds(
    //   -map.widthInPixels / 2,
    //   -map.heightInPixels / 2,
    //   map.widthInPixels / 2,
    //   map.heightInPixels / 2
    // );
  }
  update(time, delta) {
    this.player.update();
    this.danceFloorManager.update(time);
    this.otherPlayers.forEach((player) => {
      player.update();
    });
    this.dynamicObjects.forEach((object) => {
      object.update(time);
    });
  }

  initOtherPlayers() {
    this.otherPlayersData.forEach((player) => {
      if (player.id != this.socket.id) {
        this.addOtherPlayer(
          player.id,
          player.name,
          player.color,
          player.position,
          player.direction
        );
      }
    });
  }

  addOtherPlayer(id, name, color, position, direction) {
    this.otherPlayers.set(id, new OtherPlayer(this, id, name, color, position));
    console.log(direction);
    this.otherPlayers.get(id).setDirection(direction);
  }

  removeOtherPlayer(id) {
    if (this.otherPlayers.has(id)) {
      let removePlayer = this.otherPlayers.get(id);
      removePlayer.destroy();
      this.otherPlayers.delete(id);
    }
  }

  createDynamicObject(id, position) {
    switch (id) {
      case "imdRobo":
        let discosSchemel = new DiscoSchemel(this, position, this.player);
        // this.matter.add.overlap(
        //   discosSchemel.activationZone,
        //   this.player.sprite,
        //   () => {
        //     this.player.setActivationEvent(
        //       new CustomEvent("triggerDynamicObject", { detail: { id: id } })
        //     );
        //   }
        // );
        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
          if (
            (bodyA.id == this.player.sprite.body.id &&
              bodyB.id == discosSchemel.activationZone.id) ||
            (bodyB.id == this.player.sprite.body.id &&
              bodyA.id == discosSchemel.activationZone.id)
          ) {
            this.player.setActivationEvent(
              new CustomEvent("triggerDynamicObject", { detail: { id: id } })
            );
          }
        });
        this.matter.world.on("collisionend", (event, bodyA, bodyB) => {
          if (
            (bodyA.id == this.player.sprite.body.id &&
              bodyB.id == discosSchemel.activationZone.id) ||
            (bodyB.id == this.player.sprite.body.id &&
              bodyA.id == discosSchemel.activationZone.id)
          ) {
            this.player.removeActivationEvent();
          }
        });
        return discosSchemel;
    }
  }

  triggerDynamicObject(data) {
    if (this.dynamicObjects.has(data.id)) {
      this.dynamicObjects.get(data.id).activateEvent();
    }
  }
}
