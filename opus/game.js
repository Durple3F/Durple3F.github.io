const min = Math.min
const max = Math.max
const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

export class Hex{
	constructor(q, r, s){
		//q, r, and s are coordinates in a kind of 3-dimensional space.
		//Each hex on a grid is defined by these three coordinates, though not uniquely.
		//The canonical coordinates for each hex are such that q+r+s === 0.
		this.q = q
		this.r = r
		this.s = s
		if (Math.round(q + r + s) !== 0){
			throw "q + r + s must be 0"
		}
	}
}
Hex.directions = [new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]
Hex.diagonals = [new Hex(2, -1, -1), new Hex(1, -2, 1), new Hex(-1, -1, 2), new Hex(-2, 1, 1), new Hex(-1, 2, -1), new Hex(1, 1, -2)]

export class Grid{
	constructor(){
		this.map = new Map()
		this.minQ = 0
		this.maxQ = 0
		this.minR = 0
		this.maxR = 0
	}
	getKey(q, r, s){
		return `${q},${r},${s}`
	}
	addHex(hex){
		const q = Math.floor(hex.q)
		const r = Math.floor(hex.r)
		const s = Math.floor(hex.s)
		const key = this.getKey(q, r, s)
		this.map.set(key, hex)
	}
	fill(minQ, maxQ, minR, maxR){
		const map = this.map
		if (minQ >= this.minQ && maxQ <= this.minQ && minR >= this.minR && maxR <= this.maxR){
			//we're done. return
			return
		}
		let tryCount = 0
		let addedCount = 0

		const tryToAdd = (q, r) => {
			tryCount++
			let s = -q - r
			const key = this.getKey(q, r, s)
			if (!map.has(key)){
				let hex = new Hex(q, r, s)
				this.addHex(hex)
				addedCount++
			}
		}
		
		if (map.size === 0){
			for (let r = minR; r <= maxR; r++){
				//Because the hex grid is rectangular, every two rows, the starting point for q will move one unit back.
				let offset = floor(-r*0.5)
				for (let q = minQ + offset; q <= maxQ + offset; q++){
					tryToAdd(q, r)
				}
			}
			return
		}

		if (minR < this.minR){
			for (let r = minR; r <= this.minR; r++){
				let offset = floor(-r*0.5)
				for (let q = this.minQ + offset; q <= this.maxQ + offset; q++){
					tryToAdd(q, r)
				}
			}
			this.minR = minR
		}
		if (maxR > this.maxR){
			for (let r = this.maxR; r <= maxR; r++){
				let offset = floor(-r*0.5)
				for (let q = this.minQ + offset; q <= this.maxQ + offset; q++){
					tryToAdd(q, r)
				}
			}
			this.maxR = maxR
		}
		if (minQ < this.minQ){
			for (let r = this.minR; r <= this.maxR; r++){
				let offset = floor(-r*0.5)
				for (let q = minQ + offset; q <= this.maxQ + offset; q++){
					tryToAdd(q, r)
				}
			}
			this.minQ = minQ
		}
		if (maxQ > this.maxQ){
			for (let r = this.minR; r <= this.maxR; r++){
				let offset = floor(-r*0.5)
				for (let q = this.minQ + offset; q <= maxQ + offset; q++){
					tryToAdd(q, r)
				}
			}
			this.maxQ = maxQ
		}
	}
	findHex(q, r, s){
		const key = this.getKey(q, r, s)
		return this.map.get(key)
	}
}

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
		this.hexSize = 20
		this.canvas = canvas
		this.xOffset = -0.5 * canvas.width
		this.yOffset = -0.5 * canvas.height
		this.resizeScreen()
	}

	resizeScreen(){
		const w = this.canvas.width
		const h = this.canvas.height
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

	tick(){
		const now = performance.now()
		const dt = now - this.lastTick
		const controls = this.controls
		controls.tick()

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