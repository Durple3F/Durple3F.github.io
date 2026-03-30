import {Game} from "./game.js";
import {render} from "./render.js";
import ControlManager from './controls.js';
import { easeInOutCubic, easeInOutSine, easeOutCubic } from "./util"

const FRAMERATE = 60

const canvas = document.getElementById("screen")
const debug = document.getElementById("debug")
const ctx = canvas.getContext("2d")
const controls = new ControlManager(canvas)

const game = new Game(canvas, controls)
console.log(game)

const resize = () => {
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	game.resizeScreen()
	window.requestAnimationFrame(draw)
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


const componentsPane = $("#components")
const componentsTab = $("#components-tab")
componentsTab.click(() => {
	let target = "closed"
	if (componentsTab.data("closed")){
		target = "open"
		componentsTab.data("closed", false)
	} else {
		componentsTab.data("closed", true)
	}
	const animate = p => {
		if (target === "open") p = 1 - p
		const t = easeInOutSine(p)
		const paneWidth = componentsPane.width()
		const xOffset = -t * paneWidth
		componentsPane.css("transform", `translateX(${xOffset}px)`)
		componentsTab.css("transform", `translateX(${xOffset}px)`)
		$(canvas).width(window.innerWidth - paneWidth - xOffset)
		
		canvas.width = canvas.clientWidth
		canvas.height = canvas.clientHeight
		game.resizeScreen()
		window.requestAnimationFrame(draw)
	}
	$({ val: 0 }).animate({ val: 1 }, {
		duration: 100,
		easing: "linear",
		step: animate,
		complete: () => animate(1)
	})
})

let tickInterval = setInterval(tick, 1000 / FRAMERATE)