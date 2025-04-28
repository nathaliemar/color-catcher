import { FallingObject } from "./falling-object.js";
import { Player } from "./player.js";

export class Game {
  constructor() {
    this.colors = {
      orange: ["red", "yellow"],
      purple: ["red", "blue"],
      green: ["blue", "yellow"],
    };
    this.homeScreen = document.getElementById("home-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.gameContainer = document.getElementById("game-container");
    this.endScreen = document.getElementById("end-screen");
    this.player = new Player(
      this.gameContainer,
      500,
      580,
      50,
      200,
      "src/assets/brush-small.png"
    );
    this.height = 720;
    this.width = 1280;
    this.fallingObjects = [];
    this.score = 0;
    this.lives = 3;
    this.hardMode = false;
    this.isGameOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);

    this.targetColor; //Color to be mixed
    this.currentColor; //Color assigned to user
    this.matchingColor; // Falling color the user should catch
  }
  generateTargetColor() {
    const mixedColors = Object.keys(this.colors);
    this.targetColor =
      mixedColors[Math.floor(Math.random() * mixedColors.length)];
  }

  generatePlayerColor() {
    if (!this.targetColor) throw new Error("Target color not set");
    const possibleColors = [...this.colors[this.targetColor]];
    const randomIndex = Math.floor(Math.random() * possibleColors.length);
    const [colorA] = possibleColors.splice(randomIndex, 1);
    const [colorB] = possibleColors;
    this.currentColor = colorA;
    this.matchingColor = colorB;
  }
  updateDisplayedColors() {
    const displayTargetColor = document.getElementById("target-color");
    const displayTargetColorContainer = document.getElementById(
      "target-color-container"
    );
    const displayCurrentColor = document.getElementById("current-color");
    const displayCurrentColorContainer = document.getElementById(
      "current-color-container"
    );
    //Update color names as text
    displayTargetColor.textContent = this.targetColor;
    displayTargetColor.style.color = `var(--${this.targetColor})`;
    displayCurrentColor.textContent = this.currentColor;
    displayCurrentColor.style.color = `var(--${this.currentColor})`;
    //Update color boxes
    displayTargetColorContainer.style.backgroundColor = `var(--${this.targetColor})`;
    displayCurrentColorContainer.style.backgroundColor = `var(--${this.currentColor})`;
  }

  generateAllColors() {
    this.generateTargetColor();
    this.generatePlayerColor();
    this.updateDisplayedColors();
  }

  start() {
    this.generateAllColors();
    this.gameContainer.style.height = `${this.height}`;
    this.gameContainer.style.width = `${this.width}`;
    this.homeScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();
    if (this.isGameOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  //Move player, generate fallingObjects
  update() {
    this.player.move();
    this.updateDifficulty();
    //if there is no falling object, add one
    if (Math.random() > 0.95 && this.fallingObjects.length < 1) {
      this.fallingObjects.push(this.generateFallingObject());
    }

    if (this.fallingObjects.length) {
      const [fallingObject] = this.fallingObjects; //get first element of the array = falling object object
      const lives = document.getElementById("lives");
      const score = document.getElementById("score");

      fallingObject.move();
      this.handleCollision(fallingObject, lives, score);
      this.handleMissedElement(fallingObject, lives, score);
    }
  }
  endGame() {
    this.player.element.remove();
    this.fallingObjects.forEach((object) => object.element.remove());
    this.isGameOver = true;
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "flex";
    document.getElementById("end-score").innerText = `${this.score}`;
  }

  generateFallingObject() {
    const object = new FallingObject(this.gameContainer, this.hardMode);
    return object;
  }

  updateDifficulty() {
    if (this.score >= 50) this.hardMode = true;

    const displayedDifficulty = document.getElementById("difficulty");
    this.hardMode
      ? (displayedDifficulty.textContent = "Hard")
      : (displayedDifficulty.textContent = "Easy");
  }

  handleCollision(fallingObject, lives, score) {
    if (this.player.didCollide(fallingObject)) {
      this.removeFallingObject(fallingObject);
      if (
        fallingObject.type === this.matchingColor ||
        fallingObject.type === "rainbow"
      ) {
        this.removeFallingObject(fallingObject); // Ensure actions are completed before e.g. the game Ends
        this.score += 10;
        score.textContent = this.score;
        this.generateAllColors(); //Generate new set of colors
      } else if (fallingObject.type === "heart") {
        this.removeFallingObject(fallingObject);
        if (this.lives < 3) {
          this.lives++;
          lives.textContent = this.lives;
        }
      } else if (fallingObject.type === "bomb") {
        this.removeFallingObject(fallingObject);
        this.endGame();
      } else {
        this.removeFallingObject(fallingObject);
        this.lives--;
        lives.textContent = this.lives;
      }
      //END GAME IF NEEDED
      this.checkIfGameOver();
    }
  }

  handleMissedElement(fallingObject, lives, score) {
    //## HANDLING MISSED FALLING OBJECTS
    if (fallingObject.top > this.height) {
      //BONUS POINTS IF A BOMB WAS MISSED
      if (fallingObject.type === "bomb") {
        this.score += 10;
        score.textContent = this.score;
      }
      if (fallingObject.type === this.matchingColor) {
        this.lives--;
        lives.textContent = this.lives;
      }
      this.removeFallingObject(fallingObject);

      //End game if needed
      this.checkIfGameOver();
    }
  }
  removeFallingObject(fallingObject) {
    fallingObject.element.remove();
    this.fallingObjects = [];
  }
  checkIfGameOver() {
    if (this.lives === 0) {
      this.endGame();
    }
  }
}
