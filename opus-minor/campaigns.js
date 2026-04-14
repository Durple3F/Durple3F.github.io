import { createSolution, deleteSolution, getSolutions, saveSaveFile, saveSolution, SolutionSave } from "./database"
import { getLocaleString } from "./locale"
import { SCENARIOS } from "./scenarios"
import { categoryVolumes, changeCategoryVolume, playSound } from "./sounds"
import { clearModal } from "./util"

export const CAMPAIGNS = {}

export class CampaignEvent {
	constructor(type, id, options){
		this.type = type
		this.id = id
		this.info = options ?? {}
	}
}

export class CampaignChapter {
	constructor(id, eventList, imageUrls){
		this.id = id
		this.events = eventList
		this.imageUrls = imageUrls
	}
}

export class Campaign {
	constructor(id, chapterList){
		this.id = id
		this.chapters = chapterList
		CAMPAIGNS[this.id] = this
	}
}

export class EventProgress {
	constructor(id, completed, unlocked){
		this.id = id
		this.completed = completed
		this.unlocked = unlocked
	}
}
export class CampaignProgress {
	constructor(campaign){
		this.events = {}
		for (let chapter of campaign.chapters){
			for (let event of chapter.events){
				let id = event.id
				let progress = new EventProgress(id, false, false)
				if (id in this.events){
					console.warn("This event has a duplicate event id:", event, campaign)
					continue
				}
				this.events[id] = progress
			}
		}
	}
}

export function showCampaignChapter(campaign, chapterIndex, saveFile){
	let campaignId = campaign.id
	let chapter = campaign.chapters[chapterIndex]
	let chapterName = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "name"], language, chapter.id)
	$("#level-select-header").find(".level-select-name").text(chapterName)
	let chapterSubtitle = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "subtitle"], language, chapter.id)
	$("#level-select-header").find(".level-select-subtitle").text(chapterSubtitle)
	let chapterTitle = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "top-header"], language, chapter.id)
	$("#level-chapter-title").text(chapterTitle)

	let progress = saveFile.campaignsProgress[campaign.id]

	let choicesTag = $("#level-select-content")
	choicesTag.empty()
	for (let event of chapter.events){
		let tag = $("<div>").addClass("level-select-choice").appendTo(choicesTag)
		tag.data("event", event)
		switch (event.type){
			case "puzzle":
			let scenarioId = event.info.scenarioId
			let image = $("<img>").addClass("level-select-icon")
			image.attr("src", "./src/img/puzzle-select/icon_puzzle.png")
			tag.append(image)
			let scenarioName = getLocaleString(["scenarios", scenarioId, "name"], language, scenarioId)
			tag.append($("<span>").addClass("level-select-name").text(scenarioName))
			let checkboxState = false
			let checkboxUrl
			if (checkboxState){
				checkboxUrl = "./src/img/puzzle-select/list_checked.png"
			} else {
				checkboxUrl = "./src/img/puzzle-select/list_unchecked.png"
			}
			tag.append($("<img>").addClass("level-select-icon").attr("src", checkboxUrl))
			break
		}
		
		let id = event.id
		tag.attr("data-event-id", id)
		if (!progress.events[id].unlocked){
			tag.addClass("locked")
		}
	}

	let chaptersContainer = $("#level-select-chapter-container")
	chaptersContainer.empty()
	for (let i = 0; i < campaign.chapters.length; i++){
		let chapter = campaign.chapters[i]
		let chapterTag = $("<div>").addClass("level-select-chapter").appendTo(chaptersContainer)
		let image = $("<img>").appendTo(chapterTag).attr("src", chapter.imageUrls.unlocked)

		chapterTag.attr("data-unlocked", true)
		chapterTag.data("chapterIndex", i)
	}
}

export async function showScenario(scenario, saveUUID){
	let resolve
	let promise = new Promise(res => resolve = res)
	let resultEvents = []
	let modalTag = $("#modal")
	clearModal(modalTag)
	playSound("ui_modal")

	modalTag.find(".modal-dialog").addClass("modal-dialog-scrollable").addClass("modal-dialog-centered")

	let header = modalTag.find(".modal-header")
	header.hide()
	let body = modalTag.find(".modal-body")
	body.addClass("p-0")
	modalTag.find(".modal-footer").hide()

	let container = $("<div>").addClass("scenario-container").appendTo(body)
	let left = $("<div>").addClass("scenario-story").appendTo(container)
	let right = $("<div>").addClass("scenario-ui").appendTo(container)

	let renameContainer = $("<div>").addClass("solution-rename-container").appendTo(right)
	renameContainer.hide()
	renameContainer.append($("<div>").text(getLocaleString("message-please-rename-solution", language, "Rename: ")))
	let renameInput = $("<input>").appendTo(renameContainer)
	let renameButtonsContainer = $("<div>").addClass("btn-container").appendTo(renameContainer)
	let cancelRenameButton = $("<button>").text(getLocaleString("button-cancel-rename-solution", language, "Cancel"))
	cancelRenameButton.appendTo(renameButtonsContainer)
	let submitRenameButton = $("<button>").text(getLocaleString("button-submit-rename-solution", language, "Rename"))
	submitRenameButton.appendTo(renameButtonsContainer)

	left.text("STORY GOES HERE")

	let scenarioName = getLocaleString(["scenarios", scenario.id, "name"], language, scenario.id)
	let scenarioTitle = $("<div>").addClass("scenario-title").text(scenarioName).appendTo(right)

	let scoreboardsContainer = $("<div>").addClass("scoreboards-container").appendTo(right)

	let selectedSolution = null
	let selectedSolutionTag = null
	let solutionsContainer = $("<div>").addClass("solutions-list").appendTo(right)

	const createSolutionTag = solution => {
		let tag = $("<div>").addClass("solution").appendTo(solutionsContainer)
		tag.data("solution", solution)
		let bg = $("<div>").addClass("solution-bg").appendTo(tag)
		let bg2 = $("<div>").addClass("solution-bg2").appendTo(tag)
		let nameTag = $("<div>").addClass("solution-name").appendTo(tag)
		nameTag.text(solution.name)
		let statsTag = $("<div>").addClass("solution-stats").appendTo(tag)
		if (solution.verified){
			let area = solution.solutionArea
			let cost = solution.solutionCost
			let cycles = solution.solutionCycle
			let instructionCount = solution.solutionInstructionCount
			let areaTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			areaTag.append(area).append(" ").append(getLocaleString("solution-stat-area", language, "AREA"))
			statsTag.append("/")
			let costTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			costTag.append(cost).append($("<span>").addClass("tiny-g").text("G")).append(" ")
			.append(getLocaleString("solution-stat-cost", language, "COST"))
			statsTag.append("/")
			let cycleTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			cycleTag.append(cycles).append(" ").append(getLocaleString("solution-stat-cycle", language, "CYCLES"))
			//TODO:
			// let instructionCountTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			// instructionCountTag.append(instructionCount).append(" ")
			// .append(getLocaleString("solution-stat-instructions", language, "INSTRUCTIONS"))
		} else {
			let partCount = solution.components.length
			let verifiedTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			verifiedTag.append(getLocaleString("solution-stat-solved", language, "NOT SOLVED YET"))
			statsTag.append("/")
			let partTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			partTag.append(partCount).append(" ").append(getLocaleString("solution-stat-parts", language, "PARTS"))
		}
		return tag
	}
	const selectSolution = tag => {
		if (selectedSolutionTag){
			selectedSolutionTag.attr("data-active", false)
		}
		tag.attr("data-active", true)
		if (tag.data("solution") instanceof SolutionSave){
			selectedSolution = tag.data("solution")
			selectedSolutionTag = tag
		}
	}
	
	getSolutions(scenario).then(async solutionList => {
		if (solutionList.length === 0){
			const solution = await createSolution(scenario, saveUUID)
			solutionList.push(solution)
		}

		for (let solution of solutionList){
			let tag = createSolutionTag(solution)
			
			if (solution === solutionList[0]){
				selectSolution(tag)
			}
			tag.on("click", () => selectSolution(tag))
		}
	})

	let buttons = $("<div>").addClass("scenario-buttons").appendTo(right)
	let leftButtons = $("<div>").addClass("solution-management-buttons").appendTo(buttons)
	let openButton = $("<button>").addClass("open-solution-button").appendTo(buttons)
	openButton.text(getLocaleString("button-open-puzzle", language, "Open"))

	const openLevel = () => {
		if (selectedSolution && selectedSolution instanceof SolutionSave){
			let scenario = SCENARIOS[selectedSolution.scenarioId]
			resultEvents.push({
				type: "open-level",
				scenario: scenario,
				solution: selectedSolution
			})
		}
	}
	openButton.on("click", () => {
		openLevel()
		resolve()
		modal.toggle()
		playSound("ui_modal_close")
	})

	const handleNew = async () => {
		let solution = await createSolution(scenario, saveUUID)
		let tag = createSolutionTag(solution)
		tag.on("click", () => selectSolution(tag))
		selectSolution(tag)
	}

	const handleCopy = async () => {
		let solution = selectedSolution
		let clone = solution.clone()
		let tag = createSolutionTag(clone)
		tag.on("click", () => selectSolution(tag))
		selectSolution(tag)
	}

	const handleDelete = async () => {
		await deleteSolution(selectedSolution)
		selectedSolutionTag.remove()
		let otherSolutions = solutionsContainer.children(".solution")
		if (otherSolutions.length){
			let first = otherSolutions[0]
			selectSolution($(first))
		} else {
			handleNew()
		}
	}

	const handleRename = () => {
		renameContainer.fadeIn()
		renameInput.val(selectedSolution.name)
	}
	const handleRenameCancel = () => {
		renameContainer.fadeOut()
	}
	const handleRenameSubmit = () => {
		let newName = renameInput.val()
		selectedSolutionTag.find(".solution-name").text(newName)
		selectedSolution.name = newName
		saveSolution(selectedSolution)
		renameContainer.fadeOut()
	}

	let newSolutionButton = $("<button>").addClass("new-solution-button").appendTo(leftButtons)
	newSolutionButton.text(getLocaleString("button-new-solution", language, "Open"))
	newSolutionButton.on("click", () => handleNew())
	let renameSolutionButton = $("<button>").addClass("rename-solution-button").appendTo(leftButtons)
	renameSolutionButton.text(getLocaleString("button-rename-solution", language, "Rename"))
	renameSolutionButton.on("click", () => handleRename())
	let copySolutionButton = $("<button>").addClass("copy-solution-button").appendTo(leftButtons)
	copySolutionButton.text(getLocaleString("button-copy-solution", language, "Copy"))
	copySolutionButton.on("click", () => handleCopy())
	let deleteSolutionButton = $("<button>").addClass("delete-solution-button").appendTo(leftButtons)
	deleteSolutionButton.text(getLocaleString("button-delete-solution", language, "Delete"))
	deleteSolutionButton.on("click", () => handleDelete())

	cancelRenameButton.on("click", () => handleRenameCancel())
	submitRenameButton.on("click", () => handleRenameSubmit())

	let modal = new bootstrap.Modal(modalTag[0], {
		keyboard: false
	})
	modal.toggle()

	modalTag.on("hidden.bs.modal", () => {
		resolve()
	})

	await promise
	return resultEvents
}
export async function showOptions(saveFile){
	let resolve
	let promise = new Promise(res => resolve = res)
	let resultEvents = []
	let modalTag = $("#modal")
	clearModal(modalTag)
	playSound("ui_modal")

	modalTag.find(".modal-dialog").addClass("modal-dialog-scrollable").addClass("modal-dialog-centered")

	let header = modalTag.find(".modal-header")
	header.hide()
	let body = modalTag.find(".modal-body")
	body.addClass("p-0")
	modalTag.find(".modal-footer").hide()

	let container = $("<div>").addClass("scenario-container").appendTo(body)
	let left = $("<div>").addClass("scenario-story").appendTo(container)
	let right = $("<div>").addClass("scenario-ui").appendTo(container)

	body.append(`<button type="button" class="btn-close top-right" data-bs-dismiss="modal" aria-label="Close"></button>`)

	left.text("STORY GOES HERE")
	right.css("font-size", "160%")
	right.css("padding-left", "5em")
	right.css("padding-right", "5em")

	const easing = 0.01
	const toPerceptualVolume = (x, max = 1000, k = easing) => {
		// Clamp input
		x = Math.max(0, Math.min(max, x))
		return Math.log1p(k * (x / max)) / Math.log1p(k)
	}
	const fromPerceptualVolume = (y, max = 1000, k = easing) => {
		// Clamp input
		y = Math.max(0, Math.min(1, y))
		return (max / k) * (Math.exp(y * Math.log1p(k)) - 1)
	}

	const readyChangeVolume = (container, category, name) => {
		let curVolume = categoryVolumes[category]
		container.addClass("sound-category")
		let nameTag = $("<div>").addClass("sound-category-name").text(name).appendTo(container)
		let rangeTag = $("<input>").attr("type", "range").attr("min", 0).attr("max", 1000).appendTo(container)
		rangeTag.addClass("form-range")
		let curVal = fromPerceptualVolume(curVolume, 1000, easing)
		rangeTag.val(curVal)
		let changeInterval = -1
		const change = () => {
			let val = rangeTag.val()
			let volume = toPerceptualVolume(val, 1000, easing)
			changeCategoryVolume(category, volume, saveFile)
		}
		rangeTag.on("mousedown", () => {
			clearInterval(changeInterval)
			changeInterval = setInterval(change, 10)
			const remove =  () => {
				clearInterval(changeInterval)
				playSound("ui_modal")
				$("body")[0].removeEventListener("mouseup", remove)
			}
			$("body")[0].addEventListener("mouseup", remove)
		})
	}

	let sfxContainer = $("<div>").appendTo(right)
	readyChangeVolume(sfxContainer, "sfx", "Sound Volume")

	let modal = new bootstrap.Modal(modalTag[0], {
		keyboard: false
	})
	modal.toggle()

	modalTag.on("hidden.bs.modal", async () => {
		await saveSaveFile(saveFile)
		resolve()
	})
	await promise
	return promise
}

new Campaign("base", [
	new CampaignChapter("prologue", [
		new CampaignEvent("puzzle", "test", {
			scenarioId: "test",
			// unlock: {type: "startsUnlocked"}
		})
	], {
		locked: "./src/img/campaigns/base/prologue locked.png",
		unlocked: "./src/img/campaigns/base/prologue.png"
	}),
	new CampaignChapter("chapter-1", [
		new CampaignEvent("puzzle", "refined-gold", {
			scenarioId: "refined-gold",
			// unlock: {type: "startsUnlocked"}
		}),
		new CampaignEvent("puzzle", "face-powder", {
			scenarioId: "face-powder",
			unlock: {type: "completed", eventId: "refined-gold"}
		}),
	], {
		locked: "./src/img/campaigns/base/chapter 1 locked.png",
		unlocked: "./src/img/campaigns/base/chapter 1.png"
	}),
])