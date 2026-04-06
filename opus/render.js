import {Hex, Atom, Molecule} from "./util.js";
import {drawCollisionCircles, drawGhostRotation, drawMoleculeHomeTile, atomRenderSize} from "./config.js";
import { TrackPiece } from "./track.js";

const ROOT3 = Math.sqrt(3)
const max = Math.max
const floor = Math.floor
const ceil = Math.ceil
const sin = Math.sin
const cos = Math.cos

function drawHex(ctx, hex, x, y, size, inRadius, q, r, s){
	//x, y is the center of the hexagon.
	const diagx = ROOT3*0.5*size
	const diagy = size*0.5
	ctx.save()
	let lim = 150
	let red = hex.q
	red = red % (lim*2)
	red = red > lim ? red = lim*2 - red : red
	red += 20
	let green = hex.r
	green = green % (lim*2)
	green = green > lim ? green = lim*2 - green : green
	green += 20
	let blue = hex.s
	blue = blue % (lim*2)
	blue = blue > lim ? blue = lim*2 - blue : blue
	blue += 20
	// let red = (hex.q + 20) % 255
	// let green = (hex.r + 20) % 255
	// let blue = (hex.s + 20) % 255
	let color = `rgb(${red}, ${green}, ${blue})`
	color = (hex.active || (hex.q === 0 && hex.r === 0 && hex.s === 0)) ? "white" : color
	// color = (hex.content) ? "white" : color
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

	if (hex.active){
		ctx.save()
		const fontSize = size * 0.4
		const font = fontSize+"px monospace"
		ctx.font = font
		ctx.fillStyle = "red"
		ctx.fillText(q, x - fontSize * 0.2, y - fontSize * 0.8)
		ctx.fillText(r, x - fontSize * 0.2, y + fontSize * 0.2)
		ctx.fillText(s, x - fontSize * 0.2, y + fontSize * 1.2)
		ctx.restore()
	}
}

function drawArmMechanism(ctx, mechanism, x, y, hexSize, inRadius, horiz, vert){
	const arms = mechanism.arms.contents
	const alpha = mechanism.isGhost ? 0.7 : 1

	//use the home tile to handle fine decimal rotation
	const angle = mechanism.rotation
	const cosT = cos(angle)
	const sinT = sin(angle)
	const atomSize = atomRenderSize

	//Draw base
	ctx.save()
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.globalAlpha = alpha
	ctx.fillStyle = "yellow"
	ctx.arc(x, y, hexSize * 0.5, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.restore()

	for (let arm of arms){
		const hand = arm.direction
		const q = hand.q
		const r = hand.r
		//Because arms can have their hands any distance from the home tile, multiply these distances to get the true distance.
		const distance = arm.distance
		const handX = (q + 0.5 * r) * horiz * distance
		const handY = r * vert * distance

		ctx.save()
		ctx.translate(x, y)
		ctx.rotate(angle)
		ctx.beginPath()
		ctx.strokeStyle = "yellow"
		ctx.lineWidth = hexSize * 0.1
		ctx.arc(handX, handY, hexSize * atomSize, 0, Math.PI * 2)
		ctx.closePath()
		ctx.stroke()

		//Draw the arm connecting the home tile to the hand
		const len = Math.hypot(handX, handY)
		const ux = handX / len
		const uy = handY / len

		const radius = hexSize * atomSize

		// Endpoint just before the circle
		const endX = handX - ux * radius
		const endY = handY - uy * radius

		ctx.beginPath()
		ctx.moveTo(0, 0)
		ctx.lineTo(endX, endY)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	//Draw number
	if (mechanism.program){
		ctx.save()
		const name = mechanism.program.name
		const fontSize = hexSize * 0.4
		const font = fontSize+"px monospace"
		ctx.font = font
		ctx.fillStyle = "black"
		const length = name.toString().length - 1
		const diffX = hexSize * 0.1
		ctx.fillText(name, x - hexSize*0.1 - diffX * length, y + hexSize * 0.1)
		ctx.restore()
	}
}

function drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert){
	const atoms = molecule.atoms
	const contents = atoms.contents
	const bonds = molecule.bonds.contents
	const alpha = molecule.isGhost ? 0.7 : 1

	//use the home tile to handle fine decimal rotation
	const angle = molecule.rotation
	const cosT = cos(angle)
	const sinT = sin(angle)

	for (let bond of bonds){
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
		ctx.save()
		ctx.beginPath()
		ctx.lineWidth = hexSize * 0.4
		ctx.strokeStyle = "white"
		ctx.globalAlpha = alpha
		ctx.moveTo(atom1XR, atom1YR)
		ctx.lineTo(atom2XR, atom2YR)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}
	for (let atom of contents){
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX * cosT - atomY * sinT
		const atomYR = y + atomX * sinT + atomY * cosT
		drawAtom(ctx, atom, atomXR, atomYR, hexSize, inRadius, alpha)

		if (drawGhostRotation){
			ctx.globalAlpha = 0.5
			drawAtom(ctx, atom, atomX+x, atomY+y, hexSize, inRadius, alpha)
			ctx.globalAlpha = 1
		}
	}

	if (drawMoleculeHomeTile){
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

function drawAtom(ctx, atom, x, y, hexSize, inRadius, alpha){
	// console.log(atom)
	let atomSize = inRadius * 0.8
	let sprite = atom.element.sprites["atom"]
	ctx.save()
	ctx.globalAlpha = alpha
	ctx.drawImage(sprite, x - atomSize, y - atomSize, 2*atomSize, 2*atomSize)
	ctx.restore()
}

function drawReagent(ctx, reagent, x, y, hexSize, inRadius, horiz, vert, isSimulated){
	//A reagent is just the hexagonal grid underneath the molecule that it produces.
	//Before the simulation starts, it should render the molecule that it produces as though it were a normal molecule
	const diagx = ROOT3*0.5*hexSize
	const diagy = hexSize*0.5
	const molecule = reagent.molecule
	const atoms = molecule.atoms.contents
	for (let atom of atoms){
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX //atomX * cosT - atomY * sinT
		const atomYR = y + atomY //atomX * sinT + atomY * cosT

		//Draw a hexagon on the ground
		let color = "lightgreen"
		ctx.fillStyle = color
		ctx.lineWidth = max(hexSize * 0.05, 2)
		ctx.strokeStyle = "black"
		ctx.beginPath()
		ctx.moveTo(atomXR, atomYR - hexSize)
		ctx.lineTo(atomXR + diagx, atomYR - diagy)
		ctx.lineTo(atomXR + diagx, atomYR + diagy)
		ctx.lineTo(atomXR, atomYR + hexSize)
		ctx.lineTo(atomXR - diagx, atomYR + diagy)
		ctx.lineTo(atomXR - diagx, atomYR - diagy)
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	}

	ctx.save()
	if (isSimulated){
		ctx.filter = "brightness(0.2)"
	}
	drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert)
	ctx.restore()
}
function drawProduct(ctx, reagent, x, y, hexSize, inRadius, horiz, vert){
	//A product is just the hexagonal grid underneath the molecule that it produces.
	const diagx = ROOT3*0.5*hexSize
	const diagy = hexSize*0.5
	const molecule = reagent.molecule
	const atoms = molecule.atoms.contents
	for (let atom of atoms){
		const q = atom.coord.q
		const r = atom.coord.r
		const atomX = (q + 0.5 * r) * horiz
		const atomY = r * vert
		const atomXR = x + atomX //atomX * cosT - atomY * sinT
		const atomYR = y + atomY //atomX * sinT + atomY * cosT

		//Draw a hexagon on the ground
		let color = "tomato"
		ctx.fillStyle = color
		ctx.lineWidth = max(hexSize * 0.05, 2)
		ctx.strokeStyle = "black"
		ctx.beginPath()
		ctx.moveTo(atomXR, atomYR - hexSize)
		ctx.lineTo(atomXR + diagx, atomYR - diagy)
		ctx.lineTo(atomXR + diagx, atomYR + diagy)
		ctx.lineTo(atomXR, atomYR + hexSize)
		ctx.lineTo(atomXR - diagx, atomYR + diagy)
		ctx.lineTo(atomXR - diagx, atomYR - diagy)
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	}

	ctx.save()
	ctx.filter = "brightness(0.2)"
	drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert)
	ctx.restore()
}

function drawGlyph(ctx, glyph, x, y, hexSize, inRadius, horiz, vert){
	let glyphType = glyph.glyphType
	ctx.save()
	glyphType.render(ctx, glyph, x, y, hexSize, inRadius, horiz, vert)
	ctx.restore()
}

function drawTrack(ctx, track, x, y, hexSize, inRadius, horiz, vert){
	const trackPieces = track.trackPieces
	const homeTile = track.homeTile
	const sprites = TrackPiece.sprites
	for (let trackPiece of trackPieces){
		ctx.save()
		const trackTile = trackPiece.coord
		const q = trackTile.q
		const r = trackTile.r
		const pieceX = x + (q + 0.5 * r) * horiz
		const pieceY = y + r * vert
		const spriteNames = trackPiece.getImageDirections()
		ctx.translate(pieceX, pieceY)
		ctx.rotate(trackPiece.spriteRotation)
		const sprite = sprites[spriteNames[0]]
		const spriteOffset = 1
		const spriteRenderOffset = 2
		ctx.drawImage(
			sprite,
			spriteOffset, spriteOffset, sprite.width - spriteOffset*2, sprite.height - spriteOffset*2,
			- horiz * 0.5 - spriteRenderOffset, - vert * 2 / 3 - spriteRenderOffset,
			horiz + spriteRenderOffset*2, vert * 4 / 3 + spriteRenderOffset*2
		)
		if (spriteNames.length > 1){
			const sprite = sprites[spriteNames[1]]
			ctx.globalAlpha = 0.5
			ctx.drawImage(
				sprite,
				spriteOffset, spriteOffset, sprite.width - spriteOffset*2, sprite.height - spriteOffset*2,
				- horiz * 0.5 - spriteRenderOffset, - vert * 2 / 3 - spriteRenderOffset,
				horiz + spriteRenderOffset*2, vert * 4 / 3 + spriteRenderOffset*2
			)
		}
		ctx.restore()
	}
}

function drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated){
	if (!component.isRendered) return
	switch (component.type){
		case "Molecule": drawMolecule(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		case "Reagent": drawReagent(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		case "Product": drawProduct(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated); break
		case "ArmMechanism": drawArmMechanism(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		case "Glyph": drawGlyph(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		case "Track": drawTrack(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
	}

	if (component.renderRotationPoint){
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

export function render(game, ctx, w, h){
	ctx.clearRect(0, 0, w, h)
	let level
	if (game.isPlayingSimulation){
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

	for (let r = topR; r <= bottomR; r++){
		let offset = floor(-r*0.5)
		for (let q = leftQ + offset; q <= rightQ + offset; q++){
			let s = -q - r
			let x = (q + 0.5 * r) * horiz - xOffset
			let y = r * vert - yOffset
			let hex = grid.findHex(q, r, s) || new Hex(q, r, s)
			drawHex(ctx, hex, x, y, hexSize, inRadius, q, r, s)
		}
	}

	const components = grid.contents
	for (let component of components){
		let homeTile = component.homeTile
		let q = homeTile.q
		let r = homeTile.r
		// let s = homeTile.s
		let x = (q + 0.5 * r) * horiz - xOffset
		let y = r * vert - yOffset
		//Components can be offset in non-integer amounts to allow for smooth translation
		let componentOffset = component.offset
		let componentOffDist = component.offsetDistance
		let	componentOffX = (componentOffset.q + 0.5*componentOffset.r) * horiz * componentOffDist
		let	componentOffY = (componentOffset.r) * vert * componentOffDist
		x += componentOffX
		y += componentOffY
		let isSimulated = game.isPlayingSimulation
		drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert, isSimulated)
	}

	if (game.selectedComponent){
		let component = game.selectedComponent
		let homeTile = component.homeTile
		let q = homeTile.q
		let r = homeTile.r
		let x = (q + 0.5 * r) * horiz - xOffset
		let y = r * vert - yOffset
		//Components can be offset in non-integer amounts to allow for smooth translation
		let componentOffset = component.offset
		let componentOffDist = component.offsetDistance
		let	componentOffX = (componentOffset.q + 0.5*componentOffset.r) * horiz * componentOffDist
		let	componentOffY = (componentOffset.r) * vert * componentOffDist
		x += componentOffX
		y += componentOffY
		drawComponent(ctx, component, x, y, hexSize, inRadius, horiz, vert)
	}

	if (level.highlightBoxes.length){
		console.log(level.highlightBoxes)
		ctx.save()
		ctx.lineWidth = hexSize * 0.1
		ctx.strokeStyle = "#E62551"
		for (let box of level.highlightBoxes){
			let x = box.x*horiz/ROOT3 - xOffset
			let y = box.y*vert*2/3 - yOffset
			let w = box.w*horiz/ROOT3
			let h = box.h*vert*2/3
			ctx.beginPath()
			ctx.rect(x, y, w, h)
			ctx.closePath()
			ctx.stroke()
		}
		ctx.restore()
	}

	if (game.isPlayingSimulation && drawCollisionCircles){
		const circles = game.getAllSimulationCollisionCircles()
		for (let circle of circles){
			const x = circle.x * horiz/ROOT3 - xOffset
			const y = circle.y * vert*2/3 - yOffset
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