import { Universe } from '@shubidumdu/wasm-game-of-life';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class GameCanvas extends HTMLElement {
  universe = Universe.new();
  width = universe.width();
  height = universe.height();
  renderer;
  camera;
  $canvas;

  constructor() {
    super();
    this.innerHTML = `
      <canvas id="game-of-life-canvas"></canvas>
    `;
    this.$canvas = this.querySelector('#game-of-life-canvas');
    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1024);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.setY(48);
    this.camera.position.setZ(36);
    this.controls.update();
    this.scene = new THREE.Scene();
  }

  set colors({ active, inactive, background, grid }) {}
}

customElements.define('game-canvas', GameCanvas);

export default GameCanvas;
