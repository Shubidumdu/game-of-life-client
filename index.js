import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import * as THREE from 'three';
import 'normalize.css';
import './index.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const hexStringToHex = (str) => parseInt(str.replace(/^#/, ''), 16);

let isStop = false;

const INITIAL_ACTIVE_COLOR = '#FFFFFF';
const INITIAL_INACTIVE_COLOR = '#000000';
const INITIAL_BACKGROUND_COLOR = '#000000';
const INITIAL_GRID_COLOR = '#888888';

const universe = Universe.new();
const width = universe.width();
const height = universe.height();
const activeColor = document.querySelector('#active-color');
activeColor.value = INITIAL_ACTIVE_COLOR;
const inactiveColor = document.querySelector('#inactive-color');
inactiveColor.value = INITIAL_INACTIVE_COLOR;
const backgroundColor = document.querySelector('#background-color');
backgroundColor.value = INITIAL_BACKGROUND_COLOR;
const gridColor = document.querySelector('#grid-color');
gridColor.value = INITIAL_GRID_COLOR;
const stopBtn = document.querySelector('#stop-button');

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
camera.position.setZ(36);

controls.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

renderer.render(scene, camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const activeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
const inactiveMaterial = new THREE.MeshPhysicalMaterial({ color: 0x444444 });

activeColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  activeMaterial.color.setHex(hex);
});

inactiveColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  inactiveMaterial.color.setHex(hex);
});

backgroundColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  scene.background = new THREE.Color(hex);
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

const gridHelper = new THREE.GridHelper(
  GRID_SIZE,
  GRID_DIVISIONS,
  INITIAL_GRID_COLOR,
  INITIAL_GRID_COLOR,
);

gridColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  gridHelper.remove();
  const newGridHelper = new THREE.GridHelper(
    GRID_SIZE,
    GRID_DIVISIONS,
    hex,
    hex,
  );
  scene.add(newGridHelper);
});

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

let animationId = null;

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
  animationId = requestAnimationFrame(render);
}

function renderWithStop(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  controls.update();
  renderer.render(scene, camera);
  animationId = requestAnimationFrame(renderWithStop);
}

drawCells(0);

animationId = requestAnimationFrame(render);

stopBtn.addEventListener('click', (e) => {
  if (isStop) {
    isStop = false;
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(render);
  } else {
    isStop = true;
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(renderWithStop);
  }
});

console.log(scene);
