const pokemonMoveEffects = {
	"play-sound": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let name = effect.name
			let moveUseObj = options.moveUse
			let wait = effect.wait ?? false
			let finalWait = effect.waitBeforeFinishMove ?? false
			let p = playSound(`${moveUseObj.move.name}-${name}`)

			if (finalWait){
				moveUseObj.additionalPromises.push(p)
			}

			if (wait){
				p.then(() => resolve())
			} else {
				resolve()
			}
		}
	},
	"do-nothing": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			resolve()
		}
	},
	"wait": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let duration = effect.duration ?? 0
			delay(duration).then(() => resolve())
		}
	},
	"trigger": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let key = effect.key
			let moveUseObj = options.moveUse
			let move = moveUseObj.move
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			
			//Pokemon with Sheer Force get no additional effects
			if (key === "additionalEffects" && pokemon.hasAbility("Sheer Force")){
				resolve()
				return
			}
			if (!move[key]){
				resolve()
				return
			}

			// moveUseObj.checkBetweenEffects = false
			game.triggerMoveEffects(
				trainer, pokemon, move, key
			).then(() => resolve())
			// console.log(game.moveQueue)
			// resolve()
		}
	},
	"swap-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection || []
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
			if (isNaN(count)){
				count = 1
			}
			let max = params.max ?? count
			let minWidth = params.minWidth ?? null
			let maxWidth = params.maxWidth ?? null
			let minHeight = params.minHeight ?? null
			let maxHeight = params.maxHeight ?? null
			let sameType = params.sameType ?? null
			game.currentlySelecting = {
				player: target,
				type: "tiles",
				min: count,
				max: max,
				minWidth: minWidth,
				maxWidth: maxWidth,
				minHeight: minHeight,
				maxHeight: maxHeight,
				sameType: sameType
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

			tilesMovedOffscreen.forEach(tile => {
				board.removeFade(tile, 250)
			})
			game.animateMoveTiles(locationMap, 250)
			.then(() => game.timeStep())
			.then(() => resolve())
		}
	},
	"move-tiles-in-random-directions": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let chooseable = game.board.tilesOnScreen()
			let swapping = []
			let alreadyChosen = []
			for (let tile of selection){
				swapping.push(tile)
			}
			for (let tile of swapping){
				let nearby = chooseable.filter(tile2 => {
					let dist = distance(tile.x, tile.y, tile2.x, tile2.y)
					return dist === 1 && !swapping.includes(tile2) && !alreadyChosen.includes(tile2)
				})
				if (nearby.length === 0) continue
				let chosen = randomChoice(nearby)
				alreadyChosen.push(chosen)
				let map = []
				map.push([tile, [chosen.x, chosen.y]])
				map.push([chosen, [tile.x, tile.y]])
				let animOptions = {
					callback: () => {
						game.applyLocationChanges(map)
						resolve()
					}
				}
				game.animateSwitchLocations(tile, chosen, animOptions)
			}
		}
	},
	"time-step": {
		execute: (resolve, effect, params, game, options) => {
			game.timeStep()
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
		delay: 200,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "opponent",
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move
			let damageOptions = {
				from: pokemon,
				fromTrainer: trainer,
				move: move,
				parentMove: moveUseObj.parentMove,
				directDamage: true
			}

			if (params.toPokemon !== undefined) {
				let toPokemon = params.toPokemon
				let toTrainer = game.getTrainerOfPokemon(toPokemon)
				damageOptions.to = toPokemon
				damageOptions.toTrainer = toTrainer
			} else {
				let toPokemon = options.target
				let toTrainer = game.getTrainerOfPokemon(toPokemon)
				damageOptions.to = toPokemon
				damageOptions.toTrainer = toTrainer
			}
			
			//If the defender has protect, the entire event of damage is prevented.
			if (
				damageOptions.to !== damageOptions.from &&
				damageOptions.to.hasStatus("protect") &&
				!game.shouldMoveHaveTag("goes-through-protect", trainer, pokemon, move)
			){
				return resolve(0)
			}

			if ("amount" in effect){
				damageOptions.damage = params.amount
			}
			if ("additivePower" in effect) {
				let additivePower = params.additivePower
				damageOptions.additionalPower = damageOptions.additionalPower ?? 0
				damageOptions.additionalPower += additivePower
			}
			if ("multiplicativePower" in effect) {
				let multiplicativePower = params.multiplicativePower
				damageOptions.multiplicativePower = damageOptions.additionalPower ?? 1
				damageOptions.multiplicativePower *= multiplicativePower
			}
			if ("damageMult" in effect){
				damageOptions.damageMult = damageOptions.damageMult ?? 1
				damageOptions.damageMult *= effect.damageMult
			}
			if ("fixed" in effect){
				damageOptions.fixed = effect.fixed
			}
			if ("finalImmunityCheck" in effect){
				damageOptions.finalImmunityCheck = effect.finalImmunityCheck
			}

			let result = game.dealDamage(damageOptions)
			resolve(result.damageDealt)
		}
	},
	"heal": {
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let toTrainer = game.getTrainerOfPokemon(target)

			let amount = params.amount ?? 0
			let min = params.min ?? 0
			if (amount < min) {
				amount = min
			}
			let damageOptions = {
				from: moveUseObj.pokemon,
				fromTrainer: moveUseObj.trainer,
				to: target,
				toTrainer: toTrainer,
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
	"recoil-damage": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let amount = params.amount
			let fixed = !!effect.fixed
			let pokemon = moveUseObj.pokemon

			//Rock Head prevents recoil
			if (pokemon.hasAbility("Rock Head")){
				resolve(0)
				return
			}

			let damage = amount
			let damageOptions = {
				from: pokemon,
				fromTrainer: moveUseObj.trainer,
				move: moveUseObj.move,
				to: pokemon,
				toTrainer: moveUseObj.trainer,
				damage: damage,
				fixed: fixed
			}

			if ("damageMult" in effect){
				damageOptions.damageMult = effect.damageMult
			}

			let result = game.dealDamage(damageOptions)
			resolve(result.damageDealt)
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
	"get-max-hp": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = target.maxhp
			resolve(result)
		}
	},
	"get-stat": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statName = effect.which ?? "attack"
			let result = target.getStat(statName)
			resolve(result)
		}
	},
	"get-stat-stage": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statName = effect.which ?? "attack"
			let result = target.getStatStage(statName)
			resolve(result)
		}
	},
	"get-stats-from-pokemon-list": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let list = params.list ?? []
			let statName = effect.which ?? "attack"
			let base = effect.base ?? false
			let result = []
			for (let pokemon of list){
				let val
				if (base){
					val = pokemon.getBaseStat(statName)
				} else {
					val = pokemon.getStat(statName)
				}
				result.push(val)
			}
			resolve(result)
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
	"get-weight": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = target?.data?.weight?.kilograms ?? 0
			resolve(result)
		}
	},
	"get-level": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = target.level
			resolve(result)
		}
	},
	"get-move-category": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let oldMove = effect.oldMove ?? true
			let moveUse = oldMove ? options.moveUse.oldMoveUse : options.moveUse
			let move = moveUse.move
			let category = getMoveCategory(move, moveUse.parentMove)
			resolve(category)
		}
	},
	"apply-status-effect": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = moveUseObj.effectIndex
			let target = options.target
			let statusEffect = window.structuredClone(effect.statusEffect)
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move

			if (effect.statusSettings){
				for (let setting of effect.statusSettings){
					let obj = statusEffect
					if ("path" in setting){
						for (let key of setting.path){
							obj = obj[key]
						}
					}
					let key = setting.key
					let value = moveUseObj.info[effectIndex + setting.value]
					obj[key] = value
				}
			}
			
			//If the defender has protect, the entire event is prevented so long as the debuff is visible.
			if (
				target !== pokemon &&
				["status", "stat"].includes(statusEffect.type) &&
				target.hasStatus("protect") &&
				!game.shouldMoveHaveTag("goes-through-protect", trainer, pokemon, move)
			){
				return resolve(statusEffect)
			}
			
			target.addStatusEffect(statusEffect, trainer, pokemon, move)

			if (
				(statusEffect === "paralyzed" || statusEffect === "poisoned") && 
				target.hasAbility("Synchronize")
			){
				let otherTrainer = game.trainers.find(t => t !== target.trainer)
				let otherPokemon = otherTrainer.activePokemon
				let status2 = window.structuredClone(statusEffect)
				otherPokemon.addStatusEffect(status2, trainer, pokemon, move)
			}

			resolve(statusEffect)
		}
	},
	"apply-status-effect-to-game": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let statusEffect = window.structuredClone(effect.statusEffect)
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move
			
			game.addStatusEffect(statusEffect, trainer, pokemon, move)
			resolve(statusEffect)
		}
	},
	"apply-debuff": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let debuff = window.structuredClone(effect.debuff)
			let target = options.target
			let trainer = moveUseObj.trainer
			let pokemon = moveUseObj.pokemon
			let move = moveUseObj.move
			
			//If the defender has protect, the entire event is prevented.
			if (
				target !== pokemon &&
				["status", "stat"].includes(debuff.type) &&
				target.hasStatus("protect") &&
				!game.shouldMoveHaveTag("goes-through-protect", trainer, pokemon, move)
			){
				return resolve()
			}

			target.addStatusEffect(debuff, trainer, pokemon, move)
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
	"has-any-status": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let targetClass = effect.targetClass
			let statuses = target.statusEffects.filter(statusEffect => {
				return statusEffect.type === "status"
			})
			if (targetClass){
				statuses = statuses.filter(statusEffect => {
					return statusEffect.class === targetClass
				})
			}
			let result = statuses.length > 0
			resolve(result)
		}
	},
	"get-status-gamedata": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let statusName = effect.statusName
			let status = target.getStatuses(statusName)[0]
			let key = effect.key
			let result = status.gameData[key]
			resolve(result)
		}
	},
	"get-energy": {
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = getEmptyEnergy()
			for (let color in result){
				result[color] = target.energy[color]
			}
			resolve(result)
		}
	},
	"select-energy-colors": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let search = effect.search ?? "random"
			let count = params.count ?? 1
			let notTypes = effect.notTypes ?? []
			let result = []
			let canPick = colors.map(c => c)
			.filter(color => !notTypes.includes(color))

			if (count >= canPick.length) {
				canPick.forEach(c => result.push(c))
			} else if (search === "random") {
				for (let i = 0; i < count; i++) {
					let index = Math.floor(Math.random() * canPick.length)
					result.push(canPick[index])
					canPick.splice(index, 1)
				}
			} else if (search === "most-full") {
				let energy = target.energy
				shuffleArray(canPick)
				canPick.sort((a, b) => {
					return energy[a] < energy[b] ? 1 : energy[a] > energy[b] ? -1 : 0
				})
				canPick.slice(0, count).forEach(c => result.push(c))
			} else if (search === "most-mastery") {
				let mastery = target.energyMastery
				shuffleArray(canPick)
				canPick.sort((a, b) => {
					return mastery[a] < mastery[b] ? 1 : mastery[a] > mastery[b] ? -1 : 0
				})
				canPick.slice(0, count).forEach(c => result.push(c))
			} else {
				console.warn("You never handled", search)
			}

			resolve(result)
		}
	},
	"gain-energy": {
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let target = options.target
			let pokemon = target.activePokemon
			let fromPokemon = moveUseObj.pokemon
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

			//Pokemon with Oblivious can't have their energy drained
			if (pokemon !== fromPokemon && pokemon.hasAbility("Oblivious")){
				for (let color in amounts){
					let amount = amounts[color]
					if (amount < 0){
						amounts[color] = 0
					}
				}
			}

			//Energy can't have a decimal component
			for (let color in amounts){
				let amt = amounts[color]
				if (amt % 1){
					let off = amt % 1
					if (Math.random() < off){
						amt = Math.ceil(amt)
					} else {
						amt = Math.floor(amt)
					}
				}
				amounts[color] = amt
			}

			result = game.giveEnergy(amounts, target, pokemon)
			resolve(result)
		}
	},
	"get-energy-capacities": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = {}

			for (let color of colors) {
				result[color] = target.maxEnergy[color] ?? 0
			}

			resolve(result)
		}
	},
	"get-energy-values": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = {}
			let colors = params.colors

			for (let color of colors) {
				result[color] = target.energy[color] ?? 0
			}
			console.log(result)
			resolve(result)
		}
	},
	"get-energy-value": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			let result = 0
			let color = params.color

			result = target.energy[color] ?? 0
			resolve(result)
		}
	},
	"multiply-energy": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let amounts = params.amounts ?? {}
			let scale = params.scale ?? 1
			let round = effect.round
			let result = multiplyEnergies(amounts, scale, round)
			resolve(result)
		}
	},
	"convert-energy": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let amounts = params.amounts ?? {}
			let ratios = effect.ratios ?? {}
			let result = getEmptyEnergy()
			
			let totalEnergy = 0
			for (let color in amounts){
				totalEnergy += amounts[color]
			}
			for (let color in ratios){
				result[color] = totalEnergy * ratios[color]
			}

			resolve(result)
		}
	},
	"get-total-energy": {
		update: false,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let target = options.target
			
			let totalEnergy = 0
			for (let color in target.energy){
				totalEnergy += target.energy[color]
			}

			resolve(totalEnergy)
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

			let old = game.board.baseTileWeights[type]
			if (add !== undefined) {
				game.board.baseTileWeights[type] += add
			}
			if (factor !== undefined) {
				game.board.baseTileWeights[type] *= factor
			}
			let change = game.board.baseTileWeights[type] - old

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
			if (conditions.types) {
				let types = conditions.types
				chooseable = chooseable.filter(t => {
					if (!types.includes(t.type)) {
						return false
					}
					return true
				})
			}
			if (conditions.notTypes) {
				let notTypes = conditions.notTypes
				chooseable = chooseable.filter(t => {
					if (notTypes.includes(t.type)) {
						return false
					}
					return true
				})
			}
			
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
	"select-tiles-diagonal-to": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
			let maxDistance = effect.maxDistance ?? 1
			let includeOriginal = effect.includeOriginal ?? false

			chosenTiles = chooseable.filter(tile => {
				let tx1 = tile.x
				let ty1 = tile.y
				return selection.some(tile2 => {
					let dx = Math.abs(tx1 - tile2.x)
					let dy = Math.abs(ty1 - tile2.y)
					return dx === dy && dx <= maxDistance && dx > 0
				})
			})
			if (includeOriginal){
				chosenTiles = chosenTiles.concat(selection)
			}
			chosenTiles = noDuplicates(chosenTiles)
			
			resolve(chosenTiles)
		}
	},
	"select-tiles-orthogonally-adjacent-to": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
			let maxDistance = effect.maxDistance ?? 1
			let includeOriginal = effect.includeOriginal ?? false

			chosenTiles = chooseable.filter(tile => {
				let tx1 = tile.x
				let ty1 = tile.y
				return selection.some(tile2 => {
					let dx = Math.abs(tx1 - tile2.x)
					let dy = Math.abs(ty1 - tile2.y)
					return dx + dy === 1 
				})
			})
			if (includeOriginal){
				chosenTiles = chosenTiles.concat(selection)
			}
			chosenTiles = noDuplicates(chosenTiles)
			
			resolve(chosenTiles)
		}
	},
	"select-tiles-between": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
			let tileA = selection[0]
			let tileB = selection[1]
			if (!tileA || !tileB){
				resolve(chosenTiles)
				return
			}
			let A = [tileA.x, tileA.y]
			let B = [tileB.x, tileB.y]
			let AB = subtractVectors(B, A)
			let ABDot = dotProduct(AB, AB)

			chooseable.forEach(tile => {
				let P = [tile.x, tile.y]
				let AP = subtractVectors(P, A)
				let t = (dotProduct(AP, AB) / ABDot)
				t = Math.max(0, Math.min(1, t))
				let closest = addVectors(A, scaleVector(t, AB))
				let cx = closest[0]
				let cy = closest[1]
				let dist = distance(cx, cy, tile.x, tile.y)
				if (dist < 0.7){
					chosenTiles.push(tile)
				}
			})
			
			resolve(chosenTiles)
		}
	},
	"select-tiles-around-given-tile": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
			let diffs = effect.diffs
			let includeOriginal = effect.includeOriginal ?? true

			console.log(selection)
			
			for (let tile of selection){
				let x = tile.x
				let y = tile.y
				for ( let diff of diffs){
					let seekX = x + diff[0]
					let seekY = y + diff[1]
					let toAdd = chooseable.filter(t => {
						return t.x === seekX && t.y === seekY
					})
					toAdd.forEach(t => chosenTiles.push(t))
				}
			}
			if (includeOriginal){
				selection.forEach(t => chosenTiles.push(t))
			}
			chosenTiles = noDuplicates(chosenTiles)
			
			resolve(chosenTiles)
		}
	},
	"select-tiles-with-expression": {
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
			let width = game.board.width
			let height = game.board.height
			let contents = game.board.tilesOnScreen()
			let chosenTiles = []
			for (let tile of contents) {
				let x = tile.x
				let y = tile.y
				let scope = {
					x: x, y: y,
					cx: x + 0.5,
					cy: y + 0.5,
					w: width,
					h: height,
					cw: (width * 0.5) + 0.5,
					ch: (height * 0.5) + 0.5
				}
				let result = math.evaluate(expression, scope)
				if (result) {
					chosenTiles.push(tile)
				}
			}
			resolve(chosenTiles)
		}
	},
	"select-tiles-with-status": {
		update: false,
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let chosenTiles = []
			let chooseable = game.board.tilesOnScreen()
			let statusName = effect.statusName
			let sourceTrainerName = effect.sourceTrainer
			let sourceTrainer
			if (sourceTrainerName === "target"){
				sourceTrainer = options.target
			}
			
			chosenTiles = chooseable.filter(tile => {
				return tile.hasStatus(statusName)
			})
			if (sourceTrainer){
				chosenTiles = chosenTiles.filter(tile => {
					let statuses = tile.getStatuses(statusName)
					return statuses.some(statusEffect => statusEffect.sourceTrainer === sourceTrainer)
				})
			}
			chosenTiles = noDuplicates(chosenTiles)
			
			resolve(chosenTiles)
		}
	},
	"select-tiles-at": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let x = params.x
			let y = params.y
			let contents = game.board.tilesOnScreen()
			let chosenTiles = contents.filter(tile => {
				return tile.x === x && tile.y === y
			})
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
			if ("targetType" in effect){
				contents = contents.filter(tile => tile.type === effect.targetType)
			}
			resolve(contents)
		}
	},
	"select-similar-tiles-surrounding": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let contents = game.board.tilesOnScreen()
			let result = []
			let toCheck = [].concat(selection)
			while (toCheck.length){
				let tile = toCheck.shift()
				result.push(tile)
				let nearby = contents.filter(t => {
					if (result.includes(t)) return false
					if (toCheck.includes(t)) return false
					if (tile.type !== t.type) return false
					let dx = Math.abs(tile.x - t.x)
					let dy = Math.abs(tile.y - t.y)
					return dx <= 1 && dy <= 1
				})
				if (nearby){
					nearby.forEach(t => toCheck.push(t))
				}
			}
			resolve(result)
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
	"combine-selections": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let selection1 = params.selection1 ?? []
			let selection2 = params.selection2 ?? []
			let result = selection1.concat(selection2)
			resolve(result)
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
	"remove-status-from-all-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let trainer = moveUseObj.trainer
			let selection = game.board.tilesOnScreen()
			let statusName = effect.statusName
			let exceptFriendlyStatuses = effect.exceptFriendlyStatuses ?? false
			selection.forEach(tile => {
				let statusEffects = tile.statusEffects
				let toRemove = []
				for (let statusEffect of statusEffects){
					if (exceptFriendlyStatuses){
						if (statusEffect.trainer !== trainer && statusName === statusEffect.name){
							toRemove.push(statusEffect)
						}
						continue
					}
					if (statusName === statusEffect.name){
						toRemove.push(statusEffect)
					}
				}
				toRemove.forEach(statusEffect => {
					tile.removeStatus(statusEffect)
				})
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
				if (tile.type !== effect.targetType){
					let copy = new Tile(tile.type, tile.x, tile.y, tile.power)
					game.board.fakeContents.push(copy)
					game.board.fadeOut(copy)
				}
				tile.type = effect.targetType
			})
			moveUseObj.info[effectIndex] = chosenTiles
			resolve()
		}
	},
	"empower-tiles": {
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection
			selection.forEach(tile => {
				//TODO I wish this had an animation
				if (tile.power !== 1){
					let copy = new Tile(tile.type, tile.x, tile.y, tile.power)
					game.board.fakeContents.push(copy)
					game.board.fadeOut(copy)
				}
				tile.power = 1
			})
			resolve(selection)
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
		update: true,
		execute: (resolve, effect, params, game, options) => {
			let selection = params.selection ?? []
			let cascade = effect.cascade ?? true
			let animationSpeed = effect.animationSpeed ?? 1
			selection.forEach(tile => game.board.explodeTile(tile))
			if (selection.length && cascade) {
				game.increaseCascade()
			}
			game.applyGravity(false, animationSpeed)
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
	"get-board-width": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let board = game.board
			resolve(board.width)
		}
	},
	"get-board-height": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let board = game.board
			resolve(board.height)
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
	"get-next-viable-pokemon": {
		update: false,
		hasTarget: true,
		targetType: "trainer",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let target = options.target
			let activePokemon = target.activePokemon
			let viable = getUsablePokemon(target.pokemon)
			let result
			if (viable.length > 1){
				result = viable.find(p => {
					return p !== activePokemon && target.pokemon.indexOf(p) > target.pokemon.indexOf(activePokemon)
				})
				if (!result){
					result = viable[0]
				}
			}

			resolve(result)
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
		update: true,
		execute: (resolve, effect, params, game, options) => {
			let pokemon = params.pokemon
			let target = options.target
			let activePokemon = target.activePokemon
			let trainerIndex = game.trainers.indexOf(target)
			console.log(params, pokemon)
			let batonPass = effect.batonPass
			let statusEffectsFromOld, statusEffectsFromNew
			if (batonPass){
				statusEffectsFromOld = activePokemon.statusEffects.filter(statusEffect => {
					return !statusEffect.lostOnBatonPass
				})
				statusEffectsFromNew = pokemon.statusEffects.filter(statusEffect => {
					return !statusEffect.lostOnBatonPass
				})
			}

			let animation = game.animateSendOutPokemon(
				trainerIndex, pokemon, undefined, {keepEnergy: effect.keepEnergy}
			)
			animation.then(() => {
				if (batonPass){
					statusEffectsFromOld.forEach(statusEffect => {
						pokemon.addStatusEffect(
							statusEffect,
							statusEffect.sourceTrainer,
							statusEffect.sourcePokemon,
							statusEffect.sourceMove
						)
						activePokemon.removeStatus(statusEffect)
					})
					statusEffectsFromNew.forEach(statusEffect => {
						activePokemon.addStatusEffect(
							statusEffect,
							statusEffect.sourceTrainer,
							statusEffect.sourcePokemon,
							statusEffect.sourceMove
						)
						pokemon.removeStatus(statusEffect)
					})
				}
				
				resolve()
			})
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
			// let newMoveUseObj = game.newMoveUseObj(
			// 	trainer, pokemon, move, "effects"
			// )
			// if (moveIndex !== -1){
			// 	game.moveQueue.splice(moveIndex + 1, 0, newMoveUseObj)
			// } else {
			// 	game.moveQueue.push(newMoveUseObj)
			// }
			game.beginToUseMove(trainer, pokemon, move)
			resolve()
			// let newIndex = game.moveQueue.indexOf(newMoveUseObj)

			// resolve(newIndex)
		}
	},
	"reset-moves": {
		update: false,
		resetMoves: true,
		hasTarget: true,
		targetType: "pokemon",
		targetDefault: "user",
		execute: (resolve, effect, params, game, options) => {
			resolve()
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
			target.lockMove(move.name, true)
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
	"is-z-move": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			resolve(moveUseObj.isZMove)
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
			let trainer = options.target
			let pokemon = trainer.activePokemon
			let index = game.trainers.indexOf(trainer)
			let oldInitiative = game.initiativeValues[index]
			let initiative = Math.floor(params.initiative ?? 0)
			let change = initiative - oldInitiative
			let prevented = false

			if (change < 0 && pokemon.hasAbility("Inner Focus")){
				prevented = true
			}

			if (!prevented){
				game.initiativeValues[index] = initiative
			}

			//Pokemon with Steadfast get a stat boost on having their initiative lowered
			if (change < 0 && pokemon.hasAbility("Steadfast")){
				pokemon.addStatusEffect({
					name: "steadfast-sped-up",
					type: "stat",
					volatile: true,
					class: "debuff",
					stat: "speed",
					amount: 1
				}, trainer, pokemon, undefined)
			}

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
			let list = params.list
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
	"add-element-to-list": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let list = []
			if (params.list){
				params.list?.forEach(element => list.push(element))
			}
			let element = params.element
			if (element){
				list.push(element)
			}
			resolve(list)
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
			let useParams = effect.useParams
			let result
			if (useParams){
				result = trainers[0] === trainer ? params.left : params.right
			} else {
				result = trainers[0] === trainer ? effect.left : effect.right
			}
			resolve(result)
		}
	},
	"log-value": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val = moveUseObj.info[effectIndex - 1]
			console.log(val, moveUseObj)
			resolve(val)
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
	"save-variable": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let variables = moveUseObj.variables
			let name = effect.name
			let val = params.save
			variables[name] = val
			resolve(val)
		}
	},
	"load-variable": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let variables = moveUseObj.variables
			let name = effect.name
			let val = variables[name]
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
			resolve(val)
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
	"divide-numbers": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = val1 / val2
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
	"min": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = Math.min(val1, val2)
			resolve(val)
		}
	},
	"max": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let val1 = moveUseObj.info[effectIndex - 2]
			let val2 = moveUseObj.info[effectIndex - 1]
			let val = Math.max(val1, val2)
			resolve(val)
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
	"jump-if-greater-than-or-equal-to": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 2]
			let against = params.against ?? moveUseObj.info[effectIndex - 1]
			if (test >= against) {
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
	"jump-if-falsy": {
		update: false,
		execute: (resolve, effect, params, game, options) => {
			let moveUseObj = options.moveUse
			let effectIndex = options.effectIndex
			let test = params.test ?? moveUseObj.info[effectIndex - 1]
			if (!test) {
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