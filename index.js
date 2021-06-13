import { Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import * as THREE from "three";
import "normalize.css";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

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

const canvas = document.querySelector("#game-of-life-canvas");
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 256;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setY(64);

controls.update();

const scene = new THREE.Scene();

renderer.render(scene, camera);

const geometry = new THREE.BoxGeometry(1, 0, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });

const getIndex = (row, column) => {
  return row * width + column;
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

// const cube = new THREE.Mesh(geometry, material);
// cube.position.set(0.5, 0, 0.5);

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (bitIsSet(idx, cells)) continue;

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(row - 32 + 0.5, 0, col - 32 + 0.5);
      scene.add(cube);
    }
  }
};

function render(time) {
  time *= 0.001; // convert time to seconds

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

const GRID_SIZE = 64;
const GRID_DIVISIONS = 64;

const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS);
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.8;

{
  drawCells();
  const color = 0xffffff;
  const intensity = 1;
  const light1 = new THREE.DirectionalLight(color, intensity);
  light1.position.set(0, 2, 4);
  scene.add(light1, gridHelper);
}
