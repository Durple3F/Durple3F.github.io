const caughtPokemon = []
const playerActivePokemon = []
const playerPCBoxes = []

let gameRound, gameBoard
let playerSaveId = null
let playerSaveInfo = {}

class Round{
	constructor(trainer1, trainer2, resolvePromise, oldBoard){
		this.board = oldBoard ?? new Board(8, 8)
		this.board.fill()
		this.board.clearAllEffects()
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
		this.initiativeValues = []
		this.trainers.forEach((t, i) => {
			this.initiativeValues[i] = 0
		})
		this.maxInitiative = 100

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

		this.moveUseHistory = []

		this.promise = new Promise(resolve => {
			this.resolve = resolve
		})
		this.resolveRound = resolvePromise
		
		let playerTags = this.trainerTags[0]
		let enemyTags = this.trainerTags[1]
		this.fillTrainerTags(playerTags, ".player")
		this.fillTrainerTags(enemyTags, ".enemy")

		this.selectionWindow = $(".board-center #screen-tooltip")
		this.confirmButton = $(".board-center .confirm-btn")
		this.confirmButton.click(() => {
			this.confirm()
		})

		this.loadResources()
		let p = this.roundStartAnimation()
		p.then(() => this.begin())

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
		$("#board").addClass("no-pointer")

		let enemyTrainer = this.trainers[1]
		let enemyData = enemyTrainer.data
		let NPCData = getNPCDataFromTrainer(enemyData)
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
			tags.initiative.animate({opacity: "1"})
		}

		let NPCData = this.trainers[1].data
		let isWild = !NPCData.name
		if (isWild){
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

		//Set each pokemon back so they forget anything that shouldn't be there.
		for (let trainer of this.trainers){
			for (let pokemon of trainer.pokemon){
				pokemon.resetEverything()
			}
		}

		//Determine who goes first
		let firstPlayer = this.getNextPlayer()
		this.changeTurns(firstPlayer)

		const popoverHTML = () => {
			let html = getLocaleString("initiative-tutorial", lang) || ""
			return `<div class='text-center'>${html}</div>`
		}
		$(".initiatives").popover("dispose")
		$(".initiatives").popover({
			content: popoverHTML,
			html: true,
			trigger: "hover",
			placement: "top"
		})

		$("#board").removeClass("no-pointer")

		this.resetCurrentlySelecting()
		this.updateEverything()
		let turn = this.turn
		let p = this.timeStep()
		p.then(() => {
			this.hasBegun = true
			return this.turnStart(turn)
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

			//Remove activeness from both trainer's tags.
			for (let trainer of this.trainers){
				trainer.tags.side.removeClass("active")
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
			
			//Once the round is over, save the player's info.
			this.promise.then(() => {
				return savePlayerInfo()
			})
			//And THEN finalize the round finishing.
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
		if (this.hasEnded){
			return Promise.resolve()
		}
		let promise = Promise.resolve()
		let enemyTrainer = this.trainers[1]
		let enemyActivePokemon = enemyTrainer.activePokemon
		let enemySwaps = !isPokemonUsable(enemyActivePokemon)
		let playerTrainer = this.trainers[0]
		let playerActivePokemon = playerTrainer.activePokemon
		let playerSwaps = !isPokemonUsable(playerActivePokemon)

		if (playerSwaps) playerActivePokemon.fainted = true
		if (enemySwaps) enemyActivePokemon.fainted = true

		if (enemySwaps || playerSwaps){
			this.updateEverything()
		}
		if (enemySwaps){
			let pokemonCanSwapTo = getUsablePokemon(enemyTrainer.pokemon)
			if (pokemonCanSwapTo.length > 0){
				//If the enemy has pokemon they can swap to, they pick one and swap to it.
				promise = promise.then(() => this.computerChoosePokemon(pokemonCanSwapTo, "swap"))
				.then(pokemonList => {
					return this.animateSendOutPokemon(1, pokemonList[0])
				})
			} else {
				//If the enemy has no pokemon they can swap to, you win.
				promise = promise.then(() => this.end("win"))
			}
		} else if (playerSwaps){
			let pokemonCanSwapTo = getUsablePokemon(playerTrainer.pokemon)
			if (pokemonCanSwapTo.length > 0){
				promise = promise.then(() => choosePokemon("Choose a Pokemon to swap to.", pokemonCanSwapTo))
				.then(pokemonList => {
					return this.animateSendOutPokemon(0, pokemonList[0])
				})
			} else {
				//If you run out of viable pokemon, you lose.
				promise = promise.then(() => this.end("lose"))
			}
		}

		return promise
	}

	applyLocationChanges(map){
		for (let change of map){
			let tile = change[0]
			let loc = change[1]
			this.board.changeLocation(tile, loc[0], loc[1])
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
		}
		else if (this.currentlyReversingSwap){
			this.currentlyReversingSwap = false
		}
		else {
			let turn = this.turn
			this.timeStep()
			.then(() => {
				this.currentlyCarryingOutSwap = false
				if (!options.noEndTurn){
					this.endMove(turn)
				} else {
					console.log("Skipped the turn ending!")
				}
			})
		}
	}
	getTileEnergyValue(tile){
		let base = tile.getEnergyValue()
		let result = addEnergies(base, getEmptyEnergy())

		let energyModifiers = [
			"Energy Down"
		]
		let statusEffects = tile.statusEffects.filter(s => {
			return energyModifiers.includes(s.name)
		})

		let trainer = this.trainers[this.activePlayerIndex]
		for (let status of statusEffects){
			let name = status.name
			let sourceTrainer = status.sourceTrainer
			if (name === "Energy Down" && trainer !== sourceTrainer){
				let nonZeroKeys = Object.keys(result)
				.filter(key => result[key] > 0)
				if (nonZeroKeys.length){
					let mod = getEmptyEnergy()
					let key = randomChoice(nonZeroKeys)
					mod[key] = -1
					result = addEnergies(result, mod)
				}
			}
		}

		return result
	}

	handleEffects(matches){
		let activeTrainer = this.trainers[this.activePlayerIndex]
		let activePokemon = activeTrainer.activePokemon
		let otherTrainer = this.trainers[this.inactivePlayerIndex]

		let energiesToAdd = []
		let energy = getEmptyEnergy()
		let tiles = []
		let matchTotals = getEmptyTileTypeTable()
		for (let match of matches){
			match.forEach(t => tiles.push(t))
			let matchTypes = getMatchTypes(match)
			matchTotals = addEnergies(matchTotals, matchTypes)
		}
		tiles = noDuplicates(tiles)

		//Each pokemon has stats governing how much bonus energy they should get
		//From different match types.
		for (let type in matchTotals){
			let count = matchTotals[type]
			let energyValue = activePokemon.getBonusEnergy(type)
			let totalEnergy = multiplyEnergies(energyValue, count, "up")
			energy = addEnergies(totalEnergy, energy)
		}

		//Let's give the active player energy of each color based on tiles matched
		//of that color
		let energyFromMatches = getEmptyEnergy()
		for (let tile of tiles){
			let energyValue = this.getTileEnergyValue(tile)
			energyFromMatches = addEnergies(energyValue, energyFromMatches)
		}

		//If the active pokemon is Asleep, they get less energy.
		if (activePokemon.hasStatus("asleep")){
			energyFromMatches = multiplyEnergies(energyFromMatches, 0.5, "up")
		}

		energy = addEnergies(energyFromMatches, energy)
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
		let promise = Promise.resolve()
		//This is where all of the end-of-move rewards can be done

		//Next turn
		promise = promise.then(() => this.checkForWinner())
		promise = promise.then(() => this.turnEnd(turn))
		return promise
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

				if (this.matchesInCombo.length){
					this.updateEverything()
				}

				resolve()
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
		let dialogueOpen = $("#dialogue-container").css("display") !== "none"
		let covered = modalOpen || dialogueOpen
		if (!document.hidden && !covered){
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

		//This pokemon has been active for one more turn
		trainer.activePokemon.turnsActive++

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

		//Handle start-of-turn status effects
		let cursed
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
						damage: damage,
						fixed: true
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
				} else if (isEnemy && statusName === "Cursed"){
					cursed = status
				}
			}
		}
		if (cursed){
			let damage = Math.floor(activePokemon.maxhp / 4)
			this.dealDamage({
				from: cursed.sourcePokemon,
				fromTrainer: cursed.sourceTrainer,
				move: cursed.sourceMove,
				to: activePokemon,
				toTrainer: trainer,
				damage: damage,
				fixed: true
			})
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
			activePokemon.removeStatus(status)
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
				tile.removeStatus(status)
			}
		}

		let promise = Promise.resolve()

		//Find any start-of-turn effects that moves may have.
		for (let trainer of this.trainers){
			let activePokemon = trainer.activePokemon
			let activeMoves = activePokemon.activeMoves
			for (let move of activeMoves){
				if (move.onTurnStart){
					promise = promise.then(() => {
						return this.triggerMoveEffects(
							trainer, activePokemon, move, "onTurnStart"
						)
					})
				}
			}
		}

		promise = promise.then(() => this.checkForWinner())
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
		if (this.hasEnded){
			return
		}

		//Reduce initiative
		let initiatives = this.initiativeValues
		let newInitiative = initiatives[this.activePlayerIndex] - this.maxInitiative
		initiatives[this.activePlayerIndex] = Math.max(0, newInitiative)
		this.updateInitiative(this.activePlayerIndex, false)

		let activeTrainer = this.trainers[this.activePlayerIndex]
		let activePokemon = activeTrainer.activePokemon

		//A Drowsy pokemon becomes asleep.
		if (activePokemon.hasStatus("drowsy")){
			let drowsy = activePokemon.getStatuses("drowsy")[0]
			if (this.currentCascade >= 2){
				activePokemon.removeStatusesWithName("drowsy")
			} else if (drowsy) {
				let sourceTrainer = drowsy.sourceTrainer
				let sourcePokemon = drowsy.sourcePokemon
				let sourceMove = drowsy.sourceMove
				activePokemon.addStatusEffect("asleep", sourceTrainer, sourcePokemon, sourceMove)
			}
		}

		let nextPlayer = this.getNextPlayer()
		if (nextPlayer !== this.activePlayerIndex){
			this.prepareToChangeTurns(nextPlayer)
		}

		this.currentlyReversingSwap = false
		this.updateEverything()
		this.turn++
		let newTurn = this.turn
		
		if (this.hasBegun){
			if (this.activePlayer === "player"){
				delay(300).then(() => this.turnStart(newTurn))
			} else {
				this.waitUntilNoAnnouncements(() => {
					return delay(300).then(() => this.turnStart(newTurn))
				})
			}
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

	getOtherPlayer(trainerIndex){
		return trainerIndex === 0 ? 1 : 0
	}
	getNextPlayer(){
		//If the skip flag is set to true, the next turn goes to the other guy.
		// if (this.currentlyEndingTurn === true){
		// 	return this.getOtherPlayer(this.activePlayerIndex)
		// }

		//Increase initiative values
		let initiatives = this.initiativeValues
		let getExtraTurn = this.matchesInCombo.some(m => m.length >= 4)
		if (getExtraTurn){
			let playerIndex = this.activePlayerIndex
			initiatives[playerIndex] += this.maxInitiative
		} else {
			let max = this.maxInitiative
			let speed1 = this.trainers[0].activePokemon.getEffectiveStat("speed")
			let speed2 = this.trainers[1].activePokemon.getEffectiveStat("speed")
			let p1 = (max - initiatives[0]) / speed1
			let p2 = (max - initiatives[1]) / speed2
			p1 = Math.max(p1, 0)
			p2 = Math.max(p2, 0)
			if (p1 < p2){
				//If p1 should go next
				initiatives[0] += speed1 * p1
				initiatives[1] += speed2 * p1
			} else {
				initiatives[0] += speed1 * p2
				initiatives[1] += speed2 * p2
			}
			initiatives[0] = Math.round(initiatives[0])
			initiatives[1] = Math.round(initiatives[1])

			//Just a nice thing, if there's a tie, err in favor of the player.
			if (initiatives[0] > max - 1){
				initiatives[0] = max
			}
			if (initiatives[0] === initiatives[1]){
				initiatives[1] -= 1
			}
		}
		if (initiatives.some(i => i < 0)){
			console.warn("How is one of these less than 0?")
			console.trace()
		}

		//Whoever has the higher initiative goes next. One of them *should* be exactly 100.
		//It *should* be impossible for one of them to be > 100.
		if (initiatives[0] >= initiatives[1]){
			return 0
		} else {
			return 1
		}

		//If you matched 4 or more, you get an extra turn.
		// let getExtraTurn = this.matchesInCombo.some(m => m.length >= 4)
		// if (this.matchesInCombo.length > 0 && !getExtraTurn){
		// 	return this.inactivePlayerIndex
		// }
		// this.createAnnouncement("general", "Extra turn!")
		// return this.activePlayerIndex
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
			let image = p.getImage()
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
						let learn = p.data.learnset[moveIndex]
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
						let learn = p.data.learnset[moveIndex]
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
		promise = promise.then(() => delay(250))
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
		let pokemon = this.trainers[1].activePokemon
		//Returns a list of those same moves filtered to the ones
		//that would do something right now
		let good = []
		//TODO it would be really nice if we could score these and sort the results
		//by how good they are right now
		for (let move of moveList){
			//TODO watch out for stuff like healing moves, or
			//moves that only work if the board meets certain conditions
			let moveIndex = pokemon.moves.indexOf(move)
			let moveUsage = pokemon.moveUsage[moveIndex]
			let prevented = false

			if (moveUsage.recharge){
				prevented = true
			}
			
			if (!prevented){
				good.push(move)
			}
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
			let energyValues = tiles.map(tile => {
				return this.getTileEnergyValue(tile)
			})
			let total = getEmptyEnergy()
			for (let energyValue of energyValues){
				total = addEnergies(energyValue, total)
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
	computerChoosePokemon(pokemon, reason, minChooseable=1, maxChooseable=1){
		//TODO have the logic here be based on which reason they could be choosing stuff
		//Current reasons are:
		// - swap (The computer is changing their active pokemon)
		// - damage (The computer is choosing a pokemon which they would like to have damage dealt to.)
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)

		let chosen = pokemon[Math.floor(Math.random() * pokemon.length)]
		resolvePromise([chosen])

		return promise
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
		power = this.getEffectivePower(attackerTrainer, attacker, move, power)
		console.log(power)
		
		let category = options.category ?? move.category ?? "Physical"
		let type = options.type ?? move.type ?? "Typeless"

		let burned = attacker.hasStatus("burn")
		if (burned && category === "Physical"){
			power *= 0.5
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

		let atk, def
		if (category === "Physical"){
			atk = attacker.getEffectiveStat("attack")
			def = defender.getEffectiveStat("defense")
		} else if (category === "Special") {
			atk = attacker.getEffectiveStat("specialAttack")
			def = defender.getEffectiveStat("specialDefense")
		} else if (category === "Status") {
			//This should never run
			atk = attacker.getEffectiveStat("attack")
			def = defender.getEffectiveStat("defense")
		} else {
			console.warn("UNKNOWN CATEGORY", category)
		}

		let damage = options.damage
		if (damage === undefined){
			damage = (attacker.level * 2 / 5 + 2) * power * atk / def / 50 + 2
		}
		if (attacker.getEffectiveTypes().includes(type)){
			damage *= 1.5
		}
		let typeMult = 1
		for (let defType of defender.getEffectiveTypes()){
			typeMult *= typeEffectiveness[type][defType]
		}
		damage *= typeMult

		//Damage can be set to a specific value
		if (options.fixed && options.damage !== undefined){
			damage = options.damage
		}

		damage = Math.round(damage)

		//If the receiving Pokemon has Invulnerable, set damage dealt to 0.
		let statusEffects = defender.statusEffects
		let isInvulnerable = defender.hasStatus("invulnerable")
		if (isInvulnerable && attacker !== defender){
			damage = 0
			result.damageDealt = 0
		}
		
		if (damage){
			//On the off chance something ever does negative damage
			let targetHp = defender.hp - damage
			if (targetHp > defender.maxhp){
				damage = defender.hp - defender.maxhp
			}
			defender.hp -= damage
			result.damageDealt = damage
		}

		if (result.damageDealt > 0 || result.damageDealt < 0){
			let animOptions = {
				duration: 2000,
				distance: 30
			}
			let text
			if (damage > 0){
				animOptions.color = "#db2428"
				text = "-" + damage
			} else {
				animOptions.color = "#179e08"
				text = "+" + damage
			}
			let isActive = defender === defenderTrainer.activePokemon
			if (isActive){
				animOptions.direction = randomAngle(225, 315)
				animOptions.side = "right"
				let healthBar = defenderTrainer.tags.healthBar
				addFloatingText(text, healthBar, animOptions)
				this.updateHealth(this.trainers.indexOf(defenderTrainer), true)
			} else {
				animOptions.direction = randomAngle(80, 100)
				animOptions.side = "top"
				let pokeballContainers = defenderTrainer.tags.pokeballContainers
				let trainerIndex = this.trainers.indexOf(defenderTrainer)
				let pokemonIndex = defenderTrainer.pokemon.indexOf(defender)
				let selector = `.pokeball[data-trainer=${trainerIndex}][data-pokemon=${pokemonIndex}]`
				let pokeball = pokeballContainers.find(selector)
				addFloatingText(text, pokeball, animOptions)
			}
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
		let moveUsage = pokemon.moveUsage[moveIndex]
		if (moveUsage.recharge){
			this.createAnnouncement("general", "That move is recharging.")
			return
		}
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
			let cost = this.getEffectiveCost(trainer, pokemon, move)
			let energyCost = cost.energyCost
			
			for (let color of colors){
				if (energyCost[color] === undefined) {
					payability[color] = true
					continue
				}
				payability[color] = pokemon.energy[color] >= energyCost[color]
			}
		}

		return payability
	}
	//Returns an object that contains info about how much more of each color that
	//the trainer must collect to use this move
	canPayForMove(trainer, pokemon, move){
		let able = true
		let cost = this.getEffectiveCost(trainer, pokemon, move)
		let energyCost = cost.energyCost
		let needed = getEmptyEnergy()
		for (let color of colors){
			if (energyCost[color] > pokemon.energy[color]){
				able = false
				needed[color] += energyCost[color] - pokemon.energy[color]
			}
		}
		return {result: able, needed: needed}
	}
	payForMove(trainer, pokemon, move){
		let cost = this.getEffectiveCost(trainer, pokemon, move)
		let energyCost = cost.energyCost
		for (let color of colors){
			if (energyCost[color] === undefined) continue
			pokemon.energy[color] -= energyCost[color]
		}
	}
	getEffectiveCost(trainer, pokemon, move, cost){
		if (!cost){
			cost = {}
		}
		if (!cost.energyCost){
			//Start the cost equal to the move's energy cost
			let energyCost = getEmptyEnergy()
			cost.energyCost = energyCost
			for (let color in move.energy){
				energyCost[color] = move.energy[color]
			}
		}
		let energyCost = cost.energyCost
		
		let costEffects = pokemon.getStatusesOfType("cost-alteration")
		for (let statusEffect of costEffects){
			let applies = doesThisApplyToMove(move, statusEffect.appliesTo)
			if (applies){
				let modification = statusEffect.energyCost
				for (let color in modification){
					energyCost[color] = (energyCost[color] ?? 0) + modification[color]
				}
			}
		}

		return cost
	}

	getEffectivePower(trainer, pokemon, move, power){
		power = (power ?? move.power) || 0
		let powerEffects = pokemon.getStatusesOfType("power-alteration")
		for (let statusEffect of powerEffects){
			let applies = doesThisApplyToMove(move, statusEffect.appliesTo)
			if (applies){
				let modification = statusEffect.modification
				let operation = modification.operation ?? "add"
				let change = modification.change
				switch (operation){
					case "add": power += change; break
					case "multiply": power *= change; break
				}
			}
		}
		return power
	}

	newMoveUseObj(trainer, pokemon, move, trigger="effects"){
		//This object gets passed around to every single effect of a move
		//in sequence. It has information added to that info list, and
		//that info is used by other effects as parameters.
		let effects = move[trigger]
		if (!effects){
			console.warn("Tried to run effects that don't exist...")
			console.log(trainer, pokemon, move, trigger)
			console.trace()
			effects = []
		}
		effects = effects.map(effect => effect)
		let moveUseObj = {
			trainer: trainer,
			pokemon: pokemon,
			move: move,
			effects: effects,
			turnStartedOn: this.turn,
			originalTrigger: trigger,
			completed: false,
			info: [],
			effectIndex: 0
		}
		let promise = new Promise(resolve => moveUseObj.resolve = resolve)
		moveUseObj.promise = promise
		return moveUseObj
	}
	beginToUseMove(trainer, pokemon, move){
		//Put the move on recharge
		let moveIndex = pokemon.moves.indexOf(move)
		pokemon.moveUsage[moveIndex].recharge = move.rechargeTurns

		let moveUseObj = this.newMoveUseObj(trainer, pokemon, move, "effects")
		let promise = moveUseObj.promise
		console.log(moveUseObj)

		let hasParalyzed = pokemon.hasStatus("paralyzed")
		if (hasParalyzed){
			pokemon.removeStatusesWithName("paralyzed")
			moveUseObj.resolve()
		} else {
			promise = promise.then(() => this.finishCurrentMove())
			this.moveQueue.push(moveUseObj)
			this.moveUseHistory.push(moveUseObj)
			this.updateEverything()

			//It's important to have this check, because otherwise,
			//if you use a move while another one is being carried out,
			//it creates a race condition where they're both being used
			//at the same time.
			if (this.moveQueue.length === 1){
				this.advanceCurrentMove(moveUseObj)
			}
		}
		return promise
	}
	advanceCurrentMove(moveUseObj){
		this.resetCurrentlySelecting()
		// console.log(Date.now())
		// let moveUseObj = this.moveQueue[0]
		let effectIndex = moveUseObj.effectIndex
		moveUseObj.nextEffectIndex = effectIndex + 1
		let effects = moveUseObj.effects

		if (effectIndex >= effects.length){
			moveUseObj.resolve()
			return moveUseObj.promise
		}

		let effect = effects[effectIndex]
		let effectType = effect.type
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)
		let params = getEffectParams(effect, effectIndex, moveUseObj)

		let targetTrainers = {
			"choose-tiles": true,
			"gain-energy": true,
			"get-initiative": true,
			"set-initiative": true,
			"get-active-pokemon": true,
			"count-viable-pokemon": true,
			"get-viable-pokemon": true,
			"choose-pokemon": true,
			"swap-pokemon": true,
		}
		let targetDefaults = {
			"choose-tiles": "user",
			"damage": "opponent",
			"heal": "user",
			"get-stat": "user",
			"get-types": "user",
			"apply-status-effect": "opponent",
			"remove-status-effect": "opponent",
			"apply-debuff": "opponent",
			"select-energy-colors": "none",
			"gain-energy": "user",
			"get-initiative": "user",
			"set-initiative": "user",
			"get-active-pokemon": "user",
			"count-viable-pokemon": "user",
			"get-viable-pokemon": "user",
			"choose-pokemon": "user",
			"swap-pokemon": "user",
		}
		let target
		if (effectType in targetDefaults){
			let targetName = effect.target ?? targetDefaults[effectType]
			if (targetName === "opponent"){
				let otherTrainers = this.trainers.filter(trainer => {
					return trainer !== moveUseObj.trainer
				})
				let otherTrainer = otherTrainers[0]
				if (targetTrainers[effect.type]){
					target = otherTrainer
				} else {
					target = otherTrainer.activePokemon
				}
			} else if (targetName === "user"){
				let trainer = moveUseObj.trainer
				if (targetTrainers[effect.type]){
					target = trainer
				} else {
					target = trainer.activePokemon
				}
			} else if (targetName) {
				console.warn("You never handled", targetName)
			}
		}

		let needsIndexes = {
			"jump-if-less-than": true,
			"jump-if-equal": true,
			"jump-if-includes": true,
			"jump": true,
		}
		let index
		if (effect.jumpTo){
			if (typeof effect.jumpTo === "string"){
				index = effects.findIndex(e => e.label === effect.jumpTo)
			} else {
				index = effect.jumpTo
			}
			if (!index && index !== 0){
				console.warn("Move produced a strange jump index", moveUseObj)
			}
		}
		if (needsIndexes[effectType] && index === undefined){
			console.warn("Didn't get an index!", moveUseObj)
		}

		let shouldUpdate = true
		let delayDuration = 50
		if (!(effectType in pokemonMoveEffects)){
			console.warn("You never handled", effectType)
			console.trace()
			alert("SOMETHING FUCKED UP BAD PLEASE SEND ME A SCREENSHOT OF THE CONSOLE")
			return promise
		}

		let effectData = pokemonMoveEffects[effectType]
		delayDuration = effectData.delay ?? delayDuration
		shouldUpdate = effectData.update ?? shouldUpdate
		let options = {}
		options.promise = promise
		options.moveUse = moveUseObj
		options.effectIndex = effectIndex

		if (effectData.hasTarget){
			let targetName = effect.target ?? effectData.targetDefault
			if (targetName === "opponent"){
				let otherTrainers = this.trainers.filter(trainer => {
					return trainer !== moveUseObj.trainer
				})
				let otherTrainer = otherTrainers[0]
				if (effectData.targetType === "trainer"){
					target = otherTrainer
				} else {
					target = otherTrainer.activePokemon
				}
			} else if (targetName === "user"){
				let trainer = moveUseObj.trainer
				if (effectData.targetType === "trainer"){
					target = trainer
				} else {
					target = trainer.activePokemon
				}
			} else if (targetName === "none"){
				target = undefined
			} else if (targetName) {
				console.warn("You never handled", targetName)
			}
		}

		options.target = target
		options.index = index
		effectData.execute(resolvePromise, effect, params, this, options)
		promise.then(val => new Promise(res => {
			if (val !== undefined){
				moveUseObj.info[effectIndex] = val
			}
			res(val)
		}))

		promise = promise.then(() => {
			moveUseObj.effectIndex = moveUseObj.nextEffectIndex
			let p = Promise.resolve()
			if (delayDuration){
				p = p.then(() => delay(delayDuration))
			}
			return p.then(() => {
				if (shouldUpdate){
					this.updateEverything()
				}
			})
			.then(() => this.timeStep())
			.then(() => this.advanceCurrentMove(moveUseObj))
		})

		return promise
	}
	finishCurrentMove(){
		let moveUseObj
		let promise = new Promise(resolve => {
			//Note: Bad name for this thing.
			//This variable is a LIST of HOPEFULLY one moveUseObject.
			moveUseObj = this.moveQueue.splice(0, 1)

			if (this.moveQueue.length){
				let nextMoveUseObj = this.moveQueue[0]
				this.advanceCurrentMove(nextMoveUseObj)
				.then(resolve)
			} else {
				this.performMoveQueueCallbacks()
				resolve()
			}
			this.resetCascade()
		})
		//Post-end-of-move effects like Confused
		.then(() => {
			if (!moveUseObj.length){
				console.warn("Uh oh! I think a move got ended twice!")
				console.trace()
			} else {
				moveUseObj = moveUseObj[0]
			}
			moveUseObj.completed = true

			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let promises = []
			let endedTurn = false

			if (pokemon && pokemon.statusEffects.length){
				let statusEffects = pokemon.statusEffects
				for (let status of statusEffects){
					if (status.name === "confused"){
						//50% chance that the turn ends.
						let confuseChance = 0.5
						if (Math.random() < confuseChance && !endedTurn){
							endedTurn = true
							let p = this.createAnnouncement("general", "Turn ended due to confusion!", 1500)
							promises.push(p)
							// this.turnEnd(this.turn)
						}
					}
				}
			}

			let promise = Promise.all(promises)
			//Confusion won't end this turn if the turn has already passed.
			if (endedTurn && this.turn === moveUseObj.turnStartedOn){
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

	triggerMoveEffects(trainer, pokemon, move, trigger){
		let moveUseObj = this.newMoveUseObj(trainer, pokemon, move, trigger)
		let promise = moveUseObj.promise
		this.advanceCurrentMove(moveUseObj)
		console.log(moveUseObj)
		return promise
	}

	confirm(){
		let selectType = this.currentlySelecting
		if (selectType.type === "tiles"){
			let valid = this.selectionIsValid()
			if (valid){
				this.submitSelection()
				this.selectionEnd()
			}
		}
		this.updateConfirmButton()
	}
	updateConfirmButton(){
		if (!this.currentlySelecting) return
		let selectType = this.currentlySelecting.type
		let playerTurn = this.currentlySelecting.player === this.trainers[0]
		let valid = this.selectionIsValid()
		if (selectType === "tiles" && playerTurn && valid){
			this.confirmButton.removeAttr("disabled")
		} else {
			this.confirmButton.attr("disabled", true)
		}
	}
	selectionBegin(){
		this.selectionWindow.fadeIn()
	}
	selectionEnd(){
		this.selectionWindow.fadeOut()
	}

	canSelectTile(tile, trainerIndex){
		// If currently selecting tiles, the player can override
		// when they are allowed to make choices.
		if (this.currentlySelecting.player === this.trainers[0]){
			return true
		}
		let canSelect = this.activePlayerIndex === trainerIndex
		&& this.state === "waiting"
		&& this.hasBegun
		&& !this.currentlySwappingPokemon

		if (this.moveQueue.length){
			if (this.currentlySelecting.type === "swap"){
				canSelect = false
			}
		}

		return canSelect
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

	applyGravity(){
		let now = Date.now()
		let duration = 300
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
					let anim = animTemplates["displace"](tile, tile.x, tile.y + spaceBelow, now, duration)
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
				this.board.changeLocation(tile, spot[0], spot[1])
			}
			this.addAnimation(animation)
		})
		let promise = Promise.all(promises)
		.then(() => this.timeStep())

		return promise
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
	moveToTopLayer(tile){
		let index = this.board.contents.indexOf(tile)
		this.board.contents.splice(index, 1)
		this.board.contents.push(tile)
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
		if (this.shouldIgnoreInput()) return
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
		if (this.shouldIgnoreInput()) return
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
		if (this.shouldIgnoreInput()) return
		if (this.selectedTile){
			if (this.tileSelectionType === "hold"){
				this.deselectTile(this.selectedTile)
			}
		}
	}
	shouldIgnoreInput(){
		if ($("#modal").hasClass("show")) return true
		if ($("#board").hasClass("showing-dialogue")) return true
		return false
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
	updateInitiative(trainerIndex, animate, duration=300){
		let tags = this.trainerTags[trainerIndex]
		let initiative = this.initiativeValues[trainerIndex]
		let max = this.maxInitiative
		let p = initiative / max
		let percent = (p * 100) + "%"
		let text = formatNumber(initiative)
		tags.initiativeBar.attr("data-width", percent)
		let oldTarget = tags.initiativeBar.attr("data-target")
		let needToAnimate = Number(oldTarget) !== initiative
		tags.initiativeBar.attr("data-target", initiative)
		if (!animate){
			tags.initiativeCurrent.text(text)
			tags.initiativeMax.text(max)
			tags.initiativeBar.css("width", percent)
		} else if (needToAnimate) {
			let oldInitiative = parseInt(tags.initiativeCurrent.text())
			animateTextCounter(oldInitiative, initiative, tags.initiativeCurrent, duration)

			let oldMax = parseInt(tags.initiativeMax.text())
			animateTextCounter(oldMax, max, tags.initiativeMax, duration)

			let availableWidth = tags.initiative.width()
			let curWidth = tags.initiativeBar.width()
			let newWidth = p * availableWidth
			let barFrom = {width: curWidth}
			let barTo = {width: newWidth}
			$(barFrom).animate(barTo, {
				duration: duration,
				step: function(){
					tags.initiativeBar.css("width", this.width)
				},
				complete: function(){
					tags.initiativeBar.css("width", newWidth)
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
	resetPokeballs(){
		const getPokeballPopoverContent = tag => {
			let pokeball = $(tag)
			let trainerIndex = pokeball.attr("data-trainer")
			trainerIndex = parseInt(trainerIndex)
			let pokemonIndex = pokeball.attr("data-pokemon")
			pokemonIndex = parseInt(pokemonIndex)
			let trainer = this.trainers[trainerIndex]
			let pokemonList = trainer.pokemon
			let pokemon = pokemonList[pokemonIndex]
			let popoverContent = pokemon.name
			if (trainerIndex === 0 && config.pokemonSwapOutInfo){
				popoverContent += `<br><span class='tiny-tutorial'>Swapping ends your turn.<br>It will enter with half the active pokemon's energy.</span>`
			}
			popoverContent = `<p class='text-center mb-0'>` + popoverContent + `</p>`
			return popoverContent
		}
		for (let trainerIndex = 0; trainerIndex < this.trainers.length; trainerIndex++){
			let tags = this.trainerTags[trainerIndex]
			let pokeballContainers = [...tags.pokeballContainers]
			if (trainerIndex === 0){
				pokeballContainers.reverse()
			}
			let trainer = this.trainers[trainerIndex]
			let pokemonList = trainer.pokemon
			for (let i = 0; i < 6; i++){
				let container = $(pokeballContainers[i])
				let pokeball = container.children(".pokeball")
				pokeball.popover('dispose')
				let pokemon = pokemonList[i]
				pokeball.attr("data-trainer", trainerIndex)
				pokeball.attr("data-pokemon", i)
				
				if (!pokemon) continue

				pokeball.off("click")
				if (trainerIndex === 0){
					pokeball.click(() => {
						this.beginToSwapPokemon(trainerIndex, pokemon)
					})
				}

				pokeball.popover({
					content: getPokeballPopoverContent,
					html: true,
					placement: "bottom",
					trigger: "hover"
				})
			}
		}
	}
	updatePokeballs(trainerIndex){
		let tags = this.trainerTags[trainerIndex]
		let pokeballContainers = [...tags.pokeballContainers]
		if (trainerIndex === 0) {
			pokeballContainers.reverse()
		}
		let trainer = this.trainers[trainerIndex]
		let pokemonList = trainer.pokemon
		for (let i = 0; i < 6; i++){
			let container = $(pokeballContainers[i])
			let pokeball = container.children(".pokeball")
			let pokemon = pokemonList[i]
			if (pokemon){
				pokeball.attr("src", "src/img/Poké_Ball_icon.png")
				pokeball.css({
					opacity: 1
				})
				let usable = isPokemonUsable(pokemon)
				pokeball.removeClass("unusable")
				pokeball.removeClass("active-pokeball")
				if (!usable){
					pokeball.addClass("unusable")
				} else if (pokemon === this.trainers[trainerIndex].activePokemon){
					pokeball.addClass("active-pokeball")
				} else {

				}
			} else {
				// pokeball.attr("src", "src/img/Poké_Ball_icon_empty.svg")
				pokeball.hide()
			}
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
		if (this.hasEnded) return
		// let now = Date.now()
		let animate = this.hasBegun
		for (let i = 0; i < this.trainers.length; i++){
			this.updateHealth(i, animate)
			this.updateInitiative(i, animate)
			this.updateEnergy(i, animate)
			this.updatePokemonMoves(i)
			this.updatePokeballs(i)
			this.updateStatusEffects(i)
		}
		
		this.updateConfirmButton()
		// console.trace("Update took", (Date.now() - now), "ms")
	}

	fillTrainerTags(tags, classname){
		tags.side = $(`#board .board-side-container${classname} .board-side`)
		tags.side.parent()[0].scroll(0, 0)
		tags.sideTop = tags.side.children(".board-side-top")
		tags.sideMiddle = tags.side.children(".board-side-middle")
		tags.sideBottom = tags.side.children(".board-side-bottom")
		tags.center = $("#board .board-center")

		tags.health = tags.sideTop.children(".health-bar")
		tags.health.css({opacity: "0"})
		tags.healthBar = tags.health.children(".bar")
		tags.healthText = tags.health.children("span")
		tags.healthCurrent = tags.healthText.children(".current-health")
		tags.healthCurrent.text(0)
		tags.healthMax = tags.healthText.children(".max-health")
		tags.healthMax.text(0)
		
		tags.initiative = tags.center.children(`.initiatives`).children(`.initiative${classname}`)
		tags.initiative.css({opacity: "0"})
		tags.initiativeBar = tags.initiative.children(".bar")
		tags.initiativeText = tags.initiative.children("span")
		tags.initiativeCurrent = tags.initiativeText.children(".current-initiative")
		tags.initiativeCurrent.text(0)
		tags.initiativeMax = tags.initiativeText.children(".max-initiative")
		tags.initiativeMax.text(this.maxInitiative)

		tags.pokemonSection = tags.sideTop.children(".avatar-pokemon-section")
		tags.pokemonName = tags.pokemonSection.children(".avatar-pokemon-name")
		tags.pokemonName.text("")
		tags.pokemonImageSection = tags.pokemonSection.children(".avatar-pokemon-image")
		tags.pokemonImage = tags.pokemonImageSection.children(".pokemon-image")
		tags.pokemonImage.attr("src", "")
		tags.pokeballImageSection = tags.pokemonSection.children(".avatar-pokeball-image")
		tags.pokeballImage = tags.pokeballImageSection.find(".pokeball-image")
		tags.trainerImageSection = tags.pokemonSection.children(".avatar-trainer-image-section")
		tags.trainerImageSection.attr("style", "")
		tags.trainerImage = tags.trainerImageSection.children(".trainer-image")
		tags.trainerImage.attr("src", "")
		tags.pokeballDisplay = tags.sideMiddle.children(".pokeball-display")
		tags.pokeballContainers = tags.pokeballDisplay.children().children(".pokeball-container")
		tags.pokemonStatusSection = tags.pokemonSection.children(".pokemon-status-effect-section")
		tags.pokemonStatusSection.empty()

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
		this.currentlySwappingPokemon = true

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

		first.then(() => {
			this.currentlySwappingPokemon = false
			resolvePromise()
		})
		return promise
	}
	sendOutPokemon(trainerIndex, pokemon){
		let tags = this.trainerTags[trainerIndex]
		let name = pokemon.name
		let pokemonId = pokemon.pokemonId
		let src = pokemon.getImage()
		let facing = pokemon.data.imageFacing
		let correctFacing = trainerIndex === 0 ? "right" : "left"
		tags.pokemonImage.attr("src", src)

		let trainer = this.trainers[trainerIndex]
		let oldActive = trainer.activePokemon
		trainer.activePokemon = pokemon

		//Remove any status effects from the old pokemon which are lost on swapping.
		let lostOnSwap = oldActive.statusEffects.filter(statusEffect => {
			return statusEffect.lostOnSwap
		})
		for (let statusEffect of lostOnSwap){
			oldActive.removeStatus(statusEffect)
		}

		//Transfer half of the old pokemon's energy into the new pokemon.
		if (oldActive !== pokemon){
			let energy = getEmptyEnergy()
			for (let color of colors){
				energy[color] = Math.floor(oldActive.energy[color] * 0.5)
				oldActive.energy[color] = 0
			}
			this.giveEnergy(energy, trainer, pokemon)
		}

		//Remove all iniative from the new pokemon
		this.initiativeValues[trainerIndex] = 0

		let cryUrl = pokemon.data.sounds.cry
		if (cryUrl){
			let cryName = `${pokemonId}-cry`
			loadSound(cryName, "cry", cryUrl)
			.then(() => playSound(cryName))

			this.promise.then(() => {
				unloadSound(cryName)
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
		this.resetPokeballs()
		this.updateEverything()
	}
	getPokemonPopoverContent(pokemon){
		let html = $("<div class='pokemon-stats'></div>")

		let name = pokemon.name
		if (name !== pokemon.data.name){
			let pokemonName = getLocaleString("name", lang, ["pokemon", pokemon.data.id])
			name += " the " + pokemonName
		}
		html.append(`<div class='name'>${name} (Lv. ${pokemon.level})</div>`)

		let stats = getStatsHTML(pokemon)
		html.append(stats)

		let mastery = getMasteryHTML(pokemon)
		html.append(mastery)

		return html.wrap('<p/>').parent().html()
	}
	beginToSwapPokemon(trainerIndex, pokemon){
		if (this.activePlayerIndex !== trainerIndex) return Promise.resolve()
		if (this.currentlyCarryingOutSwap) return Promise.resolve()
		if (this.moveQueue.length) return Promise.resolve()
		if (this.currentlySwappingPokemon) return Promise.resolve()
		if (this.trainers[0].activePokemon === pokemon) return Promise.resolve()
		let turn = this.turn
		let promise = this.animateSendOutPokemon(trainerIndex, pokemon)
		.then(() => {
			this.currentlyEndingTurn = true
			return this.turnEnd(turn)
		})
		return promise
	}

	getTrainerOfPokemon(pokemon){
		return this.trainers.find(trainer => trainer.pokemon.includes(pokemon))
	}

	resetPokemonMoves(){
		const onMouseEnter = event => {
			let tag = $(event.currentTarget)
			let trainerIndex = Number(tag.attr("data-trainer"))
			let pokemonIndex = Number(tag.attr("data-pokemon"))
			let moveIndex = Number(tag.attr("data-move"))
			let trainer = this.trainers[trainerIndex]
			let pokemon = trainer.pokemon[pokemonIndex]
			let move = pokemon.moves[moveIndex]
			let highlight = move.highlightOnHover
			if (highlight.type === "last-enemy-move"){
				let moveUseList = this.moveUseHistory
				moveUseList = moveUseList.filter(moveUseObj => {
					return moveUseObj.trainer !== trainer
				})
				if (moveUseList.length === 0) return
				let lastMoveUse = moveUseList[moveUseList.length - 1]
				let thatTrainer = lastMoveUse.trainer
				let thatPokemon = lastMoveUse.pokemon
				let thatMove = lastMoveUse.move
				let thatTrainerIndex = this.trainers.indexOf(thatTrainer)
				let thatPokemonIndex = thatTrainer.pokemon.indexOf(thatPokemon)
				let thatMoveIndex = thatPokemon.moves.indexOf(thatMove)
				//This is a jquery selection of both trainer's movelist tags.
				let toSearch = this.trainers.map(trainer => trainer.tags.moveList)
				.reduce((acc, v) => acc.add(v), $())
				let selector = ".move"
				selector += `[data-trainer=${thatTrainerIndex}]`
				selector += `[data-pokemon=${thatPokemonIndex}]`
				selector += `[data-move=${thatMoveIndex}]`
				let moveTag = toSearch.find(selector)
				let alreadyHighlit = toSearch.find(".move.highlight")
				alreadyHighlit.removeClass("highlight")
				moveTag.addClass("highlight")
				console.log(moveTag)
			}
		}
		const onMouseLeave = event => {
			let tag = $(event.currentTarget)
			let trainerIndex = Number(tag.attr("data-trainer"))
			let pokemonIndex = Number(tag.attr("data-pokemon"))
			let moveIndex = Number(tag.attr("data-move"))
			let trainer = this.trainers[trainerIndex]
			let pokemon = trainer.pokemon[pokemonIndex]
			let move = pokemon.moves[moveIndex]
			let highlight = move.highlightOnHover
			if (highlight.type === "last-enemy-move"){
				let toSearch = this.trainers.map(trainer => trainer.tags.moveList)
				.reduce((acc, v) => acc.add(v), $())
				let moveTags = toSearch.find(".move.highlight")
				moveTags.removeClass("highlight")
			}
		}
		for (let i = 0; i < this.trainers.length; i++){
			let trainer = this.trainers[i]
			let tags = this.trainerTags[i]
			tags.moves.forEach(tag => {
				$(tag).popover("hide")
				$(tag).remove()
			})
			tags.moves.length = 0
			let moveListTag = tags.moveList
			moveListTag.children().popover("dispose")
			moveListTag.empty()

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
				let type = move
				tag.attr("data-move-type", type)

				//The move Copycat (and maybe others) does something when you hover over it.
				if (move.highlightOnHover){
					tag.on("mouseenter", onMouseEnter)
					tag.on("mouseleave", onMouseLeave)
				}

				let popoverHTML = () => {
					let html = $(`<div class='move-popover'></div>`)
					let statLine = $(`<div class="d-flex flex-row-reverse justify-content-between stat-line">`)
					statLine.append(`<div class="move-recharge">
						<img src="src/img/recharge.png">
						<div class="count">${move.rechargeTurns}</div>
					</div>`)
					let power = this.getEffectivePower(trainer, pokemon, move)
					if (power || move.power){
						let powerTag = $(`<span class="move-power">Power: </span>`)
						statLine.append(powerTag)
						let powerVal = $(`<span class="val">${power}</span>`)
						powerTag.append(powerVal)
						if (power > move.power){
							powerVal.addClass("up")
							.prepend("<i class='bi bi-arrow-up'></i>")
						} else if (power < move.power){
							powerVal.addClass("down")
							.prepend("<i class='bi bi-arrow-down'></i>")
						}
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
			let cost = this.getEffectiveCost(thisTrainer, thisPokemon, thisMove)
			let energyCost = cost.energyCost ?? {}
			let payability = this.canPayCost(thisMove, trainerIndex, cost)
			let moveCostTag = moveTag.children(".move-cost")
			let costParts = moveCostTag.children(".cost-part")

			let type = thisMove.type
			moveTag.attr("data-move-type", type)
			
			let usable = true
			for (let i = 0; i < costParts.length; i++){
				let costTag = $(costParts).eq(i)
				let costType = costTag.attr("data-cost")
				let numberTag = costTag.children(".cost")
				let shownCost = Number(numberTag.html())
				let realCost = energyCost[costType]

				if (payability[costType]){
					
				} else {
					usable = false
				}

				if (realCost){
					costTag.children().show()
				} else {
					costTag.children().hide()
				}

				if (shownCost !== realCost){
					let animatingTowards = numberTag.attr("data-counter-target")
					animatingTowards = Number(animatingTowards)
					if (animatingTowards !== realCost){
						animateTextCounter(shownCost, realCost, numberTag)
						let color
						if (colors.includes(costType)){
							color = tileTypeColors[costType]
						} else {
							color = "white"
						}
						costTag.css("filter", `drop-shadow(0em 0em 0.5em ${color})`)
						delay(500).then(() => costTag.css("filter", ""))
					}
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

			//If the player's mouse is in the tag, pretend they just hovered it.
			if (thisMove.highlightOnHover){
				let onTag = isMouseSomewhereIn(moveTag)
				if (onTag){
					console.log(onTag)
					moveTag.trigger("mouseenter")
				}
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

	calculateEXPGained(){
		let enemyTrainer = this.trainers[1]
		let defeatedPokemon = enemyTrainer.pokemon
		.filter(p => !isPokemonUsable(p))
		let yourPokemon = this.trainers[0].pokemon
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

	removeAllStatusEffects(){
		for (let trainer of this.trainers){
			for (let pokemon of trainer.pokemon){
				let statusEffects = pokemon.statusEffects
				let statChanges = statusEffects.filter(s => {
					return s.type === "stat"
				})
				statChanges.forEach(statusEffect => {
					pokemon.removeStatus(statusEffect)
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
		let usablePokemon = getUsablePokemon(pokemon)
		this.activePokemon = usablePokemon[0]
		if (!this.activePokemon){
			console.warn("WEE OO WEE OO")
			console.trace()
		}
	}
}

let tilesFound = 0
class Board{
	constructor(width, height){
		this.width = width
		this.height = height
		this.contents = []
		this.locationMap = new Map()
		this.tileTypes = tileTypes
		this.tileWeights = {}
		for (let type of this.tileTypes){
			if (colors.includes(type)){
				this.tileWeights[type] = 1
			} else {
				this.tileWeights[type] = 0
			}
		}
		this.tileWeights.rainbow = 0.3

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

	mapKey(tile){
		let x = tile.x
		let y = tile.y
		return x+","+y
	}
	add(tile){
		let mapKey = this.mapKey(tile)
		this.locationMap.set(mapKey, tile)
		this.contents.push(tile)
	}
	remove(tile){
		let mapKey = this.mapKey(tile)
		let fromMap = this.locationMap.get(mapKey)
		
		let index = this.contents.indexOf(tile)
		if (index !== -1){
			let tile = this.contents[index]
			if (tile === fromMap){
				this.locationMap.delete(mapKey)
			} else {
				console.warn("A tile was in the wrong spot for the location map.")
			}
			this.contents.splice(index, 1)
			return true
		}
		return false
	}
	changeLocation(tile, x, y){
		let mapKey = x+","+y
		let map = this.locationMap
		let movedTile
		if (map.has(mapKey)){
			movedTile = map.get(mapKey)
		}

		let oldMapKey = this.mapKey(tile)
		let oldTile = map.get(oldMapKey)
		if (oldTile === tile){
			map.delete(oldMapKey)
		}

		tile.x = x
		tile.y = y
		map.set(mapKey, tile)
	}

	explodeTile(tile){
		let index = this.contents.indexOf(tile)
		if (index !== -1) {
			this.remove(tile)
			//Create a new tile at the top of the column to fill this one's space
			let column = this.getColumn(tile.x)
			let top = Math.min(-1, column[0].y - 1)
			let newTile = this.getNextTile(tile.x, top)
			this.add(newTile)
			return true
		}
		return false
	}

	fill(){
		let changesMade = 0
		let loops = 0
		let attempts = 0
		while (loops < 10){
			let missingCoordinates = this.getEmptyCoords()

			if (!missingCoordinates.length){
				break
			}

			attempts++
			// console.log(attempts, missingCoordinates)
			let choice = randomChoice(missingCoordinates)
			let index = missingCoordinates.indexOf(choice)
			missingCoordinates.splice(index, 1)
			let x = choice[0]
			let y = choice[1]
			let possibleTileTypes = this.tileTypes.map(type => type)
			let hypotheticalTiles = {}
			let tileWeights = this.tileWeights
			possibleTileTypes.forEach(type => {
				if (tileWeights[type] > 0){
					hypotheticalTiles[type] = new Tile(type, x, y)
				}
			})
			let acceptable = {}
			for (let type in hypotheticalTiles){
				let tile = hypotheticalTiles[type]
				let good = !this.wouldCreateMatch(tile)
				if (good){
					acceptable[type] = tile
				}
			}
			let acceptableTypes = Object.keys(acceptable)
			if (acceptableTypes.length){
				let tiles = []
				let weights = []
				acceptableTypes.forEach(type => {
					tiles.push(acceptable[type])
					weights.push(tileWeights[type])
				})
				let tile = weightedRandom(tiles, weights).item
				this.add(tile)
				changesMade++
			} else {
				let size = loops + 2
				let minX = x - (size * 0.5)
				let maxX = x + (size * 0.5)
				let minY = y - (size * 0.5)
				let maxY = y + (size * 0.5)
				let rectangle = this.getRectOfTiles(minX, maxX, minY, maxY)
				rectangle.forEach(t => this.remove(t))
			}

			//Are we out of possible places to put tiles?
			if (!missingCoordinates.length){
				//Well, maybe we messed up along the way.
				//Are there any matches we accidentally made?
				let remainingMatches = this.getAllMatches()
				if (remainingMatches.length){
					//Oof, we made some matches accidentally.
					//Alright, well remove 'em, and try again.
					//This list will probably contain like, 1-2 matches
					//in standard situations.
					remainingMatches.forEach(match => {
						match.forEach(tile => {
							this.remove(tile)
						})
					})
				}
				changesMade = 0
				loops++
			}
		}
	}

	getNextTile(x, y){
		let tileType = this.getRandomTileType()
		let tile = new Tile(tileType, x, y)
		return tile
	}
	getRandomTileType(){
		let weights = this.tileTypes.map(t => this.tileWeights[t])
		return weightedRandom(this.tileTypes, weights).item
	}

	findTileAt(x, y){
		tilesFound++
		let mapKey = x+","+y
		let usingMap = this.locationMap.get(mapKey)
		// let usingArr = this.contents.find(t => this.tileIsAt(t, x, y))
		// return usingArr

		return usingMap
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

	getEmptyCoords(){
		let coords = []
		for (let i = 0; i < this.width; i++){
			for (let j = 0; j < this.height; j++){
				let tile = this.findTileAt(i, j)
				if (!tile){
					coords.push([i, j])
				}
			}
		}
		return coords
	}

	getColumn(x){
		return this.contents.filter(t => t.x === x).sort((a, b) => a.y - b.y)
	}

	getBoundsOfSelection(tiles){
		let minX, maxX, minY, maxY
		for (let tile of tiles){
			if (!(tile.x >= minX)){
				minX = tile.x
			}
			if (!(tile.x <= maxX)){
				maxX = tile.x
			}
			if (!(tile.y >= minY)){
				minY = tile.y
			}
			if (!(tile.y <= maxY)){
				maxY = tile.y
			}
		}
		return [minX, maxX, minY, maxY]
	}
	getRectOfTilesIn(tiles){
		let selection = []
		let bounds = this.getBoundsOfSelection(tiles)
		let minX = bounds[0]
		let maxX = bounds[1]
		let minY = bounds[2]
		let maxY = bounds[3]

		let chooseable = this.tilesOnScreen()
		let toAdd = chooseable.filter(tile => {
			return tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY
		})
		toAdd.forEach(t => selection.push(t))
		return selection
	}
	getRectOfTiles(minX, maxX, minY, maxY){
		let contents = this.tilesOnScreen()
		return contents.filter(tile => {
			return tile.x >= minX && tile.x <= maxX &&
			tile.y >= minY && tile.y <= maxY
		})
	}
	getTilesFromOrigin(x, y, width, height, tiles){
		let contents = this.tilesOnScreen()
		let selection = this.getRectOfTilesIn(tiles)

		let changed = true
		while (changed){
			changed = false
			let bounds = this.getBoundsOfSelection(selection)
			let minX = bounds[0]
			let maxX = bounds[1]
			let minY = bounds[2]
			let maxY = bounds[3]
			let left = x - bounds[0]
			let right = bounds[1] - x
			let top = y - bounds[2]
			let bottom = bounds[3] - y
			let curWidth = left + right + 1
			let curHeight = top + bottom + 1
			
			if (curWidth < width){
				let addLeft = left < right ? true : right < left ? false : !!Math.round(Math.random())
				let newX
				if (addLeft){
					newX = minX - 1
					minX = newX
				} else {
					newX = maxX + 1
					maxX = newX
				}
				let newTiles = contents.filter(t => {
					return t.x === newX && !selection.includes(t) &&
					t.y >= minY && t.y <= maxY
				})
				if (newTiles.length){
					changed = true
				}
				newTiles.forEach(t => selection.push(t))
			}
			if (curHeight < height){
				let addTop = top < bottom ? true : bottom < top ? false : !!Math.round(Math.random())
				let newY
				if (addTop){
					newY = minY - 1
					minY = newY
				} else {
					newY = maxY + 1
					maxY = newY
				}
				let newTiles = contents.filter(t => {
					return t.y === newY && !selection.includes(t) &&
					t.x >= minX && t.x <= maxX
				})
				if (newTiles.length){
					changed = true
				}
				newTiles.forEach(t => selection.push(t))
			}
		}
		
		return selection
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
		// console.log(locationMap)
		let matches = []

		let tilesToCheck = [tile1, tile2]
		let oppositeTiles = [tile2, tile1]
		for (let i = 0; i < tilesToCheck.length; i++){
			let tileA = tilesToCheck[i]
			let tileB = oppositeTiles[i]

			let hypotheticalTile = new Tile(tileA.type, tileB.x, tileB.y)
			Object.keys(tileA).forEach(key => hypotheticalTile[key] = tileA[key])
			hypotheticalTile.x = tileB.x
			hypotheticalTile.y = tileB.y
			let theseMatches = this.getAllMatchesForTile(hypotheticalTile, [], [tileA])
			if (theseMatches.length){
				theseMatches.forEach(match => {
					let index = match.indexOf(hypotheticalTile)
					match.splice(index, 1, tileA)
					matches.push(match)
				})
			}
		}

		return matches
	}

	searchDirectionForMatches(tile, vector, hypotheticalTiles, excludedTiles){
		//This function pretends the tile is at the given
		//x,y coords if it's told to.
		let x = tile.x
		let y = tile.y
		hypotheticalTiles = hypotheticalTiles || []
		let previouslyConsidered = [tile]
		let allMatches = []
		let currentDiff = [0, 0]
		let matching = true
		while (matching){
			currentDiff.forEach((_, i) => currentDiff[i] += vector[i])
			let newX = x + currentDiff[0]
			let newY = y + currentDiff[1]
			let thatTile = hypotheticalTiles.find(tile => {
				return tile.x === newX && tile.y === newY
			})
			if (!thatTile){
				thatTile = this.findTileAt(newX, newY)
			}
			if (!thatTile){
				break
			}
			if (excludedTiles.includes(thatTile)){
				break
			}
			let match = previouslyConsidered.every(compareTile => {
				return compareTile.matchesWith(thatTile)
			})
			if (match){
				allMatches.push(thatTile)
				previouslyConsidered.push(thatTile)
			} else {
				break
			}
		}
		// console.log(allMatches)
		return allMatches
	}

	wouldCreateMatch(tile){
		//A tile would create a match if there's 2 consecutive tiles vertically from it
		//(or horizontally)
		let matches = this.getAllMatchesForTile(tile)
		if (matches.length){
			return true
		}
		return false
	}

	getAllMatchesForTile(tile, hypotheticalTiles, excludedTiles){
		//Returns a list like this:
		// [
		// 	[tile1, tile2, tile3],
		// 	[tile4, tile1, tile5]
		// ]
		// Where in this circumstance, this might be a T-shaped match.
		// The function *pretends* that <tile> is inside of the board's contents,
		// even if it isn't really.

		// All of the lists within the result will have length >=3,
		// because of that if statement near the end
		hypotheticalTiles = hypotheticalTiles || []
		excludedTiles = excludedTiles || []
		let allMatches = []
		for (let v of UNITVECTORS){
			let opposite = OPPOSITEVECTORS.get(v)
			
			let forwardMatchingTiles = this.searchDirectionForMatches(
				tile, v, hypotheticalTiles, excludedTiles
			)
			let matchSoFar = [tile].concat(forwardMatchingTiles)
			let lastTile = matchSoFar[matchSoFar.length - 1]
			let backwardsMatch = this.searchDirectionForMatches(
				lastTile, opposite, hypotheticalTiles.concat([tile]), excludedTiles
			)
			let matches = [lastTile].concat(backwardsMatch)

			if (matches.length >= 3){
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

	clearAllEffects(){
		this.contents.forEach(tile => {
			tile.statusEffects.length = 0
		})
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
		if (tile.type === "rainbow") return true
		if (this.type === "rainbow") return true
		return tile.type === this.type
	}

	getEnergyValue(){
		let energy = getTileEnergyValue(this)
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
	removeStatus(statusEffect){
		let index = this.statusEffects.indexOf(statusEffect)
		if (index !== -1){
			this.statusEffects.splice(index, 1)
		}
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
		let options = {}
		options.id = data.id
		options.level = data.level
		let isWild = !trainerData.name
		
		if ("isShiny" in data){
			options.isShiny = data.isShiny
		}
		//Only wild pokemon are allowed to have a chance to be shiny.
		else if (!isWild){
			options.isShiny = false
		}

		if (data.levelMin && data.levelMax){
			options.level = randomFrom(data.levelMin, data.levelMax)
		}
		if (data.activeMoves){
			options.activeMoves = data.activeMoves
		}
		if (data.name){
			options.name = data.name
		}
		let pokemon = new Pokemon(options.name, options.id, options)
		logPokemonAs("seen", pokemon)
		return pokemon
	})
	let enemy = new Trainer("Enemy", enemyPokemon, trainerData)

	//If there was a previous fight in this level, carry over the board
	//so that it remains there for this fight.
	let oldBoard
	if (gameRound){
		oldBoard = gameRound.board
	}

	gameRound = new Round(player, enemy, resolvePromise, oldBoard)
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
	let image1src = pokemon.getImage()
	let image2src = getPokemonImage(evolveTo, "large", pokemon.isShiny)
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
				let invert = interpolate(0, 0.02, bezierEase(p))
				brightness = brightness * brightness
				image1.css("filter", `invert(0.01) brightness(${brightness})`)
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
				let invert = interpolate(0, 0.02, bezierEase(p))
				image2.css("filter", `invert(0.01) brightness(${brightness})`)
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

function healAllPokemon(pokemonList){
	playSound("healing")
	let promises = []
	pokemonList.forEach(pokemon => {
		pokemon.fainted = false
		//Full health
		pokemon.hp = pokemon.maxhp
		//Remove all debuffs
		let debuffs = pokemon.statusEffects.filter(statusEffects => {
			let name = statusEffects.name
			let data = pokemonStatusData[name]
			return data && data.class === "debuff"
		})
		debuffs.forEach(statusEffect => {
			p.removeStatus(statusEffect)
		})

		promises.push(savePokemon(pokemon))
	})
	return Promise.all(promises)
}