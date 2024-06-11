
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
typeEffectiveness["Fighting"]["Normal"] = 1
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
//TODO the rest of these damn things

const pokemonData = {
	"Popplio": {
		name: "Popplio",
		imageFacing: "right",
		imageSources: {
			"Popplio": "src/img/pokemon/0728Popplio.png"
		},
		sounds: {
			cry: "src/audio/cries/popplio.mp3"
		},
		types: ["Water"],
		tags: ["Starter"],
		stats: {
			hp: 50,
			attack: 54,
			defense: 54,
			specialAttack: 66,
			specialDefense: 56,
			speed: 40
		},
		expYield: 64,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		learnset: [
			{name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{name: "Growl",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{name: "Water Gun",
				unlock: {
					type: "level",
					amount: 3
				}
			}
		]
	},
	"Comfey": {
		name: "Comfey",
		imageFacing: "left",
		imageSources: {
			"Comfey": "src/img/pokemon/0764Comfey.png"
		},
		sounds: {
			cry: "src/audio/cries/comfey.mp3"
		},
		tags: ["Starter"],
		types: ["Fairy"],
		stats: {
			hp: 51,
			attack: 52,
			defense: 90,
			specialAttack: 82,
			specialDefense: 110,
			speed: 100
		},
		expYield: 170,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		learnset: [
			{name: "Wrap",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
}

for (let name in pokemonData){
	let pokemon = pokemonData[name]
	if (!pokemon.name) {
		pokemon.name = name
	}
	if (!pokemon.imageSources){
		pokemon.imageSources = {}
	}
	if (!pokemon.imageSources[pokemon.name]){
		console.warn(pokemon, "has no images")
	}
	if (!pokemon.stats){
		pokemon.stats = {
			hp: 50,
			attack: 50,
			defense: 50,
			specialAttack: 50,
			specialDefense: 50,
			speed: 50
		}
	}
	if (!pokemon.learnset){
		pokemon.learnset = []
	}
	if (!pokemon.types){
		pokemon.types = []
	}
	if (!pokemon.tags){
		pokemon.tags = []
	}
	if (!pokemon.expYield){
		console.warn("You really gotta give "+pokemon.name+" a yield man")
		pokemon.expYield = 50
	}
	if (!pokemon.evYield){
		pokemon.evYield = {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		}
	}
}

const pokemonMoveData = {
	"Struggle": {
		name: "Struggle",
		type: "Typeless",
		category: "Physical",
		strategy: "last-priority",
		pp: 1,
		power: 50,
		rechargeTurns: 0,
		energy: {},
		effects: [
			{type: "damage"},
			{type: "recoil-percent", percent: 0.25},
			{type: "shuffle"},
			{type: "end-turn"}
		],
		shortDescription: "Reshuffle board. Does recoil damage. Ends the turn.",
		description: "An attack of desperation only useful when there are no available moves. It also hurts its user a little, before ending the current turn."
	},
	"Pound": {
		name: "Pound",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 3
		},
		effects: [
			{type: "choose-tiles", count: 2},
			{type: "damage"}
		],
		shortDescription: "Deals light damage",
		description: "Damage-dealing move with no special effects."
	},
	"Growl": {
		name: "Growl",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 3,
			green: 3
		},
		effects: [
			{type: "apply-debuff", debuff: {
				type: "stat",
				stat: "attack",
				amount: -1
			}}
		],
		shortDescription: "Lowers enemy attack",
		description: "Lowers the opponent's attack stat by 1 stage."
	},
	"Water Gun": {
		name: "Water Gun",
		type: "Water",
		category: "Special",
		strategy: "damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 6
		},
		effects: [
			{type: "count-tiles", options: {type: "blue"}},
			{type: "load-number", value: 2},
			{type: "multiply-numbers"},
			{type: "damage", additivePower: 2}
		],
		shortDescription: "Damage based on Water tiles",
		description: "Deals damage. This move's power increases by 2 for every Water tile on the board."
	},
	"Wrap": {
		name: "Wrap",
		type: "Normal",
		category: "Physical",
		strategy: "damage",
		pp: 20,
		power: 15,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			green: 0,
			purple: 0
		},
		effects: [
			{type: "random-number", min: 2, max: 5},
			// {type: "random-number", min: 50, max: 50},
			{type: "select-random-tiles", count: -1},
			{type: "apply-status-to-tiles", selection: "group", which: -1,
				status: {name: "Wrap", type: "debuff", duration: null}
			},
		],
		shortDescription: "Damages over time",
		description: "Gives 2-5 tiles on the board the Wrap status. When an opponent removes those tiles, this move deals them damage."
	},
}

const statuses = {
	"Wrap": {
		url: "src/img/icons/thorny-tentacle.png"
	}
}

for (let name in pokemonData){
	pokemonData[name].learnset.splice(0, 0, {
		name: "Struggle",
		unlock: {
			type: "never"
		}
	})
}

const natures = [
	{name: "hardy", increase: "attack", decrease: "attack"},
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

function checkIfPokemonMeetsRequirements(pokemon, req){
	if (!req) return true
	if (req.type === "level"){
		return pokemon.level >= req.amount
	}
	if (req.type === "never"){
		return false
	}
	console.log("You never handled this", req)
	return false
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
	for (let name in statuses){
		let status = statuses[name]
		if (status.url){
			arr.push({
				name: "status-"+name,
				url: status.url
			})
		}
	}
	return arr
}