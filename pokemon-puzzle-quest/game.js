const caughtPokemon = []
const playerActivePokemon = []
const playerPCBoxes = []

let gameRound, gameBoard
let playerSaveId = null
let playerSaveInfo = {}

class Round{
	constructor(trainer1, trainer2, resolvePromise){
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
		this.moveQueueCallbackQueue = []

		this.state = "waiting"
		this.activePlayer = "player"
		this.activePlayerIndex = 0
		this.inactivePlayerIndex = 1
		this.turn = 1
		this.turnsWhichHaveStarted = {}

		this.result = null
		this.hasBegun = false
		this.hasEnded = false
		this.currentlySelecting = null
		this.selectedTiles = []
		this.selectedTile = null
		this.tileSelectionType = "click"
		this.currentlyReversingSwap = false
		this.currentlyCarryingOutSwap = false
		this.currentlyEndingTurn = false
		this.currentlySwappingPokemon = false
		this.currentCascade = 0
		this.matchesInCombo = []

		this.promise = new Promise(resolve => {
			this.resolve = resolve
		})
		this.resolveRound = resolvePromise
		
		let playerTags = this.trainerTags[0]
		let enemyTags = this.trainerTags[1]
		this.fillTrainerTags(playerTags, ".player")
		this.fillTrainerTags(enemyTags, ".enemy")

		this.confirmButton = $(".board-side.player .confirm-btn")
		this.confirmButton.click(() => {
			this.confirm()
		})
		this.confirmButton.hide()

		this.loadResources()
		this.roundStartAnimation()
		.then(() => this.begin())

		this.startTicks()
	}

	loadResources(){
		//Find all the sounds that pokemon might play when they use moves & stuff.
		let moveList = []
		moveList.push(pokemonMoveData["Struggle"])
		let soundsToUnload = []
		for (let i = 0; i < this.trainers.length; i++){
			let trainer = this.trainers[i]
			for (let j = 0; j < trainer.pokemon.length; j++){
				let pokemon = trainer.pokemon[j]
				if (!pokemon) continue
				for (let k = 0; k < pokemon.activeMoves.length; k++){
					let move = pokemon.activeMoves[k]
					if (!moveList.includes(move)){
						moveList.push(move)
					}
				}
			}
		}
		for (let move of moveList){
			if (!move.sounds) continue
			for (let name in move.sounds){
				let url = move.sounds[name]
				let soundName = `${move.name}-${name}`
				loadSound(soundName, "sound", url)
				soundsToUnload.push(soundName)
			}
		}

		this.promise.then(() => {
			for (let soundName of soundsToUnload){
				unloadSound(soundName)
			}
		})
	}
	roundStartAnimation(){
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)

		let enemyTrainer = this.trainers[1]
		let enemyData = enemyTrainer.data
		let NPCData = NPCTrainerData[enemyData.name] ?? {}
		let p = Promise.resolve()
		if (NPCData.type === "trainer"){
			let trainerImage = NPCData.imageSources.trainer
			this.trainerTags[1].trainerImage.attr("src", trainerImage)
			p = this.animateSendOutPokemon(1, enemyTrainer.activePokemon, "default-throw-pokeball")
		} else {
			this.sendOutPokemon(1, enemyTrainer.activePokemon)
		}

		p.then(() => {
			return this.animateSendOutPokemon(0, this.trainers[0].activePokemon)
		})
		.then(() => {
			resolvePromise()
		})

		return promise
	}

	begin(){
		for (let i in this.trainers){
			let trainer = this.trainers[i]
			let tags = this.trainerTags[i]
			tags.sideMiddle.animate({opacity: "1"})
			tags.sideBottom.animate({opacity: "1"})
			tags.health.animate({opacity: "1"})
		}

		let NPCData = this.trainers[1].data
		if (!NPCData.name){
			//If this is a wild group of pokemon, then when you win you get to
			//catch one of them.
			this.promise = this.promise.then(() => {
				let p = Promise.resolve()
				if (this.result === "win"){
					p = p.then(() => {
						return choosePokemon("Choose a Pokemon you'd like to catch.", this.trainers[1].pokemon, 0)
					})
					.then(pokemon => {
						if (pokemon.length){
							return catchPokemon(pokemon[0])
						} else {
							return Promise.resolve()
						}
					})
				}
				return p
			})
		}

		//TODO later we'll need to ensure that the faster player goes first
		this.changeTurns(0)

		this.resetCurrentlySelecting()
		this.updateEverything()
		this.timeStep()
		.then(() => {
			this.hasBegun = true
			return this.turnStart(1)
		})
	}

	end(result){
		let promise = new Promise(resolve => {
			this.hasEnded = true
			clearInterval(this.tickInterval)
			//Empty both trainer's energy pools
			for (let trainer of this.trainers){
				for (let pokemon of trainer.pokemon){
					for (let color in pokemon.energy){
						pokemon.energy[color] = 0
					}
				}
			}

			for (let pokemon of this.trainers[0].pokemon){
				savePokemon(pokemon)
			}

			this.result = result
			this.resolve(result)

			if (this.result === "win"){
				this.promise = this.promise.then(() => {
					return this.showEndScreen("You win")
				})
			} else if (this.result === "lose"){
				this.promise = this.promise.then(() => {
					return this.showEndScreen("You lose")
				})
			}
			
			this.promise
			.then(() => {
				this.removeAllStatusEffects()
				this.savePlayerPokemon()
				resolve(result)
				this.resolveRound(result)
			})
		})
		return promise
	}
	checkForWinner(){
		//Resolves with either true if the game is over or false if not
		let over = false
		if (this.hasEnded){
			return Promise.resolve()
		}
		return new Promise(resolve => {
			//This next one handles whether the player should win
			let enemyTrainer = this.trainers[1]
			let enemyActivePokemon = enemyTrainer.activePokemon
			if (enemyActivePokemon.hp <= 0){
				let pokemonCanSwapTo = enemyTrainer.pokemon.filter(p => p.hp > 0)
				if (pokemonCanSwapTo.length > 0){
					//If the enemy has pokemon they can swap to, they pick one and swap to it.
					let pokemon = this.computerChoosePokemon(pokemonCanSwapTo, "swap")
					this.animateSendOutPokemon(1, pokemon)
					.then(() => {
						resolve(over)
					})
				} else {
					//If the enemy has no pokemon they can swap to, you win.
					return this.end("win")
					.then(() => {
						over = true
						resolve(over)
					})
				}
			} else {
				resolve(over)
			}
		})
		//This next one handles whether the player should lose
		.then((alreadyWon) => new Promise(resolve => {
			if (alreadyWon) resolve(over)
			let playerTrainer = this.trainers[0]
			let playerActivePokemon = playerTrainer.activePokemon
			if (playerActivePokemon.hp <= 0){
				let pokemonCanSwapTo = playerTrainer.pokemon.filter(p => p.hp > 0)
				if (pokemonCanSwapTo.length > 0){
					choosePokemon("Choose a Pokemon to swap to.", pokemonCanSwapTo)
					.then(pokemon => this.animateSendOutPokemon(0, pokemon[0]))
					.then(() => resolve(over))
				} else {
					//If you run out of viable pokemon, you lose.
					return this.end("lose")
					.then(() => {
						over = true
						resolve(over)
					})
				}
			} else {
				resolve(over)
			}
		}))
	}

	calculateEXPGained(){
		let enemyTrainer = this.trainers[1]
		let defeatedPokemon = enemyTrainer.pokemon.filter(p => p.hp <= 0)
		let yourPokemon = this.trainers[0].pokemon.filter(p => p.hp > 0)
		let resultMap = {}
		for (let yours of yourPokemon){
			let totalEXP = 0
			let youLevel = yours.level
			for (let p of defeatedPokemon){
				let base = p.data.expYield
				let themLevel = p.level
	
				let exp = (base * themLevel * 0.2) *
				Math.pow((2*themLevel + 10) / (themLevel + youLevel + 10), 2.5)
				totalEXP += exp
			}
			resultMap[yours.uuid] = Math.round(totalEXP)
		}
		return resultMap
	}
	savePlayerPokemon(){
		let saves = []
		for (let i = 0; i < this.trainers[0].pokemon.length; i++){
			let pokemon = this.trainers[0].pokemon[i]
			if (!pokemon) continue
			saves.push(savePokemon(pokemon))
		}
		return Promise.all(saves)
	}

	applyGravity(){
		let now = Date.now()
		//for each column, let's find all the tiles in that column.
		let columns = []
		for (let i = 0; i < this.board.width; i++){
			columns[i] = this.board.getColumn(i)
		}
		let animations = getEmptyAnimationBatch()
		let newLocationMap = []
		animations.info.round = this
		animations.info.newLocationMap = newLocationMap
		animations.callback = () => {
			let round = animations.info.round
			round.applyLocationChanges(animations.info.newLocationMap)
		}
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
		animations.promise = animations.promise.then(() => this.timeStep())

		return animations.promise
	}

	applyLocationChanges(map){
		for (let change of map){
			let tile = change[0]
			let loc = change[1]
			tile.x = loc[0]
			tile.y = loc[1]
		}
	}

	swap(tile1, tile2, options){
		options = options ?? {}
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
		} else if (this.currentlyReversingSwap){
			this.currentlyReversingSwap = false
		} else {
			let turn = this.turn
			this.timeStep()
			.then(() => this.endMove(turn))
		}
	}

	handleEffects(matches){
		let tiles = []
		for (let match of matches){
			match.forEach(t => {
				if (!tiles.includes(t)){
					tiles.push(t)
				}
			})
		}

		let activeTrainer = this.trainers[this.activePlayerIndex]
		let activePokemon = activeTrainer.activePokemon
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
		this.giveEnergy(energy, activeTrainer, activePokemon)

		//Deal with status effects that do something when those tiles are matched
		for (let tile of tiles){
			for (let i = 0; i < tile.statusEffects.length; i++){
				let status = tile.statusEffects[i]
				if (status.name === "Wrap"){
					if (activeTrainer !== status.sourceTrainer){
						this.dealDamage({
							fromTrainer: status.sourceTrainer,
							from: status.sourcePokemon ?? status.sourceTrainer.activePokemon,
							toTrainer: activeTrainer,
							to: activeTrainer.activePokemon,
							move: status.sourceMove
						})
					}
				}
			}
		}

		this.updateStats()
	}
	giveEnergy(energy, trainer, pokemon){
		pokemon = pokemon || trainer.activePokemon

		//Add little floaty bits for the energy they just gained/lost
		for (let type in energy){
			let amt = energy[type]
			if (amt){
				let bar = trainer.tags.energyBars[type][0]
				let cssColor = getCSSEnergyColor(type)
				let plus = amt >= 0 ? "+" : ""
				let text = `${plus}${amt}`
				addFloatingText(text, bar, {
					color: cssColor,
					side: "top",
					direction: "up",
					shadow: "black",
					fontSize: 1.1,
					duration: 1500,
					angleDeviation: 20
				})
			}
		}

		return pokemon.gainEnergy(energy)
	}

	beginMove(){
		this.matchesInCombo.length = 0
		this.currentlyCarryingOutSwap = true
	}

	endMove(turn){
		//This is where all of the end-of-move rewards can be done

		//Next turn
		this.turnEnd(turn)
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

	getOtherPlayer(trainerIndex){
		return trainerIndex === 0 ? 1 : 0
	}
	getNextPlayer(){
		//If the skip flag is set to true, the next turn goes to the other guy.
		if (this.currentlyEndingTurn === true){
			return this.getOtherPlayer(this.activePlayerIndex)
		}

		//If you matched 4 or more, you get an extra turn.
		let getExtraTurn = this.matchesInCombo.some(m => m.length >= 4)
		if (this.matchesInCombo.length > 0 && !getExtraTurn){
			return this.inactivePlayerIndex
		}
		this.createAnnouncement("general", "Extra turn!")
		return this.activePlayerIndex
	}

	timeStep(){
		let matches = this.board.getAllMatches()
		let contents = this.board.contents
		let activeTrainer = this.trainers[this.activePlayerIndex]

		let promise = new Promise(resolve => {
			if (matches.length > 0){
				this.increaseCascade()

				//Find all affected tiles
				let tiles = []
				for (let match of matches){
					for (let tile of match){
						tiles.push(tile)
						//If the tile has Static, explode adjacent tiles as well.
						let hasStatic = tile.statusEffects.find(s => {
							return s.name === "Static" && s.sourceTrainer === activeTrainer
						})
						if (hasStatic){
							let x1 = tile.x
							let y1 = tile.y
							let nearby = contents.filter(tile2 => {
								return distance(x1, y1, tile2.x, tile2.y) === 1
							})
							nearby.forEach(tile2 => tiles.push(tile2))
						}
					}
				}
				//Remove duplicates
				tiles = noDuplicates(tiles)
				//Those matched tiles explode.
				for (let tile of tiles){
					this.board.explodeTile(tile)
				}
				this.handleEffects(matches)
	
				//Add those matches to the current combo
				matches.forEach(m => this.matchesInCombo.push(m))
				this.applyGravity()
				.then(() => resolve())
			} else {
				this.applySpriteHighlights()
				resolve()
				this.updateEverything()
			}
		})

		return promise
	}

	startTicks(){
		clearInterval(this.tickInterval)
		this.tickInterval = setInterval(tick, 1000 / frameRate)
	}
	stopTicks(){
		clearInterval(this.tickInterval)
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
					if (animation.promise){
						animation.resolve()
					}
					this.completeAnimation(animation)
				}
			}
		}
		
		let modalOpen = $("#modal").hasClass("show")
		if (!document.hidden && !modalOpen){
			let board = this.board
			let contents = board.tilesOnScreen()
			for (let tile of contents){
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
			board.tick()
		}
	}

	turnStart(turn){
		if (turn !== this.turn){
			console.warn(`Hmm, I thought we were about to start turn ${this.turn}, but I'm getting a signal that we're starting turn ${turn}`)
			console.trace()
			return
		}
		if (this.turnsWhichHaveStarted[turn]){
			console.warn("Already started turn #",turn)
			console.trace()
			return
		}
		this.turnsWhichHaveStarted[turn] = true
		this.currentlyEndingTurn = false
		this.currentlyCarryingOutSwap = false
		this.matchesInCombo.length = 0
		this.resetCurrentlySelecting()
		this.resetCascade()
		
		let trainer = this.trainers[this.activePlayerIndex]
		let otherTrainer = this.trainers[this.inactivePlayerIndex]

		//Reduce move cooldowns
		for (let pokemon of trainer.pokemon){
			if (!pokemon) continue
			for (let moveUsage of pokemon.moveUsage){
				if (moveUsage.recharge > 0){
					moveUsage.recharge -= 1
				}
			}
		}

		//Handle start-of-turn effects
		//Such as burned-ness
		let activePokemon = trainer.activePokemon
		let otherPokemon = otherTrainer.activePokemon
		let statusEffects = activePokemon.statusEffects
		for (let status of statusEffects){
			if (status.type !== "status") continue
			let statusName = status.name
			if (statusName === "burn"){
				activePokemon.hp -= Math.ceil(activePokemon.maxhp / 16)
			}
			if (statusName === "poisoned"){
				activePokemon.hp -= Math.ceil(activePokemon.maxhp / 16)
			}
		}
		let contents = this.board.tilesOnScreen()
		for (let tile of contents){
			if (!this.board.isOnScreen(tile)) continue
			let statusEffects = tile.statusEffects
			for (let status of statusEffects){
				let isEnemy = status.sourceTrainer !== trainer
				let statusName = status.name
				if (isEnemy && statusName === "Burn"){
					let damage = activePokemon.maxhp / 32
					this.dealDamage({
						from: status.sourcePokemon,
						fromTrainer: status.sourceTrainer,
						move: status.sourceMove,
						to: activePokemon,
						toTrainer: trainer,
						damage: damage
					})
				} else if (isEnemy && statusName === "Infested"){
					//Infested tiles eat some of your energy and give them to the opponent
					let yourEnergy = activePokemon.energy
					let usableTypes = Object.keys(yourEnergy).filter(key => yourEnergy[key])
					let type = randomChoice(usableTypes)
					let energyToTake = getEmptyEnergy()
					energyToTake[type] = -1
					let changes = this.giveEnergy(energyToTake, trainer, activePokemon)
					let energyToGive = getEmptyEnergy()
					for (let type in changes){
						energyToGive[type] = changes[type] * -1
					}
					this.giveEnergy(energyToGive, otherTrainer, otherPokemon)
				}
			}
		}

		//Reduce status effect durations
		let toRemove = []
		for (let status of statusEffects){
			if (status.turns){
				status.turns--
				if (status.turns <= 0){
					toRemove.push(status)
				}
			}
		}
		for (let status of toRemove){
			statusEffects.splice(statusEffects.indexOf(status), 1)
		}
		//Reduce status effect durations but for tiles this time
		contents = this.board.tilesOnScreen()
		for (let tile of contents){
			if (!this.board.isOnScreen(tile)) continue
			toRemove = []
			let statusEffects = tile.statusEffects
			for (let status of statusEffects){
				let trainer = status.sourceTrainer
				let index = this.trainers.indexOf(trainer)
				let isTurn = this.activePlayerIndex === index
				if (status.duration && isTurn){
					status.turns--
					if (status.turns <= 0){
						toRemove.push(status)
					}
				}
			}
			for (let status of toRemove){
				statusEffects.splice(statusEffects.indexOf(status), 1)
			}
		}

		let promise = this.checkForWinner()
		if (this.activePlayer === "enemy"){
			promise = promise.then(() => this.computerMakeMoves())
		}

		promise = promise.then(() => this.updateEverything())
		return promise
	}
	turnEnd(turn){
		if (turn !== this.turn){
			//This code catches bugs and stops them from spreading
			//But it really shouldn't ever run if I can help it.
			console.warn("Hmm, I thought it was turn", turn, "But it's turn", this.turn, "now?")
			console.trace()
			return
		}
		let nextPlayer = this.getNextPlayer()
		if (nextPlayer !== this.activePlayerIndex){
			this.prepareToChangeTurns(nextPlayer)
		}

		this.currentlyReversingSwap = false
		this.updateStats()
		this.turn++
		let newTurn = this.turn
		
		if (this.hasBegun){
			if (this.activePlayer === "player"){
				delay(300).then(() => this.turnStart(newTurn))
			} else {
				this.waitUntilNoAnnouncements(() => {
					delay(300).then(() => this.turnStart(newTurn))
				})
			}
		}
	}

	showEndScreen(message){
		let modal = $("#modal")
		clearModal(modal)
		modal.addClass("wide")
		modal.find(".modal-title").html(`<h6 class='display-6'>${message}</h6>`)
		let btn = $(`<button class='btn btn-primary'>Continue</button>`)
		modal.find(".modal-footer").append(btn)

		let toGive = this.calculateEXPGained()
		let playing = false
		const pretendToGiveEXP = (chooseable, pokemon, fromLevel) => {
			let barContainer = chooseable.children(".exp-bar")
			let gained = toGive[pokemon.uuid] || 0
			let originalLevel = pokemon.level
			let newLevel = pokemon.getLevelFromEXP(pokemon.exp + gained)
			let expPastNewLevel = pokemon.exp + gained - pokemon.getEXPNeededForLevel(newLevel)
			let expForNextLevel = pokemon.getEXPNeededForLevel(newLevel + 1)
			let bar = barContainer.children(".bar")
			let floor = pokemon.getEXPNeededForLevel(pokemon.level)
			let needed = pokemon.getEXPNeededForLevel(pokemon.level + 1)
			let originalPercent = (pokemon.exp - floor) / (needed - floor)
			let newPercent = (pokemon.exp + gained - floor) / (needed - floor)
			if (newPercent > 1) newPercent = 1
			let originalWidth = (originalPercent) * 100 + "%"
			let newWidth = (newPercent) * 100 + "%"
			bar.css({
				width: originalWidth
			}).animate({
				width: newWidth
			}, {
				duration: 1500 * (newPercent - originalPercent),
				complete: function(){
					if (newLevel > originalLevel && !playing){
						playSound("level-up")
						playing = true
					}
				}
			})

			let pText = chooseable.find(".pokemon-text")
			pText.append(`<p>${pokemon.name}</p>`)
			let levelText = `Level ${pokemon.level}`
			if (newLevel !== pokemon.level){
				levelText += ` <i class='bi bi-arrow-right'> ${newLevel}`
			}
			pText.append(`<p>${levelText}</p>`)
			let expText = `${expPastNewLevel} / ${expForNextLevel - floor} EXP`
			pText.append(`<p>${expText}</p>`)
		}

		let pokemon = this.trainers[0].pokemon
		let body = modal.find(".modal-body")
		let container = $(`<div class='d-flex flex-wrap justify-content-between container'></div>`)
		for (let i = 0; i < pokemon.length; i++){
			let p = pokemon[i]
			let box = $(`<div class='col col-6'></div>`)
			let chooseable = $(`<div class='chooseable m-1'></div>`)
			let image = p.data.imageSources.large
			chooseable.html(`
				<div class='row mb-3'>
					<div class='pokemon-text col d-flex flex-column justify-content-center'></div>
					<div class='col text-end'>
						<img class='pokemon-image' src='${image}'>
					</div>
				</div>
				<div class='exp-bar'>
					<div class='bar'></div>
				</div>
			`)
			pretendToGiveEXP(chooseable, p, p.level)
			box.append(chooseable)
			container.append(box)
		}
		body.append(container)

		//The actual "give exp" code
		let updatedPokemon = []
		let learnedMoves = []
		for (let i = 0; i < pokemon.length; i++){
			let p = pokemon[i]
			let gained = toGive[p.uuid] || 0
			if (gained){
				p.exp += gained
				let newLevel = p.recalculateLevel()
				if (newLevel > p.level){
					updatedPokemon.push(p)
					let changes = p.changeLevel(newLevel)
					for (let moveIndex of changes.unlocked){
						let learn = p.learnset[moveIndex]
						let move = pokemonMoveData[learn.name]
						let obj = {
							pokemon: p,
							move: move
						}
						learnedMoves.push(obj)
					}
				}
			}
			savePokemon(p)
		}
		let announcementBox = $("<div class='d-flex text-center flex-column align-items-stretch'></div>")
		body.append(announcementBox)
		for (let announcement of learnedMoves){
			let name = announcement.pokemon.name
			let move = announcement.move
			let moveName = getLocaleString("name", lang, ["moves", move.name])
			let text = `${name} learned ${moveName}!`
			createAnnouncement("general", text)
			console.log(move)
			let anTag = $("<div></div>")
			anTag.text(text)
			announcementBox.append(anTag)
		}
		let promise = new Promise(resolve => {
			modal.modal("show")
			btn.click(() => {
				modal.modal("hide")
			})
			modal.on("hidden.bs.modal", () => {
				resolve()
			})
		})

		//Check if any pokemon should evolve
		let canEvolve = updatedPokemon.filter(p => p.data.evolutions.length)
		for (let p of canEvolve){
			let evolutions = p.data.evolutions
			let possibilities = evolutions.filter(evo => {
				return checkIfPokemonMeetsRequirements(p, evo.unlock)
			})
			//TODO if there are multiple options, the player should get to choose
			if (!possibilities.length) continue
			let evolution = randomChoice(possibilities)
			let evolveTo = pokemonData[evolution.name]
			let announcementBox = $("<div class='d-flex text-center flex-column align-items-stretch'></div>")
			promise = promise.then(() => new Promise(resolve => {
				clearModal(modal)
				modal.addClass("wide")
				let message = `${p.name} is evolving!`
				modal.find(".modal-title").html(`<h6 class='display-6'>${message}</h6>`)
				let btn = $(`<button class='btn btn-primary'>Continue</button>`)
				modal.find(".modal-footer").append(btn)

				let animation = doEvolutionAnimation(body, p, evolution)
				animation.promise.then(() => {
					if (animation.skipped) return
					let message = `${p.name} evolved into ${evolveTo.name}!`
					modal.find(".modal-title").html(`<h6 class='display-6'>${message}</h6>`)

					let changes = p.evolve(evolveTo)
					for (let moveIndex of changes.unlocked){
						let learn = p.learnset[moveIndex]
						let move = pokemonMoveData[learn.name]
						let moveName = getLocaleString("name", lang, ["moves", move.name])
						let text = `${p.name} learned ${moveName}!`
						createAnnouncement("general", text)
						let anTag = $("<div></div>")
						anTag.text(text)
						announcementBox.append(anTag)
					}
				})

				body.append(announcementBox)
				modal.modal("show")
				btn.click(() => {
					modal.modal("hide")
				})
				modal.on("hidden.bs.modal", () => {
					resolve()
					animation.skip()
				})
			}))
		}
		
		return promise
	}

	computerMakeMoves(){
		let promise = Promise.resolve()
		let trainerIndex = this.activePlayerIndex
		let availableMoves = this.getAvailableMoves(trainerIndex)
		let payableMoves = availableMoves.filter(move => {
			let payability = this.canPayCost(move, trainerIndex)
			return Object.keys(payability).every(key => payability[key] === true)
		})
		let goodMoves = this.computerApplicableMoves(payableMoves)
		if (goodMoves.length){
			let randomMove = randomChoice(goodMoves)
			let trainer = this.trainers[trainerIndex]
			let pokemon = trainer.activePokemon
			this.payForMove(trainer, pokemon, randomMove)
			promise = promise.then(() => {
				return this.beginToUseMove(trainer, pokemon, randomMove)
			})
		}

		let turn = this.turn
		promise = promise.then(() => {
			if (this.hasEnded) return Promise.resolve()
			return delay(250).then(() => {
				if (this.turn === turn){
					this.computerMakeSwap()
				}
			})
		})
		return promise
	}
	computerApplicableMoves(moveList){
		//Returns a list of those same moves filtered to the ones
		//that would do something right now
		let good = []
		//TODO it would be really nice if we could score these and sort the results
		//by how good they are right now
		for (let move of moveList){
			//TODO watch out for stuff like healing moves, or
			//moves that only work if the board meets certain conditions
			good.push(move)
		}

		return good
	}
	computerMakeSelection(){
		let selectType = this.currentlySelecting.type
		let promise = Promise.resolve()
		if (selectType === "tiles"){
			let selected = this.selectedTiles
			let count = this.currentlySelecting.count
			let waitTime = 500
			for (let i = selected.length; i < count; i++){
				promise = promise.then(() => delay(waitTime))
				.then(() => {
					//TODO make the computer's choices smart again!
					//for now they just random
					let pickable = this.board.tilesOnScreen()
					let randomTile = randomChoice(pickable)
					this.selectTile(randomTile, this.activePlayerIndex)
				})
			}
			promise = promise.then(() => delay(waitTime))
			.then(() => {
				this.submitSelection()
			})
		}
	}
	computerMakeSwap(){
		let allSwaps = this.board.getAllPotentialMoves()
		let trainer = this.trainers[this.activePlayerIndex]
		let pokemon = trainer.activePokemon

		//Remove all swaps that intend to swap a tile with Locked
		allSwaps = allSwaps.filter(swap => {
			let tile1locked = swap[0].hasStatus("Locked")
			let tile2locked = swap[1].hasStatus("Locked")
			return !(tile1locked || tile2locked)
		})

		if (!allSwaps.length){
			//There are no potential moves, just use Struggle instead
			let struggle = pokemon.moves.find(m => m.name === "Struggle")
			this.beginToUseMove(trainer, pokemon, struggle)
			return
		}

		//Array of objects containing info about how much the trainer
		//would like to use each move
		let moves = pokemon.activeMoves
		let moveScores = moves.map((move, i) => {
			let data = {}
			data.move = move
			data.payability = this.canPayForMove(trainer, pokemon, move)
			//For now, the pokemon just prefers moves that are unlocked later.
			data.score = pokemon.moves.indexOf(move)
			return data
		})

		let swapScores = allSwaps.map(swap => {
			let data = {}
			data.swap = swap
			let tiles = noDuplicates(swap[2].flat())
			let energyValues = tiles.map(tile => tile.getEnergyValue())
			let total = getEmptyEnergy()
			for (let energyValue of energyValues){
				for (let color in energyValue){
					total[color] += energyValue[color]
				}
			}
			data.total = total
			let score = 1
			//Big boost to scores for swaps that result in a 4+ match
			let fourMatch = swap[2].some(match => match.length >= 4)
			let fourMatchBonus = allSwaps.length * 0.5
			score *= fourMatch ? fourMatchBonus : 1

			//Does this match give you energy necessary for a move?
			let paysFor = []
			moveScores.forEach(moveScore => {
				let move = moveScore.move
				let canPay = moveScore.payability.result
				let energyNeeded = canPay ? move.energy : moveScore.payability.needed
				let energyProvided = total
				let totalEnergyNeeded = Object.keys(energyNeeded)
				.reduce((acc, key) => {
					return acc + energyNeeded[key]
				}, 0)
				//If it's 0 just skip this one
				if (totalEnergyNeeded === 0){
					return
				}

				let totalEnergyProvided = Object.keys(energyProvided)
				.reduce((acc, key) => {
					let needed = energyNeeded[key] || 0
					let provided = energyProvided[key] || 0
					return acc + Math.min(needed, provided)
				}, 0)
				let bonus = canPay ? 1 : 5
				let data = {}
				data.move = move
				data.canPay = canPay
				data.percentage = totalEnergyProvided / totalEnergyNeeded
				data.score = data.percentage * bonus + 0.2
				paysFor.push(data)
			})
			data.paysFor = paysFor
			let paysForScoreBonus = paysFor.reduce((acc, pay) => {
				return acc + pay.score
			}, 0)
			score *= paysForScoreBonus

			data.score = score
			return data
		})

		// console.log(moveScores)
		// console.log(swapScores)
		// console.log(swapScores.map(swap => swap.swap),swapScores.map(swap => swap.score) )
		let bestSwap = weightedRandom(
			swapScores.map(swap => swap.swap),
			swapScores.map(swap => swap.score)
		).item
		//TODO score swaps somehow. Right now it just picks a random one.
		// let bestSwap = randomChoice(allSwaps)
		this.animateSwitchLocations(bestSwap[0], bestSwap[1])
	}
	computerChoosePokemon(pokemon, reason){
		//TODO have the logic here be based on which reason they could be choosing stuff
		return pokemon[Math.floor(Math.random() * pokemon.length)]
	}

	dealDamage(options){
		let result = {}
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
			let trainerIndex = this.trainers.indexOf(attackerTrainer)
			let possibleMoves = this.getAvailableMoves(trainerIndex)
			move = possibleMoves[0]
			console.warn("Where did this damage come from??")
			console.trace()
		}

		let power = options.power ?? move.power
		if (options.additionalPower !== undefined){
			power += options.additionalPower
		}
		
		let category = options.category ?? move.category ?? "Physical"
		let type = options.type ?? move.type ?? "Typeless"

		let defenderTrainer = options.toTrainer
		if (!defenderTrainer){
			let possible = this.trainers.filter(trainer => trainer !== attackerTrainer)
			defenderTrainer = randomChoice(possible)
		}
		let defender = options.to
		if (!defender){
			defender = defenderTrainer.activePokemon
		}

		let atk, def
		if (category === "Physical"){
			atk = attacker.getEffectiveStat("attack")
			def = defender.getEffectiveStat("defense")
		} else if (category === "Special") {
			atk = attacker.getEffectiveStat("specialAttack")
			def = defender.getEffectiveStat("specialDefense")
		} else {
			console.warn("UNKNOWN CATEGORY", category)
		}

		let damage = options.damage
		if (damage === undefined){
			damage = (attacker.level * 2 / 5 + 2) * power * atk / def / 50 + 2
		}
		if (attacker.data.types.includes(type)){
			damage *= 1.5
		}
		let typeMult = 1
		for (let defType of defender.data.types){
			typeMult *= typeEffectiveness[type][defType]
		}
		damage *= typeMult
		damage = Math.round(damage)

		//If the receiving Pokemon has Invulnerable, set damage dealt to 0.
		let statusEffects = defender.statusEffects
		let isInvulnerable = statusEffects.some(s => s.name === "invulnerable")
		if (isInvulnerable && attacker !== defender){
			damage = 0
			result.damageDealt = 0
		}
		
		if (damage){
			defender.hp -= damage
			result.damageDealt = damage
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

		return result
	}

	canUseMovesRightNow(trainerIndex){
		return trainerIndex === this.activePlayerIndex
		&& !this.currentlyCarryingOutSwap
		&& this.hasBegun
	}
	getAvailableMoves(trainerIndex){
		let moves = []

		if (this.canUseStruggle(trainerIndex)){
			moves.push(pokemonMoveData["Struggle"])
		}

		this.trainers[trainerIndex].activePokemon.activeMoves.forEach(m => {
			moves.push(m)
		})
		return moves
	}
	canUseStruggle(trainerIndex){
		let allSwaps = this.board.getAllPotentialMoves()
		return allSwaps.length === 0
	}

	attemptToUseMove(event){
		if (this.currentlyCarryingOutSwap) {
			this.createAnnouncement("general", "Currently busy swapping tiles.")
			return
		}
		if (this.currentlySwappingPokemon) {
			this.createAnnouncement("general", "Currently busy switching out a new Pokemon.")
			return
		}
		let moveTag = $(event.currentTarget)
		let trainerIndex = parseInt(moveTag.attr("data-trainer"))
		let pokemonIndex = parseInt(moveTag.attr("data-pokemon"))
		let moveIndex = parseInt(moveTag.attr("data-move"))
		if (!this.canUseMovesRightNow(trainerIndex)) {
			this.createAnnouncement("general", "You can't use that move right now.")
			return
		}
		let trainer = this.trainers[trainerIndex]
		let pokemon = trainer.pokemon[pokemonIndex]
		let move = pokemon.moves[moveIndex]
		let payability = this.canPayCost(move, trainerIndex)
		let canPay = Object.keys(payability).every(k => payability[k] === true)
		if (!canPay) {
			this.createAnnouncement("general", "You can't pay that move's cost.")
			return
		}
		this.payForMove(trainer, pokemon, move)
		this.beginToUseMove(trainer, pokemon, move)
	}
	//Returns an object that contains true/false values for whether the trainer
	//has enough of each color of energy
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
	//Returns an object that contains info about how much more of each color that
	//the trainer must collect to use this move
	canPayForMove(trainer, pokemon, move){
		let able = true
		let needed = getEmptyEnergy()
		for (let color of colors){
			if (move.energy[color] > pokemon.energy[color]){
				able = false
				needed[color] += move.energy[color] - pokemon.energy[color]
			}
		}
		return {result: able, needed: needed}
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
			info: [],
			effectIndex: 0
		}
		let promise = new Promise(resolve => moveUseObj.resolve = resolve)
		.then(() => this.finishCurrentMove())
		moveUseObj.promise = promise

		this.moveQueue.push(moveUseObj)
		this.updateEverything()
		this.advanceCurrentMove()
		return promise
	}
	advanceCurrentMove(){
		this.resetCurrentlySelecting()
		let moveUseObj = this.moveQueue[0]
		let effectIndex = moveUseObj.effectIndex
		moveUseObj.nextEffectIndex = effectIndex + 1
		let effects = moveUseObj.move.effects

		// console.log("Running effect", effectIndex)

		if (effectIndex >= effects.length){
			moveUseObj.resolve()
			return
		}

		let effect = effects[effectIndex]
		let effectType = effect.type
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)
		promise.then(() => {
			moveUseObj.effectIndex = moveUseObj.nextEffectIndex
			return this.advanceCurrentMove()
		})
		.then(() => delay(250))
		.then(() => this.timeStep())
		.then(() => this.updateEverything())
		let params = getEffectParams(effect, effectIndex, moveUseObj)

		let targetTrainers = {
			"choose-tiles": true,
			"gain-energy": true
		}
		let targetDefaults = {
			"choose-tiles": "user",
			"damage": "opponent",
			"heal": "user",
			"get-stat": "user",
			"apply-status-effect": "opponent",
			"select-energy-colors": "none",
			"gain-energy": "user"
		}
		let target
		if (effect.type in targetDefaults){
			let targetName = effect.target ?? targetDefaults[effect.type]
			if (targetName === "opponent"){
				let otherTrainer = this.trainers[this.inactivePlayerIndex]
				if (targetTrainers[effect.type]){
					target = otherTrainer
				} else {
					target = otherTrainer.activePokemon
				}
			} else if (targetName === "user"){
				let trainer = this.trainers[this.activePlayerIndex]
				if (targetTrainers[effect.type]){
					target = trainer
				} else {
					target = trainer.activePokemon
				}
			} else if (targetName) {
				console.warn("You never handled", targetName)
			}
		}
		
		switch (effectType){
			case "play-sound": {
				let name = effect.name
				playSound(`${moveUseObj.move.name}-${name}`)
				resolvePromise()
			} break
			case "swap-tiles": {
				let selection = params.selection
				if (selection.length < 2) {
					resolvePromise()
					break
				}
				let tile1 = selection[0]
				let tile2 = selection[1]
				let map = [
					[tile1, [tile2.x, tile2.y]],
					[tile2, [tile1.x, tile1.y]],
				]
				let options = {
					callback: () => {
						this.applyLocationChanges(map)
						resolvePromise()
					}
				}
				this.animateSwitchLocations(tile1, tile2, options)
			} break
			case "choose-tiles": {
				let count = effect.count ?? 1
				this.currentlySelecting = {
					player: target,
					type: "tiles",
					count: count
				}
				this.currentlySelecting.callback = () => {
					moveUseObj.info[effectIndex] = this.selectedTiles.map(t=>t)
				}
				this.currentlySelecting.resolve = resolvePromise
				this.currentlySelecting.promise = promise
				
				if (target === this.trainers[1]){
					this.waitUntilNoAnnouncements(() => {
						this.computerMakeSelection()
					})
				} else {
					this.createAnnouncement("general", `Select ${count} tiles`)
				}
			} break
			case "shuffle": {
				this.shuffleBoard()
				.then(() => {
					resolvePromise()
				})
			} break
			case "end-turn": {
				this.currentlyEndingTurn = true
				this.endMove(this.turn)
				resolvePromise()
			} break
			case "damage": {
				let options = {
					from: moveUseObj.pokemon,
					fromTrainer: moveUseObj.trainer,
					move: moveUseObj.move
				}
				if (effect.additivePower !== undefined){
					let additivePower = params.additivePower ?? 0
					options.additionalPower = options.additionalPower ?? 0
					options.additionalPower += additivePower
				}
				let result = this.dealDamage(options)
				moveUseObj.info[effectIndex] = result.damageDealt
				resolvePromise()
			} break
			case "heal": {
				let amount = params.amount ?? 0
				let min = params.min ?? 0
				if (amount < min){
					amount = min
				}
				//Clamp it so it doesn't go above max hp
				amount = Math.min(target.maxhp - target.hp, amount)
				target.hp += amount
				let animOptions = {
					color: "#00ff00",
					direction: randomAngle(225, 315),
					duration: 2000,
					distance: 30,
					side: "right"
				}
				let trainer = this.trainers.find(t => t.activePokemon === target)
				let healthBar = trainer.tags.healthBar
				addFloatingText("+" + amount, healthBar, animOptions)
				this.updateHealth(this.trainers.indexOf(trainer), true)
				
				resolvePromise()
			} break
			case "recoil-percent": {
				let damage = moveUseObj.pokemon.hp * effect.percent
				this.dealDamage({
					from: moveUseObj.pokemon,
					fromTrainer: moveUseObj.trainer,
					move: moveUseObj.move,
					to: moveUseObj.pokemon,
					toTrainer: moveUseObj.trainer,
					damage: damage
				})
				resolvePromise()
			} break
			case "apply-debuff": {
				let debuff = effect.debuff
				let otherTrainer = this.trainers[this.inactivePlayerIndex]
				let otherPokemon = otherTrainer.activePokemon
				otherPokemon.statusEffects.push(debuff)
				resolvePromise()
			} break
			case "get-stat": {
				let statName = effect.which ?? "attack"
				moveUseObj.info[effectIndex] = target.getStat(statName)
				resolvePromise()
			} break
			case "apply-status-effect": {
				let statusEffect = effect.statusEffect
				target.addStatusEffect(statusEffect, moveUseObj.trainer, moveUseObj.pokemon, moveUseObj.move)
				resolvePromise()
			} break
			case "select-energy-colors": {
				let search = effect.search ?? "random"
				let count = params.count ?? 1
				let result = []

				if (count >= colors.length){
					colors.forEach(c => result.push(c))
				} else if (search === "random") {
					let options = colors.map(c => c)
					for (let i = 0; i < count; i++){
						let index = Math.floor(Math.random() * options.length)
						result.push(options[index])
						options.splice(index, 1)
					}
				} else if (search === "most-full"){
					let energy = target.energy
					let options = Object.keys(energy)
					shuffleArray(options)
					options.sort((a, b) => {
						return energy[a] < energy[b] ? 1 : energy[a] > energy[b] ? -1 : 0
					})
					options.slice(0, count).forEach(c => result.push(c))
				} else {
					console.warn("You never handled", search)
				}
				
				moveUseObj.info[effectIndex] = result
				resolvePromise()
			} break
			case "gain-energy": {
				let energyColors = params.colors ?? []
				let count = params.count ?? 1
				let amounts = params.amounts ?? null
				let result = {}

				if (amounts === null){
					amounts = {}
					for (let color of colors){
						amounts[color] = 0
						if (energyColors.includes(color)){
							amounts[color] = count
						}
					}
				}
				
				result = this.giveEnergy(amounts, target, target.activePokemon)
				
				moveUseObj.info[effectIndex] = result
				resolvePromise()
			} break
			case "select-random-tiles": {
				let count = params.count ?? 0
				let conditions = effect?.conditions ?? {}
				let chosenTiles = []
				let chooseable = this.board.tilesOnScreen()
				.filter(t => {
					if (conditions.notTypes){
						let notTypes = conditions.notTypes
						if (notTypes.includes(t.type)){
							return false
						}
					}
					return true
				})
				for (let i = 0; i < count; i++){
					let canChoose = chooseable
					.filter(t => !chosenTiles.includes(t))
					if (canChoose.length === 0) break
					chosenTiles.push(randomChoice(canChoose))
				}
				moveUseObj.info[effectIndex] = chosenTiles
				resolvePromise()
			} break
			case "apply-status-to-tiles": {
				let selection = effect.selection
				let status = effect.status
				let chosenTiles = []
				if (selection === "group"){
					let which = params.which
					which.forEach(t => chosenTiles.push(t))
				} else {
					console.warn("You never handled", selection)
				}
				chosenTiles.forEach(t => {
					let color = moveUseObj.trainer === this.trainers[0] ? "friendly" : "enemy"
					t.addStatusEffect(status, moveUseObj.trainer, moveUseObj.pokemon, moveUseObj.move, color)
				})
				resolvePromise()
			} break
			case "change-tile-type": {
				let selection = effect.selection
				let chosenTiles = []
				if (selection === "group"){
					let which = params.which
					which.forEach(t => chosenTiles.push(t))
				} else {
					console.warn("You never handled", selection)
				}
				chosenTiles.forEach(t => {
					//TODO I wish this had an animation
					t.type = effect.targetType
				})
				moveUseObj.info[effectIndex] = chosenTiles
				resolvePromise()
			} break
			case "count-tiles": {
				let result = this.board.countTiles(effect.options)
				moveUseObj.info[effectIndex] = result
				resolvePromise()
			} break
			case "multiply-energy": {
				let amounts = params.amounts ?? {}
				let scale = params.scale ?? 1
				let result = {}
				for (let color in amounts){
					result[color] = amounts[color] * scale
				}
				moveUseObj.info[effectIndex] = result
				resolvePromise()
			} break
			case "load-number": {
				let val = effect.value ?? 0
				if (effect.index !== undefined){
					val = moveUseObj.info[effect.index]
				}
				moveUseObj.info[effectIndex] = val
				resolvePromise()
			} break
			case "multiply-numbers": {
				let val1 = moveUseObj.info[effectIndex - 2]
				let val2 = moveUseObj.info[effectIndex - 1]
				let val = val1 * val2
				moveUseObj.info[effectIndex] = val
				resolvePromise()
			} break
			case "random-number": {
				let min = effect.min ?? 0
				let max = effect.max ?? 10
				let val = Math.floor(Math.random() * (max - min + 1)) + min
				moveUseObj.info[effectIndex] = val
				resolvePromise()
			} break
			case "jump-if-less-than": {
				let test = moveUseObj.info[effectIndex - 2]
				let against = moveUseObj.info[effectIndex - 1]
				if (test < against){
					moveUseObj.nextEffectIndex = effect.jumpTo
				}
				resolvePromise()
			} break
			case "jump": {
				moveUseObj.nextEffectIndex = effect.jumpTo
				resolvePromise()
			} break
			default:
				console.warn("You never handled", effectType)
		}
		return promise
	}
	finishCurrentMove(){
		let promise = new Promise(resolve => {
			this.moveQueue.splice(0, 1)

			if (this.moveQueue.length){
				this.advanceCurrentMove()
				.then(resolve)
			} else {
				this.performMoveQueueCallbacks()
				resolve()
			}
			this.resetCascade()
		})
		//Post-end-of-move effects like Confused
		.then(() => {
			let trainer = this.trainers[this.activePlayerIndex]
			let pokemon = trainer.activePokemon
			let promises = []
			let endedTurn = false

			if (pokemon && pokemon.statusEffects.length){
				let statusEffects = pokemon.statusEffects
				for (let status of statusEffects){
					if (status.name === "confused"){
						//50% chance that the turn ends.
						if (Math.random() < 0.5 && !endedTurn){
							endedTurn = true
							let p = this.createAnnouncement("general", "Turn ended due to confusion!", 1500)
							promises.push(p)
							// this.turnEnd(this.turn)
						}
					}
				}
			}

			let promise = Promise.all(promises)

			if (endedTurn){
				let turn = this.turn
				this.currentlyEndingTurn = true
				// this.turnEnd(this.turn)
				promise = promise.then(() => {
					this.turnEnd(turn)
				})
			}

			return promise
		})
		.then(() => this.checkForWinner())

		return promise
	}
	waitUntilNoMoveQueue(callback){
		this.moveQueueCallbackQueue.push(callback)
		if (this.moveQueue.length === 0){
			this.performMoveQueueCallbacks()
		}
	}
	performMoveQueueCallbacks(){
		let callbackQueue = this.moveQueueCallbackQueue
		while (callbackQueue.length && !this.moveQueue.length){
			callbackQueue[0]()
			callbackQueue.splice(0, 1)
		}
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
		//TODO really need some way of encoding whether the player gets input
		//on the current thing
		if (!this.currentlySelecting) return
		let selectType = this.currentlySelecting.type
		let playerTurn = this.currentlySelecting.player === this.trainers[0]
		let valid = this.selectionIsValid()
		if (selectType === "tiles" && playerTurn && valid){
			this.confirmButton.show()
		} else {
			this.confirmButton.hide()
		}
	}

	canSelectTile(tile, trainerIndex){
		// If currently selecting tiles, the player can override
		// when they are allowed to make choices.
		if (this.currentlySelecting.player === this.trainers[0]){
			return true
		}
		return this.activePlayerIndex === trainerIndex
		&& this.state === "waiting"
		&& this.hasBegun
		&& !this.currentlySwappingPokemon
		// && this.moveQueue.length === 0
		// && this.showingAnnouncements.length === 0
	}
	selectTile(tile, trainerIndex){
		if (!this.canSelectTile(tile, trainerIndex)) return
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
		if (this.currentlySelecting.callback){
			this.currentlySelecting.callback()
		}
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

	resetCascade(){
		this.currentCascade = 0
	}
	increaseCascade(){
		this.currentCascade++
		let cascade = Math.min(6, this.currentCascade)
		playSound(`cascade${cascade}`)
	}
	
	animateSwitchLocations(tile1, tile2, options){
		options = options ?? {}
		let now = Date.now()
		let duration = 300

		let animation1 = animTemplates["displace"](tile1, tile2.x, tile2.y, now, duration)
		let animation2 = animTemplates["displace"](tile2, tile1.x, tile1.y, now, duration)
		let animation = getEmptyAnimationBatch()
		animation.batch.push(animation1)
		animation.batch.push(animation2)
		if (options.callback === undefined){
			animation.callback = () => {
				this.swap(tile1, tile2, options)
			}
		} else {
			animation.callback = options.callback
		}
		
		this.addAnimation(animation)
		return animation
	}
	shuffleBoard(){
		let now = Date.now()
		let duration = 500
		let eachTileTime = 100
		let promises = []
		let newLocationMap = this.board.getShuffleLocationMap()
		newLocationMap.forEach((spot, tile) => {
			let animation = getEmptyAnimationBatch()
			animation.info.round = this
			promises.push(animation.promise)

			let delay = animation.batch.length * 50
			let a = animTemplates["displace"](tile, spot[0], spot[1], now, duration)
			animation.batch.push(a)

			animation.callback = () => {
				tile.x = spot[0]
				tile.y = spot[1]
			}
			this.addAnimation(animation)
		})
		let promise = Promise.all(promises)
		.then(() => this.timeStep())

		return promise
	}

	applySpriteHighlights(){
		for (let tile of this.board.tilesOnScreen()){
			tile.spriteHighlightTarget = 0
		}
		let allMoves = this.board.getAllPotentialMoves()
		for (let move of allMoves){
			let tile1 = move[0]
			let tile2 = move[1]
			tile1.spriteHighlightTarget = 1
			tile2.spriteHighlightTarget = 1
		}
	}

	createAnnouncement(type, text, duration=1500){
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)
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
			resolvePromise()
		})
		return promise
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
		for (let tile of board.tilesOnScreen()){
			let d = distance(mouse.x, mouse.y, tile.spriteCenterX, tile.spriteCenterY)
			let closeness = d/(board.spriteTileW * 0.5)
			if (closeness < 1){
				return tile
			}
		}
	}

	handleMouseMove(){
		if ($("#modal").hasClass("show")) return
		let chosenTile = this.getChosenTile()
		if (chosenTile){
			this.moveToTopLayer(chosenTile)
		}
		if (!this.currentlySelecting) return
		if (this.currentlySelecting.type === "swap"){
			if (this.selectedTile && this.tileSelectionType === "hold"){
				if (!chosenTile) return
				let canSwap = this.board.couldSwap(this.selectedTile, chosenTile)
				if (chosenTile !== this.selectedTile && canSwap){
					this.animateSwitchLocations(chosenTile, this.selectedTile)
					this.deselectTile(this.selectedTile)
				}
			}
		}
	}

	handleMouseDown(){
		if ($("#modal").hasClass("show")) return
		let chosenTile = this.getChosenTile()
		if (!chosenTile) return
		if (!this.currentlySelecting) return
		let selectType = this.currentlySelecting.type

		if (selectType === "swap"){
			if (this.selectedTile){
				let canSwap = this.board.couldSwap(this.selectedTile, chosenTile)
				if (chosenTile === this.selectedTile){
					this.deselectTile(this.selectedTile)
				} else if (canSwap) {
					this.animateSwitchLocations(chosenTile, this.selectedTile)
					this.deselectTile(this.selectedTile)
				} else {
					this.deselectTile(this.selectedTile)
					this.selectTile(chosenTile, 0)
				}
			} else {
				this.selectTile(chosenTile, 0)
			}
		} else if (selectType === "tiles"){
			let alreadySelected = this.selectedTiles.includes(chosenTile)
			if (alreadySelected){
				this.deselectTile(chosenTile)
			} else {
				if (this.selectedTiles.length < this.currentlySelecting.count){
					this.selectTile(chosenTile, 0)
				} else {
					let firstTile = this.selectedTiles[0]
					this.deselectTile(firstTile)
					this.selectTile(chosenTile, 0)
				}
			}
		}
	}

	handleMouseUp(){
		if ($("#modal").hasClass("show")) return
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
		let max = activePokemon.getStat("hp")
		let p = hp / max
		let percent = p * 100 + "%"
		tags.healthBar.attr("data-width", percent)
		if (!animate){
			tags.healthCurrent.text(hp)
			tags.healthMax.text(max)
			tags.healthBar.css("width", percent)
			tags.healthBar.css("background-color", getHealthColor(p))
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
					let curP = Math.ceil(this.width) / availableWidth
					tags.healthBar.css("background-color", getHealthColor(curP))
				},
				complete: function(){
					tags.healthBar.css("width", newWidth)
					let curP = Math.ceil(newWidth) / availableWidth
					tags.healthBar.css("background-color", getHealthColor(curP))
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
	updatePokeballs(trainerIndex){
		let tags = this.trainerTags[trainerIndex]
		let pokeballContainers = [...tags.pokeballContainers]
		if (trainerIndex === 0) {
			pokeballContainers.reverse()
		}
		let pokemon = this.trainers[trainerIndex].pokemon
		for (let i = 0; i < 6; i++){
			let container = $(pokeballContainers[i])
			let pokeball = $(`<img class="pokeball">`)
			let p = pokemon[i]
			if (p){
				pokeball.attr("src", "src/img/Poké_Ball_icon.png")
				pokeball.css({
					opacity: 1
				})
				if (p.hp <= 0){
					pokeball.css({
						filter: "saturate(0)"
					})
				} else if (p === this.trainers[trainerIndex].activePokemon){
					pokeball.css({
						filter: "drop-shadow(0px 0px 4px #ffffff70)",
						'border-color': "white"
					})
				}
				
				let popoverContent = p.name
				if (trainerIndex === 0 && config.pokemonSwapOutInfo){
					popoverContent += `<br><span class='tiny-tutorial'>Swapping ends your turn.<br>It will enter with half the active pokemon's energy.</span>`
				}
				popoverContent = `<p class='text-center mb-0'>` + popoverContent + `</p>`

				pokeball.click(() => {
					this.beginToSwapPokemon(trainerIndex, p)
				})

				pokeball.popover({
					content: popoverContent,
					html: true,
					placement: "bottom",
					trigger: "hover"
				})
			} else {
				// pokeball.attr("src", "src/img/Poké_Ball_icon_empty.svg")
				pokeball.hide()
			}

			container.html(pokeball)
		}
	}
	updateStatusEffects(trainerIndex){
		let statusTag = this.trainers[trainerIndex].tags.pokemonStatusSection
		statusTag.find(".status-effect").popover("hide")
		statusTag.empty()
		let pokemon = this.trainers[trainerIndex].activePokemon
		for (let status of pokemon.statusEffects){
			let data = pokemonStatusData[status.name]
			if (data){
				let box = $(`<div class='status-effect-container'></div>`)
				let img = $(`<img class='status-effect' src='${data.image}'>`)
				img.css("background-color", data.color)

				let popoverHTML = () => {
					let html = ""
					let name = getLocaleString("name", lang, ["status-effects", data.name])
					let description = getLocaleString("description", lang, ["status-effects", data.name])
					html += `<span>${name}</span>`
					if (description){
						html += `<br><span>${description}</span>`
					}
					return html
				}

				img.popover({
					content: popoverHTML,
					html: true,
					placement: trainerIndex === 0 ? "right" : "left",
					trigger: "hover"
				})
				box.append(img)
				statusTag.append(box)
			}
		}
	}

	updateEverything(){
		for (let i = 0; i < this.trainers.length; i++){
			this.updateHealth(i, true)
			this.updateEnergy(i, true)
			this.updatePokemonMoves(i)
			this.updatePokeballs(i)
			this.updateStatusEffects(i)
		}
		
		this.updateConfirmButton()
	}

	fillTrainerTags(tags, classname){
		tags.side = $(`#board .board-side${classname}`)
		tags.sideTop = tags.side.children(".board-side-top")
		tags.sideMiddle = tags.side.children(".board-side-middle")
		tags.sideBottom = tags.side.children(".board-side-bottom")

		tags.health = tags.sideTop.children(".health-bar")
		tags.health.css({opacity: "0"})
		tags.healthBar = tags.health.children(".bar")
		tags.healthText = tags.health.children("span")
		tags.healthCurrent = tags.healthText.children(".current-health")
		tags.healthCurrent.text(0)
		tags.healthMax = tags.healthText.children(".max-health")
		tags.healthMax.text(0)
		tags.pokemonSection = tags.sideTop.children(".avatar-pokemon-section")
		tags.pokemonName = tags.pokemonSection.children(".avatar-pokemon-name")
		tags.pokemonName.text("")
		tags.pokemonImageSection = tags.pokemonSection.children(".avatar-pokemon-image")
		tags.pokemonImage = tags.pokemonImageSection.children(".pokemon-image")
		tags.pokemonImage.attr("src", "")
		tags.pokeballImageSection = tags.pokemonSection.children(".avatar-pokeball-image")
		tags.pokeballImage = tags.pokeballImageSection.find(".pokeball-image")
		tags.trainerImageSection = tags.pokemonSection.children(".avatar-trainer-image-section")
		tags.trainerImage = tags.trainerImageSection.children(".trainer-image")
		tags.pokeballDisplay = tags.sideMiddle.children(".pokeball-display")
		tags.pokeballContainers = tags.pokeballDisplay.children().children(".pokeball-container")
		tags.pokemonStatusSection = tags.pokemonSection.children(".pokemon-status-effect-section")

		tags.energySection = tags.sideMiddle.children(".energy-resources")
		tags.energyBars = {}
		colors.forEach(c => {
			tags.energyBars[c] = tags.energySection.children(`[data-energy='${c}']`)
			tags.energyBars[c + "Count"] = tags.energyBars[c].children(".count")
			tags.energyBars[c + "Bar"] = tags.energyBars[c].children(".bar")
		})

		tags.moveList = tags.sideBottom.children(".move-list")
		tags.moves = []
		
		tags.sideMiddle.css({opacity: "0"})
		tags.sideBottom.css({opacity: "0"})
		tags.pokeballContainers.children().show()
	}

	animateSendOutPokemon(trainerIndex, pokemon, animName){
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)

		//Start the little animation throwing the ball
		let trainer = this.trainers[trainerIndex]
		let trainerTags = trainer.tags
		let trainerTag = trainerTags.trainerImageSection
		let pokeballTag = trainerTags.pokeballImage
		let pokemonTag = trainerTags.pokemonImage
		let pokemonSection = trainerTags.pokemonImageSection
		let canvas = pokeballTag[0]
		let spinDirection = trainerIndex === 0 ? "right" : "left"
		let moveDirection = trainerIndex === 0 ? -1 : 1

		let first

		if (this.hasBegun){
			//We gotta get rid of the current active pokemon
			first = new Promise(resolve => {
				let leavingPokemon = trainer.activePokemon
				let width = pokemonSection.width()
				let facing = leavingPokemon.data.imageFacing
				let directionMult = 1
				if (facing === "left" && trainerIndex === 0 ||
					  facing === "right" && trainerIndex === 1
				){
					directionMult = -1
				}
				let left = width * moveDirection * directionMult
				let rotate = 10 * moveDirection * directionMult
				pokemonTag.css({
					transition: "1s transform",
					"transform-origin": "bottom center",
					transform: `rotate(${rotate}deg) translateX(${left}px)`
				})
				delay(1000).then(() => {
					pokemonTag.css({
						"transform-origin": ""
					})
					resolve()
				})
			})
		} else {
			first = Promise.resolve()
		}

		if (animName){
			first = first.then(() => trainerAnimations[animName](trainerTag))
		}

		//If this is a wild pokemon, the pokemon just slides in from the side.
		//Otherwise, it enters from a pokeball.	
		if (trainerIndex === 0 || trainer.data.name){
			//First, the trainer throws the pokeball, then moves to the side.
			first = first.then(() => {
				pokemonTag.css({
					opacity: "0",
					transition: "",
					transform: ""
				})
	
				return new Promise(resolve => {
					trainerTag.animate({
						left: "40%"
					}, 900)
					
					renderPokeballSmallCanvas(canvas, "pokeball", "closed")
					renderPokeballSpinSmallCanvas(pokeballTag, spinDirection)
					.then(resolve)
				})
			})
			//Then, the pokeball appears to open.
			//Midway through this section, the next animation plays.
			.then(() => {
				return new Promise(resolve => {
					let pokeballContainer = pokeballTag.parent()
					renderPokeballSmallCanvas(canvas, "pokeball", "squish")
	
					let filter = "brightness(4)"
					for (let i = 6; i > 0; i--){
						filter += ` drop-shadow(0px 0px ${i * 5}px white)`
					}
					pokeballContainer.css({
						transition: "1s filter",
						filter: filter
					})
					delay(200).then(resolve)
					delay(1000).then(() => {
						pokeballContainer.css({
							filter: ""
						})
					})
					.then(() => delay(1000)).then(() => pokeballContainer.css({
						transition: ""
					}))
				})
			})
			//Last, the pokemon grows out of the pokeball.
			//This is when the pokemon is considered to have been fully sent out.
			.then(() => {
				delay(50).then(() => renderPokeballSmallCanvas(canvas, "pokeball", "open"))
				.then(() => delay(300))
				.then(() => renderPokeballSmallCanvas(canvas, "pokeball", "none"))
				this.sendOutPokemon(trainerIndex, pokemon)
	
				let h = pokemonSection.height()
				pokemonTag.css({
					opacity: "1",
					transform: `translateY(${h * 0.35}px) scale(0.05)`,
					filter: `brightness(4)`
				})
				const animate = p => {
					let top = interpolate(h * 0.35, 0, bezierEase(p))
					let scale = interpolate(0.05, 1, bezierEase(p))
					let brightness = interpolate(4, 1, bezierEase(p))
					let transform = `translateY(${top}px) scale(${scale})`
					let filter = `brightness(${brightness})`
					
					for (let i = Math.floor(6 * (1 - p)); i > 0; i--){
						let strength = interpolate(5, 0, bezierEase(p))
						filter += ` drop-shadow(0px 0px ${i * strength}px white)`
					}
	
					pokemonTag.css({
						transform: transform,
						filter: filter
					})
				}
	
				return new Promise(resolve => {
					$({val:0}).animate({val: 1}, {
						duration: 1000,
						step: function(){
							animate(this.val)
						},
						complete: function(){
							animate(1)
							resolve()
						}
					})
				}).then(() => {
					pokemonTag.css({
						transform: "",
						filter: "",
					})
				})
			})
		} else {
			first = first.then(() => new Promise(resolve => {
				this.sendOutPokemon(trainerIndex, pokemon)
				let width = pokemonSection.width()
				let facing = pokemon.data.imageFacing
				let directionMult = 1
				if (facing === "right"){
					directionMult = -1
				}
				let left = width * directionMult
				pokemonTag.css({
					transition: "0s transform",
					transform: `translateX(${left}px)`,
				})
				setTimeout(() => {
					pokemonTag.css({
						transition: "0.5s transform",
						transform: "translateX(0px)"
					})
				}, 50)
				
				setTimeout(() => {
					resolve()
				}, 600)
			}))
		}

		first.then(resolvePromise)
		return promise
	}
	sendOutPokemon(trainerIndex, pokemon){
		let tags = this.trainerTags[trainerIndex]
		let name = pokemon.name
		let pokemonName = pokemon.pokemonName
		let src = pokemon.data.imageSources.large
		let facing = pokemon.data.imageFacing
		let correctFacing = trainerIndex === 0 ? "right" : "left"
		tags.pokemonImage.attr("src", src)

		let trainer = this.trainers[trainerIndex]
		let oldActive = trainer.activePokemon
		trainer.activePokemon = pokemon
		//Transfer half of the old pokemon's energy into the new pokemon.
		if (oldActive !== pokemon){
			let energy = getEmptyEnergy()
			for (let color of colors){
				energy[color] = Math.floor(oldActive.energy[color] * 0.5)
				oldActive.energy[color] = 0
			}
			this.giveEnergy(energy, trainer, pokemon)
		}

		let cry = pokemon.data.sounds.cry
		if (cry){
			loadSound(`${pokemonName}-cry`, "cry", cry)
			.then(() => playSound(`${pokemonName}-cry`))

			this.promise.then(() => {
				unloadSound(`${pokemonName}-cry`)
			})
		}

		if (facing !== correctFacing){
			tags.pokemonImageSection.addClass("flip")
		} else {
			tags.pokemonImageSection.removeClass("flip")
		}

		tags.pokemonImage.popover("dispose")
		tags.pokemonImage.popover({
			content: () => {
				return this.getPokemonPopoverContent(pokemon)
			},
			html: true,
			trigger: "hover",
			placement: trainerIndex === 0 ? "right" : "left"
		})
		tags.pokemonName.text(name)
		this.resetPokemonMoves()
		this.updateEverything()
	}
	getPokemonPopoverContent(pokemon){
		let html = $("<div class='pokemon-stats'></div>")

		let name = pokemon.name
		if (name !== pokemon.data.name){
			name += " the " + pokemon.data.name
		}
		html.append(`<div class='name'>${name} (Lv. ${pokemon.level})</div>`)

		let stats = getStatsHTML(pokemon)
		html.append(stats)

		return html.wrap('<p/>').parent().html()
	}
	beginToSwapPokemon(trainerIndex, pokemon){
		if (this.activePlayerIndex !== trainerIndex) return
		if (this.currentlyCarryingOutSwap) return
		if (this.moveQueue.length) return
		if (this.currentlySwappingPokemon) return
		if (this.trainers[0].activePokemon === pokemon) return
		this.currentlySwappingPokemon = true
		this.animateSendOutPokemon(trainerIndex, pokemon)
		let turn = this.turn
		.then(() => {
			this.currentlySwappingPokemon = false
			this.currentlyEndingTurn = true
			return this.turnEnd(turn)
		})
	}

	resetPokemonMoves(){
		for (let i = 0; i < this.trainers.length; i++){
			let trainer = this.trainers[i]
			let tags = this.trainerTags[i]
			tags.moves.forEach(tag => {
				$(tag).popover("hide")
				$(tag).remove()
			})
			tags.moves.length = 0
			let moveListTag = tags.moveList
			moveListTag.html("")

			let pokemon = trainer.activePokemon
			let pokemonIndex = trainer.pokemon.indexOf(pokemon)
			let moves = this.getAvailableMoves(i)

			for (let j = 0; j < moves.length; j++){
				let move = moves[j]
				let tag = getMoveHTML(move)
				
				if (move.name === "Struggle"){
					tag.attr("data-struggle", true)
					tag.hide()
				}

				tag.attr("data-trainer", i)
				tag.attr("data-pokemon", pokemonIndex)
				let moveIndex = pokemon.moves.indexOf(move)
				tag.attr("data-move", moveIndex)

				let popoverHTML = () => {
					let html = $(`<div class='move-popover'></div>`)
					let statLine = $(`<div class="d-flex flex-row-reverse justify-content-between stat-line">`)
					statLine.append(`<div class="move-recharge">
						<img src="src/img/recharge.png">
						<div class="count">${move.rechargeTurns}</div>
					</div>`)
					if (move.power === 0 || move.power){
						statLine.append(`<span class="move-power">Power: ${move.power}</span>`)
					}
					html.append(statLine)
					let description = getLocaleString("description", lang, ["moves", move.name])
					html.append(`<span>${description}</span>`)
					return html
				}

				tag.popover({
					content: popoverHTML,
					html: true,
					trigger: "hover",
					placement: i === 0 ? "right" : "left"
				})

				tags.moves.push(tag)
				tag.appendTo(moveListTag)
				if (i === 0){
					tag.click(event => this.attemptToUseMove(event))
				}
			}

			this.updateMovePayability(i)
			this.updateShowStruggle(i)
		}
		delay(250).then(() => $(".popover").remove())
	}
	updatePokemonMoves(trainerIndex){
		let trainer = this.trainers[trainerIndex]
		let tags = this.trainerTags[trainerIndex]
		let moveList = tags.moves
		this.updateMovePayability(trainerIndex)
		for (let moveTag of moveList){
			let userIndex = moveTag.attr("data-trainer")
			let pokemonIndex = moveTag.attr("data-pokemon")
			let moveIndex = moveTag.attr("data-move")

			let thisTrainer = this.trainers[userIndex]
			let thisPokemon = thisTrainer.pokemon[pokemonIndex]
			let thisMove = thisPokemon.moves[moveIndex]
			let thisMoveUsage = thisPokemon.moveUsage[moveIndex]
			let payability = this.canPayCost(thisMove, trainerIndex)
			let moveCostTag = moveTag.children(".move-cost")
			let costParts = moveCostTag.children(".cost-part")
			
			let usable = true
			for (let i = 0; i < costParts.length; i++){
				let costTag = $(costParts).eq(i)
				let costType = costTag.attr("data-cost")
				if (payability[costType]){
					
				} else {
					usable = false
				}
			}

			let recharge = thisMoveUsage.recharge
			let rechargeTag = moveTag.find(".move-recharge")
			rechargeTag.children(".count").text(recharge)
			if (recharge > 0) {
				usable = false
				rechargeTag.fadeIn()
			} else {
				rechargeTag.fadeOut()
			}

			if (usable && this.canUseMovesRightNow(trainerIndex)){
				moveTag.addClass("usable")
			} else {
				moveTag.removeClass("usable")
			}
		}
		this.updateShowStruggle(trainerIndex)
	}
	updateShowStruggle(trainerIndex){
		let canUse = this.canUseStruggle(trainerIndex)
		let moveTags = this.trainers[trainerIndex].tags.moves
		let struggle = moveTags.find(tag => $(tag).attr("data-struggle"))
		if (canUse){
			$(struggle).fadeIn()
		} else {
			$(struggle).fadeOut()
		}
	}
	updateMovePayability(trainerIndex){
		let tags = this.trainerTags[trainerIndex]
		let moveList = tags.moveList
		let moveTags = moveList.children(".move")
		for (let i = 0; i < moveTags.length; i++){
			let moveTag = moveTags.eq(i)
			let costSection = moveTag.children(".move-cost")

			let userIndex = parseInt(moveTag.attr("data-trainer"))
			let pokemonIndex = parseInt(moveTag.attr("data-pokemon"))
			let moveIndex = parseInt(moveTag.attr("data-move"))
			if (isNaN(userIndex) || isNaN(pokemonIndex) || isNaN(moveIndex)){
				console.warn("Can't figure out what this move tag right here is talking about:")
				console.warn(moveTag)
				continue
			}
			let move = this.trainers[userIndex].pokemon[pokemonIndex].moves[moveIndex]
			let payability = this.canPayCost(move, trainerIndex)

			let costTags = costSection.children(".cost-part")
			for (let j = 0; j < costTags.length; j++){
				let costTag = costTags.eq(j)
				let costType = costTag.attr("data-cost")
				let icon = costTag.children(".icon")
				if (payability[costType]){
					icon.removeClass("unpayable")
				} else {
					icon.addClass("unpayable")
				}
			}
		}
	}

	removeAllStatusEffects(){
		for (let trainer of this.trainers){
			for (let pokemon of trainer.pokemon){
				let statusEffects = pokemon.statusEffects
				let statChanges = statusEffects.filter(s => {
					return s.type === "stat"
				})
				statChanges.forEach(s => {
					statusEffects.splice(statusEffects.indexOf(s), 1)
				})
			}
		}
	}
}

class Trainer{
	constructor(name, pokemon, options){
		this.name = name
		this.pokemon = []
		this.data = options ?? {}
		pokemon.forEach(p => this.pokemon.push(p))
		let usablePokemon = pokemon.filter(p => p.hp >= 0)
		this.activePokemon = usablePokemon[0]
		if (!this.activePokemon){
			console.warn("WEE OO WEE OO")
			console.trace()
		}
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

	tick(){
		let contents = this.contents
		for (let tile of contents){
			tile.tick()
		}
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
			return true
		}
		return false
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
	//Tells you whether tile is within the boudaries of the visible space.
	isOnScreen(tile){
		let x = tile.x
		let h = x >= 0 && x <= this.width
		let y = tile.y
		let v = y >= 0 && y <= this.height
		return h && v
	}
	tilesOnScreen(){
		return this.contents.filter(t => this.isOnScreen(t))
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

	countTiles(options){
		let type = options.type
		let count = 0
		for (let tile of this.contents){
			if (tile.type === type){
				count++
			}
		}
		return count
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
					let move = [thatTile, tile, result]
					alreadyConsidered.push(move)
					if (!result.length) continue
					allMoves.push(move)
				}
			}
		}
		return allMoves
	}

	couldSwap(tile1, tile2){
		let goodDistance = distance(tile1.x, tile1.y, tile2.x, tile2.y) === 1
		let isLocked = (
			tile1.hasStatus("Locked") ||
			tile2.hasStatus("Locked")
		)
		return goodDistance && !isLocked
	}

	getShuffleLocationMap(){
		let newLocationMap = new Map()
		let spots = []
		let tiles = []
		for (let i = 0; i < this.width; i++){
			for (let j = 0; j < this.height; j++){
				spots.push([i, j])
			}
		}
		for (let i = 0; i < this.contents.length; i++){
			tiles.push(this.contents[i])
		}

		shuffleArray(spots)
		shuffleArray(tiles)

		while (spots.length > 0 && tiles.length > 0){
			newLocationMap.set(tiles[0], spots[0])
			spots.shift()
			tiles.shift()
		}

		return newLocationMap
	}
}

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

		this.statusEffects = []

		this.spriteRenderScale = 1
		this.spriteX = 0
		this.spriteY = 0
		this.spriteCenterX = 0
		this.spriteCenterY = 0
		this.spriteWidth = 0
		this.spriteHeight = 0
		this.spriteHighlight = 0
		this.spriteHighlightTarget = 0
	}

	tick(){
		let statusEffects = this.statusEffects
		for (let status of statusEffects){
			status.tick()
		}

		this.spriteHighlight = lerp(this.spriteHighlight, this.spriteHighlightTarget, 0.03)
		// this.spriteHighlight = this.spriteHighlightTarget
	}

	matchesWith(tile){
		if (!tile) return false
		if (tile.y < 0) return false
		return tile.type === this.type
	}

	getEnergyValue(){
		let energy = getEmptyEnergy()
		switch (this.type){
			case "red": energy.red += 1
			break
			case "orange": energy.orange += 1
			break
			case "yellow": energy.yellow += 1
			break
			case "green": energy.green += 1
			break
			case "blue": energy.blue += 1
			break
			case "purple": energy.purple += 1
			break
			default:
				console.warn("You never said what ",this.type,"should do")
		}
		return energy
	}

	addStatusEffect(status, owner, pokemon, source, color){
		let statusEffect = new TileStatus(status)
		statusEffect.sourceMove = source
		statusEffect.sourcePokemon = pokemon
		statusEffect.sourceTrainer = owner
		statusEffect.color = color
		statusEffect.turns = status?.duration ?? null
		this.statusEffects.push(statusEffect)
	}
	hasStatus(name){
		return this.statusEffects.some(status => {
			return status.name === name
		})
	}
}

class TileStatus{
	constructor(status){
		this.spriteOpacity = 0.3

		for (let key in status){
			this[key] = status[key]
		}
		this.duration = this?.duration ?? null
		this.turns = this.duration
	}

	tick(){
		this.spriteOpacity = lerp(this.spriteOpacity, 1, 0.2)
	}
}

function beginRound(trainerData){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let player = new Trainer("Player", playerActivePokemon)
	let enemyPokemon = trainerData.pokemon.map(data => {
		if (data.levelMin && data.levelMax){
			data.level = randomFrom(data.levelMin, data.levelMax)
		}
		return new Pokemon(undefined, data.pokemonName, data)
	})
	let enemy = new Trainer("Enemy", enemyPokemon, trainerData)
	gameRound = new Round(player, enemy, resolvePromise)
	gameBoard = gameRound.board

	return promise
}

function canPokemonBeHealed(pokemonList){
	let healables = []
	let toPerform = {
		hp: 0,
		debuffs: []
	}
	for (let pokemon of pokemonList){
		let healed = false
		if (pokemon.hp < pokemon.maxhp){
			healed = true
			toPerform.hp += pokemon.maxhp - pokemon.hp
		}
		let debuffs = pokemon.statusEffects.filter(s => {
			let name = s.name
			let data = pokemonStatusData[name]
			return data && data.class === "debuff"
		})
		debuffs.forEach(s => debuffs.push(s))
		if (healed){
			healables.push(pokemon)
		}
	}
	toPerform.pokemon = healables
	return toPerform
}

function doEvolutionAnimation(elem, pokemon, evolution){
	let evolveTo = pokemonData[evolution.name]
	let body = $(`<div class='evolution-container'></div>`)
	elem.append(body)
	let image1src = pokemon.data.imageSources.large
	let image2src = evolveTo.imageSources.large
	let box1 = $("<div></div>")
	let box2 = $("<div></div>")
	body.append(box1)
	body.append(box2)
	let image1 = $(`<img>`).attr("src", image1src)
	let image2 = $(`<img>`).attr("src", image2src)
	image2.css("opacity", 0)
	image2.css("filter", "brightness(100)")
	box1.append(image1)
	box2.append(image2)
	let result = {}

	let skipped = false
	result.skipped = false
	let skip = () => {
		skipped = true
		result.skipped = true
	}

	//Squash
	delay(500).then(() => {
		$({val: 0}).animate({val: 1}, {
			duration: 1500,
			step: function(){
				if (skipped) return
				let p = this.val
				let x = 1 - (p * 0.2)
				let y = 1 + (p * 0.2)
				let transform = ""
				transform += ` scaleX(${x})`
				transform += ` scaleY(${y})`
				image1.css("transform", transform)
				image2.css("transform", transform)
			}
		})
	})
	//Outer glow
	delay(1000).then(() => {
		$({val: 0}).animate({val: 1}, {
			duration: 3000,
			step: function(){
				if (skipped) return
				let p = this.val
				let glow = interpolate(0, 1, bezierEase(p))
				let i = image1.width() * glow * 0.1
				let filter = `drop-shadow(0px 0px ${i * 5}px white)`
				filter += ` drop-shadow(0px 0px ${i * 3}px rgba(255, 255, 255, ${p}))`
				body.css("filter", filter)
			}
		})
	})
	// Brightify
	delay(700).then(() => {
		$({val: 0}).animate({val: 1}, {
			duration: 1800,
			step: function(){
				if (skipped) return
				let p = this.val
				let brightness = interpolate(1, 10, bezierEase(p))
				brightness = brightness * brightness
				image1.css("filter", `brightness(${brightness})`)
			}
		})
	})
	//In and out opacity to swap
	let inNOut = (duration, times, last) => {
		let promise = new Promise(res => {
			$({val: 0}).animate({val: 1}, {
				duration: duration,
				easing: "linear",
				step: function(){
					if (skipped) return
					let p = this.val
					let extra = last ? (0.5 / times) : 0
					let phase = (p * (1 + extra)) % (1 / times) * times
					let v = phase > 0.5 ? 0.5 - (phase - 0.5) : phase
					v *= 2
					image2.css("opacity", v)
					let v2 = 1 - v
					image1.css("opacity", v2)
				},
				complete: function(){
					res()
				}
			})
		})
		return promise
	}
	delay(4000)
	.then(() => inNOut(4000, 3))
	.then(() => inNOut(3000, 4))
	.then(() => inNOut(3000, 9, true))
	//Fade out outer glow & brightness
	delay(13000).then(() => {
		$({val: 0}).animate({val: 1}, {
			duration: 1500,
			step: function(){
				let p = 1 - this.val
				let x = 1 - (p * 0.2)
				let y = 1 + (p * 0.2)
				let transform = ""
				transform += ` scaleX(${x})`
				transform += ` scaleY(${y})`
				image1.css("transform", transform)
				image2.css("transform", transform)
				let glow = interpolate(0, 1, bezierEase(p))
				let i = image1.width() * glow * 0.1
				let filter = `drop-shadow(0px 0px ${i * 5}px white)`
				filter += ` drop-shadow(0px 0px ${i * 3}px rgba(255, 255, 255, ${p}))`
				body.css("filter", filter)
				let brightness = interpolate(1, 10, bezierEase(p))
				brightness = brightness * brightness
				image2.css("filter", `brightness(${brightness})`)
			},
			complete: function(){
				if (skipped) return
				image1.hide()
				image2.css("opacity", 1)
				image2.css("filter", "")
				image2.css("transform", "")
			}
		})
	})
	let animationComplete = delay(15000)
	result.promise = animationComplete
	result.skip = skip
	return result
}