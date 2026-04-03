import {Game} from "./game.js";
import {render} from "./render.js";
import ControlManager from './controls.js';
import { easeInOutCubic, easeInOutSine, easeOutCubic, ELEMENTS } from "./util"
import { INSTRUCTIONS, Instruction, createInstructionButton } from "./instructions.js";

const FRAMERATE = 60
let tickInterval

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
componentsTab.on("click", () => {
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
		let xOffset = -t * paneWidth - 3
		let transform = `translateX(${xOffset}px)`
		componentsPane.css("transform", transform)
		componentsTab.css("transform", transform)
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

$("#playback-play-button").on("click", () => {
	game.startSimulation()
})
$("#playback-stop-button").on("click", () => {
	game.stopSimulation()
})
window.addEventListener("mousemove", e => {
	$("#tooltip").css("top", e.clientY)
	$("#tooltip").css("left", e.clientX)
})

async function loadGame(){
	//Display instructions
	for (let typeId in INSTRUCTIONS){
		let instructionType = INSTRUCTIONS[typeId]
		if (!instructionType.spriteUrl) continue
		let instruction = new Instruction(instructionType)
		let tag = createInstructionButton(instruction)
		$("#instructions").append(tag)
		tag.on("mousedown", () => {
			let instruction = new Instruction(instructionType)
			game.beginHoldingInstruction(instruction)
		})
	}
	//Load element sprites
	for (let elementId in ELEMENTS){
		let element = ELEMENTS[elementId]
		await element.load()
	}
}

function startGame(){
	window.addEventListener("resize", resize)
	resize()
	$("#loading-screen").fadeOut()
	tickInterval = setInterval(tick, 1000 / FRAMERATE)
}
loadGame().then(() => startGame())