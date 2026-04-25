import { getLocaleString } from "./locale"
import { playSound } from "./sounds"
import { loadSprite } from "./sprites"

export const DOCUMENTS = {}
export class Document {
	constructor(id, options) {
		this.id = id
		this.spriteUrls = options.sprites
		this.sprites = {}
		this.isLoaded = false
		this.displayInstructions = options.display ?? []
		DOCUMENTS[this.id] = this
	}
	async load() {
		let promises = [];
		for (let spriteName in this.spriteUrls) {
			let url = this.spriteUrls[spriteName];
			let p = loadSprite(url)
				.then(img => this.sprites[spriteName] = img);
			promises.push(p);
		}
		let ps = Promise.all(promises);
		await ps
		this.isLoaded = true
		return await ps
	}
	async display() {
		let resolve
		let promise = new Promise(res => resolve = res)
		let modalTag = $("#document-modal")
		let constraint = modalTag.find("#document-constraint")
		let container = modalTag.find("#document-container")
		
		for (let instruction of this.displayInstructions){
			switch (instruction.type){
				case "set_aspect": {
					let aspect = instruction.aspect
					const resize = () => {
						let screenAspect = constraint.width() / constraint.height()
						if (screenAspect < aspect){
							//Height limited
							let newWidth = constraint.width()
							let newHeight = constraint.width() / aspect
							container.css("width", newWidth)
							container.css("height", newHeight)
						} else {
							//Width limited
							let newWidth = constraint.height() * aspect
							let newHeight = constraint.height()
							container.css("width", newWidth)
							container.css("height", newHeight)
						}
					}
					resize()
					window.addEventListener("resize", resize)
					promise.then(() => window.removeEventListener("resize", resize))
				} break
				case "display_sprite": {
					let spriteId = instruction.id
					let img = this.sprites[spriteId].cloneNode()
					img = $(img).addClass("document-sprite")
					container.append(img)
					const style = () => {
						let css = {
							"position": "absolute",
							"left": instruction.x + "%",
							"top": instruction.y + "%",
							"width": instruction.w + "%",
							"height": instruction.h + "%"
						}
						img.css(css)
					}
					style()
					window.addEventListener("resize", style)
					promise.then(() => window.removeEventListener("resize", style))
				} break
				case "display_text": {
					let textId = instruction.textId
					let text = getLocaleString(["documents", this.id, textId], language, textId)
					let tag = $("<p>").html(text)
					container.append(tag)
					const style = () => {
						let css = {
							"position": "absolute"
						}
						if ("x" in instruction){
							css.left = instruction.x + "%"
						}
						if ("y" in instruction){
							css.top = instruction.y + "%"
						}
						if ("w" in instruction){
							css.width = instruction.w + "%"
						}
						if ("h" in instruction){
							css.height = instruction.h + "%"
						}
						if ("color" in instruction){
							css.color = instruction.color
						}
						if ("font" in instruction){
							css["font-family"] = instruction.font
						}
						if ("fontSize" in instruction){
							let fontSize = instruction.fontSize / 100 * container.height()
							css["font-size"] = fontSize + "px"
						}
						if ("lineHeight" in instruction){
							css["line-height"] = instruction.lineHeight
						}
						tag.css(css)
					}
					
					style()
					window.addEventListener("resize", style)
					promise.then(() => window.removeEventListener("resize", style))
				} break
			}
		}
		
		let modal = new bootstrap.Modal(modalTag[0], {
			keyboard: false
		})
		modal.toggle()

		modalTag.on("hidden.bs.modal", () => {
			resolve([
				{
					type: "set-completion",
					completed: true,
					document: this
				},
				{
					type: "change-scene",
					val: "level-select"
				}
			])
		})

		const clickLeave = () => {
			playSound("ui_paper_back")
		}
		modalTag[0].addEventListener("click", clickLeave)
		promise.then(() => modalTag[0].removeEventListener("click", clickLeave))

		return promise
	}
}

new Document("chapter-1-intro-doc", {
	sprites: {
		"bg": "./src/img/documents/letter_1.png"
	},
	display: [
		{type: "set_aspect", aspect: 1420 / 883},
		{type: "display_sprite", id: "bg", x: 0, y: 0, w: 100, h: 100},
		{
			type: "display_text", textId: "letter-text", x: 17, y: 35, w: 67, h: 50,
			color: "#312e25", font: "\"Crimson Text\", serif",
			fontSize: 2, lineHeight: 0.9
		},
		{
			type: "display_text", textId: "letter-attribution", x: 17, y: 71, w: 67, h: 50,
			color: "#312e25", font: "\"Crimson Text\", serif",
			fontSize: 2, lineHeight: 0.9
		}
	]
})