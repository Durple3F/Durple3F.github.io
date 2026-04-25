import ControlManager from "./controls"
import { ELEMENTS } from "./elements"
import { playSound } from "./sounds"
import { loadSprite } from "./sprites"
import { Atom, choice, Circle, clearModal, getRandomSubarray, getWeightedRandom, Grid, Hex } from "./util"

const ROOT3 = Math.sqrt(3)
const sigmarSpriteUrls = {
	"board": "./src/img/sigmars-garden/board.png",
	"hover": "./src/img/sigmars-garden/atom_hovered.png"
}
const sigmarAtoms = [
	"Salt",
	"Air",
	"Fire",
	"Water",
	"Earth",
	"Vitae",
	"Mors",
	"Quicksilver",
	"Lead",
	"Tin",
	"Iron",
	"Copper",
	"Silver",
	"Gold"
]
const SIGMARRULES = {}

class SigmarElement{
	constructor(id, rules={}){
		this.id = id
		this.elementId = rules.elementId ?? id
		this.matchesSingleton = rules.matchesSingleton ?? false
		this.matchesWith = rules.matchesWith ?? []
		this.restrictedSpawning = rules.restrictedSpawning ?? false
		this.allowedHexes = rules.allowedHexes ?? []
		this.disqualifyingElements = rules.disqualifyingElements ?? []
		SIGMARRULES[this.id] = this
	}
}
new SigmarElement("Salt", {
	matchesWith: ["Salt", "Fire", "Water", "Earth", "Air"]
})
new SigmarElement("Air", {
	matchesWith: ["Salt", "Air"]
})
new SigmarElement("Fire", {
	matchesWith: ["Salt", "Fire"]
})
new SigmarElement("Water", {
	matchesWith: ["Salt", "Water"]
})
new SigmarElement("Earth", {
	matchesWith: ["Salt", "Earth"]
})
new SigmarElement("Vitae", {
	matchesWith: ["Mors"]
})
new SigmarElement("Mors", {
	matchesWith: ["Vitae"]
})
new SigmarElement("Quicksilver", {
	matchesWith: ["Lead", "Tin", "Iron", "Copper", "Silver"]
})
new SigmarElement("Lead", {
	matchesWith: ["Quicksilver"]
})
new SigmarElement("Tin", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead"]
})
new SigmarElement("Iron", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin"]
})
new SigmarElement("Copper", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin", "Iron"]
})
new SigmarElement("Silver", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin", "Iron", "Copper"]
})
new SigmarElement("Gold", {
	matchesSingleton: true,
	restrictedSpawning: true,
	allowedHexes: [new Hex(0, 0, 0)]
})

const sigmarCounts = {
	"Salt": 4,
	"Air": 8,
	"Fire": 8,
	"Water": 8,
	"Earth": 8,
	"Vitae": 4,
	"Mors": 4,
	"Quicksilver": 5,
	"Lead": 1,
	"Tin": 1,
	"Iron": 1,
	"Copper": 1,
	"Silver": 1,
	"Gold": 1
}

class SigmarAtom{
	constructor(elementId) {
		this.element = ELEMENTS[elementId]
		this.coord = new Hex(0, 0, 0)
		this.renderX = 0
		this.renderY = 0
		this.renderSize = 0
		this.isSelected = false
		this.isHovered = false
		this.isOpen = false
	}
	equals(otherAtom) {
		let coord1 = this.coord
		let coord2 = otherAtom.coord
		return this.element === otherAtom.element && coord1.q === coord2.q && coord1.r === coord2.r
	}
	setCoords(q, r, s) {
		this.coord = new Hex(q, r, s)
		return this
	}
}

export class SigmarGarden{
	constructor(canvas, controls){
		this.canvas = canvas
		this.ctx = this.canvas.getContext("2d")
		this.controls = controls
		this.tickInterval = -1
		this.grid = new Grid()
		this.selectedAtoms = []
		this.startNewGame()
	}
	static async load(){
		if (SigmarGarden.loaded) return
		let promises = [];
		for (let spriteName in sigmarSpriteUrls) {
			let url = sigmarSpriteUrls[spriteName];
			let p = loadSprite(url).then(img => SigmarGarden.sprites[spriteName] = img);
			promises.push(p);
		}
		let ps = Promise.all(promises);
		await ps
		for (let sigmarElementId in SIGMARRULES){
			let elementId = SIGMARRULES[sigmarElementId].elementId
			let element = ELEMENTS[elementId]
			this.sprites[elementId] = element.sprites["atom"]
		}
		SigmarGarden.loaded = true
		return await ps
	}
	selectAtom(atom){
		let selected = this.selectedAtoms
		if (selected.includes(atom)){
			selected.splice(selected.indexOf(atom), 1)
			atom.isSelected = false
			playSound("solitaire_select")
			this.determineOpenAtoms()
			return
		}

		selected.push(atom)
		atom.isSelected = true
		this.carryOutSelection()
	}
	removeAtom(atom){
		let atoms = this.grid.contents
		atoms.splice(atoms.indexOf(atom), 1)
	}
	carryOutSelection(){
		let selected = this.selectedAtoms
		if (selected.length > 1){
			if (this.doAtomsMatch(selected[0], selected[1])){
				for (let atom of selected){
					this.removeAtom(atom)
				}
				selected.length = 0
				playSound("solitaire_match")
			} else {
				let first = selected[0]
				first.isSelected = false
				selected.splice(0, 1)
				playSound("solitaire_select")
			}
		} else {
			if (selected[0].element.id === "Gold"){
				for (let atom of selected){
					this.removeAtom(atom)
				}
				selected.length = 0
				playSound("solitaire_match")
			} else {
				playSound("solitaire_select")
			}
		}
		this.determineOpenAtoms()
	}
	doAtomsMatch(atom1, atom2){
		return true
	}
	determineOpenAtoms(){
		let taken = new Grid()
		let atoms = this.grid.contents
		for (let atom of atoms){
			taken.addHex(atom.coord)
		}
		for (let atom of atoms){
			let hex = atom.coord
			atom.isOpen = this.isHexOpen(hex, taken)
		}
		//Some atoms are only open if other atoms aren't on the board
		let atomTypes = {}
		for (let atom of atoms){
			if (!atomTypes[atom.element.id]){
				atomTypes[atom.element.id] = true
			}
		}
		for (let atom of atoms){
			if (!atom.isOpen) continue
			let disqualify = []
			switch (atom.element.id){
				case "Gold": {
					disqualify = ["Lead", "Tin", "Iron", "Copper", "Silver"]
				} break
				case "Silver": {
					disqualify = ["Lead", "Tin", "Iron", "Copper"]
				} break
				case "Copper": {
					disqualify = ["Lead", "Tin", "Iron"]
				} break
				case "Iron": {
					disqualify = ["Lead", "Tin"]
				} break
				case "Tin": {
					disqualify = ["Lead"]
				} break
			}
			for (let elementId of disqualify){
				if (atomTypes[elementId]){
					atom.isOpen = false
				}
			}
		}
	}
	isHexOpen(hex, grid){
		let neighbors = hex.neighbors()
		let open = neighbors.map(hex => !grid.hasHex(hex))
		let count = open.reduce((acc, v) => acc + v, 0)
		//Decide whether this hex is already open
		//If not, add hexes to the list of hexes that would add more open hexes.
		if (count >= 5) return true
		else {
			for (let i = 0; i < 6; i++){
				let next = (i + 1) % 6
				let after = (next + 1) % 6
				if (open[i] && open[next] && open[after]){
					return true
				}
			}
		}
		return false
	}
	generate(){
		let result = new Grid()
		let atoms = result.contents

		const gridSize = 5

		//Encourages a donut of empty space around the central atom
		let innerBias = Math.random() * 5
		let strandBias = Math.random() * 5

		//First, decide which initial layout to use.
		{
			let layoutSlice = new Grid()
			for (let q = 1; q <= gridSize; q++){
				for (let s = -q; s < 0; s++){
					let r = -q - s
					let hex = new Hex(q, r, s)
					layoutSlice.addHex(hex)
				}
			}
			for (let s = 1; s <= gridSize; s++){
				let r = -s
				for (let q = 1; q <= -r; q++){
					let s = -q - r
					let hex = new Hex(q, r, s)
					layoutSlice.addHex(hex)
				}
			}
			let layout = new Grid()
			for (let [key, hex] of layoutSlice.map){
				layout.addHex(hex)
				layout.addHex(hex.rotateLeft().rotateLeft())
				layout.addHex(hex.rotateRight().rotateRight())
			}
			let removed = 0
			while (removed < 12){
				let openHexes = 0
				let hexes = [...layoutSlice.map.values()]
				let wouldCreateMore = []

				let hexAvgNeighborContribution = []
				for (let i = 0; i < hexes.length; i++){
					let hex = hexes[i]
					let neighbors = hex.neighbors()
					let filled = neighbors.map(hex => layout.hasHex(hex))
					hexAvgNeighborContribution[i] = filled.filter(v => v).length
				}
				
				let randomHex = getWeightedRandom(hexes.map((hex, i) => {
					let neighborCount = hexAvgNeighborContribution[i]
					let weight = Math.pow(6 - neighborCount, 3)
					weight *= Math.pow(10 - hex.distance(new Hex(0, 0, 0)), innerBias)
					weight *= Math.pow(neighborCount === 2 ? 1 : 10, strandBias)
					return {value: hex, weight: weight}
				}))
				layout.removeHex(randomHex)
				layoutSlice.removeHex(randomHex)
				layout.removeHex(randomHex.rotateLeft().rotateLeft())
				layout.removeHex(randomHex.rotateRight().rotateRight())
				removed++
			}

			for (let [key, hex] of layout.map){
				result.addHex(hex)
			}
			result.addHex(new Hex(0, 0, 0))
		}

		let neededCounts = {}
		let neededAtoms = []
		let emptyHexes = new Grid()
		for (let [key, hex] of result.map){
			emptyHexes.addHex(hex)
		}
		for (let countName in sigmarCounts){
			neededCounts[countName] = sigmarCounts[countName]
			neededAtoms.push(countName)
		}
		while (neededAtoms.length){
			let atomTypeId = choice(neededAtoms)
			let atom = new SigmarAtom(atomTypeId)
			neededCounts[atomTypeId]--
			if (neededCounts[atomTypeId] <= 0){
				neededAtoms.splice(neededAtoms.indexOf(atomTypeId), 1)
			}
			let emptyHexList = [...emptyHexes.map.values()]
			console.log(emptyHexList)
			let hex = choice(emptyHexList)
			emptyHexes.removeHex(hex)
			atom.setCoords(hex.q, hex.r, hex.s)
			atoms.push(atom)
		}
		console.log(atoms.length, Object.keys(sigmarCounts).reduce((acc,v) => acc + sigmarCounts[v], 0))
		console.log(emptyHexes)

		return result
	}
	startNewGame(){
		this.grid = this.generate()
		this.determineOpenAtoms()
	}
	render(){
		const ctx = this.ctx
		const canvas = this.canvas
		const w = canvas.width
		const h = canvas.height
		ctx.clearRect(0, 0, w, h)

		const sprites = SigmarGarden.sprites
		const bg = sprites["board"]
		ctx.drawImage(bg, 0, 0, w, h)

		const boardY1 = h * 22 / bg.height
		const boardY2 = h * 665 / bg.height
		const boardH = boardY2 - boardY1
		const boardX1 = w * 57 / bg.width
		const boardX2 = w * 782 / bg.width
		const boardW = boardX2 - boardX1
		const boardCenterX = boardX1 + boardW * 0.5
		const boardCenterY = boardY1 + boardH * 0.5
		const hexSize = boardW / 11
		const atomSpace = hexSize / ROOT3
		const inRadius = hexSize * ROOT3 * 0.5
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize

		const atoms = this.grid.contents
		for (let atom of atoms){
			const sprite = sprites[atom.element.id]
			const coord = atom.coord
			const XY = coord.toXY()
			const atomX = XY[0] * atomSpace + boardCenterX
			const atomY = XY[1] * atomSpace + boardCenterY
			const atomW = hexSize * 0.85
			const atomH = atomW
			atom.renderX = atomX
			atom.renderY = atomY
			atom.renderSize = atomW
			ctx.save()
			ctx.globalAlpha = atom.isOpen ? 1 : 0.3
			ctx.drawImage(sprite, atomX - atomW * 0.5, atomY - atomH * 0.5, atomW, atomH)
			ctx.restore()

			if (atom.isHovered || atom.isSelected){
				const hover = sprites["hover"]
				const hoverW = atomW * 1.4
				const hoverH = atomH * 1.4
				ctx.save()
				ctx.globalAlpha = atom.isSelected ? 1 : 0.3
				ctx.drawImage(hover, atomX - hoverW * 0.5, atomY - hoverH * 0.5, hoverW, hoverH)
				ctx.restore()
			}
		}
	}
	tick(){
		let controls = this.controls
		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let atoms = this.grid.contents
		for (let atom of atoms){
			let circle = new Circle(atom.renderX, atom.renderY, atom.renderSize / 2)
			if (circle.contains(mouseX, mouseY)){
				atom.isHovered = true
				if (controls.justClicked("left") && atom.isOpen){
					this.selectAtom(atom)
				}
			} else {
				atom.isHovered = false
			}
		}
		controls.tick()
	}
	startTicks(){
		this.stopTicks()
		this.tickInterval = setInterval(() => {
			this.tick()
			this.render()
		})
	}
	stopTicks(){
		clearInterval(this.tickInterval)
	}
}
SigmarGarden.sprites = {}

export class SigmarGardenWindow {
	constructor(){
		this.promise = new Promise(res => this.resolve = res)
	}
	show(){
		let modalTag = $("#modal")
		clearModal(modalTag)
		let resolve = this.resolve
		let promise = this.promise

		modalTag.find(".modal-dialog").addClass("modal-dialog-scrollable").addClass("modal-dialog-centered")
		
		let header = modalTag.find(".modal-header")
		header.hide()
		let body = modalTag.find(".modal-body")
		body.addClass("p-0")
		modalTag.find(".modal-footer").hide()
	
		let container = $("<div>").addClass("sigmars-garden-window").appendTo(body)
		let left = $("<div>").addClass("sigmars-garden-story").appendTo(container)
		let right = $("<div>").addClass("sigmars-garden-container").appendTo(container)

		let canvas = $("<canvas>").addClass("sigmars-garden-screen").appendTo(right)
		let controls = new ControlManager(canvas[0])
		let sigmar = new SigmarGarden(canvas[0], controls)

		let newGameButton = $("<button>").addClass("sigmar-new-game-btn").text("New Game").appendTo(right)
		newGameButton[0].addEventListener("click", () => {
			sigmar.startNewGame()
		})
		
		let modal = new bootstrap.Modal(modalTag[0], {
			keyboard: false
		})
		modal.toggle()

		modalTag.on("hidden.bs.modal", () => {
			resolve([])
		})

		modalTag.on("shown.bs.modal", () => {
			canvas[0].width = canvas.width()
			canvas[0].height = canvas.height()
			sigmar.startTicks()
		})

		return promise
	}
}