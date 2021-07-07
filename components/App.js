class App extends HTMLElement {
  activeColor = '#D54B3F';
  inactiveColor = '#D2CFA6';
  backgroundColor = '#1D383D';
  gridColor = '#FDF8F5';

  contructor() {
    super();
    this.innerHTML = `
    <a
      href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
      target="_blank"
      rel="noreferrer noopener"
      ><button id="help-button">?</button></a
    >
    <canvas id="game-of-life-canvas"></canvas>
    <div class="color-wrap">
      <input type="color" id="active-color" />
      <input type="color" id="inactive-color" />
      <input type="color" id="background-color" />
      <input type="color" id="grid-color" />
    </div>
    <div id="vertical-button-wrap">
      <button id="stop-button">START</button>
      <button id="reset-button">RESET</button>
      <button id="resize-button">RESIZE</button>
      <button id="random-button">RANDOM</button>
    </div>
    `;
  }
}

customElements.define('game-of-life', App);

export default App;
