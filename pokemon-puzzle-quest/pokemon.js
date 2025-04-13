class Pokemon{
	constructor(name, pokemonName, options={}){
		this.uuid = options?.uuid ?? window.crypto.randomUUID()
		this.owner = options?.owner ?? playerSaveId
		this.pokemonId = pokemonName ?? options.id
		this.data = pokemonData[this.pokemonId]

		if (!this.data){
			console.warn("WHICH POKEMON IS THIS??")
			console.log(name, pokemonName, options)
			console.trace()
		}

		let defaultName = getLocaleString("name", lang, ["pokemon", this.pokemonId])
		this.name = name ?? defaultName ?? this.data.name
		this.pokemonName = this.data.name
		this.types = []
		this.data.types.forEach(type => this.types.push(type))
		this.level = options?.level ?? 1

		this.pokeballType = options?.pokeballType ?? "pokeball"

		this.nature = options?.nature ?? getRandomNature()
		this.isShiny = false
		if ("isShiny" in options){
			this.isShiny = options.isShiny
		} else if (!options.shinyLocked) {
			//Shiny odds calculation
			let rand = Math.random()
			this.isShiny = rand < 0.02
		}

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
		this.hp = options?.hp ?? this.getStat("hp")
		this.fainted = options?.fainted ?? false
		this.maxhp = this.getStat("hp")
		this.exp = options?.exp ?? this.getEXPNeededForLevel(this.level)

		// this.learnset = this.data.learnset
		this.moves = this.data.learnset.map(move => pokemonMoveData[move.name])
		this.movesUnlockedMap = []
		let movesUnlocked
		if (options?.movesUnlocked){
			movesUnlocked = options?.movesUnlocked
		} else if (options?.movesUnlockedMap){
			movesUnlocked = options.movesUnlockedMap.map((v, i) => {
				return v ? this.moves[i].name : null
			}).filter(v => v)
		} else {
			movesUnlocked = []
		}
		this.moves.forEach((move, i) => {
			this.movesUnlockedMap[i] = movesUnlocked.includes(move.name)
		})
		this.moveUsage = this.moves.map(move => {
			return {
				recharge: 0
			}
		})

		//Decide which abilities this pokemon has
		if (options?.ability){
			if (typeof options.ability === "string" && options.ability in abilityData){
				this.ability = abilityData[options.ability]
			} else {
				this.ability = options.ability
			}
		} else {
			//Choose a random ability this pokemon may have.
			let which = options?.addHiddenAbility ? "hiddenAbilities" : "abilities"
			let possibleAbilities = this.data[which]
			let abilityName = randomChoice(possibleAbilities)
			if (abilityName){
				this.ability = abilityData[abilityName]
			}
		}
		if (!this.ability){
			this.ability = abilityData["No Ability"]
		}

		this.energyMasteryUpgrades = {}
		this.energyMastery = {}
		for (let type in this.data.energyMastery){
			this.energyMasteryUpgrades[type] = 0
		}
		if (options?.energyMasteryUpgrades){
			for (let type in options.energyMasteryUpgrades){
				this.energyMasteryUpgrades[type] = options.energyMasteryUpgrades[type]
			}
		}

		this.gameRoundData = {}
		this.statusEffects = []

		//You can only have 4 moves active at once
		this.activeMoves = []
		if (options.activeMoves){
			for (let name of options.activeMoves){
				let move = pokemonMoveData[name]
				if (move) this.addActiveMove(move)
			}
		}

		if (!options.skipGivingMoves){
			let unlocks = this.determineUnlockedMoves()
			this.unlockMoves(unlocks, true)
			if (this.activeMoves.length === 0){
				this.chooseActiveMoves()
			}
		}
		
		this.energy = getEmptyEnergy()
		this.maxEnergy = getEmptyEnergy()

		this.turnsActive = 0
		this.turnsParticipated = 0

		this.resetEverything()

		this.pcBox = options?.pcBox ?? null
		this.pcBoxX = options?.pcBoxX ?? null
		this.pcBoxY = options?.pcBoxY ?? null
	}

	addStatusEffect(status, owner, pokemon, source){
		if (typeof status === "string"){
			switch (status){
				// case "burn": {
				// 	status = {
				// 		name: "burn"
				// 	}
				// } break
				case "confused": {
					status = {
						name: "confused",
						volatile: true,
						turns: Math.floor(Math.random() * 4) + 2
					}
				} break
				case "poisoned": {
					status = {
						name: "poisoned",
						volatile: false
					}
				} break
				case "paralyzed": {
					status = {
						name: "paralyzed",
						volatile: false
					}
				} break
				case "invulnerable": {
					status = {
						name: "invulnerable",
						volatile: true,
						turns: 1
					}
				} break
				case "drowsy": {
					status = {
						name: "drowsy",
						volatile: true
					}
				} break
				case "asleep": {
					status = {
						name: "asleep",
						volatile: false,
						turns: Math.floor(Math.random() * 4) + 2
					}
				} break
				case "fear-frozen": {
					status = {
						name: "fear-frozen",
						volatile: true
					}
				} break
				default:
					console.warn("You never handled", status)
					status = {
						name: "???"
					}
				break
			}
			if (typeof status === "string"){
				console.warn("Uh-oh, this status never got converted to an object: ", status)
				status = {
					name: "???"
				}
			}
			status.type = "status"
		} else {
			let oldStatus = status
			status = {
				name: "???"
			}
			for (let key in oldStatus){
				status[key] = oldStatus[key]
			}
		}

		if (!("volatile" in status)){
			status.volatile = true
		}

		if (!status.name || !status.type){
			console.warn("This status effect is weird:")
			console.log(status)
		}

		let result = {}
		result.added = []
		result.removed = []
		result.replaced = []
		status.sourceMove = source
		status.sourcePokemon = pokemon
		status.sourceTrainer = owner

		let prevented = false
		let statusEffects = this.statusEffects

		//Is this status excluded due to a limitation of the status?
		let statusType = pokemonStatusData[status.name]
		if (statusType){
			let exclusiveTo = statusType.exclusiveTo
			let excluded = this.statusEffects.filter(s => exclusiveTo.includes(s.name))
			if (excluded.length){
				prevented = true
			}
		}

		let types = this.getEffectiveTypes()
		//Fire pokemon can't be burned
		if (status.name === "burn" && types.includes("Fire")){
			prevented = true
		}
		//Poison and Steel type pokemon can't be poisoned
		if (status.name === "poisoned" && types.includes("Poison") ||
				status.name === "poisoned" && types.includes("Steel")){
			prevented = true
		}
		//Electric pokemon can't be paralyzed
		if (status.name === "paralyzed" && types.includes("Electric")){
			prevented = true
		}

		//There are some status effects that don't stack
		let data = pokemonStatusData[status.name]
		let existingCopies = statusEffects.filter(s => s.name === status.name)
		let stacksAllowed = status.stacks ?? data.stacks
		if (typeof stacksAllowed === "boolean"){
			stacksAllowed = stacksAllowed ? Infinity : 1
		}
		let tooManyStacks = existingCopies.length + 1 > stacksAllowed
		if (tooManyStacks){
			prevented = true
		}

		if (!prevented){
			result.added.push(status)
		}

		//Does gaining this status replace any other statuses the Pokemon may have?
		if (statusType){
			let canReplace = statusType.canReplace
			let replaces = this.statusEffects.filter(s => canReplace.includes(s.name))
			if (replaces.length){
				replaces.forEach(s => result.replaced.push(s))
			}
		}

		if (result.replaced.length){
			let index = this.statusEffects.indexOf(result.replaced[0])
			//Put the new statuses in place of the first old one
			for (let statusEffect of result.added){
				this.statusEffects.splice(index, 0, statusEffect)
				index++
			}
			//Remove the old ones
			for (let statusEffect of result.replaced){
				this.removeStatus(statusEffect)
			}
		} else {
			for (let status of result.added){
				this.statusEffects.push(status)
			}
		}

		return result
	}
	hasStatus(name){
		return this.statusEffects.some(status => {
			return status.name === name
		})
	}
	getStatuses(name){
		return this.statusEffects.filter(status => {
			return status.name === name
		})
	}
	getStatusesOfType(type){
		return this.statusEffects.filter(s => {
			return s.type === type
		})
	}
	removeStatus(statusEffect){
		let index = this.statusEffects.indexOf(statusEffect)
		if (index !== -1){
			this.statusEffects.splice(index, 1)
		}
	}
	removeStatusesWithName(name){
		let shouldRemove = this.statusEffects.some(status => {
			return status.name === name
		})
		while (shouldRemove){
			let statusEffect = this.statusEffects.find(status => {
				return status.name === name
			})
			this.removeStatus(statusEffect)
			shouldRemove = this.statusEffects.some(status => {
				return status.name === name
			})
		}
	}
	removeVolatileStatuses(){
		for (let statusEffect of this.statusEffects){
			if (statusEffect.volatile){
				this.removeStatus(statusEffect)
				continue
			}
		}
	}

	addActiveMove(move){
		if (this.activeMoves.length >= 4) return false
		if (this.activeMoves.includes(move)) return false
		this.activeMoves.push(move)
		return true
	}

	changeLevel(level){
		let oldMax = this.getStat("hp")
		this.level = level
		let newMax = this.getStat("hp")
		this.hp += newMax - oldMax
		
		let unlocks = this.determineUnlockedMoves()
		let changes = this.unlockMoves(unlocks)
		return changes
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
		let statusEffects = this.statusEffects.filter(effect => {
			return effect.type === "stat" && effect.stat === stat
		})
		statusEffects.forEach(effect => {
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

	getEffectiveTypes(){
		return this.types
	}

	unlockMoves(unlockMap, skipActivating){
		//Each move that becomes locked has its index noted in locked, and vice versa.
		let changedIndexes = {
			unlocked: [],
			locked: []
		}
		//Goes through and unlocks the moves at the indexes that the given map says.
		unlockMap.forEach((v, i) => {
			if (this.movesUnlockedMap[i] && !v){
				changedIndexes.locked.push(i)
			}
			if (!this.movesUnlockedMap[i] && v){
				changedIndexes.unlocked.push(i)

				let move = this.moves[i]
				if (!skipActivating){
					this.addActiveMove(move)
				}
			}
			this.movesUnlockedMap[i] = v
		})
		return changedIndexes
	}
	determineUnlockedMoves(){
		let unlockMap = this.data.learnset.map((move, index) => {
			let shouldBeUnlocked = checkIfPokemonMeetsRequirements(this, move.unlock)
			let isUnlocked = this.movesUnlockedMap[index]
			return shouldBeUnlocked || isUnlocked
		})
		return unlockMap
	}
	unlockMove(name){
		let index = this.data.learnset.findIndex(m => m.name === name)
		if (index !== -1){
			this.movesUnlockedMap[index] = true
		}
	}
	lockMove(name){
		let index = this.data.learnset.findIndex(m => m.name === name)
		if (index !== -1){
			this.movesUnlockedMap[index] = true
		}
		let move = pokemonMoveData[name]
		if (this.activeMoves.includes(move)){
			let activeIndex = this.activeMoves.indexOf(move)
			this.activeMoves.splice(activeIndex, 1)
		}
	}
	chooseActiveMoves(){
		//Should only be used for wild pokemon and other instances where no original list is given
		let chooseable = this.moves.filter((m, i) => {
			return this.movesUnlockedMap[i]
		})
		let toAdd = 4 - this.activeMoves.length
		let adding = []
		//Pick up to 4 of the most recently unlocked moves
		// chooseable = chooseable.reverse().slice(0, toAdd)

		//v2: Decide which moves to add by starting with the first 4 we possibly could,
		//then replacing a random one one by one, simulating the player making choices
		//as the pokemon leveled up.
		for (let move of chooseable){
			if (adding.length < toAdd){
				adding.push(move)
			} else {
				let index = Math.floor(Math.random() * adding.length)
				adding.splice(index, 1, move)
			}
		}
		adding.forEach(m => this.addActiveMove(m))
	}

	gainEnergy(energy){
		let result = {}
		for (let color of colors){
			result[color] = 0
			if (color in energy){
				result[color] = this.gainEnergyColor(color, energy[color])
			}
		}
		return result
	}
	gainEnergyColor(color, amount){
		let result = 0
		let energy = this.energy
		let maxEnergy = this.maxEnergy
		//If the energy has a decimal component, no it doesn't.
		amount = Math.round(amount)
		if (energy[color] + amount < 0){
			result = energy[color] * -1
			energy[color] = 0
		} else if (energy[color] + amount > maxEnergy[color]){
			result = maxEnergy[color] - energy[color]
			energy[color] = maxEnergy[color]
		} else {
			result = amount
			energy[color] += amount
		}
		return result
	}

	getBonusEnergy(type){
		//Returns an object that says how much bonus energy matches of this type should be worth.
		let energy = getTileEnergyValue(type)
		let masteryVal = this.energyMastery[type]
		masteryVal = Math.pow(masteryVal * 0.2, 1/3)
		let diff = masteryVal % 1
		if (diff && Math.random() > diff){
			masteryVal = Math.ceil(masteryVal)
		} else {
			masteryVal = Math.floor(masteryVal)
		}
		energy = multiplyEnergies(energy, masteryVal)
		return energy
	}
	resetEnergyMastery(){
		for (let type of tileTypes){
			this.energyMastery[type] = this.data.energyMastery[type]
			this.energyMastery[type] += Math.floor(this.level * this.data.energyMastery[type] / 5)
			this.energyMastery[type] += this.energyMasteryUpgrades[type]
		}
		colors.forEach(color => {
			let max = Math.ceil(this.energyMastery[color] / 2)
			this.maxEnergy[color] = 10 + max + Math.floor(this.level / 3)
			this.energy[color] = Math.floor(this.energyMastery[color] / 4)
		})
	}
	resetEverything(){
		this.maxhp = this.getStat("hp")
		this.turnsActive = 0
		this.turnsParticipated = 0
		this.moveUsage.forEach(usage => usage.recharge = 0)
		this.gameRoundData = {}

		this.resetEnergyMastery()
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
		return this.getLevelFromEXP(this.exp)
	}

	evolve(evolveTo){
		let copy = {}
		let toCopy = [
			"uuid", "owner", "level", "nature",
			"ivs", "evs", "exp", "isShiny"
		]
		for (let key of toCopy){
			copy[key] = this[key]
		}
		copy.skipGivingMoves = true
		let changeName = this.name === this.pokemonName
		let newName = changeName ? null : this.name
		let oldActive = this.activeMoves
		let oldMoves = this.moves
		let oldMovesUnlocked = this.movesUnlockedMap
		let oldIsShiny = this.isShiny
		let newPokemon = new Pokemon(newName, evolveTo.id, copy)
		for (let key in newPokemon){
			this[key] = newPokemon[key]
		}
		this.isShiny = oldIsShiny
		oldMovesUnlocked.forEach((v, i) => {
			if (!v) return
			let move = oldMoves[i]
			this.unlockMove(move.name)
		})
		oldActive.forEach(move => this.addActiveMove(move))
		let unlocks = this.determineUnlockedMoves()
		let changes = this.unlockMoves(unlocks)
		for (let moveIndex of changes.unlocked){
			let learn = this.data.learnset[moveIndex]
			let move = pokemonMoveData[learn.name]
			if (this.activeMoves.length < 4){
				this.addActiveMove(move)
			}
		}
		logPokemonAs("caught", newPokemon)
		return changes
	}

	getImage(){
		return getPokemonImage(this.data, "large", this.isShiny)
	}
}