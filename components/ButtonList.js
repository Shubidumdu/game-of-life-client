class ButtonList extends HTMLElement {
  $stopButton;
  $resetButton;
  $resizeButton;
  $randomButton;

  constructor() {
    super();
    this.innerHTML = `
    <div id="vertical-button-wrap">
      <button is='custom-button" id="stop-button">START</button>
      <button is='custom-button" id="reset-button">RESET</button>
      <button is='custom-button" id="resize-button">RESIZE</button>
      <button is='custom-button" id="random-button">RANDOM</button>
    </div>
    `;
    this.$stopButton = this.querySelector('#stop-button');
    this.$resetButton = this.querySelector('#reset-button');
    this.$resizeButton = this.querySelector('#resize-button');
    this.$randomButton = this.querySelector('#random-button');
  }
}
