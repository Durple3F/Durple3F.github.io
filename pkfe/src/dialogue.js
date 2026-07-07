import { CHARACTERSPRITESHEETS } from "./battleCharacters.js"
import { delay, loadImage } from "./util.js"

export class Dialogue {
	constructor(game, dialogueData){
		this.game = game
		this.eventIndex = -1
		this.info = {}
		this.data = dialogueData
		this.members = this.data.members
		this.events = this.data.events
		this.screen = this.game.screen2d
		this.characters = new Map()
		this.speakers = []
		this.talkbox = null
		if ("defaultTalkBox" in dialogueData){
			this.talkbox = TALKBOXES[dialogueData.defaultTalkBox]
		}
		for (let member of this.members){
			let character = this.game.level.characters.find(char => {
				return char.levelCharacterId === member.characterId
			})
			this.characters.set(member.id, character)

			let spritesheet = CHARACTERSPRITESHEETS[character.pokemonId]
			let mugshotSpriteSheet = spritesheet.mugshot
			let mugshot = new Mugshot(mugshotSpriteSheet.id, member.placement)
			this.speakers.push(mugshot)
		}
		this.dialogueBox = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		}
		this.renderFns = []
	}

	render(){
		let ctx = this.screen.context
		const screen2d = this.screen
		const screenWidth = screen2d.canvas.width
		const screenHeight = screen2d.canvas.height
		const dialogueBoxX = this.dialogueBox.x
		const dialogueBoxY = this.dialogueBox.y
		const dialogueBoxWidth = this.dialogueBox.w
		const dialogueBoxHeight = this.dialogueBox.h
		ctx.save()
		ctx.fillStyle = "rgba(255,0,0,0.2)"
		ctx.fillRect(dialogueBoxX, dialogueBoxY, dialogueBoxWidth, dialogueBoxHeight)
		for (let speaker of this.speakers){
			const spritesheet = speaker.spritesheet
			let image = spritesheet.image
			let spriteLocation = spritesheet.getSpriteLocation(speaker.spriteKey)
			ctx.drawImage(
				image,
				spriteLocation[0], spriteLocation[1], spritesheet.spriteWidth, spritesheet.spriteHeight,
				dialogueBoxX + speaker.x, dialogueBoxY + speaker.y, speaker.w, speaker.h
			)
		}

		//Talkbox
		const talkboxImage = this.talkbox.image
		ctx.drawImage(talkboxImage, 0, 0)

		ctx.restore()
	}

	async play(){
		// for (let character of this.characters){
		// 	await character.load()
		// }
		const resize = this.resizeWindow.bind(this)
		resize()
		window.addEventListener("resize", resize)
		const render = () => {
			this.render()
		}
		const renderFns = this.screen.renderFns
		renderFns.push(render)
		let result = null
		while (result !== "done"){
			result = await this.advance()
		}
		renderFns.splice(renderFns.indexOf(render), 1)
		window.removeEventListener("resize", resize)
	}
	async advance(){
		this.eventIndex++
		let eventData = this.events[this.eventIndex]
		if (!eventData) return "done"
		let eventType = eventData.type ?? "talk"
		if (!(eventType in DIALOGUEEVENTS)){
			console.warn("Unhandled event type: "+eventType)
			return
		}
		await DIALOGUEEVENTS[eventType].execute(this.game, this, eventData)
	}
	resizeWindow(){
		const screen2d = this.screen
		screen2d.context.imageSmoothingEnabled = false;
		const screenWidth = screen2d.canvas.width
		const screenHeight = screen2d.canvas.height
		const ratio = 16 / 9
		const dialogueBoxWidth = (screenWidth / screenHeight <= ratio) ? screenWidth : screenHeight * ratio
		const dialogueBoxHeight = (screenWidth / screenHeight >= ratio) ? screenHeight : screenWidth / ratio
		const dialogueBoxX = (screenWidth - dialogueBoxWidth) * 0.5
		const dialogueBoxY = (screenHeight - dialogueBoxHeight) * 0.5
		this.dialogueBox.x = Math.round(dialogueBoxX)
		this.dialogueBox.y = Math.round(dialogueBoxY)
		this.dialogueBox.w = Math.round(dialogueBoxWidth)
		this.dialogueBox.h = Math.round(dialogueBoxHeight)
		for (let speaker of this.speakers){
			speaker.determinePlacement(this.screen, this.dialogueBox)
		}
	}
	getInfo(key){
		if (typeof key === "number"){
			return this.info[this.eventIndex + key]
		}
	}
}

export const MUGSHOTS = {}
export class MugshotSpriteSheet {
	constructor(options){
		this.id = options.id
		MUGSHOTS[this.id] = this
		this.path = options.path
		this.spriteWidth = options.spriteWidth
		this.spriteHeight = options.spriteHeight
		this.rows = options.rows
		this.columns = options.columns
		this.spriteLocations = options.spriteLocations ?? {}
		this.spriteUVMap = new Map()
		this.isLoaded = false
		this.image = null
	}
	async load(){
		let image = await loadImage(this.path)
		this.image = image
		this.isLoaded = true
	}
	getSpriteLocation(key){
		const location = this.spriteLocations[key]
		const x = location[1]
		const y = location[0]
		return [x * this.spriteWidth, y * this.spriteHeight]
	}
}

export const MUGSHOTPLACEMENTS = {
	"left": {
		"left": 0.2,
		"top": 0.7
	}
}
export class Mugshot {
	constructor(sheetId, placement){
		this.spritesheet = MUGSHOTS[sheetId]
		this.placement = placement
		this.spriteKey = "right"
		this.x = 0
		this.y = 0
		this.w = 0
		this.h = 0
	}
	determinePlacement(screen2d, dialogueBox){
		//Rule: The mugshot should be at most as tall as 60% of the dialogue box.
		//Rule: The mugshot should be at most as wide as 50% of the dialogue box.
		//Rule: The mugshot's final size should be pixel perfect, IE its height and width must be a multiple of its spritesheet's spriteHeight and spriteWidth.
		const screenWidth = screen2d.canvas.width
		const screenHeight = screen2d.canvas.height
		const dialogueBoxWidth = dialogueBox.w
		const dialogueBoxHeight = dialogueBox.h
		let characterWidthLimit = dialogueBoxWidth * 0.5
		let characterHeightLimit = dialogueBoxHeight * 0.6
		const spriteWidth = this.spritesheet.spriteWidth
		const spriteHeight = this.spritesheet.spriteHeight
		if (characterWidthLimit > spriteWidth){
			characterWidthLimit = Math.floor(characterWidthLimit / spriteWidth) * spriteWidth
		}
		if (characterHeightLimit > spriteHeight){
			characterHeightLimit = Math.floor(characterHeightLimit / spriteHeight) * spriteHeight
		}
		if (characterWidthLimit / characterHeightLimit > spriteWidth / spriteHeight){
			characterWidthLimit = characterHeightLimit / spriteHeight * spriteWidth
		}
		if (characterWidthLimit / characterHeightLimit < spriteWidth / spriteHeight){
			characterHeightLimit = characterWidthLimit / spriteWidth * spriteHeight
		}
		this.w = characterWidthLimit
		this.h = characterHeightLimit

		let placement = MUGSHOTPLACEMENTS[this.placement]
		if ("left" in placement){
			let centerX = Math.round(dialogueBoxWidth * placement.left)
			this.x = Math.round(centerX - this.w * 0.5)
		}
		if ("top" in placement){
			let centerY = Math.round(dialogueBoxHeight * placement.top)
			this.y = Math.round(centerY - this.h * 0.5)
		}
	}
}

export const TALKBOXES = {}
export class TalkBox {
	constructor(options){
		this.id = options.id
		TALKBOXES[this.id] = this
		this.path = options.path
		this.isLoaded = false
		this.spriteDimensions = options.spriteDimensions
	}
	async load(){
		let image = await loadImage(this.path)
		this.image = image
		this.isLoaded = true
	}
}

const DIALOGUEEVENTS = {}
export class DialogueEventType {
	constructor(id, executeFn){
		this.id = id
		this.execute = executeFn.bind(this)
		DIALOGUEEVENTS[this.id] = this
	}
	execute(game, dialogue, event){
		console.log("Seems like you forgot to provide a function for "+this.id)
	}
}
new DialogueEventType("talk", async function(game, dialogue, event){
	let character = dialogue.characters.get(event.speaker)
	let spritesheet = CHARACTERSPRITESHEETS[character.pokemonId]
	await delay(10000)
})