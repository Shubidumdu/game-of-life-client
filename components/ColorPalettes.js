class ColorPalettes extends HTMLElement {
  activeColor = '#D54B3F';
  inactiveColor = '#D2CFA6';
  backgroundColor = '#1D383D';
  gridColor = '#FDF8F5';

  constructor() {
    super();
    this.innerHTML = `
      <div class="color-wrap">
        <input type="color" id="active-color" value=${this.activeColor} ></input>
        <input type="color" id="inactive-color" value=${this.inactiveColor} ></input>
        <input type="color" id="background-color" value=${this.backgroundColor} ></input>
        <input type="color" id="grid-color" value=${this.gridColor} ></input>
      </div>
    `;
  }
}

customElements.define('color-palettes', ColorPalettes);

export default ColorPalettes;
