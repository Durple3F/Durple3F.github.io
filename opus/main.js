import {Game} from "./game.js";
import {render} from "./render.js";
import ControlManager from './controls.js';
import { easeInOutCubic, easeInOutSine, easeOutCubic, loadSprite } from "./util.js"
import { ELEMENTS } from "./elements.js";
import { INSTRUCTIONS, Instruction, createInstructionButton } from "./instructions.js";
import { GLYPHTYPES } from "./glyphs.js";
import { TrackPiece } from "./track.js";
import { loadLocale } from "./locale.js";
import { CAMPAIGNS, showCampaignChapter } from "./campaigns.js";
import { SCENARIOS } from "./scenarios.js";

const FRAMERATE = 60
let tickInterval

const canvas = document.getElementById("screen")
const debug = document.getElementById("debug")
const ctx = canvas.getContext("2d")
const controls = new ControlManager(canvas)

let scenario = SCENARIOS["test"]
let currentCampaign = CAMPAIGNS["base"]
let game = new Game(canvas, controls, scenario)
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
	debug.innerHTML = `d${drawEnd-tickEnd}ms\nt${tickEnd-start}ms`
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
		if (xOffset === -3){
			transform = ""
		}
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

$(document).on("keydown", e => {
	e.preventDefault()
})
$("#playback-stop-button").on("click", () => {
	game.stopSimulation()
})
$("#playback-pause-button").on("click", () => {
	game.stopSimulationAtNextTimestep = true
})
$("#playback-advance-button").on("click", () => {
	if (!game.isPlayingSimulation){
		game.startSimulation()
	}
	game.playbackSpeed = 1
	game.stopSimulationAtNextTimestep = true
})
$("#playback-play-button").on("click", () => {
	if (game.controls.isPressing("Alt")){
		$("#playback-fast-forward-button").click()
	} else {
		if (!game.isPlayingSimulation){
			game.startSimulation()
		}
		game.playbackSpeed = 1
	}
})
$("#playback-fast-forward-button").on("click", () => {
	if (!game.isPlayingSimulation){
		game.startSimulation()
	}
	game.playbackSpeed = 5
})
window.addEventListener("mousemove", e => {
	$("#tooltip").css("top", e.clientY)
	$("#tooltip").css("left", e.clientX)
})

async function loadGame(){
	await loadLocale("./src/locale/en.json", "en")

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
	//Load glyph sprites
	for (let glyphId in GLYPHTYPES){
		let glyph = GLYPHTYPES[glyphId]
		await glyph.load()
	}
	//Load track sprites
	let trackSpriteMap = TrackPiece.spriteMap
	let trackSprites = TrackPiece.sprites
	let trackPromises = []
	for (let spriteName in trackSpriteMap){
		let url = trackSpriteMap[spriteName]
		let p = loadSprite(url)
			.then(img => trackSprites[spriteName] = img)
		trackPromises.push(p)
	}
	await Promise.all(trackPromises)

}

function startLevel(scenario){
	$("#game-menu").fadeOut()
	game = new Game(canvas, controls, scenario)
	clearInterval(tickInterval)
	tickInterval = setInterval(tick, 1000 / FRAMERATE)
}

function startGame(){
	$("#loading-screen").fadeOut()
	showCampaignChapter(currentCampaign, 0)
	$("#level-select-content").find(".level-select-choice").on("click", e => {
		let elem = e.delegateTarget
		let event = $(elem).data("event")
		switch (event.type){
			case "puzzle":
			let scenarioId = event.info.scenarioId
			let scenario = SCENARIOS[scenarioId]
			startLevel(scenario)
			break
		}
	})
}

window.addEventListener("resize", resize)
resize()
loadGame().then(() => startGame())