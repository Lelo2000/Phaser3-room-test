export default class ConnectionScene extends Phaser.Scene {
  constructor() {
    super("connectionScene");
    this.socket;
    this.errorMessage = "";
  }

  preload() {
    this.load.plugin(
      "rexinputtextplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
      true
    );
    this.load.pack("MainHub", "../assets/map-package.json");
    this.load.svg("loginIllu", "../assets/login_illu.svg", { scale: 2 });
    this.load.svg("loginPfeil", "../assets/login_pfeil.svg", { scale: 9 });
  }

  create() {
    this.socket = io();
    this.socket.on("connectionAllowed", (data) => {
      this.scene.start("startScene", {
        socket: this.socket,
        player: data.player,
        otherPlayers: data.otherPlayers,
        dynamicObjects: data.dynamicObjects,
      });
    });
    const camera = this.cameras.main;
    camera.setBackgroundColor(0x010039);
    camera.setZoom(0.4);
    this.add.sprite(100, 450, "loginIllu");

    this.add.text(540, 30, "Wer bist du?", {
      color: "#655fb8",
      fontSize: 80,
      fontFamily: "ifSchrift",
    });
    this.errorMessage = this.add.text(540, 300, "", {
      color: "#CC3561",
      fontSize: 50,
      fontFamily: "ifSchrift",
    });

    this.inputText = this.add.rexInputText(380, 100, 200, 30, {
      backgroundColor: "#8C8DEA",
      color: "#000000",
      maxLength: 20,
      id: "nameField",
    });

    this.readyButton = this.matter.add
      .sprite(1300, 210, "loginPfeil")
      .setScale(0.1);
    this.readyButton.setInteractive();
    this.readyButton.on("pointerup", () => {
      if (this.inputText.text.length > 0) {
        this.socket.emit("requestConnection", { name: this.inputText.text });
      } else {
        this.errorMessage.setText("Bitte gib einen Namen ein.");
      }
    });
  }
  update(time, delta) {}
}
