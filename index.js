const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "./assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "./assets/tilemaps/yeji-town.json");

  this.load.atlas(
    "atlas",
    "./assets/atlas/tuxemon-girl/atlas.png",
    "./assets/atlas/tuxemon-girl/atlas.json"
  );
}

let player;
let cursors;

function create() {
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });
  aboveLayer.setDepth(10);
  const spawnPoint = map.findObject(
    "Objects",
    (obj) => obj.name === "Spawn Point"
  );

  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "37707_female_front")
    .setSize(30, 40)
    .setOffset(0, 24);
  this.physics.add.collider(player, worldLayer);

  const anims = this.anims;
  anims.create({
    key: "37707_female_left_walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "37707_female_left_walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "37707_female_right_walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "37707_female_right_walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "37707_female_front_walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "37707_female_front_walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "37707_female_back_walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "37707_female_back_walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  player.body.setVelocity(0);

  //horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  //vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  player.body.velocity.normalize().scale(speed);

  if (cursors.left.isDown) {
    player.anims.play("37707_female_left_walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("37707_female_right_walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("37707_female_back_walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("37707_female_front_walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick an idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "37707_female_left");
    else if (prevVelocity.x > 0)
      player.setTexture("atlas", "37707_female_right");
    else if (prevVelocity.y < 0)
      player.setTexture("atlas", "37707_female_back");
    else if (prevVelocity.y > 0)
      player.setTexture("atlas", "37707_female_front");
  }
}
