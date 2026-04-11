import { atomRenderSize } from "./config.js";
import { Component, Hex } from "./util.js";
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
	constructor(options, executeFunction, renderFunction) {
		this.id = options.id
		this.spriteMap = options.sprites
		this.sprites = {}
		this.loaded = false
		this.execute = executeFunction
		this.render = renderFunction
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
		return await Promise.all(promises)
	}
}
new GlyphType({
		id: "Glyph of Bonding",
		sprites: {
			base: "./src/img/glyphs/bonder_base.png",
			ring: "./src/img/glyphs/bonder_ring.png",
			bond: "./src/img/glyphs/bonder_bond.png",
			cylinder: "./src/img/glyphs/bonder_bond_cylinder.png",
		},
		inputs: [
			new GlyphInput("a", "ring", new Hex(0, 0, 0)),
			new GlyphInput("b", "ring", Hex.directions[0])
		]
	}, function (game, level, inputs){
		let inputA = inputs["a"]
		let inputB = inputs["b"]
		if (!inputA || !inputB) return
		
		let atomA = inputA.atom
		let moleculeA = inputA.molecule
		let atomB = inputB.atom
		let moleculeB = inputB.molecule

		//If these are different molecules, merge them into moleculeA.
		if (moleculeA !== moleculeB){
			let newHomeTile = moleculeA.homeTile
			let atoms = moleculeB.atoms.contents
			let difference = moleculeB.homeTile.subtract(moleculeA.homeTile)
			for (let atom of atoms){
				let newCoord = atom.coord.add(difference)
				atom.setCoords(newCoord.q, newCoord.r, newCoord.s)
				moleculeA.addAtom(atom)
			}
			//Replace moleculeA as the gripped component of all arms that were holding moleculeB.
			const components = level.grid.contents
			for (let component of components){
				if (component.type !== "ArmMechanism") continue
				let arms = component.arms.contents
				for (let arm of arms){
					if (arm.grippedComponent === moleculeB){
						arm.grippedComponent = moleculeA
					}
				}
			}
			game.deleteComponent(moleculeB, level)
		}

		//If no simple bond exists, add a simple bond between atomA and atomB in moleculeA.
		let bonds = moleculeA.bonds.contents
		let bondExists = false
		for (let bond of bonds){
			if (bond.type === "simple" && bond.atoms.includes(atomA) && bond.atoms.includes(atomB)){
				bondExists = true
			}
		}
		if (!bondExists){
			moleculeA.addBond(atomA, atomB, "simple")
		}
	}, function (ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
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
	}
	clone() {
		let clone = new Glyph(this.glyphType.id)
		let inputs = this.inputs.contents
		for (let i = 0; i < inputs.length; i++){
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