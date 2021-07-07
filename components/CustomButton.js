class CustomButton extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
  }
}

customElements.define('custom-button', CustomButton, { extends: 'button' });

export default CustomButton;
