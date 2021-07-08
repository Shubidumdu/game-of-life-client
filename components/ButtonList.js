class ButtonList extends HTMLElement {
  $stopButton;
  $resetButton;
  $resizeButton;
  $randomButton;

  constructor() {
    super();
    this.innerHTML = `
    <div id="vertical-button-wrap">
      <button id="stop-button">START</button>
      <button id="reset-button">RESET</button>
      <button id="resize-button">RESIZE</button>
      <button id="random-button">RANDOM</button>
    </div>
    `;
    this.$stopButton = this.querySelector('#stop-button');
    this.$resetButton = this.querySelector('#reset-button');
    this.$resizeButton = this.querySelector('#resize-button');
    this.$randomButton = this.querySelector('#random-button');
  }
}
