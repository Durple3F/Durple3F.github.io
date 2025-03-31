const pokemonData = {
	"Rattata-Alola": {
		name: "Rattata",
		id: "Rattata-Alola",
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
		tags: ["Starter"],
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
		energyMastery: {
			orange: 2,
			purple: 3
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
			{
				name: "Quick Attack",
				unlock: {
					type: "level",
					amount: 4
				}
			},
			{
				name: "Focus Energy",
				unlock: {
					type: "level",
					amount: 7
				}
			},
			{
				name: "Bite",
				unlock: {
					type: "level",
					amount: 10
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
		energyMastery: {
			green: 3,
			yellow: 1
		},
		evolutions: [
			{
				name: "Metapod",
				unlock: {
					type: "level",
					amount: 7
				}
			}
		],
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
	"Metapod": {
		name: "Metapod",
		number: "11",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0011Metapod.png",
			"home": "src/img/tiny-pokemon/Metapod.png"
		},
		sounds: {
			cry: "src/audio/cries/metapod.mp3"
		},
		types: ["Bug"],
		tags: [],
		stats: {
			hp: 50,
			attack: 20,
			defense: 55,
			specialAttack: 25,
			specialDefense: 25,
			speed: 30
		},
		expYield: 72,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 7,
			yellow: 2,
			purple: 3
		},
		evolutions: [
			{
				name: "Butterfree",
				unlock: {
					type: "level",
					amount: 10
				}
			}
		],
		learnset: [
			{
				name: "Harden",
				unlock: {
					type: "level",
					amount: 1
				}
			}
		]
	},
	"Butterfree": {
		name: "Butterfree",
		number: "12",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0012Butterfree.png",
			"home": "src/img/tiny-pokemon/Butterfree.png"
		},
		sounds: {
			cry: "src/audio/cries/butterfree.mp3"
		},
		types: ["Bug", "Flying"],
		tags: [],
		stats: {
			hp: 60,
			attack: 45,
			defense: 50,
			specialAttack: 80,
			specialDefense: 80,
			speed: 70
		},
		expYield: 178,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			
		},
		learnset: [

		]
	},
	"Slowpoke": {
		name: "Slowpoke",
		number: "79",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0079Slowpoke.png",
			"home": "src/img/tiny-pokemon/Slowpoke.png"
		},
		sounds: {
			cry: "src/audio/cries/slowpoke.mp3"
		},
		types: ["Water", "Psychic"],
		tags: [],
		stats: {
			hp: 90,
			attack: 65,
			defense: 65,
			specialAttack: 40,
			specialDefense: 40,
			speed: 15
		},
		expYield: 63,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			blue: 3,
			purple: 3
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
				name: "Curse",
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
			{
				name: "Water Gun",
				unlock: {
					type: "level",
					amount: 6
				}
			},
			{
				name: "Yawn",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
	"Magnemite": {
		name: "Magnemite",
		number: "81",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0081Magnemite.png",
			"home": "src/img/tiny-pokemon/Magnemite.png"
		},
		sounds: {
			cry: "src/audio/cries/magnemite.mp3"
		},
		types: ["Electric", "Steel"],
		tags: ["Starter"],
		stats: {
			hp: 25,
			attack: 35,
			defense: 70,
			specialAttack: 95,
			specialDefense: 55,
			speed: 45
		},
		expYield: 65,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 5,
			orange: 2
		},
		learnset: [
			{
				name: "Thunder Shock",
				unlock: {
					type: "level",
					amount: 1
				}
			},
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
					amount: 4
				}
			},
			{
				name: "Thunder Wave",
				unlock: {
					type: "level",
					amount: 1
				}
			},
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
		energyMastery: {
			green: 3,
			purple: 5
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
					amount: 8
				}
			}
		]
	},
	"Spinarak": {
		name: "Spinarak",
		number: "167",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0167Spinarak.png",
			"home": "src/img/tiny-pokemon/Spinarak.png"
		},
		sounds: {
			cry: "src/audio/cries/spinarak.mp3"
		},
		types: ["Bug", "Poison"],
		tags: [],
		stats: {
			hp: 40,
			attack: 60,
			defense: 40,
			specialAttack: 40,
			specialDefense: 40,
			speed: 30
		},
		expYield: 50,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 5,
			purple: 3
		},
		learnset: [
			{
				name: "Poison Sting",
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
				name: "Absorb",
				unlock: {
					type: "level",
					amount: 4
				}
			},
			{
				name: "Infestation",
				unlock: {
					type: "level",
					amount: 7
				}
			},
		]
	},
	"Pichu": {
		name: "Pichu",
		number: "172",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0172Pichu.png",
			"home": "src/img/tiny-pokemon/Pichu.png"
		},
		sounds: {
			cry: "src/audio/cries/pichu.mp3"
		},
		types: ["Electric"],
		tags: [],
		stats: {
			hp: 20,
			attack: 40,
			defense: 15,
			specialAttack: 35,
			specialDefense: 35,
			speed: 60
		},
		expYield: 41,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			yellow: 4,
			orange: 2
		},
		learnset: [
			{
				name: "Thunder Shock",
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
			{
				name: "Play Nice",
				unlock: {
					type: "level",
					amount: 4
				}
			},
			{
				name: "Sweet Kiss",
				unlock: {
					type: "level",
					amount: 8
				}
			},
			{
				name: "Nuzzle",
				unlock: {
					type: "level",
					amount: 12
				}
			},
			{
				name: "Nasty Plot",
				unlock: {
					type: "level",
					amount: 16
				}
			},
			{
				name: "Charm",
				unlock: {
					type: "level",
					amount: 20
				}
			},
		]
	},
	"Wingull": {
		name: "Wingull",
		number: "278",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0278Wingull.png",
			"home": "src/img/tiny-pokemon/Wingull.png"
		},
		sounds: {
			cry: "src/audio/cries/wingull.mp3"
		},
		types: ["Water", "Flying"],
		tags: [],
		stats: {
			hp: 40,
			attack: 30,
			defense: 30,
			specialAttack: 55,
			specialDefense: 30,
			speed: 85
		},
		expYield: 54,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			red: 1,
			orange: 1,
			yellow: 1,
			green: 1,
			blue: 3,
			purple: 1,
		},
		learnset: [
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
					amount: 1
				}
			},
			{
				name: "Quick Attack",
				unlock: {
					type: "level",
					amount: 5
				}
			},
			{
				name: "Supersonic",
				unlock: {
					type: "level",
					amount: 10
				}
			},
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
		energyMastery: {
			green: 5,
			purple: 3
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
			},
			{
				name: "Astonish",
				unlock: {
					type: "level",
					amount: 6
				}
			},
			{
				name: "Peck",
				unlock: {
					type: "level",
					amount: 9
				}
			},
			{
				name: "Shadow Sneak",
				unlock: {
					type: "level",
					amount: 12
				}
			},
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
		energyMastery: {
			red: 5,
			purple: 3
		},
		learnset: [
			{
				name: "Scratch",
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
			},
			{
				name: "Lick",
				unlock: {
					type: "level",
					amount: 6
				}
			},
			{
				name: "Roar",
				unlock: {
					type: "level",
					amount: 9
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
		abilities: ["Torrent"],
		hiddenAbilities: ["Liquid Voice"],
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
		energyMastery: {
			blue: 5,
			purple: 3
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
			},
			{
				name: "Disarming Voice",
				unlock: {
					type: "level",
					amount: 6
				}
			},
			{
				name: "Aqua Jet",
				unlock: {
					type: "level",
					amount: 9
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
		energyMastery: {
			yellow: 4,
			orange: 2
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
			{
				name: "Echoed Voice",
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
		tags: [],
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
		energyMastery: {
			purple: 5,
			green: 2
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
	"Grubbin": {
		name: "Grubbin",
		number: "736",
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0736Grubbin.png",
			"home": "src/img/tiny-pokemon/Grubbin.png"
		},
		sounds: {
			cry: "src/audio/cries/grubbin.mp3"
		},
		tags: [],
		types: ["Bug"],
		stats: {
			hp: 47,
			attack: 62,
			defense: 45,
			specialAttack: 55,
			specialDefense: 45,
			speed: 46
		},
		expYield: 60,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 2,
			green: 5
		},
		learnset: [
			{
				name: "Vise Grip",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Mud-Slap",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "String Shot",
				unlock: {
					type: "level",
					amount: 5
				}
			},
			{
				name: "Bug Bite",
				unlock: {
					type: "level",
					amount: 10
				}
			}
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
		energyMastery: {
			purple: 2,
			green: 5
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

//Make sure all data is regular
for (let name in pokemonData) {
	let pokemon = pokemonData[name]
	if (!pokemon.name) {
		console.warn(pokemon, "is missing a name!")
		pokemon.name = name
	}
	if (!pokemon.id) {
		pokemon.id = name
	}
	if (!pokemon.imageSources) {
		pokemon.imageSources = {}
	}
	if (!pokemon.imageSources.large) {
		console.warn(pokemon, "has no images")
	}
	if (!pokemon.stats) {
		console.warn(pokemon, "is missing stats!")
		pokemon.stats = {
			hp: 50,
			attack: 50,
			defense: 50,
			specialAttack: 50,
			specialDefense: 50,
			speed: 50
		}
	}
	if (!pokemon.learnset) {
		console.warn(pokemon, "is missing moves!")
		pokemon.learnset = []
	}
	if (!pokemon.types) {
		console.warn(pokemon, "is missing types!")
		pokemon.types = []
	}
	if (!pokemon.tags) {
		pokemon.tags = []
	}
	if (!pokemon.expYield) {
		console.warn("You really gotta give " + pokemon.name + " a yield man")
		pokemon.expYield = 50
	}
	if (!pokemon.evYield) {
		console.warn(pokemon, "is missing evs!")
		pokemon.evYield = {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		}
	}
	if (!pokemon.evolutions) {
		pokemon.evolutions = []
	}
	if (!pokemon.energyMastery) {
		console.warn(pokemon, "is missing energy affinity!")
		pokemon.energyMastery = {}
	}
	for (let type of tileTypes){
		pokemon.energyMastery[type] = pokemon.energyMastery[type] ?? 0
	}
	if (!pokemon.abilities) {
		pokemon.abilities = []
	}
	if (!pokemon.hiddenAbilities) {
		pokemon.hiddenAbilities = []
	}
}