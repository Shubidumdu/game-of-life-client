import * as THREE from "three";
import "normalize.css";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 2;
controls.update();

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.PlaneGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

renderer.render(scene, camera);

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

{
  const color = 0xffffff;
  const intensity = 1;
  const light1 = new THREE.DirectionalLight(color, intensity);
  const light2 = new THREE.DirectionalLight(color, intensity);
  light1.position.set(0, 0, 4);
  light2.position.set(0, 0, -4);
  scene.add(light1, light2);
}
