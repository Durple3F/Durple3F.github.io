import ControlManager from "./controls"
import { ELEMENTS } from "./elements"
import { playSound } from "./sounds"
import { loadSprite } from "./sprites"
import { Atom, choice, Circle, clearModal, getRandomSubarray, getWeightedRandom, Grid, Hex } from "./util"

const ROOT3 = Math.sqrt(3)
const sigmarSpriteUrls = {
	"board": "./src/img/sigmars-garden/board.png",
	"hover": "./src/img/sigmars-garden/atom_hovered.png",
	"dot": "./src/img/sigmars-garden/divider_dot.png",
	"line": "./src/img/sigmars-garden/divider_line.png",
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
		this.canShowWarning = rules.canShowWarning ?? false
		this.showWarningFunction = rules.showWarningFunction ?? (() => false)
		this.showStats = rules.showStats ?? false
		this.statsLocation = rules.statsLocation ?? {}
		SIGMARRULES[this.id] = this
	}
}
new SigmarElement("Salt", {
	matchesWith: ["Salt", "Air", "Fire", "Water", "Earth"],
	canShowWarning: true,
	showWarningFunction: (stat, atoms) => stat.count % 2 ? true : false,
	showStats: true,
	statsLocation: {
		x: 0.205,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Air", {
	matchesWith: ["Air", "Salt"],
	canShowWarning: true,
	showWarningFunction: (stat, atoms) => stat.count % 2 ? true : false,
	showStats: true,
	statsLocation: {
		x: 0.265,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Fire", {
	matchesWith: ["Fire", "Salt"],
	canShowWarning: true,
	showWarningFunction: (stat, atoms) => stat.count % 2 ? true : false,
	showStats: true,
	statsLocation: {
		x: 0.311,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Water", {
	matchesWith: ["Water", "Salt"],
	canShowWarning: true,
	showWarningFunction: (stat, atoms) => stat.count % 2 ? true : false,
	showStats: true,
	statsLocation: {
		x: 0.361,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Earth", {
	matchesWith: ["Earth", "Salt"],
	canShowWarning: true,
	showWarningFunction: (stat, atoms) => stat.count % 2 ? true : false,
	showStats: true,
	statsLocation: {
		x: 0.411,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Vitae", {
	matchesWith: ["Mors"]
})
new SigmarElement("Mors", {
	matchesWith: ["Vitae"]
})
new SigmarElement("Quicksilver", {
	matchesWith: ["Lead", "Tin", "Iron", "Copper", "Silver"],
	showStats: true,
	statsLocation: {
		x: 0.482,
		y: 0.9545,
		size: 0.26,
		showCount: true
	}
})
new SigmarElement("Lead", {
	matchesWith: ["Quicksilver"],
	showStats: true,
	statsLocation: {
		x: 0.542,
		y: 0.9545,
		size: 0.26,
	}
})
new SigmarElement("Tin", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead"],
	showStats: true,
	statsLocation: {
		x: 0.592,
		y: 0.9545,
		size: 0.26,
	}
})
new SigmarElement("Iron", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin"],
	showStats: true,
	statsLocation: {
		x: 0.642,
		y: 0.9545,
		size: 0.26,
	}
})
new SigmarElement("Copper", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin", "Iron"],
	showStats: true,
	statsLocation: {
		x: 0.692,
		y: 0.9545,
		size: 0.26,
	}
})
new SigmarElement("Silver", {
	matchesWith: ["Quicksilver"],
	disqualifyingElements: ["Lead", "Tin", "Iron", "Copper"],
	showStats: true,
	statsLocation: {
		x: 0.742,
		y: 0.9545,
		size: 0.26,
	}
})
new SigmarElement("Gold", {
	matchesSingleton: true,
	restrictedSpawning: true,
	allowedHexes: [new Hex(0, 0, 0)],
	showStats: true,
	statsLocation: {
		x: 0.792,
		y: 0.9545,
		size: 0.26,
	}
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

const sigmarVariants = {}
sigmarVariants["base"] = {
	counts: sigmarCounts
}

class SigmarAtom{
	constructor(typeId) {
		this.typeId = typeId
		let type = SIGMARRULES[this.typeId]
		this.element = ELEMENTS[type.elementId]
		this.coord = new Hex(0, 0, 0)
		this.renderX = 0
		this.renderY = 0
		this.renderSize = 0
		this.isSelected = false
		this.isHovered = false
		this.isHighlighted = false
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
class SigmarStat {
	constructor(){
		this.count = 0
		this.warning = false
		this.circle = new Circle(0, 0, 0)
		this.isHovered = false
		this.isSelected = false
	}
}

export class SigmarGarden{
	constructor(canvas, controls, variant="base"){
		this.canvas = canvas
		this.ctx = this.canvas.getContext("2d")
		this.controls = controls
		this.ruleset = sigmarVariants[variant]
		this.tickInterval = -1
		this.grid = new Grid()
		this.gridStats = {}
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
				console.log(selected.map(x=>x))
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
		this.updateStats()
	}
	doAtomsMatch(atom1, atom2){
		let type1 = SIGMARRULES[atom1.typeId]
		let type2 = SIGMARRULES[atom2.typeId]
		return type1.matchesWith.includes(type2.id) || type2.matchesWith.includes(type1.id)
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
	updateStats(){
		let atomStartCounts = this.ruleset.counts
		let stats = this.gridStats
		for (let atomTypeId in atomStartCounts){
			let stat = new SigmarStat()
			stats[atomTypeId] = stat
		}
		let atoms = this.grid.contents
		for (let atom of atoms){
			let atomTypeId = atom.typeId
			let stat = stats[atomTypeId]
			stat.count++
		}
		for (let atomTypeId in stats){
			let stat = stats[atomTypeId]
			let type = SIGMARRULES[atomTypeId]
			if (type.canShowWarning){
				stat.warning = type.showWarningFunction(stat, atoms)
			}
		}
		console.log(stats)
	}
	generate(){
		let result = new Grid()
		let atoms = result.contents

		const gridSize = 5

		//Encourages a donut of empty space around the central atom
		let innerBias = Math.random() * 5
		//Encourages bits that stick out from clumps of atoms
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
		let targetCounts = this.ruleset.counts
		for (let countName in targetCounts){
			neededCounts[countName] = targetCounts[countName]
			neededAtoms.push(countName)
		}

		//Create a list of all hexes that are special (because they are the only places where some atoms can spawn)
		let reservedHexes = {}
		for (let atomTypeId of neededAtoms){
			let possibilities = []
			let type = SIGMARRULES[atomTypeId]
			if (type.restrictedSpawning){
				reservedHexes[atomTypeId] = type.allowedHexes
			}
		}

		while (neededAtoms.length){
			let emptyHexList = [...emptyHexes.map.values()]
			let openEmptyHexes = emptyHexList.filter(hex => this.isHexOpen(hex, emptyHexes))

			//Stuff like salt occasionally forces a specific kind of match
			let forcedMatches = []
			for (let atomTypeId of neededAtoms){
				let count = neededCounts[atomTypeId]
				if (count > 1) continue
				let type = SIGMARRULES[atomTypeId]
				if (type.matchesSingleton) continue
				let totalCount = 0
				let matchingTypes = type.matchesWith.map(atomTypeId => SIGMARRULES[atomTypeId])
				for (let matchingType of matchingTypes){
					totalCount += neededCounts[matchingType.id]
					if (matchingType.id === atomTypeId){
						totalCount--
					}
				}
				if (totalCount === 1){
					let able = matchingTypes.find(type => {
						return type.id === atomTypeId ? neededCounts[type.id] > 1 : neededCounts[type.id] > 0
					})
					forcedMatches.push([atomTypeId, able.id])
				}
			}

			let atomPossibilities = {}
			for (let atomTypeId of neededAtoms){
				let possibilities = []
				let type = SIGMARRULES[atomTypeId]
				atomPossibilities[atomTypeId] = possibilities
				//If this type of atom would be disqualified because another type of atom has yet to be added,
				//we cannot add this one. This is because, since we are building the structure inwards,
				//we do not yet know whether we will have to place that disqualifying atom
				//somewhere inaccessible.
				if (type.disqualifyingElements){
					if (neededAtoms.some(atomTypeId => type.disqualifyingElements.includes(atomTypeId))){
						continue
					}
				}

				if (type.restrictedSpawning){
					//Atoms with restricted spawning can only spawn on tiles that are
					//A) in their list, B) empty, and C) currently open
					let allowedHexes = type.allowedHexes.filter(hex => emptyHexes.hasHex(hex))
					.filter(hex => this.isHexOpen(hex, emptyHexes))
					for (let hex of allowedHexes){
						let atom = new SigmarAtom(atomTypeId)
						atom.setCoords(hex.q, hex.r, hex.s)
						possibilities.push(atom)
					}
					continue
				}

				//Normally, atoms can spawn on any tiles that are
				//A) empty, B) currently open, and C) will not invalidate the possibilities of an atom with restricted spawning.
				let allowedHexes = openEmptyHexes
				for (let hex of allowedHexes){
					let invalidated = false
					for (let atomTypeId in reservedHexes){
						let reserved = reservedHexes[atomTypeId]
						if (reserved.length === 1 && reserved[0].equals(hex)){
							invalidated = true
							break
						}
					}
					if (invalidated) break
					let atom = new SigmarAtom(atomTypeId)
					atom.setCoords(hex.q, hex.r, hex.s)
					possibilities.push(atom)
				}
			}
			// console.log(neededCounts)
			// console.log(atomPossibilities)
			//Remove all possibilities whose only option would be to add another atom to the same location
			for (let atomTypeId of neededAtoms){
				let type = SIGMARRULES[atomTypeId]
				if (type.matchesSingleton) continue
				let matchingTypes = type.matchesWith.map(atomTypeId => SIGMARRULES[atomTypeId])
				atomPossibilities[atomTypeId] = atomPossibilities[atomTypeId].filter(possibility => {
					//Check there exists another distinct possibility for one of the matching types.
					return matchingTypes.some(type => {
						if (!atomPossibilities[type.id]) return false
						return atomPossibilities[type.id].some(otherPossibility => {
							if (possibility.coord.equals(otherPossibility.coord)) return false
							return true
						})
					})
				})
			}
			// console.log(atomPossibilities)
			let canAddTypes = neededAtoms.filter(atomTypeId => {
				let possibilities = atomPossibilities[atomTypeId]
				//If we can find nowhere to insert the atom,
				//obviously we can't add it.
				if (!possibilities.length) return false
				let type = SIGMARRULES[atomTypeId]
				//If we can add this atom and this atom alone,
				//awesome. We can do it.
				if (type.matchesSingleton) return true
				//Therefore this atom must be one of the normal 2-matching ones.
				//If we can find a placement that allows for the placement of a matching atom,
				//It's legal.
				//Then we can add it.
				return true
			})
			// console.log(canAddTypes)
			let atomTypeId = choice(canAddTypes)
			// if (!atomTypeId) atomTypeId = choice(neededAtoms)
			let type = SIGMARRULES[atomTypeId]
			let addedAtoms = []
			if (type.matchesSingleton){
				let atom = choice(atomPossibilities[atomTypeId])
				addedAtoms.push(atom)
			} else {
				let atom = choice(atomPossibilities[atomTypeId])
				if (atom){
					addedAtoms.push(atom)
					let matchingTypes = type.matchesWith.map(atomTypeId => SIGMARRULES[atomTypeId])
					let forcedMatch = forcedMatches.find(match => {
						return match.includes(atom.element.id)
					})
					if (forcedMatch) {
						matchingTypes = matchingTypes.filter(type => {
							return forcedMatch.includes(type.id)
						})
					}
					let possibleComplements = matchingTypes.map(type => {
						if (!atomPossibilities[type.id]) return []
						if (atom.element.id === type.id && neededCounts[type.id] <= 1) return []
						if (forcedMatch && !forcedMatch.includes(type.id)) return []
						return atomPossibilities[type.id].filter(possibility => {
							if (possibility.coord.equals(atom.coord)) return false
							return true
						})
					}).flat()
					// console.log(possibleComplements)
					if (possibleComplements.length){
						let complement = choice(possibleComplements)
						addedAtoms.push(complement)
					}
				}
			}

			for (let atom of addedAtoms){
				let atomTypeId = atom.element.id
				neededCounts[atomTypeId]--
				if (neededCounts[atomTypeId] <= 0){
					neededAtoms.splice(neededAtoms.indexOf(atomTypeId), 1)
				}
				emptyHexes.removeHex(atom.coord)
				atoms.push(atom)
				// console.log("Added",atom.element.id)
			}
			if (addedAtoms.length === 0){
				break
			}
		}

		return result
	}
	startNewGame(){
		let newGrid
		let attempts = 0
		while (!newGrid){
			try {
				attempts++
				newGrid = this.generate()
			} catch {
				//Do nothing
			}
		}
		this.grid = newGrid
		console.log(attempts)
		this.determineOpenAtoms()
		this.updateStats()
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

			if (atom.isHovered || atom.isSelected || atom.isHighlighted){
				const hover = sprites["hover"]
				const hoverW = atomW * 1.4
				const hoverH = atomH * 1.4
				ctx.save()
				ctx.globalAlpha = (atom.isSelected || atom.isHighlighted) ? 1 : 0.3
				ctx.drawImage(hover, atomX - hoverW * 0.5, atomY - hoverH * 0.5, hoverW, hoverH)
				ctx.restore()
			}
		}

		//Render stats at the bottom
		const stats = this.gridStats
		for (let atomTypeId in stats){
			const type = SIGMARRULES[atomTypeId]
			if (!type.showStats) continue
			const stat = stats[atomTypeId]
			const elementId = type.elementId
			const sprite = sprites[elementId]
			const location = type.statsLocation
			const size = location.size * hexSize
			const x = location.x * w
			const y = location.y * h
			const atomX = x
			const atomY = y
			const atomW = size * 2
			const atomH = size * 2
			ctx.save()
			ctx.globalAlpha = stat.count > 0 ? 1 : 0.3
			ctx.drawImage(sprite, atomX - size, atomY - size, atomW, atomH)
			stat.circle = new Circle(atomX, atomY, size)

			if (location.showCount){
				let color = stat.warning ? "#c0391a" : "#f2f2e8"
				let fontSize = size * 0.14
				ctx.font = `${size}px serif`
				ctx.fillStyle = color
				ctx.fillText(stat.count, x + size - fontSize, y - size + fontSize * 2)
			}
			ctx.globalAlpha = 1

			if (stat.isHovered){
				const hover = sprites["hover"]
				const hoverW = atomW * 1.4
				const hoverH = atomH * 1.4
				ctx.globalAlpha = stat.isSelected ? 1 : 0.3
				ctx.drawImage(hover, atomX - hoverW * 0.5, atomY - hoverH * 0.5, hoverW, hoverH)
			}

			ctx.restore()
		}

		const dotSprite = sprites["dot"]
		const lineSprite = sprites["line"]
		const dotSize = w * 0.005
		const lineW = w * 0.0035
		const lineH = h * 0.06
		ctx.drawImage(dotSprite, w * 0.235 - dotSize * 0.5, h * 0.956 - dotSize * 0.5, dotSize, dotSize)
		ctx.drawImage(lineSprite, w * 0.4475 - lineW * 0.5, h * 0.956 - lineH * 0.5, lineW, lineH)
		ctx.drawImage(dotSprite, w * 0.512 - dotSize * 0.5, h * 0.956 - dotSize * 0.5, dotSize, dotSize)
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

		let stats = this.gridStats
		let highlightedType = null
		for (let atomTypeId in stats){
			let stat = stats[atomTypeId]
			let circle = stat.circle
			if (circle.contains(mouseX, mouseY) && stat.count > 0){
				stat.isHovered = true
				if (controls.isClicking("left")){
					stat.isSelected = true
					highlightedType = atomTypeId
				} else {
					stat.isSelected = false
				}
			} else {
				stat.isHovered = false
				stat.isSelected = false
			}
		}
		for (let atom of atoms){
			if (atom.typeId === highlightedType){
				atom.isHighlighted = true
			} else {
				atom.isHighlighted = false
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
	constructor(event){
		this.event = event
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

		let helpSection = $("<div>").addClass("sigmars-help-section").appendTo(container)
		helpSection.hide()

		let hideHelpBtn = $("<div>").addClass("close-btn-container").appendTo(helpSection)
		$("<img>").attr("src", "./src/img/close_hover.png").addClass("hover-img").appendTo(hideHelpBtn)
		$("<img>").attr("src", "./src/img/close.png").addClass("normal-img").appendTo(hideHelpBtn)
		hideHelpBtn.on("click", () => {
			helpSection.hide()
		})

		let closeBtn = $("<div>").addClass("close-btn-container").appendTo(right)
		$("<img>").attr("src", "./src/img/close_hover.png").addClass("hover-img").appendTo(closeBtn)
		$("<img>").attr("src", "./src/img/close.png").addClass("normal-img").appendTo(closeBtn)
		closeBtn.on("click", () => {
			modal.hide()
		})

		let newGameButton = $("<button>").addClass("sigmars-new-game-btn").text("New Game").appendTo(right)
		const newGame = () => {
			sigmar.startNewGame()
		}
		newGameButton[0].addEventListener("click", newGame)

		let helpButton = $("<button>").addClass("sigmars-help-btn").appendTo(right)
		$("<img>").attr("src", "./src/img/sigmars-garden/diagram_icon_hover.png").addClass("hover-img").appendTo(helpButton)
		$("<img>").attr("src", "./src/img/sigmars-garden/diagram_icon.png").addClass("normal-img").appendTo(helpButton)
		const toggleHelp = () => {
			helpSection.show()
		}
		helpButton[0].addEventListener("click", toggleHelp)
		
		let modal = new bootstrap.Modal(modalTag[0], {
			keyboard: false
		})
		modal.toggle()

		modalTag.on("hidden.bs.modal", () => {
			resolve([
				{
					type: "set-completion",
					completed: true,
					eventId: this.event.id
				},
				{
					type: "change-scene",
					val: "level-select"
				}
			])
		})

		modalTag.on("shown.bs.modal", () => {
			canvas[0].width = canvas.width()
			canvas[0].height = canvas.height()
			sigmar.startTicks()
		})

		return promise
	}
}