import {Hex, Grid, Component, Element, Atom, loadSprite, Molecule} from "./util.js"

const min = Math.min
const max = Math.max
const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

export class Level{
	constructor(){
		this.grid = new Grid()
		// this.grid.fill(-10, 10, -10, 10)
	}
}

export class Game{
	constructor(canvas, controls){
		this.controls = controls
		this.lastTick = performance.now()
		this.isDraggingMap = false

		this.currentLevel = new Level()
		this.hexSize = 40
		this.canvas = canvas
		this.canvasWidth = canvas.width
		this.canvasHeight = canvas.height
		this.xOffset = -0.5 * canvas.width
		this.yOffset = -0.5 * canvas.height
		this.initialize()
	}

	initialize(){
		this.resizeScreen()

		//Create a molecule of elemental Fire and put it on the home tile.
		let molecule = new Molecule()
		let atom = new Atom("Fire")
		atom.setCoords(0, 0, 0)
		molecule.addAtom(atom)
		let atom2 = new Atom("Fire")
		atom2.setCoords(-1, 1, 0)
		molecule.addAtom(atom2)
		molecule.addBond(atom, atom2)
		molecule.homeTile = this.getHexAt(0, 0)
		this.getHexAt(0, 0).active = true
		this.currentLevel.grid.contents.push(molecule)
		this.currentLevel.grid.contents[0].moveOrigin(new Hex(-2, 2, 0))
		console.log(molecule)
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

		this.currentLevel.grid.contents[0].rotation += 0.1

		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let activeHex = this.getHexFromXY(mouseX, mouseY)
		// console.log(activeHex)
		// activeHex.active = true

		//Map dragging
		if (controls.isClicking("left")){
			this.isDraggingMap = true
			let records = controls.mouse.records
			let prev = records[records.length - 2]
			let cur = records[records.length - 1]
			let dx = prev[0] - cur[0]
			let dy = prev[1] - cur[1]
			this.xOffset += dx
			this.yOffset += dy
			this.resizeScreen()
		} else {
			this.isDraggingMap = false
		}
	}
}