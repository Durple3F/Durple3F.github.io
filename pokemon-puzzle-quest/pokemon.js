class Pokemon{
	constructor(name, pokemonName, options){
		this.uuid = options?.uuid ?? window.crypto.randomUUID()
		this.owner = options?.owner ?? playerSaveId
		this.pokemonId = pokemonName
		this.data = pokemonData[pokemonName]
		this.name = name ?? this.data.name
		this.pokemonName = pokemonName ?? pokemonData.name
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
		this.hp = options?.hp ?? this.getStat("hp")
		this.maxhp = this.getStat("hp")
		this.exp = options?.exp ?? this.getEXPNeededForLevel(this.level)

		this.learnset = this.data.learnset.map(move => move)
		this.moves = this.learnset.map(move => pokemonMoveData[move.name])
		this.movesUnlockedMap = []
		this.moves.forEach((move, i) => {
			let movesUnlockedMap = options?.movesUnlockedMap ?? []
			this.movesUnlockedMap[i] = movesUnlockedMap[i] || false
		})
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
		if (options.activeMoves){
			for (let name of options.activeMoves){
				let move = pokemonMoveData[name]
				if (move) this.activeMoves.push(move)
			}
		}

		let unlocks = this.determineUnlockedMoves()
		this.unlockMoves(unlocks)
		if (this.activeMoves.length === 0){
			this.chooseActiveMoves()
		}
		
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
				case "confused": {
					status = {
						name: "confused",
						turns: Math.floor(Math.random() * 4) + 2
					}
				} break
				case "poisoned": {
					status = {
						name: "poisoned"
					}
				} break
				default:
					console.warn("You never handled", status)
					status = {
						name: "???"
					}
				break
			}
		} else {
			console.warn("Non-string status effect added", status)
		}

		status.type = "status"
		status.sourceMove = source
		status.sourcePokemon = pokemon
		status.sourceTrainer = owner

		let prevented = false
		//Fire pokemon can't be burned
		if (status.name === "burn" && this.types.includes("Fire")){
			prevented = true
		}
		//Poison and Steel type pokemon can't be poisoned
		if (status.name === "poisoned" && this.types.includes("Poison") ||
				status.name === "poisoned" && this.types.includes("Steel")){
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

	unlockMoves(unlockMap){
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
			}
			this.movesUnlockedMap[i] = v
		})
		return changedIndexes
	}
	determineUnlockedMoves(){
		let unlockMap = this.learnset.map((move, index) => {
			let shouldBeUnlocked = checkIfPokemonMeetsRequirements(this, move.unlock)
			let isUnlocked = this.movesUnlockedMap[index]
			return shouldBeUnlocked || isUnlocked
		})
		return unlockMap
	}
	unlockMove(name){
		let index = this.learnset.find(m => m.name === name)
		if (index !== -1){
			this.movesUnlockedMap[index] = true
		}
	}
	chooseActiveMoves(){
		//Should only be used for wild pokemon and other instances where no original list is given
		let chooseable = this.moves.filter((m, i) => {
			return this.movesUnlockedMap[i]
		})
		let toAdd = 4 - this.activeMoves.length
		//Pick up to 4 of the most recently unlocked moves
		chooseable = chooseable.reverse().slice(0, toAdd)
		chooseable.forEach(m => this.activeMoves.push(m))

		//Just a nice thing: Sort the active moves by name.
		this.activeMoves.sort((a, b) => {
			let na = a.name
			let nb = b.name
			return na < nb ? -1 : na > nb ? 1 : 0
		})
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
}