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

				}

				if (favoriteMoveWeight < weight){
					favoriteMove = action
					favoriteMoveWeight = weight
				}

				return weight
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