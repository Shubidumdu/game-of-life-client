class App extends HTMLElement {
  INITIAL_ACTIVE_COLOR = '#D54B3F';
  INITIAL_INACTIVE_COLOR = '#D2CFA6';
  INITIAL_BACKGROUND_COLOR = '#1D383D';
  INITIAL_GRID_COLOR = '#FDF8F5';

  $canvas;
  $colorInputs;
  $buttonList;

  contructor() {
    super();
    this.innerHTML = `
    <a
      href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
      target="_blank"
      rel="noreferrer noopener"
      ><button id="help-button">?</button></a
    >
    <game-canvas></game-canvas>
    <color-inputs></color-inputs>
    <button-list></button-list>
    `;
    this.$canvas = this.querySelector('game-canvas');
    this.$colorInputs = this.querySelector('color-inputs');
    this.$buttonList = this.querySelector('button-list');
    this.colors = {
      active: this.INITIAL_ACTIVE_COLOR,
      inactive: this.INITIAL_INACTIVE_COLOR,
      background: this.INITIAL_BACKGROUND_COLOR,
      grid: this.INITIAL_GRID_COLOR,
    };
  }

  set colors(colors) {
    this.$canvas.colors = colors;
  }
}

customElements.define('game-of-life', App);

export default App;
