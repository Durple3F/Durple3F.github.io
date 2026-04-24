import { Hex, Atom, Molecule } from "./util.js";
import { drawCollisionCircles, drawGhostRotation, drawMoleculeHomeTile, atomRenderSize, drawHexCoords, hexDrawTheme, atomSize } from "./config.js";
import { TrackPiece } from "./track.js";
import Color from "https://colorjs.io/dist/color.js";
import { SPRITES } from "./sprites.js";

const TWOPI = 2 * Math.PI
const ROOT3 = Math.sqrt(3)
const max = Math.max
const min = Math.min
const floor = Math.floor
const ceil = Math.ceil
const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt

const hexColorCache = new Map()
const hexCache = new Map()

function drawTiledBackground(ctx, hex_base, backgroundOffsetX, backgroundOffsetY) {
	const tileW = hex_base.width;
	const tileH = hex_base.height;

	const canvasW = ctx.canvas.width;
	const canvasH = ctx.canvas.height;

	// Normalize offsets to prevent runaway values
	const offsetX = ((backgroundOffsetX % tileW) + tileW) % tileW;
	const offsetY = ((backgroundOffsetY % tileH) + tileH) % tileH;

	// Start slightly off-screen so edges are covered
	const startX = -offsetX;
	const startY = -offsetY;

	for (let x = startX; x < canvasW; x += tileW) {
		for (let y = startY; y < canvasH; y += tileH) {
			ctx.drawImage(hex_base, x, y);
		}
	}
}

function chooseHexBackground(rand){
	if (rand < 0.02){
		return "hex_1"
	} else if (rand < 0.04){
		return "hex_2"
	} else if (rand < 0.34){
		return "hex_0"
	} else if (rand < 0.64){
		return "hex_4"
	}
	return "hex_3"
}
function chooseHexRecession(rand){
	if (rand < 0.05){
		return "hex_recessed_shadow"
	} else if (rand < 0.1){
		return "hex_protruding_shadow"
	}
	return "hex_shadow"
}
// function drawHexShadow(ctx, hex, x, y, size, inRadius, q, r, s, horiz, vert, spriteName, recession) {
// 	const hexX = x - horiz * 0.5
// 	const hexY = y - vert * 2 / 3
// 	const hexW = horiz
// 	const hexH = vert * 4 / 3
// 	ctx.save()
// 	ctx.globalAlpha = 0.7
// 	const shadow = SPRITES[recession]
// 	let shadowW = hexW / 87 * shadow.width
// 	let shadowH = hexH / 100 * shadow.height
// 	if (recession === "hex_protruding_shadow"){
// 		shadowW += 5
// 		shadowH += 5
// 	} else {
// 		shadowW -= size * 0.01
// 		shadowH -= size * 0.01
// 	}
// 	const shadowX = (hexX + hexW * 0.5) - (shadowW * 0.5)
// 	const shadowY = (hexY + hexH * 0.5) - (shadowH * 0.5)
// 	ctx.drawImage(shadow, shadowX, shadowY, shadowW, shadowH)
// 	ctx.restore()
// }
function drawHex(ctx, hex, x, y, size, inRadius, q, r, s, horiz, vert, spriteName, recession) {
	const hexX = x - horiz * 0.5
	const hexY = y - vert * 2 / 3
	const hexW = horiz
	const hexH = vert * 4 / 3
	ctx.save()
	ctx.globalAlpha = 0.7
	if (recession === "hex_shadow"){
		const shadowW = hexW / 87 * 125
		const shadowH = hexH / 100 * 130
		const shadowX = (hexX + hexW * 0.5) - (shadowW * 0.5)
		const shadowY = (hexY + hexH * 0.5) - (shadowH * 0.5)
		const shadow = SPRITES[recession]
		ctx.drawImage(shadow, shadowX, shadowY, shadowW, shadowH)
	}
	const sprite = SPRITES[spriteName]
	ctx.drawImage(sprite, hexX, hexY, hexW, hexH)
	ctx.restore()
}
function drawHexOriginal(ctx, hex, x, y, size, inRadius, q, r, s) {
	//x, y is the center of the hexagon.
	const diagx = ROOT3 * 0.5 * size
	const diagy = size * 0.5
	ctx.save()
	let key = `${hex.q},${hex.r},${hex.active}`
	let color = "gray"
	let color2

	if (!hexColorCache.has(key)) {
		if (hex.q === 0 && hex.r === 0) {
			let bri = 20
			if (hex.active) {
				bri *= 1.4
			}
			color2 = new Color("hsl", [0, 0, bri])
			color = color2.toString({ format: "hex" })
		} else {
			let xy = hex.toXY()
			let d = Math.hypot(xy[0], xy[1])
			let sat = min(80, max(20, d + 20))
			let bri = min(50, max(20, sqrt(d) + 20))
			if (hex.active) {
				bri *= 1.4
			}
			let cangle = Math.atan2(xy[0], xy[1]) * 180 / Math.PI;
			color2 = new Color("hsl", [cangle, sat, bri]);
			color = color2.toString({ format: "hex" })
		}
		hexColorCache.set(key, color)
	} else {
		color = hexColorCache.get(key)
	}


	ctx.fillStyle = color
	ctx.lineWidth = max(size * 0.05, 2)
	ctx.strokeStyle = "black"
	ctx.beginPath()
	ctx.moveTo(x, y - size)
	ctx.lineTo(x + diagx, y - diagy)
	ctx.lineTo(x + diagx, y + diagy)
	ctx.lineTo(x, y + size)
	ctx.lineTo(x - diagx, y + diagy)
	ctx.lineTo(x - diagx, y - diagy)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
	ctx.restore()
}

function drawArmMechanism(ctx, mechanism, x, y, hexSize, inRadius, horiz, vert, hasShadow = false) {
	const arms = mechanism.arms.contents
	const alpha = mechanism.isGhost ? 0.7 : 1

	//use the home tile to handle fine decimal rotation
	const angle = mechanism.rotation
	const hexRotation = mechanism.currentHexRotation
	const cosT = cos(angle)
	const sinT = sin(angle)
	const atomSize = atomRenderSize
	const baseRadius = hexSize * 0.5

	let isPiston = !!mechanism.mechanismType.abilities["piston_extend"]
	let color = isPiston ? "#F5BF45" : "#6AE3F7"

	//Draw atoms if need be
	const atoms = mechanism.atoms.contents
	for (let atom of atoms) {
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX * cosT - atomY * sinT
		const atomYR = y + atomX * sinT + atomY * cosT
		drawAtom(ctx, atom, atomXR, atomYR, hexSize, inRadius, alpha, hasShadow)
	}

	for (let arm of arms) {
		const hand = arm.direction
		const q = hand.q
		const r = hand.r
		//Because arms can have their hands any distance from the home tile, multiply these distances to get the true distance.
		const distance = arm.distance
		const handRadius = hexSize * atomSize * 0.8
		const handX = (q + 0.5 * r) * horiz * distance
		const handY = r * vert * distance

		ctx.save()
		ctx.shadowColor = "black";
		ctx.shadowBlur = hexSize * 0.2;
		ctx.translate(x, y)
		ctx.rotate(angle)
		ctx.beginPath()
		ctx.globalAlpha = alpha
		ctx.strokeStyle = color
		ctx.lineWidth = hexSize * 0.1
		ctx.arc(handX, handY, handRadius, 0, Math.PI * 2)

		//Fingers
		const fingerCount = 3
		const fingerBaseAngle = (hexRotation * TWOPI / 6) - TWOPI / 12
		const fingerAngleStep = TWOPI / fingerCount
		const fingerLength = handRadius * 0.3 * (2 - mechanism.grabAnimationProgress)
		for (let i = 0; i < fingerCount; i++) {
			const angle = i * fingerAngleStep + fingerBaseAngle
			const fCos = cos(angle)
			const fSin = sin(angle)
			const circleX = handX + fCos * handRadius
			const circleY = handY + fSin * handRadius
			const endX = handX + fCos * (handRadius + fingerLength)
			const endY = handY + fSin * (handRadius + fingerLength)
			ctx.moveTo(circleX, circleY)
			ctx.lineTo(endX, endY)
		}

		//Draw the arm connecting the home tile to the hand
		const len = Math.hypot(handX, handY)
		const ux = handX / len
		const uy = handY / len

		// Endpoint just before the circle
		const endX = handX - ux * handRadius
		const endY = handY - uy * handRadius
		const startX = ux * baseRadius
		const startY = uy * baseRadius

		ctx.moveTo(startX, startY)
		ctx.lineTo(endX, endY)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	//Draw base
	ctx.save()
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.globalAlpha = alpha
	ctx.fillStyle = color
	ctx.arc(x, y, baseRadius, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.restore()

	//Draw number
	if (mechanism.program) {
		ctx.save()
		const name = mechanism.program.name
		const fontSize = hexSize * 0.4
		const font = fontSize + "px monospace"
		ctx.font = font
		ctx.globalAlpha = alpha
		ctx.fillStyle = "black"
		const length = name.toString().length - 1
		const diffX = hexSize * 0.1
		ctx.fillText(name, x - hexSize * 0.1 - diffX * length, y + hexSize * 0.1)
		ctx.restore()
	}
}

function drawMoleculeBonds(ctx, molecule, x, y, hexSize, inRadius, horiz, vert, hasShadow = false) {
	const atoms = molecule.atoms
	const contents = atoms.contents
	const bonds = molecule.bonds.contents
	const alpha = molecule.isGhost ? 0.7 : 1

	//use the home tile to handle fine decimal rotation
	const angle = molecule.rotation
	const cosT = cos(angle)
	const sinT = sin(angle)

	for (let bond of bonds) {
		const atom1 = bond.atoms[0]
		const q1 = atom1.coord.q
		const r1 = atom1.coord.r
		const atom1X = (q1 + 0.5 * r1) * horiz
		const atom1Y = r1 * vert
		const atom1XR = x + atom1X * cosT - atom1Y * sinT
		const atom1YR = y + atom1X * sinT + atom1Y * cosT

		const atom2 = bond.atoms[1]
		const q2 = atom2.coord.q
		const r2 = atom2.coord.r
		const atom2X = (q2 + 0.5 * r2) * horiz
		const atom2Y = r2 * vert
		const atom2XR = x + atom2X * cosT - atom2Y * sinT
		const atom2YR = y + atom2X * sinT + atom2Y * cosT

		const type = bond.type
		const sprite = type.sprites["bond"]
		const spriteWidth = horiz - atomSize * hexSize * 2
		const spriteHeight = hexSize * 0.4
		const dx = atom2XR - atom1XR
		const dy = atom2YR - atom1YR
		const rotation = Math.atan2(dy, dx)
		ctx.save()
		ctx.translate(atom1XR + dx * 0.5, atom1YR + dy * 0.5)
		ctx.rotate(rotation)
		ctx.drawImage(sprite, -spriteWidth * 0.5, -spriteHeight * 0.5, spriteWidth, spriteHeight)
		ctx.restore()
	}
}
function drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert, hasShadow = false) {
	const atoms = molecule.atoms
	const contents = atoms.contents
	const bonds = molecule.bonds.contents
	const alpha = molecule.isGhost ? 0.7 : 1

	//use the home tile to handle fine decimal rotation
	const angle = molecule.rotation
	const cosT = cos(angle)
	const sinT = sin(angle)

	
	for (let atom of contents) {
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX * cosT - atomY * sinT
		const atomYR = y + atomX * sinT + atomY * cosT
		drawAtom(ctx, atom, atomXR, atomYR, hexSize, inRadius, alpha, hasShadow)

		if (drawGhostRotation) {
			ctx.globalAlpha = 0.5
			drawAtom(ctx, atom, atomX + x, atomY + y, hexSize, inRadius, alpha)
			ctx.globalAlpha = 1
		}
	}

	if (drawMoleculeHomeTile) {
		ctx.save()
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.fillStyle = "red"
		ctx.arc(x, y, hexSize * 0.5, 0, Math.PI * 2)
		ctx.closePath()
		ctx.fill()
		ctx.restore()
	}
}

function drawAtom(ctx, atom, x, y, hexSize, inRadius, alpha, hasShadow = false) {
	// console.log(atom)
	let atomSize = inRadius * 0.8
	let sprite = atom.element.sprites["atom"]
	ctx.save()
	if (hasShadow) {
		ctx.shadowColor = "black";
		ctx.shadowBlur = hexSize * 0.2;
	}
	ctx.globalAlpha = alpha
	ctx.drawImage(sprite, x - atomSize, y - atomSize, 2 * atomSize, 2 * atomSize)
	ctx.restore()
}

function drawReagent(ctx, reagent, x, y, hexSize, inRadius, horiz, vert, isSimulated) {
	//A reagent is just the hexagonal grid underneath the molecule that it produces.
	//Before the simulation starts, it should render the molecule that it produces as though it were a normal molecule
	const diagx = ROOT3 * 0.5 * hexSize
	const diagy = hexSize * 0.5
	const hexW = horiz
	const hexH = vert * 4 / 3
	const molecule = reagent.molecule
	const atoms = molecule.atoms.contents
	const baseSprite = SPRITES["reagent_base"]
	const ringSprite = SPRITES["reagent_ring"]
	ctx.save()
	for (let atom of atoms) {
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX //atomX * cosT - atomY * sinT
		const atomYR = y + atomY //atomX * sinT + atomY * cosT

		//Draw a hexagon on the ground
		ctx.drawImage(baseSprite, atomXR - hexW * 0.5, atomYR - hexH * 0.5, hexW, hexH)
		ctx.drawImage(ringSprite, atomXR - hexW * 0.5, atomYR - hexH * 0.5, hexW, hexH)
	}

	if (!isSimulated) {
		drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert, false)
		drawMoleculeBonds(ctx, molecule, x, y, hexSize, inRadius, horiz, vert, false)
	}

	ctx.restore()
}
function drawProduct(ctx, reagent, x, y, hexSize, inRadius, horiz, vert, isSimulated) {
	//A product is just the hexagonal grid underneath the molecule that it produces.
	const diagx = ROOT3 * 0.5 * hexSize
	const diagy = hexSize * 0.5
	const hexW = horiz
	const hexH = vert * 4 / 3
	const ringW = hexW * 1
	const ringH = hexH * 1
	const molecule = reagent.molecule
	const atoms = molecule.atoms.contents
	const baseSprite = SPRITES["product_base"]
	const ringSprite = SPRITES["product_ring"]
	ctx.save()
	for (let atom of atoms) {
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX //atomX * cosT - atomY * sinT
		const atomYR = y + atomY //atomX * sinT + atomY * cosT

		//Draw a hexagon on the ground
		ctx.drawImage(baseSprite, atomXR - hexW * 0.5, atomYR - hexH * 0.5, hexW, hexH)
	}

	if (isSimulated !== "bypass"){
		ctx.filter = "brightness(0.5)"
	}
	drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert)
	ctx.filter = ""

	for (let atom of atoms) {
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX //atomX * cosT - atomY * sinT
		const atomYR = y + atomY //atomX * sinT + atomY * cosT

		//Draw a hexagon on the ground
		ctx.drawImage(ringSprite, atomXR - ringW * 0.5, atomYR - ringW * 0.5, ringW, ringW)
	}

	drawMoleculeBonds(ctx, molecule, x, y, hexSize, inRadius, horiz, vert)

	ctx.restore()
}

function drawGlyph(ctx, glyph, x, y, hexSize, inRadius, horiz, vert) {
	let glyphType = glyph.glyphType
	ctx.save()
	glyphType.render(ctx, glyph, x, y, hexSize, inRadius, horiz, vert)
	ctx.restore()
}

function drawTrack(ctx, track, x, y, hexSize, inRadius, horiz, vert) {
	const hexX = x - horiz * 0.5
	const hexY = y - vert * 2 / 3
	const hexW = horiz + 3
	const hexH = vert * 4 / 3 + 3
	const trackPieces = track.trackPieces
	const homeTile = track.homeTile
	const sprites = TrackPiece.sprites
	for (let trackPiece of trackPieces) {
		ctx.save()
		const trackTile = trackPiece.coord
		const q = trackTile.q
		const r = trackTile.r
		const pieceX = x + (q + 0.5 * r) * horiz
		const pieceY = y + r * vert
		const spriteNames = trackPiece.getImageDirections()
		ctx.translate(pieceX, pieceY)
		ctx.rotate(trackPiece.spriteRotation)
		const baseSprite = sprites[trackPiece.getBaseSpriteName()]
		ctx.drawImage(baseSprite, -hexW * 0.5, -hexH * 0.5, hexW, hexH)
		const shadowSprite = SPRITES["hex_recessed_shadow"]
		ctx.globalAlpha *= 0.4
		ctx.drawImage(shadowSprite, -hexW * 0.5, -hexH * 0.5, hexW, hexH)
		ctx.globalAlpha /= 0.4

		const sprite = sprites[spriteNames[0]]
		const spriteOffset = 1
		const spriteRenderOffset = 2
		ctx.drawImage(
			sprite,
			spriteOffset, spriteOffset, sprite.width - spriteOffset * 2, sprite.height - spriteOffset * 2,
			- horiz * 0.5 - spriteRenderOffset, - vert * 2 / 3 - spriteRenderOffset,
			horiz + spriteRenderOffset * 2, vert * 4 / 3 + spriteRenderOffset * 2
		)
		if (spriteNames.length > 1) {
			const sprite = sprites[spriteNames[1]]
			ctx.globalAlpha = 0.5
			ctx.drawImage(
				sprite,
				spriteOffset, spriteOffset, sprite.width - spriteOffset * 2, sprite.height - spriteOffset * 2,
				- horiz * 0.5 - spriteRenderOffset, - vert * 2 / 3 - spriteRenderOffset,
				horiz + spriteRenderOffset * 2, vert * 4 / 3 + spriteRenderOffset * 2
			)
		}
		ctx.restore()
	}
}

export function drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated) {
	if (!component.isRendered) return
	switch (component.type) {
		case "Molecule":
			drawMolecule(ctx, component, x, y, hexSize, inRadius, horiz, vert, true);
			drawMoleculeBonds(ctx, component, x, y, hexSize, inRadius, horiz, vert, true);
		break
		case "Reagent": drawReagent(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated); break
		case "Product": drawProduct(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated); break
		case "ArmMechanism": drawArmMechanism(ctx, component, x, y, hexSize, inRadius, horiz, vert, true); break
		case "Glyph": drawGlyph(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		case "Track": drawTrack(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
	}

	if (component.renderRotationPoint) {
		let rotationPoint = component.rotationPoint
		let rotationPointX = x + (rotationPoint.q + 0.5 * rotationPoint.r) * horiz
		let rotationPointY = y + rotationPoint.r * vert
		ctx.save()
		ctx.beginPath()
		ctx.moveTo(rotationPointX, rotationPointY)
		ctx.globalAlpha = 0.9
		ctx.fillStyle = "lightblue"
		ctx.arc(rotationPointX, rotationPointY, hexSize * 0.2, 0, Math.PI * 2)
		ctx.closePath()
		ctx.fill()
		ctx.restore()
	}
}

export function render(game, ctx, w, h) {
	ctx.clearRect(0, 0, w, h)
	let level
	if (game.isPlayingSimulation) {
		level = game.simulation
	} else {
		level = game.currentLevel
	}
	const grid = level.grid
	const hexSize = game.hexSize
	const inRadius = hexSize * ROOT3 * 0.5
	const horiz = ROOT3 * hexSize
	const vert = 1.5 * hexSize
	const xOffset = game.xOffset
	const yOffset = game.yOffset

	const topPixel = 0 + yOffset
	const bottomPixel = h + yOffset
	const leftPixel = 0 + xOffset
	const rightPixel = w + xOffset
	const topR = floor(topPixel / vert)
	const bottomR = ceil(bottomPixel / vert)
	const leftQ = floor(leftPixel / horiz)
	const rightQ = ceil(rightPixel / horiz)

	//Place the base background
	const backgroundOffsetX = -428 + xOffset
	const backgroundOffsetY = 912 + yOffset
	drawTiledBackground(ctx, SPRITES["hex_base"], backgroundOffsetX, backgroundOffsetY)

	//Draw hexagons
	const baseSeed = "steve"
	for (let r = topR; r <= bottomR; r++) {
		const offset = floor(-r * 0.5)
		for (let q = leftQ + offset; q <= rightQ + offset; q++) {
			const s = -q - r
			const x = (q + 0.5 * r) * horiz - xOffset
			const y = r * vert - yOffset
			const hex = grid.findHex(q, r, s) || new Hex(q, r, s)
			if (hexDrawTheme === "original"){
				const seed = `${baseSeed},${q},${r},${s}`
				let spriteName, recession
				if (hexCache.has(seed)){
					[spriteName, recession] = hexCache.get(seed)
				} else {
					const rng = new Math.seedrandom(seed)
					spriteName = chooseHexBackground(rng.quick())
					recession = chooseHexRecession(rng.quick())
					hexCache.set(seed, [spriteName, recession])
				}
				recession = "hex_shadow"
				drawHex(ctx, hex, x, y, hexSize, inRadius, q, r, s, horiz, vert, spriteName, recession)
			} else if (hexDrawTheme === "rainbow") {
				drawHexOriginal(ctx, hex, x, y, hexSize, inRadius, q, r, s, horiz, vert)
			}
			
			if (drawHexCoords) {
				ctx.save()
				const fontSize = hexSize * 0.4
				const font = fontSize + "px monospace"
				ctx.font = font
				ctx.fillStyle = "black"
				ctx.fillText(q, x - fontSize * 0.2, y - fontSize * 0.8)
				ctx.fillText(r, x - fontSize * 0.2, y + fontSize * 0.2)
				ctx.fillText(s, x - fontSize * 0.2, y + fontSize * 1.2)
				ctx.restore()
			}
		}
	}

	const components = grid.contents
	for (let component of components) {
		let homeTile = component.homeTile
		let q = homeTile.q
		let r = homeTile.r
		// let s = homeTile.s
		let x = (q + 0.5 * r) * horiz - xOffset
		let y = r * vert - yOffset
		//Components can be offset in non-integer amounts to allow for smooth translation
		let componentOffset = component.offset
		let componentOffDist = component.offsetDistance
		let componentOffX = (componentOffset.q + 0.5 * componentOffset.r) * horiz * componentOffDist
		let componentOffY = (componentOffset.r) * vert * componentOffDist
		x += componentOffX
		y += componentOffY
		let isSimulated = game.isPlayingSimulation
		drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated)
	}

	if (game.selectedComponent) {
		let component = game.selectedComponent
		let homeTile = component.homeTile
		let q = homeTile.q
		let r = homeTile.r
		let x = (q + 0.5 * r) * horiz - xOffset
		let y = r * vert - yOffset
		//Components can be offset in non-integer amounts to allow for smooth translation
		let componentOffset = component.offset
		let componentOffDist = component.offsetDistance
		let componentOffX = (componentOffset.q + 0.5 * componentOffset.r) * horiz * componentOffDist
		let componentOffY = (componentOffset.r) * vert * componentOffDist
		x += componentOffX
		y += componentOffY
		drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert)
	}

	if (level.highlightBoxes.length) {
		ctx.save()
		ctx.lineWidth = hexSize * 0.1
		ctx.strokeStyle = "#E62551"
		for (let box of level.highlightBoxes) {
			let x = box.x * horiz / ROOT3 - xOffset
			let y = box.y * vert * 2 / 3 - yOffset
			let w = box.w * horiz / ROOT3
			let h = box.h * vert * 2 / 3
			ctx.beginPath()
			ctx.rect(x, y, w, h)
			ctx.closePath()
			ctx.stroke()
		}
		ctx.restore()
	}

	if (game.isPlayingSimulation && drawCollisionCircles) {
		const circles = game.getAllSimulationCollisionCircles()
		for (let circle of circles) {
			const x = circle.x * horiz / ROOT3 - xOffset
			const y = circle.y * vert * 2 / 3 - yOffset
			ctx.save()
			ctx.beginPath()
			ctx.moveTo(x, y)
			ctx.globalAlpha = 0.5
			ctx.fillStyle = "purple"
			ctx.arc(x, y, hexSize * circle.radius, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()
			ctx.restore()
		}
	}
}

export function renderPrograms(game, ctx, w, h){
	ctx.clearRect(0, 0, w, h)
	const windowH = window.innerHeight
	const programManager = game.programManager
	const renderInfo = programManager.renderInfo

	//Frame
	const targetFrameHeight = windowH * 0.3 //40vh
	const frameY = h - targetFrameHeight

	const frameLeft = SPRITES["program_pane_frame_left"]
	const frameMiddle = SPRITES["program_pane_frame_center"]
	const frameRight = SPRITES["program_pane_frame_right"]

	// Scale widths based on height (preserve aspect ratio)
	const frameLeftW = renderInfo.frameLeftW
	const frameMiddleW = renderInfo.frameMiddleW
	const frameRightW = renderInfo.frameRightW
	const frameRemainingW = renderInfo.frameRemainingW

	//Program rows
	{
		const programs = game.currentLevel.programs
		const boxX = frameLeftW * 281 / 295;   // left
		const boxEndX = w - frameRightW * 26 / 74;
		const boxY = frameY + targetFrameHeight * 45 / 296;   // top
		const boxEndY = frameY + targetFrameHeight * 272 / 296;
		const boxW = boxEndX - boxX;   // width
		const boxH = boxEndY - boxY;   // height

		// Fit sprite to box width
		const drawH = renderInfo.programH

		// Number of vertical tiles (ceil to ensure coverage)
		const tileCount = ceil(boxH / drawH) + 1

		ctx.save()

		// Clip to the box so we don't overdraw
		ctx.beginPath()
		ctx.rect(boxX, boxY, boxW, boxH)
		ctx.clip()

		const yOffset = programManager.yOffset
		const xOffset = programManager.xOffset
		const firstProgramRow = floor(yOffset / drawH)
		let y = boxY - yOffset + firstProgramRow * drawH
		const programRowDividerSprite = SPRITES["program_row_divider"]
		const instructionSprite = SPRITES["instruction"]
		const instructionSelectedSprite = SPRITES["instruction_selected"]

		const allSelectedInstructions = game.selectedInstructions.flat(2)
		const selectedInstructionsMap = new Map()
		for (let instruction of allSelectedInstructions){
			selectedInstructionsMap.set(instruction, true)
		}

		for (let i = 0; i < tileCount; i++) {
			const programRowIndex = firstProgramRow + i
			let program = programs[programRowIndex]
			const spriteName = program ? (programRowIndex % 2 ? "program_row_second" : "program_row_first") : "program_row_background"
			const sprite = SPRITES[spriteName]
			const drawW = renderInfo.tileW
			let firstTile = floor(xOffset / drawW)

			//Draw background tiles
			let bgTileX = boxX - xOffset + firstTile * drawW
			let insTileCount = ceil(boxW / drawW) + 1
			for (let j = 0; j < insTileCount; j++){
				ctx.drawImage(sprite, bgTileX, y, drawW + 1, drawH)
				bgTileX += drawW
			}

			if (program){
				let instructions = program.instructions
				let insTileX = boxX - xOffset + (firstTile - 1) * drawW
				let insTileCount = ceil(boxW / drawW) + 1
				for (let j = 0; j < insTileCount; j++){
					let instructionIndex = firstTile + j
					let instruction = instructions[instructionIndex]
					insTileX += drawW
					if (!instruction) continue
					let instructionType = instruction.type
					if (instructionType.id === "idle") continue
					ctx.drawImage(instructionSprite, insTileX, y, drawW, drawH)
					if (selectedInstructionsMap.has(instruction)){
						ctx.drawImage(instructionSelectedSprite, insTileX, y, drawW, drawH)
					}
					const instructionIconSprite = instructionType.sprite
					const centerX = insTileX + drawW * 0.5
					const centerY = y + drawH * 0.5
					const insW = drawH * 0.9
					const insX = centerX - insW * 0.53
					const insY = centerY - insW * 0.53
					ctx.drawImage(instructionIconSprite, insX, insY, insW, insW)
				}
			}

			ctx.drawImage(programRowDividerSprite, boxX, y + drawH * 0.9, boxW, drawH * 0.2)
			y += drawH
		}

		ctx.restore()
	}

	//Actually draw frame
	ctx.drawImage(frameLeft, 0, frameY, frameLeftW, targetFrameHeight)
	ctx.drawImage(frameMiddle, frameLeftW, frameY, frameRemainingW, targetFrameHeight)
	ctx.drawImage(frameRight, w - frameRightW, frameY, frameRightW, targetFrameHeight)
}

export function renderEffects(game, ctx, w, h) {
	ctx.clearRect(0, 0, w, h)
	if (game.isDraggingBox) {
		ctx.save()
		ctx.strokeStyle = "#cfcdc1"
		ctx.shadowColor = "#cfcdc1"
		ctx.shadowBlur = 20
		ctx.lineWidth = 2
		let dragBox = game.dragBox
		let rect = dragBox.rect
		ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
		ctx.restore()
	}
}