import { Universe } from '@shubidumdu/wasm-game-of-life';
import { memory } from '@shubidumdu/wasm-game-of-life/wasm_game_of_life_bg';
import * as THREE from 'three';
import 'normalize.css';
import './index.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const hexStringToHex = (str) => parseInt(str.replace(/^#/, ''), 16);

let isStop = true;

const INITIAL_ACTIVE_COLOR = '#D54B3F';
const INITIAL_INACTIVE_COLOR = '#D2CFA6';
const INITIAL_BACKGROUND_COLOR = '#1D383D';
const INITIAL_GRID_COLOR = '#FDF8F5';

let universe = Universe.new();
let width = universe.width();
let height = universe.height();
const activeColor = document.querySelector('#active-color');
activeColor.value = INITIAL_ACTIVE_COLOR;
const inactiveColor = document.querySelector('#inactive-color');
inactiveColor.value = INITIAL_INACTIVE_COLOR;
const backgroundColor = document.querySelector('#background-color');
backgroundColor.value = INITIAL_BACKGROUND_COLOR;
const gridColor = document.querySelector('#grid-color');
gridColor.value = INITIAL_GRID_COLOR;
const stopBtn = document.querySelector('#stop-button');
const resetBtn = document.querySelector('#reset-button');
const resizeBtn = document.querySelector('#resize-button');
const randomBtn = document.querySelector('#random-button');

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
const far = 1024;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setY(48);
camera.position.setZ(36);

controls.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color(hexStringToHex(INITIAL_BACKGROUND_COLOR));

renderer.render(scene, camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const activeMaterial = new THREE.MeshPhysicalMaterial({
  color: hexStringToHex(INITIAL_ACTIVE_COLOR),
});
const inactiveMaterial = new THREE.MeshPhysicalMaterial({
  color: hexStringToHex(INITIAL_INACTIVE_COLOR),
});
const cursorMaterial = new THREE.MeshPhysicalMaterial({
  color: hexStringToHex(INITIAL_ACTIVE_COLOR),
  opacity: 0.6,
  transparent: true,
});

activeColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  activeMaterial.color.setHex(hex);
  cursorMaterial.color.setHex(hex);
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

let gridHelper = new THREE.GridHelper(
  GRID_SIZE,
  GRID_DIVISIONS,
  INITIAL_GRID_COLOR,
  INITIAL_GRID_COLOR,
);

gridColor.addEventListener('change', (e) => {
  const hex = hexStringToHex(e.target.value);
  gridHelper.remove();
  gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, hex, hex);
  scene.add(gridHelper);
});

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
light.position.set(0, 2, 0);

const drawCells = (time) => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (!bitIsSet(idx, cells)) continue;
      const exist = scene.children.find(
        (child) => child.col === col && child.row === row,
      );
      if (exist) scene.remove(exist);
      const cube = new THREE.Mesh(geometry, activeMaterial);
      cube.position.set(row - width / 2 + 0.5, 0.5, col - height / 2 + 0.5);
      cube.startAt = time;
      cube.row = row;
      cube.col = col;
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

scene.add(light, gridHelper);
animationId = requestAnimationFrame(renderWithStop);

stopBtn.addEventListener('click', (e) => {
  if (isStop) {
    isStop = false;
    e.target.textContent = 'STOP';
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(render);
  } else {
    isStop = true;
    e.target.textContent = 'START';
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(renderWithStop);
  }
});

resetBtn.addEventListener('click', (e) => {
  universe.reset();
  scene.clear();
  scene.add(light, gridHelper);
  renderer.render(scene, camera);
});

resizeBtn.addEventListener('click', (e) => {
  const size = window.prompt('Please enter the size you want. (n >= 3)', width);
  if (!size) return;
  if (isNaN(size)) {
    window.alert('Input value is not a number.');
    return;
  }
  if (size < 3) {
    window.alert('It cannot be smaller than 3.');
    return;
  }
  try {
    universe.resize(size || 64);
    width = size;
    height = size;
    gridHelper = new THREE.GridHelper(
      size,
      size,
      gridColor.value,
      gridColor.value,
    );
    scene.clear();
    scene.add(light, gridHelper);
    renderer.render(scene, camera);
    drawCells(0);
  } catch (err) {}
});

randomBtn.addEventListener('click', (e) => {
  universe.set_height(width);
  scene.clear();
  scene.add(light, gridHelper);
  renderer.render(scene, camera);
  universe.random();
  drawCells(0);
});

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const onMouseMove = (e) => {
  scene.children.forEach((child) => {
    if (child.type === 'cursor') scene.remove(child);
  });
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(gridHelper);
  if (intersects.length > 0) {
    const posX = intersects[0].point.x;
    const posZ = intersects[0].point.z;
    const row =
      parseInt(posX + width / 2) >= width
        ? width - 1
        : parseInt(posX + width / 2);
    const col =
      parseInt(posZ + height / 2) >= height
        ? height - 1
        : parseInt(posZ + height / 2);
    const cube = new THREE.Mesh(geometry, cursorMaterial);
    cube.position.set(row - width / 2 + 0.5, 0.5, col - height / 2 + 0.5);
    cube.type = 'cursor';
    scene.add(cube);
  }
};

const makeThunk = (row, col) => {
  return function setCellIfNoMovement(e) {
    if (mouse.moveX < 5 && mouse.moveY < 5) {
      const exist = scene.children.find(
        (child) => child.row === row && child.col === col,
      );
      universe.toggle_cell(row, col);
      if (exist) scene.remove(exist);
      drawCells(0);
    }
    window.removeEventListener('pointermove', recordMovement);
    window.removeEventListener('pointerup', setCellIfNoMovement);
  };
};

const onMouseClick = (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(gridHelper);
  if (intersects.length > 0) {
    const posX = intersects[0].point.x;
    const posZ = intersects[0].point.z;
    const row =
      parseInt(posX + width / 2) >= width
        ? width - 1
        : parseInt(posX + width / 2);
    const col =
      parseInt(posZ + height / 2) >= height
        ? height - 1
        : parseInt(posZ + height / 2);
    const setCellIfNoMovement = makeThunk(row, col);
    recordStartPosition(e);
    window.addEventListener('pointermove', recordMovement);
    window.addEventListener('pointerup', setCellIfNoMovement);
  }
};

const mouse = {
  x: 0,
  y: 0,
};

function recordStartPosition(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.moveX = 0;
  mouse.moveY = 0;
}
function recordMovement(event) {
  mouse.moveX += Math.abs(mouse.x - event.clientX);
  mouse.moveY += Math.abs(mouse.y - event.clientY);
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('pointerdown', onMouseClick);
