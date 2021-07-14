class GameCanvas extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <canvas id="game-of-life-canvas"></canvas>
    `;
  }
}

customElements.define('game-canvas', GameCanvas);

export default GameCanvas;
