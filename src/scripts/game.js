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
    //TBD
    this.height = 720;
    this.width = 1280;
    //TBD
    this.fallingObjects = [];
    this.score = 0;
    this.lives = 3;
    this.hardMode = false;
    this.isGameOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);

    this.targetColor; //Color to be mixed
    this.currentColor; //Color assigned to user
    this.matchingColor; // falling color the user should catch
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
  //UPDATE DOM TO SHOW PLAYER WHAT THEY SHOULD CATCH
  //TODO: Transform to images
  updateDisplayedColors() {
    const displayTargetColor = document.getElementById("target-color");
    const displayTargetColorContainer = document.getElementById(
      "target-color-container"
    );
    const displayCurrentColor = document.getElementById("current-color");
    const displayCurrentColorContainer = document.getElementById(
      "current-color-container"
    );
    //Update Text
    displayTargetColor.textContent = this.targetColor; //update class to have color & add styling to bring this live
    displayTargetColor.style.color = `var(--${this.targetColor})`;
    displayCurrentColor.textContent = this.currentColor;
    displayCurrentColor.style.color = `var(--${this.currentColor})`;
    //Update color boxes
    displayTargetColorContainer.style.backgroundColor = `var(--${this.targetColor})`;
    displayCurrentColorContainer.style.backgroundColor = `var(--${this.currentColor})`;
  }

  onInitialRender() {
    this.generateTargetColor();
    this.generatePlayerColor();
    this.updateDisplayedColors();
  }

  //Start game, enable gameScreen
  start() {
    this.onInitialRender();
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
    if (this.isGameOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  // MOVE GENERATION OF NEW FALLING OBJECT INTO SEPARATE FCT
  generateFallingObject() {
    const object = new FallingObject(this.gameContainer, this.hardMode);
    console.log(object.type);
    return object;
  }

  //Move player, generate fallingObjects
  update() {
    this.player.move();
    this.updateDifficulty();
    // Create a new obstacle based on a random probability
    // when there is no other obstacles on the screen
    if (Math.random() > 0.95 && this.fallingObjects.length < 1) {
      //Math random: Ensure not to add fallingObject immediately
      this.fallingObjects.push(this.generateFallingObject()); //Refactored, original argument see line 97 after =
    }
    //add an obstacle if there is none
    if (this.fallingObjects.length) {
      const [fallingObject] = this.fallingObjects;
      const lives = document.getElementById("lives");
      const score = document.getElementById("score");

      console.log(fallingObject);
      fallingObject.move();
      if (this.score > 50) {
        this.hardMode = true;
      }

      //## HANDLING COLLISIONS - TODO: OUTSOURCE TO HELPER FUNCTIONS; FINE TUNE LOGIC
      if (this.player.didCollide(fallingObject)) {
        //UPDATED COLLISION LOGIC:
        if (
          fallingObject.type === this.matchingColor ||
          fallingObject.type === "rainbow"
        ) {
          this.score += 10;
          score.textContent = this.score;
          this.onInitialRender(); //Generate new set of colors
        } else if (fallingObject.type === "heart") {
          if (this.lives < 3) {
            this.lives++;
            lives.textContent = this.lives;
          }
        } else if (fallingObject.type === "bomb") {
          this.endGame();
        } else {
          this.lives--;
          lives.textContent = this.lives;
        }
        //REMOVE ELEMENT AFTER COLLISION
        fallingObject.element.remove();
        this.fallingObjects = [];
        //END GAME IF NEEDED
        if (this.lives === 0) {
          this.endGame();
        }
      }
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
        //remove obstacle
        fallingObject.element.remove();
        this.fallingObjects = [];
        //End game if needed
        if (this.lives === 0) {
          this.endGame();
        }
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

  updateDifficulty() {
    const displayedDifficulty = document.getElementById("difficulty");
    this.hardMode
      ? (displayedDifficulty.textContent = "Hard mode")
      : (displayedDifficulty.textContent = "Easy");
  }
}
// localStorage.setItem("my-value", "value");
// // localStorage.removeItem("my-value");
// const myValue=localStorage.getItem("my-value")
