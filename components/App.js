import GameCanvas from './GameCanvas.js';
import ColorPalettes from './ColorPalettes.js';
import ButtonList from './ButtonList.js';
import { stringToHex } from '../utils.js';
class App extends HTMLElement {
  colors = {
    active: '#D54B3F',
    inactive: '#D2CFA6',
    background: '#1D383D',
    grid: '#FDF8F5',
  };
  width;
  height;
  universe;
  memory;
  animationId;
  GameCanvas;
  ColorPalettes;
  ButtonList;

  constructor() {
    super();
    import('@shubidumdu/wasm-game-of-life')
      .then(({ Universe }) => {
        this.universe = Universe.new();
        this.width = this.universe.width();
        this.height = this.universe.height();
        import('@shubidumdu/wasm-game-of-life/wasm_game_of_life_bg').then(
          (a) => {
            // this.memory = memory;
            console.log(a);
            // this.animationId = requestAnimationFrame(this.renderWithStop);
          },
        );
      })
      .catch((err) => console.err(err));
    this.innerHTML = `
    <a
      href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
      target="_blank"
      rel="noreferrer noopener"
      ><button id="help-button">?</button></a
    >
    `;
    this.GameCanvas = new GameCanvas({
      colors: this.colors,
    });
    this.ColorPalettes = new ColorPalettes({
      colors: this.colors,
    });
    this.ButtonList = new ButtonList();
    this.append(this.GameCanvas, this.ColorPalettes, this.ButtonList);
  }

  connectedCallback() {
    this.addEventListener('change-color', this._onChangeColor);
  }

  disconnectedCallback() {
    this.removeEventListener('change-color', this._onChangeColor);
  }

  _onChangeColor = (e) => {
    const { type, value } = e.detail;
    const hex = stringToHex(value);
  };

  _drawCells = (time) => {
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(
      this.memory.buffer,
      cellsPtr,
      (width * height) / 8,
    );
    GameCanvas.drawCells(time, cells);
  };

  render = (time) => {
    time *= 0.005;
    this.universe.tick();
    this.GameCanvas.waveCells();
    this._drawCells(time);
    this.GameCanvas.resize();
    this.GameCanvas.render();
    this.animationId = requestAnimationFrame(this.render);
  };

  renderWithStop = (time) => {
    this.GameCanvas.resize();
    this.GameCanvas.render();
    this.animationId = requestAnimationFrame(this.render);
  };
}

customElements.define('game-of-life', App);

export default App;
