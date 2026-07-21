import {Game} from "./game.js"
import { render } from "./render.js";
import {ControlManager} from './controls.js';
import { framesPerSecond } from './config.js';
import $ from 'jquery'

const controls = new ControlManager()
let game : Game

const screen = document.getElementById("screen")! as HTMLCanvasElement
const bgScreen = document.getElementById("bg")! as HTMLCanvasElement

const frameTimes = {
	records: [] as number[],
	avg: 0,
	min: 0,
	max: 0
}
function animate() {
	let start = performance.now()
	if (game){
		game.tick()
	}

	render(game)
	let end = performance.now()
	frameTimes.records.push(end - start)
	let len = frameTimes.records.length
	if (len > 1000){
		frameTimes.records.splice(0, 100)
	}
	if (len % 10 === 0){
		let records = frameTimes.records
		let min = Infinity
		let max = 0
		let sum = 0
		for (let record of records){
			sum += record
			min = min < record ? min : record
			max = max > record ? max : record
		}
		frameTimes.avg = sum / len
		frameTimes.min = min
		frameTimes.max = max
		let avgText = frameTimes.avg.toFixed(2)
		let text = `${avgText}ms, ${frameTimes.min}ms, ${frameTimes.max}ms`
		$("#frameStats").html(text)
	}

}

const resize = () => {
	game?.resizeWindow()
}
window.addEventListener("resize", resize)

const start = async () => {
	game = new Game(controls, screen, bgScreen)
	game.startTicks(framesPerSecond)
	resize()
	setInterval(animate, framesPerSecond)
}
start()