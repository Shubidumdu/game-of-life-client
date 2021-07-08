class ColorInputs extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div class="color-wrap">
      <input type="color" id="active-color" />
      <input type="color" id="inactive-color" />
      <input type="color" id="background-color" />
      <input type="color" id="grid-color" />
    </div>
    `;
  }

  connectedCallback = () => {
    this.addEventListener('change', _onChangeColor);
  };

  _onChangeColor = (e) => {
    this.dispatchEvent(
      new CustomeEvent(`color-change`, {
        bubbles: true,
        detail: {
          type: e.target.id,
          color: e.target.value,
        },
      }),
    );
  };
}

customElements.define('color-inputs', ColorInputs);

export default ColorInputs;
