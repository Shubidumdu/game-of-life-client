class ColorPalettes extends HTMLElement {
  constructor({ colors }) {
    super();
    this.innerHTML = `
      <div class="color-wrap">
        <input type="color" id="active" value=${colors.active} ></input>
        <input type="color" id="inactive" value=${colors.inactive} ></input>
        <input type="color" id="background" value=${colors.background} ></input>
        <input type="color" id="grid" value=${colors.grid} ></input>
      </div>
    `;
    this.addEventListener('change', this._onChangeColor);
  }

  _onChangeColor = (e) => {
    this.dispatchEvent(
      new CustomEvent('change-color', {
        bubbles: true,
        detail: {
          type: e.target.id,
          color: e.target.value,
        },
      }),
    );
  };
}

customElements.define('color-palettes', ColorPalettes);

export default ColorPalettes;
