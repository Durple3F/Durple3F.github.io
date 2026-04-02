const ROOT3 = Math.sqrt(3)

export function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}

export function easeInOutSine(x) {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function lerp(a, b, alpha) {
	return a + alpha * (b - a);
}
export function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max)
}

export async function loadSprite(url) {
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

//Returns an array of that tag and its parents and ancestors.
export function tagHierarchy(tag) {
	const nodes = [tag]
	while (nodes[0].parentNode) {
		nodes.unshift(nodes[0].parentNode)
	}
	return nodes
}

export class Circle {
	constructor(x, y, radius){
		this.x = x
		this.y = y
		this.radius = radius
	}
	intersects(circle){
		return Math.hypot(circle.x-this.x, circle.y-this.y) <= (circle.radius + this.radius)
	}
}

export class Hex {
	constructor(q, r, s) {
		//q, r, and s are coordinates in a kind of 3-dimensional space.
		//Each hex on a grid is defined by these three coordinates, though not uniquely.
		//The canonical coordinates for each hex are such that q+r+s === 0.
		this.q = q
		this.r = r
		this.s = s
		this.active = false
		if (Math.round(q + r + s) !== 0) {
			console.trace(this)
			throw "q + r + s must be 0"
		}
	}
	copy(b) {
		this.q = b.q
		this.r = b.r
		this.s = b.s
	}
	clone() {
		return new Hex(this.q, this.r, this.s)
	}
	add(b) {
		return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
	}
	subtract(b) {
		return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
	}
	scale(k) {
		return new Hex(this.q * k, this.r * k, this.s * k);
	}
	rotateLeft() {
		return new Hex(-this.s, -this.q, -this.r);
	}
	rotateRight() {
		return new Hex(-this.r, -this.s, -this.q);
	}
	static direction(direction) {
		return Hex.directions[direction];
	}
	neighbor(direction) {
		return this.add(Hex.direction(direction));
	}
	diagonalNeighbor(direction) {
		return this.add(Hex.diagonals[direction]);
	}
	len() {
		return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
	}
	distance(b) {
		return this.subtract(b).len();
	}
	lerp(b, t) {
		return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
	}
	linedraw(b) {
		var N = this.distance(b);
		var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
		var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
		var results = [];
		var step = 1.0 / Math.max(N, 1);
		for (var i = 0; i <= N; i++) {
			results.push(a_nudge.lerp(b_nudge, step * i).round());
		}
		return results;
	}
	round() {
		var qi = Math.round(this.q);
		var ri = Math.round(this.r);
		var si = Math.round(this.s);
		var q_diff = Math.abs(qi - this.q);
		var r_diff = Math.abs(ri - this.r);
		var s_diff = Math.abs(si - this.s);
		if (q_diff > r_diff && q_diff > s_diff) {
			qi = -ri - si;
		}
		else if (r_diff > s_diff) {
			ri = -qi - si;
		}
		else {
			si = -qi - ri;
		}
		return new Hex(qi, ri, si);
	}
	toXY(){
		//based on an assumed "size" of 1. this means their inner radius is <1.
		const q = this.q
		const r = this.r
		const x = ROOT3 * q + ROOT3 * 0.5 * r
		const y = 3/2 * r
		return [x, y]
	}
	toCircle(radius=1){
		const xy = this.toXY()
		return new Circle(xy[0], xy[1], radius)
	}

	//TODO: Still gives incorrect cells. Need to have it use two points instead of one
	//Probably just completely rewrite.
	lineDrawArc(targetCell, degrees) {
		// convert hex to pixel (pointy-top, size = 1)
		const toPixel = (h) => {
			return {
				x: Math.sqrt(3) * (h.q + h.r / 2),
				y: 1.5 * h.r
			};
		};

		const origin = toPixel(this);
		const target = toPixel(targetCell);
		const dx = target.x - origin.x;
		const dy = target.y - origin.y;

		const steps = Math.max(1, Math.ceil(Math.abs(degrees)));
		const results = [];
		const seen = new Set();

		for (let i = 0; i <= steps; i++) {
			const angleRad = (degrees * i / steps) * Math.PI / 180;
			const cos = Math.cos(angleRad), sin = Math.sin(angleRad);
			const rx = (cos * dx - sin * dy);
			const ry = (sin * dx + cos * dy);
			const px = origin.x + rx;
			const py = origin.y + ry;

			// pixel -> axial (pointy-top)
			const qf = (Math.sqrt(3) / 3) * px - (1 / 3) * py;
			const rf = (2 / 3) * py;
			const sf = -qf - rf;

			// round to nearest cube coordinates
			let rq = Math.round(qf), rr = Math.round(rf), rs = Math.round(sf);
			const qDiff = Math.abs(rq - qf), rDiff = Math.abs(rr - rf), sDiff = Math.abs(rs - sf);
			if (qDiff > rDiff && qDiff > sDiff) {
				rq = -rr - rs;
			} else if (rDiff > sDiff) {
				rr = -rq - rs;
			} else {
				rs = -rq - rr;
			}

			const key = `${rq},${rr},${rs}`;
			if (!seen.has(key)) {
				seen.add(key);
				results.push(new Hex(rq, rr, rs));
			}
		}

		return results;
	}
}
Hex.directions = [new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]
Hex.diagonals = [new Hex(2, -1, -1), new Hex(1, -2, 1), new Hex(-1, -1, 2), new Hex(-2, 1, 1), new Hex(-1, 2, -1), new Hex(1, 1, -2)]

export class Grid {
	constructor() {
		this.map = new Map()
		this.contents = []
		this.minQ = 0
		this.maxQ = 0
		this.minR = 0
		this.maxR = 0
	}
	getKey(q, r, s) {
		return `${q},${r},${s}`
	}
	addHex(hex) {
		const q = Math.floor(hex.q)
		const r = Math.floor(hex.r)
		const s = Math.floor(hex.s)
		const key = this.getKey(q, r, s)
		this.map.set(key, hex)
	}
	fill(minQ, maxQ, minR, maxR) {
		const map = this.map
		if (minQ >= this.minQ && maxQ <= this.minQ && minR >= this.minR && maxR <= this.maxR) {
			//we're done. return
			return
		}
		let tryCount = 0
		let addedCount = 0

		const tryToAdd = (q, r) => {
			tryCount++
			let s = -q - r
			const key = this.getKey(q, r, s)
			if (!map.has(key)) {
				let hex = new Hex(q, r, s)
				this.addHex(hex)
				addedCount++
			}
		}

		if (map.size === 0) {
			for (let r = minR; r <= maxR; r++) {
				//Because the hex grid is rectangular, every two rows, the starting point for q will move one unit back.
				let offset = floor(-r * 0.5)
				for (let q = minQ + offset; q <= maxQ + offset; q++) {
					tryToAdd(q, r)
				}
			}
			return
		}

		if (minR < this.minR) {
			for (let r = minR; r <= this.minR; r++) {
				let offset = floor(-r * 0.5)
				for (let q = this.minQ + offset; q <= this.maxQ + offset; q++) {
					tryToAdd(q, r)
				}
			}
			this.minR = minR
		}
		if (maxR > this.maxR) {
			for (let r = this.maxR; r <= maxR; r++) {
				let offset = floor(-r * 0.5)
				for (let q = this.minQ + offset; q <= this.maxQ + offset; q++) {
					tryToAdd(q, r)
				}
			}
			this.maxR = maxR
		}
		if (minQ < this.minQ) {
			for (let r = this.minR; r <= this.maxR; r++) {
				let offset = floor(-r * 0.5)
				for (let q = minQ + offset; q <= this.maxQ + offset; q++) {
					tryToAdd(q, r)
				}
			}
			this.minQ = minQ
		}
		if (maxQ > this.maxQ) {
			for (let r = this.minR; r <= this.maxR; r++) {
				let offset = floor(-r * 0.5)
				for (let q = this.minQ + offset; q <= maxQ + offset; q++) {
					tryToAdd(q, r)
				}
			}
			this.maxQ = maxQ
		}
	}
	findHex(q, r, s) {
		const key = this.getKey(q, r, s)
		return this.map.get(key)
	}
	getHexAt(q, r) {
		const s = -q - r
		let hex = this.findHex(q, r, s)
		if (!hex) {
			hex = new Hex(q, r, s)
			this.addHex(hex)
		}
		return hex
	}
}

export class Component {
	constructor() {
		this.type = null
		this.atoms = new Grid()
		this.bonds = new Grid()
		this.arms = new Grid()
		this.isGhost = false
		this.isRendered = true
		this.rotation = 0
		this.homeTile = new Hex(0, 0, 0)
		this.currentHexRotation = 0
		this.offset = Hex.directions[0]
		this.offsetDistance = 0

		//These values are remembered and not changed during playback, so that the component can be reset to where it was before playback began.
		this.startingHomeTile = new Hex(0, 0, 0)
		this.startingRotation = 0
	}
	
	clone() {
		console.warn("Uh oh! You never handled", this)
	}
	moveOrigin(b) {
		let origin = this.homeTile
		origin.q += b.q
		origin.r += b.r
		origin.s += b.s
		let atoms = this.atoms
		for (let atom of atoms.contents) {
			let dest = atom.coord.subtract(b)
			atom.setCoords(dest.q, dest.r, dest.s)
		}
	}
	rotateLeft() {
		let atoms = this.atoms
		for (let atom of atoms.contents) {
			let coord = atom.coord
			atom.setCoords(-coord.s, -coord.q, -coord.r)
		}
		let arms = this.arms
		for (let arm of arms.contents) {
			let coord = arm.direction
			arm.setCoords(-coord.s, -coord.q, -coord.r)
		}
		this.currentHexRotation = (this.currentHexRotation - 1 + Hex.directions.length) % Hex.directions.length
	}
	rotateRight() {
		let atoms = this.atoms
		for (let atom of atoms.contents) {
			let coord = atom.coord
			atom.setCoords(-coord.r, -coord.s, -coord.q)
		}
		let arms = this.arms
		for (let arm of arms.contents) {
			let coord = arm.direction
			arm.setCoords(-coord.r, -coord.s, -coord.q)
		}
		this.currentHexRotation = (this.currentHexRotation + 1) % Hex.directions.length
	}
}

export const ELEMENTS = {}
export class Element {
	constructor(options) {
		this.id = options.id
		this.spriteMap = options.sprites
		this.sprites = {}
		this.loaded = false
	}

	async load() {
		let promises = []
		for (let spriteName in this.spriteMap) {
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
	constructor(elementId) {
		this.element = ELEMENTS[elementId]
		this.coord = new Hex(0, 0, 0)
	}
	clone() {
		let clone = new Atom(this.element.id)
		clone.coord = this.coord.clone()
		return clone
	}
	setCoords(q, r, s) {
		this.coord = new Hex(q, r, s)
	}
}

export const BONDTYPES = {}
export class BondType {
	constructor(id){
		this.id = id
	}
}
BONDTYPES["simple"] = new BondType("simple")

export class Bond {
	constructor(atom1, atom2) {
		this.atoms = [atom1, atom2]
		this.type = BONDTYPES["simple"]
	}
}

export class Molecule extends Component {
	constructor() {
		super()
		this.type = "Molecule"
	}
	clone() {
		let clone = new Molecule()
		clone.homeTile = this.homeTile
		for (let atom of this.atoms.contents){
			clone.atoms.contents.push(atom.clone())
		}
		for (let bond of this.bonds.contents){
			let atom1 = bond.atoms[0]
			let atom2 = bond.atoms[1]
			let atom1Index = this.atoms.contents.indexOf(atom1)
			let atom2Index = this.atoms.contents.indexOf(atom2)
			let atom1Clone = clone.atoms.contents[atom1Index]
			let atom2Clone = clone.atoms.contents[atom2Index]
			let bondClone = new Bond(atom1Clone, atom2Clone)
			clone.bonds.contents.push(bondClone)
		}
		return clone
	}
	addAtom(atom) {
		//Ensure that no other atom is taking up this space.
		let taken = false
		let q = atom.coord.q
		let r = atom.coord.r
		for (let otherAtom of this.atoms.contents) {
			if (q === otherAtom.coord.q || r === otherAtom.coord.r) {
				taken = true
				break
			}
		}
		if (taken) {
			console.error("Content intersected:")
			console.log(this, atom)
		}
		this.atoms.contents.push(atom)
	}
	addBond(atom1, atom2, type = "simple") {
		if (atom1.coord.distance(atom2.coord) !== 1) {
			console.error("These two atoms are too far apart to be bonded:")
			console.log(atom1, atom2)
		}
		let bond = new Bond(atom1, atom2, type)
		let taken = false
		for (let otherBond of this.bonds.contents) {
			if (otherBond.atom.includes(atom1) && otherBond.atoms.includes(atom2) && type === otherBond.type) {
				console.error("Duplicate bond detected!")
				console.log(this, bond, otherBond, atom1, atom2)
				taken = true
				break
			}
		}
		if (!taken) {
			this.bonds.contents.push(bond)
		}
	}
}

export class Reagent extends Component {
	constructor(molecule) {
		super()
		this.type = "Reagent"
		this.molecule = molecule
	}

	clone() {
		let molecule = this.molecule.clone()
		let clone = new Reagent(molecule)
		clone.homeTile = this.homeTile
		return clone
	}
}

export const ARMTYPES = {}
export class ArmMechanismType {
	constructor(id, abilities = {}, armDirectionList = [Hex.directions[0]], atomList = []) {
		this.id = id
		this.armDirectionList = armDirectionList
		this.atomList = atomList
		this.abilities = {
			"rotator_ccw": true,
			"rotator_cw": true,
			"pivot_ccw": true,
			"pivot_cw": true,
			"piston_extend": false,
			"piston_retract": false,
			"grabber_grab": true,
			"grabber_drop": true,
		}
		for (let ability in this.abilities) {
			if (ability in abilities) {
				this.abilities[ability] = abilities[ability]
			}
		}
	}
}
ARMTYPES["Piston"] = new ArmMechanismType("Piston", {
	"piston_extend": true,
	"piston_retract": true
})

export class ArmMechanism extends Component {
	constructor(typeId) {
		super()
		this.type = "ArmMechanism"
		let type = ARMTYPES[typeId]
		this.mechanismType = type
		this.program = null
		for (let armLocation of type.armDirectionList) {
			let arm = new Arm(this.homeTile, armLocation)
			this.arms.contents.push(arm)
		}
	}

	clone() {
		let clone = new ArmMechanism(this.mechanismType.id)
		clone.homeTile = this.homeTile
		clone.arms.contents.length = 0
		let origin = new Hex(0, 0, 0)
		for (let arm of this.arms.contents) {
			let armClone = new Arm(origin, arm.direction)
			clone.arms.contents.push(armClone)
		}
		clone.program = this.program.clone(clone)
		return clone
	}
}

export class Arm {
	constructor(home, hand) {
		//Arms remember their coordinates by storing the distance of their arm and a normal vector that shows the direction.
		this.distance = home.distance(hand)
		this.direction = hand
		this.isGripping = false
		this.grippedComponent = null
	}
	setDirection(q, r, s) {
		this.direction = new Hex(q, r, s)
	}
	setCoords(q, r, s) {
		this.direction = new Hex(q, r, s)
	}
}