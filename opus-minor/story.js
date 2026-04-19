import { SPEAKERS } from "./dialogue"
import { getLocaleString } from "./locale"
import { playSound } from "./sounds"

export const STORIES = {}

export class Story {
	constructor(id, eventList){
		this.id = id
		this.events = eventList
		STORIES[this.id] = this
	}
}

export const SPEAKERPOSITIONS = {
	"offscreen-right": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
			{type: "multiply", scale: 0.5, position: {
				type: "container-width"
			}},
			{type: "multiply", scale: 1, position: {
				type: "self-width"
			}},
		]
	},
	"default-1-of-2": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
			{type: "multiply", scale: -0.5, position: {
				type: "self-width"
			}}
		]
	},
	"default-2-of-2": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
			{type: "multiply", scale: 0.5, position: {
				type: "self-width"
			}}
		]
	},
	"default-1-of-3": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
			{type: "multiply", scale: -1, position: {
				type: "self-width"
			}}
		]
	},
	"default-2-of-3": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
		]
	},
	"default-3-of-3": {
		type: "add",
		positions: [
			{type: "center"},
			{type: "multiply", scale: -0.2, position: {
				type: "self-height"
			}},
			{type: "multiply", scale: 1, position: {
				type: "self-width"
			}}
		]
	},
}

function determinePosition(position, portrait, container, cinematic){
	let type = position.type
	switch (type){
		case "add": {
			let result = [0, 0]
			let positions = position.positions
			for (let p of positions){
				let add = determinePosition(p, portrait, container, cinematic)
				result[0] += add[0]
				result[1] += add[1]
			}
			return result
		} break
		case "multiply": {
			let result = determinePosition(position.position, portrait, container, cinematic)
			result[0] *= position.scale
			result[1] *= position.scale
			return result
		} break
		case "center": {
			let x = container.width() * 0.5
			let y = container.height() * 0.5
			return [x, y]
		} break
		case "self-width": {
			let y = container.height() * 0.6
			let x = y * 383 / 561
			return [x, 0]
		} break
		case "self-height": {
			let y = container.height() * 0.6
			return [0, y]
		} break
		case "container-width": {
			let x = container.width()
			return [x, 0]
		} break
	}
	console.warn("Unhandled position type:", position)
	return [0, 0]
}

const eventTypes = {
	"set-background": {
		run: async (cinematic, event) => {
			cinematic.tags.bg.css("background-image", `url("${event.url}")`)
		}
	},
	"set-title": {
		run: async (cinematic, event) => {
			let storyId = cinematic.story.id
			let titleId = event.title
			let text = getLocaleString(["cinematics", storyId, titleId], language, titleId)
			cinematic.tags.title.html(text)
		}
	},
	"add-speaker": {
		run: async (cinematic, event) => {
			let speakerId = event.id
			let speaker = new CinematicSpeaker(speakerId)
			cinematic.speakers.push(speaker)
			cinematic.tags.characters.append(speaker.tag)
		}
	},
	"set-speaker-position": {
		run: async (cinematic, event) => {
			let speakerIndex = event.index
			if (event.id){
				speakerIndex = cinematic.speakers.findIndex(cSpeaker => cSpeaker.speaker.id === event.id)
			}
			let speaker = cinematic.speakers[speakerIndex]
			let tag = speaker.tag
			let position = event.position
			if (typeof position === "string"){
				position = SPEAKERPOSITIONS[position]
			}
			let positionVal = determinePosition(position, speaker.tag, cinematic.tags.characters, cinematic)
			tag.css("top", positionVal[1])
			tag.css("left", positionVal[0])
			tag.data("position", position)
		}
	},
	"animate-speaker-position": {
		run: async (cinematic, event) => {
			let speakerIndex = event.index
			if (event.id){
				speakerIndex = cinematic.speakers.findIndex(cSpeaker => cSpeaker.speaker.id === event.id)
			}
			let speaker = cinematic.speakers[speakerIndex]
			let tag = speaker.tag
			let position = event.position
			if (typeof position === "string"){
				position = SPEAKERPOSITIONS[position]
			}
			let positionVal = determinePosition(position, speaker.tag, cinematic.tags.characters, cinematic)
			let css = {
				"left": positionVal[0],
				"top": positionVal[1]
			}
			let duration = event.duration ?? 1000
			tag.animate(css, duration)
			tag.data("position", position)
		}
	},
	"flip-speaker": {
		run: async (cinematic, event) => {
			let speakerIndex = event.index
			if (event.id){
				speakerIndex = cinematic.speakers.findIndex(cSpeaker => cSpeaker.speaker.id === event.id)
			}
			let speaker = cinematic.speakers[speakerIndex]
			let tag = speaker.tag
			tag.toggleClass("flip")
		}
	},
	"show-text": {
		run: async (cinematic, event) => {
			let resolve
			let promise = new Promise(res => resolve = res)
			let textId = event.text
			let storyId = cinematic.story.id
			let text = getLocaleString(["cinematics", storyId, textId], language, textId)
			let textTag = cinematic.tags.dialogue.find("#story-dialogue-text")
			let dialogueTag = cinematic.tags.dialogue
			let cinematicTag = cinematic.tags.dialogue.parent()
			textTag.html(text)

			let activatePortraits = true
			if ("activate" in event){
				activatePortraits = event.activate
			}

			if (event.id){
				let speakerIndex = cinematic.speakers.findIndex(cSpeaker => cSpeaker.speaker.id === event.id)
				let cSpeaker = cinematic.speakers[speakerIndex]
				let name = getLocaleString(["speakers", cSpeaker.speaker.id, "name"], language, cSpeaker.speaker.id)
				let nameTag = cinematic.tags.dialogue.find("#story-dialogue-name")
				nameTag.html(name)

				if (activatePortraits){
					for (let cSpeak of cinematic.speakers){
						if (cSpeak === cSpeaker) continue
						cSpeak.tag.removeClass("active")
					}
					cSpeaker.tag.addClass("active")
				}
			}

			let handleClick = () => {
				playSound("click_story")
				resolve()
			}
			cinematicTag[0].addEventListener("click", handleClick)

			await promise
			cinematicTag[0].removeEventListener("click", handleClick)
		}
	}
}

class CinematicSpeaker {
	constructor(speakerId) {
		this.speaker = SPEAKERS[speakerId]
		this.tag = this.createTag()
	}
	createTag(){
		let speaker = this.speaker
		let tag = $("<div>").addClass("cinematic-speaker")
		let bg = $("<div>").addClass("cinematic-speaker-bg").appendTo(tag)
		let portrait = $("<div>").addClass("cinematic-speaker-portrait").appendTo(tag)
		let img = $("<img>").addClass("actual-portrait").appendTo(portrait)
		let nameTag = $("<div>").addClass("cinematic-speaker-name").appendTo(tag)
		let name = getLocaleString(["speakers", speaker.id, "name"], language, speaker.id)
		nameTag.html(name)
		let imageUrl = speaker.imageUrls["large"]
		img.attr("src", imageUrl)
		return tag
	}
}

export class Cinematic {
	constructor(story){
		this.story = story
		this.promise = new Promise(res => this.resolve = res)
		this.eventIndex = -1
		this.resultGameEvents = [
			{
				type: "set-completion",
				completed: true,
				story: this.story
			},
			{
				type: "change-scene",
				val: "level-select"
			}
		]

		this.speakers = []

		this.tags = {}
		this.tags.bg = $("#story-bg")
		this.tags.title = $("#story-title")
		this.tags.characters = $("#story-characters")
		this.tags.dialogue = $("#story-dialogue")

		let handleResize = () => this.handleResize()
		window.addEventListener("resize", handleResize)
		this.promise.then(() => window.removeEventListener("resize", handleResize))
	}
	advance(){
		this.eventIndex++
		let event = this.story.events[this.eventIndex]
		if (!event){
			this.resolve(this.resultGameEvents)
			return
		}
		this.runEvent(event).then(() => {
			this.advance()
		})
	}
	async runEvent(event){
		let typeId = event.type
		let type = eventTypes[typeId]
		if (!type){
			return
		}
		await type.run(this, event)
	}
	handleResize(){
		for (let speaker of this.speakers){
			let tag = speaker.tag
			let position = tag.data("position")
			if (position){
				let positionVal = determinePosition(position, tag, this.tags.characters, this)
				tag.css("left", positionVal[0])
				tag.css("top", positionVal[1])
			}
		}
	}
}

new Story("chapter-1-intro", [
	{type: "set-background", url: "./src/img/cinematic-bg/workshop.png"},
	{type: "set-title", title: "location"},
	{type: "add-speaker", id: "anataeus"},
	{type: "add-speaker", id: "concordia"},
	{type: "set-speaker-position", id: "anataeus", position: "default-1-of-2"},
	{type: "flip-speaker", id: "anataeus"},
	{type: "set-speaker-position", id: "concordia", position: "default-2-of-2"},
	{type: "show-text", id: "concordia", text: "dialogue-0"},
	{type: "show-text", id: "anataeus", text: "dialogue-1"},
	{type: "show-text", id: "anataeus", text: "dialogue-2"},
	{type: "show-text", id: "anataeus", text: "dialogue-3"},
	{type: "show-text", id: "anataeus", text: "dialogue-4"},
	{type: "show-text", id: "concordia", text: "dialogue-5"},
	{type: "show-text", id: "anataeus", text: "dialogue-6"},
	{type: "show-text", id: "anataeus", text: "dialogue-7"},
	{type: "show-text", id: "concordia", text: "dialogue-8"},
	{type: "show-text", id: "anataeus", text: "dialogue-9"},
	{type: "show-text", id: "anataeus", text: "dialogue-10"},
	{type: "show-text", id: "concordia", text: "dialogue-11"},
	{type: "show-text", id: "anataeus", text: "dialogue-12"},
	{type: "show-text", id: "concordia", text: "dialogue-13"},
	{type: "show-text", id: "anataeus", text: "dialogue-14"},
	{type: "show-text", id: "concordia", text: "dialogue-15"},
	{type: "show-text", id: "anataeus", text: "dialogue-16"},
	{type: "show-text", id: "concordia", text: "dialogue-17"},
])
new Story("chapter-1-outro", [
	{type: "set-background", url: "./src/img/cinematic-bg/workshop.png"},
	{type: "set-title", title: "location"},
	{type: "add-speaker", id: "anataeus"},
	{type: "add-speaker", id: "concordia"},
	{type: "add-speaker", id: "gelt"},
	{type: "set-speaker-position", id: "anataeus", position: "default-1-of-2"},
	{type: "flip-speaker", id: "anataeus"},
	{type: "set-speaker-position", id: "concordia", position: "default-2-of-2"},
	{type: "set-speaker-position", id: "gelt", position: "offscreen-right"},
	{type: "show-text", id: "concordia", text: "dialogue-0"},
	{type: "show-text", id: "anataeus", text: "dialogue-1"},
	{type: "show-text", id: "concordia", text: "dialogue-2"},
	{type: "show-text", id: "anataeus", text: "dialogue-3"},
	{type: "show-text", id: "concordia", text: "dialogue-4"},
	{type: "show-text", id: "anataeus", text: "dialogue-5"},
	{type: "show-text", id: "concordia", text: "dialogue-6"},
	{type: "show-text", id: "anataeus", text: "dialogue-7"},
	{type: "show-text", id: "concordia", text: "dialogue-8"},
	{type: "show-text", id: "anataeus", text: "dialogue-9"},
	{type: "show-text", id: "concordia", text: "dialogue-10"},
	{type: "show-text", id: "anataeus", text: "dialogue-11"},
	{type: "animate-speaker-position", id: "anataeus", position: "default-1-of-3", duration: 500},
	{type: "animate-speaker-position", id: "concordia", position: "default-2-of-3", duration: 500},
	{type: "animate-speaker-position", id: "gelt", position: "default-3-of-3", duration: 500},
	{type: "show-text", id: "gelt", text: "dialogue-12"},
	{type: "show-text", id: "anataeus", text: "dialogue-13"},
	{type: "show-text", id: "gelt", text: "dialogue-14"},
	{type: "show-text", id: "concordia", text: "dialogue-15"},
	{type: "show-text", id: "gelt", text: "dialogue-16"},
	{type: "show-text", id: "anataeus", text: "dialogue-17"},
	{type: "show-text", id: "concordia", text: "dialogue-18"},
	{type: "show-text", id: "anataeus", text: "dialogue-19"},
])