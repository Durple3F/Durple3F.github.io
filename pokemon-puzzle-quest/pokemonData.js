
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

const pokemonData = {
	"Rowlet": {
		name: "Rowlet",
		number: "722",
		imageFacing: "left",
		imageSources: {
			"Rowlet": "src/img/pokemon/0722Rowlet.png",
			"home": "src/img/tiny-pokemon/Rowlet.png"
		},
		sounds: {
			cry: "src/audio/cries/rowlet.mp3"
		},
		types: ["Grass"],
		tags: ["Starter"],
		stats: {
			hp: 68,
			attack: 55,
			defense: 55,
			specialAttack: 50,
			specialDefense: 50,
			speed: 42
		},
		expYield: 64,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
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
			{name: "Leafage",
				unlock: {
					type: "level",
					amount: 3
				}
			}
		]
	},
	"Litten": {
		name: "Litten",
		number: "725",
		imageFacing: "left",
		imageSources: {
			"Litten": "src/img/pokemon/0725Litten.png",
			"home": "src/img/tiny-pokemon/Litten.png"
		},
		sounds: {
			cry: "src/audio/cries/litten.mp3"
		},
		types: ["Fire"],
		tags: ["Starter"],
		stats: {
			hp: 45,
			attack: 65,
			defense: 40,
			specialAttack: 60,
			specialDefense: 40,
			speed: 70
		},
		expYield: 64,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
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
			{name: "Ember",
				unlock: {
					type: "level",
					amount: 3
				}
			}
		]
	},
	"Popplio": {
		name: "Popplio",
		number: "728",
		imageFacing: "right",
		imageSources: {
			"Popplio": "src/img/pokemon/0728Popplio.png",
			"home": "src/img/tiny-pokemon/Popplio.png"
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
	"Pikipek": {
		name: "Pikipek",
		number: "731",
		imageFacing: "left",
		imageSources: {
			"Pikipek": "src/img/pokemon/0731Pikipek.png",
			"home": "src/img/tiny-pokemon/Pikipek.png"
		},
		sounds: {
			cry: "src/audio/cries/pikipek.mp3"
		},
		tags: [],
		types: ["Flying"],
		stats: {
			hp: 35,
			attack: 75,
			defense: 30,
			specialAttack: 30,
			specialDefense: 30,
			speed: 65
		},
		expYield: 53,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		learnset: [
			{name: "Peck",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{name: "Growl",
				unlock: {
					type: "level",
					amount: 3
				}
			},
		]
	},
	"Comfey": {
		name: "Comfey",
		number: "764",
		imageFacing: "left",
		imageSources: {
			"Comfey": "src/img/pokemon/0764Comfey.png",
			"home": "src/img/tiny-pokemon/Comfey.png"
		},
		sounds: {
			cry: "src/audio/cries/comfey.mp3"
		},
		tags: [],
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
	"Ember": {
		name: "Ember",
		type: "Fire",
		category: "Special",
		strategy: "damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 5
		},
		effects: [
			{type: "damage"},
			{type: "random-number", min: 1, max: 10},
			{type: "jump-if-less-than", value: 1, jumpTo: Infinity},
			{type: "load-number", value: 3},
			{type: "select-random-tiles", count: -1},
			{type: "apply-status-to-tiles", selection: "group", which: -1,
				status: {name: "Burn", type: "debuff", duration: null}
			},
		],
		shortDescription: "Damages and might burn tiles.",
		description: "Deals damage. There's a 10% chance for this move to inflict Burn on 3 random tiles. At the start of each turn, the opponent takes damage for each Burned tile on the board."
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
	"Leafage": {
		name: "Leafage",
		type: "Grass",
		category: "Physical",
		strategy: "damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 3
		},
		effects: [
			{type: "damage"},
			{type: "load-number", value: 40},
			{type: "select-random-tiles", count: -1},
			{type: "change-tile-type", selection: "group", which: -1, targetType: "green"},
		],
		shortDescription: "Damages and turns tiles into Grass tiles.",
		description: "Deals damage. 3 random tiles are transformed into Grass tiles."
	},
	"Peck": {
		name: "Peck",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 35,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Peck.mp3"
		},
		effects: [
			{type: "play-sound", name: "attack"},
			{type: "damage"}
		],
		shortDescription: "Deals light damage",
		description: "Damage-dealing move with no special effects."
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
		sounds: {
			"attack": "src/audio/attacks/Pound.mp3"
		},
		effects: [
			{type: "play-sound", name: "attack"},
			{type: "damage"}
		],
		shortDescription: "Deals light damage",
		description: "Damage-dealing move with no special effects."
	},
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
			{type: "select-random-tiles", count: -1},
			{type: "apply-status-to-tiles", selection: "group", which: -1,
				status: {name: "Wrap", type: "debuff", duration: null}
			},
		],
		shortDescription: "Damages over time",
		description: "Gives 2-5 tiles on the board the Wrap status. When an opponent removes those tiles, this move deals them damage."
	},
}

const pokemonStatusData = {
	"burn": {
		image: "src/img/icons/burn.png",
		color: "#ff8329",
		stacks: false,
		name: "Burned",
		description: "This Pokemon's physical moves are half as powerful, and at the start of its turn, it takes 1/16 of its max HP in damage."
	}
}

const tileStatusData = {
	"Wrap": {
		url: "src/img/icons/thorny-tentacle.png"
	},
	"Burn": {
		url: "src/img/icons/burn-tile.png"
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

function checkIfPokemonMeetsRequirements(pokemon, req){
	if (!req) return true
	if (req.type === "level"){
		return pokemon.level >= req.amount
	}
	if (req.type === "never"){
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
	if (req.type === "never"){
		return "Your Pokemon should NEVER be able to use this move and that is a GOOD thing because they are too STUPID to use it anyway."
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