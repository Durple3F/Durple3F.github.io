const pokemonMoveEffects = {
	"play-sound": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let name = effect.name
			let moveUseObj = options.moveUse
			let wait = effect.wait ?? false
			let p = playSound(`${moveUseObj.move.name}-${name}`)
			if (wait){
				p.then(() => resolve())
			} else {
				resolve()
			}
		}
	},
	"wait": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let duration = effect.duration ?? 0
			delay(duration).then(() => resolve())
		}
	},
	"swap-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection
			if (selection.length < 2) {
				resolve()
				return
			}
			let tile1 = selection[0]
			let tile2 = selection[1]
			let map = [
				[tile1, [tile2.x, tile2.y]],
				[tile2, [tile1.x, tile1.y]],
			]
			let animOptions = {
				callback: () => {
					game.applyLocationChanges(map)
					resolve()
				}
			}
			game.animateSwitchLocations(tile1, tile2, animOptions)
		}
	},
	"choose-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let promise = options.promise
			let target = options.target
			let count = params.count ?? 1
			let max = params.max ?? count
			let minWidth = params.minWidth ?? null
			let maxWidth = params.maxWidth ?? null
			let minHeight = params.minHeight ?? null
			let maxHeight = params.maxHeight ?? null
			game.currentlySelecting = {
				player: target,
				type: "tiles",
				min: count,
				max: max,
				minWidth: minWidth,
				maxWidth: maxWidth,
				minHeight: minHeight,
				maxHeight: maxHeight,
			}
			let textName = effect.text
			if (textName){
				let move = moveUseObj.move
				let message = getLocaleString(textName, lang, ["moves", move.name])
				game.currentlySelecting.message = message
			} else {
				let plural = count !== 1
				let localeId = plural ? "select-number-tiles-plural" : "select-number-tiles-single"
				let text = getLocaleString(localeId, lang)
				text = applyReplacements(text, [count])
				game.currentlySelecting.message = text
			}
			
			game.currentlySelecting.callback = () => {
				moveUseObj.info[effectIndex] = game.selectedTiles.map(t => t)
			}
			game.currentlySelecting.resolve = resolve
			game.currentlySelecting.promise = promise

			if (target !== game.trainers[0]) {
				game.waitUntilNoAnnouncements(() => {
					game.computerMakeSelection()
				})
			} else {
				let text = game.currentlySelecting.message
				gameRound.selectionWindow.find(".message").text(text)
				game.createAnnouncement("general", text)
				game.selectionBegin()
			}
		}
	},
	"shuffle-board": {
		execute: (resolve, effect, params, game, options) => {
			game.shuffleBoard()
				.then(() => resolve())
		}
	},
	"shuffle-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			game.shuffleTiles(selection)
				.then(() => resolve())
		}
	},
	"shift-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let xOffset = params.xOffset ?? 0
			let yOffset = params.yOffset ?? 0
			let board = game.board
			let width = board.width
			let height = board.height
			let tilesMovedOffscreen = []
			let locationMap = new Map()
			for (let tile of selection){
				// let x = (tile.x + xOffset) % game.board.width
				// let y = (tile.y + yOffset) % game.board.height
				let x = tile.x + xOffset
				let y = tile.y + yOffset
				if (x >= width || y >= height || x < 0 || y < 0){
					tilesMovedOffscreen.push(tile)
				}
				let location = [x, y]
				locationMap.set(tile, location)
			}

			let unfilledCoords = []
			selection.forEach(tile => {
				let x = tile.x
				let y = tile.y
				let other = selection.find(tile2 => {
					if (tile === tile2) return false
					let coord = locationMap.get(tile2)
					if (x === coord[0] && y === coord[1]){
						return true
					} else {
						return false
					}
				})
				if (!other){
					unfilledCoords.push([x, y])
				}
			})
			unfilledCoords.forEach(coord => {
				let startingX = coord[0] - xOffset
				let startingY = coord[1] - yOffset
				let tile = board.getNextTile(startingX, startingY)
				board.add(tile)
				locationMap.set(tile, coord)
			})
			console.log(unfilledCoords)

			game.animateMoveTiles(locationMap, 250)
			.then(() => {
				tilesMovedOffscreen.forEach(tile => {
					board.remove(tile)
				})
				resolve()
			})
		}
	},
	"end-turn": {
		execute: (resolve, effect, params, game, options) => {
			game.currentlyEndingTurn = true
			game.endMove(game.turn)
				.then(() => resolve())
		}
	},
	"damage": {
		delay: 400,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let damageOptions = {
				from: moveUseObj.pokemon,
				fromTrainer: moveUseObj.trainer,
				move: moveUseObj.move
			}

			if (params.toPokemon !== undefined) {
				let toPokemon = params.toPokemon
				let toTrainer = game.getTrainerOfPokemon(toPokemon)
				damageOptions.to = toPokemon
				damageOptions.toTrainer = toTrainer
			}

			if ("amount" in effect){
				damageOptions.damage = params.amount
			}
			if ("additivePower" in effect) {
				let additivePower = params.additivePower
				damageOptions.additionalPower = damageOptions.additionalPower ?? 0
				damageOptions.additionalPower += additivePower
			}
			if ("damageMult" in effect){
				damageOptions.damageMult = damageOptions.damageMult ?? 1
				damageOptions.damageMult *= effect.damageMult
			}
			if ("fixed" in effect){
				damageOptions.fixed = effect.fixed
			}

			let result = game.dealDamage(damageOptions)
			moveUseObj.info[effectIndex] = result.damageDealt
			resolve()
		}
	},
	"heal": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex

			let amount = params.amount ?? 0
			let min = params.min ?? 0
			if (amount < min) {
				amount = min
			}
			let damageOptions = {
				from: moveUseObj.pokemon,
				fromTrainer: moveUseObj.trainer,
				to: moveUseObj.pokemon,
				toTrainer: moveUseObj.trainer,
				move: moveUseObj.move
			}

			if (params.toPokemon) {
				let toPokemon = params.toPokemon
				let toTrainer = game.getTrainerOfPokemon(toPokemon)
				damageOptions.to = toPokemon
				damageOptions.toTrainer = toTrainer
			}

			damageOptions.damage = -amount
			damageOptions.fixed = true
			damageOptions.healing = true
			let result = game.dealDamage(damageOptions)
			moveUseObj.info[effectIndex] = result.damageDealt

			resolve()
		}
	},
	"recoil-percent": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex

			let damage = moveUseObj.pokemon.hp * effect.percent
			let damageOptions = {
				from: moveUseObj.pokemon,
				fromTrainer: moveUseObj.trainer,
				move: moveUseObj.move,
				to: moveUseObj.pokemon,
				toTrainer: moveUseObj.trainer,
				damage: damage
			}
			let result = game.dealDamage(damageOptions)
			moveUseObj.info[effectIndex] = result.damageDealt
			resolve()
		}
	},
	"get-hp": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = target.hp
			resolve(result)
		}
	},
	"get-stat": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let statName = effect.which ?? "attack"
			moveUseObj.info[effectIndex] = target.getStat(statName)
			resolve()
		}
	},
	"get-types": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			moveUseObj.info[effectIndex] = target.getEffectiveTypes()
			resolve()
		}
	},
	"apply-status-effect": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let target = options.target
			let statusEffect = window.structuredClone(effect.statusEffect)
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move
			
			target.addStatusEffect(statusEffect, trainer, pokemon, move)
			resolve(statusEffect)
		}
	},
	"apply-debuff": {
		execute: (resolve, effect, params, game, options) => {
			let debuff = window.structuredClone(effect.debuff)

			if (!("volatile" in debuff)){
				debuff.volatile = true
			}

			options.target.statusEffects.push(debuff)
			resolve()
		}
	},
	"remove-status-effect": {
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statusName = effect.statusName
			target.removeStatusesWithName(statusName)
			resolve()
		}
	},
	"remove-all-status-effects": {
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statusEffects = target.statusEffects
			for (let statusEffect of statusEffects){
				target.removeStatus(statusEffect)
			}
			resolve()
		}
	},
	"get-status-stacks": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statusName = effect.statusName
			let result = target.getStatuses(statusName).length
			resolve(result)
		}
	},
	"select-energy-colors": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let search = effect.search ?? "random"
			let count = params.count ?? 1
			let result = []

			if (count >= colors.length) {
				colors.forEach(c => result.push(c))
			} else if (search === "random") {
				let colorOptions = colors.map(c => c)
				for (let i = 0; i < count; i++) {
					let index = Math.floor(Math.random() * colorOptions.length)
					result.push(colorOptions[index])
					colorOptions.splice(index, 1)
				}
			} else if (search === "most-full") {
				let energy = target.energy
				let colorOptions = Object.keys(energy)
				shuffleArray(colorOptions)
				colorOptions.sort((a, b) => {
					return energy[a] < energy[b] ? 1 : energy[a] > energy[b] ? -1 : 0
				})
				colorOptions.slice(0, count).forEach(c => result.push(c))
			} else {
				console.warn("You never handled", search)
			}

			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"gain-energy": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let energyColors = params.colors ?? []
			let count = params.count ?? 1
			let amounts = params.amounts ?? null
			let result = {}

			if (amounts === null) {
				amounts = {}
				for (let color of colors) {
					amounts[color] = 0
					if (energyColors.includes(color)) {
						amounts[color] = count
					}
				}
			}

			result = game.giveEnergy(amounts, target, target.activePokemon)

			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"change-tile-weight": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let type = effect.tileType
			let factor = params.factor
			let add = params.add

			let old = game.board.tileWeights[type]
			if (add !== undefined) {
				game.board.tileWeights[type] += add
			}
			if (factor !== undefined) {
				game.board.tileWeights[type] *= factor
			}
			let change = game.board.tileWeights[type] - old

			moveUseObj.info[effectIndex] = change
			resolve()
		}
	},
	"select-random-tiles": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let count = params.count ?? 0
			let conditions = effect?.conditions ?? {}
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
				.filter(t => {
					if (conditions.notTypes) {
						let notTypes = conditions.notTypes
						if (notTypes.includes(t.type)) {
							return false
						}
					}
					return true
				})
			for (let i = 0; i < count; i++) {
				let canChoose = chooseable
					.filter(t => !chosenTiles.includes(t))
				if (canChoose.length === 0) break
				chosenTiles.push(randomChoice(canChoose))
			}
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"select-tiles": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let condition = effect.conditionExpression
			let args = effect.conditionArguments
			.map(index => {
				return moveUseObj.info[effectIndex + index]
			})
			let expression = applyReplacements(condition, args)
			let contents = game.board.tilesOnScreen()
			let chosenTiles = []
			for (let tile of contents) {
				let x = tile.x
				let y = tile.y
				let scope = {
					x: x, y: y
				}
				let result = math.evaluate(expression, scope)
				if (result) {
					chosenTiles.push(tile)
				}
			}
			resolve(chosenTiles)
		}
	},
	"select-row": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let y = params.y
			let contents = game.board.tilesOnScreen()
			let chosenTiles = []
			for (let tile of contents) {
				if (tile.y === y) {
					chosenTiles.push(tile)
				}
			}
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"select-column": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let x = params.x
			let contents = game.board.tilesOnScreen()
			let chosenTiles = []
			for (let tile of contents) {
				if (tile.x === x) {
					chosenTiles.push(tile)
				}
			}
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"select-all-tiles": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let contents = game.board.tilesOnScreen()
			resolve(contents)
		}
	},
	"expand-tile-selection": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let selection = params.selection ?? []
			let targetWidth = params.width ?? 1
			let targetHeight = params.height ?? 1
			let avgX = selection.map(t => t.x).reduce((acc, v, _, s) => acc + v / s.length, 0)
			let avgY = selection.map(t => t.y).reduce((acc, v, _, s) => acc + v / s.length, 0)
			let chosenTiles = game.board.getTilesFromOrigin(
				avgX, avgY,
				targetWidth, targetHeight, selection
			)

			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"apply-status-to-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let selection = effect.selection
			let status = effect.status
			let chosenTiles = []
			if (selection === "group") {
				let which = params.which
				which.forEach(t => chosenTiles.push(t))
			} else {
				console.warn("You never handled", selection)
			}
			chosenTiles.forEach(tile => {
				let color = moveUseObj.trainer === game.trainers[0] ? "friendly" : "enemy"
				let trainer = moveUseObj.trainer
				let pokemon = moveUseObj.pokemon
				let move = moveUseObj.move
				tile.addStatusEffect(status, trainer, pokemon, move, color)
			})
			resolve()
		}
	},
	"change-tile-type": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let selection = effect.selection
			let chosenTiles = []
			if (selection === "group") {
				let which = params.which
				which.forEach(tile => chosenTiles.push(tile))
			} else {
				console.warn("You never handled", selection)
			}
			chosenTiles.forEach(tile => {
				//TODO I wish this had an animation
				tile.type = effect.targetType
			})
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"count-tiles": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let result = game.board.countTiles(effect.options)
			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"remove-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			selection.forEach(tile => game.board.explodeTile(tile))
			if (selection.length) {
				game.increaseCascade()
			}
			game.applyGravity()
				.then(() => resolve())
		}
	},
	"get-tile-x": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let tile = params.tile
			let result = tile.x
			resolve(result)
		}
	},
	"get-tile-y": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let tile = params.tile
			let result = tile.y
			resolve(result)
		}
	},
	"get-board-height": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let result = game.board.height
			resolve(result)
		}
	},
	"get-board-width": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let result = game.board.width
			resolve(result)
		}
	},
	"get-all-swaps": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let result = game.board.getAllPotentialMoves()
			resolve(result)
		}
	},
	"perform-swap": {
		update: true,
		execute: (resolve, effect, params, game, options) => {
			let swap = params.swap
			let tile1 = swap[0]
			let tile2 = swap[1]
			let swapOptions = {
				// automated: true,
				noEndTurn: true,
			}
			let animation = game.animateSwitchLocations(tile1, tile2, swapOptions)
			animation.promise
			.then(() => game.timeStep())
			.then(() => resolve())
		}
	},
	"get-active-pokemon": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let result = target.activePokemon
			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"count-viable-pokemon": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let result = getUsablePokemon(target.pokemon).length
			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"get-viable-pokemon": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let result = getUsablePokemon(target.pokemon)
			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"is-active-pokemon-viable": {
		update: false,
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = isPokemonUsable(target.activePokemon)
			console.log(target, result)
			resolve(result)
		}
	},
	"choose-pokemon": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let list = params.pokemon
			let minChooseable = params.min ?? 1
			let maxChooseable = params.max ?? 1
			let message
			let moveName = moveUseObj.move.name
			let chooser = game.trainers.indexOf(target)
			let strategy = effect.strategy

			if (effect.message) {
				let messageId = effect.message
				message = getLocaleString(messageId, lang, ["moves", moveName], null)
			}
			if (!message) {
				message = getLocaleString("choose-pokemon", lang)
			}

			let choosePromise
			if (chooser === 0) {
				choosePromise = choosePokemon(message, list, minChooseable, maxChooseable)
			} else {
				choosePromise = game.computerChoosePokemon(list, strategy, minChooseable, maxChooseable)
			}

			choosePromise.then(chosenPokemon => {
				moveUseObj.info[effectIndex] = chosenPokemon
				resolve()
			})
		}
	},
	"swap-pokemon": {
		execute: (resolve, effect, params, game, options) => {
			let pokemon = params.pokemon
			let target = options.target
			let trainerIndex = game.trainers.indexOf(target)
			console.log(params, pokemon)

			let animation = game.animateSendOutPokemon(
				trainerIndex, pokemon
			)
			animation.then(() => resolve())
		}
	},
	"is-trainers-turn": {
		update: false,
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = game.activePlayerIndex === game.trainers.indexOf(target)
			resolve(result)
		}
	},
	"get-move": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveName = effect.moveName
			let result = pokemonMoveData[moveName]
			resolve(result)
		}
	},
	"get-move-name": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let move = params.move
			let result = move.name
			resolve(result)
		}
	},
	"get-last-move": {
		update: false,
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "none",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let moveUseList = game.moveUseHistory
			if (target){
				moveUseList = moveUseList.filter(moveUseObj => {
					return moveUseObj.trainer === target
				})
			}
			if (effect.except){
				moveUseList = moveUseList.filter(moveUseObj => {
					let move = moveUseObj.move
					return !game.doesThisApplyToMove(move, effect.except, undefined)
				})
			}
			let moveUseObj = moveUseList[moveUseList.length - 1]
			if (!moveUseObj){
				resolve(undefined)
				return
			}
			let result = moveUseObj.move
			resolve(result)
		}
	},
	//TODO this target does nothing
	"use-move": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let move = params.move
			let moveUseObj = options.moveUse
			let moveIndex = game.moveQueue.indexOf(moveUseObj)
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let newMoveUseObj = game.newMoveUseObj(
				trainer, pokemon, move, "effects"
			)
			if (moveIndex !== -1){
				game.moveQueue.splice(moveIndex + 1, 0, newMoveUseObj)
			} else {
				game.moveQueue.push(newMoveUseObj)
			}
			let newIndex = game.moveQueue.indexOf(newMoveUseObj)

			resolve(newIndex)
		}
	},
	"learn-move": {
		update: false,
		resetMoves: true,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let move = params.move
			//Result is whether the move was added to its active moves.
			let result = target.addActiveMove(move)
			resolve(result)
		}
	},
	"unlearn-move": {
		update: false,
		resetMoves: true,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let move = params.move
			target.lockMove(move.name)
			resolve()
		}
	},
	"get-move-list": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let moves = target.activeMoves
			let sort = effect.sort
			let exceptions = effect.except ?? []
			let result

			for (let exception of exceptions){
				let index = moves.findIndex(move => move.name === exception)
				if (index !== -1){
					moves.splice(index, 1)
				}
			}

			if (sort === "recharge"){
				result = moves.sort((move1, move2) => {
					let moveIndex1 = target.moves.indexOf(move1)
					let moveIndex2 = target.moves.indexOf(move2)
					let moveRecharge1 = target.moveUsage[moveIndex1].recharge
					let moveRecharge2 = target.moveUsage[moveIndex2].recharge
					return moveRecharge1 - moveRecharge2
				})
			} else {
				console.warn("Never handled", sort)
			}

			resolve(result)
		}
	},
	"change-move-cooldown": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let move = params.move
			let amount = params.amount ?? 0
			let index = target.moves.indexOf(move)
			let usage
			if (index !== -1){
				usage = target.moveUsage[index]
				usage.recharge += amount
			}

			resolve(usage.recharge)
		}
	},
	"multiply-energy": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let amounts = params.amounts ?? {}
			let scale = params.scale ?? 1
			let result = multiplyEnergies(amounts, scale)
			moveUseObj.info[effectIndex] = result
			resolve()
		}
	},
	"get-cascade": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let result = game.currentCascade
			console.log(result)
			resolve(result)
		}
	},
	"get-initiative": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let index = game.trainers.indexOf(options.target)
			moveUseObj.info[effectIndex] = game.initiativeValues[index]
			resolve()
		}
	},
	"set-initiative": {
		update: true,
		execute: (resolve, effect, params, game, options) => {
			let index = game.trainers.indexOf(options.target)
			let initiative = params.initiative
			game.initiativeValues[index] = Math.floor(initiative)
			resolve()
		}
	},
	"get-turns-active": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let result = options.target.turnsActive
			resolve(result)
		}
	},
	"get-pokemon-data": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let key = effect.key
			let result = options.target.gameRoundData[key]
			resolve(result)
		}
	},
	"get-element-from-list": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let list = params.list
			let index = params.index ?? 0
			let element

			if (!list) {
				console.error("I didn't get a list!", moveUseObj)
			} else {
				if (index in list) {
					element = list[index]
				} else {
					console.warn(
						"Tried to find an item at an index that didn't exist!",
						list, index
					)
				}
			}

			moveUseObj.info[effectIndex] = element
			resolve()
		}
	},
	"random-choice-from-list": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let list = params.list
			let index = params.index ?? 0
			let element

			if (!list) {
				console.error("I didn't get a list!", moveUseObj)
			} else {
				element = randomChoice(list)
			}

			resolve(element)
		}
	},
	"remove-element-from-list": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let list = params.list
			let element = params.element
			list = list.filter(v => v !== element)
			moveUseObj.info[effectIndex] = list
			resolve()
		}
	},
	"get-list-length": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let list = params.list
			moveUseObj.info[effectIndex] = list.length
			resolve()
		}
	},
	"get-side-number": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let trainers = game.trainers
			let trainer = options.moveUse.trainer
			let result = trainers[0] === trainer ? effect.left : effect.right
			resolve(result)
		}
	},
	"load-value": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val = effect.value ?? 0
			if (effect.index !== undefined) {
				val = moveUseObj.info[effect.index]
			}
			moveUseObj.info[effectIndex] = val
			resolve()
		}
	},
	"multiply-numbers": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = val1 * val2
			if (effect.round === "up"){
				val = Math.ceil(val)
			} else if (effect.round === "down"){
				val = Math.floor(val)
			} else if (effect.round === "round" || effect.round === true){
				val = Math.round(val)
			}
			resolve(val)
		}
	},
	"add-numbers": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = val1 + val2
			moveUseObj.info[effectIndex] = val
			resolve()
		}
	},
	"random-number": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let min = 0, max = 10
			let useArgs = effect.useArgs ?? false
			if (useArgs){
				min = params.min ?? min
				max = params.max ?? max
			} else {
				min = effect.min ?? min
				max = effect.max ?? max
			}
			let val = Math.floor(Math.random() * (max - min + 1)) + min
			moveUseObj.info[effectIndex] = val
			resolve()
		}
	},
	"jump-if-less-than": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 2]
			let against = params.against ?? moveUseObj.info[effectIndex - 1]
			if (test < against) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump-if-equal": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 2]
			let against = params.against ?? moveUseObj.info[effectIndex - 1]
			if (test === against) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump-if-includes": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 2]
			let against = params.against ?? moveUseObj.info[effectIndex - 1]
			//If something goes horribly wrong and test is not a list
			if (!test.includes) {
				console.warn("Uh oh! jump-if-includes didn't get an array!!!", test, against)
				resolve()
				return
			}
			if (test.includes(against)) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump-if-truthy": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 1]
			if (test) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			moveUseObj.nextEffectIndex = options.index
			resolve()
		}
	},
}
for (let effectType in pokemonMoveEffects) {
	let effect = pokemonMoveEffects[effectType]
	if (!effect.delay) {
		effect.delay = 0
	}
}