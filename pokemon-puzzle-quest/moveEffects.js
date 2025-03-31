const pokemonMoveEffects = {
	"play-sound": {
		delay: 250,
		execute: (resolve, effect, params, game, options) => {
			let name = effect.name
			let moveUseObj = options.moveUse
			playSound(`${moveUseObj.move.name}-${name}`)
			delay(100).then(() => resolve())
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
			game.currentlySelecting = {
				player: target,
				type: "tiles",
				count: count
			}
			game.currentlySelecting.callback = () => {
				moveUseObj.info[effectIndex] = game.selectedTiles.map(t => t)
			}
			game.currentlySelecting.resolve = resolve
			game.currentlySelecting.promise = promise

			if (target === game.trainers[1]) {
				game.waitUntilNoAnnouncements(() => {
					game.computerMakeSelection()
				})
			} else {
				let plural = count !== 1
				let localeId = plural ? "select-number-tiles-plural" : "select-number-tiles-single"
				let text = getLocaleString(localeId, lang)
				text = text.replaceAll("%c", count)
				game.createAnnouncement("general", text)
			}
		}
	},
	"shuffle-board": {
		execute: (resolve, effect, params, game, options) => {
			game.shuffleBoard()
				.then(() => resolve())
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

			if (effect.additivePower !== undefined) {
				let additivePower = params.additivePower ?? 0
				damageOptions.additionalPower = damageOptions.additionalPower ?? 0
				damageOptions.additionalPower += additivePower
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
	"apply-debuff": {
		execute: (resolve, effect, params, game, options) => {
			let debuff = effect.debuff
			options.target.statusEffects.push(debuff)
			resolve()
		}
	},
	"get-stat": {
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
			let statusEffect = effect.statusEffect
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move
			target.addStatusEffect(statusEffect, trainer, pokemon, move)
			resolve()
		}
	},
	"remove-status-effect": {
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statusName = effect.statusName
			target.removeStatus(statusName)
			resolve()
		}
	},
	"select-energy-colors": {
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
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"expand-tile-selection": {
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
	"get-board-height": {
		execute: (resolve, effect, params, game, options) => {
			let result = game.board.height
			resolve(result)
		}
	},
	"get-board-width": {
		execute: (resolve, effect, params, game, options) => {
			let result = game.board.width
			resolve(result)
		}
	},
	"get-active-pokemon": {
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
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let result = getUsablePokemon(target.pokemon)
			moveUseObj.info[effectIndex] = result
			resolve()
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
	"multiply-energy": {
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
	"get-initiative": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let index = game.trainers.indexOf(target)
			moveUseObj.info[effectIndex] = game.initiativeValues[index]
			resolve()
		}
	},
	"set-initiative": {
		execute: (resolve, effect, params, game, options) => {
			let index = game.trainers.indexOf(target)
			let initiative = params.initiative
			game.initiativeValues[index] = Math.floor(initiative)
			resolve()
		}
	},
	"get-element-from-list": {
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
	"remove-element-from-list": {
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
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let list = params.list
			moveUseObj.info[effectIndex] = list.length
			resolve()
		}
	},
	"load-value": {
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
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = val1 * val2
			moveUseObj.info[effectIndex] = val
			resolve()
		}
	},
	"add-numbers": {
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
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let min = 0, max = 10
			let useArgs = effect.useArgs ?? false
			if (useArgs){
				let min = params.min ?? min
				let max = params.max ?? max
				console.log(min, max)
			} else {
				let min = effect.min ?? min
				let max = effect.max ?? max
			}
			let val = Math.floor(Math.random() * (max - min + 1)) + min
			moveUseObj.info[effectIndex] = val
			resolve()
		}
	},
	"jump-if-less-than": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = moveUseObj.info[effectIndex - 2]
			let against = moveUseObj.info[effectIndex - 1]
			if (test < against) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump-if-equal": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = moveUseObj.info[effectIndex - 2]
			let against = moveUseObj.info[effectIndex - 1]
			if (test === against) {
				moveUseObj.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump-if-includes": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = moveUseObj.info[effectIndex - 2]
			let against = moveUseObj.info[effectIndex - 1]
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
	"jump": {
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