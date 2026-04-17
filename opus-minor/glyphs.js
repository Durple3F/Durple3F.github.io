import { atomRenderSize } from "./config.js";
import { ELEMENTS } from "./elements.js";
import { loadSound, playSound } from "./sounds.js";
import { clamp, Component, Hex, Molecule } from "./util.js";
import { loadSprite } from "./util.js";

export class GlyphInput {
	constructor(name, type, location) {
		this.name = name
		this.type = type
		this.coord = location
	}
	setCoords(q, r, s) {
		this.coord = new Hex(q, r, s)
	}
	clone() {
		let clone = new GlyphInput(this.name, this.type, this.coord)
		return clone
	}
}

export const GLYPHTYPES = {}
export class GlyphType {
	constructor(options) {
		this.id = options.id
		this.spriteMap = options.sprites
		this.sounds = options.sounds
		this.sprites = {}
		this.loaded = false
		this.execute = options.execute
		this.render = options.render
		this.inputs = options.inputs
		GLYPHTYPES[this.id] = this
	}

	async load() {
		let promises = []
		for (let spriteName in this.spriteMap) {
			let url = this.spriteMap[spriteName]
			let p = loadSprite(url)
				.then(img => this.sprites[spriteName] = img)
			promises.push(p)
		}
		for (let sound of this.sounds) {
			let id = sound.id
			let url = sound.url
			let category = sound.category ?? "sfx"
			let p = loadSound(id, url, category)
			promises.push(p)
		}
		return await Promise.all(promises)
	}
}

function combineMolecules(moleculeA, moleculeB, game, level){
	let newHomeTile = moleculeA.homeTile
	let atoms = moleculeB.atoms.contents
	let bondsA = moleculeA.bonds.contents
	let bondsB = moleculeB.bonds.contents
	let difference = moleculeB.homeTile.subtract(moleculeA.homeTile)
	for (let atom of atoms) {
		let newCoord = atom.coord.add(difference)
		atom.setCoords(newCoord.q, newCoord.r, newCoord.s)
		moleculeA.addAtom(atom)
	}
	for (let bond of bondsB){
		moleculeA.addBond(bond.atoms[0], bond.atoms[1], bond.type.id)
	}
	//Replace moleculeA as the gripped component of all arms that were holding moleculeB.
	const components = level.grid.contents
	for (let component of components) {
		if (component.type !== "ArmMechanism") continue
		let arms = component.arms.contents
		for (let arm of arms) {
			if (arm.grippedComponent === moleculeB) {
				arm.grippedComponent = moleculeA
			}
		}
	}
	game.deleteComponent(moleculeB, level)
}

new GlyphType({
	id: "Glyph of Bonding",
	sprites: {
		base: "./src/img/glyphs/bonder_base.png",
		ring: "./src/img/glyphs/bonder_ring.png",
		bond: "./src/img/glyphs/bonder_bond.png",
		cylinder: "./src/img/glyphs/bonder_bond_cylinder.png",
	},
	sounds: [
		{
			id: "glyph_bonding",
			url: "./src/sounds/glyph_bonding.mp3",
			category: "sfx"
		}
	],
	inputs: [
		new GlyphInput("a", "ring", new Hex(0, 0, 0)),
		new GlyphInput("b", "ring", Hex.directions[0])
	],
	execute: function (game, level, inputs) {
		let inputA = inputs["a"]
		let inputB = inputs["b"]
		if (!inputA || !inputB) return

		let atomA = inputA.atom
		let moleculeA = inputA.molecule
		let atomB = inputB.atom
		let moleculeB = inputB.molecule

		//If these are different molecules, merge them into moleculeA.
		if (moleculeA !== moleculeB) {
			combineMolecules(moleculeA, moleculeB, game, level)
		}

		//If no simple bond exists, add a simple bond between atomA and atomB in moleculeA.
		let bonds = moleculeA.bonds.contents
		let bondExists = false
		for (let bond of bonds) {
			if (bond.type.id === "simple" && bond.atoms.includes(atomA) && bond.atoms.includes(atomB)) {
				bondExists = true
				break
			}
		}
		if (!bondExists) {
			playSound("glyph_bonding")
			moleculeA.addBond(atomA, atomB, "simple")
		}
	},
	render: function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
		const ringSize = atomRenderSize * hexSize * 1.15
		const baseSprite = this.sprites["base"]
		ctx.translate(x, y)
		const angle = glyph.rotation - (glyph.currentHexRotation * Math.PI / 3)
		ctx.rotate(angle)
		ctx.drawImage(baseSprite, - horiz * 0.5, - vert * 2 / 3, horiz * 2, vert * 4 / 3)

		//extras
		const bondSprite = this.sprites["bond"]
		const cylinderSprite = this.sprites["cylinder"]
		const centerX = horiz * 0.5
		const bondWidth = ringSize * 0.7
		const bondHeight = ringSize * 1.18
		const cylWidth = bondWidth
		const cylHeight = bondHeight * 0.42
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.drawImage(cylinderSprite, centerX - cylWidth * 0.5, -cylHeight * 0.5, cylWidth, cylHeight)
		ctx.rotate(-angle)

		//rings
		const ringSprite = this.sprites["ring"]
		ctx.drawImage(ringSprite, -ringSize, -ringSize, ringSize * 2, ringSize * 2)
		const otherRingHex = Hex.directions[glyph.currentHexRotation]
		const otherRingHexXY = otherRingHex.toXY()
		otherRingHexXY[0] *= hexSize
		otherRingHexXY[1] *= hexSize
		ctx.drawImage(ringSprite, otherRingHexXY[0] - ringSize, otherRingHexXY[1] - ringSize, ringSize * 2, ringSize * 2)
	}
})
new GlyphType({
	id: "Glyph of Multi-bonding",
	sprites: {
		base: "./src/img/glyphs/multibond/speed_bonder_base.png",
		ring: "./src/img/glyphs/bonder_ring.png",
		bond: "./src/img/glyphs/bonder_bond.png",
		cylinder: "./src/img/glyphs/bonder_bond_cylinder.png",
		cylinder2: "./src/img/glyphs/multibond/cylinder2.png",
	},
	sounds: [
		{
			id: "glyph_bonding",
			url: "./src/sounds/glyph_bonding.mp3",
			category: "sfx"
		}
	],
	inputs: [
		new GlyphInput("a", "ring", new Hex(0, 0, 0)),
		new GlyphInput("b", "ring", Hex.directions[0]),
		new GlyphInput("c", "ring", Hex.directions[2]),
		new GlyphInput("d", "ring", Hex.directions[4]),
	],
	execute: function (game, level, inputs) {
		let inputA = inputs["a"]
		let inputB = inputs["b"]
		let inputC = inputs["c"]
		let inputD = inputs["d"]
		if (!inputA) return
		if (!inputB && !inputC && !inputD) return
		let center = inputA
		let edges = [inputB, inputC, inputD]
		let added = false
		for (let input of edges){
			if (!input) continue
			let atomA = center.atom
			let moleculeA = center.molecule
			let atomB = input.atom
			let moleculeB = input.molecule

			//If these are different molecules, merge them into moleculeA.
			if (moleculeA !== moleculeB) {
				combineMolecules(moleculeA, moleculeB, game, level)
			}
			//If no simple bond exists, add a simple bond between atomA and atomB in moleculeA.
			let bonds = moleculeA.bonds.contents
			let bondExists = false
			for (let bond of bonds) {
				if (bond.type.id === "simple" && bond.atoms.includes(atomA) && bond.atoms.includes(atomB)) {
					bondExists = true
					break
				}
			}
			if (!bondExists) {
				added = true
				moleculeA.addBond(atomA, atomB, "simple")
			}
		}
		if (added){
			playSound("glyph_bonding")
		}
	},
	render: function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
		const ringSize = atomRenderSize * hexSize * 1.15
		const baseSprite = this.sprites["base"]
		ctx.translate(x, y)
		const angle = glyph.rotation - (glyph.currentHexRotation * Math.PI / 3)
		ctx.rotate(angle)
		ctx.drawImage(baseSprite, - horiz * 1, - vert * 5 / 3, horiz * 2.5, vert * 10 / 3)

		//extras
		const bondSprite = this.sprites["bond"]
		const cylinderSprite = this.sprites["cylinder"]
		const cylinderSprite2 = this.sprites["cylinder2"]
		const centerX = horiz * 0.5
		const bondWidth = ringSize * 0.7
		const bondHeight = ringSize * 1.18
		const cylWidth = bondWidth
		const cylHeight = bondHeight * 0.42
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.drawImage(cylinderSprite, centerX - cylWidth * 0.5, -cylHeight * 0.5, cylWidth, cylHeight)
		ctx.rotate(Math.PI * 2 / 3)
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.drawImage(cylinderSprite2, centerX - cylWidth * 0.5, -cylHeight * 0.5, cylWidth, cylHeight)
		ctx.rotate(Math.PI * 2 / 3)
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.drawImage(cylinderSprite, centerX - cylWidth * 0.5, -cylHeight * 0.5, cylWidth, cylHeight)
		ctx.rotate(-angle + Math.PI * -4 / 3)

		//rings
		const ringSprite = this.sprites["ring"]
		ctx.drawImage(ringSprite, -ringSize, -ringSize, ringSize * 2, ringSize * 2)
		const otherRingHex = Hex.directions[glyph.currentHexRotation]
		const otherRingHexXY = otherRingHex.toXY()
		otherRingHexXY[0] *= hexSize
		otherRingHexXY[1] *= hexSize
		ctx.translate(otherRingHexXY[0], otherRingHexXY[1])
		ctx.drawImage(ringSprite, - ringSize, - ringSize, ringSize * 2, ringSize * 2)
		ctx.translate(-otherRingHexXY[0], -otherRingHexXY[1])

		ctx.rotate(Math.PI * 2 / 3)
		ctx.translate(otherRingHexXY[0], otherRingHexXY[1])
		ctx.rotate(Math.PI * -2 / 3)
		ctx.drawImage(ringSprite, - ringSize, - ringSize, ringSize * 2, ringSize * 2)
		ctx.rotate(Math.PI * 2 / 3)
		ctx.translate(-otherRingHexXY[0], -otherRingHexXY[1])

		ctx.rotate(Math.PI * 2 / 3)
		ctx.translate(otherRingHexXY[0], otherRingHexXY[1])
		ctx.rotate(Math.PI * -4 / 3)
		ctx.drawImage(ringSprite, - ringSize, - ringSize, ringSize * 2, ringSize * 2)
		ctx.rotate(Math.PI * 4 / 3)
		ctx.translate(-otherRingHexXY[0], -otherRingHexXY[1])
	}
})
new GlyphType({
	id: "Glyph of Unbonding",
	sprites: {
		base: "./src/img/glyphs/unbonder/base.png",
		ring: "./src/img/glyphs/bonder_ring.png",
		bond: "./src/img/glyphs/unbonder/bond.png",
		cylinder: "./src/img/glyphs/unbonder/cylinder.png",
	},
	sounds: [
		{
			id: "glyph_unbonding",
			url: "./src/sounds/glyph_unbonding.mp3",
			category: "sfx"
		}
	],
	inputs: [
		new GlyphInput("a", "ring", new Hex(0, 0, 0)),
		new GlyphInput("b", "ring", Hex.directions[0])
	],
	execute: function (game, level, inputs) {
		let inputA = inputs["a"]
		let inputB = inputs["b"]
		if (!inputA || !inputB) return

		let atomA = inputA.atom
		let moleculeA = inputA.molecule
		let atomB = inputB.atom
		let moleculeB = inputB.molecule

		//If these are different molecules, they can't be unbonded, so do nothing.
		if (moleculeA !== moleculeB) {
			return
		}

		//Remove all bonds of any kind connecting these two atoms.
		let removed = 0
		let bondsA = moleculeA.bonds.contents
		for (let i = 0; i < bondsA.length; i++){
			let bond = bondsA[i]
			if (bond.atoms.includes(atomA) && bond.atoms.includes(atomB)){
				bondsA.splice(i, 1)
				i--
				removed = true
				continue
			}
		}
		if (removed){
			playSound("glyph_unbonding")
		}

		//Determine whether these atoms are still connected
		let atomsA = [atomA]
		for (let i = 0; i < atomsA.length; i++){
			let atom = atomsA[i]
			let thoseBonds = bondsA.filter(bond => bond.atoms.includes(atom))
			let newBonds = thoseBonds.filter(bond => bond.atoms.some(atom => !atomsA.includes(atom)))
			let newAtoms = newBonds.flatMap(bond => bond.atoms.filter(atom => !atomsA.includes(atom)))
			newAtoms.forEach(atom => atomsA.push(atom))
		}

		let atomsB = []
		for (let atom of moleculeA.atoms.contents){
			if (!atomsA.includes(atom)){
				atomsB.push(atom)
			}
		}

		if (atomsB.length === 0){
			//Awesome there's the same, we're done here
			return
		}
		//Disconnect all atoms of atomsB into their own molecule
		let newMolecule = new Molecule()
		newMolecule.homeTile = moleculeA.homeTile
		for (let atom of atomsB){
			let oldAtoms = moleculeA.atoms.contents
			oldAtoms.splice(oldAtoms.indexOf(atom), 1)
			newMolecule.addAtom(atom)
		}
		//Find all the bonds connecting atoms that WERE in moleculeA, but are now in the new molecule.
		for (let bond of bondsA){
			if (atomsB.includes(bond.atoms[0]) && atomsB.includes(bond.atoms[1])){
				bondsA.splice(bondsA.indexOf(bond), 1)
				newMolecule.addBond(bond.atoms[0], bond.atoms[1], bond.type.id)
			}
		}
		game.addComponent(newMolecule, level)
	},
	render: function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
		const ringSize = atomRenderSize * hexSize * 1.07
		const baseSprite = this.sprites["base"]
		ctx.translate(x, y)
		const angle = glyph.rotation - (glyph.currentHexRotation * Math.PI / 3)
		ctx.rotate(angle)
		ctx.drawImage(baseSprite, - horiz * 0.5, - vert * 2 / 3, horiz * 2, vert * 4 / 3)

		//extras
		const bondSprite = this.sprites["bond"]
		const cylinderSprite = this.sprites["cylinder"]
		const centerX = horiz * 0.5
		const bondWidth = ringSize * 0.7
		const bondHeight = ringSize * 1.18
		const cylWidth = bondWidth
		const cylHeight = bondHeight * 0.42
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.drawImage(cylinderSprite, centerX - cylWidth * 0.5, -cylHeight * 0.5, cylWidth, cylHeight)
		ctx.rotate(-angle)

		//rings
		const ringSprite = this.sprites["ring"]
		ctx.drawImage(ringSprite, -ringSize, -ringSize, ringSize * 2, ringSize * 2)
		const otherRingHex = Hex.directions[glyph.currentHexRotation]
		const otherRingHexXY = otherRingHex.toXY()
		otherRingHexXY[0] *= hexSize
		otherRingHexXY[1] *= hexSize
		ctx.drawImage(ringSprite, otherRingHexXY[0] - ringSize, otherRingHexXY[1] - ringSize, ringSize * 2, ringSize * 2)
	}
})
new GlyphType({
	id: "Glyph of Projection",
	sprites: {
		base: "./src/img/glyphs/projection/base.png",
		ring: "./src/img/glyphs/projection/metal_bowl.png",
		hole: "./src/img/glyphs/projection/quicksilver_input.png",
		bond: "./src/img/glyphs/projection/bond.png",
		quicksilver_symbol: "./src/img/glyphs/projection/quicksilver_symbol.png",
		lead_symbol: "./src/img/glyphs/projection/lead_symbol.png",
	},
	sounds: [
		{
			id: "glyph_projection",
			url: "./src/sounds/glyph_projection.mp3",
			category: "sfx"
		}
	],
	inputs: [
		new GlyphInput("quicksilver", "hole", new Hex(0, 0, 0)),
		new GlyphInput("metal", "ring", Hex.directions[0])
	],
	execute: function (game, level, inputs) {
		let quicksilverInput = inputs["quicksilver"]
		let metalInput = inputs["metal"]
		if (!quicksilverInput || !metalInput) return
		if (quicksilverInput.molecule.atoms.contents.length > 1) return
		if (quicksilverInput.held) return
		let properties = metalInput.atom.element.properties
		let tags = properties.tags
		if (!tags.includes("metal")) return
		if (!("metalicity" in properties)) return
		let metalicity = properties.metalicity
		if (!(typeof metalicity === "number")) return
		let next = metalicity + 1
		let nextElement = null
		for (let elementId in ELEMENTS){
			let element = ELEMENTS[elementId]
			let thoseProperties = element.properties
			let thoseTags = thoseProperties.tags
			if (!thoseTags.includes("metal")) continue
			let thatMetalicity = thoseProperties.metalicity
			if (thatMetalicity !== next) continue
			nextElement = element
			break
		}
		if (nextElement){
			metalInput.atom.element = nextElement
			playSound("glyph_projection")
			game.deleteComponent(quicksilverInput.molecule, level)
		}
	},
	render: function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
		const ringSize = atomRenderSize * hexSize * 1.15
		const baseSprite = this.sprites["base"]
		ctx.translate(x, y)
		const angle = glyph.rotation - (glyph.currentHexRotation * Math.PI / 3)
		ctx.rotate(angle)
		ctx.drawImage(baseSprite, - horiz * 0.5, - vert * 2 / 3, horiz * 2, vert * 4 / 3)

		//extras
		const bondSprite = this.sprites["bond"]
		const centerX = horiz * 0.5
		const bondWidth = ringSize * 0.7
		const bondHeight = ringSize * 0.7
		ctx.drawImage(bondSprite, centerX - bondWidth * 0.5, -bondHeight * 0.5, bondWidth, bondHeight)
		ctx.rotate(-angle)

		//rings
		const ringSprite = this.sprites["ring"]
		const holeSprite = this.sprites["hole"]
		ctx.drawImage(holeSprite, -ringSize, -ringSize, ringSize * 2, ringSize * 2)
		const otherRingHex = Hex.directions[glyph.currentHexRotation]
		const otherRingHexXY = otherRingHex.toXY()
		otherRingHexXY[0] *= hexSize
		otherRingHexXY[1] *= hexSize
		ctx.drawImage(ringSprite, otherRingHexXY[0] - ringSize, otherRingHexXY[1] - ringSize, ringSize * 2, ringSize * 2)

		//rings
		const quickSprite = this.sprites["quicksilver_symbol"]
		const leadSprite = this.sprites["lead_symbol"]
		const quickWidth = ringSize * 0.7
		const quickHeight = ringSize * 1.2
		ctx.drawImage(quickSprite, -quickWidth * 0.5, -quickHeight * 0.5, quickWidth, quickHeight)
		const leadWidth = ringSize * 0.77
		const leadHeight = ringSize * 0.77
		ctx.drawImage(leadSprite, otherRingHexXY[0] - leadWidth * 0.5, otherRingHexXY[1] - leadHeight * 0.5, leadWidth, leadHeight)
	}
})
new GlyphType({
	id: "Glyph of Calcification",
	sprites: {
		base: "./src/img/glyphs/calcification/calcinator_base.png",
		ring: "./src/img/glyphs/calcification/calcinator_bowl.png",
		symbols: "./src/img/glyphs/calcification/calcinator_symbols.png",
		flash_1: "./src/img/glyphs/calcification/flash/calcify_glyph_0001.png",
		flash_2: "./src/img/glyphs/calcification/flash/calcify_glyph_0002.png",
		flash_3: "./src/img/glyphs/calcification/flash/calcify_glyph_0003.png",
		flash_4: "./src/img/glyphs/calcification/flash/calcify_glyph_0004.png",
		flash_5: "./src/img/glyphs/calcification/flash/calcify_glyph_0005.png",
		flash_6: "./src/img/glyphs/calcification/flash/calcify_glyph_0006.png",
		flash_7: "./src/img/glyphs/calcification/flash/calcify_glyph_0007.png",
		flash_8: "./src/img/glyphs/calcification/flash/calcify_glyph_0008.png",
		flash_9: "./src/img/glyphs/calcification/flash/calcify_glyph_0009.png",
		flash_10: "./src/img/glyphs/calcification/flash/calcify_glyph_0010.png",
	},
	sounds: [
		{
			id: "glyph_calcification",
			url: "./src/sounds/glyph_calcification.mp3",
			category: "sfx"
		}
	],
	inputs: [
		new GlyphInput("element", "ring", new Hex(0, 0, 0)),
	],
	execute: function (game, level, inputs) {
		let input = inputs["element"]
		if (!input) return
		let atom = input.atom
		let element = atom.element
		let tags = element.properties.tags
		if (!tags.includes("classical_element")) return
		input.atom.element = ELEMENTS["Salt"]
		playSound("glyph_calcification")
		this.data.lastActivation = performance.now()
	},
	render: function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
		const ringSize = atomRenderSize * hexSize * 1.15
		const baseSprite = this.sprites["base"]
		ctx.translate(x, y)
		const angle = glyph.rotation - (glyph.currentHexRotation * Math.PI / 3)
		ctx.rotate(angle)
		ctx.drawImage(baseSprite, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)

		//ring
		const ringSprite = this.sprites["ring"]
		ctx.drawImage(ringSprite, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)
		//symbols
		const symbolsSprite = this.sprites["symbols"]
		ctx.drawImage(symbolsSprite, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)

		if (glyph.data.lastActivation){
			let diff = performance.now() - glyph.data.lastActivation + 1
			let p = clamp(diff / 500, 0, 1)
			if (p <= 0.9){
				let frame = Math.floor(p * 10) + 1
				let flashName = `flash_${frame}`
				let frame2 = frame+1
				let flashName2 = `flash_${frame2}`
				let flash = this.sprites[flashName]
				let flash2 = this.sprites[flashName]
				let p2 = (p * 10) % 1
				// ctx.globalAlpha = p2
				// ctx.drawImage(flash2, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)
				ctx.globalAlpha = 1
				ctx.drawImage(flash, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)
			} else if (p > 0.9 && p !== 1){
				let p2 = (p * 10) % 1
				let flash = this.sprites["flash_10"]
				ctx.globalAlpha = 1 - p2
				ctx.drawImage(flash, - horiz * 0.5, - vert * 2 / 3, horiz, vert * 4 / 3)
			}
		}
	}
})

export class Glyph extends Component {
	constructor(typeId) {
		super()
		this.type = "Glyph"
		this.glyphType = GLYPHTYPES[typeId]
		for (let input of this.glyphType.inputs) {
			let clone = input.clone()
			this.inputs.contents.push(clone)
		}
		this.data = {}
	}
	clone() {
		let clone = new Glyph(this.glyphType.id)
		let inputs = this.inputs.contents
		for (let i = 0; i < inputs.length; i++) {
			let input = inputs[i]
			let cloneInput = clone.inputs.contents[i]
			cloneInput.setCoords(input.coord.q, input.coord.r, input.coord.s)
		}
		clone.homeTile = this.homeTile
		clone.currentHexRotation = this.currentHexRotation
		clone.rotationPoint = this.rotationPoint
		return clone
	}
	execute(game, level, inputs) {
		this.glyphType.execute.call(this, game, level, inputs)
	}
}