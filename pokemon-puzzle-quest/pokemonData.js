const types = [
	"Normal",
	"Fighting",
	"Flying",
	"Poison",
	"Ground",
	"Rock",
	"Bug",
	"Ghost",
	"Steel",
	"Fire",
	"Water",
	"Grass",
	"Electric",
	"Psychic",
	"Ice",
	"Dragon",
	"Dark",
	"Fairy",
	"Typeless"
]
const typeEffectiveness = {}
for (let type of types){
	typeEffectiveness[type] = {}
	for (let type2 of types){
		typeEffectiveness[type][type2] = 1
	}
}
typeEffectiveness["Normal"]["Rock"] = 0.5
typeEffectiveness["Normal"]["Ghost"] = 0

typeEffectiveness["Fighting"]["Normal"] = 2
typeEffectiveness["Fighting"]["Flying"] = 0.5
typeEffectiveness["Fighting"]["Poison"] = 0.5
typeEffectiveness["Fighting"]["Rock"] = 2
typeEffectiveness["Fighting"]["Bug"] = 0.5
typeEffectiveness["Fighting"]["Ghost"] = 0
typeEffectiveness["Fighting"]["Steel"] = 2
typeEffectiveness["Fighting"]["Psychic"] = 0.5
typeEffectiveness["Fighting"]["Ice"] = 2
typeEffectiveness["Fighting"]["Dark"] = 2
typeEffectiveness["Fighting"]["Fairy"] = 0.5

typeEffectiveness["Flying"]["Fighting"] = 2
typeEffectiveness["Flying"]["Rock"] = 0.5
typeEffectiveness["Flying"]["Bug"] = 2
typeEffectiveness["Flying"]["Steel"] = 0.5
typeEffectiveness["Flying"]["Grass"] = 2
typeEffectiveness["Flying"]["Electric"] = 0.5

typeEffectiveness["Poison"]["Poison"] = 0.5
typeEffectiveness["Poison"]["Ground"] = 0.5
typeEffectiveness["Poison"]["Rock"] = 0.5
typeEffectiveness["Poison"]["Ghost"] = 0.5
typeEffectiveness["Poison"]["Steel"] = 0
typeEffectiveness["Poison"]["Grass"] = 2
typeEffectiveness["Poison"]["Fairy"] = 2

typeEffectiveness["Ground"]["Flying"] = 0
typeEffectiveness["Ground"]["Poison"] = 2
typeEffectiveness["Ground"]["Rock"] = 2
typeEffectiveness["Ground"]["Bug"] = 0.5
typeEffectiveness["Ground"]["Steel"] = 2
typeEffectiveness["Ground"]["Fire"] = 2
typeEffectiveness["Ground"]["Grass"] = 0.5
typeEffectiveness["Ground"]["Electric"] = 2

typeEffectiveness["Rock"]["Fighting"] = 0.5
typeEffectiveness["Rock"]["Flying"] = 2
typeEffectiveness["Rock"]["Ground"] = 0.5
typeEffectiveness["Rock"]["Bug"] = 2
typeEffectiveness["Rock"]["Steel"] = 0.5
typeEffectiveness["Rock"]["Fire"] = 2
typeEffectiveness["Rock"]["Ice"] = 2

typeEffectiveness["Bug"]["Fighting"] = 0.5
typeEffectiveness["Bug"]["Flying"] = 0.5
typeEffectiveness["Bug"]["Poison"] = 0.5
typeEffectiveness["Bug"]["Ghost"] = 0.5
typeEffectiveness["Bug"]["Steel"] = 0.5
typeEffectiveness["Bug"]["Fire"] = 0.5
typeEffectiveness["Bug"]["Grass"] = 2
typeEffectiveness["Bug"]["Psychic"] = 2
typeEffectiveness["Bug"]["Dark"] = 2
typeEffectiveness["Bug"]["Fairy"] = 0.5

typeEffectiveness["Ghost"]["Normal"] = 0
typeEffectiveness["Ghost"]["Ghost"] = 2
typeEffectiveness["Ghost"]["Psychic"] = 2
typeEffectiveness["Ghost"]["Dark"] = 0.5

typeEffectiveness["Steel"]["Rock"] = 2
typeEffectiveness["Steel"]["Steel"] = 0.5
typeEffectiveness["Steel"]["Fire"] = 0.5
typeEffectiveness["Steel"]["Water"] = 0.5
typeEffectiveness["Steel"]["Electric"] = 0.5
typeEffectiveness["Steel"]["Ice"] = 2
typeEffectiveness["Steel"]["Fairy"] = 2

typeEffectiveness["Fire"]["Rock"] = 0.5
typeEffectiveness["Fire"]["Bug"] = 2
typeEffectiveness["Fire"]["Steel"] = 2
typeEffectiveness["Fire"]["Fire"] = 0.5
typeEffectiveness["Fire"]["Water"] = 0.5
typeEffectiveness["Fire"]["Grass"] = 2
typeEffectiveness["Fire"]["Ice"] = 2
typeEffectiveness["Fire"]["Dragon"] = 0.5

typeEffectiveness["Water"]["Ground"] = 2
typeEffectiveness["Water"]["Rock"] = 2
typeEffectiveness["Water"]["Fire"] = 2
typeEffectiveness["Water"]["Water"] = 0.5
typeEffectiveness["Water"]["Grass"] = 0.5
typeEffectiveness["Water"]["Dragon"] = 0.5

typeEffectiveness["Grass"]["Flying"] = 0.5
typeEffectiveness["Grass"]["Poison"] = 0.5
typeEffectiveness["Grass"]["Ground"] = 2
typeEffectiveness["Grass"]["Rock"] = 2
typeEffectiveness["Grass"]["Bug"] = 0.5
typeEffectiveness["Grass"]["Steel"] = 0.5
typeEffectiveness["Grass"]["Fire"] = 0.5
typeEffectiveness["Grass"]["Water"] = 2
typeEffectiveness["Grass"]["Grass"] = 0.5
typeEffectiveness["Grass"]["Dragon"] = 0.5

typeEffectiveness["Electric"]["Flying"] = 2
typeEffectiveness["Electric"]["Ground"] = 0
typeEffectiveness["Electric"]["Water"] = 2
typeEffectiveness["Electric"]["Grass"] = 0.5
typeEffectiveness["Electric"]["Electric"] = 0.5
typeEffectiveness["Electric"]["Dragon"] = 0.5

typeEffectiveness["Psychic"]["Fighting"] = 2
typeEffectiveness["Psychic"]["Poison"] = 2
typeEffectiveness["Psychic"]["Steel"] = 0.5
typeEffectiveness["Psychic"]["Psychic"] = 0.5
typeEffectiveness["Psychic"]["Dark"] = 0

typeEffectiveness["Ice"]["Flying"] = 2
typeEffectiveness["Ice"]["Ground"] = 2
typeEffectiveness["Ice"]["Steel"] = 0.5
typeEffectiveness["Ice"]["Fire"] = 0.5
typeEffectiveness["Ice"]["Water"] = 0.5
typeEffectiveness["Ice"]["Grass"] = 2
typeEffectiveness["Ice"]["Ice"] = 0.5
typeEffectiveness["Ice"]["Dragon"] = 2

typeEffectiveness["Dragon"]["Steel"] = 0.5
typeEffectiveness["Dragon"]["Dragon"] = 2
typeEffectiveness["Dragon"]["Fairy"] = 0

typeEffectiveness["Dark"]["Fighting"] = 0.5
typeEffectiveness["Dark"]["Ghost"] = 2
typeEffectiveness["Dark"]["Psychic"] = 2
typeEffectiveness["Dark"]["Dark"] = 0.5
typeEffectiveness["Dark"]["Fairy"] = 0.5

typeEffectiveness["Fairy"]["Fighting"] = 2
typeEffectiveness["Fairy"]["Poison"] = 0.5
typeEffectiveness["Fairy"]["Steel"] = 0.5
typeEffectiveness["Fairy"]["Fire"] = 0.5
typeEffectiveness["Fairy"]["Dragon"] = 2
typeEffectiveness["Fairy"]["Dark"] = 2

const pokemonStatusData = {
	"burn": {
		image: "src/img/icons/burn.png",
		color: "#ff8329",
		stacks: false,
		class: "debuff",
		name: "burn"
	},
	"confused": {
		image: "src/img/icons/confused.png",
		color: "#f97077",
		stacks: false,
		class: "debuff",
		name: "confused"
	},
	"poisoned": {
		image: "src/img/icons/poisoned.png",
		color: "#c763c5",
		stacks: false,
		class: "debuff",
		name: "poisoned"
	},
	"paralyzed": {
		image: "src/img/icons/paralyzed.png",
		color: "#ffcf00",
		stacks: false,
		class: "debuff",
		name: "poisoned"
	},
	"invulnerable": {
		image: "src/img/icons/shield.png",
		color: "rgb(122, 104, 223)",
		stacks: false,
		class: "buff",
		name: "invulnerable"
	},
	"drowsy": {
		image: "src/img/icons/yawn.png",
		color: "rgb(61, 79, 197)",
		stacks: false,
		class: "debuff",
		exclusiveTo: ["asleep"],
		name: "drowsy"
	},
	"asleep": {
		image: "src/img/icons/sleep.png",
		color: "rgb(34, 51, 158)",
		stacks: false,
		class: "debuff",
		canReplace: ["drowsy"],
		name: "asleep"
	},
}
for (let statusName in pokemonStatusData){
	let statusType = pokemonStatusData[statusName]
	if (!statusType.exclusiveTo){
		statusType.exclusiveTo = []
	}
	if (!statusType.canReplace){
		statusType.canReplace = []
	}
}

const tileStatusData = {
	"Energy Down": {
		url: "src/img/icons/down-arrow.png"
	},
	"Infested": {
		url: "src/img/icons/ladybug.png"
	},
	"Wrap": {
		url: "src/img/icons/thorny-tentacle.png"
	},
	"Burn": {
		url: "src/img/icons/burn-tile.png"
	},
	"Static": {
		url: "src/img/icons/electric.png"
	},
	"Locked": {
		url: "src/img/icons/plain-padlock.png"
	},
	"Cursed": {
		url: "src/img/icons/curse.png"
	}
}

const natures = [
	{name: "hardy", increase: "attack", decrease: "attack"},
	{name: "lonely", increase: "attack", decrease: "defense"},
	{name: "brave", increase: "attack", decrease: "speed"},
	{name: "adamant", increase: "attack", decrease: "specialAttack"},
	{name: "naughty", increase: "attack", decrease: "specialDefense"},
	{name: "bold", increase: "defense", decrease: "attack"},
	{name: "docile", increase: "defense", decrease: "defense"},
	{name: "relaxed", increase: "defense", decrease: "speed"},
	{name: "impish", increase: "defense", decrease: "specialAttack"},
	{name: "lax", increase: "defense", decrease: "specialDefense"},
	{name: "timid", increase: "speed", decrease: "attack"},
	{name: "hasty", increase: "speed", decrease: "defense"},
	{name: "serious", increase: "speed", decrease: "speed"},
	{name: "jolly", increase: "speed", decrease: "specialAttack"},
	{name: "naive", increase: "speed", decrease: "specialDefense"},
	{name: "modest", increase: "specialAttack", decrease: "attack"},
	{name: "mild", increase: "specialAttack", decrease: "defense"},
	{name: "quiet", increase: "specialAttack", decrease: "speed"},
	{name: "bashful", increase: "specialAttack", decrease: "specialAttack"},
	{name: "rash", increase: "specialAttack", decrease: "specialDefense"},
	{name: "calm", increase: "specialDefense", decrease: "attack"},
	{name: "gentle", increase: "specialDefense", decrease: "defense"},
	{name: "sassy", increase: "specialDefense", decrease: "speed"},
	{name: "careful", increase: "specialDefense", decrease: "specialAttack"},
	{name: "quirky", increase: "specialDefense", decrease: "specialDefense"},
]
function getRandomNature(){
	return randomChoice(natures)
}

function getStatAbbr(stat){
	switch (stat){
		case "hp":
		return "HP"
		case "attack":
		return "ATK"
		case "defense":
		return "DEF"
		case "specialAttack":
		return "SpATK"
		case "specialDefense":
		return "SpDEF"
		case "speed":
		return "SPD"
	}
}
function getStatName(stat){
	switch (stat){
		case "hp":
		return "HP"
		case "attack":
		return "Attack"
		case "defense":
		return "Defense"
		case "specialAttack":
		return "Special Attack"
		case "specialDefense":
		return "Special Defense"
		case "speed":
		return "Speed"
	}
}

function getTypeFromTileType(type){
	switch (type){
		case "red": return "Fire"
		case "orange": return "Fighting"
		case "yellow": return "Electric"
		case "green": return "Grass"
		case "blue": return "Water"
		case "purple": return "Psychic"
		case "black": return "Dark"
		default:
			console.warn("What type is ", type)
	}
}

function checkIfPokemonMeetsRequirements(pokemon, req){
	if (!req) return true
	if (req.type === "level"){
		return pokemon.level >= req.amount
	}
	if (req.type === "pre-evolve"){
		//This is the type for when a move may only be learned by a pre-evolved version of that pokemon.
		return false
	}
	if (req.type === "never" || req.type === "hidden"){
		return false
	}
	console.warn("You never handled this", req)
	return false
}
function getReasonPokemonDoesntMeetRequirements(pokemon, move){
	let moveIndex = pokemon.moves.indexOf(move)
	let req = pokemon.data.learnset.find(m => m.name === move.name).unlock
	if (!req) return "This move doesn't require anything. Why can't you use it? Man, Boo sucks at programming."
	if (req.type === "level"){
		if (pokemon.level < req.amount){
			return `Your Pokemon needs to be at least level ${req.amount} to use this move.`
		} else {
			return `Your Pokemon needs to be at least... wait, they're high enough level. Huh????`
		}
	}
	else if (req.type === "pre-evolve"){
		return "A less evolved version of this pokemon could've learned this move.	"
	}
	else if (req.type === "never"){
		return "Your Pokemon should NEVER be able to use this move. Why is this message even showing? You should tell Boo about this."
	}
	else if (req.type === "hidden"){
		return "Your Pokemon should NEVER be able to use this move. You shouldn't even be able to see this one?? It's listed as hidden. Why can you see this?? Go yell at Boo. (Preferably with screenshots)"
	}
	console.warn("You never handled this", req)
	return "I don't know why they can't use this move. *shrug*"
}

function getEffectParams(effect, effectIndex, moveUseObj){
	let obj = {}
	for (let key in effect){
		if (typeof effect[key] === "number"){
			let index = effect[key]
			if (index < 0) index = effectIndex + index
			if (moveUseObj.info[index] !== undefined){
				obj[key] = moveUseObj.info[index]
			}
		}
	}
	return obj
}

function getAllStatusSprites(){
	let arr = []
	for (let name in tileStatusData){
		let status = tileStatusData[name]
		if (status.url){
			arr.push({
				name: "status-"+name,
				url: status.url
			})
		}
	}
	return arr
}

function isPokemonUsable(pokemon){
	return pokemon.hp > 0
}
function getUsablePokemon(pokemonList){
	return pokemonList.filter(isPokemonUsable)
}