const pokemonData = {
	"Popplio": {
		name: "Popplio",
		imageSources: {
			"Popplio": "src/img/0728Popplio.png"
		},
		stats: {
			hp: 50,
			attack: 54,
			defense: 54,
			specialAttack: 66,
			specialDefense: 56,
			speed: 40
		},
		learnset: [
			{name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
	"Comfey": {
		name: "Comfey",
		imageSources: {
			"Comfey": "src/img/0764Comfey.png"
		},
		stats: {
			hp: 51,
			attack: 52,
			defense: 90,
			specialAttack: 82,
			specialDefense: 110,
			speed: 100
		}
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
}

const pokemonMoveData = {
	"Pound": {
		name: "Pound",
		type: "Normal",
		category: "Physical",
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
	}
}

function checkIfPokemonMeetsRequirements(pokemon, req){
	if (!req) return true
	if (req.type === "level"){
		return pokemon.level >= req.amount
	}
	console.log("You never handled this", req)
	return false
}