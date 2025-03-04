const pokemonData = {
	"Rattata-Alola": {
		name: "Rattata",
		number: "19",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0019Rattata-Alola.png",
			"home": "src/img/tiny-pokemon/Rattata-Alola.png"
		},
		sounds: {
			cry: "src/audio/cries/rattata.mp3"
		},
		types: ["Dark", "Normal"],
		tags: [],
		stats: {
			hp: 30,
			attack: 56,
			defense: 35,
			specialAttack: 25,
			specialDefense: 35,
			speed: 72
		},
		expYield: 51,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		learnset: [
			{
				name: "Tackle",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Tail Whip",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
	"Caterpie": {
		name: "Caterpie",
		number: "10",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0010Caterpie.png",
			"home": "src/img/tiny-pokemon/Caterpie.png"
		},
		sounds: {
			cry: "src/audio/cries/caterpie.mp3"
		},
		types: ["Bug"],
		tags: [],
		stats: {
			hp: 45,
			attack: 30,
			defense: 35,
			specialAttack: 20,
			specialDefense: 20,
			speed: 45
		},
		expYield: 39,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		learnset: [
			{
				name: "Tackle",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "String Shot",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Bug Bite",
				unlock: {
					type: "level",
					amount: 9
				}
			}
		]
	},
	"Ledyba": {
		name: "Ledyba",
		number: "165",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0165Ledyba.png",
			"home": "src/img/tiny-pokemon/Ledyba.png"
		},
		sounds: {
			cry: "src/audio/cries/ledyba.mp3"
		},
		types: ["Bug", "Flying"],
		tags: [],
		stats: {
			hp: 40,
			attack: 20,
			defense: 30,
			specialAttack: 40,
			specialDefense: 80,
			speed: 55
		},
		expYield: 53,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		learnset: [
			{
				name: "Tackle",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Supersonic",
				unlock: {
					type: "level",
					amount: 5
				}
			},
			{
				name: "Swift",
				unlock: {
					type: "level",
					amount: 1
				}
			}
		]
	},
	"Rowlet": {
		name: "Rowlet",
		number: "722",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0722Rowlet.png",
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
			{
				name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Growl",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Leafage",
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
			"large": "src/img/pokemon/0725Litten.png",
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
			{
				name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Growl",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Ember",
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
			"large": "src/img/pokemon/0728Popplio.png",
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
			{
				name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Growl",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Water Gun",
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
			"large": "src/img/pokemon/0731Pikipek.png",
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
			{
				name: "Peck",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Growl",
				unlock: {
					type: "level",
					amount: 3
				}
			},
		]
	},
	"Yungoos": {
		name: "Yungoos",
		number: "734",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0734Yungoos.png",
			"home": "src/img/tiny-pokemon/Yungoos.png"
		},
		sounds: {
			cry: "src/audio/cries/yungoos.mp3"
		},
		tags: ["Starter"],
		types: ["Normal"],
		stats: {
			hp: 48,
			attack: 70,
			defense: 30,
			specialAttack: 30,
			specialDefense: 30,
			speed: 45
		},
		expYield: 51,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		learnset: [
			{
				name: "Tackle",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Leer",
				unlock: {
					type: "level",
					amount: 3
				}
			},
			{
				name: "Payback",
				unlock: {
					type: "level",
					amount: 7
				}
			},
		]
	},
	"Comfey": {
		name: "Comfey",
		number: "764",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0764Comfey.png",
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
			{
				name: "Wrap",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
};

for (let name in pokemonData){
	let pokemon = pokemonData[name]
	if (!pokemon.name) {
		pokemon.name = name
	}
	if (!pokemon.imageSources){
		pokemon.imageSources = {}
	}
	if (!pokemon.imageSources.large){
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