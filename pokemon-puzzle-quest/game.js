const caughtPokemon = []
const playerActivePokemon = []
const playerPCBoxes = []
let gameRound, gameBoard
let playerSaveId = null

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

		this.tickInterval = setInterval(tick, 1000 / frameRate)
	}

	loadResources(){
		//Find all the sounds that pokemon might play when they use moves & stuff.
		let moveList = []
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
			}
		}
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
			return this.turnStart()
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
			
			this.promise.then(() => this.savePlayerPokemon())
			.then(() => {
				this.resolveRound()
				resolve()
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
					let pokemon = this.computerChoosePokemon(pokemonCanSwapTo, "swap")
					this.animateSendOutPokemon(1, pokemon)
					.then(() => {
						resolve(over)
					})
				} else {
					//This is one of the ways the player can lose the game
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
					//This is one of the ways the player can lose the game
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
		} else if (this.currentlyReversingSwap){
			this.currentlyReversingSwap = false
		} else {
			this.timeStep()
			.then(() => this.endMove())
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
		this.giveEnergy(energy, activePokemon)

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

		//For now, let's just deal damage equal to the number of tiles matched.
		// let activePokemon = otherTrainer.activePokemon
		// let power = tiles.length
		// this.dealDamage({
		// 	fromTrainer: activeTrainer,
		// 	to: activePokemon,
		// 	power: power
		// })

		this.updateStats()
	}
	giveEnergy(energy, pokemon){
		pokemon.gainEnergy(energy)
	}

	beginMove(){
		this.matchesInCombo.length = 0
		this.currentlyCarryingOutSwap = true
	}

	endMove(){
		//This is where all of the end-of-move rewards can be done

		//Next turn
		this.turnEnd()
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
		return this.activePlayerIndex
	}

	timeStep(){
		let matches = this.board.getAllMatches()

		let promise = new Promise(resolve => {
			if (matches.length > 0){
				this.increaseCascade()
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
				.then(() => resolve())
			} else {
				this.applySpriteHighlights()
				resolve()
				this.updateEverything()
			}
		})

		return promise
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

		let board = this.board
		let contents = board.contents
		if (!document.hidden){
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
		}
		board.tick()
	}

	turnStart(){
		this.currentlyEndingTurn = false
		this.currentlyCarryingOutSwap = false
		this.resetCurrentlySelecting()
		this.resetCascade()

		//Reduce move cooldowns
		let trainer = this.trainers[this.activePlayerIndex]
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
		for (let tile of this.board.contents){
			let statusEffects = tile.statusEffects
			for (let status of statusEffects){
				let isEnemy = status.sourceTrainer !== trainer
				if (isEnemy && status.name === "Burn"){
					let damage = activePokemon.maxhp / 32
					this.dealDamage({
						from: status.sourcePokemon,
						fromTrainer: status.sourceTrainer,
						move: status.sourceMove,
						to: activePokemon,
						toTrainer: trainer,
						damage: damage
					})
				}
			}
		}

		let promise = this.checkForWinner()
		if (this.activePlayer === "enemy"){
			promise = promise.then(() => this.computerMakeMoves())
		}

		promise = promise.then(() => this.updateEverything())
		return promise
	}
	turnEnd(){
		let nextPlayer = this.getNextPlayer()
		if (nextPlayer !== this.activePlayerIndex){
			this.prepareToChangeTurns(nextPlayer)
		}

		this.currentlyReversingSwap = false
		this.updateStats()
		this.turn++
		
		if (this.hasBegun){
			if (this.activePlayer === "player"){
				this.turnStart()
			} else {
				this.waitUntilNoAnnouncements(() => {
					this.turnStart()
				})
			}
		}
	}

	showEndScreen(message){
		let resolvePromise
		let promise = new Promise(resolve => resolvePromise = resolve)

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
			let expText = `${expPastNewLevel} / ${expForNextLevel} EXP`
			pText.append(`<p>${expText}</p>`)
		}

		//TODO make this thing show the player's pokemon
		let pokemon = this.trainers[0].pokemon
		let body = modal.find(".modal-body")
		let container = $(`<div class='d-flex flex-wrap justify-content-between container'></div>`)
		for (let i = 0; i < pokemon.length; i++){
			let p = pokemon[i]
			let box = $(`<div class='col col-6'></div>`)
			let chooseable = $(`<div class='chooseable m-1'></div>`)
			chooseable.html(`
				<div class='row mb-3'>
					<div class='pokemon-text col d-flex flex-column justify-content-center'></div>
					<div class='col text-end'>
						<img class='pokemon-image' src='${p.data.imageSources[p.pokemonName]}'>
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

		for (let i = 0; i < pokemon.length; i++){
			let p = pokemon[i]
			let gained = toGive[p.uuid]
			if (gained){
				p.exp += gained
				p.recalculateLevel()
			}
			savePokemon(p)
		}

		modal.modal("show")
		btn.click(() => {
			modal.modal("hide")
		})
		modal.on("hidden.bs.modal", () => {
			resolvePromise()
		})
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

		promise = promise.then(() => {
			if (this.hasEnded) return
			delay(250).then(() => {
				if (this.activePlayer === "enemy"){
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
					let randomTile = randomChoice(this.board.contents)
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
		let allMoves = this.board.getAllPotentialMoves()
		//TODO score moves somehow. Right now it just picks a random one.
		if (allMoves.length){
			let bestMove = randomChoice(allMoves)
			this.animateSwitchLocations(bestMove[0], bestMove[1])
		} else {
			//There are no potential moves, just use Struggle instead
			let trainer = this.trainers[this.activePlayerIndex]
			let pokemon = trainer.activePokemon
			let struggle = pokemon.moves.find(m => m.name === "Struggle")
			this.beginToUseMove(trainer, pokemon, struggle)
		}
	}
	computerChoosePokemon(pokemon, reason){
		//TODO have the logic here be based on which reason they could be choosing stuff
		return pokemon[Math.floor(Math.random() * pokemon.length)]
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
			let trainerIndex = this.trainers.indexOf(attackerTrainer)
			let possibleMoves = this.getAvailableMoves(trainerIndex)
			move = possibleMoves[0]
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
		
		switch (effectType){
			case "play-sound": {
				let name = effect.name
				playSound(`${moveUseObj.move.name}-${name}`)
				resolvePromise()
			} break
			case "choose-tiles": {
				let count = effect.count ?? 1
				this.currentlySelecting = {
					type: "tiles",
					count: count
				}
				this.currentlySelecting.callback = () => {
					moveUseObj.info[effectIndex] = this.selectedTiles.map(t=>t)
				}
				this.currentlySelecting.resolve = resolvePromise
				this.currentlySelecting.promise = promise
				//TODO probably only make announcement on your turn
				this.createAnnouncement("general", `Select ${count} tiles`)
				if (this.activePlayer === "enemy"){
					this.waitUntilNoAnnouncements(() => {
						this.computerMakeSelection()
					})
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
				this.endMove()
				resolvePromise()
			} break
			case "damage": {
				let options = {
					from: moveUseObj.pokemon,
					fromTrainer: moveUseObj.trainer,
					move: moveUseObj.move
				}
				if (effect.additivePower){
					options.additionalPower = (options.additionalPower ?? 0)
					options.additionalPower += moveUseObj.info[effect.additivePower]
				}
				this.dealDamage(options)
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
			case "burn": {
				let chance = effect.chance ?? 1
				if (Math.random() <= chance){
					let otherTrainer = this.trainers[this.getOtherPlayer(this.activePlayerIndex)]
					let otherPokemon = otherTrainer.activePokemon
					otherPokemon.addStatusEffect("burn", moveUseObj.trainer, moveUseObj.pokemon, moveUseObj.move)
				}
				resolvePromise()
			} break
			case "select-random-tiles": {
				let count = params.count ?? 0
				let chosenTiles = []
				for (let i = 0; i < count; i++){
					let canChoose = this.board.contents.filter(t => !chosenTiles.includes(t))
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
				resolvePromise()
			} break
			case "count-tiles": {
				let result = this.board.countTiles(effect.options)
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
				let test = moveUseObj.info[effectIndex - 1]
				console.log(test, effect.value)
				if (test < effect.value){
					moveUseObj.nextEffectIndex = effect.jumpTo
				}
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
			} else {
				this.performMoveQueueCallbacks()
			}
			this.resetCascade()
			resolve()
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
		let playerTurn = this.activePlayer === "player"
		if (selectType === "tiles" && playerTurn){
			this.confirmButton.show()
		} else {
			this.confirmButton.hide()
		}
	}

	canSelectTile(tile, trainerIndex){
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
	
	animateSwitchLocations(tile1, tile2){
		let now = Date.now()
		let duration = 300

		let animation1 = animTemplates["displace"](tile1, tile2.x, tile2.y, now, duration)
		let animation2 = animTemplates["displace"](tile2, tile1.x, tile1.y, now, duration)
		let animation = getEmptyAnimationBatch()
		animation.batch.push(animation1)
		animation.batch.push(animation2)
		animation.callback = () => {
			this.swap(tile1, tile2)
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
		for (let tile of this.board.contents){
			tile.spriteHighlightTarget = 0
		}
		let allMoves = this.board.getAllPotentialMoves()
		for (let move of allMoves){
			for (let tile of move){
				tile.spriteHighlightTarget = 1
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
		statusTag.find("[data-toggle='popover']").popover("hide")
		statusTag.html("")
		let pokemon = this.trainers[trainerIndex].activePokemon
		for (let status of pokemon.statusEffects){
			let data = pokemonStatusData[status.name]
			if (data){
				let box = $(`<div class='status-effect-container'></div>`)
				let img = $(`<img class='status-effect' src='${data.image}'>`)
				img.css("background-color", data.color)
				img.popover({
					content: data.name,
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
		tags.pokemonImageSection = tags.pokemonSection.children(".avatar-pokemon-image")
		tags.pokemonImage = tags.pokemonImageSection.children(".pokemon-image")
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
				let width = pokemonSection.width()
				let facing = pokemon.data.imageFacing
				let directionMult = 1
				if (facing === "right" && trainerIndex === 0){
					directionMult = -1
				}
				let left = width * moveDirection * directionMult
				let rotate = -10 * directionMult
				pokemonTag.css({
					transition: "1s transform",
					transform: `rotate(${rotate}deg) translateX(${left}px)`
				})
				delay(1000).then(() => {
					resolve()
				})
			})
		} else {
			first = Promise.resolve()
		}

		if (animName){
			first = first.then(() => trainerAnimations[animName](trainerTag))
		}

		first.then(() => {
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
		.then(() => resolvePromise())
		return promise
	}
	sendOutPokemon(trainerIndex, pokemon){
		let tags = this.trainerTags[trainerIndex]
		let name = pokemon.name
		let pokemonName = pokemon.pokemonName
		let src = pokemon.data.imageSources[pokemonName]
		let facing = pokemon.data.imageFacing
		let correctFacing = trainerIndex === 0 ? "right" : "left"
		tags.pokemonImage.attr("src", src)

		let oldActive = this.trainers[trainerIndex].activePokemon
		this.trainers[trainerIndex].activePokemon = pokemon
		//Transfer half of the old pokemon's energy into the new pokemon.
		if (oldActive !== pokemon){
			let energy = getEmptyEnergy()
			for (let color of colors){
				energy[color] = Math.floor(oldActive.energy[color] * 0.5)
				oldActive.energy[color] = 0
			}
			this.giveEnergy(energy, pokemon)
		}

		let cry = pokemon.data.sounds.cry
		if (cry){
			loadSound(`${pokemonName}-cry`, "cry", cry)
			.then(() => playSound(`${pokemonName}-cry`))
		}

		if (facing !== correctFacing){
			tags.pokemonImageSection.addClass("flip")
		} else {
			tags.pokemonImageSection.removeClass("flip")
		}

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
		.then(() => {
			this.currentlySwappingPokemon = false
			this.currentlyEndingTurn = true
			this.turnEnd()
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

				tag.popover({
					content: move.description,
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

class Pokemon{
	constructor(name, pokemonName, options){
		this.uuid = options?.uuid ?? window.crypto.randomUUID()
		this.owner = options?.owner ?? playerSaveId
		this.name = name
		this.pokemonName = pokemonName ?? this.name
		this.data = pokemonData[this.pokemonName]
		this.types = []
		this.data.types.forEach(type => this.types.push(type))
		this.level = options?.level ?? 1

		this.nature = options?.nature ?? getRandomNature()

		this.ivs = {}
		this.evs = {}
		for (let stat in this.data.stats){
			if (options && options.ivs){
				this.ivs[stat] = options.ivs[stat] ?? Math.floor(Math.random() * 32)
			} else {
				this.ivs[stat] = Math.floor(Math.random() * 32)
			}

			if (options && options.evs){
				this.evs[stat] = options.evs[stat] ?? 0
			} else {
				this.evs[stat] = 0
			}
		}

		//Yikes this stuff is gonna be fun
		this.hp = this.getStat("hp")
		this.maxhp = this.getStat("hp")
		this.exp = options?.exp ?? this.getEXPNeededForLevel(this.level)

		this.learnset = this.data.learnset.map(move => move)
		this.moves = this.learnset.map(move => pokemonMoveData[move.name])
		this.movesUnlockedMap = []
		this.moveUsage = this.moves.map(move => {
			return {
				recharge: 0
			}
		})

		this.statusEffects = []

		//You can only have 4 moves active at once
		//TODO make the whole system for selecting which moves are active
		//For now it's just all of them
		this.activeMoves = []

		this.determineUnlockedMoves()
		
		this.energy = getEmptyEnergy()
		this.maxEnergy = getEmptyEnergy()
		colors.forEach(c => this.maxEnergy[c] = 10)

		this.pcBox = options?.pcBox ?? null
		this.pcBoxX = options?.pcBoxX ?? null
		this.pcBoxY = options?.pcBoxY ?? null
	}

	addStatusEffect(status, owner, pokemon, source){
		if (typeof status === "string"){
			switch (status){
				case "burn": {
					status = {
						name: "burn"
					}
				} break
				default:
					console.warn("You never handled", status)
					status = {
						name: "???"
					}
				break
			}
		}

		status.sourceMove = source
		status.sourcePokemon = pokemon
		status.sourceTrainer = owner

		let prevented = false
		if (status.name === "burn" && this.types.includes("Fire")){
			prevented = true
		}

		//There are some status effects that don't stack
		let data = pokemonStatusData[status.name]
		let existingCopies = this.statusEffects.filter(s => s.name === status.name)
		if (data && !data.stacks && existingCopies.length){
			prevented = true
		}

		if (!prevented){
			this.statusEffects.push(status)
		}
	}

	changeLevel(level){
		let oldMax = this.getStat("hp")
		this.level = level
		let newMax = this.getStat("hp")
		this.hp += newMax - oldMax
		this.determineUnlockedMoves()
	}

	getStat(stat){
		let base = this.data.stats[stat]
		let iv = this.ivs[stat]
		let ev = this.evs[stat]
		let level = this.level
		let initial = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100)
		if (stat === "hp"){
			let result = initial + level + 10
			return Math.floor(result)
		}
		let result = initial + 5
		let natureMult = 1
		if (this.nature.increase === stat) natureMult += 0.1
		if (this.nature.decrease === stat) natureMult -= 0.1
		result = Math.floor(result * natureMult)
		return result
	}

	getStatStage(stat){
		let stage = 0
		let statuses = this.statusEffects.filter(effect => {
			return effect.type === "stat" && effect.stat === stat
		})
		statuses.forEach(effect => {
			stage += effect.amount
		})
		return Math.max(-6, Math.min(6, stage))
	}

	getEffectiveStat(stat){
		let val = this.getStat(stat)
		//Apply any buffs/debuffs
		let stage = this.getStatStage(stat)
		let numerator = 2 + Math.max(0, stage)
		let denominator = 2 + Math.max(0, -stage)
		let modifier = numerator / denominator
		return val * modifier
	}

	determineUnlockedMoves(){
		this.movesUnlockedMap = this.learnset.map(move => {
			return checkIfPokemonMeetsRequirements(this, move.unlock)
		})

		//TODO gonna want to make this based on player choice later
		//(probably limit it to just 4 moves)
		this.activeMoves.length = 0
		this.moves.forEach((m, i) => {
			if (!this.movesUnlockedMap[i]) return
			this.activeMoves.push(m)
		})
	}

	gainEnergy(energy){
		for (let color in energy){
			this.gainEnergyColor(color, energy[color])
		}
	}
	gainEnergyColor(color, amount){
		this.energy[color] += amount
		if (this.energy[color] > this.maxEnergy[color]){
			this.energy[color] = this.maxEnergy[color]
		}
	}

	getEXPNeededForLevel(level){
		//Returns the *total* exp required to get to this level.
		//Currently just uses medium fast. Maybe I add others if I care. TODO.
		if (level === 1) return 0
		return Math.pow(level, 3)
	}
	getLevelFromEXP(exp){
		for (let i = 1; i <= 100; i++){
			if (exp < this.getEXPNeededForLevel(i)){
				return i - 1
			}
		}
		return 100
	}
	recalculateLevel(){
		this.level = this.getLevelFromEXP(this.exp)
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
		this.statusEffects.push(statusEffect)
	}
}

class TileStatus{
	constructor(status){
		this.spriteOpacity = 0

		for (let key in status){
			this[key] = status[key]
		}
	}

	tick(){
		this.spriteOpacity = lerp(this.spriteOpacity, 1, 0.1)
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
		return new Pokemon(data.pokemonName, data.pokemonName, data)
	})
	let enemy = new Trainer("Enemy", enemyPokemon, trainerData)
	gameRound = new Round(player, enemy, resolvePromise)
	gameBoard = gameRound.board

	return promise
}