import {Hex, Atom, Molecule} from "./util.js";
import {drawGhostRotation} from "./config.js";

const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil
const sin = Math.sin
const cos = Math.cos

function drawHex(ctx, hex, x, y, size, inRadius){
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
	ctx.lineWidth = Math.max(size * 0.05, 2)
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

function drawMolecule(ctx, molecule, x, y, hexSize, inRadius, horiz, vert){
	const atoms = molecule.atoms
	const contents = atoms.contents
	const bonds = molecule.bonds.contents

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
		drawAtom(ctx, atom, atomXR, atomYR, hexSize, inRadius)

		if (drawGhostRotation){
			ctx.globalAlpha = 0.5
			drawAtom(ctx, atom, atomX+x, atomY+y, hexSize, inRadius)
			ctx.globalAlpha = 1
		}
	}
	ctx.save()
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.fillStyle = "red"
	ctx.arc(x, y, hexSize * 0.5, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.restore()
}

function drawAtom(ctx, atom, x, y, hexSize, inRadius){
	// console.log(atom)
	let atomSize = inRadius * 0.8
	let sprite = atom.element.sprites["atom"]
	ctx.drawImage(sprite, x - atomSize, y - atomSize, 2*atomSize, 2*atomSize)
}

export function render(game, ctx, w, h){
	ctx.clearRect(0, 0, w, h)
	const grid = game.currentLevel.grid
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
			drawHex(ctx, hex, x, y, hexSize, inRadius)
		}
	}

	const components = grid.contents
	for (let component of components){
		let homeTile = component.homeTile
		let q = homeTile.q
		let r = homeTile.r
		let s = homeTile.s
		let x = (q + 0.5 * r) * horiz - xOffset
		let y = r * vert - yOffset
		switch (component.type){
			case "Molecule": drawMolecule(ctx, component, x, y, hexSize, inRadius, horiz, vert); break
		}
	}
	// grid.map.forEach(hex => {
	// 	const q = hex.q
	// 	const r = hex.r
	// 	let x = (q + 0.5 * r) * horiz - xOffset
	// 	let y = r * vert - yOffset
	// 	drawHex(ctx, hex, x, y, hexSize)
	// })
}