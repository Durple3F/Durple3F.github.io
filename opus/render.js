import {Hex, Atom, Molecule} from "./util.js";

const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

function drawHex(ctx, hex, x, y, size, inRadius){
	//x, y is the center of the hexagon.
	const diagx = ROOT3*0.5*size
	const diagy = size*0.5
	ctx.save()
	let red = (hex.q + 20) % 255
	let green = (hex.r + 20) % 255
	let blue = (hex.s + 20) % 255
	let color = `rgb(${red}, ${green}, ${blue})`
	// color = (hex.active || (hex.q === 0 && hex.r === 0 && hex.s === 0)) ? "white" : color
	color = (hex.content) ? "white" : color
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

	//If the hex has contents, draw them.
	if (hex.content instanceof Atom){
		let sprites = hex.content.element.sprites
		let sprite = sprites["atom"]
		let atomSize = inRadius * 0.9
		ctx.drawImage(sprite, x - atomSize, y - atomSize, 2*atomSize, 2*atomSize)
	}
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
	// grid.map.forEach(hex => {
	// 	const q = hex.q
	// 	const r = hex.r
	// 	let x = (q + 0.5 * r) * horiz - xOffset
	// 	let y = r * vert - yOffset
	// 	drawHex(ctx, hex, x, y, hexSize)
	// })
}