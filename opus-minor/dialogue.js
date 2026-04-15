import { doesSaveMeetCriteria } from "./database"
import { getLocaleString } from "./locale"
import { playSound } from "./sounds"

export const SPEAKERS = {}

export class DialogueSpeaker {
	constructor(id, options){
		this.id = id
		SPEAKERS[this.id] = this

		this.imageUrls = options.images ?? {}
		this.color = options.defaultColor
	}
}
new DialogueSpeaker("anataeus", {
	images: {
		"default": "./src/portraits/anataeus_small.png",
		"large": "./src/portraits/anataeus_large.png",
		"shabby": "./src/portraits/anataeus_shabby_small.png",
		"shabby_large": "./src/portraits/anataeus_shabby_large.png",
		"student": "./src/portraits/anataeus_student_small.png",
		"nametag": "./src/portraits/anataeus_nametag.png",
		"border": "./src/portraits/anataeus_border.png",
	},
	defaultColor: "#4b455f"
})
new DialogueSpeaker("concordia", {
	images: {
		"default": "./src/portraits/concordia_small.png",
		"large": "./src/portraits/concordia_large.png",
		"shabby": "./src/portraits/concordia_shabby_small.png",
		"shabby_large": "./src/portraits/concordia_shabby_large.png",
		"nametag": "./src/portraits/anataeus_nametag.png",
		"border": "./src/portraits/anataeus_border.png",
	},
	defaultColor: "#6e344c"
})

export const DIALOGUES = {}
export class DialogueStory {
	constructor(id, messagesList){
		this.id = id
		DIALOGUES[this.id] = this
		this.messagesList = messagesList
	}
	createTag(saveFile, campaignId){
		let tag = $("<div>").addClass("dialogue-container")
		let progress = {
			messageId: 0
		}
		let tagMap = {}

		let totalMessages = 0
		let pretendEverythingIsLocked = true
		let done = false
		for (let section of this.messagesList){
			let sectionIndex = this.messagesList.indexOf(section)
			let sectionTag = $("<div>").addClass("dialogue-section-container").appendTo(tag)
			if (section.unlock){
				let unlockTag = $("<div>").addClass("dialogue-section-unlock").appendTo(sectionTag)
				let unlockText = getLocaleString("unlock-beat-puzzle-to-continue", language, "Solve this puzzle to continue")
				unlockTag.text(unlockText)
				tagMap[totalMessages - 1] = tagMap[totalMessages - 1].add(sectionTag)
				let isUnlocked = doesSaveMeetCriteria(saveFile, campaignId, section.unlock)
				if (!isUnlocked || pretendEverythingIsLocked){
					done = true
					break
				}
			}
			let messages = section.messages
			let exchanges = []
			let currentSpeaker = null
			for (let message of messages){
				let speaker = message.speaker
				if (speaker !== currentSpeaker){
					exchanges.push([])
					currentSpeaker = speaker
				}
				let exchange = exchanges[exchanges.length - 1]
				exchange.push(message)
			}
			for (let exchange of exchanges){
				let exchangeTag = $("<div>").addClass("dialogue-speaker-exchange").appendTo(sectionTag)
				let left = $("<div>").addClass("dialogue-speaker-container").appendTo(exchangeTag)
				let right = $("<div>").addClass("dialogue-exchange-dialogue").appendTo(exchangeTag)
				let speaker = exchange[0].speaker
				let side = exchange[0].side
				exchangeTag.addClass(side)
				exchangeTag.attr("data-message-id", totalMessages)
				tagMap[totalMessages] = exchangeTag

				let name = getLocaleString(["speakers", speaker.id, "name"], language, speaker.id)
				let nameTag = $("<div>").addClass("speaker-name-container").appendTo(right)
				let nameImage = speaker.imageUrls["nametag"]
				nameTag.css("background-image", `url(${nameImage})`)
				$("<span>").text(name).appendTo(nameTag)

				let image = speaker.imageUrls["default"]
				let borderImage = speaker.imageUrls["border"]
				let borderTag = $("<div>").addClass("dialogue-speaker-border").appendTo(left)
				borderTag.css("background-image", `url(${borderImage})`)
				let imageTag = $("<img>").addClass("dialogue-speaker").appendTo(borderTag)
				imageTag.attr("src", image)

				for (let message of exchange){
					let messageTag = $("<div>").addClass("dialogue-message").appendTo(right)
					messageTag.attr("data-message-id", totalMessages)
					if (!tagMap[totalMessages]){
						tagMap[totalMessages] = messageTag
					}
					totalMessages++
					if (exchange.length === 1){
						messageTag.addClass("lone")
					}
					let text = getLocaleString(["dialogues", this.id, message.textId], language, `%${message.textId}%`)
					messageTag.text(text)
				}
			}
		}
		for (let i = progress.messageId + 1; i < totalMessages; i++){
			tagMap[i].hide()
		}

		let arrowContainer = $("<div>").addClass("dialogue-advance-container").appendTo(tag)
		let arrow = $("<div>").addClass("dialogue-advance-arrow").appendTo(arrowContainer)

		tag.on("click", () => {
			progress.messageId++
			let toShow = tagMap[progress.messageId]
			if (toShow){
				toShow.fadeIn()
				let lastElem = toShow[toShow.length - 1]
				lastElem.scrollIntoView({behavior: "smooth"})
				playSound("click_story")
			}
			if (progress.messageId >= totalMessages - 1){
				arrowContainer.animate({opacity: 0}, 1000)
			}
		})

		return tag
	}
}

export class DialogueMessages {
	constructor(messages, unlock){
		this.messages = messages
		this.unlock = unlock
	}
}

export class DialogueMessage {
	constructor(options){
		this.type = options.type ?? "message"
		this.speaker = SPEAKERS[options.speaker]
		if (!this.speaker){
			console.warn("Invalid speaker!")
			console.trace()
		}
		this.textId = options.text
		this.side = options.side ?? "left"
	}
}

new DialogueStory("refined-gold", [
	new DialogueMessages([
		new DialogueMessage({speaker: "anataeus", side: "left", text: "before-0"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "before-1"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "before-2"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "before-3"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "before-4"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "before-5"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "before-6"}),
	]),
	new DialogueMessages([
		new DialogueMessage({speaker: "anataeus", side: "left", text: "after-0"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "after-1"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "after-2"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "after-3"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "after-4"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "after-5"}),
		new DialogueMessage({speaker: "concordia", side: "right", text: "after-6"}),
		new DialogueMessage({speaker: "anataeus", side: "left", text: "after-7"})
	], {
		type: "completed",
		eventId: "refined-gold"
	})
])