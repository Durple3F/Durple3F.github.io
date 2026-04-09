import { getLocaleString } from "./locale"

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

new Campaign("base", [
	new CampaignChapter("prologue", [
		new CampaignEvent("puzzle", {scenarioId: "test"})
	])
])