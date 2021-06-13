(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./index.css":
/*!*******************!*\
  !*** ./index.css ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/css-loader/dist/cjs.js!./index.css */ \"./node_modules/css-loader/dist/cjs.js!./index.css\");\n\n            \n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__[\"default\"], options);\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__[\"default\"].locals || {});\n\n//# sourceURL=webpack:///./index.css?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! normalize.css */ \"./node_modules/normalize.css/normalize.css\");\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.css */ \"./index.css\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n\n\n\n\n\nfunction resizeRendererToDisplaySize(renderer) {\n  const canvas = renderer.domElement;\n  const pixelRatio = window.devicePixelRatio;\n  const width = (canvas.clientWidth * pixelRatio) | 0;\n  const height = (canvas.clientHeight * pixelRatio) | 0;\n  const needResize = canvas.width !== width || canvas.height !== height;\n  if (needResize) {\n    renderer.setSize(width, height, false);\n  }\n  return needResize;\n}\n\nconst canvas = document.querySelector(\"#game-of-life-canvas\");\nconst renderer = new three__WEBPACK_IMPORTED_MODULE_0__[\"WebGLRenderer\"]({ canvas });\n\nconst fov = 75;\nconst aspect = 2;\nconst near = 0.1;\nconst far = 256;\nconst camera = new three__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"](fov, aspect, near, far);\n\nconst controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_3__[\"OrbitControls\"](camera, renderer.domElement);\n\ncamera.position.setY(64);\n\ncontrols.update();\n\nconst scene = new three__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\n\nrenderer.render(scene, camera);\n\nfunction render(time) {\n  time *= 0.001; // convert time to seconds\n\n  if (resizeRendererToDisplaySize(renderer)) {\n    const canvas = renderer.domElement;\n    camera.aspect = canvas.clientWidth / canvas.clientHeight;\n    camera.updateProjectionMatrix();\n  }\n\n  controls.update();\n\n  renderer.render(scene, camera);\n\n  requestAnimationFrame(render);\n}\nrequestAnimationFrame(render);\n\nconst GRID_SIZE = 64;\nconst GRID_DIVISIONS = 64;\n\nconst gridHelper = new three__WEBPACK_IMPORTED_MODULE_0__[\"GridHelper\"](GRID_SIZE, GRID_DIVISIONS);\ngridHelper.material.transparent = true;\ngridHelper.material.opacity = 0.8;\n\nconst geometry = new three__WEBPACK_IMPORTED_MODULE_0__[\"BoxGeometry\"](1, 0, 1);\nconst material = new three__WEBPACK_IMPORTED_MODULE_0__[\"MeshBasicMaterial\"]({ color: 0x44aa88 });\nconst cube = new three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](geometry, material);\ncube.position.set(0.5, 0, -0.5);\n\n{\n  const color = 0xffffff;\n  const intensity = 1;\n  const light1 = new three__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](color, intensity);\n  light1.position.set(0, 2, 4);\n  scene.add(light1, gridHelper, cube);\n}\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./index.css":
/*!*********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./index.css ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n// Imports\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});\n// Module\n___CSS_LOADER_EXPORT___.push([module.i, \"html, \\nbody {\\n    height: 100%;\\n}\\n\\n#fps {\\n  white-space: pre;\\n  font-family: monospace;\\n}\\n\\n#game-of-life-canvas {\\n  width: 100%;\\n  height: 100%; /* Fallback for browsers that do not support Custom Properties */\\n  /* height: calc(var(--vh, 1vh) * 100); */\\n}\\n\\n\", \"\"]);\n// Exports\n/* harmony default export */ __webpack_exports__[\"default\"] = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack:///./index.css?./node_modules/css-loader/dist/cjs.js");

/***/ })

}]);