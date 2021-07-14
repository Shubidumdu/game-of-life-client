import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  bitIsSet,
  getIndex,
  resizeRendererToDisplaySize,
  stringToHex,
} from '../utils';
import * as THREE from 'three';
class GameCanvas extends HTMLElement {
  size;
  colors;
  renderer;
  camera;
  controls;
  scene;
  geometry;
  materials;
  gridHelper;
  light;
  $Canvas;

  constructor({ colors }) {
    super();
    this.colors = colors;
    this.size = 64;
    this.innerHTML = `
      <canvas id="game-of-life-canvas"></canvas>
    `;
    this.$Canvas = this.querySelector('canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.$Canvas });
    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1024);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(48, 36);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(stringToHex(colors.background));
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.light.position.set(0, 2, 0);
    this.materials = {
      active: new THREE.MeshPhysicalMaterial({
        color: stringToHex(colors.active),
      }),
      inactive: new THREE.MeshPhysicalMaterial({
        color: stringToHex(colors.inactive),
      }),
      cursor: new THREE.MeshPhysicalMaterial({
        color: stringToHex(colors.active),
        opacity: 0.6,
        transparent: true,
      }),
    };
    this.gridHelper = new THREE.GridHelper(64, 64, colors.grid, colors.grid);
    this.scene.add(this.light, this.gridHelper);
  }

  connectedCallback() {
    this.controls.update();
  }

  setColor = (type, hex) => {
    this.colors[type] = hex;
    switch (type) {
      case 'active': {
        this.materials.active.color.setHex(hex);
        this.materials.cursor.color.setHex(hex);
      }
      case 'inactive': {
        this.materials.inactive.color.setHex(hex);
      }
      case 'background': {
        this.scene.background = new THREE.Color(hex);
      }
      case 'grid': {
        this.gridHelper.remove();
        this.gridHelper = new THREE.GridHelper(this.size, this.size, hex, hex);
        this.scene.add(this.gridHelper);
      }
    }
  };

  drawCells = (time, cells) => {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);
        if (!bitIsSet(idx, cells)) continue;
        const exist = this.scene.children.find(
          (child) => child.col === col && child.row === row,
        );
        if (exist) this.scene.remove(exist);
        const cube = new THREE.Mesh(geometry, activeMaterial);
        cube.position.set(row - width / 2 + 0.5, 0.5, col - height / 2 + 0.5);
        cube.startAt = time;
        cube.row = row;
        cube.col = col;
        this.scene.add(cube);
      }
    }
  };

  waveCells = (time) => {
    this.scene.children.forEach((child) => {
      if (child.type === 'Mesh') {
        if (time - child.startAt < 1) {
          child.material = this.materials.inactive;
          child.scale.setY(Math.sin((time - child.startAt) * Math.PI));
          child.position.setY(Math.sin((time - child.startAt) * Math.PI) / 2);
        } else {
          scene.remove(child);
        }
      }
    });
  };

  resize = () => {
    if (resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
  };

  render = () => {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}

customElements.define('game-canvas', GameCanvas);

export default GameCanvas;
