import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import * as THREE from 'three';
import 'normalize.css';
import './index.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const INITIAL_ACTIVE_COLOR = '#FFFFFF';
const INITIAL_INACTIVE_COLOR = '#000000';

const universe = Universe.new();
const width = universe.width();
const height = universe.height();
const activeColor = document.querySelector('#active-color');
activeColor.value = INITIAL_ACTIVE_COLOR;
const inactiveColor = document.querySelector('#inactive-color');
inactiveColor.value = INITIAL_INACTIVE_COLOR;

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const canvas = document.querySelector('#game-of-life-canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 256;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setY(48);

controls.update();

const scene = new THREE.Scene();

renderer.render(scene, camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const activeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
const inactiveMaterial = new THREE.MeshPhysicalMaterial({ color: 0x444444 });

activeColor.addEventListener('change', (e) => {
  const hex = parseInt(e.target.value.replace(/^#/, ''), 16);
  activeMaterial.color.setHex(hex);
});

inactiveColor.addEventListener('change', (e) => {
  const hex = parseInt(e.target.value.replace(/^#/, ''), 16);
  inactiveMaterial.color.setHex(hex);
});

const getIndex = (row, column) => {
  return row * width + column;
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

const GRID_SIZE = 64;
const GRID_DIVISIONS = 64;

const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS);
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.5;

const color = 0xffffff;
const intensity = 1;
const light1 = new THREE.DirectionalLight(color, intensity);
light1.position.set(0, 2, 4);

const drawCells = (time) => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (!bitIsSet(idx, cells)) continue;
      const cube = new THREE.Mesh(geometry, activeMaterial);
      cube.position.set(row - 32 + 0.5, 0.5, col - 32 + 0.5);
      cube.startAt = time;
      scene.add(cube);
    }
  }
};

function render(time) {
  time *= 0.005; // convert time to seconds
  universe.tick();
  scene.children.forEach((child) => {
    if (child.type === 'Mesh') {
      if (time - child.startAt < 1) {
        child.material = inactiveMaterial;
        child.scale.setY(Math.sin((time - child.startAt) * Math.PI));
        child.position.setY(Math.sin((time - child.startAt) * Math.PI) / 2);
      } else {
        scene.remove(child);
      }
    }
  });
  // scene.remove.apply(scene, scene.children);
  scene.add(light1, gridHelper);
  drawCells(time);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

drawCells(0);

console.log(scene);
