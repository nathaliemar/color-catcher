import { FallingObject } from "./falling-object.js";
import { Game } from "./game.js";

window.onload = function () {
  let game;
  FallingObject.loadImages();
  //#### BUTTONS & EVENT LISTENERS####
  console.log(Game);
  //START
  //TODO: Update startGame / check if both work
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startGame);
  function startGame() {
    console.log("Function startGame called");
    game = new Game(); //let game line 1
    game.start();
  }

  //RESTART
  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", restartGame);
  function restartGame() {
    window.location.reload();
  }

  //MOVING THE PLAYER
  function handleKeydown(event) {
    const key = event.key;
    const possibleKeyStrokes = ["ArrowLeft", "ArrowRight"];
    if (possibleKeyStrokes.includes(key)) {
      event.preventDefault();
      if (key === "ArrowLeft") {
        game.player.directionX = -5;
      }
      if (key === "ArrowRight") {
        game.player.directionX = 5;
      }
    }
  }
  function handleKeyup(event) {
    const key = event.key;
    const possibleKeyStrokes = ["ArrowLeft", "ArrowRight"];
    if (possibleKeyStrokes.includes(key)) {
      event.preventDefault();
      if (key === "ArrowLeft" || key === "ArrowRight") {
        game.player.directionX = 0;
      }
    }
  }
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
};
