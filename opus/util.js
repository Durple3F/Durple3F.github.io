export function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}

export function easeInOutSine(x) {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}

export async function loadSprite(url){
	let img = new Image()
	img.src = url
	return await new Promise((resolve, reject) => {
		img.onload = () => {
			resolve(img)
		}
		img.onerror = async () => {
			img = await loadSprite(url)
			resolve(img)
		}
	})
}

export class Hex{
	constructor(q, r, s){
		//q, r, and s are coordinates in a kind of 3-dimensional space.
		//Each hex on a grid is defined by these three coordinates, though not uniquely.
		//The canonical coordinates for each hex are such that q+r+s === 0.
		this.q = q
		this.r = r
		this.s = s
		this.content = null
		this.active = false
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
		this.contents = []
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
	getHexAt(q, r){
		const s = -q - r
		let hex = this.findHex(q, r, s)
		if (!hex){
			hex = new Hex(q, r, s)
			this.addHex(hex)
		}
		return hex
	}
}

export class Component{
	constructor(){
		this.rotation = 0
		this.homeTile = new Hex(0, 0, 0)
		this.grid = new Grid()
	}
}

export const ELEMENTS = {}
export class Element{
	constructor(options){
		this.id = options.id
		this.spriteMap = options.sprites
		this.sprites = {}
		this.loaded = false
	}

	async load(){
		let promises = []
		for (let spriteName in this.spriteMap){
			let url = this.spriteMap[spriteName]
			let p = loadSprite(url)
			.then(img => this.sprites[spriteName] = img)
			promises.push(p)
		}
		return await Promise.all(promises)
	}
}
ELEMENTS["Fire"] = new Element({
	id: "Fire",
	sprites: {
		atom: "./src/img/atoms/fire.png"
	}
})

export class Atom {
	constructor(elementId){
		this.element = ELEMENTS[elementId]
		this.q = 0
		this.r = 0
		this.s = 0
	}
	setCoords(q, r, s){
		this.q = q
		this.r = r
		this.s = s
	}
}

export class Molecule extends Component {
	constructor(){
		super()
		this.atoms = new Grid()
	}
	addAtom(atom){
		//Ensure that no other atom is taking up this space.
		let taken = false
		for (let otherAtom of this.atoms.contents){
			if (atom.q === otherAtom.q || atom.r === otherAtom.r){
				taken = true
				break
			}
		}
		if (taken){
			console.error("Content intersected:")
			console.log(this, atom)
		}
		this.atoms.contents.push(atom)
	}
}