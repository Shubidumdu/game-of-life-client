(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wasm-game-of-life */ \"./node_modules/wasm-game-of-life/wasm_game_of_life.js\");\n/* harmony import */ var wasm_game_of_life_wasm_game_of_life_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wasm-game-of-life/wasm_game_of_life_bg */ \"./node_modules/wasm-game-of-life/wasm_game_of_life_bg.wasm\");\n\n\n\nconst CELL_SIZE = 10; // px\nconst GRID_COLOR = \"#CCCCCC\";\nconst DEAD_COLOR = \"#FFFFFF\";\nconst ALIVE_COLOR = \"#000000\";\n\n// Construct the universe, and get its width and height.\nconst universe = wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__[\"Universe\"].new();\nconst width = universe.width();\nconst height = universe.height();\n\n// Give the canvas room for all of our cells and a 1px border\n// around each of them.\nconst canvas = document.getElementById(\"game-of-life-canvas\");\ncanvas.height = (CELL_SIZE + 1) * height + 1;\ncanvas.width = (CELL_SIZE + 1) * width + 1;\n\nconst ctx = canvas.getContext(\"2d\");\n\nlet animationId = null;\n\nconst fps = new (class {\n  constructor() {\n    this.fps = document.getElementById(\"fps\");\n    this.frames = [];\n    this.lastFrameTimeStamp = performance.now();\n  }\n\n  render() {\n    // Convert the delta time since the last frame render into a measure\n    // of frames per second.\n    const now = performance.now();\n    const delta = now - this.lastFrameTimeStamp;\n    this.lastFrameTimeStamp = now;\n    const fps = (1 / delta) * 1000;\n\n    // Save only the latest 100 timings.\n    this.frames.push(fps);\n    if (this.frames.length > 100) {\n      this.frames.shift();\n    }\n\n    // Find the max, min, and mean of our 100 latest timings.\n    let min = Infinity;\n    let max = -Infinity;\n    let sum = 0;\n    for (let i = 0; i < this.frames.length; i++) {\n      sum += this.frames[i];\n      min = Math.min(this.frames[i], min);\n      max = Math.max(this.frames[i], max);\n    }\n    let mean = sum / this.frames.length;\n\n    // Render the statistics.\n    this.fps.textContent = `\nFrames per Second:\n         latest = ${Math.round(fps)}\navg of last 100 = ${Math.round(mean)}\nmin of last 100 = ${Math.round(min)}\nmax of last 100 = ${Math.round(max)}\n`.trim();\n  }\n})();\n\nconst isPaused = () => {\n  return animationId === null;\n};\n\nconst playPauseButton = document.getElementById(\"play-pause\");\n\nconst play = () => {\n  playPauseButton.textContent = \"⏸\";\n  renderLoop();\n};\n\nconst pause = () => {\n  playPauseButton.textContent = \"▶\";\n  cancelAnimationFrame(animationId);\n  animationId = null;\n};\n\nplayPauseButton.addEventListener(\"click\", (event) => {\n  if (isPaused()) {\n    play();\n  } else {\n    pause();\n  }\n});\n\nconst renderLoop = () => {\n  // debugger;\n  fps.render();\n  universe.tick();\n  drawGrid();\n  drawCells();\n\n  animationId = requestAnimationFrame(renderLoop);\n};\n\nconst drawGrid = () => {\n  ctx.beginPath();\n  ctx.strokeStyle = GRID_COLOR;\n\n  // Vertical lines.\n  for (let i = 0; i <= width; i++) {\n    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);\n    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);\n  }\n\n  // Horizontal lines.\n  for (let j = 0; j <= height; j++) {\n    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);\n    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);\n  }\n\n  ctx.stroke();\n};\n\nconst getIndex = (row, column) => {\n  return row * width + column;\n};\n\nconst bitIsSet = (n, arr) => {\n  const byte = Math.floor(n / 8);\n  const mask = 1 << n % 8;\n  return (arr[byte] & mask) === mask;\n};\n\nconst drawCells = () => {\n  const cellsPtr = universe.cells();\n\n  // This is updated!\n  const cells = new Uint8Array(wasm_game_of_life_wasm_game_of_life_bg__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer, cellsPtr, (width * height) / 8);\n\n  ctx.beginPath();\n\n  ctx.fillStyle = ALIVE_COLOR;\n  for (let row = 0; row < height; row++) {\n    for (let col = 0; col < width; col++) {\n      const idx = getIndex(row, col);\n      if (!bitIsSet(idx, cells)) continue;\n\n      ctx.fillRect(\n        col * (CELL_SIZE + 1) + 1,\n        row * (CELL_SIZE + 1) + 1,\n        CELL_SIZE,\n        CELL_SIZE,\n      );\n    }\n  }\n\n  ctx.fillStyle = DEAD_COLOR;\n  for (let row = 0; row < height; row++) {\n    for (let col = 0; col < width; col++) {\n      const idx = getIndex(row, col);\n      if (bitIsSet(idx, cells)) continue;\n\n      ctx.fillRect(\n        col * (CELL_SIZE + 1) + 1,\n        row * (CELL_SIZE + 1) + 1,\n        CELL_SIZE,\n        CELL_SIZE,\n      );\n    }\n  }\n\n  ctx.stroke();\n};\n\ncanvas.addEventListener(\"click\", (event) => {\n  const boundingRect = canvas.getBoundingClientRect();\n\n  const scaleX = canvas.width / boundingRect.width;\n  const scaleY = canvas.height / boundingRect.height;\n\n  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;\n  const canvasTop = (event.clientY - boundingRect.top) * scaleY;\n\n  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);\n  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);\n\n  universe.toggle_cell(row, col);\n\n  drawGrid();\n  drawCells();\n});\n\ndrawGrid();\ndrawCells();\nplay();\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

}]);