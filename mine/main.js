//We're gonna use these a lot
const random = Math.random
const round = Math.round
const ceil = Math.ceil
const floor = Math.floor
const sqrt = Math.sqrt
const atan2 = Math.atan2
const sin = Math.sin
const cos = Math.cos
const abs = Math.abs
const min = Math.min
const max = Math.max
const log = Math.log
const PI = Math.PI

let canvas = document.getElementById("screen")
let ctx = canvas.getContext("2d")
let zoomLevel = 1
let xOffset = floor(document.body.clientWidth * -0.5 / (config?.scale ?? 2))
let yOffset = 0
let screenW, screenH
let mouseX, mouseY
let renderOuterColumns = false
let renderRocksEachFrame = true
let renderRailsEachFrame = true
let renderMinersEachFrame = true
let expandWhenReachEdge = true

let gameRenderScale = config?.scale ?? 2

let tickInterval
let tickRate, frameRate
let tickPrev, framePrev
let tickTime, frameTime
let tickCount = 0
let frameCount = 0
//Bonus time the player builds up by having the game inactive
let bankedBonusTicks = 0

let lastSave = 0

let layerDepth = 25
let longestRailLength = 0
const farthestRocks = [0, 0]

let currentTab = "miners"
let currentBuyAmount = 1
let money = 0

//Returns a random integer in [min, max] (inclusive)
function getRandom(min, max){
	return floor(random()*(max-min+1)) + min
}

function gaussianRandom(mean=0, stdev=1) {
	const u = 1 - random(); // Converting [0,1) to (0,1]
	const v = random();
	const z = sqrt( -2.0 * log( u ) ) * cos( 2.0 * PI * v );
	// Transform to the desired mean and standard deviation:
	return z * stdev + mean;
}

function distance(x1, y1, x2, y2){
	let dx = x2-x1
	let dy = y2-y1
	return sqrt(dx*dx + dy*dy)
}

const depths = new Map()
const durabilities = new Map()
const healths = new Map()

let deepestLayer = 0
const layerValues = new Map()
layerValues.set(0, 2)
layerValues.set(1, 11)
layerValues.set(2, 21)
layerValues.set(3, 33)
layerValues.set(4, 43)
layerValues.set(5, 56)
layerValues.set(6, 66)
layerValues.set(7, 80)
layerValues.set(8, 90)
layerValues.set(9, 105)
layerValues.set(10, 115)
layerValues.set(11, 131)
layerValues.set(12, 141)
layerValues.set(13, 158)
layerValues.set(14, 168)
layerValues.set(15, 186)

const layerDurabilities = new Map()
layerDurabilities.set(0, 2)
layerDurabilities.set(1, 11)
layerDurabilities.set(2, 21)
layerDurabilities.set(3, 33)
layerDurabilities.set(4, 43)
layerDurabilities.set(5, 56)
layerDurabilities.set(6, 66)
layerDurabilities.set(7, 80)
layerDurabilities.set(8, 90)
layerDurabilities.set(9, 105)
layerDurabilities.set(10, 115)
layerDurabilities.set(11, 131)
layerDurabilities.set(12, 141)
layerDurabilities.set(13, 158)
layerDurabilities.set(14, 168)
layerDurabilities.set(15, 186)

const layerHealths = new Map()
layerHealths.set(0, 10)
layerHealths.set(1, 10)
layerHealths.set(2, 10)
layerHealths.set(3, 10)
layerHealths.set(4, 10)
layerHealths.set(5, 10)
layerHealths.set(6, 10)
layerHealths.set(7, 10)
layerHealths.set(8, 10)
layerHealths.set(9, 10)
layerHealths.set(10, 10)
layerHealths.set(11, 10)
layerHealths.set(12, 10)
layerHealths.set(13, 10)
layerHealths.set(14, 10)
layerHealths.set(15, 10)

const upgrades = {}
class Upgrade {
	constructor(
		name, initialCost, costType, costModifier,
		initialValue, valueType, valueModifier,
		applicationFn, upgradeType
	){
		upgrades[name] = this
		this.name = name
		this.initialCost = initialCost
		this.costType = costType
		this.costModifier = costModifier
		this.initialValue = initialValue
		this.valueType = valueType
		this.valueModifier = valueModifier
		this.applyLevelToEntity = applicationFn
		this.upgradeType = upgradeType
		//Map of the costs required to go from level 0 to level X
		this.costs = new Map()
		this.costs.set(0, 0)
		//Map of the costs of each individual level
		this.individualLevelCosts = new Map()
		this.individualLevelCosts.set(0, initialCost)
		this.lastCachedLevel = 0
		this.cacheFrequency = 10
		this.textPrecision = 0

		this.tag = $(`.upgrade[data-upgrade=${this.name}]`)
		this.tag.click(this.buyUpgrade.bind(this))
	}

	applyCostIncrease(cost, lvl){
		//Reminder: We are returning the price of this individual level,
		//based on the price of the previous level.
		switch (this.costType){
			case "geometric":
			return cost * this.costModifier
			case "arithmetic-compound":
				let priceModifier = this.costModifier[0]
				let priceModFrequency = this.costModifier[1]
				let additionalCost = this.costModifier[2] ?? 0
				let scale = ceil(lvl / priceModFrequency)
			return cost + priceModifier * scale + additionalCost
			default:
				console.warn("You never handled the cost type for "+this.name)
			break
		}
	}

	getLevelCost(lvl){
		//Starting from the previously written totalCost,
		//find the new cost from there.
		if (this.costs.get(lvl)){
			return this.costs.get(lvl)
		}
		let lastCachedLvl = min(
			this.lastCachedLevel,
			lvl - (lvl % this.cacheFrequency)
		)
		let lastCachedTotal = this.costs.get(lastCachedLvl)
		let curCost = lastCachedTotal
		let curIndividual = this.individualLevelCosts.get(lastCachedLvl)
		for (let i = lastCachedLvl + 1; i <= lvl; i++){
			curIndividual = this.applyCostIncrease(curIndividual, i)
			curCost += curIndividual
			if (i % this.cacheFrequency === 0){
				this.costs.set(i, curCost)
				this.individualLevelCosts.set(i, curIndividual)
				this.lastCachedLevel = i
			}
		}
		return curCost
	}

	getLevelValue(lvl){
		if (this.valueType === "arithmetic"){
			return this.initialValue + lvl*this.valueModifier
		} else {
			console.warn("You never handled the values for "+this.name)
		}
	}

	buyUpgrade(){
		if (this.upgradeType === "miner"){
			let targetLevel = getMinerTargetLevel(this.name, currentBuyAmount)
			let cost = getMinerUpgradeCost(this.name, targetLevel)
			let newValue = this.getLevelValue(targetLevel)
			if (cost <= money){
				for (let i = 0; i < miners.length; i++){
					let miner = miners[i]
					if (miner.upgrades[this.name] <= targetLevel){
						this.applyLevelToEntity(miner, newValue, targetLevel)
					}
				}
				money -= cost
			}
		} else if(this.upgradeType === "rail") {
			let targetLevel = getRailTargetLevel(this.name, currentBuyAmount)
			let cost = getRailUpgradeCost(this.name, targetLevel)
			let newValue = this.getLevelValue(targetLevel)
			if (cost <= money){
				let left = farthestRails[0]
				let right = farthestRails[1]
				for (let i = left; i <= right; i++){
					let rail = rails.get(i)

					if (rail.upgrades[this.name] <= targetLevel){
						this.applyLevelToEntity(rail, newValue, targetLevel)
					}
				}
				money -= cost
			}
		}
		rerenderUpgrades()
	}
}
new Upgrade("miner-speed", 4, "geometric", 1.5, 0.3, "arithmetic", 0.1,
(miner, value, lvl) => {
	miner.speed = value
	miner.upgrades["miner-speed"] = lvl
}, "miner")
upgrades["miner-speed"].textPrecision = 1
new Upgrade("miner-capacity", 0, "arithmetic-compound", [50, 10, -48], 1, "arithmetic", 1,
(miner, value, lvl) => {
	miner.carryCapacity = value
	miner.upgrades["miner-capacity"] = lvl
}, "miner")
new Upgrade("miner-damage", 0, "arithmetic-compound", [100, 10], 1, "arithmetic", 1,
(miner, value, lvl) => {
	miner.damage = value
	miner.upgrades["miner-damage"] = lvl
}, "miner")
new Upgrade("miner-unload-speed", 0, "arithmetic-compound", [300, 5], 1, "arithmetic", 1,
(miner, value, lvl) => {
	miner.unloadSpeed = value
	miner.upgrades["miner-unload-speed"] = lvl
}, "miner")
new Upgrade("miner-amount", -5, "arithmetic-compound", [5, 10], 0, "arithmetic", 1, function(){}, "none")

new Upgrade("rail-speed", 6, "arithmetic-compound", [4, 25], 0.1, "arithmetic", 0.05,
(rail, value, lvl) => {
	rail.maxSpeed = value
	rail.upgrades["rail-speed"] = lvl
}, "rail")
upgrades["rail-speed"].textPrecision = 2
new Upgrade("rail-acceleration", 6, "arithmetic-compound", [4, 10], 0.01, "arithmetic", 0.005,
(rail, value, lvl) => {
	rail.acceleration = value
	rail.upgrades["rail-acceleration"] = lvl
}, "rail")
upgrades["rail-acceleration"].textPrecision = 3
new Upgrade("rail-capacity", 8, "geometric", 1.8, 1, "arithmetic", 1,
(rail, value, lvl) => {
	rail.capacityPerMinecart = value
	rail.carryCapacity = rail.capacityPerMinecart * rail.minecartCount
	rail.upgrades["rail-capacity"] = lvl
}, "rail")
new Upgrade("rail-length", 3, "arithmetic-compound", [2, 10], 1, "arithmetic", 1,
(rail, value, lvl) => {
	let proposedValue = value
	if (proposedValue > depths.get(rail.x)){
		proposedValue = depths.get(rail.x)
	}
	rail.length = proposedValue
	if (value > longestRailLength) {
		longestRailLength = proposedValue
	}
	if (rail.state === "receiving") {
		numberOfReceivingRails--
		rail.state = "moving-to-mine"
	}
	rail.upgrades["rail-length"] = lvl
}, "rail")
new Upgrade("rail-minecart-count", 10, "arithmetic-compound", [10, 10], 1, "arithmetic", 1,
(rail, value, lvl) => {
	rail.minecartCount = value
	rail.upgrades["rail-minecart-count"] = lvl
	if (rail.y < value) rail.y = value
	let capacity = upgrades["rail-capacity"]
	let capacityLvl = rail.upgrades["rail-capacity"]
	let capacityVal = capacity.getLevelValue(capacityLvl)
	capacity.applyLevelToEntity(rail, capacityVal, capacityLvl)
}, "rail")
new Upgrade("rail-unload-speed", 0, "arithmetic-compound", [300, 5], 1, "arithmetic", 1,
(rail, value, lvl) => {
	rail.unloadSpeed = value
	rail.upgrades["rail-unload-speed"] = lvl
}, "rail")
new Upgrade("rail-amount", -50, "arithmetic-compound", [50, 5], 0, "arithmetic", 1, function(){}, "none")

function isRockAt(x,y){
	if (y < 100) return false
	if (!depths.has(x)) return true
	return depths.get(x) <= y
}
function getDepth(x){
	if (depths.has(x)) return depths.get(x)
	return 100
}
function generateLayers(layer){
	for (let i = deepestLayer + 1; i <= layer; i++){
		let prevVal = layerValues.get(i - 1)
		if (i % 2 === 1){
			let add = floor(8 + i*0.5)
			layerValues.set(i, prevVal + add)
		} else {
			layerValues.set(i, prevVal + 10)
		}

		let prevDur = layerDurabilities.get(i - 1)
		if (i % 2 === 1){
			let add = floor(8 + i*0.5)
			layerDurabilities.set(i, prevDur + add)
		} else {
			layerDurabilities.set(i, prevDur + 10)
		}

		let prevHealth = layerHealths.get(i - 1)
		if (i % 16 === 0){
			let mult = config?.layerHealthMult ?? 1.77825
			layerHealths.set(i, prevHealth * mult)
		} else {
			layerHealths.set(i, prevHealth)
		}
	}
}
function getLayerValue(layer){
	if (layerValues.has(layer)){
		return layerValues.get(layer)
	}
	generateLayers(layer)
	return layerValues.get(layer)
}
function getLayerDurability(layer){
	if (layerDurabilities.has(layer)){
		return layerDurabilities.get(layer)
	}
	generateLayers(layer)
	return layerDurabilities.get(layer)
}
function getLayerHealth(layer){
	if (layerHealths.has(layer)){
		return layerHealths.get(layer)
	}
	generateLayers(layer)
	return layerHealths.get(layer)
}

function expandTo(left, right, includeZero){
	let oldLeft = farthestRocks[0]
	let oldRight = farthestRocks[1]
	if (includeZero){
		depths.set(0, 100)
		durabilities.set(0, getLayerDurability(0))
		healths.set(0, getLayerHealth(0))
	}
	for (let i = oldLeft - 1; i >= left; i--){
		depths.set(i, 100)
		let layer = getLayer(100)
		let durability = getLayerDurability(layer)
		durabilities.set(i, durability)
		let health = getLayerHealth(layer)
		healths.set(i, health)
	}
	for (let i = oldRight + 1; i <= right; i++){
		depths.set(i, 100)
		let layer = getLayer(100)
		let durability = getLayerDurability(layer)
		durabilities.set(i, durability)
		let health = getLayerHealth(layer)
		healths.set(i, health)
	}
	farthestRocks[0] = left
	farthestRocks[1] = right
}

function changeDepth(x, depth){
	depths.set(x, depth)
	let layer = getLayer(depth)
	if (layer > deepestLayer){
		deepestLayer = layer
	}
}

function damageRock(x, y, d){
	let layer = getLayer(y)
	let remainingDepthForLayer = layerDepth - (y % layerDepth)
	let layerDurability = getLayerDurability(layer)
	if (!layerDurability){
		generateLayers(layer)
		deepestLayer = layer
		layerDurability = getLayerDurability(layer)
	}
	let layerHealth = getLayerHealth(layer)
	let numberBroken = floor(d / layerDurability)
	let fullDepthBroken = min(remainingDepthForLayer, floor(numberBroken / layerHealth))
	if (fullDepthBroken > 0){
		durabilities.set(x, layerDurability)
		healths.set(x, layerHealth)
		depths.set(x, depths.get(x) + fullDepthBroken)
		return numberBroken
	}
	let dur = durabilities.get(x) - d
	if (dur < 0) {
		numberBroken++
	}
	if (numberBroken > 0){
		//Remove that much health from the rock
		let health = healths.get(x) - numberBroken
		if (health <= 0){
			numberBroken = healths.get(x)
			healths.set(x, layerHealth)
			durabilities.set(x, layerDurability)
			changeDepth(x, depths.get(x) + 1)
			return numberBroken
		}
		dur = dur < 0 ? layerDurability + dur : layerDurability
		healths.set(x, health)
	}
	durabilities.set(x, dur)
	return numberBroken
}

const miners = []
const minerClaimedColumns = new Map()

class Miner {
	constructor() {
		this.colorId = null
		this.color = WHITE
		this.x = getRandom(farthestRails[0], farthestRails[1])
		this.y = 0
		this.speed = upgrades["miner-speed"].initialValue
		this.damage = upgrades["miner-damage"].initialValue
		this.unloadSpeed = upgrades["miner-unload-speed"].initialValue
		this.carryCapacity = upgrades["miner-capacity"].initialValue

		this.heldRocks = 0
		this.heldRocksTotalValue = 0

		this.upgrades = {}
		for (let upgradeName in upgrades){
			let upgrade = upgrades[upgradeName]
			if (upgrade.upgradeType === "miner"){
				this.upgrades[upgradeName] = 0
			}
		}

		this.state = "picking-target-mine"

		this.radius = 1
		this.targetColumn = null
		this.targetDepth = 0
		this.favoriteRail = null
		minerPickColumn(this)
	}
}

function minerPickColumn(miner){
	let tx = miner.targetColumn
	let best = findNearestColumn(miner)
	miner.targetColumn = best
	miner.targetDepth = getDepth(best)
	if (tx !== best){
		minerClaimedColumns.set(tx, null)
		minerClaimedColumns.set(best, miner)
	}
}

function minerPickRail(miner){
	let best = findNearestRail(miner)
	miner.targetColumn = best.x
	miner.targetDepth = best.length
	miner.favoriteRail = best
}

function findNearestColumn(miner){
	let mx = miner.x
	let my = miner.y
	
	let sample = []
	let leftEdge = farthestRocks[0]
	let rightEdge = farthestRocks[1]
	let sampleSize = 10
	let halfSampleSize = floor(sampleSize * 0.5)
	let totalWidth = rightEdge - leftEdge
	let stdDev = totalWidth * 0.2
	
	for (let i = 0; i < sampleSize; i++){
		//Get some random columns
		// sample.push(getRandom(leftEdge, rightEdge))
		let from = mx < leftEdge ? leftEdge : mx > rightEdge ? rightEdge : mx
		sample.push(
			floor(min(rightEdge, 
				max(leftEdge, gaussianRandom(from, stdDev))
			))
		)

		//Add a few columns near the miner as well
		let nearX = floor(mx + i - halfSampleSize)
		if (nearX <= rightEdge && nearX >= leftEdge) sample.push(nearX)

		//Now some evenly spaced columns somewhat closeby
		// col = floor(mx + (i - halfSampleSize)*fivePercent + getRandom(-5, 5))
		// sample.push(col)
	}
	//Add an extra column on the right for balance
	let nearX = floor(mx + halfSampleSize)
	if (nearX <= rightEdge && nearX >= leftEdge) sample.push(nearX)

	//Now find the best column from that batch
	let bestIndex = sampleSize + 1
	let bestDistance = Infinity
	//Let's also find the second best column
	//(this one may include columns that are claimed)
	let sLen = sample.length
	for (let i = 0; i < sLen; i++){
		let tx = sample[i]
		let ty = getDepth(tx)
		//This is here to ensure miners still sometimes go back up to the top
		ty = ty < my ? my : ty
		let d = distance(mx, my, tx, ty)
		//Is this column claimed?
		if (minerClaimedColumns.get(tx)) {
			//Darn. Who's it claimed by?
			let miner2 = minerClaimedColumns.get(tx)
			let mx2 = miner2.x
			let my2 = miner2.y
			let d2 = distance(mx2, my2, tx, ty)
			if (d2 > d){
				//Steal the column from this guy
				miner2.state = "picking-target-mine"
				minerClaimedColumns.set(tx, null)
				bestIndex = i
				break
			} else {
				continue
			}
		}
		if (d < bestDistance){
			bestIndex = i
			bestDistance = d
		} else if (d === bestDistance && Math.random() < 0.5){
			bestIndex = i
			bestDistance = d
		}
	}
	//TODO Newton method find best column later
	return sample[bestIndex]
}

function findNearestRail(miner){
	let mx = miner.x
	let my = miner.y
	
	let sample = []
	let leftEdge = farthestRails[0]
	let rightEdge = farthestRails[1]
	let sampleSize = 10
	let halfSampleSize = floor(sampleSize * 0.5)
	let totalWidth = rightEdge - leftEdge
	let stdDev = totalWidth * 0.2

	for (let i = 0; i < sampleSize; i++){
		//Add the rails nearest to the miner
		let nearX = mx - halfSampleSize + i
		if (nearX <= rightEdge && nearX >= leftEdge) sample.push(nearX)

		//Normal random
		sample.push(
			floor(min(rightEdge, 
				max(leftEdge, gaussianRandom(mx, stdDev))
			))
		)
	}
	//Add an extra rail on the right for balance
	let nearX = floor(mx + halfSampleSize)
	if (nearX <= rightEdge && nearX >= leftEdge) sample.push(nearX)

	//Now find the best column from that batch
	let bestIndex = -1
	let bestDistance = Infinity
	let sLen = sample.length
	for (let i = 0; i < sLen; i++){
		let tx = sample[i]
		let rail = rails.get(tx)
		if (rail.state !== "receiving") continue
		let ty = rail.length
		let d = distance(mx, my, tx, ty)
		if (d < bestDistance){
			bestIndex = i
			bestDistance = d
		} else if (d === bestDistance && Math.random() < 0.5){
			bestIndex = i
			bestDistance = d
		}
	}
	return rails.get(sample[bestIndex != -1 ? bestIndex : 0])

	// return rails.get(0)
}

function moveMinerTowards(miner, mx, my, tx, ty, speed){
	let dx = tx - mx
	let dy = ty - my
	let angle = atan2(dy, dx)
	//calculate x and y components of move
	let cx = cos(angle)
	let cy = sin(angle)
	//proposed x and y movements
	let px = min(speed, abs(dx)) * cx
	let py = min(speed, abs(dy)) * cy
	miner.x += px
	miner.y += py
}

function minerTick(miner, timeStep){
	let state = miner.state
	let mx = miner.x
	let my = miner.y
	let tx = miner.targetColumn
	let ty = miner.targetDepth
	let speed = miner.speed * timeStep

	switch (state){
		case "picking-target-mine":
			minerPickColumn(miner)
			miner.state = "moving-to-mine"
		break
		case "moving-to-mine":
			var d = distance(mx, my, tx, ty)
			if (d > 0.1){
				moveMinerTowards(miner, mx, my, tx, ty, speed)
			} else {
				miner.state = "mining"
				miner.x = tx
				// miner.y = ty
			}
		break
		case "moving-down":
			var dy = ty - my
			var ady = abs(dy)
			if (abs(dy) > 0.1){
				miner.y += (dy < 0 ? -1 : 1) * (ady < speed ? ady : speed)
			} else {
				miner.y = ty
				miner.state = "mining"
			}
		break
		case "mining":
			if (isRockAt(tx, ty)){
				var damage = miner.damage * timeStep
				var rocksMined = damageRock(tx, ty, damage)
				var brokeRock = !isRockAt(tx, ty)
				var layer = getLayer(ty)
				miner.heldRocks += rocksMined
				miner.heldRocksTotalValue += getLayerValue(layer) * rocksMined

				if (miner.heldRocks >= miner.carryCapacity){
					let colorId = layer % 16
					miner.colorId = colorId
					miner.color = colorLayers.get(colorId)
					minerClaimedColumns.set(tx, null)

					if (miner.favoriteRail === null){
						miner.state = "picking-target-rail"
					} else {
						var rail = miner.favoriteRail
						if (rail.state === "receiving"){
							miner.targetColumn = rail.x
							miner.targetDepth = rail.length
							miner.state = "moving-to-rail"
						} else {
							miner.state = "picking-target-rail"
						}
					}
				} else if (brokeRock){
					miner.targetDepth = getDepth(mx)
					miner.state = "moving-down"
				}
			} else {
				minerClaimedColumns.set(tx, null)
				miner.state = "picking-target-mine"
			}
		break
		case "picking-target-rail":
			if (numberOfReceivingRails > 0){
				minerPickRail(miner)
				miner.state = "moving-to-rail"
			}
		break
		case "moving-to-rail":
			var d = distance(mx, my, tx, ty)
			if (d > 0.1){
				moveMinerTowards(miner, mx, my, tx, ty, speed)
			} else {
				miner.state = "hauling"
				miner.x = tx
				miner.y = ty
			}
		break
		case "hauling":
			var rail = rails.get(tx)
			if (rail.state === "receiving" && rail.heldRocks < rail.carryCapacity){
				let held = miner.heldRocks
				if (held > 0){
					let unloadSpeed = miner.unloadSpeed * timeStep
					unloadSpeed = unloadSpeed > held ? held : unloadSpeed
					miner.heldRocks -= unloadSpeed
					rail.rocksUntilNextCartColor -= unloadSpeed
					rail.heldRocks += unloadSpeed
					let colorId = miner.colorId
					let rocksLeftForColor = rail.rocksUntilNextCartColor
					if (rocksLeftForColor <= 0){
						railAddNewColor(rail, colorId)
					}
					rail.color = miner.color
				}
				if (miner.heldRocks <= 0) {
					miner.heldRocks = 0
					rail.heldRocksTotalValue += miner.heldRocksTotalValue
					miner.heldRocksTotalValue = 0
					miner.state = "picking-target-mine"
					miner.color = WHITE
				}
			} else if (miner.heldRocks > 0){
				miner.state = "picking-target-rail"
			} else {
				miner.state = "picking-target-mine"
				miner.color = WHITE
			}
		break
		default:

		break
	}
}

function addMiners(amt){
	for (let i = 0; i < amt; i++){
		miners.push(new Miner())
	}
}
function buyMiners(amt){
	let curMiners = miners.length
	let upgrade = upgrades["miner-amount"]
	let prevCost = upgrade.getLevelCost(curMiners)
	for (let i = curMiners + 1; i <= amt; i++){
		let newCost = upgrade.getLevelCost(i)
		let diff = newCost - prevCost
		if (money >= diff){
			money -= diff
			addMiners(1)
			prevCost = newCost
		}
	}
}
function getMinerLevelStats(upgradeName){
	let min = Infinity, max = -Infinity, sum = 0
	for (let i = 0; i < miners.length; i++){
		let upgradeLevel = miners[i].upgrades[upgradeName]
		sum += upgradeLevel
		if (upgradeLevel < min){
			min = upgradeLevel
		}
		if (upgradeLevel > max){
			max = upgradeLevel
		}
	}
	let avg = round(sum / miners.length)
	return {minimum: min, average: avg, maximum: max}
}
function getMinerMinLevel(upgradeName){
	return getMinerLevelStats(upgradeName).minimum
}
function getMinerTargetLevel(upgradeName, lvls){
	return getMinerMinLevel(upgradeName) + lvls
}
function getMinerUpgradeCost(upgradeName, targetLevel){
	//Now find the cost to upgrade everybody to that level
	let upgrade = upgrades[upgradeName]
	let targetCost = upgrade.getLevelCost(targetLevel)
	let totalCost = 0
	for (let i = 0; i < miners.length; i++){
		let curLevel = miners[i].upgrades[upgradeName]
		if (curLevel >= targetLevel) continue
		let cost = targetCost - upgrade.getLevelCost(curLevel)
		totalCost += cost
	}
	return floor(totalCost)
}
function getMinersBelowLevel(upgradeName, targetLevel){
	let count = 0
	for (let i = 0; i < miners.length; i++){
		if (miners[i].upgrades[upgradeName] < targetLevel) count++
	}
	return count
}

const farthestRails = [0, 0]
let numberOfReceivingRails = 0
const rails = new Map()

class Rail {
	constructor(x) {
		this.x = x
		this.length = upgrades["rail-length"].initialValue
		if (this.length > longestRailLength){
			longestRailLength = this.length
		}
		this.y = this.length
		this.maxSpeed = upgrades["rail-speed"].initialValue
		this.speed = 0
		this.acceleration = upgrades["rail-acceleration"].initialValue
		this.minecartCount = upgrades["rail-minecart-count"].initialValue
		this.capacityPerMinecart = upgrades["rail-capacity"].initialValue
		this.unloadSpeed = upgrades["rail-unload-speed"].initialValue
		this.cartColors = []
		this.rocksUntilNextCartColor = this.capacityPerMinecart

		this.upgrades = {}
		for (let upgradeName in upgrades){
			let upgrade = upgrades[upgradeName]
			if (upgrade.upgradeType === "rail"){
				this.upgrades[upgradeName] = 0
			}
		}

		this.state = "receiving"
		numberOfReceivingRails++

		this.carryCapacity = this.minecartCount * this.capacityPerMinecart
		this.heldRocks = 0
		this.heldRocksTotalValue = 0

		this.color = GRAY
	}
}

function railAddNewColor(rail, colorId){
	let colors = rail.cartColors
	let perMinecart = rail.capacityPerMinecart
	let rocksLeftForColor = rail.rocksUntilNextCartColor
	rail.rocksUntilNextCartColor = rocksLeftForColor + perMinecart
	let newRocks = floor(-1 * rocksLeftForColor / perMinecart) + 1
	// let prevColor
	let cLen = colors.length
	for (let i = 0; i < cLen; i += 2){
		let prevColor = colors[i]
		if (prevColor === colorId){
			colors[i + 1] += newRocks
			return
		}
	}
	colors.push(colorId, newRocks)
	// if (cLen > 0){
	// 	prevColor = colors[cLen - 2]
	// }
	// if (prevColor === colorId){
	// 	colors[cLen - 1] += newRocks
	// } else {
	// 	colors.push(colorId, newRocks)
	// }
}

function checkRailColors(rail){
	let colors = rail.cartColors
	let cLen = colors.length
	let target = rail.minecartCount
	let sum = 0
	for (let i = 1; i < cLen; i += 2){
		sum += colors[i]
	}
	colors[cLen - 1] += target - sum
}

function railTick(rail, timeStep){
	let state = rail.state
	let ry = rail.y

	switch (state){
		case "receiving":
			if (rail.heldRocks >= rail.carryCapacity){
				rail.state = "returning-home"
				rail.rocksUntilNextCartColor = rail.capacityPerMinecart
				checkRailColors(rail)
				numberOfReceivingRails--
			}
		break
		case "returning-home":
			var speed = rail.speed
			var maxSpeed = rail.maxSpeed
			var acceleration = rail.acceleration
			if (speed > maxSpeed * -1){
				rail.speed -= acceleration * timeStep
			}
			rail.y = ry + rail.speed
			var destination = rail.minecartCount
			if (rail.y <= destination){
				rail.y = destination
				rail.speed = 0
				rail.state = "selling"
			}
		break
		case "selling":
			if (rail.heldRocks > 0){
				let toSell = rail.unloadSpeed * timeStep
				toSell = min(toSell, rail.heldRocks)
				rail.heldRocks -= toSell
				rail.rocksUntilNextCartColor -= toSell
				let rocksLeftForColor = rail.rocksUntilNextCartColor
				if (rocksLeftForColor <= 0){
					let perMinecart = rail.capacityPerMinecart
					rail.rocksUntilNextCartColor = rocksLeftForColor + perMinecart
					let newRocks = floor(-1 * rocksLeftForColor / perMinecart) + 1
					let colors = rail.cartColors
					let cLen = colors.length
					for (let i = cLen - 2; i > -1; i -= 2){
						colors[i + 1] -= newRocks
						if (colors[i + 1] <= 0){
							newRocks = colors[i + 1] * -1
							colors.length = cLen - 2
						} else break
						if (newRocks <= 0) break
					}
				}
			} else {
				rail.cartColors.length = 0
				rail.heldRocks = 0
				money += rail.heldRocksTotalValue
				rail.heldRocksTotalValue = 0
				rail.rocksUntilNextCartColor = rail.capacityPerMinecart
				rail.state = "moving-to-mine"
				rail.color = GRAY
			}
		break
		case "moving-to-mine":
			var speed = rail.speed
			var maxSpeed = rail.maxSpeed
			var acceleration = rail.acceleration
			var length = rail.length
			if (speed < maxSpeed){
				rail.speed += acceleration * timeStep
			}
			rail.y = rail.y + rail.speed
			if (rail.y >= length){
				rail.y = length
				rail.speed = 0
				rail.state = "receiving"
				numberOfReceivingRails++
			}
		break
	}
}

function addRails(amtLeft, amtRight, addCenter){
	if (addCenter){
		rails.set(0, new Rail(0))
	}
	for (let i = 0; i < amtLeft; i++){
		farthestRails[0] -= 1
		rails.set(farthestRails[0], new Rail(farthestRails[0]))
	}
	for (let i = 0; i < amtRight; i++){
		farthestRails[1] += 1
		rails.set(farthestRails[1], new Rail(farthestRails[1]))
	}
}
function buyRails(amt){
	let left = abs(farthestRails[0])
	let right = farthestRails[1]
	let total = left + right + 1
	let oldCost = upgrades["rail-amount"].getLevelCost(total)
	let newCost = upgrades["rail-amount"].getLevelCost(total + amt)
	let diff = newCost - oldCost
	if (diff > money) return
	money -= diff
	let leftAmt = floor(amt * 0.5)
	let rightAmt = ceil(amt * 0.5)
	if (left < right && leftAmt !== rightAmt){
		leftAmt++
		rightAmt--
	}
	addRails(leftAmt, rightAmt)
}
function getRailLevelStats(upgradeName){
	let min = Infinity, max = -Infinity, sum = 0
	let left = farthestRails[0]
	let right = farthestRails[1]
	for (let i = left; i <= right; i++){
		let upgradeLevel = rails.get(i).upgrades[upgradeName]
		sum += upgradeLevel
		if (upgradeLevel < min){
			min = upgradeLevel
		}
		if (upgradeLevel > max){
			max = upgradeLevel
		}
	}
	let avg = round(sum / (right - left + 1))
	return {minimum: min, average: avg, maximum: max}
}
function getRailMinLevel(upgradeName){
	return getRailLevelStats(upgradeName).minimum
}
function getRailTargetLevel(upgradeName, lvls){
	return getRailMinLevel(upgradeName) + lvls
}
function getRailUpgradeCost(upgradeName, targetLevel){
	//Now find the cost to upgrade everybody to that level
	let upgrade = upgrades[upgradeName]
	let targetCost = upgrade.getLevelCost(targetLevel)
	let totalCost = 0
	let left = farthestRails[0]
	let right = farthestRails[1]
	for (let i = left; i <= right; i++){
		let curLevel = rails.get(i).upgrades[upgradeName]
		if (curLevel >= targetLevel) continue
		let cost = targetCost - upgrade.getLevelCost(curLevel)
		totalCost += cost
	}
	return floor(totalCost)
}
function getRailsBelowLevel(upgradeName, targetLevel){
	let count = 0
	let left = farthestRails[0]
	let right = farthestRails[1]
	for (let i = left; i <= right; i++){
		if (rails.get(i).upgrades[upgradeName] < targetLevel) count++
	}
	return count
}

function doTick(dt){
	tickCount++

	generateLayers(deepestLayer + 1)

	let minerLimit = 10000
	let railLimit = 100

	let mLen = miners.length
	if (mLen <= minerLimit){
		for (let i = 0; i < mLen; i++){
			let miner = miners[i]
			minerTick(miner, dt)
		}
	} else {
		let timeStep = mLen / minerLimit
		let copies = ceil(mLen / minerLimit)
		let iOffset = floor(random() * copies)
		for (let i = iOffset; i < mLen; i += copies){
			let wIndex = floor(random() * mLen)
			let miner = miners[wIndex]
			minerTick(miner, timeStep * dt)
		}
	}
	
	let farthestLeftRail = farthestRails[0]
	let farthestRightRail = farthestRails[1]
	let rTotal = farthestRightRail + 1 - farthestLeftRail
	let rLen = farthestRightRail + 1
	if (rTotal <= railLimit){
		for (let i = farthestLeftRail; i < rLen; i++){
			let rail = rails.get(i)
			railTick(rail, dt)
		}
	} else {
		let timeStep = rTotal / railLimit
		let copies = ceil(rTotal / railLimit)
		let iOffset = floor(random() * copies)
		for (let i = farthestLeftRail + iOffset; i < rLen; i += copies){
			let rail = rails.get(i)
			railTick(rail, timeStep * dt)
		}
	}

	if (expandWhenReachEdge){
		//Just checking, have we gone beyond the current edges?
		let farthestLeftDepth = getDepth(farthestRocks[0])
		let farthestRightDepth = getDepth(farthestRocks[1])
		if (farthestLeftDepth > 100) {
			expandTo(farthestRocks[0] - 1, farthestRocks[1])
		}
		if (farthestRightDepth > 100) {
			expandTo(farthestRocks[0], farthestRocks[1] + 1)
		}
	}

	runControls()
}

function simulateTicks(count){
	tickCount += count
}

function changeFramerate(t, r){
	tickRate = t
	frameRate = r
	tickPrev = framePrev = Date.now()
	tickTime = 1000 / tickRate
	frameTime = 1000 / frameRate
	clearInterval(tickInterval)
	tickInterval = setInterval(tick, Math.floor(tickTime))
}

function tick(){
	let now = Date.now()
	let tickDiff = now - tickPrev
	let ticksToDo = floor(tickDiff / tickTime)
	//There ought to be 60 ticks per second, but tickRate can
	//change how many are actually calculated.
	//How many ticks should we pretend to calculate here?
	let timeSpeed = config?.timeSpeed ?? 1
	let timeToPass = 60 / tickRate * timeSpeed

	if (ticksToDo === 1) doTick(timeToPass)
	else if (ticksToDo > 100){
		bankedBonusTicks += ticksToDo
		tickPrev = now
	}
	else if (ticksToDo > 0){
		for (let i = 0; i < ticksToDo; i++){
			doTick(timeToPass)
		}
		tickPrev = now
	}

	money = floor(money)

	tags.money.innerHTML = "$"+money

	let frameDiff = now - framePrev
	if (frameDiff > frameTime && !document.hidden) {
		requestAnimationFrame(render)
		framePrev = now

		// let worstTime = 0
		// for (let i = 0; i < frameTimes.length; i++){
		// 	let t = frameTimes[i]
		// 	if (t > worstTime){
		// 		worstTime = t
		// 	}
		// }

		let avg = frameTimes.reduce((a,v)=>a+v, 0)/frameTimes.length
		let fps = min(frameRate, floor(1000 / avg))
		let fpsText = fps + "fps"
		if (fps === frameRate) {
			let idleTime = (1000 - avg * frameRate) / 1000
			fpsText += ` (${floor(idleTime * 100)}% idle)`
		}
		tags.fps.innerHTML = fpsText
	}

	let saveFrequency = config?.saveFrequency ?? 1
	let saveFrequencyMS = saveFrequency * 60000
	if (now - lastSave > saveFrequencyMS){
		saveGame()
		lastSave = now
	}
}

function start(){
	loadGame()

	resize()
	changeFramerate(config?.tickRate ?? 60, config?.frameRate ?? 60)
	rerenderUpgrades()
}

function resize(){
	screenW = floor(document.body.clientWidth / gameRenderScale)
	screenH = floor(document.body.clientHeight / gameRenderScale)
	canvas.width = screenW
	canvas.height = screenH
	// canvas.style.width = screenW * scale + "px"
	// canvas.style.height = screenH * scale + "px"
}

function changeScale(newScale){
	let windowWorldWidth = screenW * zoomLevel
	gameRenderScale = newScale
	$("#setting-game-render-scale").val(6 - newScale)
	resize()
	let newWorldWidth = screenW * zoomLevel
	xOffset -= (newWorldWidth - windowWorldWidth) * 0.5
}

function handleMouseMove(event){
	mouseX = event.pageX
	mouseY = event.pageY
}
function keyDown(key){
	if (!controls.has(key)) return false
	return controls.get(key).isDown
}
function runControls(){
	if (keyDown("up")) {
		yOffset -= 10 * zoomLevel
	}
	if (keyDown("down")) {
		yOffset += 10 * zoomLevel
	}
	if (keyDown("left")) {
		xOffset -= 10 * zoomLevel
	}
	if (keyDown("right")) {
		xOffset += 10 * zoomLevel
	}
	if (keyDown("zoom-out") || keyDown("zoom-in")) {
		let windowWorldWidth = screenW * zoomLevel
		let windowWorldHeight = screenH * zoomLevel
		if (keyDown("zoom-out")) zoomLevel *= 1.05
		if (keyDown("zoom-in")) zoomLevel /= 1.05
		let newWorldWidth = screenW * zoomLevel
		let newWorldHeight = screenH * zoomLevel
		let mouseXPercent = mouseX / canvas.clientWidth
		let mouseYPercent = mouseY / canvas.clientHeight
		xOffset -= (newWorldWidth - windowWorldWidth) * mouseXPercent
		yOffset -= (newWorldHeight - windowWorldHeight) * mouseYPercent
	}
	if (keyDown("pause")) {
		clearInterval(tickInterval)
	}
}

function toggleSideMenu(){
	let vw = document.body.clientWidth * 0.01
	let sideMenuTag = $(tags.sideMenu)
	if (sideMenuTag.hasClass("open")){
		sideMenuTag.animate({right: -30 * vw}, 300).removeClass("open")
		$(tags.menuTabs).animate({right: 0}, 300, function(){
			$(tags.openMenuTab).children(".btn-close").hide()
			$(tags.openMenuTab).children(".btn-open").show()
		})
		$(".menu-tab.secondary").css("left", "100%")
		$(".menu-tab").removeClass("open")
	} else {
		sideMenuTag.animate({right: 0}, 300).addClass("open")
		$(tags.menuTabs).animate({right: 30 * vw}, 300, function(){
			$(tags.openMenuTab).children(".btn-open").hide()
			$(tags.openMenuTab).children(".btn-close").show()
		})
		$(".menu-tab.secondary").css("left", 0)
		$(".menu-tab").addClass("open")
	}
}

function changeMenuSection(newTab){
	currentTab = newTab
	$("#menu-sections > .menu-section").hide()
	$(`.menu-section[data-tab=${newTab}]`).show()
}
function clickMenuTabHandler(event){
	let target = event.currentTarget
	let newTab = $(target).attr("data-tab")
	changeMenuSection(newTab)
}

function rerenderUpgrades(){
	$(".current-buy-amount").html("Buying "+currentBuyAmount)

	let minerAmount = upgrades["miner-amount"]
	let minerAmountTargetLevel = miners.length + currentBuyAmount
	let minerAmountTotalCost = minerAmount.getLevelCost(minerAmountTargetLevel)
	let minerAmountOldCost = minerAmount.getLevelCost(miners.length)
	let minerAmountCost = minerAmountTotalCost - minerAmountOldCost
	let minerAmountS = currentBuyAmount === 1 ? "" : "s"
	$("#upgrade-buy-miner > .upgrade-cost").html(`$${minerAmountCost}`)
	$("#upgrade-buy-miner > .upgrade-name").html(`Buy ${currentBuyAmount} miner${minerAmountS}`)
	$("#upgrade-buy-miner > .upgrade-level").html(miners.length)
	
	let railAmount = upgrades["rail-amount"]
	let leftRailCount = abs(farthestRails[0])
	let rightRailCount = farthestRails[1]
	let railCount = rightRailCount + leftRailCount + 1
	let railAmountTargetLevel = railCount + currentBuyAmount
	let railAmountTotalCost = railAmount.getLevelCost(railAmountTargetLevel)
	let railAmountOldCost = railAmount.getLevelCost(railCount)
	let railAmountCost = railAmountTotalCost - railAmountOldCost
	let railAmountS = currentBuyAmount === 1 ? "" : "s"
	$("#upgrade-buy-rail > .upgrade-cost").html(`$${railAmountCost}`)
	$("#upgrade-buy-rail > .upgrade-name").html(`Buy ${currentBuyAmount} rail${railAmountS}`)
	$("#upgrade-buy-rail > .upgrade-level").html(railCount)

	for (let upgradeName in upgrades){
		let upgrade = upgrades[upgradeName]
		let tag = upgrade.tag
		if (!tag.length) continue
		if (upgrade.upgradeType === "miner"){
			let s = miners.length === 1 ? "" : "s"
			let p = upgrade.textPrecision
			let targetLevel = getMinerTargetLevel(upgradeName, currentBuyAmount)
			let costToUpgrade = getMinerUpgradeCost(upgradeName, targetLevel)
			let toUpgrade = getMinersBelowLevel(upgradeName, targetLevel)
			let levelStats = getMinerLevelStats(upgradeName)
			let minLevel = levelStats.minimum
			let minValue = upgrade.getLevelValue(minLevel).toFixed(p)
			let maxLevel = levelStats.maximum
			let maxValue = upgrade.getLevelValue(maxLevel).toFixed(p)
			let avgLevel = round(levelStats.average)
			let avgValue = upgrade.getLevelValue(avgLevel).toFixed(p)
			let targetValue = upgrade.getLevelValue(targetLevel).toFixed(p)
			tag.children(".upgrade-cost").html(`$${costToUpgrade}`)
			tag.children(".upgrade-effect").html(`${minValue} <i class='bi bi-arrow-right'></i> ${targetValue}`)
			let statText = `Min:${minValue} | Avg:${avgValue} | Max:${maxValue}`
			tag.children(".upgrade-level-stats").html(statText)
			tag.children(".upgrade-name").children(".modify").html(`${toUpgrade} miner${s}`)
		}
		if (upgrade.upgradeType === "rail") {
			let left = farthestRails[0]
			let right = farthestRails[1]
			let totalRails = right - left + 1
			let s = totalRails === 1 ? "" : "s"
			let p = upgrade.textPrecision
			let targetLevel = getRailTargetLevel(upgradeName, currentBuyAmount)
			let costToUpgrade = getRailUpgradeCost(upgradeName, targetLevel)
			let toUpgrade = getRailsBelowLevel(upgradeName, targetLevel)
			let levelStats = getRailLevelStats(upgradeName)
			let minLevel = levelStats.minimum
			let minValue = upgrade.getLevelValue(minLevel).toFixed(p)
			let maxLevel = levelStats.maximum
			let maxValue = upgrade.getLevelValue(maxLevel).toFixed(p)
			let avgLevel = round(levelStats.average)
			let avgValue = upgrade.getLevelValue(avgLevel).toFixed(p)
			let targetValue = upgrade.getLevelValue(targetLevel).toFixed(p)
			tag.children(".upgrade-cost").html(`$${costToUpgrade}`)
			tag.children(".upgrade-effect").html(`${minValue} <i class='bi bi-arrow-right'></i> ${targetValue}`)
			let statText = `Min:${minValue} | Avg:${avgValue} | Max:${maxValue}`
			tag.children(".upgrade-level-stats").html(statText)
			tag.children(".upgrade-name").children(".modify").html(`${toUpgrade} rail${s}`)
		}
	}
}

function getSaveData(){
	let gameData = {}
	let data = []

	gameData["$"] = money
	gameData["DM"] = farthestRocks
	gameData["#R"] = farthestRails[1] - farthestRails[0] + 1
	gameData["#M"] = miners.length

	//Now add a bunch of samples of depth data.
	let depthData = []
	let leftmostRock = farthestRocks[0]
	let rightmostRock = farthestRocks[1]
	let depthLimit = 1000
	let totalRocks = rightmostRock - leftmostRock + 1
	if (totalRocks <= depthLimit){
		for (let i = leftmostRock; i <= rightmostRock; i++){
			let d = depths.get(i)
			depthData.push(d)
		}
	} else {
		for (let i = 0; i <= depthLimit; i++){
			let p = i / depthLimit
			let index = leftmostRock + p * (totalRocks - 1)
			index = index|0
			let d = depths.get(index)
			depthData.push(d)
		}
	}
	gameData["DD"] = depthData

	//Store a hashmap of the different miner's upgrade states,
	//along with the count for each one.
	let minerUpgradeMap = {}
	for (let i = 0; i < miners.length; i++){
		let hash = JSON.stringify(miners[i].upgrades)
		if (minerUpgradeMap[hash]){
			minerUpgradeMap[hash]++
		} else {
			minerUpgradeMap[hash] = 1
		}
	}
	gameData["MU"] = minerUpgradeMap

	let leftmostRail = farthestRails[0]
	let rightmostRail = farthestRails[1]
	let railUpgradeMap = {}
	for (let i = leftmostRail; i <= rightmostRail; i++){
		let hash = JSON.stringify(rails.get(i).upgrades)
		if (railUpgradeMap[hash]){
			railUpgradeMap[hash]++
		} else {
			railUpgradeMap[hash] = 1
		}
	}
	gameData["RU"] = railUpgradeMap
	
	for (let key in gameData){
		data.push(key + ":" + zipson.stringify(gameData[key]))
	}

	return data.join("🦭")
}

function saveGame(){
	let saveData = getSaveData()
	let zipped = zipson.stringify(saveData)
	console.log("Here's your save!")
	console.log(zipped)
	localStorage.setItem("mine-save", zipped)
}

function startNewGame(){
	money = 0

	let startingRailCount = config?.startingRails ?? 1
	let leftRailCount = floor((startingRailCount - 1) * 0.5)
	let rightRailCount = ceil((startingRailCount - 1) * 0.5)
	rails.clear()
	addRails(leftRailCount, rightRailCount, true)
	let leftmostRail = farthestRails[0]
	let rightmostRail = farthestRails[1]

	depths.clear()
	durabilities.clear()
	healths.clear()
	farthestRocks[0] = 0
	farthestRocks[1] = 0
	expandTo(leftmostRail - 100, rightmostRail + 100, true)

	miners.length = 0
	let startingMiners = config?.startingMiners ?? 1
	addMiners(startingMiners)
}

function loadGame(data){
	lastSave = Date.now()
	if (!data){
		data = localStorage.getItem("mine-save")
	}
	if (!data){
		startNewGame()
		return
	}
	try {
		// startNewGame()
		// money = 1000000
		// return
		let unzipped = zipson.parse(data)
		let values = unzipped.split("🦭")
		let gameData = {}
		for (let v of values){
			let key = v.substring(0, v.indexOf(":"))
			let value = v.substring(v.indexOf(":") + 1)
			try {
				gameData[key] = zipson.parse(value)
			}
			catch {
				gameData[key] = value
			}
		}

		money = Number(gameData["$"] || 0)
		if (isNaN(money)) money = 0

		let railCount = gameData["#R"] ?? 1
		let leftRailCount = floor((railCount - 1) * 0.5)
		let rightRailCount = ceil((railCount - 1) * 0.5)
		rails.clear()
		addRails(leftRailCount, rightRailCount, true)

		// let rockStats = [-100, 100]
		let rockStats
		try {
			rockStats = gameData["DM"]
		} catch {
			rockStats = [-100, 100]
		}
		depths.clear()
		durabilities.clear()
		healths.clear()
		expandTo(rockStats[0], rockStats[1], true)
		
		let depthData = gameData["DD"] || [100]
		// depthData = [100, 150, 120, 150, 200, 208, 100, 150]
		let leftmostRock = rockStats[0]
		let rightmostRock = rockStats[1]
		let totalRocks = rightmostRock - leftmostRock
		for (let i = leftmostRock; i < rightmostRock; i++){
			let p = (i + abs(leftmostRock)) / (rightmostRock - leftmostRock) * (depthData.length - 1)
			let leftIndex = floor(p)
			let rightIndex = ceil(p)
			let leftValue = depthData[leftIndex]
			if (typeof leftValue !== "number") leftValue = 100
			let rightValue = depthData[rightIndex]
			if (typeof rightValue !== "number") rightValue = 100
			p = p % 1
			let v = (1 - p) * leftValue + p * rightValue
			v = floor(v)
			if (typeof v !== "number") v = 100
			depths.set(i, v)
		}

		miners.length = 0
		let startingMiners = gameData["#M"] ?? 1
		addMiners(startingMiners)

		let minerUpgradeMap = gameData["MU"] || {}
		let minerUpgradesApplied = 0
		for (let upgradeHash in minerUpgradeMap){
			let stats = JSON.parse(upgradeHash)
			let count = minerUpgradeMap[upgradeHash]
			for (let i = 0; i < count; i++){
				let minerIndex = minerUpgradesApplied + i
				let miner = miners[minerIndex]
				for (let stat in stats){
					miner.upgrades[stat] = stats[stat]
					let upgrade = upgrades[stat]
					if (!upgrade) continue
					let value = upgrade.getLevelValue(stats[stat])
					upgrade.applyLevelToEntity(miner, value, stats[stat])
				}
			}
			minerUpgradesApplied += count
		}

		let railUpgradeMap = gameData["RU"] || {}
		let railUpgradesApplied = 0
		for (let upgradeHash in railUpgradeMap){
			let stats = JSON.parse(upgradeHash)
			let count = railUpgradeMap[upgradeHash]
			for (let i = 0; i < count; i++){
				let railIndex = railUpgradesApplied + i + farthestRails[0]
				let rail = rails.get(railIndex)
				for (let stat in stats){
					rail.upgrades[stat] = stats[stat]
					let upgrade = upgrades[stat]
					if (!upgrade) continue
					let value = upgrade.getLevelValue(stats[stat])
					upgrade.applyLevelToEntity(rail, value, stats[stat])
				}
			}
			railUpgradesApplied += count
		}

		// startNewGame()
	}
	catch (e) {
		alert("Hey loading your saved messed up. Sorry. Go send Boo the error (press f12)")
		console.log(e)
		startNewGame()
		return
	}
}

const tags = {}
tags.fps = document.getElementById("fps")
tags.money = document.getElementById("money")
tags.menuTabs = document.getElementById("menu-tabs")
tags.openMenuTab = document.getElementById("open-menu-tab")
tags.sideMenu = document.getElementById("menu")

window.onresize = resize
window.onmousemove = handleMouseMove
tags.openMenuTab.onclick = toggleSideMenu
$(".menu-tab.secondary").click(clickMenuTabHandler)
$("#setting-game-render-scale").change(event => {
	let val = $(event.currentTarget).val()
	val = 6 - parseInt(val)
	changeScale(val)
})
$("#setting-render-rocks").change(event => {
	renderRocksEachFrame = $(event.currentTarget).is(":checked")
})
$("#setting-render-rails").change(event => {
	renderRailsEachFrame = $(event.currentTarget).is(":checked")
})
$("#setting-render-miners").change(event => {
	renderMinersEachFrame = $(event.currentTarget).is(":checked")
})
$("#upgrade-buy-miner").click(function(){
	buyMiners(miners.length + currentBuyAmount)
	rerenderUpgrades()
})
$("#upgrade-buy-rail").click(function(){
	buyRails(currentBuyAmount)
	rerenderUpgrades()
})
$(".increase-buy-amount").click(function(){
	currentBuyAmount *= 10
	if (currentBuyAmount > 10000) currentBuyAmount = 1
	currentBuyAmount = floor(currentBuyAmount)
	rerenderUpgrades()
})
$(".decrease-buy-amount").click(function(){
	currentBuyAmount /= 10
	if (currentBuyAmount < 1) currentBuyAmount = 1
	currentBuyAmount = floor(currentBuyAmount)
	rerenderUpgrades()
})
start()
changeMenuSection("miners")
changeScale(gameRenderScale)