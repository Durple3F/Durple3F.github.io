import {Hex, Grid, Component, Element, Atom, loadSprite, Molecule, ArmMechanism, ARMTYPES, Reagent} from "./util.js"
import { SCENARIOS } from "./scenarios.js"

const min = Math.min
const max = Math.max
const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

export class Level{
	constructor(scenario){
		this.scenario = scenario
		this.grid = new Grid()
		this.timestep = 0
		this.programs = []
		// this.grid.fill(-10, 10, -10, 10)
	}
}

export class Program{
	constructor(component){
		this.component = component
		this.name = ""
		this.instructions = []
	}
}

export class Game{
	constructor(canvas, controls){
		this.controls = controls
		this.lastTick = performance.now()
		this.isDraggingMap = false
		this.selectedComponent = null

		let scenario = SCENARIOS["test"]
		this.currentLevel = new Level(scenario)
		this.hexSize = 40
		this.canvas = canvas
		this.canvasWidth = canvas.width
		this.canvasHeight = canvas.height
		this.xOffset = -0.5 * canvas.width
		this.yOffset = -0.5 * canvas.height
		this.hoveredHex = null
		this.initialize()
		this.fillComponentPane()
	}

	fillComponentPane(){
		let scenario = this.currentLevel.scenario
		let allowedMechanisms = scenario.allowedMechanisms
		let mechanismsPane = $("#components-mechanisms").children(".components-list")
		mechanismsPane.empty()
		for (let mechanismName of allowedMechanisms){
			let componentTag = $("<div class='component'>")
			componentTag.text(mechanismName)
			mechanismsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				this.selectedComponent = new ArmMechanism(mechanismName)
				this.selectedComponent.isGhost = true
				this.selectedComponent.isRendered = false
			})
		}
	}

	addComponent(component){
		//For rendering purposes, all components must be placed in this order.
		const type = component.type
		const hierarchy = ["Reagent", "Product", "Glyph", "Molecule", "ArmMechanism"]
		const score = hierarchy.indexOf(type)
		const contents = this.currentLevel.grid.contents
		let index = contents.length
		while (index !== 0){
			let prev = contents[index - 1]
			if (hierarchy.indexOf(prev.type) > score){
				index--
			} else {
				break
			}
		}
		contents.splice(index, 0, component)
	}

	initialize(){
		this.resizeScreen()
		this.getHexAt(0, 0).active = true

		//Create a molecule of elemental Fire and put it on the home tile.
		let molecule = new Molecule()
		let atom = new Atom("Fire")
		atom.setCoords(0, 0, 0)
		molecule.addAtom(atom)
		let atom2 = new Atom("Fire")
		atom2.setCoords(-1, 1, 0)
		molecule.addAtom(atom2)
		molecule.addBond(atom, atom2)
		let reagent = new Reagent(molecule)
		reagent.homeTile = new Hex(-1, 0, 1)
		this.addComponent(reagent)
		// this.currentLevel.grid.contents[0].moveOrigin(new Hex(-2, 2, 0))
		if (true) {
			// let molecule = new Molecule()
			// let atom = new Atom("Fire")
			// atom.setCoords(0, 0, 0)
			// molecule.addAtom(atom)
			// molecule.moveOrigin(new Hex(2, -2, 0))
			// this.addComponent(molecule)
		}

		// let arm = new ArmMechanism("Piston")
		// arm.homeTile = this.getHexAt(2, -2)
		// this.addComponent(arm)
		// arm.rotateRight()
		// arm.rotateRight()
		// arm.arms.contents.forEach(arm => arm.distance = 2)

		// let arm2 = new ArmMechanism("Piston")
		// arm2.homeTile = this.getHexAt(5, -3)
		// this.addComponent(arm2)
	}

	getCollisionHexes(component){
		let result = []
		let homeTile = component.homeTile
		if (component.type === "ArmMechanism"){
			result.push(homeTile)
		}
		let atoms = component.atoms.contents
		for (let atom of atoms){
			let hex = homeTile.add(atom.coord)
			result.push(hex)
		}
		return result
	}
	checkPlacement(component){
		//The rules for collision are that:
		//The home tile of an arm must not overlap with an atom or the home tile of another arm.
		//The same is true for atoms. They can't touch other atoms or arms. The arm itself is fine, just not the home tile.
		//Since this function will only run while the simulation is paused, we don't need to calculate collision
		//using the non-integer rotation and translation stuff.
		//Also, only collisions with *other* components matters. The component can touch itself.
		let legal = true
		let proposedHexes = this.getCollisionHexes(component)

		let components = this.currentLevel.grid.contents
		for (let otherComponent of components){
			if (otherComponent === component) continue
			let takenHexes = this.getCollisionHexes(otherComponent)
			for (let otherHex of takenHexes){
				for (let hex of proposedHexes){
					if (hex.q === otherHex.q && hex.r === otherHex.r){
						legal = false
						return false
					}
				}
			}
		}
		return legal
	}
	cancelPlacement(){
		this.selectedComponent = null
	}

	resizeScreen(){
		const oldW = this.canvasWidth
		const oldH = this.canvasHeight
		const w = this.canvas.width
		const h = this.canvas.height
		this.canvasWidth = w
		this.canvasHeight = h
		this.xOffset += (oldW - w) * 0.5
		this.yOffset += (oldH - h) * 0.5
		const grid = this.currentLevel.grid
		const hexSize = this.hexSize
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize
		const xOffset = this.xOffset
		const yOffset = this.yOffset

		const topPixel = 0 + yOffset
		const bottomPixel = h + yOffset
		const leftPixel = 0 + xOffset
		const rightPixel = w + xOffset
		const topR = floor(topPixel / vert)
		const bottomR = ceil(bottomPixel / vert)
		const leftQ = floor(leftPixel / horiz)
		const rightQ = ceil(rightPixel / horiz)
		// grid.fill(leftQ, rightQ, topR, bottomR)

		//TODO: Remove cells that are far outside the current play space.
	}

	getHexAt(q, r){
		const grid = this.currentLevel.grid
		q = Math.round(q)
		r = Math.round(r)
		const s = -q - r
		let hex = grid.findHex(q, r, s)
		if (!hex){
			hex = new Hex(q, r, s)
			grid.addHex(hex)
		}
		return hex
	}
	getHexFromXY(x, y){
		const hexSize = this.hexSize
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize
		// let x = (q + 0.5 * r) * horiz - xOffset
		// let y = r * vert - yOffset
		let r = (y + this.yOffset) / vert
		let q = ((x + this.xOffset) / horiz) - 0.5 * r
		let hex = this.getHexAt(q, r)
		return hex
	}

	tick(){
		const now = performance.now()
		const dt = now - this.lastTick
		const controls = this.controls
		controls.tick()

		// this.currentLevel.grid.contents[0].rotation += 0.1
		// this.currentLevel.grid.contents[1].rotation -= 0.1*0.15
		// this.currentLevel.grid.contents[2].rotation -= 0.1*0.15
		for (let component of this.currentLevel.grid.contents){
			let right = Math.PI * 1/3
			let left = -right
			let curAngle = component.rotation
			if (curAngle > right){
				component.rotation -= right
				component.rotateRight()
			} else if (curAngle < left){
				component.rotation -= left
				component.rotateLeft()
			}
		}

		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let hoveredHex = this.getHexFromXY(mouseX, mouseY)
		if (this.hoveredHex) this.hoveredHex.active = false
		this.hoveredHex = hoveredHex
		hoveredHex.active = true

		//Map dragging
		const isLeftClicking = controls.isClicking("left")
		const isMouseOnScreen = controls.isMouseOnScreen()
		if (isLeftClicking && isMouseOnScreen && controls.justClicked("left")){
			this.isDraggingMap = true
		} else if (!(isLeftClicking && isMouseOnScreen)) {
			this.isDraggingMap = false
		}
		if (this.isDraggingMap){
			let records = controls.mouse.records
			let prev = records[records.length - 2]
			let cur = records[records.length - 1]
			let dx = prev[0] - cur[0]
			let dy = prev[1] - cur[1]
			this.xOffset += dx
			this.yOffset += dy
			this.resizeScreen()
		}

		//Component placement
		if (this.selectedComponent){
			if (isLeftClicking && controls.isMouseOnScreen() && hoveredHex){
				this.selectedComponent.homeTile = hoveredHex
				this.selectedComponent.isRendered = true
			}
			else if (!isLeftClicking && hoveredHex){
				//If the proposed placement is legal, place it. Otherwise, cancel.
				if (this.checkPlacement(this.selectedComponent)){
					this.addComponent(this.selectedComponent)
					this.selectedComponent.isGhost = false
					this.selectedComponent = null
				} else {
					this.cancelPlacement()
				}
			}
			else if (!isLeftClicking){
				this.cancelPlacement()
			}
		}
	}
}