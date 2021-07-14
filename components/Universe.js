import { Universe } from '@shubidumdu/wasm-game-of-life';

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

export default universe;
