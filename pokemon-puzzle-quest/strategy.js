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
				for (let action of options.payableMoves){
					let hypotheticalEnergy = addEnergies(energyYouHave, getEmptyEnergy())
					let cost = action.energy
					let favoriteCost = favoriteMove.energy
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