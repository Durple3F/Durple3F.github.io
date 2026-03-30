import {Hex} from "./game.js";

const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

function drawHex(ctx, hex, x, y, size){
	//x, y is the center of the hexagon.
	const diagx = ROOT3*0.5*size
	const diagy = size*0.5
	ctx.save()
	const color = `rgb(${hex.q % 255}, ${hex.r % 255}, ${hex.s % 255})`
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

export function render(game, ctx, w, h){
	ctx.clearRect(0, 0, w, h)
	const grid = game.currentLevel.grid
	const hexSize = game.hexSize
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
			let hex = grid.findHex(q, r, s)
			if (hex){
				drawHex(ctx, hex, x, y, hexSize)
			} else {
				hex = new Hex(q, r, s)
				drawHex(ctx, hex, x, y, hexSize)
			}
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