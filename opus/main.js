import {Game} from "./game.js";
import {render} from "./render.js";
import ControlManager from './controls.js';

const FRAMERATE = 60

const canvas = document.getElementById("screen")
const debug = document.getElementById("debug")
const ctx = canvas.getContext("2d")
const controls = new ControlManager()

const game = new Game(canvas, controls)
console.log(game)

const resize = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	window.requestAnimationFrame(draw)
	game.resizeScreen()
}
window.addEventListener("resize", resize)
resize()

function draw(){
	render(game, ctx, canvas.width, canvas.height)
}
function tick(){
	const start = performance.now()
	game.tick()
	const tickEnd = performance.now()
	draw()
	const drawEnd = performance.now()
	debug.innerHTML = `${drawEnd-tickEnd}ms\n${tickEnd-start}ms`
}
let tickInterval = setInterval(tick, 1000 / FRAMERATE)