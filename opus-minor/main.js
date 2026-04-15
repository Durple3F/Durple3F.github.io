import {Game} from "./game.js";
import {render} from "./render.js";
import ControlManager from './controls.js';
import { easeInOutSine, loadSprite } from "./util.js"
import { ELEMENTS } from "./elements.js";
import { INSTRUCTIONS, Instruction, createInstructionButton } from "./instructions.js";
import { GLYPHTYPES } from "./glyphs.js";
import { TrackPiece } from "./track.js";
import { loadLocale } from "./locale.js";
import { CAMPAIGNS, showCampaignChapter, showOptions, showScenario } from "./campaigns.js";
import { SCENARIOS } from "./scenarios.js";
import { createSaveFile, getSaveFiles, openDatabase, SaveFile, saveSaveFile } from "./database.js";
import { changeCategoryVolume, loadNeededSounds, playSound } from "./sounds.js";

const FRAMERATE = 60
let tickInterval

const canvas = document.getElementById("screen")
const debug = document.getElementById("debug")
const ctx = canvas.getContext("2d")
const controls = new ControlManager(canvas)

let saveFiles = []
let saveFile

let scenario = SCENARIOS["test"]
let currentCampaign = CAMPAIGNS["base"]
let currentCampaignChapterIndex = 0
let game

const resize = () => {
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	if (game){
		game.resizeScreen()
	}
	window.requestAnimationFrame(draw)
}

function draw(){
	if (!game) return
	render(game, ctx, canvas.width, canvas.height)
}
function tick(){
	if (game && game.isActive){
		const start = performance.now()
		game.tick()
		const tickEnd = performance.now()
		draw()
		const drawEnd = performance.now()
		debug.innerHTML = `d${drawEnd-tickEnd}ms\nt${tickEnd-start}ms`
	}
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
	if (e.originalEvent.key === "Tab"){
		e.preventDefault()
	}
})
$("#playback-stop-button").on("click", () => {
	game.stopSimulation()
})
$("#playback-pause-button").on("click", () => {
	game.stopSimulationAtNextTimeStep = true
})
$("#playback-advance-button").on("click", () => {
	if (!game.isPlayingSimulation){
		game.startSimulation()
	}
	if (!game.stopSimulationAtNextTimeStep){
		game.playbackSpeed = 1
		game.stopSimulationAtNextTimeStep = true
		game.stopSimulationAtTimeStep = game.simulationTimeStep + 1
	} else {
		game.simulationDeltaT += 1
		if (game.simulationDeltaT % 1 > 0.2){
			game.simulationDeltaT -= (game.simulationDeltaT % 1) - 0.2
		}
		game.stopSimulationAtTimeStep += 1
	}
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
//Hide modal noise
$("#modal").on("click", e => {
	if (e.target !== $("#modal")[0]) return
	playSound("ui_modal_close")
})

async function loadGame(){
	await loadLocale("./src/locale/en.json", "en")
	await openDatabase()
	saveFiles = await getSaveFiles()
	if (!saveFiles.length){
		let saveFile = await createSaveFile("You")
		saveFiles.push(saveFile)
	}
	saveFile = saveFiles[0]

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

	//Load sound effects
	await loadNeededSounds()

	saveFile.initializeCampaigns()
	
	//set settings
	for (let categoryName in saveFile.settings.sounds){
		changeCategoryVolume(categoryName, saveFile.settings.sounds[categoryName], saveFile)
	}
}

function startLevel(scenario, solution){
	$("#game-menu").fadeOut()
	game = new Game(canvas, controls, scenario, solution)
	clearInterval(tickInterval)
	tickInterval = setInterval(tick, 1000 / FRAMERATE)

	console.log(solution)

	game.promise.then(events => {
		game.isActive = false
		handleGameEvents(events)
	})
}

async function handleGameEvents(events){
	for (let event of events){
		switch (event.type){
			case "change-scene": {
				let scene = event.val
				switch (scene){
					case "level-select": {
						$("#game-menu").fadeIn()
						switchCampaignChapter(currentCampaign, currentCampaignChapterIndex)
					} break
				}
			} break
			case "set-completion": {
				let scenarioId = event.scenario.id
				let campaignId = currentCampaign.id
				let progress = saveFile.campaignsProgress[campaignId]
				let targetState = event.completed
				let curState = progress.events[scenarioId].completed
				if (targetState !== curState){
					progress.events[scenarioId].completed = targetState
					saveSaveFile(saveFile)
				}
			} break
			case "open-level": {
				let scenario = event.scenario
				let solution = event.solution
				startLevel(scenario, solution)
			} break
		}
	}
}

function switchCampaignChapter(campaign, chapterIndex){
	currentCampaignChapterIndex = chapterIndex
	showCampaignChapter(campaign, chapterIndex, saveFile)
	$("#level-select-content").find(".level-select-choice").on("click", e => {
		let elem = e.delegateTarget
		let event = $(elem).data("event")
		switch (event.type){
			case "puzzle":
			let scenarioId = event.info.scenarioId
			let scenario = SCENARIOS[scenarioId]
			showScenario(scenario, campaign, saveFile).then(events => {
				handleGameEvents(events)
			})
			// startLevel(scenario)
			break
		}
	})

	let chapter = campaign.chapters[chapterIndex]
	let progress = saveFile.campaignsProgress[campaign.id]
	//Do the little unlock animation for each of the things that should unlock
	let shouldUnlock = saveFile.getNewCampaignUnlocks(campaign.id)
	.filter(eventId => chapter.events.some(event => event.id === eventId))
	let unlocks = 0
	for (let eventId of shouldUnlock){
		let tag = $("#level-select-content").find(`.level-select-choice[data-event-id="${eventId}"]`)
		unlocks++
		let ms = 500 * unlocks
		setTimeout(() => {
			tag.removeClass("locked")
			playSound("ui_unlock")
		}, ms)
		progress.events[eventId].unlocked = true
	}
	if (unlocks > 0){
		saveSaveFile(saveFile)
	}
	
	let chapterTags = $("#level-select-chapter-container").find(".level-select-chapter")
	chapterTags.on("click", e => {
		let tag = $(e.delegateTarget)
		let newIndex = tag.data("chapterIndex")
		if (newIndex === chapterIndex) return
		switchCampaignChapter(campaign, newIndex)
	})
}

function openMenu(){
	showOptions(saveFile)
}

$("#options-container").on("click", openMenu)

function startGame(){
	$("#loading-screen").fadeOut()
	switchCampaignChapter(currentCampaign, 0)
}

window.addEventListener("resize", resize)
resize()
loadGame().then(() => startGame())