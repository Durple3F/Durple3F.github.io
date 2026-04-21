import {Game} from "./game.js";
import {render, renderEffects} from "./render.js";
import ControlManager from './controls.js';
import { BONDTYPES, clearModal, easeInOutSine } from "./util.js"
import { loadNeededSprites, loadSprite } from "./sprites.js";
import { ELEMENTS } from "./elements.js";
import { INSTRUCTIONS, Instruction, createInstructionButton } from "./instructions.js";
import { GLYPHTYPES } from "./glyphs.js";
import { TrackPiece } from "./track.js";
import { loadLocale } from "./locale.js";
import { CAMPAIGNS, showCampaignChapter, showOptions, showScenario } from "./campaigns.js";
import { SCENARIOS } from "./scenarios.js";
import { createSaveFile, getSaveFiles, openDatabase, SaveFile, saveSaveFile } from "./database.js";
import { changeCategoryVolume, loadNeededSounds, playSound } from "./sounds.js";
import { Cinematic, STORIES } from "./story.js";

const FRAMERATE = 60
let tickInterval

const canvas = document.getElementById("screen")
const canvas2 = document.getElementById("screen-effects")
const debug = document.getElementById("debug")
const ctx = canvas.getContext("2d")
const ctx2 = canvas2.getContext("2d")
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
	canvas2.width = canvas2.clientWidth
	canvas2.height = canvas2.clientHeight
	if (game){
		game.resizeScreen()
	}
	window.requestAnimationFrame(draw)
}

function draw(){
	if (!game) return
	render(game, ctx, canvas.width, canvas.height)
	renderEffects(game, ctx2, canvas2.width, canvas2.height)
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

$(document).on("mousedown", e => {
	if (e.originalEvent.button === 2){
		e.preventDefault()
	}
})
$(document).on("contextmenu", e => {
	e.preventDefault()
})
$(document).on("keydown", e => {
	if (e.originalEvent.key === "Tab"){
		e.preventDefault()
	}
	if (e.originalEvent.key === "Alt"){
		$("#program-rows-wrapper").addClass("ready-fast-forward")
		e.preventDefault()
	}
})
$(document).on("keyup", e => {
	if (e.originalEvent.key === "Alt"){
		$("#program-rows-wrapper").removeClass("ready-fast-forward")
		e.preventDefault()
	}
})
$("#playback-stop-button").on("click", () => {
	playSound("sim_stop")
	game.stopSimulation()
})
$("#playback-pause-button").on("click", () => {
	playSound("sim_stop")
	game.stopSimulationAtNextTimeStep = true
})
$("#playback-advance-button").on("click", () => {
	playSound("sim_step")
	if (!game.isPlayingSimulation){
		game.startSimulation()
	}
	if (!game.stopSimulationAtNextTimeStep){
		game.playbackSpeed = 1
		game.stopSimulationAtNextTimeStep = true
		game.stopSimulationAtTimeStep = game.simulationTimeStep
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
			playSound("sim_start")
			game.startSimulation()
		}
		game.playbackSpeed = 1
	}
})
$("#playback-fast-forward-button").on("click", () => {
	if (!game.isPlayingSimulation){
		playSound("sim_start")
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

function pickSaveFile(save){
	saveFile = save
	saveFile.lastOpenDate = new Date()
}

async function loadGame(){
	await loadLocale("./src/locale/en.json", "en")
	await openDatabase()

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

	//Load sprites the game needs
	await loadNeededSprites()

	//Load element sprites
	for (let elementId in ELEMENTS){
		let element = ELEMENTS[elementId]
		await element.load()
	}
	//Load bond sprites
	for (let bondTypeId in BONDTYPES){
		let bondType = BONDTYPES[bondTypeId]
		await bondType.load()
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

	saveFiles = await getSaveFiles()
	if (!saveFiles.length){
		let saveFile = await createSaveFile("You")
		saveFiles.push(saveFile)
	}
	let mostRecent = saveFiles.reduce((acc, v) => acc.lastOpenDate < v.lastOpenDate ? v : acc, saveFiles[0])
	pickSaveFile(mostRecent)
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
				let eventId
				if ("scenario" in event){
					eventId = event.scenario.id
				}
				if ("story" in event){
					eventId = event.story.id
				}
				let campaignId = currentCampaign.id
				let progress = saveFile.campaignsProgress[campaignId]
				let targetState = event.completed
				let curState = progress.events[eventId].completed
				if (targetState !== curState){
					progress.events[eventId].completed = targetState
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

function startEvent(event, campaign, chapterIndex){
	switch (event.type){
		case "puzzle": {
			$(".game-scene").hide()
			$("#game-ui").show()
			let scenarioId = event.info.scenarioId
			let scenario = SCENARIOS[scenarioId]
			showScenario(scenario, campaign, saveFile).then(events => {
				handleGameEvents(events)
			})
		} break
		case "story": {
			console.log(event)
			$(".game-scene").hide()
			$("#story").show()
			$("#game-menu").fadeOut()
			let storyId = event.info.storyId
			let story = STORIES[storyId]
			let cinematic = new Cinematic(story)
			cinematic.advance()
			cinematic.promise.then(events => {
				handleGameEvents(events)
			})
		} break
	}
}

function switchCampaignChapter(campaign, chapterIndex){
	currentCampaignChapterIndex = chapterIndex
	showCampaignChapter(campaign, chapterIndex, saveFile)
	$("#level-select-content").find(".level-select-choice").on("click", e => {
		let elem = e.delegateTarget
		let event = $(elem).data("event")
		startEvent(event, campaign, chapterIndex)
	})

	let chapter = campaign.chapters[chapterIndex]
	let progress = saveFile.campaignsProgress[campaign.id]
	//Do the little unlock animation for each of the things that should unlock
	let allUnlocks = saveFile.getNewCampaignUnlocks(campaign.id)
	let unlockedChapters = allUnlocks.chapters
	let unlockedEvents = allUnlocks.events.filter(eventId => chapter.events.some(event => event.id === eventId))
	let unlocks = 0
	for (let eventId of unlockedEvents){
		let tag = $("#level-select-content").find(`.level-select-choice[data-event-id="${eventId}"]`)
		unlocks++
		let ms = 500 * unlocks
		setTimeout(() => {
			tag.removeClass("locked")
			playSound("ui_unlock")
		}, ms)
		progress.events[eventId].unlocked = true
	}
	for (let chapterId of unlockedChapters){
		let tag = $("#level-select-chapter-container").find(`.level-select-chapter[data-chapter-id="${chapterId}"]`)
		unlocks++
		let ms = 500 * unlocks + 1000
		setTimeout(() => {
			tag.attr("data-unlocked", true)
			playSound("ui_unlock")
		}, ms)
		progress.chapters[chapterId].unlocked = true
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

	saveSaveFile(saveFile)
}

function openMenu(){
	showOptions(saveFile)
}

$("#options-container").on("click", openMenu)

async function openSaveSelector(){
	let modalTag = $("#modal")
	clearModal(modalTag)
	playSound("ui_modal")
	let resolve
	let promise = new Promise(res => resolve = res)

	modalTag.find(".modal-dialog").addClass("modal-dialog-centered").addClass("modal-dialog-scrollable")
	modalTag.find(".modal-title").text("Choose a Save File:").addClass("h2")
	modalTag.find(".modal-header").addClass("justify-content-center")
	modalTag.find(".modal-footer").hide()
	let body = modalTag.find(".modal-body").addClass("save-selector")
	let left = $("<div>").addClass("save-selector-list").appendTo(body)
	let right = $("<div>").addClass("save-selector-info").appendTo(body)

	let saveTagMap = new Map()
	let activeTag = null

	const selectSave = event => {
		let tag = event.target
		if ($(tag).hasClass("active")) return
		let save = saveTagMap.get(tag)
		console.log(save, saveTagMap)
		saveFile = save
		saveFile.initializeCampaigns()
		$(activeTag).removeClass("active")
		$(tag).addClass("active")
		activeTag = tag
	}

	const addButtonFor = save => {
		let tag = $("<div>").addClass("save-file").appendTo(left)
		if (save === saveFile){
			tag.addClass("active")
			activeTag = tag
		}
		let nameTag = $("<div>").addClass("save-file-name").appendTo(tag)
		nameTag.text(save.name)
		let dateTag = $("<div>").addClass("save-file-date").appendTo(tag)
		let dateText = save.lastOpenDate.toLocaleString(language)
		dateTag.text(dateText)
		saveTagMap.set(tag[0], save)
		tag.on("click", selectSave)
	}

	for (let save of saveFiles){
		addButtonFor(save)
	}

	const makeNewSave = async () => {
		let newSaveFile = await createSaveFile("You")
		saveFiles.push(newSaveFile)
		addButtonFor(newSaveFile)
	}

	let newSaveBtn = $("<div>").addClass("new-save-btn").appendTo(left)
	$("<i>").addClass("bi").addClass("bi-plus").appendTo(newSaveBtn)
	$("<span>").text("New Save").appendTo(newSaveBtn)
	newSaveBtn.on("click", makeNewSave)

	let modal = new bootstrap.Modal(modalTag[0])
	modal.toggle()

	modalTag.on("hidden.bs.modal", () => {
		resolve()
	})

	await promise
	saveFile.lastOpenDate = new Date()
	await saveSaveFile(saveFile)
}

function startGame(event){
	if ($(event.target).attr("id") !== "title-screen"){
		return
	}
	$("#title-screen").fadeOut()
	let campaignId = saveFile.lastOpenCampaignId
	let chapterIndex = saveFile.lastOpenChapterIndex
	if (campaignId && campaignId in CAMPAIGNS){
		currentCampaign = CAMPAIGNS["base"]
	}
	if (!chapterIndex || !(chapterIndex in currentCampaign.chapters)){
		chapterIndex = 0
	} else {
		
	}
	switchCampaignChapter(currentCampaign, chapterIndex)
}

$("#save-selector-btn").click(openSaveSelector)
$("#title-screen").click(startGame)

window.addEventListener("resize", resize)
resize()
loadGame().then(() => $("#loading-screen").fadeOut())