class Game {
  constructor() {
    this.homeScreen = document.getElementById("home-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreen = document.getElementById("end-screen");
    //TODO: Add player class item
    this.player = null;
    //TBD
    this.height = 720;
    this.width = 1280;
    //TBD
    this.fallingObjects = [];
    this.score = 0;
    this.lives = 3;
    this.isGameOver = false;
    //TODO: Check if necessary for falling objects
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);
  }
  //METHODS
  //Start game, enable gameScreen
  start() {}
  //Move player, generate fallingObjects
  update() {}
  //Remove player, remove fallingObjects, set Game over, show end screen
  endGame() {}
}

class Player {
  constructor() {}
  // Move player left to right
  move() {}
  // Updating DOM with recent position
  updatePosition() {}
  // Check if user collided w/ fallingObject
  didCatch() {}
  // evaluate favorable collusion or not
  getCatchType() {}
}

class fallingObject {
  constructor() {
    this.objectType; //color, bomb, heart, rainbow
  }
}
