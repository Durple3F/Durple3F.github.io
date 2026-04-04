import { atomRenderSize } from "./config.js";
import { Component, Hex } from "./util.js";
import { loadSprite } from "./util.js";

export const GLYPHTYPES = {}
export class GlyphType {
	constructor(options, renderFunction) {
		this.id = options.id
		this.spriteMap = options.sprites
		this.sprites = {}
		this.loaded = false
		this.render = renderFunction
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
	}
}