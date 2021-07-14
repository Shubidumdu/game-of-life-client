import GameCanvas from './GameCanvas.js';
import ColorPalettes from './ColorPalettes.js';
import ButtonList from './ButtonList.js';
import '../index.css';

class App extends HTMLElement {
  GameCanvas;
  ColorPalettes;
  ButtonList;

  constructor() {
    super();
    this.innerHTML = `
    <a
      href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
      target="_blank"
      rel="noreferrer noopener"
      ><button id="help-button">?</button></a
    >
    <game-canvas></game-canvas>
    <color-palettes></color-palettes>
    <button-list></button-list>
    `;
    this.GameCanvas = this.querySelector('game-canvas');
    this.ColorPalettes = this.querySelector('color-palettes');
    this.ButtonList = this.querySelector('button-list');
  }
}

customElements.define('game-of-life', App);

export default App;
