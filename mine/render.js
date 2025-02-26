const NOCOLOR = [0,0,0,0]
const WHITE = [255,255,255,255]
const GRAY = [221,221,221,255]
const DARKGRAY = [100,100,100,255]

const colorLayers = new Map()
colorLayers.set(0, [230, 63, 129, 255])
colorLayers.set(1, [124, 144, 195, 255])
colorLayers.set(2, [200, 97, 97, 255])
colorLayers.set(3, [86, 42, 144, 255])
colorLayers.set(4, [148, 185, 91, 255])
colorLayers.set(5, [87, 183, 193, 255])
colorLayers.set(6, [192, 191, 183, 255])
colorLayers.set(7, [160, 121, 107, 255])
colorLayers.set(8, [97, 159, 113, 255])
colorLayers.set(9, [87, 107, 156, 255])
colorLayers.set(10, [108, 58, 109, 255])
colorLayers.set(11, [106, 107, 138, 255])
colorLayers.set(12, [68, 79, 92, 255])
colorLayers.set(13, [199, 164, 166, 255])
colorLayers.set(14, [159, 59, 59, 255])
colorLayers.set(15, [173, 175, 36, 255])

const colorLayersStrs = new Map()
for (let i of colorLayers.keys()){
	let c = colorLayers.get(i)
	let color = "#" + c[0].toString(16) + c[1].toString(16) + c[2].toString(16) + c[3].toString(16)
	colorLayersStrs.set(i, color)
}

function getLayer(y){
	let mineY = y - 100
	return floor(mineY / layerDepth)
}

function getColor(x, y){
	let c = getLayer(y) % 16
	if (!colorLayers.has(c)) return NOCOLOR
	return colorLayers.get(c)
}

function renderRocks(data, w, h, leftToUse, widthToUse, total,
topmostPixel, windowWorldHeight){
	let lastWYI
	let lastColor
	for (let i = 0; i < total; i++){
		//current pixel's location onscreen
		// let px = (i % widthToUse)
		// let py = floor(i/widthToUse)
		let py = (i % h)
		let px = floor(i/h)
		if (py < topmostPixel) continue

		//current pixel's location in world
		let wy = yOffset + (zoomLevel * py)
		let wyi = floor(wy)
		let wx = xOffset + (zoomLevel * (px + leftToUse))
		let wxi = floor(wx)
		
		let color = NOCOLOR
		let depth = getDepth(wxi)
		if (depth <= wyi){
			if (wyi === lastWYI){
				color = lastColor
			} else {
				lastColor = color = getColor(wxi, wyi)
			}
		} else {
			if (depth > yOffset + windowWorldHeight){
				// i = px * h + h
			} else {
				// let diff = depth - wyi + 1
				// i += floor(diff / zoomLevel)
			}
		}

		//pixel index in data
		// let p = i*4
		let p = (px + py*widthToUse) * 4
		data[p + 0] = color[0]
		data[p + 1] = color[1]
		data[p + 2] = color[2]
		data[p + 3] = color[3]
	}
}

function renderMiner(miner, data, w, h,
windowWorldWidth, windowWorldHeight, zoomRecip,
leftToUse, alreadyDoneMinersMap){
	let minerX = miner.x
	let minerY = miner.y

	if (minerX < xOffset) return
	if (minerX - leftToUse * zoomLevel > xOffset + windowWorldWidth) return
	if (minerY < yOffset) return
	if (minerY > yOffset + windowWorldHeight) return

	let minerR = miner.radius
	// let zoomRecip = 1 / zoomLevel
	let effectiveRadius = minerR*0.5 * zoomRecip
	if (effectiveRadius < 1) effectiveRadius = 0
	
	let extra = zoomRecip > 2 ? 1 : 0
	let x = round((minerX - xOffset + extra) * zoomRecip - effectiveRadius - leftToUse)
	let y = floor((minerY - yOffset) * zoomRecip)
	let r = miner.radius * zoomRecip

	let pId = x + y*w
	let doneAlready = alreadyDoneMinersMap.get(pId)
	if (doneAlready) return

	let ps = []
	//Find all points that lie inside the worker's circular radius.
	//Because of symmetry, we only really need to check 1 quadrant.
	//There's a small bug when a circle is too close to the left/right edges
	//The circle gets cut off because this code is designed to ignore any
	//uncertain pixels and I don't check all 4 quadrants. Oh well. TODO, I guess.
	for (let checkX = 0; checkX < r; checkX++){
		if (x + checkX > w) continue
		if (x - checkX < 0) continue
		for (let checkY = 0; checkY < r; checkY++){
			let inside = checkX*checkX + checkY*checkY <= r*r
			if (inside){
				ps.push((x + checkX) % w + (y + checkY) * w)
				ps.push((x + checkX) % w + (y - checkY) * w)
				ps.push((x - checkX) % w + (y + checkY) * w)
				ps.push((x - checkX) % w + (y - checkY) * w)
			}
		}
	}

	let color = miner.color
	let pLen = ps.length
	if (pLen === 4) pLen = 1
	for (let j = 0; j < pLen; j++){
		let p = ps[j] * 4
		data[p + 0] = color[0]
		data[p + 1] = color[1]
		data[p + 2] = color[2]
		data[p + 3] = color[3]
	}
	alreadyDoneMinersMap.set(pId, true)
	return true
}

function renderRails(data, w, h, leftToUse, widthToUse, total,
topmostPixel, bottommostPixel, windowWorldHeight){
	let zoomRecip = 1 / zoomLevel
	for (let i = 0; i < total; i++){
		let py = (i % h)
		if (py > bottommostPixel) continue
		if (py < topmostPixel) continue
		let px = floor(i/h)

		//current pixel's location in world
		let wx = xOffset + (zoomLevel * (px + leftToUse))
		let wxi = floor(wx)
		if (zoomRecip > 10) {
			let diff = abs(wx - wxi)
			if (diff > 0.975 || diff < 0.025) continue
		}
		let rail = rails.get(wxi)
		if (!rail) continue

		//current pixel's y position in world
		let wy = yOffset + (zoomLevel * py)
		let wyi = floor(wy)
		if (wyi < 0) continue
		let railLength = rail.length
		if (wyi >= railLength) continue

		let color = DARKGRAY

		//now, where is the minecart?
		//remember, rail y represents the front of the train, the bottom part.
		let minecartY = rail.y
		let minecartPixelY = floor((minecartY - yOffset) * zoomRecip)
		let minecartCount = rail.minecartCount
		let minecartPixelTop = minecartPixelY - minecartCount * zoomRecip
		if (py <= minecartPixelY && py >= minecartPixelTop){
			//If we make it in here, we're currently rendering
			//a minecart pixel.
			color = GRAY
			let currentMinecartNumber = floor((py - minecartPixelTop) * zoomLevel)
			
			let cartColors = rail.cartColors
			let cLen = cartColors.length
			for (let j = 0; j < cLen; j += 2){
				let cId = cartColors[j]
				let runLength = cartColors[j + 1]
				if (runLength > currentMinecartNumber){
					color = colorLayers.get(cId)
					break
				} else {
					currentMinecartNumber -= runLength
				}
			}
			if (color === GRAY && py === minecartPixelY && rail.state === "returning-home"){
				color = DARKGRAY
			}
		}

		let p = (px + py*widthToUse) * 4
		data[p + 0] = color[0]
		data[p + 1] = color[1]
		data[p + 2] = color[2]
		data[p + 3] = color[3]
	}
}

const frameTimes = []
function render(){
	let now= Date.now()
	frameCount++

	let w = screenW, h = screenH
	ctx.clearRect(0, 0, w, h)

	//Which column does the real challenge start at?
	let zoomRecip = 1/zoomLevel
	let farthestLeft = farthestRocks[0]
	let farthestLeftPixel = floor((farthestLeft - xOffset) * zoomRecip)
	let farthestRight = farthestRocks[1]
	let farthestRightPixel = floor((farthestRight - xOffset) * zoomRecip)
	let middleAreaWidth = farthestRightPixel - farthestLeftPixel
	let topmostPixel = floor((100 - yOffset) * zoomRecip)
	let topmostRailPixel = floor(-yOffset * zoomRecip)
	let bottommostRailPixel = floor((longestRailLength - yOffset) * zoomRecip)

	var widthToUse = w
	var leftToUse = 0
	if (!renderOuterColumns && middleAreaWidth < w){
		// widthToUse = middleAreaWidth
		// leftToUse = farthestLeftPixel
	}
	// let widthToUse = renderOuterColumns ? w : middleAreaWidth
	// let leftToUse = renderOuterColumns ? 0 : farthestLeftPixel

	//Height and width of the area of the game portrayed by the screen
	let windowWorldWidth = widthToUse * zoomLevel
	let windowWorldHeight = h * zoomLevel

	//Draw the rocks
	let nextFrame = ctx.createImageData(widthToUse, h)
	let data = nextFrame.data
	let total = widthToUse * h
	if (renderRocksEachFrame){
		renderRocks(data, w, h, leftToUse, widthToUse, total, topmostPixel, windowWorldHeight)
	}

	//Draw the rails
	if (renderRailsEachFrame){
		renderRails(data, w, h, leftToUse, widthToUse, total,
			topmostRailPixel, bottommostRailPixel, windowWorldHeight)
	}

	//Draw the miners
	if (renderMinersEachFrame){
		let minerLimit = 100000
		let mLen = miners.length
		//List of pixels we've already rendered for them
		let alreadyDoneMinersMap = new Map()
		if (mLen < minerLimit){
			for (let i = 0; i < mLen; i++){
				let miner = miners[i]
				renderMiner(miner, data, widthToUse, h,
					windowWorldWidth, windowWorldHeight, zoomRecip,
					leftToUse, alreadyDoneMinersMap)
			}
		} else {
			let copies = ceil(mLen / minerLimit)
			let iOffset = frameCount % copies //floor(random() * copies)
			for (let i = iOffset; i < 50000; i += copies){
				let miner = miners[i]
				renderMiner(miner, data, widthToUse, h,
					windowWorldWidth, windowWorldHeight, zoomRecip,
					leftToUse, alreadyDoneMinersMap)
			}
		}
	}

	ctx.putImageData(nextFrame, leftToUse, 0)

	frameTimes.push(Date.now() - now)
	if (frameTimes.length > 100) {
		frameTimes.splice(0, 10)
	}
}