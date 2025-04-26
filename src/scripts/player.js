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
    this.left += this.directionX;
    if (this.left < 10) {
      this.left = 10;
    }
    if (this.left > this.gameContainer.offsetWidth - this.width - 290) {
      this.left = this.gameContainer.offsetWidth - this.width - 290;
    }
    this.updatePosition();
  }
  // Updating DOM with recent position
  //TODO: Check if top is needed; Make private
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    //this.element.style.top = `${this.top}px`;
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
