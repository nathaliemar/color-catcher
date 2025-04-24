//COLOR MIXING LOGIC - basis for evaluating if a catch is favorable
const orangComponents = ["red", "yellow"];
const purpleComponents = ["red", "blue"];
const greenComponents = ["blue", "yellow"];

class Game {
  constructor() {
    this.homeScreen = document.getElementById("home-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.gameContainer = document.getElementById("game-container"); //remove if not needed
    this.endScreen = document.getElementById("end-screen");
    //TODO: Add player class item, then create new player here!
    this.player = new Player(
      this.gameContainer,
      615, //TODO: CLARIFY: entering 1280/2-25 = 615 does not work for some reason
      580,
      50,
      200,
      "src/assets/brush-small.png"
    );
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
    //TODO: Logic to generate the "target color"
    this.targetColor; //Color to be mixed
    this.currentColor; //Color assigned to user
  }
  //METHODS
  //When game is started, after collision with correct color or rainbow
  generateTargetColor() {}
  //When game is started, after collision with correct color
  generatePlayerColor() {}
  //Start game, enable gameScreen
  start() {
    this.gameContainer.style.height = `${this.height}`; //pass size to DOM
    this.gameContainer.style.width = `${this.width}`;
    this.homeScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  //run updates in gameLoopFrequency
  gameLoop() {
    this.update();
    console.log("gameloop Fired");
    if (this.isGameOver) {
      clearInterval(this.gameIntervalId);
    }
  }
  //Move player, generate fallingObjects
  update() {
    this.player.move();
    // Create a new obstacle based on a random probability
    // when there is no other obstacles on the screen
    if (Math.random() > 0.98 && this.fallingObjects.length < 1) {
      //Math random: Ensure not to add fallingObject immediately
      this.fallingObjects.push(new FallingObject(this.gameContainer));
    }
    //add an obstacle if there is none
    if (this.fallingObjects.length) {
      const [fallingObject] = this.fallingObjects;
      fallingObject.move();

      //## HANDLING COLLISIONS - TODO: OUTSOURCE TO HELPER FUNCTIONS; FINE TUNE LOGIC
      if (this.player.didCollide(fallingObject)) {
        this.lives--;
        //Update DOM
        const lives = document.getElementById("lives");
        lives.textContent = this.lives;
        //remove fallingObject
        fallingObject.element.remove();
        this.fallingObjects = [];
        //handle 0 lives
        if (this.lives === 0) {
          this.endGame();
        }
        //BASIC COLLISION LOGIC
        //BASIC 01: If you catch any, add points!

        //BASIC 02: If you miss any, remove life!

        //If color (rgb)if right: increase score, if wrong: reduce lives
        //if rainbow
        //if heart. check if lives <3, then lives +1, (else: Toaster: your lives are already full)
        //If bomb - game over
        //this.Game.endGame();
      }
      //## HANDLING MISSED FALLING OBJECTS
      if (fallingObject.top > this.height) {
        this.score++;
        //Update score in DOM
        const score = document.getElementById("score");
        score.textContent = this.score;
        //remove obstacle
        fallingObject.element.remove();
        this.fallingObjects = [];
      }
    }
  }
  //Remove player, remove fallingObjects, set Game over, show end screen
  endGame() {
    this.player.element.remove();
    this.fallingObjects.forEach((object) => object.element.remove());
    this.isGameOver = true;
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "block"; //TODO check if needs to be flex
  }
}

class Player {
  constructor(gameContainer, left, top, width, height, imgSrc) {
    this.gameContainer = gameContainer;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    //this.directionY=0 <- not needed I guess
    this.element = document.createElement("img");
    //Add player to DOM
    this.element.src = imgSrc;
    this.element.style.position = "absolute";
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
    this.gameContainer.appendChild(this.element);
  }
  // Move player left to right
  move() {
    console.log("move called");
    console.log(this.directionX);
    this.left += this.directionX; // only navigating left to right
    //TODO: Check if "10" is actually matching the game's borders + Check if right works (naming)
    //Left side
    if (this.left < 10) {
      this.left = 10;
    }
    //Right side
    if (this.left > this.gameContainer.offsetWidth - this.width - 10) {
      this.left = this.gameContainer.offsetWidth - this.width - 10;
    }
    this.updatePosition();
  }
  // Updating DOM with recent position
  //TODO: Check if top is needed
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
  // Check if user collided w/ fallingObject
  didCollide(fallingObject) {
    const playerRect = this.element.getBoundingClientRect();
    const fallingObjectRect = fallingObject.element.getBoundingClientRect();

    if (
      playerRect.left < fallingObjectRect.right &&
      playerRect.right > fallingObjectRect.left &&
      playerRect.top < fallingObjectRect.bottom &&
      playerRect.bottom > fallingObjectRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
  // evaluate favorable collusion or not
  getCollisionType() {
    if (fallingObject.type === "rainbow") {
    }
    if (fallingObject.type === "bomb") {
    }
    if (fallingObject.type === "heart") {
    }
    // TODO Add Conditions for colors, check syntax (FallingObject)
  }
}
class FallingObject {
  //fallingSpeed / method updateSpeed()
  static imageMap = {
    red: new Image(),
    blue: new Image(),
    yellow: new Image(),
    rainbow: new Image(),
    heart: new Image(),
    bomb: new Image(),
  };
  static loadImages() {
    this.imageMap.red.src = "src/assets/logo.png"; //TODO
    this.imageMap.blue.src = "src/assets/logo.png"; //TODO
    this.imageMap.yellow.src = "src/assets/logo.png"; //TODO
    this.imageMap.rainbow.src = "src/assets/logo.png"; //TODO
    this.imageMap.heart.src = "src/assets/logo.png"; //TODO
    this.imageMap.bomb.src = "src/assets/logo.png"; //TODO
  }

  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.type = "red"; //red, yellow, blue, bomb, heart, rainbow //TODO!
    this.left = Math.floor(Math.random() * 300 + 70); //TODO: Finetune position
    this.top = 0; //TODO: Finetune after inserting backgroundImage
    this.size = 100; //width & height in one
    this.speed;
    this.element = document.createElement("img");
    this.element.src = FallingObject.imageMap[this.type].src;

    this.element.style.position = "absolute";
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.gameContainer.appendChild(this.element);
  }
  move() {
    console.log("Falling object move fired");
    this.top += 3; //TODO: Make variable
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
  updateSpeed() {
    //this.speed++ -> make sure this applies to all following!
  }
  //determine what consequences the different collisions have
}
