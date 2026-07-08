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
			let mugshot = new Mugshot(member.id, mugshotSpriteSheet.id, member.placement)
			this.speakers.push(mugshot)
		}
		this.dialogueBox = {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			tb: {
				x: 0,
				y: 0,
				textX: 0,
				textY: 0,
				rows: 3,
				columns: 10
			}
		}
		//Arrays of TextCharacters
		this.text = {
			target: [],
			displaying: []
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
		this.renderTalkBox(ctx)
		this.renderText(ctx)

		ctx.restore()
	}
	renderTalkBox(ctx){
		const renderInfo = this.dialogueBox
		const dialogueBoxX = renderInfo.x + renderInfo.tb.x
		const dialogueBoxY = renderInfo.y + renderInfo.tb.y
		const image = this.talkbox.image
		const spriteDims = this.talkbox.spriteDimensions
		const XL = dialogueBoxX
		const YT = dialogueBoxY
		const scale = 1
		const rows = renderInfo.tb.rows
		const columns = renderInfo.tb.columns
		const TLD = spriteDims[0]
		const TCD = spriteDims[1]
		const TRD = spriteDims[2]
		const CLD = spriteDims[3]
		const CCD = spriteDims[4]
		const CRD = spriteDims[5]
		const BLD = spriteDims[6]
		const BCD = spriteDims[7]
		const BRD = spriteDims[8]
		const XC = XL + TLD[2] * scale
		const XR = XC + TCD[2] * scale * columns
		const YC = YT + TLD[3] * scale
		const YB = YC + CLD[3] * scale * rows
		//center tiles
		for (let i = 0; i < rows; i++){
			for (let j = 0; j < columns; j++){
				ctx.drawImage(
					image,
					CCD[0], CCD[1], CCD[2], CCD[3],
					XC + CCD[2] * scale * j, YC + CCD[3] * scale * i, CCD[2] * scale, CCD[3] * scale
				)
			}
		}
		//top-left corner
		ctx.drawImage(
			image,
			TLD[0], TLD[1], TLD[2], TLD[3],
			XL, YT, TLD[2] * scale, TLD[3] * scale
		)
		//top-right corner
		ctx.drawImage(
			image,
			TRD[0], TRD[1], TRD[2], TRD[3],
			XR, YT, TRD[2] * scale, TRD[3] * scale
		)
		//bottom-left corner
		ctx.drawImage(
			image,
			BLD[0], BLD[1], BLD[2], BLD[3],
			XL, YB, BLD[2] * scale, BLD[3] * scale
		)
		//bottom-right corner
		ctx.drawImage(
			image,
			BRD[0], BRD[1], BRD[2], BRD[3],
			XR, YB, BRD[2] * scale, BRD[3] * scale
		)
		//middle bits
		for (let i = 0; i < columns; i++){
			ctx.drawImage(
				image,
				TCD[0], TCD[1], TCD[2], TCD[3],
				XC + TCD[2] * scale * i, YT, TCD[2] * scale, TCD[3] * scale
			)
			ctx.drawImage(
				image,
				BCD[0], BCD[1], BCD[2], BCD[3],
				XC + BCD[2] * scale * i, YB, BCD[2] * scale, BCD[3] * scale
			)
		}
		//side bits
		for (let i = 0; i < rows; i++){
			ctx.drawImage(
				image,
				CLD[0], CLD[1], CLD[2], CLD[3],
				XL, YC + CLD[3] * scale * i, CLD[2] * scale, CLD[3] * scale
			)
			ctx.drawImage(
				image,
				CRD[0], CRD[1], CRD[2], CRD[3],
				XR, YC + CRD[3] * scale * i, CRD[2] * scale, CRD[3] * scale
			)
		}
	}
	renderText(ctx){
		const renderInfo = this.dialogueBox
		const tbInfo = renderInfo.tb
		const startX = renderInfo.x + tbInfo.textX
		const startY = renderInfo.y + tbInfo.textY
		const lines = this.text.target
		ctx.textBaseline = "hanging"
		for (let line of lines){
			for (let char of line){
				let letter = char.character
				ctx.font = char.getCanvasFont()
				ctx.fillStyle = "white"
				ctx.fillText(letter, startX + char.x, startY)
			}
		}
	}

	displayText(text){
		let lines = [text] //worry about splitting the lines later
		//TODO: also add a way to encode special characteristics into the text, different colors and stuff
		lines = lines.map(line => line.split("").map(char => new TextCharacter(char, "FireEmblem", 32)))
		this.text.target = lines
		let displayed = lines.map(line => "")
		this.text.displaying = displayed

		//Determine where each character in each line must be placed
		const canvas = new OffscreenCanvas(500, 500)
		const ctx = canvas.getContext("2d")
		for (let line of lines){
			let x = -0.72
			for (let char of line){
				ctx.font = char.getCanvasFont()
				let text = ctx.measureText(char.character)
				let width = Math.ceil(text.width)
				char.x = x
				x += width + 2
			}
		}
		console.log(this.text)
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

		const tbDims = this.talkbox.spriteDimensions
		const talkboxInfo = this.dialogueBox.tb
		const talkboxSpriteWidth = tbDims[0][2] + tbDims[1][2] * talkboxInfo.columns + tbDims[2][2]
		const talkboxSpriteHeight = tbDims[0][3] + tbDims[3][3] * talkboxInfo.rows + tbDims[6][3]
		talkboxInfo.x = Math.round((dialogueBoxWidth - talkboxSpriteWidth) * 0.5)
		talkboxInfo.y = Math.round((dialogueBoxHeight * 0.3 - talkboxSpriteHeight) * 0.5)
		if (talkboxInfo.y < 0){
			talkboxInfo.y = 0
		}
		talkboxInfo.textX = talkboxInfo.x + tbDims[0][2]
		talkboxInfo.textY = talkboxInfo.y + tbDims[0][3]
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
	constructor(id, sheetId, placement){
		this.id = id
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
		for (let dim of this.spriteDimensions){
			dim[2] -= dim[0]
			dim[3] -= dim[1]
		}
	}
	async load(){
		let image = await loadImage(this.path)
		this.image = image
		this.isLoaded = true
	}
}

export class TextCharacter {
	constructor(character, font, fontSize){
		this.character = character
		this.font = font
		this.size = fontSize
		this.x = 0
		this.y = 0
		this.w = 0
		this.h = 0
	}
	getCanvasFont(){
		return this.size + "px " + this.font
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
	if ("sprite" in event){
		console.log(dialogue.speakers, event.speaker)
		let speaker = dialogue.speakers.find(speaker => speaker.id === event.speaker)
		speaker.spriteKey = event.sprite
	}

	dialogue.displayText(event.text)
	await delay(10000)
})