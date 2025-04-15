const moveUseStrategy = {
	"do-nothing": {
		chooseWeight: options => {
			//Determine the weight of doing nothing by
			//adding up how much we'd like to do all the other
			//things we could do if we wait.
			let favoriteMove
			let favoriteMoveWeight = 0
			let unpayableMoves = options.unpayableMoves
			let actionWeights = unpayableMoves.map(action => {
				let weight = 0
				if (options.allowRecursion){
					weight = getActionWeightSimple(action, options, false)
				} else {

				}

				if (favoriteMoveWeight < weight){
					favoriteMove = action
					favoriteMoveWeight = weight
				}

				return weight
			})
			let sum = actionWeights.reduce((acc, v) => acc + v, 0)

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
				for (let action of options.payableMoves){
					let hypotheticalEnergy = addEnergies(energyYouHave, getEmptyEnergy())
					let cost = game.getEffectiveCost(trainer, pokemon, action).energyCost
					let becameBelow = false
					for (let color in cost){
						if (!favoriteCost[color]) continue
						if (hypotheticalEnergy[color] - cost[color] < favoriteCost[color]){
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
			let defTypes = otherPokemon.getEffectiveTypes()
			let moveType = game.getEffectiveMoveType(trainer, pokemon, move)
			let typeMult = getSuperEffectiveMult(moveType, defTypes)
			let stabBonus = atkTypes.includes(moveType) ? 1.5 : 1
			let power = move.power

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
	"Helping Hand": {
		chooseWeight: options => {
			let pokemon = options.pokemon
			let cooldowns = pokemon.activeMoves.filter(move => {
				let index = pokemon.moves.indexOf(move)
				let usage = pokemon.moveUsage[index]
				return usage.recharge > 0
			})
			let sum = cooldowns.reduce((acc, move) => {
				let weight = 10
				if (options.allowRecursion){
					weight = getActionWeightSimple(move, options, false)
				} else {
					//TODO
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
	console.warn("You never handled", strategy)
	return moveUseStrategy["do-nothing"]
}