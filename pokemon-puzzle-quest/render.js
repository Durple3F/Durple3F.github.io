const PI = Math.PI
const TWOPI = 2 * PI

function renderTile(tile, board, round, w, h, xOffset, yOffset){
	let now = Date.now()
	let tileW = w / board.width
	let tileH = h / board.height
	board.spriteTileW = tileW
	board.spriteTileH = tileH
	let tilePaddingW = tileW * 0.15
	let tilePaddingH = tileH * 0.15

	let tileGameX = tile.x
	let tileGameY = tile.y

	//Now's the time to check for any tile displacements
	//this tile might have.
	let animationQueue = round.animationQueue
	for (let animation of animationQueue){
		for (let part of animation.batch){
			if (part.type === "displace"){
				if (part.tile !== tile) continue
				let start = part.startT
				let end = start + part.duration
				if (now >= end){
					tileGameX = part.endX
					tileGameY = part.endY
					continue
				} else if (now <= start){
					tileGameX = part.startX
					tileGameY = part.startY
					continue
				}
				let dt = (now - part.startT) / part.duration
				let p = bezierEase(dt)
				tileGameX = interpolate(part.startX, part.endX, p)
				tileGameY = interpolate(part.startY, part.endY, p)
			}
		}
	}

	let x = tileGameX * tileW
	let y = tileGameY * tileH
	let scale = tile.spriteRenderScale
	x += xOffset + tilePaddingW * 0.5
	y += yOffset + tilePaddingH * 0.5
	let spriteW = tileW * tile.width - tilePaddingW
	let spriteH = tileH * tile.height - tilePaddingH
	spriteW = spriteW * scale
	spriteH = spriteH * scale
	x -= tileW * (scale - 1) * 0.5
	y -= tileH * (scale - 1) * 0.5

	tile.spriteX = x
	tile.spriteY = y
	tile.spriteCenterX = x + spriteW * 0.5
	tile.spriteCenterY = y + spriteH * 0.5
	tile.spriteWidth = spriteW
	tile.spriteHeight = spriteH
	
	if (tile.spriteHighlight > 0.1){
		let highlight = tile.spriteHighlight
		let blurAmount = tileW * 0.05 * highlight
		let diff = 5*Math.min(1, 1 - highlight)
		ctx.save()
		ctx.filter = "blur(" + blurAmount + "px)"
		ctx.fillStyle = tileTypeColors[tile.type]
		ctx.beginPath()
		ctx.arc(tile.spriteCenterX, tile.spriteCenterY, tile.spriteWidth * 0.50 - diff, 0, TWOPI)
		ctx.fill()
		ctx.restore()
	}

	ctx.filter = "none"

	let sprite = sprites.images[tile.type]
	ctx.drawImage(sprite, x, y, spriteW, spriteH)
}

function renderStatusEffects(tile, board, round, w, h, xOffset, yOffset){
	let currentCount = 0
	let diff = TWOPI * -0.125
	let statusEffects = tile.statusEffects
	let tileCenterX = tile.spriteCenterX
	let tileCenterY = tile.spriteCenterY
	let tileWidth = tile.spriteWidth
	let tileHeight = tile.spriteHeight
	for (let i = 0; i < statusEffects.length; i++){
		let status = statusEffects[i]
		let angle = (currentCount + 1) * diff
		let statusCenterX = tileCenterX + tileWidth * Math.cos(angle) * 0.5
		let statusCenterY = tileCenterY + tileHeight * Math.sin(angle) * 0.5
		let statusWidth = tileWidth * 0.4
		let statusHeight = tileHeight * 0.4
		let statusX = statusCenterX - statusWidth * 0.5
		let statusY = statusCenterY - statusHeight * 0.5
		let circleType = `${status.color}-circle`

		ctx.save()
		ctx.drawImage(sprites.images[circleType], statusX, statusY, statusWidth, statusHeight)
		ctx.filter = `opacity(${status.spriteOpacity})`
		let sprite = sprites.images["status-" + status.name]
		ctx.drawImage(sprite, statusX, statusY, statusWidth, statusHeight)
		ctx.restore()

		currentCount++
	}
}

function render(){
	let w = canvas.width
	let h = canvas.height
	let board = gameRound.board
	let tiles = board.contents
	//to avoid things being cut off, make the rendered area a little smaller.
	let scaleFactor = 0.96
	let smallerW = w * scaleFactor
	let smallerH = h * scaleFactor
	let xOffset = w * (1 - scaleFactor) * 0.5
	let yOffset = h * (1 - scaleFactor) * 0.5

	ctx.clearRect(0, 0, w, h)
	for (let tile of tiles){
		renderTile(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset)
	}
	for (let tile of tiles){
		renderStatusEffects(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset)
	}
}