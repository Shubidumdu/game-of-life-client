import GameCanvas from './GameCanvas.js';
import ColorPalettes from './ColorPalettes.js';
import ButtonList from './ButtonList.js';
import { stringToHex } from '../utils.js';
import { Universe } from '@shubidumdu/wasm-game-of-life';

class App extends HTMLElement {
  colors = {
    active: '#D54B3F',
    inactive: '#D2CFA6',
    background: '#1D383D',
    grid: '#FDF8F5',
  };
  universe;
  GameCanvas;
  ColorPalettes;
  ButtonList;

  constructor() {
    super();
    this.universe = Universe.new();
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
}

customElements.define('game-of-life', App);

export default App;
