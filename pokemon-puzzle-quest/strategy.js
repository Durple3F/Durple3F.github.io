const moveUseStrategy = {
	"do-nothing": {
		chooseWeight: options => {
			//Determine the weight of doing nothing by
			//adding up how much we'd like to do all the other
			//things we could do if we wait.
			let favoriteMove
			let favoriteMoveWeight = 0
			let payableMoves = options.payableMoves
			let unpayableMoves = options.unpayableMoves
			unpayableMoves.concat(payableMoves).forEach(action => {
				let weight = 0
				if (options.allowRecursion){
					weight = getActionWeightSimple(action, options, false)
				} else {
					//This gets infinitely recursive fast
				}

				if (favoriteMoveWeight < weight){
					favoriteMove = action
					favoriteMoveWeight = weight
				}
			})

			//If our favorite move is one of the payable ones,
			//we probably shouldn't do nothing right now.
			if (payableMoves.includes(favoriteMove)){
				return 0
			}

			//Although, if there are moves we can use right now,
			//that wouldn't prevent us from using other moves,
			//we can use those.
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let energyYouHave = pokemon.energy
			let resultWeight = favoriteMoveWeight
			if (favoriteMove){
				let favoriteCost = game.getEffectiveCost(trainer, pokemon, favoriteMove).energyCost
				for (let action of payableMoves){
					let hypotheticalEnergy = addEnergies(energyYouHave, getEmptyEnergy())
					let cost = game.getEffectiveCost(trainer, pokemon, action).energyCost
					let becameBelow = false
					for (let color in cost){
						if (!favoriteCost[color]) continue
						if (
							hypotheticalEnergy[color] - cost[color] < favoriteCost[color] &&
							hypotheticalEnergy[color] >= favoriteCost[color]
						){
							becameBelow = true
							break
						}
					}
					if (!becameBelow){
						resultWeight = 0
					}
				}
			}
			
			return resultWeight
		}
	},
	"basic-damage": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			let move = options.action
			let atkTypes = pokemon.getEffectiveTypes()
			// let defTypes = otherPokemon.getEffectiveTypes()
			let moveType = game.getEffectiveMoveType(trainer, pokemon, move)
			let typeMult = game.getSuperEffectiveMult(trainer, pokemon, moveType, otherTrainer, otherPokemon)
			let stabBonus = atkTypes.includes(moveType) ? 1.5 : 1
			let power = options.power ?? getMovePower(move)

			let result = power * typeMult * stabBonus
			if (isNaN(result)) {
				console.warn("Failed to calculate action weight for", move, options)
				result = 1
			}
			return result
		}
	},
	"buff-user": {
		chooseWeight: options => {
			//TODO
			return 10
		}
	},
	"debuff-opponent": {
		chooseWeight: options => {
			//TODO
			return 10
		}
	},
	"special": {
		chooseWeight: options => {
			//TODO
			return 10
		}
	},
	"last-priority": {
		chooseWeight: options => {
			//TODO
			return 1
		}
	},
	"Absorb": {
		chooseWeight: options => {
			let pokemon = options.pokemon
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(options)
			if (pokemon.hp < pokemon.maxhp){
				weight *= 1.5
			}
			return weight
		}
	},
	"Beat Up": {
		chooseWeight: options => {
			let trainer = options.trainer
			let pokemonList = trainer.pokemon
			let usablePokemon = getUsablePokemon(pokemonList)
			let totalWeight = 0
			let basePower = getMovePower(options.action)
			for (let pokemon of usablePokemon){
				let atk = pokemon.getBaseStat("attack")
				let power = basePower + (atk / 10) + 5
				let newOptions = {}
				for (let key in options){
					newOptions[key] = options[key]
				}
				newOptions.power = power
				let strategy = moveUseStrategy["basic-damage"]
				let weight = strategy.chooseWeight(newOptions)
				totalWeight += weight
			}
			return totalWeight
		}
	},
	"Bide": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherTrainerIndex = game.trainers.indexOf(otherTrainer)
			let otherPokemon = otherTrainer.activePokemon

			//Weight is based on the weight of the opponent making a move.
			let theirUsableMoves = game.getCurrentlyUsableMoves(otherTrainerIndex)
			let totalWeight = 0
			theirUsableMoves.forEach(move => {
				let newOptions = game.getActionWeightOptions(
					otherTrainer, otherPokemon, move,
					[], []
				)
				let weight = 5
				if (options.allowRecursion){
					weight = getActionWeightSimple(move, newOptions, false) * 3
				}
				totalWeight += weight
			})

			return totalWeight
		}
	},
	"Copycat": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let prevMoves = game.moveUseHistory.filter(moveUseObj => {
				return moveUseObj.trainer === otherTrainer
			})
			if (!prevMoves.length) return 0

			let lastMoveUse = prevMoves[prevMoves.length - 1]
			let lastMove = lastMoveUse.move
			let newOptions = game.getActionWeightOptions(
				trainer, pokemon, lastMove,
				[], []
			)
			let weight = game.getActionWeight(newOptions)
			
			return weight
		}
	},
	"Covet": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(options)
			let theirEnergy = Object.values(otherPokemon.energy)
			let max = Math.max(...theirEnergy)
			weight += max * 5
			
			return weight
		}
	},
	"Disable": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let prevMoves = game.moveUseHistory.filter(moveUseObj => {
				return moveUseObj.trainer === otherTrainer &&
				moveUseObj.move.name !== "Struggle"
			})
			if (!prevMoves.length) return 0

			let otherPokemon = otherTrainer.activePokemon
			let lastMoveUse = prevMoves[prevMoves.length - 1]
			let lastMove = lastMoveUse.move
			let newOptions = game.getActionWeightOptions(
				otherTrainer, otherPokemon, lastMove,
				[], []
			)
			let weight = 20
			if (options.allowRecursion){
				weight = getActionWeightSimple(lastMove, newOptions, false) * 10
			}
			
			return weight
		}
	},
	"Electro Ball": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			let newOptions = {}
			for (let key in options){
				newOptions[key] = options[key]
			}
			let extraPower = 0
			let yourSpeed = pokemon.getStat("speed")
			let theirSpeed = otherPokemon.getStat("speed")
			if (theirSpeed < yourSpeed * 0.25){
				extraPower = 150
			} else if (theirSpeed < yourSpeed * 1/3){
				extraPower = 120
			} else if (theirSpeed < yourSpeed * 0.5){
				extraPower = 80
			} else if (theirSpeed < yourSpeed){
				extraPower = 60
			} else {
				extraPower = 40
			}
			let power = getMovePower(options.action) + extraPower
			newOptions.power = power
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(newOptions)
			return weight
		}
	},
	"Fury Swipes": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = trainer.activePokemon
			let move = options.action
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(options)
			let energyYouHave = pokemon.energy
			let energyCost = move.energy
			let multiples = Object.keys(energyYouHave).map(key => {
				if (!energyCost[key]) return Infinity
				return energyYouHave[key] / energyCost[key]
			})
			let min = Math.min(...multiples)
			if (min < 1) min = 1
			weight *= min
			
			return weight
		}
	},
	"Haze": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			//Notably, this is not the move's user, it's the active pokemon.
			let pokemon = trainer.activePokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon

			let weight = 0
			//Each 'debuff' that your active pokemon has counts towards this move's weight.
			let statusEffects = pokemon.statusEffects
			for (let statusEffect of statusEffects){
				if (statusEffect.class === "debuff"){
					weight += 10
				}
			}

			//Each 'buff' that the opponent has counts towards this move's weight.
			let statusEffects2 = otherPokemon.statusEffects
			for (let statusEffect of statusEffects2){
				if (statusEffect.class === "buff"){
					weight += 10
				}
			}

			return weight
		}
	},
	"Heal Pulse": {
		chooseWeight: options => {
			let pokemonList = getUsablePokemon(options.trainer.pokemon)
			let weight = 0
			let missingP = 0
			for (let pokemon of pokemonList){
				missingP += 1 - (pokemon.hp / pokemon.maxhp)
			}
			weight += missingP * 100
			return weight
		}
	},
	//TODO: This is a little stupid. It just considers moves that are on cooldown instead of just the move with the current longest cooldown.
	"Helping Hand": {
		chooseWeight: options => {
			let pokemon = options.pokemon
			let cooldowns = pokemon.activeMoves.filter(move => {
				let cooldown = pokemon.getCurrentCooldown(move)
				return cooldown > 0
			})
			let sum = cooldowns.reduce((acc, move) => {
				let weight = 10
				if (options.allowRecursion){
					weight = getActionWeightSimple(move, options, false)
				} else {
					weight *= pokemon.getCurrentCooldown(move)
				}
				return acc + weight
			}, 0)
			return sum
		}
	},
	"Minimize": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let minimize = pokemonMoveData["Minimize"]
			let energyYouHave = pokemon.energy
			let unpayableMoves = options.unpayableMoves
			let payableMoves = options.payableMoves
			//If we have no damage-dealing moves we can use, but
			//by using Minimize we could use a damage-dealing move,
			//then Minimize is a good choice.
			let result = 0
			if (payableMoves.some(move => {
				return move.tags.includes("damage-dealing")
			})) {
				return result
			}
			
			let minimizeCost = game.getEffectiveCost(trainer, pokemon, minimize).energyCost
			let energyAfterMinimize = addEnergies(energyYouHave, multiplyEnergies(minimizeCost, -1))
			let couldDoMove = false
			let availableMove
			for (let move of unpayableMoves){
				if (!move.tags.includes("damage-dealing")){
					continue
				}
				let energyCost = multiplyEnergies(move.energy, 0.5)
				let canPay = game.canPayEnergyCost(energyAfterMinimize, energyCost)
				if (canPay){
					couldDoMove = true
					availableMove = move
					break
				} else {
					couldDoMove = false
					continue
				}
			}
			if (availableMove){
				result = getActionWeightSimple(availableMove, options, false)
				result = Math.pow(result, 1.1)
			}

			return result
		}
	},
	"Low Kick": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			let newOptions = {}
			for (let key in options){
				newOptions[key] = options[key]
			}
			//unfortunate terminology.
			let heaviness = otherPokemon?.getWeight()?.kilograms ?? 0
			let power = getMovePower(options.action)
			if (heaviness < 10) power += 20
			else if (heaviness < 25) power += 40
			else if (heaviness < 50) power += 60
			else if (heaviness < 100) power += 80
			else if (heaviness < 200) power += 100
			else power += 120
			newOptions.power = power

			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(newOptions)
			
			return weight
		}
	},
	"Pay Day": {
		chooseWeight: options => {
			let game = options.game
			let board = game.board
			let yellowTiles = board.tilesOnScreen()
			.filter(tile => tile.type === "yellow")
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(options)
			weight += 5 * yellowTiles.length
			
			return weight
		}
	},
	"Present": {
		chooseWeight: options => {
			let newOptions = {}
			for (let key in options){
				newOptions[key] = options[key]
			}
			let power = getMovePower(options.action) + 120	
			newOptions.power = power
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(newOptions)
			return weight
		}
	},
	"Pursuit": {
		chooseWeight: options => {
			//If we can use another damage dealing move first, that's better.
			let payableMoves = options.payableMoves
			if (payableMoves.some(move => move.tags.includes("damage-dealing"))){
				return 0
			}
			let strategy = moveUseStrategy["basic-damage"]
			let weight = strategy.chooseWeight(options)
			return weight
		}
	},
	"Seismic Toss": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = trainer.activePokemon
			let move = options.action
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			// let otherTypes = otherPokemon.getEffectiveTypes()
			let damageType = game.getEffectiveMoveType(otherTrainer, otherPokemon, move)
			let isImmune = !game.getSuperEffectiveMult(trainer, pokemon, damageType, otherTrainer, otherPokemon)
			let weight = isImmune ? 0 : pokemon.level * 2
			
			return weight
		}
	},
	"Super Fang": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherPokemon = otherTrainer.activePokemon
			let weight = otherPokemon.hp * 0.5 * 10

			return weight
		}
	},
	"Taunt": {
		chooseWeight: options => {
			let game = options.game
			let trainer = options.trainer
			let pokemon = options.pokemon
			let otherTrainer = game.trainers.find(t => t !== trainer)
			let otherTrainerIndex = game.trainers.indexOf(otherTrainer)
			let otherPokemon = otherTrainer.activePokemon
			let availableMoves = game.getAvailableMoves(otherTrainerIndex)
			let theirWeights = availableMoves.map(move => {
				let category = getMoveCategory(move)
				if (category === "Status"){
					let newOptions = game.getActionWeightOptions(
						otherTrainer, otherPokemon, move,
						[], []
					)
					let theirWeight = 20
					if (options.allowRecursion){
						theirWeight = getActionWeightSimple(move, newOptions, false) * 10
					}
					return theirWeight
				} else {
					return 0
				}
			})
			
			let weight = theirWeights.reduce((acc, val) => acc + val, 0)
			
			return weight
		}
	},
}

const trainerStrategy = {
	"default": {
		chooseActions: options => {
			let game = options.game
			let trainer = options.trainer
			let activePokemon = trainer.activePokemon
			let isWild = options.isWild
			let result = {
				swap: 0,
				makeMoves: 0,
				switch: 0
			}
			let areMovesAllowed = options.areMovesAllowed
			if (areMovesAllowed){
				result.makeMoves = 1000
			} else {
				result.swap = 1
			}
			let switchAllowed = !isWild || options.switchAllowed
			if (switchAllowed && activePokemon.hp < 0.4 * activePokemon.maxhp){
				let goodSwaps = trainer.pokemon.filter(pokemon => {
					if (activePokemon === pokemon) return false
					return pokemon.hp > 0.5 * pokemon.maxhp
				})
				if (goodSwaps.length){
					result = {}
					result.switch = 1
				}
			}
			return result
		},
		choosePokemon: options => {
			let reason = options.reason
			let pokemonList = options.pokemonList
			let trainer = options.trainer
			if (reason === "swap"){
				let nonAces = pokemonList.filter(pokemon => {
					let tagData = trainer.pokemonData[pokemon.uuid] || {}
					return !tagData.isAce
				})
				let canPick = nonAces
				if (!nonAces.length){
					canPick = pokemonList
				}
				let chosen = randomChoice(canPick)
				return [chosen]
			} else if (reason === "heal"){
				let lowestHp = pokemonList.reduce((lowest, pokemon) => {
					let p1 = lowest.hp / lowest.maxhp
					let p2 = pokemon.hp / pokemon.maxhp
					return p1 < p2 ? lowest : p1 > p2 ? pokemon : lowest
				}, pokemonList[0])
				return [lowestHp]
			} else {
				let chosen = randomChoice(pokemonList)
				return [chosen]
			}
		}
	},
	"5-3-trial": {
		chooseActions: options => {
			let trainer = options.trainer
			let activePokemon = trainer.activePokemon
			options.switchAllowed = true
			let result = trainerStrategy["default"].chooseActions(options)
			if (activePokemon.pokemonId === "Alomomola"){
				let totemPokemonToHeal = trainer.pokemon.filter(pokemon => {
					let data = trainer.pokemonData[pokemon.uuid]
					let tags = data.tags
					return tags?.includes("totem") && isPokemonUsable(pokemon) && pokemon.hp < 0.7 * pokemon.maxhp
				})
				if (!totemPokemonToHeal.length){
					result = {}
					result.switch = 1
				}
			}
			return result
		},
		choosePokemon: options => {
			let reason = options.reason
			let pokemonList = options.pokemonList
			let trainer = options.trainer
			if (reason === "swap"){
				let allYours = pokemonList.every(pokemon => trainer.pokemon.includes(pokemon))
				if (!allYours){
					return trainerStrategy["default"].choosePokemon(options)
				}
				let priorities = pokemonList.map(pokemon => {
					let priority = trainer.pokemon.length - trainer.pokemon.indexOf(pokemon)
					priority *= pokemon.hp / pokemon.maxhp
					return priority
				})
				let maxPriority = priorities.reduce((acc, v) => {
					return acc > v ? acc : v
				}, priorities[0])
				let index = priorities.indexOf(maxPriority)
				return [pokemonList[index]]
			} else {
				return trainerStrategy["default"].choosePokemon(options)
			}
		}
	}
}

function getActionWeightSimple(action, options, allowRecursion=false){
	let strategyData = getStrategyData(action)
	let weight
	let newOptions = {}
	for (let key in options){
		newOptions[key] = options[key]
	}
	newOptions.action = action
	newOptions.allowRecursion = allowRecursion
	weight = strategyData.chooseWeight(newOptions)
	return weight
}
function getStrategyData(move){
	if (!move || move === "nothing"){
		return moveUseStrategy["do-nothing"]
	}
	let strategy = move.strategy
	if (strategy === "special"){
		if (move.name in moveUseStrategy){
			return moveUseStrategy[move.name]
		}
	}
	if (strategy in moveUseStrategy){
		return moveUseStrategy[strategy]
	}
	console.warn("You never handled", strategy, move)
	return moveUseStrategy["do-nothing"]
}