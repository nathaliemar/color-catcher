export class Player {
  constructor(gameContainer, left, top, width, height, imgSrc) {
    this.gameContainer = gameContainer;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;

    this.element = this.createPlayerElement({
      left,
      top,
      width,
      height,
      imgSrc,
    });
  }
  createPlayerElement(options) {
    const { imgSrc, width, height, left, top } = options;
    const element = document.createElement("img");
    element.src = imgSrc;
    element.style.position = "absolute";
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    this.gameContainer.appendChild(element);
    return element;
  }

  move() {
    this.left += this.directionX;
    if (this.left < 10) {
      this.left = 10;
    }
    if (this.left > this.gameContainer.offsetWidth - this.width - 290) {
      this.left = this.gameContainer.offsetWidth - this.width - 290;
    }
    this.element.style.left = `${this.left}px`;
  }
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
}
