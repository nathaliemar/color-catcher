import { generateRandomArrIndex } from "./handlers.js";
export class Player {
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
  //TODO: Check if top is needed; Make private
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
export class FallingObject {
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
    this.imageMap.red.src = "src/assets/red-object.png"; //TODO
    this.imageMap.blue.src = "src/assets/blue-object.png"; //TODO
    this.imageMap.yellow.src = "src/assets/yellow-object.png"; //TODO
    this.imageMap.rainbow.src = "src/assets/logo.png"; //TODO
    this.imageMap.heart.src = "src/assets/heart-object.png";
    this.imageMap.bomb.src = "src/assets/bomb-object.png"; //TODO
  }

  constructor(gameContainer, hardMode) {
    this.gameContainer = gameContainer;
    this.hardMode = hardMode;
    this.possibleObjectTypes = {
      colors: ["red", "blue", "yellow"],
      bonuses: ["rainbow", "heart"],
      traps: "bomb",
    };
    this.type;
    this.left = Math.floor(Math.random() * 1260 + 20); //TODO: Finetune position
    this.top = 20; //TODO: Finetune after inserting backgroundImage
    this.size = 100; //width & height in one
    this.speed = 5;
    this.onGameStart();
  }

  onGameStart() {
    this.assignType();
    this.initiaiteItem();
    this.defineSpeed();
  }

  initiaiteItem() {
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
    this.top += this.speed; //TODO: Make variable
    this.updatePosition();
  }

  //TODO Make private
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  //Set different types falling object depending on probabilities //TODO: CALL EVERY TIME NEW ONE IS GENERATED
  assignType() {
    const bonusProbability = 10;
    const trapProbability = 5;
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber < trapProbability) {
      this.assignElement("traps");
    } else if (randomNumber < bonusProbability) {
      this.assignElement("bonuses");
    } else this.assignElement("colors");
  }
  //   //assigns the fallingObject one of the primary colors
  //   assignColor() {
  //     const colors = this.possibleObjectTypes.colors;
  //     const index = generateRandomArrIndex(colors);
  //     this.type = colors[index];
  //   }
  //   //assigns the fallingObject to be a rainbow or heart
  //   assignBonus() {
  //     const bonuses = this.possibleObjectTypes.bonuses;
  //     const index = generateRandomArrIndex(bonuses);
  //     this.type = bonuses[index];
  //   }

  assignElement(type) {
    if (type === "traps") return (this.type = this.possibleObjectTypes.traps);
    const toAssign = this.possibleObjectTypes[type];
    const index = generateRandomArrIndex(toAssign);
    this.type = toAssign[index];
  }

  //   assignTrap() {
  //     this.type = this.possibleObjectTypes.traps;
  //   }

  defineSpeed() {
    this.hardMode ? (this.speed = 7) : (this.speed = 5);
  }
}
