import { ELEMENTS } from "./elements";

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

export function find_angle(A, B, C) {
	var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
	var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
	return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}
export function cross_product(Ax, Ay, Bx, By, Cx, Cy) {
	let cross = (Cx - Bx)*(Ay - By) - (Cy - By)*(Ax - Bx)
	return cross
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

export class Rectangle {
	constructor (x, y, width, height){
		this.x = x
		this.y = y
		this.w = width
		this.h = height
	}
}
export class Circle {
	constructor(x, y, radius) {
		this.x = x
		this.y = y
		this.radius = radius
	}
	intersects(circle) {
		return Math.hypot(circle.x - this.x, circle.y - this.y) <= (circle.radius + this.radius)
	}
	contains(x, y) {
		return Math.hypot(x - this.x, y - this.y) <= this.radius
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
	toXY() {
		//based on an assumed "size" of 1. this means their inner radius is <1.
		const q = this.q
		const r = this.r
		const x = ROOT3 * q + ROOT3 * 0.5 * r
		const y = 3 / 2 * r
		return [x, y]
	}
	toCircle(radius = 1) {
		const xy = this.toXY()
		return new Circle(xy[0], xy[1], radius)
	}
	equals(b) {
		return this.q === b.q && this.r === b.r
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
		this.inputs = new Grid()
		this.molecule = null
		this.isGhost = false
		this.isRendered = true
		this.rotation = 0
		this.homeTile = new Hex(0, 0, 0)
		this.currentHexRotation = 0
		this.offset = Hex.directions[0]
		this.offsetDistance = 0

		this.renderRotationPoint = false
		this.rotationPoint = new Hex(1, 0, -1)
		this.lastPlacement = null
	}

	clone() {
		console.warn("Uh oh! You never handled", this)
	}
	moveOrigin(b) {
		const oldOrigin = this.homeTile
		this.homeTile = b
		const diff = oldOrigin.subtract(b)
		this.translate(diff)
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
		if (this.molecule){
			this.molecule.rotateLeft()
		}
		let inputs = this.inputs
		for (let input of inputs.contents) {
			let coord = input.coord
			input.setCoords(-coord.s, -coord.q, -coord.r)
		}
		this.rotationPoint = this.rotationPoint.rotateLeft()
		this.currentHexRotation = (this.currentHexRotation + 1) % Hex.directions.length
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
		if (this.molecule){
			this.molecule.rotateRight()
		}
		let inputs = this.inputs
		for (let input of inputs.contents) {
			let coord = input.coord
			input.setCoords(-coord.r, -coord.s, -coord.q)
		}
		this.rotationPoint = this.rotationPoint.rotateRight()
		this.currentHexRotation = (this.currentHexRotation - 1 + Hex.directions.length) % Hex.directions.length
	}
	translate(b) {
		const atoms = this.atoms
		for (let atom of atoms.contents) {
			let dest = atom.coord.add(b)
			atom.setCoords(dest.q, dest.r, dest.s)
		}
	}
}

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
	equals(otherAtom) {
		let coord1 = this.coord
		let coord2 = otherAtom.coord
		return this.element === otherAtom.element && coord1.q === coord2.q && coord1.r === coord2.r
	}
	setCoords(q, r, s) {
		this.coord = new Hex(q, r, s)
	}
}

export const BONDTYPES = {}
export class BondType {
	constructor(id) {
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
		for (let atom of this.atoms.contents) {
			clone.atoms.contents.push(atom.clone())
		}
		for (let bond of this.bonds.contents) {
			let atom1 = bond.atoms[0]
			let atom2 = bond.atoms[1]
			let atom1Index = this.atoms.contents.indexOf(atom1)
			let atom2Index = this.atoms.contents.indexOf(atom2)
			let atom1Clone = clone.atoms.contents[atom1Index]
			let atom2Clone = clone.atoms.contents[atom2Index]
			let bondClone = new Bond(atom1Clone, atom2Clone)
			clone.bonds.contents.push(bondClone)
		}
		clone.currentHexRotation = this.currentHexRotation
		clone.rotationPoint = this.rotationPoint
		return clone
	}
	equals(molecule) {
		//Two molecules are equivalent if for some translation, the atoms are in the same spots.
		let result = true
		let clone1 = this.clone()
		let clone2 = molecule.clone()
		let atoms1 = clone1.atoms.contents
		let atoms2 = clone2.atoms.contents
		let bonds1 = clone1.bonds.contents
		let bonds2 = clone2.bonds.contents
		//Empty molecules are equivalent
		if (!atoms1.length && !atoms2.length) return true
		//Molecules with an inequal number of atoms are inequal
		if (atoms1.length !== atoms2.length) return false
		//Molecules with an inequal number of bonds are inequal
		if (bonds1.length !== bonds2.length) return false
		//Find the atom of each molecule that has the smallest q, using r as a tiebreaker
		let bottomLeft1 = atoms1[0]
		let bottomLeft2 = atoms2[0]
		for (let i = 1; i < atoms1.length; i++) {
			let atom1 = atoms1[i]
			if (atom1.coord.q < bottomLeft1.coord.q || (atom1.coord.q === bottomLeft1.coord.q && atom1.coord.r < bottomLeft1.coord.r)) {
				bottomLeft1 = atom1
			}
			let atom2 = atoms2[i]
			if (atom2.coord.q < bottomLeft2.coord.q || (atom2.coord.q === bottomLeft2.coord.q && atom2.coord.r < bottomLeft2.coord.r)) {
				bottomLeft2 = atom2
			}
		}
		clone1.translate(bottomLeft1.coord.scale(-1))
		clone2.translate(bottomLeft2.coord.scale(-1))
		//Now that clone1 and clone2 are in the same orientation, test that for each atom inside each clone, there exists an equivalent atom in the other. Then do the same for the bonds.
		for (let atom1 of atoms1) {
			let hasEqual = false
			for (let atom2 of atoms2) {
				if (atom1.equals(atom2)) {
					hasEqual = true
					break
				}
			}
			if (!hasEqual) {
				result = false
				break
			}
		}
		//Neat! Now let's check that all of the bonds are the same.
		for (let bond1 of bonds1) {
			let hasEqual = false
			let atom1 = bond1.atoms[0]
			let atom2 = bond1.atoms[1]
			for (let bond2 of bonds2) {
				if (
					(atom1.equals(bond2.atoms[0]) && atom2.equals(bond2.atoms[1])) ||
					(atom1.equals(bond2.atoms[1]) && atom2.equals(bond2.atoms[0]))
				) {
					hasEqual = true
					break
				}
			}
			if (!hasEqual) {
				result = false
				break
			}
		}
		return result
	}
	addAtom(atom) {
		//Ensure that no other atom is taking up this space.
		let taken = false
		let q = atom.coord.q
		let r = atom.coord.r
		for (let otherAtom of this.atoms.contents) {
			if (q === otherAtom.coord.q && r === otherAtom.coord.r) {
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
			if (otherBond.atoms.includes(atom1) && otherBond.atoms.includes(atom2) && type === otherBond.type) {
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

export function createMolecule(moleculeRecipe) {
	let atomRecipeList = moleculeRecipe[0] ?? []
	let bondRecipeList = moleculeRecipe[1] ?? []
	//uses a simplified list of only the things that atoms NEED to create them
	//and a simplified list of only the indexes of the atoms that are linked in bonds (as well as their bond type.)
	let molecule = new Molecule()
	let atoms = []
	for (let atomRecipe of atomRecipeList) {
		let atom = new Atom(atomRecipe[0])
		let q = atomRecipe[1]
		let r = atomRecipe[2]
		let s = atomRecipe[3]
		atom.setCoords(q, r, s)
		atoms.push(atom)
	}
	for (let atom of atoms) {
		molecule.addAtom(atom)
	}
	for (let bondRecipe of bondRecipeList) {
		let atom1Index = bondRecipe[0]
		let atom2Index = bondRecipe[1]
		molecule.addBond(atoms[atom1Index], atoms[atom2Index], bondRecipe[2])
	}
	return molecule
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
		clone.currentHexRotation = this.currentHexRotation
		clone.rotationPoint = this.rotationPoint
		return clone
	}
}
export class Product extends Component {
	constructor(molecule) {
		super()
		this.type = "Product"
		this.molecule = molecule
	}

	clone() {
		let molecule = this.molecule.clone()
		let clone = new Product(molecule)
		clone.homeTile = this.homeTile
		clone.currentHexRotation = this.currentHexRotation
		clone.rotationPoint = this.rotationPoint
		return clone
	}
}