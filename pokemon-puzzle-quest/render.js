const PI = Math.PI
const TWOPI = 2 * PI

function renderTile(tile, board, round, w, h, xOffset, yOffset, options){
	let now = Date.now()
	let tileW = w / board.width
	let tileH = h / board.height
	board.spriteTileW = tileW
	board.spriteTileH = tileH
	let tilePaddingW = tileW * 0.15
	let tilePaddingH = tileH * 0.15

	let tileGameX = tile.x
	let tileGameY = tile.y

	let trueBlur = options.trueBlur

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
		if (trueBlur){
			ctx.save()
			// ctx.filter = "blur(" + blurAmount + "px)"
			// ctx.fillStyle = tileTypeColors[tile.type]
			ctx.globalAlpha = tile.spriteOpacity
			ctx.shadowColor = getHighlightColor(tile.type, now)
			ctx.shadowBlur = blurAmount * 2
			ctx.beginPath()
			ctx.arc(tile.spriteCenterX, tile.spriteCenterY, tile.spriteWidth * 0.50 - diff, 0, TWOPI)
			ctx.fill()
			ctx.restore()
		}
	}

	// ctx.filter = "none"

	let sprite = sprites.images[tile.type]
	ctx.save()
	ctx.globalAlpha = tile.spriteOpacity
	ctx.drawImage(sprite, x, y, spriteW, spriteH)
	ctx.restore()
}

function renderStatusEffects(tile, board, round, w, h, xOffset, yOffset){
	let circlesPlaced = 0
	let diff = TWOPI * -0.125
	let statusEffects = tile.statusEffects
	let tileCenterX = tile.spriteCenterX
	let tileCenterY = tile.spriteCenterY
	let tileWidth = tile.spriteWidth
	let tileHeight = tile.spriteHeight
	for (let i = 0; i < statusEffects.length; i++){
		let status = statusEffects[i]
		let data = tileStatusData[status.name]
		let hasSpriteSheet = data.hasSpriteSheet

		if (hasSpriteSheet){
			let sheetData = data.spriteSheetData
			let sheet = sprites.images["status-" + status.name]
			let frames = sheetData.frames
			let framesPerSprite = data.framesPerSprite
			let frameIndex = Math.floor(status.frameIndex / framesPerSprite)
			status.frameIndex += 1
			status.frameIndex %= frames.length * framesPerSprite
			let curFrame = frames[frameIndex].frame
			let x = tile.spriteX
			let y = tile.spriteY
			let w = tile.spriteWidth
			let h = tile.spriteHeight

			ctx.save()
			ctx.globalAlpha = status.spriteOpacity
			ctx.drawImage(sheet, curFrame.x, curFrame.y, curFrame.w, curFrame.h, x, y, w, h)
			ctx.restore()
		}
		else if (!hasSpriteSheet){
			let angle = (circlesPlaced + 1) * diff
			let statusCenterX = tileCenterX + tileWidth * Math.cos(angle) * 0.5
			let statusCenterY = tileCenterY + tileHeight * Math.sin(angle) * 0.5
			let statusWidth = tileWidth * 0.5
			let statusHeight = tileHeight * 0.5
			let statusX = statusCenterX - statusWidth * 0.5
			let statusY = statusCenterY - statusHeight * 0.5
			let circleWidth = statusWidth * 0.97
			let circleHeight = statusHeight * 0.97
			let circleX = statusCenterX - circleWidth * 0.5
			let circleY = statusCenterY - circleHeight * 0.5
			let circleType = `${status.color}-circle`

			ctx.save()
			ctx.globalAlpha = status.spriteOpacity
			ctx.drawImage(sprites.images[circleType], circleX, circleY, circleWidth, circleHeight)
			let sprite = sprites.images["status-" + status.name]
			ctx.drawImage(sprite, statusX, statusY, statusWidth, statusHeight)
			ctx.restore()

			circlesPlaced++
		}
		
	}
}

function render(){
	let now = Date.now()
	let w = canvas.width
	let h = canvas.height
	//to avoid things being cut off, make the rendered area a little smaller.
	let scaleFactor = 0.96
	let smallerW = w * scaleFactor
	let smallerH = h * scaleFactor
	let xOffset = w * (1 - scaleFactor) * 0.5
	let yOffset = h * (1 - scaleFactor) * 0.5

	let options = {}
	options.trueBlur = config.showBlurOnTiles

	if (gameBoard){
		let board = gameRound.board
		let tiles = board.contents
		let fakeTiles = board.fakeContents

		ctx.clearRect(0, 0, w, h)
		for (let tile of tiles){
			renderTile(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset, options)
		}
		for (let tile of fakeTiles){
			renderTile(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset, options)
		}
		for (let tile of tiles){
			renderStatusEffects(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset)
		}
		for (let tile of fakeTiles){
			renderStatusEffects(tile, board, gameRound, smallerW, smallerH, xOffset, yOffset)
		}
	}
	
	timeForFrames.push(Date.now() - now)
	// console.log(Date.now() - now)
}
function renderBackground(){
	background.render()
}