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
		this.form = options?.form ?? this.data.defaultForm ?? null
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
			if (options?.ivs){
				this.ivs[stat] = options.ivs[stat] ?? Math.floor(Math.random() * 32)
			} else {
				this.ivs[stat] = Math.floor(Math.random() * 32)
			}

			if (options?.evs){
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
		this.hadHiddenAbility = options?.hadHiddenAbility
		if (options?.ability){
			if (typeof options.ability === "string" && options.ability in abilityData){
				this.ability = abilityData[options.ability]
			} else {
				this.ability = options.ability
			}

			if (this.hadHiddenAbility === undefined){
				this.hadHiddenAbility = this.data.hiddenAbilities.includes(this.ability)
			}
		} else {
			//Choose a random ability this pokemon may have.
			let which = "abilities"
			if (options?.addHiddenAbility && this.data.hiddenAbilities.length){
				which = "hiddenAbilities"
			}
			let possibleAbilities = this.data[which]
			let abilityId = randomChoice(possibleAbilities)
			if (abilityId){
				this.ability = abilityData[abilityId]
			}
			if (options?.addHiddenAbility){
				this.hadHiddenAbility = true
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

	addStatusEffect(status, owner, pokemon, source=undefined){
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
						class: "debuff",
						volatile: true,
						turns: Math.floor(Math.random() * 12) + 6
					}
				} break
				case "poisoned": {
					status = {
						name: "poisoned",
						class: "debuff",
						volatile: false
					}
				} break
				case "paralyzed": {
					status = {
						name: "paralyzed",
						class: "debuff",
						volatile: false
					}
				} break
				case "invulnerable": {
					status = {
						name: "invulnerable",
						class: "debuff",
						volatile: true,
						turns: 1
					}
				} break
				case "drowsy": {
					status = {
						name: "drowsy",
						class: "debuff",
						volatile: true
					}
				} break
				case "asleep": {
					status = {
						name: "asleep",
						class: "debuff",
						volatile: false,
						turns: Math.floor(Math.random() * 12) + 6
					}
					if (this.hasAbility("Early Bird")){
						status.turns = Math.ceil(status.turns * 0.5)
					}
				} break
				case "fear-frozen": {
					status = {
						name: "fear-frozen",
						class: "debuff",
						volatile: true
					}
				} break
				case "splinters": {
					status = {
						name: "splinters",
						class: "debuff",
						volatile: true,
						turns: 4
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
		if (!status.tags){
			status.tags = []
		}
		status.gameData = {}
		if (status.tags.includes("count-damage-received")){
			status.gameData.damageReceived = 0
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
		//Pokemon with Vital Spirit can't become asleep
		if (
			(status.name === "asleep" || status.name === "drowsy") && 
			this.hasAbility("Vital Spirit")
		){
			prevented = true
		}
		//Pokemon with Insomnia can't become asleep
		if (
			(status.name === "asleep" || status.name === "drowsy") && 
			this.hasAbility("Insomnia")
		){
			prevented = true
		}
		//Sweet Veil prevents all of your Pokemon being put to sleep
		if (
			(status.name === "asleep" || status.name === "drowsy") &&
			this.trainer?.activePokemon?.hasAbility("Sweet Veil")
		){
			prevented = true
		}
		//Pokemon with Vital Spirit can't become asleep
		if ((status.name === "asleep" || status.name === "drowsy") && 
		(this.hasAbility("Vital Spirit") || this.hasAbility("Insomnia"))){
			prevented = true
		}
		//Pokemon with Own Tempo can't become confused
		if (status.name === "confused" && this.hasAbility("Own Tempo")){
			prevented = true
		}
		//Pokemon with Hyper Cutter can't have their Attack lowered by stages
		if (
			status.type === "stat" &&
			status.sourcePokemon !== this &&
			status.stat === "attack" &&
			status.amount < 0 &&
			this.hasAbility("Hyper Cutter")
		){
			prevented = true
		}
		//Pokemon with Big Pecks can't have their Defense lowered by stages
		if (
			status.type === "stat" &&
			status.sourcePokemon !== this &&
			status.stat === "defense" &&
			status.amount < 0 &&
			this.hasAbility("Big Pecks")
		){
			prevented = true
		}
		//Pokemon with Shield Dust prevent receiving statuses from other trainers 20% of the time
		if (
			status.sourceTrainer !== this.trainer &&
			Math.random() < 0.2 &&
			this.hasAbility("Shield Dust")
		){
			prevented = true
		}
		//Pokemon with Leaf Guard prevent receiving statuses from other trainers based on green energy
		if (this.hasAbility("Leaf Guard") && status.sourceTrainer !== this.trainer){
			let fullness = this.energy.green / this.maxEnergy.green * 0.5
			if (Math.random() < fullness){
				prevented = true
			}
		}
		//Grass Veil protects all your pokemon from receiving stat debuffs
		if (status.type === "stat" && status.amount < 0){
			let isGrassType = this.getEffectiveTypes().includes("Grass")
			if (isGrassType && this.trainer?.activePokemon?.hasAbility("Flower Veil")){
				prevented = true
			}
		}

		//There are some status effects that don't stack
		let data = pokemonStatusData[status.name]
		let existingCopies = statusEffects.filter(s => s.name === status.name)
		let stacksAllowed = status.stacks ?? data?.stacks ?? true
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
				
				if (!statusEffect.class){
					console.warn("No class given for ", statusEffect)
				}
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
		
		if (this.hasAbility("Defiant")){
			let addedFromAnotherSource = result.added.filter(statusEffect => {
				return statusEffect.sourcePokemon !== this
			})
			if (addedFromAnotherSource.length){
				this.addStatusEffect({
					type: "stat",
					class: "debuff",
					stat: "attack",
					amount: 1
				}, this.trainer, this, undefined)
			}
		}

		return result
	}
	hasStatus(name){
		if (name === "asleep" && this.hasAbility("Comatose")){
			return true
		}
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
	removeActiveMove(move){
		if (this.activeMoves.includes(move)){
			let activeIndex = this.activeMoves.indexOf(move)
			this.activeMoves.splice(activeIndex, 1)
		}
	}

	changeLevel(level){
		let oldMax = this.getStat("hp")
		let expForNextLevel = this.getEXPNeededForLevel(level + 1)
		let expForLevel = this.getEXPNeededForLevel(level)
		if (this.exp > expForNextLevel){
			this.exp = expForLevel
		}
		if (this.exp < expForLevel){
			this.exp = expForLevel
		}
		this.level = level
		let newMax = this.getStat("hp")
		this.hp += newMax - oldMax
		
		let unlocks = this.determineUnlockedMoves()
		let changes = this.unlockMoves(unlocks)
		return changes
	}

	getBaseStat(stat){
		let base = this.data.stats[stat]
		return base
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
		let effectiveStat = val * modifier

		if (stat === "attack" && this.hasAbility("Hustle")){
			effectiveStat *= 1.5
		}

		return effectiveStat
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
	lockMove(name, removeActive=false){
		let index = this.data.learnset.findIndex(m => m.name === name)
		if (index !== -1){
			this.movesUnlockedMap[index] = true
		}
		if (removeActive){
			let move = pokemonMoveData[name]
			this.removeActiveMove(move)
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

	getEffectiveAbility(){
		let abilityStatuses = this.getStatusesOfType("ability-alteration")
		let ability = this.ability
		if (abilityStatuses.length){
			for (let statusEffect of abilityStatuses){
				let newAbility = statusEffect.ability
				if (newAbility){
					ability = newAbility
				}
			}
		}
		return ability
	}
	hasAbility(abilityId){
		return true
		let ability = this.getEffectiveAbility()
		return ability?.id === abilityId
	}
	hasHiddenAbility(){
		let data = this.data
		let ability = this.ability
		let abilityId = ability.id
		let hiddenAbilityIds = data.hiddenAbilities
		return hiddenAbilityIds.includes(abilityId)
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
		
		if (this.data.hasForms && this.form){
			let formData = this.data.forms[this.form]
			if (formData.types){
				formData.types.forEach(type => {
					if (!this.types.includes(type)){
						this.types.push(type)
					}
				})
			}
		}
		if (this.data.hasForms && !this.form){
			console.error("Somehow",this,"has no form listed for it")
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
		return this.getLevelFromEXP(this.exp)
	}

	evolve(evolveTo){
		let copy = {}
		let toCopy = [
			"uuid", "owner", "level", "nature",
			"ivs", "evs", "exp", "isShiny",
			"hadHiddenAbility"
		]
		for (let key of toCopy){
			copy[key] = this[key]
		}
		copy.skipGivingMoves = true
		copy.addHiddenAbility = this.hasHiddenAbility() || this.hadHiddenAbility
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

	getImage(key="large"){
		return getPokemonImage(this.data, key, this.isShiny, this)
	}
	getAllSounds(){
		return getPokemonSounds(this.data, this)
	}
}