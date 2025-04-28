import { generateRandomArrIndex } from "./handlers.js";

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
    this.imageMap.red.src = "src/assets/red-object.png";
    this.imageMap.blue.src = "src/assets/blue-object.png";
    this.imageMap.yellow.src = "src/assets/yellow-object.png";
    this.imageMap.rainbow.src = "src/assets/rainbow-object.png";
    this.imageMap.heart.src = "src/assets/heart-object.png";
    this.imageMap.bomb.src = "src/assets/bomb-object.png";
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
    this.left = Math.floor(Math.random() * 980 + 10);
    this.top = 20;
    this.size = 100;
    this.speed = 5;
    this.onGameStart();
  }

  onGameStart() {
    this.assignType();
    this.initiateItem();
    this.defineSpeed();
  }

  initiateItem() {
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
    this.top += this.speed;
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
