import { createSolution, getSolutions, SolutionSave } from "./database"
import { getLocaleString } from "./locale"
import { SCENARIOS } from "./scenarios"
import { clearModal } from "./util"

export const CAMPAIGNS = {}

export class CampaignEvent {
	constructor(type, options){
		this.type = type
		this.info = options
	}
}

export class CampaignChapter {
	constructor(id, eventList){
		this.id = id
		this.events = eventList
	}
}

export class Campaign {
	constructor(id, chapterList){
		this.id = id
		this.chapters = chapterList
		CAMPAIGNS[this.id] = this
	}
}

export function showCampaignChapter(campaign, chapterIndex){
	let campaignId = campaign.id
	let chapter = campaign.chapters[chapterIndex]
	let chapterName = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "name"], language, chapter.id)
	$("#level-select-header").find(".level-select-name").text(chapterName)
	let chapterSubtitle = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "subtitle"], language, chapter.id)
	$("#level-select-header").find(".level-select-subtitle").text(chapterSubtitle)
	let chapterTitle = getLocaleString(["campaigns", campaignId, "chapters", chapter.id, "top-header"], language, chapter.id)
	$("#level-chapter-title").text(chapterTitle)

	let choicesTag = $("#level-select-content")
	choicesTag.empty()
	for (let event of chapter.events){
		let tag = $("<div>").addClass("level-select-choice")
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
		choicesTag.append(tag)
	}
}

export async function showScenario(scenario){
	let resolve
	let promise = new Promise(res => resolve = res)
	let resultEvents = []
	let modalTag = $("#modal")
	clearModal(modalTag)

	modalTag.find(".modal-dialog").addClass("modal-dialog-scrollable").addClass("modal-dialog-centered")

	let header = modalTag.find(".modal-header")
	header.hide()
	let body = modalTag.find(".modal-body")
	body.addClass("p-0")
	modalTag.find(".modal-footer").hide()

	let container = $("<div>").addClass("scenario-container").appendTo(body)
	let left = $("<div>").addClass("scenario-story").appendTo(container)
	var right = $("<div>").addClass("scenario-ui").appendTo(container)

	left.text("STORY GOES HERE")

	let scenarioName = getLocaleString(["scenarios", scenario.id, "name"], language, scenario.id)
	let scenarioTitle = $("<div>").addClass("scenario-title").text(scenarioName).appendTo(right)

	let scoreboardsContainer = $("<div>").addClass("scoreboards-container").appendTo(right)

	let selectedSolution = null
	let solutionsContainer = $("<div>").addClass("solutions-list").appendTo(right)
	getSolutions(scenario).then(async solutionList => {
		if (solutionList.length === 0){
			const solution = await createSolution(scenario)
			solutionList.push(solution)
		}

		selectedSolution = solutionList[0]
		const selectSolution = tag => {
			tag.attr("data-active", true)
			if (tag.data("solution") instanceof SolutionSave){
				selectedSolution = tag.data("solution")
			}
		}

		for (let solution of solutionList){
			let tag = $("<div>").addClass("solution").appendTo(solutionsContainer)
			tag.data("solution", solution)
			let bg = $("<div>").addClass("solution-bg").appendTo(tag)
			let bg2 = $("<div>").addClass("solution-bg2").appendTo(tag)
			let nameTag = $("<div>").addClass("solution-name").appendTo(tag)
			nameTag.text(solution.name)
			let statsTag = $("<div>").addClass("solution-stats").appendTo(tag)
			let area = solution.solutionArea
			let cost = solution.solutionCost
			let cycles = solution.solutionCycle
			let instructionCount = solution.solutionInstructionCount
			let areaTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			areaTag.append(area).append(" ").append(getLocaleString("solution-stat-area", language, "AREA"))
			let costTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			costTag.append(cost).append($("<span>").addClass("tiny-g").text("G")).append(" ")
			.append(getLocaleString("solution-stat-cost", language, "COST"))
			let cycleTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			cycleTag.append(cycles).append(" ").append(getLocaleString("solution-stat-cycle", language, "CYCLES"))
			// let instructionCountTag = $("<span>").addClass("solution-stat").appendTo(statsTag)
			// instructionCountTag.append(instructionCount).append(" ")
			// .append(getLocaleString("solution-stat-instructions", language, "INSTRUCTIONS"))
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
	})

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

new Campaign("base", [
	new CampaignChapter("prologue", [
		new CampaignEvent("puzzle", {scenarioId: "test"})
	])
])