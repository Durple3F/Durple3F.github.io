const canvas = $("#screen")[0]
const ctx = canvas.getContext("2d")

const mouse = {
	x: 0,
	y: 0,
	isDown: false,
	downX: 0,
	downY: 0,
	upX: 0,
	upY: 0
}

let gameRound
const boardSize = 8
let frameRate = 60

const colors = ["red", "yellow", "green", "blue", "purple"]

const UNITVECTORS = [
	[1, 0],
	[0, 1]
]
const OPPOSITEVECTORS = new Map()
for (let v of UNITVECTORS){
	let opposite = v.map(x => x * -1)
	OPPOSITEVECTORS.set(v, opposite)
	OPPOSITEVECTORS.set(opposite, v)
}

function randomAngle(deg1, deg2){
	let result = (deg1 + Math.random() * (deg2 - deg1)) / 180 * Math.PI
	return result
}

function weightedRandom(items, weights) {
	if (items.length !== weights.length) {
		throw new Error('Items and weights must be of the same size');
	}

	if (!items.length) {
		throw new Error('Items must not be empty');
	}

	// Preparing the cumulative weights array.
	// For example:
	// - weights = [1, 4, 3]
	// - cumulativeWeights = [1, 5, 8]
	const cumulativeWeights = [];
	for (let i = 0; i < weights.length; i += 1) {
		cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
	}

	// Getting the random number in a range of [0...sum(weights)]
	// For example:
	// - weights = [1, 4, 3]
	// - maxCumulativeWeight = 8
	// - range for the random number is [0...8]
	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
	const randomNumber = maxCumulativeWeight * Math.random();

	// Picking the random item based on its weight.
	// The items with higher weight will be picked more often.
	for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return {
				item: items[itemIndex],
				index: itemIndex,
			};
		}
	}
}
function distance(x1, y1, x2, y2){
	let dx = x2-x1
	let dy = y2-y1
	return Math.sqrt(dx*dx + dy*dy)
}

function bezierEase(t){
	// return [
	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0.42 + 
	// 	3*(1 - t)*Math.pow(t,2)*0.58 + 
	// 	Math.pow(t, 3)*1,

	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0 + 
	// 	3*(1 - t)*Math.pow(t,2)*1 + 
	// 	Math.pow(t, 3)*1,
	// ]
	return Math.pow(1 - t, 3)*0 + 3*Math.pow(1 - t, 2)*t*0 + 3*(1 - t)*Math.pow(t,2)*1 + Math.pow(t, 3)*1
}
function interpolate(v1, v2, p){
	return (1 - p)*v1 + p*v2
}

function randomChoice(arr){
	return arr[Math.floor(Math.random() * arr.length)]
}

const ongoingTextAnimations = new Map()
function animateTextCounter(from, to, elem, duration){
	if (duration === undefined){
		duration = 300
	}

	let fromObj = {val: from}
	let toObj = {val: to}

	if (ongoingTextAnimations.has(elem)){
		let oldAnimation = ongoingTextAnimations.get(elem)
		$(oldAnimation).stop()
	}

	$(fromObj).animate(toObj, {
		duration: duration,
		step: function(){
			elem.text(parseInt(this.val))
		},
		complete: function(){
			elem.text(to)
			ongoingTextAnimations.delete(elem)
		}
	})
	ongoingTextAnimations.set(elem, fromObj)
}

function addFloatingText(text, elem, options){
	let color = options.color ?? "white"
	let direction = options.direction ?? "random"
	let distance = options.distance ?? 100
	let duration = options.duration ?? 500
	let side = options.side ?? "center"
	let floater = $("<div class='floating-text'></div>")
	floater.text(text)
	floater.css("color", color)
	$("body").append(floater)

	let offset = $(elem).offset()
	let width = $(elem).width()
	let height = $(elem).height()
	let elemWidth = floater.width()
	let elemHeight = floater.height()
	let xOff = 0
	let yOff = 0

	if (side === "center"){
		xOff = offset.left + width * 0.5
		yOff = offset.top + height * 0.5
	} else if (side === "right"){
		xOff = offset.left + width - elemWidth
		yOff = offset.top + height * 0.5
	}
	floater.css("left", xOff)
	floater.css("top", yOff)

	let tx = xOff
	let ty = yOff
	if (direction === "up"){
		direction = Math.PI * 0.5
	} else if (direction === "down"){
		direction = Math.PI * 1.5
	} else if (direction === "left"){
		direction = Math.PI
	} else if (direction === "right"){
		direction = Math.PI * 2
	} else if (direction === "random"){
		direction = Math.PI * Math.random() * 2
	} else if (typeof direction !== "number"){
		console.error(direction, "is not a valid direction")
	}
	
	//Presumably we've been given an angle
	tx = xOff - Math.cos(direction) * distance
	ty = yOff - Math.sin(direction) * distance

	floater.animate({
		left: tx, top: ty, opacity: 0
	}, duration).queue(() => {
		floater.remove()
	})
}

function getEmptyEnergy(){
	let t = {}
	colors.forEach(c => t[c] = 0)
	return t
}

const sprites = {
	images: {},
	batches: []
}
function handleSpriteLoad(){
	let allLoaded = true
	for (let key in sprites.images){
		let sprite = sprites.images[key]
		if (!sprite.complete){
			allLoaded = false
		}
	}
}
function loadSprite(name, url, batch){
	let img = new Image()
	img.src = url
	sprites.images[name] = img
	let promise = new Promise((resolve, reject) => {
		img.onload = function(){
			handleSpriteLoad()
			resolve()
		}
		img.onerror = reject
	})
	if (batch) batch.push(promise)
	return promise
}
function loadSprites(list){
	let batch = []
	for (let sprite of list){
		loadSprite(sprite.name, sprite.url, batch)
	}
	sprites.batches.push(batch)
	let promise = Promise.all(batch)
	return promise
}

class Round{
	constructor(trainer1, trainer2){
		this.board = new Board(8, 8)
		this.board.fill()
		this.trainers = [trainer1, trainer2]
		this.trainer1 = trainer1
		this.trainer2 = trainer2
		this.trainerTags = []
		this.trainers.forEach(t => {
			t.tags = {}
			this.trainerTags.push(t.tags)
		})

		this.animationQueue = []
		this.showingAnnouncements = []
		this.announcementCallbackQueue = []
		this.moveQueue = []

		this.state = "waiting"
		this.activePlayer = "player"
		this.activePlayerIndex = 0
		this.inactivePlayerIndex = 1
		this.turn = 1

		this.hasBegun = false
		this.currentlySelecting = null
		this.selectedTiles = []
		this.selectedTile = null
		this.tileSelectionType = "click"
		this.currentlyReversingSwap = false
		this.currentlyCarryingOutSwap = false
		this.matchesInCombo = []

		this.begin()

		this.tickInterval = setInterval(tick, 1000 / frameRate)
	}

	begin(){
		let playerTags = this.trainerTags[0]
		let enemyTags = this.trainerTags[1]
		this.fillTrainerTags(playerTags, ".player")
		this.fillTrainerTags(enemyTags, ".enemy")

		this.confirmButton = $(".board-side.player .confirm-btn")
		this.confirmButton.click(() => {
			this.confirm()
		})
		this.confirmButton.hide()

		for (let i in this.trainers){
			let trainer = this.trainers[i]
			let tags = this.trainerTags[i]
			let activePokemon = trainer.activePokemon
			let name = activePokemon.name
			let pokemonName = activePokemon.pokemonName
			let src = activePokemon.data.imageSources[pokemonName]
			tags.pokemonImage.css("background-image", `url(${src})`)
			tags.pokemonName.text(name)
		}

		//TODO later we'll need to ensure that the faster player goes first
		this.changeTurns(0)

		this.resetCurrentlySelecting()
		this.resetPokemonMoves()
		this.updateEverything()
		this.updateConfirmButton()
		this.timeStep()
		this.hasBegun = true
	}

	end(){
		//Empty both trainer's energy pools
		for (let trainer of this.trainers){
			for (let pokemon of trainer.pokemon){
				for (let color in pokemon.energy){
					pokemon.energy[color] = 0
				}
			}
		}
	}

	applyGravity(){
		let now = Date.now()
		//for each column, let's find all the tiles in that column.
		let columns = []
		for (let i = 0; i < this.board.width; i++){
			columns[i] = this.board.getColumn(i)
		}
		let animations = {
			batch: [],
			info: {
				round: this
			},
			halts: false,
			callback: function(){
				let round = this.info.round
				round.applyLocationChanges(this.info.newLocationMap)
				round.timeStep()
			}
		}
		let newLocationMap = []
		for (let column of columns){
			let bottom = this.board.height - 1
			for (let i = column.length - 1; i >= 0; i--){
				let tile = column[i]
				let spaceBelow = bottom - tile.y
				if (spaceBelow > 0){
					let anim = animTemplates["displace"](tile, tile.x, tile.y + spaceBelow, now, 300)
					animations.batch.push(anim)
					newLocationMap.push([tile, [tile.x, tile.y + spaceBelow]])
				}
				bottom = tile.y + spaceBelow - 1
			}
		}
		animations.info.newLocationMap = newLocationMap
		this.addAnimation(animations)
	}

	applyLocationChanges(map){
		for (let change of map){
			let tile = change[0]
			let loc = change[1]
			tile.x = loc[0]
			tile.y = loc[1]
		}
	}

	swap(tile1, tile2){
		this.beginMove()
		let map = [
			[tile1, [tile2.x, tile2.y]],
			[tile2, [tile1.x, tile1.y]],
		]
		//Maybe this swap ends in no changes. If so, swap 'em back.
		this.applyLocationChanges(map)
		let matches = this.board.getAllMatches()
		if (matches.length === 0 && !this.currentlyReversingSwap){
			this.currentlyReversingSwap = true
			this.animateSwitchLocations(tile1, tile2)
		} else {
			this.timeStep()
		}
	}

	handleEffects(matches){
		let tiles = []
		for (let match of matches){
			match.forEach(t => tiles.push(t))
		}

		let activeTrainer = this.trainers[this.activePlayerIndex]
		let otherTrainer = this.trainers[this.inactivePlayerIndex]

		//Let's give the active player energy of each color based on tiles matched
		//of that color
		let energy = getEmptyEnergy()
		for (let tile of tiles){
			let energyValue = tile.getEnergyValue()
			for (let color in energyValue){
				energy[color] += energyValue[color]
			}
		}
		activeTrainer.gainEnergy(energy)

		//For now, let's just deal damage equal to the number of tiles matched.

		let activePokemon = otherTrainer.activePokemon
		let damage = tiles.length
		activePokemon.hp -= damage
		let options = {
			color: "#db2428",
			direction: randomAngle(225, 315),
			duration: 2000,
			distance: 30,
			side: "right"
		}
		let healthBar = this.trainerTags[this.inactivePlayerIndex].healthBar
		addFloatingText("-" + damage, healthBar, options)

		this.updateStats()
	}

	beginMove(){
		this.matchesInCombo.length = 0
		this.currentlyCarryingOutSwap = true
	}

	endMove(){
		//This is where all of the end-of-move rewards can be done

		let nextPlayer = this.getNextPlayer()
		if (nextPlayer !== this.activePlayerIndex){
			this.prepareToChangeTurns(nextPlayer)
		}

		//Next turn
		this.currentlyReversingSwap = false
		this.updateStats()
		this.turn++
		if (this.hasBegun){
			this.waitUntilNoAnnouncements(() => {
				this.turnStart()
			})
		}
	}

	prepareToChangeTurns(newPlayer){
		//Put a big ol' announcement on screen that says whose turn it is
		let text
		if (newPlayer === 0){
			text = "Your turn"
		} else if (newPlayer === 1) {
			//TODO use the enemy's name
			text = "Enemy turn"
		} else {
			text = "Huh??? Received a weird changeTurn request: " + newPlayer
		}

		if (!this.currentlyReversingSwap){
			this.createAnnouncement("general", text, 1500)
		}

		this.changeTurns(newPlayer)
	}

	changeTurns(newPlayer){
		if (newPlayer === undefined){
			newPlayer = [1, 0][this.activePlayerIndex]
		}
		if (newPlayer === 1){
			this.activePlayerIndex = 1
			this.activePlayer = "enemy"
			this.inactivePlayerIndex = 0
		} else {
			this.activePlayerIndex = 0
			this.activePlayer = "player"
			this.inactivePlayerIndex = 1
		}
		let activeTags = this.trainerTags[this.activePlayerIndex]
		let inactiveTags = this.trainerTags[this.inactivePlayerIndex]
		activeTags.side.addClass("active")
		inactiveTags.side.removeClass("active")
	}

	getNextPlayer(){
		//If you matched 4 or more, you get an extra turn.
		let getExtraTurn = this.matchesInCombo.some(m => m.length >= 4)
		if (this.matchesInCombo.length > 0 && !getExtraTurn){
			return this.inactivePlayerIndex
		}
		return this.activePlayerIndex
	}

	timeStep(){
		let matches = this.board.getAllMatches()

		if (matches.length > 0){
			//Those matched tiles explode.
			let tiles = []
			for (let match of matches){
				//Probably reward the player for the match here
				for (let tile of match){
					this.board.explodeTile(tile)
					tiles.push(tile)
				}
			}
			this.handleEffects(matches)

			//Add those matches to the current combo
			matches.forEach(m => this.matchesInCombo.push(m))
			
			this.applyGravity()
		} else {
			this.endMove()
			this.applySpriteHighlights()
		}

		this.updateEverything()
	}

	tick(){
		if (this.animationQueue.length){
			let now = Date.now()
			for (let animation of this.animationQueue){
				let parts = animation.batch
				let allDone = true
				for (let part of parts){
					if (now < part.endT){
						allDone = false
					}
				}
				if (allDone){
					if (animation.callback){
						animation.callback()
					}
					this.completeAnimation(animation)
				}
			}
		}

		let board = this.board
		for (let tile of board.contents){
			let d = distance(mouse.x, mouse.y, tile.spriteCenterX, tile.spriteCenterY)
			let closeness = d/(board.spriteTileW * 0.5)
			closeness *= closeness
			let scaleEffect = (1 - Math.max(closeness, 0.85))
			let isImportant = d < board.spriteTileW * 0.5
			if (this.selectedTiles.includes(tile)){
				isImportant = this.selectedTiles.includes(tile)
				closeness = 0
				scaleEffect = 0.23
			}
			if (isImportant){
				tile.spriteRenderScale = 1 + scaleEffect
			} else {
				tile.spriteRenderScale += (1 - tile.spriteRenderScale) * 0.5
			}
		}
	}

	turnStart(){
		this.currentlyCarryingOutSwap = false
		if (this.activePlayer === "enemy"){
			this.computerMakeSwap()
		}

		let activePlayer = this.trainers[this.activePlayerIndex]
		let tags = this.trainerTags[this.activePlayerIndex]
		let healthBar = tags.healthBar
		this.resetCurrentlySelecting()
		this.updateEverything()
	}

	computerMakeSwap(){
		let allMoves = this.board.getAllPotentialMoves()
		//TODO score moves somehow. Right now it just picks a random one.
		let bestMove = randomChoice(allMoves)
		this.animateSwitchLocations(bestMove[0], bestMove[1])
	}

	dealDamage(options){
		let attackerTrainer = options.fromTrainer
		if (!attackerTrainer){
			attackerTrainer = this.trainers[this.activePlayerIndex]
		}
		let attacker = options.from
		if (!attacker){
			attacker = attackerTrainer.activePokemon
		}
		let move = options.move
		if (!move){
			move = attacker.activeMoves[0]
		}

		let power = options.power ?? move.power
		let category = options.category ?? move.category ?? "Physical"
		let type = options.type ?? move.type ?? "Typeless"

		let atk, def
		if (category === "Physical"){
			atk = 50
			def = 50
		} else if (category === "Special") {
			atk = 50
			def = 50
		} else {
			console.warn("UNKNOWN CATEGORY", category)
		}

		let defenderTrainer = options.toTrainer
		if (!defenderTrainer){
			let possible = this.trainers.filter(trainer => trainer !== attackerTrainer)
			defenderTrainer = randomChoice(possible)
		}
		let defender = options.to
		if (!defender){
			defender = defenderTrainer.activePokemon
		}

		let damage = (attacker.level * 2 / 5 + 2) * power * atk / def / 50 + 2
		damage = Math.round(damage)
		
		defender.hp -= damage
		let animOptions = {
			color: "#db2428",
			direction: randomAngle(225, 315),
			duration: 2000,
			distance: 30,
			side: "right"
		}
		let healthBar = defenderTrainer.tags.healthBar
		addFloatingText("-" + damage, healthBar, animOptions)
		this.updateHealth(this.trainers.indexOf(defenderTrainer), true)
	}

	canPayCost(move, trainerIndex){
		let payability = {}
		let trainer = this.trainers[trainerIndex]
		let pokemon = trainer.activePokemon

		if (!move.specialCost){
			let energy = move.energy
			
			for (let color of colors){
				if (energy[color] === undefined) {
					payability[color] = true
					continue
				}
				payability[color] = pokemon.energy[color] >= energy[color]
			}
		}

		return payability
	}

	canUseMovesRightNow(trainerIndex){
		return trainerIndex === this.activePlayerIndex
		&& !this.currentlyCarryingOutSwap
	}

	attemptToUseMove(event){
		let moveTag = $(event.currentTarget)
		let trainerIndex = parseInt(moveTag.attr("data-trainer"))
		let pokemonIndex = parseInt(moveTag.attr("data-pokemon"))
		let moveIndex = parseInt(moveTag.attr("data-move"))
		if (!this.canUseMovesRightNow(trainerIndex)) {
			//TODO announcement message saying fuck off
			return
		}
		let trainer = this.trainers[trainerIndex]
		let pokemon = trainer.pokemon[pokemonIndex]
		let move = pokemon.moves[moveIndex]
		let payability = this.canPayCost(move, trainerIndex)
		let canPay = Object.keys(payability).every(k => payability[k] === true)
		if (!canPay) {
			//TODO announcement message saying you can't pay
			return
		}
		this.payForMove(trainer, pokemon, move)
		this.beginToUseMove(trainer, pokemon, move)
	}
	payForMove(trainer, pokemon, move){
		for (let color of colors){
			if (move.energy[color] === undefined) continue
			pokemon.energy[color] -= move.energy[color]
		}
	}
	beginToUseMove(trainer, pokemon, move){
		//Put the move on recharge
		let moveIndex = pokemon.moves.indexOf(move)
		pokemon.moveUsage[moveIndex].recharge = move.rechargeTurns

		//Some moves require extra information
		//Ex: choose a tile, energy bar, or number
		let moveUseObj = {
			trainer: trainer,
			pokemon: pokemon,
			move: move,
			effectIndex: 0
		}
		let resolveMove
		let promise = new Promise((resolve, reject) => {
			resolveMove = resolve
		})
		moveUseObj.resolve = resolveMove
		moveUseObj.promise = promise

		this.moveQueue.push(moveUseObj)

		this.advanceCurrentMove()
		promise.then(() => {
			console.log(this)
		})
	}
	advanceCurrentMove(){
		this.resetCurrentlySelecting()
		let moveUseObj = this.moveQueue[0]
		let effectIndex = moveUseObj.effectIndex
		let effects = moveUseObj.move.effects

		// console.log("Running effect", effectIndex)

		if (effectIndex >= effects.length){
			moveUseObj.resolve()
			return
		}

		let effect = effects[effectIndex]
		let effectType = effect.type
		let resolvePromise
		let promise = new Promise((resolve, reject) => {
			resolvePromise = resolve
		})
		promise.then(() => {
			moveUseObj.effectIndex += 1
			this.advanceCurrentMove()
		})
		
		if (effectType === "choose-tiles"){
			let count = effect.count ?? 1
			this.currentlySelecting = {
				type: "tiles",
				count: count
			}
			this.currentlySelecting.resolve = resolvePromise
			this.currentlySelecting.promise = promise
			this.createAnnouncement("general", `Select ${count} tiles`)
		} else if (effectType === "damage"){
			this.dealDamage({
				from: moveUseObj.pokemon,
				fromTrainer: moveUseObj.trainer,
				move: moveUseObj.move
			})
			resolvePromise()
		} else {
			console.warn("You never handled", effectType)
		}
		this.updateEverything()
	}

	confirm(){
		let selectType = this.currentlySelecting
		if (selectType.type === "tiles"){
			let valid = this.selectionIsValid()
			if (valid){
				this.submitSelection()
			}
		}
		this.updateConfirmButton()
	}
	updateConfirmButton(){
		let selectType = this.currentlySelecting.type
		if (selectType === "tiles"){
			this.confirmButton.show()
		} else {
			this.confirmButton.hide()
		}
	}

	canSelectTile(tile){
		return this.activePlayer === "player"
		&& this.state === "waiting"
		&& this.showingAnnouncements.length === 0
	}
	selectTile(tile){
		if (!this.canSelectTile(tile)) return
		this.moveToTopLayer(tile)
		this.selectedTile = tile
		this.selectedTiles.push(tile)
		this.tileSelectionType = "click"
		let selectType = this.currentlySelecting.type
		if (selectType === "swap"){
			setTimeout(function(){
				if (mouse.isDown){
					this.tileSelectionType = "hold"
				}
			}.bind(this), 50)
		} else if (selectType === "tiles"){
			if (!config.confirmMoveSelection){
				let valid = this.selectionIsValid()
				let maxed = this.selectedTiles.length === this.currentlySelecting.count
				if (valid && maxed){
					this.submitSelection()
				}
			}
		}
		this.updateConfirmButton()
	}
	deselectTile(tile){
		if (tile === this.selectedTile){
			this.selectedTile = null
		}
		let index = this.selectedTiles.indexOf(tile)
		this.selectedTiles.splice(index, 1)
		this.tileSelectionType = null
	}
	deselectAllTiles(){
		while (this.selectedTiles.length){
			this.deselectTile(this.selectedTiles[0])
		}
	}
	selectionIsValid(){
		let selecting = this.currentlySelecting
		return this.selectedTiles.length === selecting.count
	}
	resetCurrentlySelecting(){
		this.currentlySelecting = {
			type: "swap"
		}
	}
	submitSelection(){
		this.currentlySelecting.resolve()
		this.deselectAllTiles()
	}

	addAnimation(animation){
		if (this.state === "waiting"){
			this.state = "animating"
		}
		this.animationQueue.push(animation)
	}
	completeAnimation(animation){
		let index = this.animationQueue.indexOf(animation)
		this.animationQueue.splice(index, 1)
		if (this.animationQueue.length === 0){
			this.state = "waiting"
		}
	}
	
	animateSwitchLocations(tile1, tile2){
		let now = Date.now()
		let duration = 300
		let animation1 = animTemplates["displace"](tile1, tile2.x, tile2.y, now, duration)
		let animation2 = animTemplates["displace"](tile2, tile1.x, tile1.y, now, duration)
		let animations = {
			batch: [animation1, animation2],
			info: {
				round: this,
				tile1: tile1,
				tile2: tile2
			},
			halts: false,
			callback: function(){
				let info = this.info
				info.round.swap(info.tile1, info.tile2)
			}
		}
		this.addAnimation(animations)
		return animations
	}

	applySpriteHighlights(){
		for (let tile of this.board.contents){
			tile.spriteHighlight = 0
		}
		let allMoves = this.board.getAllPotentialMoves()
		for (let move of allMoves){
			for (let tile of move){
				tile.spriteHighlight = 1
			}
		}
	}

	createAnnouncement(type, text, duration=1500){
		let obj = {
			type: type,
			text: text
		}
		let startUpTime = duration / 4
		let mainShowingTime = duration - startUpTime * 2

		let announcement = $("<div class='announcement'></div>")
		obj.elem = announcement
		announcement.addClass(type)
		announcement.text(text)
		announcement.hide()
		$("#game-announcements").append(announcement)
		this.showingAnnouncements.push(obj)
		announcement.fadeIn(startUpTime)
		.delay(mainShowingTime)
		.fadeOut(startUpTime)
		.queue(() => {
			this.removeAnnouncement(obj)
		})
	}
	removeAnnouncement(announcement){
		announcement.elem.remove()
		let index = this.showingAnnouncements.indexOf(announcement)
		this.showingAnnouncements.splice(index, 1)
		this.performAnnouncementCallbacks()
	}
	waitUntilNoAnnouncements(callback){
		this.announcementCallbackQueue.push(callback)
		if (this.showingAnnouncements.length === 0){
			this.performAnnouncementCallbacks()
		}
	}
	performAnnouncementCallbacks(){
		let callbackQueue = this.announcementCallbackQueue
		while (callbackQueue.length && !this.showingAnnouncements.length){
			callbackQueue[0]()
			callbackQueue.splice(0, 1)
		}
	}

	getChosenTile(){
		let board = this.board
		for (let tile of board.contents){
			let d = distance(mouse.x, mouse.y, tile.spriteCenterX, tile.spriteCenterY)
			let closeness = d/(board.spriteTileW * 0.5)
			if (closeness < 1){
				return tile
			}
		}
	}

	handleMouseMove(){
		if (this.currentlySelecting.type === "swap"){
			if (this.selectedTile && this.tileSelectionType === "hold"){
				let chosenTile = this.getChosenTile()
				if (!chosenTile) return
				this.moveToTopLayer(chosenTile)
				let canSwap = this.board.couldSwap(this.selectedTile, chosenTile)
				if (chosenTile !== this.selectedTile && canSwap){
					this.animateSwitchLocations(chosenTile, this.selectedTile)
					this.deselectTile(this.selectedTile)
				}
			}
		}
	}

	handleMouseDown(){
		let chosenTile = this.getChosenTile()
		if (!chosenTile) return
		let selectType = this.currentlySelecting.type

		if (selectType === "swap"){
			if (this.selectedTile){
				let canSwap = this.board.couldSwap(this.selectedTile, chosenTile)
				if (chosenTile === this.selectedTile){
					this.deselectTile(this.selectedTile)
				} else if (this.selectedTile && canSwap) {
					this.animateSwitchLocations(chosenTile, this.selectedTile)
					this.deselectTile(this.selectedTile)
				}
			} else if (this.canSelectTile(chosenTile)) {
				this.selectTile(chosenTile)
			}
		} else if (selectType === "tiles"){
			let alreadySelected = this.selectedTiles.includes(chosenTile)
			if (alreadySelected){
				this.deselectTile(chosenTile)
			} else {
				if (this.selectedTiles.length < this.currentlySelecting.count){
					this.selectTile(chosenTile)
				} else {
					let firstTile = this.selectedTiles[0]
					this.deselectTile(firstTile)
					this.selectTile(chosenTile)
				}
			}
		}
	}

	handleMouseUp(){
		if (this.selectedTile){
			if (this.tileSelectionType === "hold"){
				this.deselectTile(this.selectedTile)
			}
		}
	}

	moveToTopLayer(tile){
		let index = this.board.contents.indexOf(tile)
		this.board.contents.splice(index, 1)
		this.board.contents.push(tile)
	}

	updateStats(){
		for (let i in this.trainers){
			this.updateHealth(i, this.hasBegun)
			this.updateEnergy(i, this.hasBegun)
		}
	}

	updateHealth(trainerIndex, animate, duration=200){
		let tags = this.trainerTags[trainerIndex]
		let activePokemon = this.trainers[trainerIndex].activePokemon
		let hp = activePokemon.hp
		let max = activePokemon.maxhp
		let p = hp / max
		let percent = p * 100 + "%"
		tags.healthBar.attr("data-width", percent)
		if (!animate){
			tags.healthCurrent.text(hp)
			tags.healthMax.text(max)
			tags.healthBar.css("width", percent)
		} else {
			let oldHealth = parseInt(tags.healthCurrent.text())
			animateTextCounter(oldHealth, hp, tags.healthCurrent, duration)

			let oldMax = parseInt(tags.healthMax.text())
			animateTextCounter(oldMax, max, tags.healthMax, duration)

			let availableWidth = tags.health.width()
			let curWidth = tags.healthBar.width()
			let newWidth = p * availableWidth
			let barFrom = {width: curWidth}
			let barTo = {width: newWidth}
			$(barFrom).animate(barTo, {
				duration: duration,
				step: function(){
					tags.healthBar.css("width", this.width)
					let curP = this.width / availableWidth
					tags.healthBar.css("background-color", getHealthColor(curP))
				},
				complete: function(){
					tags.healthBar.css("width", newWidth)
					tags.healthBar.css("background-color", getHealthColor(p))
				}
			})
		}
	}

	updateEnergy(trainerIndex, animate, duration=300){
		let tags = this.trainerTags[trainerIndex]
		let energyBars = tags.energyBars
		let trainer = this.trainers[trainerIndex]
		let pokemon = trainer.activePokemon
		let energy = pokemon.energy
		let maxEnergy = pokemon.maxEnergy
		colors.forEach(c => {
			let bar = energyBars[c + "Bar"]
			let count = energyBars[c + "Count"]
			let oldCount = parseInt(count.text())
			let p = energy[c] / maxEnergy[c]
			let percent = p * 100 + "%"
			
			if (oldCount === energy[c]) return

			if (animate){
				animateTextCounter(oldCount, energy[c], count)
				bar.animate({
					height: percent
				}, duration)
			} else {
				count.text(energy[c])
				bar.css({
					height: percent
				})
			}
		})
	}

	updateEverything(){
		for (let i = 0; i < this.trainers.length; i++){
			this.updateHealth(i, true)
			this.updateEnergy(i, true)
			this.updatePokemonMoves(i)
		}
		
		this.updateConfirmButton()
	}

	fillTrainerTags(tags, classname){
		tags.side = $(`#board .board-side${classname}`)
		tags.sideTop = tags.side.children(".board-side-top")
		tags.sideMiddle = tags.side.children(".board-side-middle")
		tags.sideBottom = tags.side.children(".board-side-bottom")

		tags.health = tags.sideTop.children(".health-bar")
		tags.healthBar = tags.health.children(".bar")
		tags.healthText = tags.health.children("span")
		tags.healthCurrent = tags.healthText.children(".current-health")
		tags.healthCurrent.text(0)
		tags.healthMax = tags.healthText.children(".max-health")
		tags.healthMax.text(0)
		tags.pokemonSection = tags.sideTop.children(".avatar-pokemon-section")
		tags.pokemonName = tags.pokemonSection.children(".avatar-pokemon-name")
		tags.pokemonImage = tags.pokemonSection.children(".avatar-pokemon-image")

		tags.energySection = tags.sideMiddle.children(".energy-resources")
		tags.energyBars = {}
		colors.forEach(c => {
			tags.energyBars[c] = tags.energySection.children(`[data-energy='${c}']`)
			tags.energyBars[c + "Count"] = tags.energyBars[c].children(".count")
			tags.energyBars[c + "Bar"] = tags.energyBars[c].children(".bar")
		})

		tags.moveList = tags.sideBottom.children(".move-list")
		tags.moves = []
	}

	resetPokemonMoves(){
		for (let i in this.trainers){
			let trainer = this.trainers[i]
			let tags = this.trainerTags[i]
			tags.moves.forEach(tag => {
				$(tag).remove()
			})
			tags.moves.length = 0
			let moveListTag = tags.moveList
			moveListTag.html()

			let pokemon = trainer.activePokemon
			let pokemonIndex = trainer.pokemon.indexOf(pokemon)
			let moves = pokemon.activeMoves

			for (let j in moves){
				let move = moves[j]
				let tag = $("<div class='move'></div>")
				tags.moves.push(tag)
				tag.attr("data-trainer", i)
				tag.attr("data-pokemon", pokemonIndex)
				let moveIndex = pokemon.moves.indexOf(move)
				tag.attr("data-move", moveIndex)
				
				let moveTop = $("<div class='move-top'></div>")
				moveTop.append(`<div class='move-name'>${move.name}</div>`)
				moveTop.append(`<div class='move-type'>
				<img src='${getTypeIcon(move.category)}'>
				<img src='${getTypeIcon(move.type)}'>
				</div>`)
				tag.append(moveTop)

				tag.append(`<div class='move-desc'>${move.shortDescription}</div>`)

				let moveCostTag = $("<div class='move-cost'></div>")
				let payability = this.canPayCost(move, i)
				if (!move.specialCost){
					for (let color of colors){
						let cost = $("<div class='cost-part energy'></div>")
						cost.addClass("energy-"+color)
						cost.attr("data-cost", color)

						if (move.energy[color] !== undefined){
							let icon = $("<span class='icon'></span>")
							if (!payability[color]){
								icon.addClass("unpayable")
							}
							cost.append(icon)

							cost.append(`<span class='cost'>${move.energy[color]}</span>`)
						}
						
						moveCostTag.append(cost)
					}
				}
				tag.append(moveCostTag)
				tag.appendTo(moveListTag)

				tag.click(event => this.attemptToUseMove(event))
			}
		}
	}
	updatePokemonMoves(trainerIndex){
		let trainer = this.trainers[trainerIndex]
		let tags = this.trainerTags[trainerIndex]
		let moveList = tags.moves
		for (let moveTag of moveList){
			let userIndex = moveTag.attr("data-trainer")
			let pokemonIndex = moveTag.attr("data-pokemon")
			let moveIndex = moveTag.attr("data-move")

			let thisTrainer = this.trainers[userIndex]
			let thisPokemon = thisTrainer.pokemon[pokemonIndex]
			let thisMove = thisPokemon.moves[moveIndex]
			let payability = this.canPayCost(thisMove, trainerIndex)
			let moveCostTag = moveTag.children(".move-cost")
			let costParts = moveCostTag.children(".cost-part")
			
			let usable = true
			for (let costTag of costParts){
				costTag = $(costTag)
				let costName = costTag.attr("data-cost")
				if (payability[costName]){
					let icon = costTag.children(".icon")
					icon.removeClass("unpayable")
				} else {
					usable = false
				}
			}

			if (usable && this.canUseMovesRightNow(trainerIndex)){
				moveTag.addClass("usable")
			} else {
				moveTag.removeClass("usable")
			}
		}
	}
}

class Trainer{
	constructor(name, pokemon){
		this.name = name
		this.pokemon = []
		pokemon.forEach(p => this.pokemon.push(p))
		this.activePokemon = this.pokemon[0]
		if (!this.activePokemon){
			console.warn("WEE OO WEE OO")
			console.trace()
		}
	}

	gainEnergy(energy){
		for (let color in energy){
			this.gainEnergyColor(color, energy[color])
		}
	}
	gainEnergyColor(color, amount){
		let pokemon = this.activePokemon
		if (!pokemon){
			console.warn("tried to give energy to a nonexistent pokemon")
			console.trace()
		}
		pokemon.energy[color] += amount
		if (pokemon.energy[color] > pokemon.maxEnergy[color]){
			pokemon.energy[color] = pokemon.maxEnergy[color]
		}
	}
}

class Pokemon{
	constructor(name, pokemonName, options){
		this.name = name
		this.pokemonName = pokemonName ?? this.name
		this.data = pokemonData[this.pokemonName]
		this.level = 1
		//Yikes this stuff is gonna be fun
		this.hp = this.data.stats.hp
		this.maxhp = this.data.stats.hp
		this.learnset = this.data.learnset.map(move => move)
		this.moves = this.learnset.map(move => pokemonMoveData[move.name])
		this.movesUnlockedMap = this.learnset.map(move => {
			return checkIfPokemonMeetsRequirements(this, move.unlock)
		})
		this.moveUsage = this.moves.map(move => {
			return {
				recharge: 0
			}
		})

		//You can only have 4 moves active at once
		//By default, pick a random selection of no more than 4 moves
		this.activeMoves = []
		while (this.activeMoves.length < 4){
			let availableMoves = this.movesUnlockedMap.map((m, i) => {
				return !!m ? i : null;
			})
			.filter(m => m !== null)
			.filter(i => {
				return !this.activeMoves.includes(this.moves[i])
			})
			if (availableMoves.length === 0){
				break
			} else {
				let r = Math.floor(Math.random() * availableMoves.length)
				let index = availableMoves[r]
				this.activeMoves.push(this.moves[index])
			}
		}
		
		this.energy = getEmptyEnergy()
		this.maxEnergy = getEmptyEnergy()
		colors.forEach(c => this.maxEnergy[c] = 10)
	}
}

class Board{
	constructor(width, height){
		this.width = width
		this.height = height
		this.contents = []

		this.spriteTileW = 0
		this.spriteTileH = 0
	}

	isFull(){
		let sum = 0
		for (let i = 0; i < this.contents.length; i++){
			let tile = this.contents[i]
			sum += tile.width * tile.height
		}
		return sum === this.width * this.height
	}

	add(tile){
		this.contents.push(tile)
	}

	explodeTile(tile){
		let index = this.contents.indexOf(tile)
		if (index !== -1) {
			this.contents.splice(index, 1)
			//Create a new tile at the top of the column to fill this one's space
			let column = this.getColumn(tile.x)
			let top = Math.min(-1, column[0].y - 1)
			let newTile = new Tile("random", tile.x, top)
			this.add(newTile)
		}
	}

	fill(){
		while (!this.isFull()){
			let createdTile = false
			let maxAttempts = this.width * this.height * 10
			let attempts = 0
			while (!createdTile && attempts < maxAttempts){
				let x = Math.floor(Math.random() * this.width)
				let y = Math.floor(Math.random() * this.height)
				let alreadyThere = this.contents.some(t => t.x === x && t.y === y)
				let tile = new Tile("random", x, y)
				let wouldCreateMatch = this.wouldCreateMatch(tile, x, y)
				if (!alreadyThere && !wouldCreateMatch){
					this.add(tile)
					createdTile = true
				}
			}
		}
	}

	findTileAt(x, y){
		return this.contents.find(t => this.tileIsAt(t, x, y))
	}
	tileIsAt(t, x, y){
		if (t.x === x && t.y === y) return true
		return false
	}

	getColumn(x){
		return this.contents.filter(t => t.x === x).sort((a, b) => a.y - b.y)
	}

	matchesIfSwapped(tile1, tile2){
		let locationMap = new Map()
		for (let tile of this.contents){
			let x = tile.x
			let y = tile.y
			if (tile === tile1){
				x = tile2.x
				y = tile2.y
			}
			if (tile === tile2){
				x = tile1.x
				y = tile1.y
			}
			locationMap.set([x,y].join(","), tile)
		}
		let matches = []

		//So, for every direction from tile1's new location, we check if it matches with anything.
		let tilesToCheck = [tile1, tile2]
		let oppositeTiles = [tile2, tile1]
		for (let i = 0; i < tilesToCheck.length; i++){
			let tileA = tilesToCheck[i]
			let tileB = oppositeTiles[i]
			for (let v of UNITVECTORS){
				let matching = true
				let opposite = OPPOSITEVECTORS.get(v)
				let dirs = [v, opposite]
				let match = []
				for (let dir of dirs){
					let diff = [0, 0]
					while (matching){
						diff.forEach((_, i) => diff[i] += dir[i])
						let newX = tileB.x + diff[0]
						let newY = tileB.y + diff[1]
						let coord = [newX, newY].join(",")
						let thatTile = locationMap.get(coord)
						if (!thatTile) break
						if (thatTile.matchesWith(tileA)){
							match.push(thatTile)
						} else {
							break
						}
					}
				}
				if (match.length > 1){
					match.push(tileA)
					matches.push(match)
				}
			}
		}

		return matches
	}

	searchDirectionForMatches(tile, vector, x, y){
		//This function pretends the tile is at the given
		//x,y coords if it's told to.
		if (x === undefined){
			x = tile.x
		}
		if (y === undefined){
			y = tile.y
		}
		let allMatches = []
		let currentDiff = [0, 0]
		let matching = true
		while (matching){
			currentDiff.forEach((_, i) => currentDiff[i] += vector[i])
			let thatTile = this.findTileAt(x + currentDiff[0], y + currentDiff[1])
			if (!thatTile){
				break
			}
			if (tile.matchesWith(thatTile)){
				allMatches.push(thatTile)
			} else {
				break
			}
		}
		return allMatches
	}

	wouldCreateMatch(tile, x, y){
		//A tile would create a match if there's 2 consecutive tiles vertically from it
		//(or horizontally)
		for (let v of UNITVECTORS){
			//For every direction, check the number of matches in that direction,
			//PLUS the number of matches in the opposite direction.
			let opposite = OPPOSITEVECTORS.get(v)
			let totalMatches = 0
			totalMatches += this.searchDirectionForMatches(tile, v, x, y).length
			totalMatches += this.searchDirectionForMatches(tile, opposite, x, y).length
			if (totalMatches > 1){
				return true
			}
		}
		return false
	}

	getAllMatchesForTile(tile){
		let allMatches = []
		for (let v of UNITVECTORS){
			let opposite = OPPOSITEVECTORS.get(v)
			let matches = [tile]
			.concat(this.searchDirectionForMatches(tile, v))
			.concat(this.searchDirectionForMatches(tile, opposite))

			if (matches.length > 2){
				matches.sort((a, b) => this.contents.indexOf(a) - this.contents.indexOf(b))
				allMatches.push(matches)
			}
		}
		return allMatches
	}

	getAllMatches(){
		let allMatches = []
		for (let tile of this.contents){
			let matches = this.getAllMatchesForTile(tile)
			if (matches.length){
				for (let match of matches){
					let alreadySeen = allMatches.some(prevMatch => {
						return prevMatch.every((v, i) => match[i] === v)
					})

					if (!alreadySeen){
						allMatches.push(match)
					}
				}
			}
		}
		return allMatches
	}

	getAllPotentialMoves(){
		let alreadyConsidered = []
		let allMoves = []
		for (let tile of this.contents){
			let moves = []
			let dirs = []
			for (let dir of UNITVECTORS){
				let newX = tile.x + dir[0]
				let newY = tile.y + dir[1]
				let thatTile = this.findTileAt(newX, newY)
				if (thatTile){
					let alreadySeen = alreadyConsidered.some(arr => {
						return arr[0] === tile && arr[1] === thatTile
					})
					if (alreadySeen) continue
					let result = this.matchesIfSwapped(tile, thatTile)
					let move = [thatTile, tile]
					alreadyConsidered.push(move)
					if (!result.length) continue
					allMoves.push(move)
				}
			}
		}
		return allMoves
	}

	couldSwap(tile1, tile2){
		return (
			Math.abs(tile1.x - tile2.x) +
			Math.abs(tile1.y - tile2.y) === 1
		)
	}
}
let gameBoard

class Tile{
	constructor(type, x, y, width=1, height=1){
		if (type === "random"){
			type = getRandomTileType()
		}
		this.type = type
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.static = false

		this.spriteRenderScale = 1
		this.spriteX = 0
		this.spriteY = 0
		this.spriteCenterX = 0
		this.spriteCenterY = 0
		this.spriteWidth = 0
		this.spriteHeight = 0
		this.spriteHighlight = 0
	}

	matchesWith(tile){
		if (!tile) return false
		return tile.type === this.type
	}

	getEnergyValue(){
		let energy = getEmptyEnergy()
		switch (this.type){
			case "red": energy.red += 1
			break
			case "yellow": energy.yellow += 1
			break
			case "green": energy.green += 1
			break
			case "blue": energy.blue += 1
			break
			case "purple": energy.purple += 1
			break
		}
		return energy
	}
}

function getRandomTileType(){
	return weightedRandom(
		["red", "blue", "green", "yellow", "purple"],
		[1, 1, 1, 1, 1]
	).item
}

function resize(){
	let screenW = document.body.clientWidth
	let screenH = document.body.clientHeight

	let intendedSize = Math.min(screenH, screenW * 0.6)
	$(canvas).css({"width":intendedSize,"height":intendedSize})
	canvas.width = intendedSize
	canvas.height = intendedSize

	//Resize health bars
	let healthBars = $(".health-bar")
	for (let healthBar of healthBars){
		let bar = $(healthBar).children(".bar")
		let width = bar.attr("data-width")
		if (width !== undefined){
			$(bar).css("width", width)
		}
	}
}

function doTick(){
	gameRound.tick()
}

function tick(){
	doTick()
	requestAnimationFrame(render)
}

function handleMouseMove(event){
	let canvasOffset = $(canvas).offset()
	mouse.x = event.clientX - canvasOffset.left
	mouse.y = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseMove()
	}
}
function handleMouseDown(event){
	let canvasOffset = $(canvas).offset()
	mouse.isDown = true
	mouse.downX = event.clientX - canvasOffset.left
	mouse.downY = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseDown()
	}
}
function handleMouseUp(event){
	let canvasOffset = $(canvas).offset()
	mouse.isDown = false
	mouse.upX = event.clientX - canvasOffset.left
	mouse.upY = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseUp()
	}
}

function beginRound(){
	let player = new Trainer("Player", [
		new Pokemon("Wibbly", "Popplio")
	])
	let enemy = new Trainer("Enemy", [
		new Pokemon("Comfey")
	])
	gameRound = new Round(player, enemy)
	gameBoard = gameRound.board
}

window.onresize = resize
window.onmousemove = handleMouseMove
window.onmousedown = handleMouseDown
window.onmouseup = handleMouseUp
resize()

loadSprites([
	{name: "red", url: "src/img/tiles/red.png"},
	{name: "yellow", url: "src/img/tiles/yellow.png"},
	{name: "green", url: "src/img/tiles/green.png"},
	{name: "blue", url: "src/img/tiles/blue.png"},
	{name: "purple", url: "src/img/tiles/purple.png"},
]).then(beginRound)