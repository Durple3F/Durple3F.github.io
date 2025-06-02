const pokemonData = {
	"Caterpie": {
		name: "Caterpie",
		number: "10",
		weight: {
			pounds: 6.4,
			kilograms: 2.9
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0010Caterpie.png",
			"largeShiny": "src/img/shiny-pokemon/010-Caterpie.png",
			"home": "src/img/tiny-pokemon/Caterpie.png"
		},
		sounds: {
			"cry": "src/audio/cries/caterpie.mp3"
		},
		types: ["Bug"],
		tags: [],
		abilities: ["Shield Dust"],
		hiddenAbilities: ["Run Away"],
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
			yellow: 1,
			blue: 3
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
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 9 } }
		]
	},
	"Metapod": {
		name: "Metapod",
		number: "11",
		weight: {
			pounds: 21.8,
			kilograms: 9.9
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0011Metapod.png",
			"largeShiny": "src/img/shiny-pokemon/011-Metapod.png",
			"home": "src/img/tiny-pokemon/Metapod.png"
		},
		sounds: {
			"cry": "src/audio/cries/metapod.mp3"
		},
		types: ["Bug"],
		tags: [],
		abilities: ["Shed Skin"],
		hiddenAbilities: [],
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
			green: 4,
			yellow: 1,
			blue: 4
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
			{ name: "Harden", unlock: { type: "level", amount: 1 } }  //NOTE: Should be learned upon evolution.
		]
	},
	"Butterfree": {
		name: "Butterfree",
		number: "12",
		weight: {
			pounds: 70.5,
			kilograms: 32.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0012Butterfree.png",
			"largeShiny": "src/img/shiny-pokemon/012-Butterfree.png",
			"home": "src/img/tiny-pokemon/Butterfree.png"
		},
		sounds: {
			"cry": "src/audio/cries/butterfree.mp3"
		},
		types: ["Bug", "Flying"],
		tags: [],
		abilities: ["Compound Eyes"],
		hiddenAbilities: ["Tinted Lens"],
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
			yellow: 2,
			green: 4,
			blue: 4,
			purple: 3
		},
		learnset: [
			{ name: "Gust", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 4 } },
			{ name: "Confusion", unlock: { type: "level", amount: 8 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 12 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 12 } },
			{ name: "Sleep Powder", unlock: { type: "level", amount: 12 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 16 } },
			{ name: "Whirlwind", unlock: { type: "level", amount: 20 } },
		]
	},
	"Rattata": {
		name: "Rattata",
		number: "19",
		weight: {
			pounds: 7.7,
			kilograms: 3.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0019Rattata.png",
			"largeShiny": "src/img/shiny-pokemon/019-Rattata.png",
			"home": "src/img/tiny-pokemon/Rattata.png"
		},
		sounds: {
			"cry": "src/audio/cries/rattata.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Run Away", "Guts"],
		hiddenAbilities: ["Hustle"],
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
			orange: 3,
			purple: 2
		},
		evolutions: [
			// { name: "Raticate", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 4 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 7 } },
			{ name: "Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Pursuit", unlock: { type: "level", amount: 13 } },
			{ name: "Hyper Fang", unlock: { type: "level", amount: 16 } },
			{ name: "Assurance", unlock: { type: "level", amount: 19 } },
			{ name: "Crunch", unlock: { type: "level", amount: 22 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 25 } },
			{ name: "Super Fang", unlock: { type: "level", amount: 28 } },
		]
	},
	"Rattata-Alola": {
		name: "Rattata",
		id: "Rattata-Alola",
		number: "19a",
		weight: {
			pounds: 8.4,
			kilograms: 3.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0019Rattata-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/019-Rattata-Alola.png",
			"home": "src/img/tiny-pokemon/Rattata-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/rattata.mp3"
		},
		types: ["Dark", "Normal"],
		tags: [],
		abilities: ["Gluttony", "Hustle"],
		hiddenAbilities: ["Thick Fat"],
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
		evolutions: [
			{ name: "Raticate-Alola", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 4 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 7 } },
			{ name: "Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Pursuit", unlock: { type: "level", amount: 13 } },
			{ name: "Hyper Fang", unlock: { type: "level", amount: 16 } },
			{ name: "Assurance", unlock: { type: "level", amount: 19 } },
			{ name: "Crunch", unlock: { type: "level", amount: 22 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 25 } },
			{ name: "Super Fang", unlock: { type: "level", amount: 28 } },
		]
	},
	"Raticate-Alola": {
		name: "Raticate",
		id: "Raticate-Alola",
		number: "20a",
		weight: {
			pounds: 56.2,
			kilograms: 25.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0020Raticate-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/020-Raticate-Alola.png",
			"home": "src/img/tiny-pokemon/Raticate-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/raticate.mp3"
		},
		types: ["Dark", "Normal"],
		tags: [],
		abilities: ["Gluttony", "Hustle"],
		hiddenAbilities: ["Thick Fat"],
		stats: {
			hp: 75,
			attack: 71,
			defense: 70,
			specialAttack: 40,
			specialDefense: 80,
			speed: 77
		},
		expYield: 145,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			orange: 3,
			purple: 4,
			yellow: 2
		},
		learnset: [
			{ name: "Scary Face", unlock: { type: "level", amount: 1 } },
			{ name: "Swords Dance", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Pursuit", unlock: { type: "level", amount: 13 } },
			{ name: "Hyper Fang", unlock: { type: "level", amount: 16 } },
			{ name: "Assurance", unlock: { type: "level", amount: 19 } },
			{ name: "Crunch", unlock: { type: "level", amount: 24 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 29 } },
			{ name: "Super Fang", unlock: { type: "level", amount: 34 } },
		]
	},
	"Spearow": {
		name: "Spearow",
		number: "21",
		weight: {
			pounds: 4.4,
			kilograms: 2.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0021Spearow.png",
			"largeShiny": "src/img/shiny-pokemon/021-Spearow.png",
			"home": "src/img/tiny-pokemon/Spearow.png"
		},
		sounds: {
			"cry": "src/audio/cries/spearow.mp3"
		},
		types: ["Normal", "Flying"],
		tags: [],
		abilities: ["Keen Eye"],
		hiddenAbilities: ["Sniper"],
		stats: {
			hp: 40,
			attack: 60,
			defense: 30,
			specialAttack: 31,
			specialDefense: 31,
			speed: 70
		},
		expYield: 52,
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
			blue: 2
		},
		evolutions: [
			{ name: "Fearow", unlock: { type: "level", amount: 20 } },
		],
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 4 } },
			{ name: "Assurance", unlock: { type: "level", amount: 8 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 11 } },
			{ name: "Aerial Ace", unlock: { type: "level", amount: 15 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 18 } },
			{ name: "Take Down", unlock: { type: "level", amount: 22 } },
			{ name: "Agility", unlock: { type: "level", amount: 25 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 29 } },
			{ name: "Roost", unlock: { type: "level", amount: 32 } },
			{ name: "Drill Peck", unlock: { type: "level", amount: 36 } },
		]
	},
	"Fearow": {
		name: "Fearow",
		number: "22",
		weight: {
			pounds: 83.8,
			kilograms: 38.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0022Fearow.png",
			"largeShiny": "src/img/shiny-pokemon/022-Fearow.png",
			"home": "src/img/tiny-pokemon/Fearow.png"
		},
		sounds: {
			"cry": "src/audio/cries/fearow.mp3"
		},
		types: ["Normal", "Flying"],
		tags: [],
		abilities: ["Keen Eye"],
		hiddenAbilities: ["Sniper"],
		stats: {
			hp: 65,
			attack: 90,
			defense: 65,
			specialAttack: 61,
			specialDefense: 61,
			speed: 100
		},
		expYield: 155,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			yellow: 5,
			blue: 2,
			orange: 2
		},
		learnset: [
			{ name: "Drill Run", unlock: { type: "level", amount: 1 } },
			{ name: "Pluck", unlock: { type: "level", amount: 1 } },
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Assurance", unlock: { type: "level", amount: 8 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 11 } },
			{ name: "Aerial Ace", unlock: { type: "level", amount: 15 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 18 } },
			{ name: "Take Down", unlock: { type: "level", amount: 23 } },
			{ name: "Agility", unlock: { type: "level", amount: 27 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 32 } },
			{ name: "Roost", unlock: { type: "level", amount: 36 } },
			{ name: "Drill Peck", unlock: { type: "level", amount: 41 } },
		]
	},
	"Pikachu": {
		name: "Pikachu",
		number: "25",
		weight: {
			pounds: 13.2,
			kilograms: 6.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0025Pikachu.png",
			"largeShiny": "src/img/shiny-pokemon/025-Pikachu.png",
			"home": "src/img/tiny-pokemon/Pikachu.png"
		},
		sounds: {
			"cry": "src/audio/cries/pikachu.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Lightning Rod"],
		stats: {
			hp: 35,
			attack: 55,
			defense: 40,
			specialAttack: 50,
			specialDefense: 50,
			speed: 90
		},
		expYield: 112,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			yellow: 3,
			orange: 2,
			purple: 1
		},
		evolutions: [
			{ name: "Raichu", unlock: { type: "fiveMatchYellow", amount: 1 } },
			{ name: "Raichu-Alola", unlock: { type: "fiveMatchPurple", amount: 1 } },
		],
		learnset: [
			{ name: "Play Nice", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Nuzzle", unlock: { type: "level", amount: 1 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 4 } },
			{ name: "Double Team", unlock: { type: "level", amount: 8 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 12 } },
			{ name: "Feint", unlock: { type: "level", amount: 16 } },
			{ name: "Spark", unlock: { type: "level", amount: 20 } },
			{ name: "Agility", unlock: { type: "level", amount: 24 } },
			// { name: "Iron Tail", unlock: { type: "level", amount: 28 } },
			// { name: "Discharge", unlock: { type: "level", amount: 32 } },
			// { name: "Thunderbolt", unlock: { type: "level", amount: 36 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 40 } },
			// { name: "Thunder", unlock: { type: "level", amount: 44 } },
		]
	},
	"Raichu": {
		name: "Raichu",
		number: "26",
		weight: {
			pounds: 66.1,
			kilograms: 30.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0026Raichu.png",
			"largeShiny": "src/img/shiny-pokemon/026-Raichu.png",
			"home": "src/img/tiny-pokemon/Raichu.png"
		},
		sounds: {
			"cry": "src/audio/cries/raichu.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Lightning Rod"],
		stats: {
			hp: 60,
			attack: 90,
			defense: 55,
			specialAttack: 90,
			specialDefense: 80,
			speed: 110
		},
		expYield: 218,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 3
		},
		energyMastery: {
			yellow: 4,
			orange: 3,
			purple: 2
		},
		learnset: [
			{ name: "Play Nice", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Nuzzle", unlock: { type: "level", amount: 1 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 1 } },
			{ name: "Double Team", unlock: { type: "level", amount: 1 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 1 } },
			{ name: "Feint", unlock: { type: "level", amount: 1 } },
			{ name: "Spark", unlock: { type: "level", amount: 1 } },
			{ name: "Agility", unlock: { type: "level", amount: 1 } },
			// { name: "Iron Tail", unlock: { type: "level", amount: 1 } },
			// { name: "Discharge", unlock: { type: "level", amount: 1 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 1 } },
			// { name: "Thunder", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			// { name: "Thunder Punch", unlock: { type: "level", amount: 1 } }, //note: learned on evolution
			// { name: "Thunderbolt", unlock: { type: "level", amount: 5 } },
		]
	},
	"Raichu-Alola": {
		name: "Raichu",
		id: "Raichu-Alola",
		number: "26a",
		weight: {
			pounds: 46.3,
			kilograms: 21.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0026Raichu-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/026-Raichu-Alola.png",
			"home": "src/img/tiny-pokemon/Raichu-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/raichu.mp3"
		},
		types: ["Electric", "Psychic"],
		tags: [],
		abilities: ["Surge Surfer"],
		hiddenAbilities: [],
		stats: {
			hp: 60,
			attack: 85,
			defense: 55,
			specialAttack: 95,
			specialDefense: 85,
			speed: 110
		},
		expYield: 218,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 3
		},
		energyMastery: {
			yellow: 4,
			orange: 2,
			purple: 3
		},
		learnset: [
			{ name: "Play Nice", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Nuzzle", unlock: { type: "level", amount: 1 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 1 } },
			{ name: "Double Team", unlock: { type: "level", amount: 1 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 1 } },
			{ name: "Feint", unlock: { type: "level", amount: 1 } },
			{ name: "Spark", unlock: { type: "level", amount: 1 } },
			{ name: "Agility", unlock: { type: "level", amount: 1 } },
			// { name: "Iron Tail", unlock: { type: "level", amount: 1 } },
			// { name: "Discharge", unlock: { type: "level", amount: 1 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 1 } },
			// { name: "Thunder", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			// { name: "Psychic", unlock: { type: "level", amount: 1 } }, //note: learned on evolution
			// { name: "Thunderbolt", unlock: { type: "level", amount: 5 } },
		]
	},
	"Sandshrew-Alola": {
		name: "Sandshrew",
		id: "Sandshrew-Alola",
		number: "27a",
		weight: {
			pounds: 88.2,
			kilograms: 40.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0027Sandshrew-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/027-Sandshrew-Alola.png",
			"home": "src/img/tiny-pokemon/Sandshrew-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/sandshrew.mp3"
		},
		types: ["Ice", "Steel"],
		tags: [],
		abilities: ["Snow Cloak"],
		hiddenAbilities: ["Slush Rush"],
		stats: {
			hp: 50,
			attack: 75,
			defense: 90,
			specialAttack: 10,
			specialDefense: 35,
			speed: 40
		},
		expYield: 60,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 1,
			yellow: 3,
			blue: 1
		},
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 1 } },
			{ name: "Mist", unlock: { type: "level", amount: 3 } },
			{ name: "Powder Snow", unlock: { type: "level", amount: 6 } },
			{ name: "Rollout", unlock: { type: "level", amount: 9 } },
			{ name: "Fury Cutter", unlock: { type: "level", amount: 12 } },
			{ name: "Rapid Spin", unlock: { type: "level", amount: 15 } },
			{ name: "Metal Claw", unlock: { type: "level", amount: 18 } },
			{ name: "Swift", unlock: { type: "level", amount: 21 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 24 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 27 } },
		]
	},
	"Jigglypuff": {
		name: "Jigglypuff",
		number: "39",
		weight: {
			pounds: 12.1,
			kilograms: 5.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0039Jigglypuff.png",
			"largeShiny": "src/img/shiny-pokemon/039-Jigglypuff.png",
			"home": "src/img/tiny-pokemon/Jigglypuff.png"
		},
		sounds: {
			"cry": "src/audio/cries/jigglypuff.mp3"
		},
		types: ["Normal", "Fairy"],
		tags: [],
		abilities: ["Cute Charm", "Competitive"],
		hiddenAbilities: ["Friend Guard"],
		stats: {
			hp: 115,
			attack: 45,
			defense: 20,
			specialAttack: 45,
			specialDefense: 25,
			speed: 20
		},
		expYield: 95,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 4,
			blue: 2,
			red: 1
		},
		evolutions: [
			{ name: "Wigglytuff", unlock: { type: "fiveMatchBlue", amount: 1 } },
		],
 		learnset: [
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Sing", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 1 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 4 } },
			{ name: "Covet", unlock: { type: "level", amount: 8 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 12 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 12 } },
			{ name: "Swallow", unlock: { type: "level", amount: 12 } },
			{ name: "Round", unlock: { type: "level", amount: 16 } },
			{ name: "Rest", unlock: { type: "level", amount: 20 } },
			{ name: "Body Slam", unlock: { type: "level", amount: 24 } },
			{ name: "Mimic", unlock: { type: "level", amount: 28 } },
		]
	},
	"Wigglytuff": {
		name: "Wigglytuff",
		number: "40",
		weight: {
			pounds: 26.5,
			kilograms: 12.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0040Wigglytuff.png",
			"largeShiny": "src/img/shiny-pokemon/040-Wigglytuff.png",
			"home": "src/img/tiny-pokemon/Wigglytuff.png"
		},
		sounds: {
			"cry": "src/audio/cries/wigglytuff.mp3"
		},
		types: ["Normal", "Fairy"],
		tags: [],
		abilities: ["Cute Charm", "Competitive"],
		hiddenAbilities: ["Frisk"],
		stats: {
			hp: 140,
			attack: 70,
			defense: 45,
			specialAttack: 85,
			specialDefense: 50,
			speed: 45
		},
		expYield: 196,
		evYield: {
			hp: 3,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 5,
			blue: 3,
			red: 2
		},
 		learnset: [
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 1 } },
			{ name: "Swallow", unlock: { type: "level", amount: 1 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 1 } },
			{ name: "Round", unlock: { type: "level", amount: 1 } },
			{ name: "Rest", unlock: { type: "level", amount: 1 } },
			{ name: "Body Slam", unlock: { type: "level", amount: 1 } },
			{ name: "Mimic", unlock: { type: "level", amount: 1 } },
			{ name: "Hyper Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Double-Edge", unlock: { type: "level", amount: 1 } },
			{ name: "Sing", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 1 } },
			{ name: "Play Rough", unlock: { type: "level", amount: 5 } },
		]
	},
	"Zubat": {
		name: "Zubat",
		number: "41",
		weight: {
			pounds: 16.5,
			kilograms: 7.5
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0041Zubat.png",
			"largeShiny": "src/img/shiny-pokemon/041-Zubat.png",
			"home": "src/img/tiny-pokemon/Zubat.png"
		},
		sounds: {
			"cry": "src/audio/cries/zubat.mp3"
		},
		types: ["Poison", "Flying"],
		tags: [],
		abilities: ["Inner Focus"],
		hiddenAbilities: ["Infiltrator"],
		stats: {
			hp: 40,
			attack: 45,
			defense: 35,
			specialAttack: 30,
			specialDefense: 40,
			speed: 55
		},
		expYield: 49,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			green: 3,
			yellow: 2,
			purple: 1
		},
		evolutions: [
			{ name: "Golbat", unlock: { type: "level", amount: 22 } }
		],
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 5 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 10 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 15 } },
			{ name: "Quick Guard", unlock: { type: "level", amount: 20 } },
		]
	},
	"Golbat": {
		name: "Golbat",
		number: "42",
		weight: {
			pounds: 121.3,
			kilograms: 55.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0042Golbat.png",
			"largeShiny": "src/img/shiny-pokemon/042-Golbat.png",
			"home": "src/img/tiny-pokemon/Zubat.png"
		},
		sounds: {
			"cry": "src/audio/cries/golbat.mp3"
		},
		types: ["Poison", "Flying"],
		tags: [],
		abilities: ["Inner Focus"],
		hiddenAbilities: ["Infiltrator"],
		stats: {
			hp: 75,
			attack: 80,
			defense: 70,
			specialAttack: 65,
			specialDefense: 75,
			speed: 90
		},
		expYield: 159,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			green: 3,
			yellow: 3,
			purple: 3
		},
		learnset: [
			{ name: "Screech", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 15 } },
			{ name: "Quick Guard", unlock: { type: "level", amount: 20 } },
		]
	},
	"Paras": {
		name: "Paras",
		number: "46",
		weight: {
			pounds: 11.9,
			kilograms: 5.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0046Paras.png",
			"largeShiny": "src/img/shiny-pokemon/046-Paras.png",
			"home": "src/img/tiny-pokemon/Paras.png"
		},
		sounds: {
			"cry": "src/audio/cries/paras.mp3"
		},
		types: ["Bug", "Grass"],
		tags: [],
		abilities: ["Effect Spore", "Dry Skin"],
		hiddenAbilities: ["Damp"],
		stats: {
			hp: 35,
			attack: 70,
			defense: 55,
			specialAttack: 45,
			specialDefense: 55,
			speed: 25
		},
		expYield: 57,
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
			green: 3,
			purple: 1
		},
		evolutions: [
			{ name: "Parasect", unlock: { type: "level", amount: 24 } }
		],
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 6 } },
			{ name: "Absorb", unlock: { type: "level", amount: 11 } },
			{ name: "Fury Cutter", unlock: { type: "level", amount: 17 } },
			{ name: "Spore", unlock: { type: "level", amount: 22 } },
		]
	},
	"Parasect": {
		name: "Parasect",
		number: "47",
		weight: {
			pounds: 65.0,
			kilograms: 29.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0047Parasect.png",
			"largeShiny": "src/img/shiny-pokemon/047-Parasect.png",
			"home": "src/img/tiny-pokemon/Parasect.png"
		},
		sounds: {
			"cry": "src/audio/cries/parasect.mp3"
		},
		types: ["Bug", "Grass"],
		tags: [],
		abilities: ["Effect Spore", "Dry Skin"],
		hiddenAbilities: ["Damp"],
		stats: {
			hp: 60,
			attack: 95,
			defense: 80,
			specialAttack: 60,
			specialDefense: 80,
			speed: 30
		},
		expYield: 142,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 3,
			green: 4,
			blue: 1,
			purple: 2
		},
		learnset: [
			{ name: "Cross Poison", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 6 } },
			{ name: "Absorb", unlock: { type: "level", amount: 11 } },
			{ name: "Fury Cutter", unlock: { type: "level", amount: 17 } },
			{ name: "Spore", unlock: { type: "level", amount: 22 } },
		]
	},
	"Diglett-Alola": {
		name: "Diglett-Alola",
		number: "50a",
		weight: {
			pounds: 2.2,
			kilograms: 1.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0050Diglett-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/050-Diglett-Alola.png",
			"home": "src/img/tiny-pokemon/Diglett-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/diglett.mp3"
		},
		types: ["Ground", "Steel"],
		tags: [],
		abilities: ["Sand Veil", "Tangling Hair"],
		hiddenAbilities: ["Sand Force"],
		stats: {
			hp: 10,
			attack: 55,
			defense: 30,
			specialAttack: 35,
			specialDefense: 45,
			speed: 90
		},
		expYield: 53,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			orange: 3,
			yellow: 2,
			purple: 1
		},
		evolutions: [
			{ name: "Dugtrio-Alola", unlock: { type: "level", amount: 26 } }
		],
		learnset: [
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Metal Claw", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 4 } },
			{ name: "Astonish", unlock: { type: "level", amount: 8 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 12 } },
			{ name: "Bulldoze", unlock: { type: "level", amount: 16 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 20 } },
		]
	},
	"Dugtrio-Alola": {
		name: "Dugtrio-Alola",
		number: "51a",
		weight: {
			pounds: 146.8,
			kilograms: 66.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0051Dugtrio-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/051-Dugtrio-Alola.png",
			"home": "src/img/tiny-pokemon/Dugtrio-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/dugtrio.mp3"
		},
		types: ["Ground", "Steel"],
		tags: [],
		abilities: ["Sand Veil", "Tangling Hair"],
		hiddenAbilities: ["Sand Force"],
		stats: {
			hp: 35,
			attack: 100,
			defense: 60,
			specialAttack: 50,
			specialDefense: 70,
			speed: 110
		},
		expYield: 149,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			yellow: 2,
			purple: 1
		},
		learnset: [
			{ name: "Night Slash", unlock: { type: "level", amount: 1 } },
			// { name: "Tri Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Metal Claw", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			// { name: "Sand Tomb", unlock: { type: "level", amount: 1 } }, //note: learned on evolution
			{ name: "Mud-Slap", unlock: { type: "level", amount: 12 } },
			{ name: "Bulldoze", unlock: { type: "level", amount: 16 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 20 } },
		]
	},
	"Meowth-Alola": {
		name: "Meowth",
		id: "Meowth-Alola",
		number: "52a",
		weight: {
			pounds: 9.3,
			kilograms: 4.2
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0052Meowth-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/052-Meowth-Alola.png",
			"home": "src/img/tiny-pokemon/Meowth-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/meowth.mp3"
		},
		types: ["Dark"],
		tags: [],
		abilities: ["Pickup", "Technician"],
		hiddenAbilities: ["Rattled"],
		stats: {
			hp: 40,
			attack: 35,
			defense: 35,
			specialAttack: 50,
			specialDefense: 40,
			speed: 90
		},
		expYield: 58,
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
			purple: 5
		},
		evolutions: [
			{ name: "Persian-Alola", unlock: { type: "friendship", amount: 50 } }
		],
		learnset: [
			{ name: "Fake Out", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Feint", unlock: { type: "level", amount: 4 } },
			{ name: "Scratch", unlock: { type: "level", amount: 8 } },
			{ name: "Pay Day", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 16 } },
			{ name: "Taunt", unlock: { type: "level", amount: 20 } },
			{ name: "Assurance", unlock: { type: "level", amount: 24 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 29 } },
			{ name: "Screech", unlock: { type: "level", amount: 32 } },
		]
	},
	"Persian-Alola": {
		name: "Persian",
		id: "Persian-Alola",
		number: "53a",
		weight: {
			pounds: 72.8,
			kilograms: 33.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0053Persian-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/053-Persian-Alola.png",
			"home": "src/img/tiny-pokemon/Persian-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/persian.mp3"
		},
		types: ["Dark"],
		tags: [],
		abilities: ["Fur Coat", "Technician"],
		hiddenAbilities: ["Rattled"],
		stats: {
			hp: 65,
			attack: 60,
			defense: 60,
			specialAttack: 75,
			specialDefense: 65,
			speed: 115
		},
		expYield: 154,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			orange: 3,
			yellow: 1,
			purple: 5
		},
		learnset: [
			{ name: "Switcheroo", unlock: { type: "level", amount: 1 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Feint", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Pay Day", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 16 } },
			{ name: "Taunt", unlock: { type: "level", amount: 20 } },
			{ name: "Assurance", unlock: { type: "level", amount: 24 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 31 } },
			{ name: "Screech", unlock: { type: "level", amount: 36 } },
		]
	},
	"Psyduck": {
		name: "Psyduck",
		number: "54",
		weight: {
			pounds: 43.2,
			kilograms: 19.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0054Psyduck.png",
			"largeShiny": "src/img/shiny-pokemon/054-Psyduck.png",
			"home": "src/img/tiny-pokemon/Psyduck.png"
		},
		sounds: {
			"cry": "src/audio/cries/psyduck.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Damp", "Cloud Nine"],
		hiddenAbilities: ["Swift Swim"],
		stats: {
			hp: 50,
			attack: 52,
			defense: 48,
			specialAttack: 65,
			specialDefense: 50,
			speed: 55
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
			blue: 3,
			purple: 3
		},
		evolutions: [
			{ name: "Golduck", unlock: { type: "level", amount: 33 } }
		],
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 3 } },
			{ name: "Confusion", unlock: { type: "level", amount: 6 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 9 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 12 } },
			{ name: "Disable", unlock: { type: "level", amount: 15 } },
			{ name: "Zen Headbutt", unlock: { type: "level", amount: 18 } },
			{ name: "Screech", unlock: { type: "level", amount: 21 } },
		]
	},
	"Golduck": {
		name: "Golduck",
		number: "55",
		weight: {
			pounds: 168.9,
			kilograms: 76.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0055Golduck.png",
			"largeShiny": "src/img/shiny-pokemon/055-Golduck.png",
			"home": "src/img/tiny-pokemon/Golduck.png"
		},
		sounds: {
			"cry": "src/audio/cries/golduck.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Damp", "Cloud Nine"],
		hiddenAbilities: ["Swift Swim"],
		stats: {
			hp: 80,
			attack: 82,
			defense: 78,
			specialAttack: 95,
			specialDefense: 80,
			speed: 85
		},
		expYield: 175,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 5,
			purple: 4
		},
		learnset: [
			{ name: "Aqua Jet", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Confusion", unlock: { type: "level", amount: 1 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 9 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 12 } },
			{ name: "Disable", unlock: { type: "level", amount: 15 } },
			{ name: "Zen Headbutt", unlock: { type: "level", amount: 18 } },
			{ name: "Screech", unlock: { type: "level", amount: 21 } },
		]
	},
	"Mankey": {
		name: "Mankey",
		number: "56",
		weight: {
			pounds: 61.7,
			kilograms: 28
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0056Mankey.png",
			"largeShiny": "src/img/shiny-pokemon/056-Mankey.png",
			"home": "src/img/tiny-pokemon/Mankey.png"
		},
		sounds: {
			"cry": "src/audio/cries/mankey.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Anger Point", "Vital Spirit"],
		hiddenAbilities: ["Defiant"],
		stats: {
			hp: 40,
			attack: 80,
			defense: 35,
			specialAttack: 35,
			specialDefense: 45,
			speed: 70
		},
		expYield: 61,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			red: 2
		},
		learnset: [
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 5 } },
			{ name: "Low Kick", unlock: { type: "level", amount: 8 } },
			{ name: "Karate Chop", unlock: { type: "level", amount: 10 } },
			{ name: "Seismic Toss", unlock: { type: "level", amount: 12 } },
			{ name: "Swagger", unlock: { type: "level", amount: 17 } },
			{ name: "Cross Chop", unlock: { type: "level", amount: 22 } },
		]
	},
	"Growlithe": {
		name: "Growlithe",
		number: "58",
		weight: {
			pounds: 41.9,
			kilograms: 19.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0058Growlithe.png",
			"largeShiny": "src/img/shiny-pokemon/058-Growlithe.png",
			"home": "src/img/tiny-pokemon/Growlithe.png"
		},
		sounds: {
			"cry": "src/audio/cries/growlithe.mp3"
		},
		types: ["Fire"],
		tags: [],
		abilities: ["Intimidate", "Flash Fire"],
		hiddenAbilities: ["Justified"],
		stats: {
			hp: 55,
			attack: 70,
			defense: 45,
			specialAttack: 70,
			specialDefense: 50,
			speed: 60
		},
		expYield: 70,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 3,
			yellow: 3
		},
		evolutions: [
			{ name: "Arcanine", unlock: { type: "fiveMatchRed", amount: 1 } }
		],
		learnset: [
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Howl", unlock: { type: "level", amount: 4 } },
			{ name: "Bite", unlock: { type: "level", amount: 8 } },
			{ name: "Flame Wheel", unlock: { type: "level", amount: 12 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 16 } },
			{ name: "Agility", unlock: { type: "level", amount: 20 } },
		]
	},
	"Arcanine": {
		name: "Arcanine",
		number: "59",
		weight: {
			pounds: 341.7,
			kilograms: 155.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0059Arcanine.png",
			"largeShiny": "src/img/shiny-pokemon/059-Arcanine.png",
			"home": "src/img/tiny-pokemon/Arcanine.png"
		},
		sounds: {
			"cry": "src/audio/cries/arcanine.mp3"
		},
		types: ["Fire"],
		tags: [],
		abilities: ["Intimidate", "Flash Fire"],
		hiddenAbilities: ["Justified"],
		stats: {
			hp: 90,
			attack: 110,
			defense: 80,
			specialAttack: 100,
			specialDefense: 80,
			speed: 95
		},
		expYield: 194,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 5,
			yellow: 3
		},
		learnset: [
			{ name: "Flame Wheel", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Agility", unlock: { type: "level", amount: 1 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 1 } },
			// { name: "Retaliate", unlock: { type: "level", amount: 1 } },
			{ name: "Crunch", unlock: { type: "level", amount: 1 } },
			{ name: "Take Down", unlock: { type: "level", amount: 1 } },
			{ name: "Roar", unlock: { type: "level", amount: 1 } },
			// { name: "Play Rough", unlock: { type: "level", amount: 1 } },
			// { name: "Reversal", unlock: { type: "level", amount: 1 } },
			// { name: "Flare Blitz", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Howl", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 1 } },
			// { name: "Extreme Speed", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			// { name: "Flamethrower", unlock: { type: "level", amount: 5 } },
		]
	},
	"Poliwag": {
		name: "Poliwag",
		number: "60",
		weight: {
			pounds: 27.3,
			kilograms: 12.4
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0060Poliwag.png",
			"largeShiny": "src/img/shiny-pokemon/060-Poliwag.png",
			"home": "src/img/tiny-pokemon/Poliwag.png"
		},
		sounds: {
			"cry": "src/audio/cries/poliwag.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Water Absorb", "Damp"],
		hiddenAbilities: ["Swift Swim"],
		stats: {
			hp: 40,
			attack: 50,
			defense: 40,
			specialAttack: 40,
			specialDefense: 40,
			speed: 90
		},
		expYield: 60,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			water: 3,
			orange: 1
		},
		evolutions: [
			{ name: "Poliwhirl", unlock: { type: "level", amount: 25 } }
		],
		learnset: [
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 6 } },
			{ name: "Mud Shot", unlock: { type: "level", amount: 12 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 18 } },
			{ name: "Rain Dance", unlock: { type: "level", amount: 24 } },
		]
	},
	"Poliwhirl": {
		name: "Poliwhirl",
		number: "61",
		weight: {
			pounds: 44.1,
			kilograms: 20
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0061Poliwhirl.png",
			"largeShiny": "src/img/shiny-pokemon/061-Poliwhirl.png",
			"home": "src/img/tiny-pokemon/Poliwhirl.png"
		},
		sounds: {
			"cry": "src/audio/cries/poliwhirl.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Water Absorb", "Damp"],
		hiddenAbilities: ["Swift Swim"],
		stats: {
			hp: 65,
			attack: 65,
			defense: 65,
			specialAttack: 50,
			specialDefense: 50,
			speed: 90
		},
		expYield: 135,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			blue: 4,
			green: 1,
			orange: 3
		},
		learnset: [
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Mud Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 18 } },
			{ name: "Rain Dance", unlock: { type: "level", amount: 24 } },
		]
	},
	"Abra": {
		name: "Abra",
		number: "63",
		weight: {
			pounds: 43.0,
			kilograms: 19.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0063Abra.png",
			"largeShiny": "src/img/shiny-pokemon/063-Abra.png",
			"home": "src/img/tiny-pokemon/Abra.png"
		},
		sounds: {
			"cry": "src/audio/cries/abra.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Synchronize", "Inner Focus"],
		hiddenAbilities: ["Magic Guard"],
		stats: {
			hp: 25,
			attack: 20,
			defense: 15,
			specialAttack: 105,
			specialDefense: 55,
			speed: 90
		},
		expYield: 62,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 6
		},
		evolutions: [
			{ name: "Kadabra", unlock: { type: "level", amount: 16 } }
		],
		learnset: [
			{ name: "Teleport", unlock: { type: "level", amount: 1 } }
		]
	},
	"Kadabra": {
		name: "Kadabra",
		number: "64",
		weight: {
			pounds: 124.6,
			kilograms: 56.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0064Kadabra.png",
			"largeShiny": "src/img/shiny-pokemon/064-Kadabra.png",
			"home": "src/img/tiny-pokemon/Kadabra.png"
		},
		sounds: {
			"cry": "src/audio/cries/kadabra.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Synchronize", "Inner Focus"],
		hiddenAbilities: ["Magic Guard"],
		stats: {
			hp: 40,
			attack: 35,
			defense: 30,
			specialAttack: 120,
			specialDefense: 70,
			speed: 105
		},
		expYield: 140,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 8
		},
		learnset: [
			{ name: "Confusion", unlock: { type: "level", amount: 1 } },
			{ name: "Kinesis", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 1 } },
			{ name: "Teleport", unlock: { type: "level", amount: 1 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 5 } },
			{ name: "Reflect", unlock: { type: "level", amount: 10 } },
		]
	},
	"Machop": {
		name: "Machop",
		number: "66",
		weight: {
			pounds: 43.0,
			kilograms: 19.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0066Machop.png",
			"largeShiny": "src/img/shiny-pokemon/066-Machop.png",
			"home": "src/img/tiny-pokemon/Machop.png"
		},
		sounds: {
			"cry": "src/audio/cries/machop.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Guts", "No Guard"],
		hiddenAbilities: ["Steadfast"],
		stats: {
			hp: 70,
			attack: 80,
			defense: 50,
			specialAttack: 35,
			specialDefense: 35,
			speed: 35
		},
		expYield: 61,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 6
		},
		evolutions: [
			{ name: "Machoke", unlock: { type: "level", amount: 28 } }
		],
		learnset: [
			//Gen 7 learnset
			{ name: "Low Kick", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 3 } },
			{ name: "Karate Chop", unlock: { type: "level", amount: 7 } },
			{ name: "Foresight", unlock: { type: "level", amount: 9 } },
			{ name: "Low Sweep", unlock: { type: "level", amount: 13 } },
			{ name: "Seismic Toss", unlock: { type: "level", amount: 15 } },
			{ name: "Revenge", unlock: { type: "level", amount: 19 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 21 } },
		]
	},
	"Machoke": {
		name: "Machoke",
		number: "67",
		weight: {
			pounds: 155.4,
			kilograms: 70.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0067Machoke.png",
			"largeShiny": "src/img/shiny-pokemon/067-Machoke.png",
			"home": "src/img/tiny-pokemon/Machoke.png"
		},
		sounds: {
			"cry": "src/audio/cries/machoke.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Guts", "No Guard"],
		hiddenAbilities: ["Steadfast"],
		stats: {
			hp: 80,
			attack: 100,
			defense: 70,
			specialAttack: 50,
			specialDefense: 60,
			speed: 45
		},
		expYield: 142,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 8
		},
		learnset: [
			//Gen 7 learnset
			{ name: "Low Kick", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Karate Chop", unlock: { type: "level", amount: 1 } },
			{ name: "Foresight", unlock: { type: "level", amount: 9 } },
			{ name: "Low Sweep", unlock: { type: "level", amount: 13 } },
			{ name: "Seismic Toss", unlock: { type: "level", amount: 15 } },
			{ name: "Revenge", unlock: { type: "level", amount: 19 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 21 } },
		]
	},
	"Tentacool": {
		name: "Tentacool",
		number: "72",
		weight: {
			pounds: 100.3,
			kilograms: 45.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0072Tentacool.png",
			"largeShiny": "src/img/shiny-pokemon/072-Tentacool.png",
			"home": "src/img/tiny-pokemon/Tentacool.png"
		},
		sounds: {
			"cry": "src/audio/cries/tentacool.mp3"
		},
		types: ["Water", "Poison"],
		tags: [],
		abilities: ["Clear Body", "Liquid Ooze"],
		hiddenAbilities: ["Rain Dish"],
		stats: {
			hp: 40,
			attack: 40,
			defense: 35,
			specialAttack: 50,
			specialDefense: 100,
			speed: 70
		},
		expYield: 67,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			blue: 3,
			purple: 2
		},
		evolutions: [
			{ name: "Tentacruel", unlock: { type: "level", amount: 30 } }
		],
		learnset: [
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Acid", unlock: { type: "level", amount: 4 } },
			{ name: "Wrap", unlock: { type: "level", amount: 8 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 12 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 16 } },
			{ name: "Screech", unlock: { type: "level", amount: 20 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 24 } },
			{ name: "Hex", unlock: { type: "level", amount: 28 } },
		]
	},
	"Tentacruel": {
		name: "Tentacruel",
		number: "73",
		weight: {
			pounds: 121.3,
			kilograms: 55.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0073Tentacruel.png",
			"largeShiny": "src/img/shiny-pokemon/073-Tentacruel.png",
			"home": "src/img/tiny-pokemon/Tentacruel.png"
		},
		sounds: {
			"cry": "src/audio/cries/tentacruel.mp3"
		},
		types: ["Water", "Poison"],
		tags: [],
		abilities: ["Clear Body", "Liquid Ooze"],
		hiddenAbilities: ["Rain Dish"],
		stats: {
			hp: 80,
			attack: 70,
			defense: 65,
			specialAttack: 80,
			specialDefense: 120,
			speed: 100
		},
		expYield: 180,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		energyMastery: {
			blue: 3,
			purple: 2
		},
		learnset: [
			{ name: "Reflect Type", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Acid", unlock: { type: "level", amount: 4 } },
			{ name: "Wrap", unlock: { type: "level", amount: 8 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 12 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 16 } },
			{ name: "Screech", unlock: { type: "level", amount: 20 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 24 } },
			{ name: "Hex", unlock: { type: "level", amount: 28 } },
		]
	},
	"Slowpoke": {
		name: "Slowpoke",
		number: "79",
		weight: {
			pounds: 79.4,
			kilograms: 36.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0079Slowpoke.png",
			"largeShiny": "src/img/shiny-pokemon/079-Slowpoke.png",
			"home": "src/img/tiny-pokemon/Slowpoke.png"
		},
		sounds: {
			"cry": "src/audio/cries/slowpoke.mp3"
		},
		types: ["Water", "Psychic"],
		tags: [],
		abilities: ["Oblivious", "Own Tempo"],
		hiddenAbilities: ["Regenerator"],
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
			orange: 1,
			blue: 2,
			purple: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Curse", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 3 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 6 } },
			{ name: "Yawn", unlock: { type: "level", amount: 9 } },
			{ name: "Confusion", unlock: { type: "level", amount: 12 } },
			{ name: "Disable", unlock: { type: "level", amount: 15 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 18 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 21 } },
		]
	},
	"Magnemite": {
		name: "Magnemite",
		number: "81",
		weight: {
			pounds: 13.2,
			kilograms: 6.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0081Magnemite.png",
			"largeShiny": "src/img/shiny-pokemon/081-Magnemite.png",
			"home": "src/img/tiny-pokemon/Magnemite.png"
		},
		sounds: {
			"cry": "src/audio/cries/magnemite.mp3"
		},
		types: ["Electric", "Steel"],
		tags: [],
		abilities: ["Magnet Pull", "Sturdy"],
		hiddenAbilities: ["Analytic"],
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
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 4 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 8 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 12 } },
			{ name: "Gyro Ball", unlock: { type: "level", amount: 16 } },
			{ name: "Spark", unlock: { type: "level", amount: 20 } },
		]
	},
	"Grimer-Alola": {
		name: "Grimer",
		id: "Grimer-Alola",
		number: "88a",
		weight: {
			pounds: 92.6,
			kilograms: 42.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0088Grimer-Alola.png",
			"largeShiny": "src/img/shiny-pokemon/088-Grimer-Alola.png",
			"home": "src/img/tiny-pokemon/Grimer-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/grimer.mp3"
		},
		types: ["Poison", "Dark"],
		tags: [],
		abilities: ["Poison Touch", "Gluttony"],
		hiddenAbilities: ["Power of Alchemy"],
		stats: {
			hp: 80,
			attack: 80,
			defense: 50,
			specialAttack: 40,
			specialDefense: 50,
			speed: 25
		},
		expYield: 65,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 2,
			green: 2,
			purple: 3
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Gas", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 4 } },
			{ name: "Bite", unlock: { type: "level", amount: 7 } },
			{ name: "Disable", unlock: { type: "level", amount: 12 } },
			{ name: "Acid Spray", unlock: { type: "level", amount: 15 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 18 } },
			{ name: "Minimize", unlock: { type: "level", amount: 21 } },
		]
	},
	"Gastly": {
		name: "Gastly",
		number: "92",
		weight: {
			pounds: 0.2,
			kilograms: 0.1
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0092Gastly.png",
			"largeShiny": "src/img/shiny-pokemon/092-Gastly.png",
			"home": "src/img/tiny-pokemon/Gastly.png"
		},
		sounds: {
			"cry": "src/audio/cries/gastly.mp3"
		},
		types: ["Ghost", "Poison"],
		tags: [],
		abilities: ["Levitate"],
		hiddenAbilities: [],
		stats: {
			hp: 30,
			attack: 35,
			defense: 30,
			specialAttack: 100,
			specialDefense: 35,
			speed: 80
		},
		expYield: 62,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			purple: 3
		},
		evolutions: [
			{ name: "Haunter", unlock: { type: "level", amount: 25 } }
		],
		learnset: [
			{ name: "Lick", unlock: { type: "level", amount: 1 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 4 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 8 } },
			{ name: "Payback", unlock: { type: "level", amount: 12 } },
			{ name: "Spite", unlock: { type: "level", amount: 16 } },
			{ name: "Curse", unlock: { type: "level", amount: 20 } },
		]
	},
	"Haunter": {
		name: "Haunter",
		number: "93",
		weight: {
			pounds: 0.2,
			kilograms: 0.1
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0093Haunter.png",
			"largeShiny": "src/img/shiny-pokemon/093-Haunter.png",
			"home": "src/img/tiny-pokemon/Haunter.png"
		},
		sounds: {
			"cry": "src/audio/cries/haunter.mp3"
		},
		types: ["Ghost", "Poison"],
		tags: [],
		abilities: ["Levitate"],
		hiddenAbilities: [],
		stats: {
			hp: 45,
			attack: 50,
			defense: 45,
			specialAttack: 115,
			specialDefense: 55,
			speed: 95
		},
		expYield: 142,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 2,
			orange: 3,
			purple: 3
		},
		learnset: [
			{ name: "Lick", unlock: { type: "level", amount: 1 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 1 } },
			// { name: "Shadow Punch", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Payback", unlock: { type: "level", amount: 12 } },
			{ name: "Spite", unlock: { type: "level", amount: 16 } },
			{ name: "Curse", unlock: { type: "level", amount: 20 } },
		]
	},
	"Drowzee": {
		name: "Drowzee",
		number: "96",
		weight: {
			pounds: 71.4,
			kilograms: 32.4
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0096Drowzee.png",
			"largeShiny": "src/img/shiny-pokemon/096-Drowzee.png",
			"home": "src/img/tiny-pokemon/Drowzee.png"
		},
		sounds: {
			"cry": "src/audio/cries/grimer.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Insomnia", "Forewarn"],
		hiddenAbilities: ["Inner Focus"],
		stats: {
			hp: 60,
			attack: 48,
			defense: 45,
			specialAttack: 43,
			specialDefense: 90,
			speed: 42
		},
		expYield: 66,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			purple: 6
		},
		evolutions: [
			{ name: "Hypno", unlock: { type: "level", amount: 26 } }
		],
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 5 } },
			{ name: "Confusion", unlock: { type: "level", amount: 9 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 13 } },
			{ name: "Poison Gas", unlock: { type: "level", amount: 17 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 21 } },
		]
	},
	"Hypno": {
		name: "Hypno",
		number: "97",
		weight: {
			pounds: 166.7,
			kilograms: 75.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0097Hypno.png",
			"largeShiny": "src/img/shiny-pokemon/097-Hypno.png",
			"home": "src/img/tiny-pokemon/Hypno.png"
		},
		sounds: {
			"cry": "src/audio/cries/hypno.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Insomnia", "Forewarn"],
		hiddenAbilities: ["Inner Focus"],
		stats: {
			hp: 85,
			attack: 73,
			defense: 70,
			specialAttack: 73,
			specialDefense: 115,
			speed: 67
		},
		expYield: 169,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		energyMastery: {
			blue: 2,
			purple: 6
		},
		learnset: [
			{ name: "Switcheroo", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 1 } },
			{ name: "Confusion", unlock: { type: "level", amount: 1 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 13 } },
			{ name: "Poison Gas", unlock: { type: "level", amount: 17 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 21 } },
		]
	},
	"Chansey": {
		name: "Chansey",
		number: "113",
		weight: {
			pounds: 76.3,
			kilograms: 34.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0113Chansey.png",
			"largeShiny": "src/img/shiny-pokemon/113-Chansey.png",
			"home": "src/img/tiny-pokemon/Chansey.png"
		},
		sounds: {
			"cry": "src/audio/cries/chansey.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Natural Cure", "Serene Grace"],
		hiddenAbilities: ["Healer"],
		stats: {
			hp: 250,
			attack: 5,
			defense: 5,
			specialAttack: 35,
			specialDefense: 105,
			speed: 50
		},
		expYield: 395,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 4,
			blue: 2,
			purple: 4
		},
		learnset: [
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 1 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 4 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 8 } },
			{ name: "Life Dew", unlock: { type: "level", amount: 12 } },
			{ name: "Sing", unlock: { type: "level", amount: 16 } },
			{ name: "Fling", unlock: { type: "level", amount: 20 } },
		]
	},
	"Tauros": {
		name: "Tauros",
		number: "128",
		weight: {
			pounds: 194.9,
			kilograms: 88.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0128Tauros.png",
			"largeShiny": "src/img/shiny-pokemon/128-Tauros.png",
			"home": "src/img/tiny-pokemon/Tauros.png"
		},
		sounds: {
			"cry": "src/audio/cries/tauros.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Intimidate", "Anger Point"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 75,
			attack: 100,
			defense: 95,
			specialAttack: 40,
			specialDefense: 70,
			speed: 110
		},
		expYield: 172,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			red: 1,
			orange: 6,
			yellow: 1,
			green: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Work Up", unlock: { type: "level", amount: 5 } },
			{ name: "Payback", unlock: { type: "level", amount: 10 } },
			{ name: "Assurance", unlock: { type: "level", amount: 15 } },
			{ name: "Horn Attack", unlock: { type: "level", amount: 20 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 25 } },
		]
	},
	"Eevee": {
		name: "Eevee",
		number: "133",
		weight: {
			pounds: 14.3,
			kilograms: 6.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0133Eevee.png",
			"largeShiny": "src/img/shiny-pokemon/133-Eevee.png",
			"home": "src/img/tiny-pokemon/Eevee.png"
		},
		sounds: {
			"cry": "src/audio/cries/eevee.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Run Away", "Adaptability"],
		hiddenAbilities: ["Anticipation"],
		stats: {
			hp: 55,
			attack: 55,
			defense: 50,
			specialAttack: 45,
			specialDefense: 65,
			speed: 55
		},
		expYield: 65,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			red: 1,
			orange: 1,
			yellow: 1,
			green: 1,
			blue: 1,
			purple: 1,
		},
		evolutions: [
			{ name: "Espeon", unlock: { type: "fiveMatchPurple", amount: 1 } },
			{ name: "Glaceon", unlock: { type: "fourMatchBlue", amount: 10 } },
		],
		learnset: [
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 10 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 15 } },
			{ name: "Swift", unlock: { type: "level", amount: 20 } },
			{ name: "Bite", unlock: { type: "level", amount: 25 } },
			{ name: "Copycat", unlock: { type: "level", amount: 30 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 35 } },
			{ name: "Take Down", unlock: { type: "level", amount: 40 } },
			{ name: "Charm", unlock: { type: "level", amount: 45 } },
			{ name: "Double-Edge", unlock: { type: "level", amount: 50 } },
			{ name: "Last Resort", unlock: { type: "level", amount: 55 } },
		]
	},
	"Ledyba": {
		name: "Ledyba",
		number: "165",
		weight: {
			pounds: 23.8,
			kilograms: 10.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0165Ledyba.png",
			"largeShiny": "src/img/shiny-pokemon/165-Ledyba.png",
			"home": "src/img/tiny-pokemon/Ledyba.png"
		},
		sounds: {
			"cry": "src/audio/cries/ledyba.mp3"
		},
		types: ["Bug", "Flying"],
		tags: [],
		abilities: ["Swarm", "Early Bird"],
		hiddenAbilities: ["Rattled"],
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
		evolutions: [
			{ name: "Ledian", unlock: { type: "level", amount: 18 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 5 } },
			{ name: "Swift", unlock: { type: "level", amount: 8 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 12 } },
			{ name: "Reflect", unlock: { type: "level", amount: 12 } },
			{ name: "Safeguard", unlock: { type: "level", amount: 12 } },
			{ name: "Mach Punch", unlock: { type: "level", amount: 15 } },
			{ name: "Roost", unlock: { type: "level", amount: 19 } },
			{ name: "Struggle Bug", unlock: { type: "level", amount: 22 } },
		]
	},
	"Ledian": {
		name: "Ledian",
		number: "166",
		weight: {
			pounds: 78.5,
			kilograms: 35.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0166Ledian.png",
			"largeShiny": "src/img/shiny-pokemon/166-Ledian.png",
			"home": "src/img/tiny-pokemon/Ledian.png"
		},
		sounds: {
			"cry": "src/audio/cries/ledyba.mp3"
		},
		types: ["Bug", "Flying"],
		tags: [],
		abilities: ["Swarm", "Early Bird"],
		hiddenAbilities: ["Iron Fist"],
		stats: {
			hp: 55,
			attack: 35,
			defense: 50,
			specialAttack: 55,
			specialDefense: 110,
			speed: 85
		},
		expYield: 137,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		energyMastery: {
			green: 3,
			blue: 2,
			purple: 5
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Swift", unlock: { type: "level", amount: 1 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 12 } },
			{ name: "Reflect", unlock: { type: "level", amount: 12 } },
			{ name: "Safeguard", unlock: { type: "level", amount: 12 } },
			{ name: "Mach Punch", unlock: { type: "level", amount: 15 } },
			{ name: "Roost", unlock: { type: "level", amount: 20 } },
			{ name: "Struggle Bug", unlock: { type: "level", amount: 24 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 29 } },
			{ name: "Agility", unlock: { type: "level", amount: 33 } },
		]
	},
	"Spinarak": {
		name: "Spinarak",
		number: "167",
		weight: {
			pounds: 18.7,
			kilograms: 8.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0167Spinarak.png",
			"largeShiny": "src/img/shiny-pokemon/167-Spinarak.png",
			"home": "src/img/tiny-pokemon/Spinarak.png"
		},
		sounds: {
			"cry": "src/audio/cries/spinarak.mp3"
		},
		types: ["Bug", "Poison"],
		tags: [],
		abilities: ["Swarm", "Insomnia"],
		hiddenAbilities: ["Sniper"],
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
		evolutions: [
			{ name: "Ariados", unlock: { type: "level", amount: 22 } }
		],
		learnset: [
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 5 } },
			{ name: "Infestation", unlock: { type: "level", amount: 8 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 12 } },
			{ name: "Night Shade", unlock: { type: "level", amount: 15 } },
			{ name: "Shadow Sneak", unlock: { type: "level", amount: 19 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 22 } },
		]
	},
	"Ariados": {
		name: "Ariados",
		number: "168",
		weight: {
			pounds: 73.9,
			kilograms: 33.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0168Ariados.png",
			"largeShiny": "src/img/shiny-pokemon/168-Ariados.png",
			"home": "src/img/tiny-pokemon/Ariados.png"
		},
		sounds: {
			"cry": "src/audio/cries/ariados.mp3"
		},
		types: ["Bug", "Poison"],
		tags: [],
		abilities: ["Swarm", "Insomnia"],
		hiddenAbilities: ["Sniper"],
		stats: {
			hp: 70,
			attack: 90,
			defense: 70,
			specialAttack: 60,
			specialDefense: 70,
			speed: 40
		},
		expYield: 140,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 1,
			green: 5,
			purple: 4
		},
		learnset: [
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Fell Stinger", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Swords Dance", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Infestation", unlock: { type: "level", amount: 8 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 12 } },
			{ name: "Night Shade", unlock: { type: "level", amount: 15 } },
			{ name: "Shadow Sneak", unlock: { type: "level", amount: 19 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 23 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 28 } },
			{ name: "Agility", unlock: { type: "level", amount: 31 } },
		]
	},
	"Pichu": {
		name: "Pichu",
		number: "172",
		weight: {
			pounds: 4.4,
			kilograms: 2.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0172Pichu.png",
			"largeShiny": "src/img/shiny-pokemon/172-Pichu.png",
			"home": "src/img/tiny-pokemon/Pichu.png"
		},
		sounds: {
			"cry": "src/audio/cries/pichu.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Lightning Rod"],
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
			yellow: 3,
			orange: 1
		},
		evolutions: [
			{ name: "Pikachu", unlock: { type: "friendship", amount: 40 } }
		],
 		learnset: [
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Play Nice", unlock: { type: "level", amount: 4 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 8 } },
			{ name: "Nuzzle", unlock: { type: "level", amount: 12 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 16 } },
			{ name: "Charm", unlock: { type: "level", amount: 20 } },
		]
	},
	"Igglybuff": {
		name: "Igglybuff",
		number: "174",
		weight: {
			pounds: 2.2,
			kilograms: 1.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0174Igglybuff.png",
			"largeShiny": "src/img/shiny-pokemon/174-Igglybuff.png",
			"home": "src/img/tiny-pokemon/Igglybuff.png"
		},
		sounds: {
			"cry": "src/audio/cries/igglybuff.mp3"
		},
		types: ["Normal", "Fairy"],
		tags: [],
		abilities: ["Cute Charm", "Competitive"],
		hiddenAbilities: ["Friend Guard"],
		stats: {
			hp: 90,
			attack: 30,
			defense: 15,
			specialAttack: 40,
			specialDefense: 20,
			speed: 15
		},
		expYield: 42,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 3,
			blue: 1
		},
		evolutions: [
			{ name: "Jigglypuff", unlock: { type: "friendship", amount: 40 } }
		],
 		learnset: [
			{ name: "Sing", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 4 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 8 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 12 } },
			{ name: "Disable", unlock: { type: "level", amount: 16 } },
			{ name: "Charm", unlock: { type: "level", amount: 20 } },
		]
	},
	"Mareep": {
		name: "Mareep",
		number: "179",
		weight: {
			pounds: 17.2,
			kilograms: 7.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0179Mareep.png",
			"largeShiny": "src/img/shiny-pokemon/179-Mareep.png",
			"home": "src/img/tiny-pokemon/Mareep.png"
		},
		sounds: {
			"cry": "src/audio/cries/mareep.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Plus"],
		stats: {
			hp: 55,
			attack: 40,
			defense: 40,
			specialAttack: 65,
			specialDefense: 45,
			speed: 35
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 3,
			blue: 1
		},
		evolutions: [
			{ name: "Flaaffy", unlock: { type: "level", amount: 15 } }
		],
 		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 4 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 8 } },
			{ name: "Cotton Spore", unlock: { type: "level", amount: 11 } },
			{ name: "Charge", unlock: { type: "level", amount: 15 } },
			{ name: "Take Down", unlock: { type: "level", amount: 18 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 22 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 25 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 29 } },
		]
	},
	"Flaaffy": {
		name: "Flaaffy",
		number: "180",
		weight: {
			pounds: 29.3,
			kilograms: 13.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0180Flaaffy.png",
			"largeShiny": "src/img/shiny-pokemon/180-Flaaffy.png",
			"home": "src/img/tiny-pokemon/Flaaffy.png"
		},
		sounds: {
			"cry": "src/audio/cries/flaaffy.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Plus"],
		stats: {
			hp: 70,
			attack: 55,
			defense: 55,
			specialAttack: 80,
			specialDefense: 60,
			speed: 45
		},
		expYield: 128,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 4,
			green: 1,
			blue: 2
		},
		evolutions: [
			{ name: "Ampharos", unlock: { type: "level", amount: 30 } }
		],
 		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 6 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 9 } },
			{ name: "Cotton Spore", unlock: { type: "level", amount: 11 } },
			{ name: "Charge", unlock: { type: "level", amount: 16 } },
			{ name: "Take Down", unlock: { type: "level", amount: 20 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 25 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 29 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 34 } },
		]
	},
	"Ampharos": {
		name: "Ampharos",
		number: "181",
		weight: {
			pounds: 135.6,
			kilograms: 61.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0181Ampharos.png",
			"largeShiny": "src/img/shiny-pokemon/181-Ampharos.png",
			"home": "src/img/tiny-pokemon/Ampharos.png"
		},
		sounds: {
			"cry": "src/audio/cries/ampharos.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Static"],
		hiddenAbilities: ["Plus"],
		stats: {
			hp: 90,
			attack: 75,
			defense: 85,
			specialAttack: 115,
			specialDefense: 90,
			speed: 55
		},
		expYield: 230,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 3,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 6,
			green: 2,
			blue: 2
		},
 		learnset: [
			// { name: "Zap Cannon", unlock: { type: "level", amount: 1 } },
			// { name: "Magnetic Flux", unlock: { type: "level", amount: 1 } },
			// { name: "Dragon Pulse", unlock: { type: "level", amount: 1 } },
			// { name: "Fire Punch", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Wave", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			// { name: "Thunder Punch", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Cotton Spore", unlock: { type: "level", amount: 11 } },
			{ name: "Charge", unlock: { type: "level", amount: 16 } },
			{ name: "Take Down", unlock: { type: "level", amount: 20 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 25 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 29 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 35 } },
		]
	},
	"Espeon": {
		name: "Espeon",
		number: "196",
		weight: {
			pounds: 58.4,
			kilograms: 26.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0196Espeon.png",
			"largeShiny": "src/img/shiny-pokemon/196-Espeon.png",
			"home": "src/img/tiny-pokemon/Espeon.png"
		},
		sounds: {
			"cry": "src/audio/cries/espeon.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Synchronize"],
		hiddenAbilities: ["Magic Bounce"],
		stats: {
			hp: 65,
			attack: 65,
			defense: 60,
			specialAttack: 130,
			specialDefense: 95,
			speed: 110
		},
		expYield: 184,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 3,
			purple: 6
		},
		learnset: [
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 1 } },
			{ name: "Take Down", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Double-Edge", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Confusion", unlock: { type: "level", amount: 1 } }, //evolution
			{ name: "Sand Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 10 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 15 } },
			{ name: "Swift", unlock: { type: "level", amount: 20 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 25 } },
		]
	},
	"Murkrow": {
		name: "Murkrow",
		number: "198",
		weight: {
			pounds: 4.6,
			kilograms: 2.1
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0198Murkrow.png",
			"largeShiny": "src/img/shiny-pokemon/198-Murkrow.png",
			"home": "src/img/tiny-pokemon/Murkrow.png"
		},
		sounds: {
			"cry": "src/audio/cries/murkrow.mp3"
		},
		types: ["Dark", "Flying"],
		tags: [],
		abilities: ["Insomnia", "Super Luck"],
		hiddenAbilities: ["Prankster"],
		stats: {
			hp: 60,
			attack: 85,
			defense: 42,
			specialAttack: 85,
			specialDefense: 42,
			speed: 91
		},
		expYield: 81,
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
			yellow: 1,
			purple: 3
		},
		evolutions: [
			{ name: "Honchkrow", unlock: { type: "fourMatchPurple", amount: 10 } }
		],
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 5 } },
			{ name: "Haze", unlock: { type: "level", amount: 11 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 15 } },
			{ name: "Night Shade", unlock: { type: "level", amount: 21 } },
			{ name: "Assurance", unlock: { type: "level", amount: 25 } },
			{ name: "Taunt", unlock: { type: "level", amount: 31 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 35 } },
		]
	},
	"Misdreavus": {
		name: "Misdreavus",
		number: "200",
		weight: {
			pounds: 2.2,
			kilograms: 1.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0200Misdreavus.png",
			"largeShiny": "src/img/shiny-pokemon/200-Misdreavus.png",
			"home": "src/img/tiny-pokemon/Misdreavus.png"
		},
		sounds: {
			"cry": "src/audio/cries/misdreavus.mp3"
		},
		types: ["Ghost"],
		tags: [],
		abilities: ["Levitate"],
		hiddenAbilities: [],
		stats: {
			hp: 60,
			attack: 60,
			defense: 60,
			specialAttack: 85,
			specialDefense: 85,
			speed: 85
		},
		expYield: 87,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			red: 3,
			purple: 3
		},
		evolutions: [
			{ name: "Mismagius", unlock: { type: "fourMatchPurple", amount: 10 } }
		],
		learnset: [
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Confusion", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 10 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 14 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 19 } },
			{ name: "Hex", unlock: { type: "level", amount: 23 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 28 } },
		]
	},
	"Delibird": {
		name: "Delibird",
		number: "225",
		weight: {
			pounds: 35.3,
			kilograms: 16.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0225Delibird.png",
			"largeShiny": "src/img/shiny-pokemon/225-Delibird.png",
			"home": "src/img/tiny-pokemon/Delibird.png"
		},
		sounds: {
			"cry": "src/audio/cries/delibird.mp3"
		},
		types: ["Ice", "Flying"],
		tags: [],
		abilities: ["Vital Spirit", "Hustle"],
		hiddenAbilities: ["Insomnia"],
		stats: {
			hp: 45,
			attack: 55,
			defense: 45,
			specialAttack: 65,
			specialDefense: 45,
			speed: 75
		},
		expYield: 116,
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
			purple: 1
		},
		learnset: [
			{ name: "Present", unlock: { type: "level", amount: 1 } },
			{ name: "Drill Peck", unlock: { type: "level", amount: 25 } },
		]
	},
	"Houndour": {
		name: "Houndour",
		number: "228",
		weight: {
			pounds: 23.8,
			kilograms: 10.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0228Houndour.png",
			"largeShiny": "src/img/shiny-pokemon/228-Houndour.png",
			"home": "src/img/tiny-pokemon/Houndour.png"
		},
		sounds: {
			"cry": "src/audio/cries/houndour.mp3"
		},
		types: ["Dark", "Fire"],
		tags: [],
		abilities: ["Early Bird", "Flash Fire"],
		hiddenAbilities: ["Unnerve"],
		stats: {
			hp: 45,
			attack: 60,
			defense: 30,
			specialAttack: 80,
			specialDefense: 50,
			speed: 65
		},
		expYield: 66,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 3,
			purple: 3
		},
		learnset: [
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Howl", unlock: { type: "level", amount: 4 } },
			{ name: "Smog", unlock: { type: "level", amount: 8 } },
			{ name: "Roar", unlock: { type: "level", amount: 13 } },
			{ name: "Bite", unlock: { type: "level", amount: 16 } },
			{ name: "Incinerate", unlock: { type: "level", amount: 20 } },
			{ name: "Beat Up", unlock: { type: "level", amount: 25 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 28 } },
			{ name: "Torment", unlock: { type: "level", amount: 32 } },
		]
	},
	"Smeargle": {
		name: "Smeargle",
		number: "235",
		weight: {
			pounds: 127.9,
			kilograms: 58.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0235Smeargle.png",
			"largeShiny": "src/img/shiny-pokemon/235-Smeargle.png",
			"home": "src/img/tiny-pokemon/Smeargle.png"
		},
		sounds: {
			"cry": "src/audio/cries/smeargle.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Own Tempo", "Technician"],
		hiddenAbilities: ["Moody"],
		stats: {
			hp: 55,
			attack: 20,
			defense: 35,
			specialAttack: 20,
			specialDefense: 45,
			speed: 75
		},
		expYield: 88,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			red: 2,
			orange: 2,
			yellow: 2,
			green: 2,
			blue: 2,
			purple: 2
		},
		learnset: [
			{
				name: "Sketch",
				unlock: {
					type: "level",
					amount: 1
				}
			},
		]
	},
	"Smoochum": {
		name: "Smoochum",
		number: "238",
		weight: {
			pounds: 13.2,
			kilograms: 6.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0238Smoochum.png",
			"largeShiny": "src/img/shiny-pokemon/238-Smoochum.png",
			"home": "src/img/tiny-pokemon/Smoochum.png"
		},
		sounds: {
			"cry": "src/audio/cries/smoochum.mp3"
		},
		types: ["Ice", "Psychic"],
		tags: [],
		abilities: ["Oblivious", "Forewarn"],
		hiddenAbilities: ["Hydration"],
		stats: {
			hp: 45,
			attack: 30,
			defense: 15,
			specialAttack: 85,
			specialDefense: 65,
			speed: 65
		},
		expYield: 61,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 2,
			blue: 3
		},
		learnset: [
			{ name: "Lick", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Powder Snow", unlock: { type: "level", amount: 4 } },
			{ name: "Copycat", unlock: { type: "level", amount: 8 } },
			{ name: "Confusion", unlock: { type: "level", amount: 12 } },
			{ name: "Covet", unlock: { type: "level", amount: 16 } },
			{ name: "Sing", unlock: { type: "level", amount: 20 } },
		]
	},
	"Miltank": {
		name: "Miltank",
		number: "241",
		weight: {
			pounds: 166.4,
			kilograms: 75.5
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0241Miltank.png",
			"largeShiny": "src/img/shiny-pokemon/241-Miltank.png",
			"home": "src/img/tiny-pokemon/Miltank.png"
		},
		sounds: {
			"cry": "src/audio/cries/miltank.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Thick Fat", "Scrappy"],
		hiddenAbilities: ["Sap Sipper"],
		stats: {
			hp: 95,
			attack: 80,
			defense: 105,
			specialAttack: 40,
			specialDefense: 70,
			speed: 100
		},
		expYield: 172,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			green: 2,
			blue: 3,
			purple: 2,
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Rollout", unlock: { type: "level", amount: 5 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 10 } },
			{ name: "Stomp", unlock: { type: "level", amount: 15 } },
			{ name: "Heal Bell", unlock: { type: "level", amount: 20 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 25 } },
		]
	},
	"Poochyena": {
		name: "Poochyena",
		number: "261",
		weight: {
			pounds: 30.0,
			kilograms: 13.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0261Poochyena.png",
			"largeShiny": "src/img/shiny-pokemon/261-Poochyena.png",
			"home": "src/img/tiny-pokemon/Poochyena.png"
		},
		sounds: {
			"cry": "src/audio/cries/poochyena.mp3"
		},
		types: ["Dark"],
		tags: [],
		abilities: ["Run Away", "Quick Feet"],
		hiddenAbilities: ["Rattled"],
		stats: {
			hp: 35,
			attack: 55,
			defense: 35,
			specialAttack: 30,
			specialDefense: 30,
			speed: 35
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			purple: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Howl", unlock: { type: "level", amount: 4 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 7 } },
			{ name: "Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Leer", unlock: { type: "level", amount: 13 } },
			{ name: "Roar", unlock: { type: "level", amount: 16 } },
			{ name: "Swagger", unlock: { type: "level", amount: 19 } },
			{ name: "Assurance", unlock: { type: "level", amount: 22 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 25 } },
			{ name: "Taunt", unlock: { type: "level", amount: 28 } },
			{ name: "Crunch", unlock: { type: "level", amount: 31 } },
			{ name: "Yawn", unlock: { type: "level", amount: 34 } },
			{ name: "Take Down", unlock: { type: "level", amount: 36 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 40 } },
			{ name: "Play Rough", unlock: { type: "level", amount: 44 } },
		]
	},
	"Wingull": {
		name: "Wingull",
		number: "278",
		weight: {
			pounds: 20.9,
			kilograms: 9.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0278Wingull.png",
			"largeShiny": "src/img/shiny-pokemon/278-Wingull.png",
			"home": "src/img/tiny-pokemon/Wingull.png"
		},
		sounds: {
			"cry": "src/audio/cries/wingull.mp3"
		},
		types: ["Water", "Flying"],
		tags: [],
		abilities: ["Keen Eye", "Hydration"],
		hiddenAbilities: ["Rain Dish"],
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
		evolutions: [
			{ name: "Pelipper", unlock: { type: "level", amount: 25 } }
		],
		learnset: [
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 10 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 15 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 20 } },
			{ name: "Agility", unlock: { type: "level", amount: 26 } },
		]
	},
	"Pelipper": {
		name: "Pelipper",
		number: "279",
		weight: {
			pounds: 61.7,
			kilograms: 28.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0279Pelipper.png",
			"largeShiny": "src/img/shiny-pokemon/279-Pelipper.png",
			"home": "src/img/tiny-pokemon/Pelipper.png"
		},
		sounds: {
			"cry": "src/audio/cries/pelipper.mp3"
		},
		types: ["Water", "Flying"],
		tags: [],
		abilities: ["Keen Eye", "Drizzle"],
		hiddenAbilities: ["Rain Dish"],
		stats: {
			hp: 60,
			attack: 50,
			defense: 100,
			specialAttack: 95,
			specialDefense: 70,
			speed: 65
		},
		expYield: 154,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 1,
			orange: 1,
			yellow: 2,
			green: 1,
			blue: 4,
			purple: 1,
		},
		learnset: [
			{ name: "Protect", unlock: { type: "level", amount: 1 } },
			// { name: "Soak", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Agility", unlock: { type: "level", amount: 1 } },
			// { name: "Air Slash", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 1 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 1 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 1 } },
			{ name: "Swallow", unlock: { type: "level", amount: 1 } },
		]
	},
	"Surskit": {
		name: "Surskit",
		number: "283",
		weight: {
			pounds: 3.7,
			kilograms: 1.7
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0283Surskit.png",
			"largeShiny": "src/img/shiny-pokemon/283-Surskit.png",
			"home": "src/img/tiny-pokemon/Surskit.png"
		},
		sounds: {
			"cry": "src/audio/cries/surskit.mp3"
		},
		tags: [],
		types: ["Bug", "Water"],
		abilities: ["Swift Swim"],
		hiddenAbilities: ["Rain Dish"],
		stats: {
			hp: 40,
			attack: 30,
			defense: 32,
			specialAttack: 50,
			specialDefense: 52,
			speed: 65
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
			blue: 3,
			green: 1,
			yellow: 1,
		},
		evolutions: [
			{ name: "Masquerain", unlock: { type: "level", amount: 22 } }
		],
		learnset: [
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 6 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 9 } },
			{ name: "Soak", unlock: { type: "level", amount: 14 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 17 } },
			{ name: "Agility", unlock: { type: "level", amount: 22 } },
			{ name: "Mist", unlock: { type: "level", amount: 25 } },
			{ name: "Haze", unlock: { type: "level", amount: 25 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 35 } },
		]
	},
	"Masquerain": {
		name: "Masquerain",
		number: "284",
		weight: {
			pounds: 7.9,
			kilograms: 3.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0284Masquerain.png",
			"largeShiny": "src/img/shiny-pokemon/284-Masquerain.png",
			"home": "src/img/tiny-pokemon/Masquerain.png"
		},
		sounds: {
			"cry": "src/audio/cries/masquerain.mp3"
		},
		tags: [],
		types: ["Bug", "Flying"],
		abilities: ["Intimidate"],
		hiddenAbilities: ["Unnerve"],
		stats: {
			hp: 70,
			attack: 60,
			defense: 62,
			specialAttack: 100,
			specialDefense: 82,
			speed: 80
		},
		expYield: 159,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			yellow: 3,
			green: 2,
			blue: 5,
		},
		learnset: [
			{ name: "Whirlwind", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 1 } },
			{ name: "Soak", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 17 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 22 } },
			{ name: "Air Cutter", unlock: { type: "level", amount: 22 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 26 } },
		]
	},
	"Makuhita": {
		name: "Makuhita",
		number: "296",
		weight: {
			pounds: 190.5,
			kilograms: 86.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0296Makuhita.png",
			"largeShiny": "src/img/shiny-pokemon/296-Makuhita.png",
			"home": "src/img/tiny-pokemon/Makuhita.png"
		},
		sounds: {
			"cry": "src/audio/cries/makuhita.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Thick Fat", "Guts"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 72,
			attack: 60,
			defense: 30,
			specialAttack: 20,
			specialDefense: 30,
			speed: 25
		},
		expYield: 47,
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
			red: 2
		},
		evolutions: [
			{ name: "Hariyama", unlock: { type: "level", amount: 24 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 4 } },
			{ name: "Arm Thrust", unlock: { type: "level", amount: 7 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 10 } },
			{ name: "Force Palm", unlock: { type: "level", amount: 13 } },
			{ name: "Whirlwind", unlock: { type: "level", amount: 16 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 19 } },
			{ name: "Bulk Up", unlock: { type: "level", amount: 22 } },
		]
	},
	"Hariyama": {
		name: "Hariyama",
		number: "297",
		weight: {
			pounds: 559.5,
			kilograms: 253.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0297Hariyama.png",
			"largeShiny": "src/img/shiny-pokemon/297-Hariyama.png",
			"home": "src/img/tiny-pokemon/Hariyama.png"
		},
		sounds: {
			"cry": "src/audio/cries/hariyama.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Thick Fat", "Guts"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 144,
			attack: 120,
			defense: 60,
			specialAttack: 40,
			specialDefense: 60,
			speed: 50
		},
		expYield: 166,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			red: 3,
			yellow: 2
		},
		learnset: [
			{ name: "Brine", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Arm Thrust", unlock: { type: "level", amount: 1 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 10 } },
			{ name: "Force Palm", unlock: { type: "level", amount: 13 } },
			{ name: "Whirlwind", unlock: { type: "level", amount: 16 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 19 } },
			{ name: "Bulk Up", unlock: { type: "level", amount: 22 } },
		]
	},
	"Sableye": {
		name: "Sableye",
		number: "302",
		weight: {
			pounds: 24.3,
			kilograms: 11.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0302Sableye.png",
			"largeShiny": "src/img/shiny-pokemon/302-Sableye.png",
			"home": "src/img/tiny-pokemon/Sableye.png"
		},
		sounds: {
			"cry": "src/audio/cries/sableye.mp3"
		},
		types: ["Dark", "Ghost"],
		tags: [],
		abilities: ["Keen Eye", "Stall"],
		hiddenAbilities: ["Prankster"],
		stats: {
			hp: 50,
			attack: 75,
			defense: 75,
			specialAttack: 65,
			specialDefense: 65,
			speed: 50
		},
		expYield: 133,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 4,
			yellow: 2
		},
		learnset: [
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 3 } },
			{ name: "Shadow Sneak", unlock: { type: "level", amount: 9 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 12 } },
			{ name: "Disable", unlock: { type: "level", amount: 15 } },
			{ name: "Detect", unlock: { type: "level", amount: 18 } },
			{ name: "Night Shade", unlock: { type: "level", amount: 21 } },
		]
	},
	"Mawile": {
		name: "Mawile",
		number: "303",
		weight: {
			pounds: 24.3,
			kilograms: 11.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0303Mawile.png",
			"largeShiny": "src/img/shiny-pokemon/303-Mawile.png",
			"home": "src/img/tiny-pokemon/Mawile.png"
		},
		sounds: {
			"cry": "src/audio/cries/mawile.mp3"
		},
		types: ["Steel", "Fairy"],
		tags: [],
		abilities: ["Hyper Cutter", "Intimidate"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 50,
			attack: 85,
			defense: 85,
			specialAttack: 55,
			specialDefense: 55,
			speed: 50
		},
		expYield: 133,
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
			green: 2,
			purple: 2
		},
		learnset: [
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 4 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 8 } },
			{ name: "Bite", unlock: { type: "level", amount: 12 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 16 } },
			{ name: "Swallow", unlock: { type: "level", amount: 16 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 16 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 20 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 24 } },
			{ name: "Crunch", unlock: { type: "level", amount: 28 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 32 } },
		]
	},
	"Spinda": {
		name: "Spinda",
		number: "327",
		weight: {
			pounds: 11.0,
			kilograms: 5.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0327Spinda.png",
			"largeShiny": "src/img/shiny-pokemon/327-Spinda.png",
			"home": "src/img/tiny-pokemon/Spinda.png"
		},
		sounds: {
			"cry": "src/audio/cries/spinda.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Own Tempo", "Tangled Feet"],
		hiddenAbilities: ["Contrary"],
		stats: {
			hp: 60,
			attack: 60,
			defense: 60,
			specialAttack: 60,
			specialDefense: 60,
			speed: 60
		},
		expYield: 126,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 1,
			orange: 1,
			yellow: 1,
			green: 1,
			blue: 1,
			purple: 4
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 5 } },
			{ name: "Teeter Dance", unlock: { type: "level", amount: 9 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 14 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 19 } },
			{ name: "Body Slam", unlock: { type: "level", amount: 23 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 28 } },
		]
	},
	"Bagon": {
		name: "Bagon",
		number: "371",
		weight: {
			pounds: 92.8,
			kilograms: 42.1
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0371Bagon.png",
			"largeShiny": "src/img/shiny-pokemon/371-Bagon.png",
			"home": "src/img/tiny-pokemon/Bagon.png"
		},
		sounds: {
			"cry": "src/audio/cries/bagon.mp3"
		},
		types: ["Dragon"],
		tags: [],
		abilities: ["Rock Head"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 45,
			attack: 75,
			defense: 60,
			specialAttack: 40,
			specialDefense: 30,
			speed: 50
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
			red: 2,
			orange: 2,
			blue: 1,
			purple: 2
		},
		learnset: [
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 5 } },
			{ name: "Dragon Breath", unlock: { type: "level", amount: 10 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 15 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 20 } },
			{ name: "Crunch", unlock: { type: "level", amount: 25 } },
		]
	},
	"Drifloon": {
		name: "Drifloon",
		number: "425",
		weight: {
			pounds: 2.6,
			kilograms: 1.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0425Drifloon.png",
			"largeShiny": "src/img/shiny-pokemon/425-Drifloon.png",
			"home": "src/img/tiny-pokemon/Drifloon.png"
		},
		sounds: {
			"cry": "src/audio/cries/drifloon.mp3"
		},
		types: ["Ghost", "Flying"],
		tags: [],
		abilities: ["Aftermath", "Unburden"],
		hiddenAbilities: ["Flare Boost"],
		stats: {
			hp: 90,
			attack: 50,
			defense: 34,
			specialAttack: 60,
			specialDefense: 44,
			speed: 70
		},
		expYield: 70,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 2,
			purple: 5,
		},
		evolutions: [
			{ name: "Drifblim", unlock: { type: "level", amount: 28 } }
		],
		learnset: [
			{ name: "Minimize", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 4 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 8 } },
			{ name: "Payback", unlock: { type: "level", amount: 12 } },
			{ name: "Hex", unlock: { type: "level", amount: 16 } },
			{ name: "Shadow Ball", unlock: { type: "level", amount: 20 } },
		]
	},
	"Drifblim": {
		name: "Drifblim",
		number: "426",
		weight: {
			pounds: 33.1,
			kilograms: 15.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0426Drifblim.png",
			"largeShiny": "src/img/shiny-pokemon/426-Drifblim.png",
			"home": "src/img/tiny-pokemon/Drifblim.png"
		},
		sounds: {
			"cry": "src/audio/cries/drifblim.mp3"
		},
		types: ["Ghost", "Flying"],
		tags: [],
		abilities: ["Aftermath", "Unburden"],
		hiddenAbilities: ["Flare Boost"],
		stats: {
			hp: 150,
			attack: 80,
			defense: 44,
			specialAttack: 90,
			specialDefense: 54,
			speed: 80
		},
		expYield: 174,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 2,
			yellow: 3,
			purple: 5,
		},
		learnset: [
			{ name: "Strength Sap", unlock: { type: "level", amount: 1 } },
			{ name: "Minimize", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Phantom Force", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Payback", unlock: { type: "level", amount: 12 } },
			{ name: "Hex", unlock: { type: "level", amount: 16 } },
			{ name: "Shadow Ball", unlock: { type: "level", amount: 20 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 24 } },
			{ name: "Swallow", unlock: { type: "level", amount: 24 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 24 } },
		]
	},
	"Mismagius": {
		name: "Mismagius",
		number: "429",
		weight: {
			pounds: 9.7,
			kilograms: 4.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0429Mismagius.png",
			"largeShiny": "src/img/shiny-pokemon/429-Mismagius.png",
			"home": "src/img/tiny-pokemon/Mismagius.png"
		},
		sounds: {
			"cry": "src/audio/cries/mismagius.mp3"
		},
		types: ["Ghost"],
		tags: [],
		abilities: ["Levitate"],
		hiddenAbilities: [],
		stats: {
			hp: 60,
			attack: 60,
			defense: 60,
			specialAttack: 105,
			specialDefense: 105,
			speed: 105
		},
		expYield: 173,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			red: 5,
			purple: 5
		},
		learnset: [
			{ name: "Mystical Fire", unlock: { type: "level", amount: 1 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 1 } },
			{ name: "Phantom Force", unlock: { type: "level", amount: 1 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Spite", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
		]
	},
	"Honchkrow": {
		name: "Honchkrow",
		number: "430",
		weight: {
			pounds: 60.2,
			kilograms: 27.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0430Honchkrow.png",
			"largeShiny": "src/img/shiny-pokemon/430-Honchkrow.png",
			"home": "src/img/tiny-pokemon/Honchkrow.png"
		},
		sounds: {
			"cry": "src/audio/cries/honchkrow.mp3"
		},
		types: ["Dark", "Flying"],
		tags: [],
		abilities: ["Insomnia", "Super Luck"],
		hiddenAbilities: ["Moxie"],
		stats: {
			hp: 100,
			attack: 125,
			defense: 52,
			specialAttack: 105,
			specialDefense: 52,
			speed: 71
		},
		expYield: 177,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 2,
			yellow: 1,
			blue: 1,
			purple: 4
		},
		learnset: [
			{ name: "Night Slash", unlock: { type: "level", amount: 1 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Haze", unlock: { type: "level", amount: 1 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Quash", unlock: { type: "level", amount: 1 } },
			{ name: "Swagger", unlock: { type: "level", amount: 25 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 35 } },
		]
	},
	"Bonsly": {
		name: "Bonsly",
		number: "438",
		weight: {
			pounds: 33.1,
			kilograms: 15.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0438Bonsly.png",
			"largeShiny": "src/img/shiny-pokemon/438-Bonsly.png",
			"home": "src/img/tiny-pokemon/Bonsly.png"
		},
		sounds: {
			"cry": "src/audio/cries/bonsly.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Sturdy", "Rock Head"],
		hiddenAbilities: ["Rattled"],
		stats: {
			hp: 50,
			attack: 80,
			defense: 95,
			specialAttack: 10,
			specialDefense: 45,
			speed: 10
		},
		expYield: 58,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			green: 2,
		},
		learnset: [
			{ name: "Fake Tears", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Flail", unlock: { type: "level", amount: 4 } },
			{ name: "Rock Throw", unlock: { type: "level", amount: 8 } },
			{ name: "Block", unlock: { type: "level", amount: 12 } },
			{ name: "Mimic", unlock: { type: "level", amount: 16 } },
			{ name: "Rock Tomb", unlock: { type: "level", amount: 20 } },
		]
	},
	"Happiny": {
		name: "Happiny",
		number: "440",
		weight: {
			pounds: 53.8,
			kilograms: 24.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0440Happiny.png",
			"largeShiny": "src/img/shiny-pokemon/440-Happiny.png",
			"home": "src/img/tiny-pokemon/Happiny.png"
		},
		sounds: {
			"cry": "src/audio/cries/happiny.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Natural Cure", "Serene Grace"],
		hiddenAbilities: ["Friend Guard"],
		stats: {
			hp: 100,
			attack: 5,
			defense: 5,
			specialAttack: 15,
			specialDefense: 65,
			speed: 30
		},
		expYield: 110,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 2,
			blue: 2,
			purple: 2
		},
		evolutions: [
			{ name: "Chansey", unlock: { type: "fourMatchGreen", amount: 10 } }
		],
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 4 } },
			{ name: "Sweet Kiss", unlock: { type: "level", amount: 8 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 12 } },
			{ name: "Covet", unlock: { type: "level", amount: 16 } },
			{ name: "Charm", unlock: { type: "level", amount: 20 } },
		]
	},
	"Glaceon": {
		name: "Glaceon",
		number: "471",
		weight: {
			pounds: 57.1,
			kilograms: 25.9
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0471Glaceon.png",
			"largeShiny": "src/img/shiny-pokemon/471-Glaceon.png",
			"home": "src/img/tiny-pokemon/Glaceon.png"
		},
		sounds: {
			"cry": "src/audio/cries/glaceon.mp3"
		},
		types: ["Ice"],
		tags: [],
		abilities: ["Snow Cloak"],
		hiddenAbilities: ["Ice Body"],
		stats: {
			hp: 65,
			attack: 60,
			defense: 110,
			specialAttack: 130,
			specialDefense: 95,
			speed: 65
		},
		expYield: 184,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 5,
			blue: 5
		},
		learnset: [
			{ name: "Covet", unlock: { type: "level", amount: 1 } },
			{ name: "Swift", unlock: { type: "level", amount: 1 } },
			{ name: "Copycat", unlock: { type: "level", amount: 1 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 1 } },
			{ name: "Take Down", unlock: { type: "level", amount: 1 } },
			{ name: "Charm", unlock: { type: "level", amount: 1 } },
			{ name: "Double-Edge", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Icy Wind", unlock: { type: "level", amount: 1 } }, //evolutiomn
			{ name: "Sand Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 10 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 15 } },
			{ name: "Ice Shard", unlock: { type: "level", amount: 20 } },
			{ name: "Bite", unlock: { type: "level", amount: 25 } },
		]
	},
	"Lillipup": {
		name: "Lillipup",
		number: "506",
		weight: {
			pounds: 9.0,
			kilograms: 4.1
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0506Lillipup.png",
			"largeShiny": "src/img/shiny-pokemon/506-Lillipup.png",
			"home": "src/img/tiny-pokemon/Lillipup.png"
		},
		sounds: {
			"cry": "src/audio/cries/lillipup.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Vital Spirit", "Pickup"],
		hiddenAbilities: ["Run Away"],
		stats: {
			hp: 45,
			attack: 60,
			defense: 45,
			specialAttack: 25,
			specialDefense: 45,
			speed: 55
		},
		expYield: 55,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			purple: 2
		},
		evolutions: [
			{ name: "Herdier", unlock: { type: "level", amount: 16 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Work Up", unlock: { type: "level", amount: 4 } },
			{ name: "Bite", unlock: { type: "level", amount: 8 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 12 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 17 } },
			{ name: "Play Rough", unlock: { type: "level", amount: 20 } },
			{ name: "Crunch", unlock: { type: "level", amount: 24 } },
			{ name: "Take Down", unlock: { type: "level", amount: 28 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 32 } },
			{ name: "Reversal", unlock: { type: "level", amount: 36 } },
			{ name: "Roar", unlock: { type: "level", amount: 40 } },
		]
	},
	"Herdier": {
		name: "Herdier",
		number: "507",
		weight: {
			pounds: 32.4,
			kilograms: 14.7
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0507Herdier.png",
			"largeShiny": "src/img/shiny-pokemon/507-Herdier.png",
			"home": "src/img/tiny-pokemon/Herdier.png"
		},
		sounds: {
			"cry": "src/audio/cries/herdier.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Intimidate", "Sand Rush"],
		hiddenAbilities: ["Scrappy"],
		stats: {
			hp: 65,
			attack: 80,
			defense: 65,
			specialAttack: 35,
			specialDefense: 65,
			speed: 60
		},
		expYield: 130,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			purple: 3,
			red: 1
		},
		evolutions: [
			{ name: "Stoutland", unlock: { type: "level", amount: 32 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Work Up", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 12 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 19 } },
			{ name: "Play Rough", unlock: { type: "level", amount: 24 } },
			{ name: "Crunch", unlock: { type: "level", amount: 30 } },
			{ name: "Take Down", unlock: { type: "level", amount: 36 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 42 } },
			{ name: "Reversal", unlock: { type: "level", amount: 48 } },
			{ name: "Roar", unlock: { type: "level", amount: 54 } },
		]
	},
	"Stoutland": {
		name: "Stoutland",
		number: "508",
		weight: {
			pounds: 134.5,
			kilograms: 61.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0508Stoutland.png",
			"largeShiny": "src/img/shiny-pokemon/508-Stoutland.png",
			"home": "src/img/tiny-pokemon/Stoutland.png"
		},
		sounds: {
			"cry": "src/audio/cries/stoutland.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Intimidate", "Sand Rush"],
		hiddenAbilities: ["Scrappy"],
		stats: {
			hp: 85,
			attack: 110,
			defense: 90,
			specialAttack: 45,
			specialDefense: 90,
			speed: 80
		},
		expYield: 225,
		evYield: {
			hp: 0,
			attack: 3,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			purple: 4,
			red: 2
		},
		learnset: [
			{ name: "Ice Fang", unlock: { type: "level", amount: 1 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Fang", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Work Up", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 12 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 19 } },
			{ name: "Play Rough", unlock: { type: "level", amount: 24 } },
			{ name: "Crunch", unlock: { type: "level", amount: 30 } },
			{ name: "Take Down", unlock: { type: "level", amount: 38 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 46 } },
			{ name: "Reversal", unlock: { type: "level", amount: 54 } },
			{ name: "Roar", unlock: { type: "level", amount: 62 } },
		]
	},
	"Roggenrola": {
		name: "Roggenrola",
		number: "524",
		weight: {
			pounds: 39.7,
			kilograms: 18.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0524Roggenrola.png",
			"largeShiny": "src/img/shiny-pokemon/524-Roggenrola.png",
			"home": "src/img/tiny-pokemon/Roggenrola.png"
		},
		sounds: {
			"cry": "src/audio/cries/roggenrola.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Sturdy", "Weak Armor"],
		hiddenAbilities: ["Sand Force"],
		stats: {
			hp: 55,
			attack: 75,
			defense: 85,
			specialAttack: 25,
			specialDefense: 25,
			speed: 15
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			green: 2
		},
		evolutions: [
			{ name: "Boldore", unlock: { type: "level", amount: 25 } }
		],
		learnset: [
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 4 } },
			{ name: "Stealth Rock", unlock: { type: "level", amount: 8 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 12 } },
			{ name: "Smack Down", unlock: { type: "level", amount: 16 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 20 } },
		]
	},
	"Boldore": {
		name: "Boldore",
		number: "525",
		weight: {
			pounds: 224.9,
			kilograms: 102.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0525Boldore.png",
			"largeShiny": "src/img/shiny-pokemon/525-Boldore.png",
			"home": "src/img/tiny-pokemon/Boldore.png"
		},
		sounds: {
			"cry": "src/audio/cries/boldore.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Sturdy", "Weak Armor"],
		hiddenAbilities: ["Sand Force"],
		stats: {
			hp: 70,
			attack: 105,
			defense: 105,
			specialAttack: 50,
			specialDefense: 40,
			speed: 20
		},
		expYield: 137,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			green: 2
		},
		learnset: [
			{ name: "Power Gem", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 1 } },
			{ name: "Stealth Rock", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 12 } },
			{ name: "Smack Down", unlock: { type: "level", amount: 16 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 20 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 24 } },
		]
	},
	"Cottonee": {
		name: "Cottonee",
		number: "546",
		weight: {
			pounds: 1.3,
			kilograms: 0.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0546Cottonee.png",
			"largeShiny": "src/img/shiny-pokemon/546-Cottonee.png",
			"home": "src/img/tiny-pokemon/Cottonee.png"
		},
		sounds: {
			"cry": "src/audio/cries/cottonee.mp3"
		},
		types: ["Grass", "Fairy"],
		tags: [],
		abilities: ["Prankster", "Infiltrator"],
		hiddenAbilities: ["Chlorophyll"],
		stats: {
			hp: 40,
			attack: 27,
			defense: 60,
			specialAttack: 37,
			specialDefense: 50,
			speed: 66
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			green: 2,
			blue: 2,
			purple: 2
		},
		evolutions: [
			{ name: "Whimsicott", unlock: { type: "fiveMatchGreen", amount: 1 } },
		],
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 12 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Growth", unlock: { type: "level", amount: 18 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 21 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 24 } },
			{ name: "Charm", unlock: { type: "level", amount: 27 } },
		]
	},
	"Whimsicott": {
		name: "Whimsicott",
		number: "547",
		weight: {
			pounds: 14.6,
			kilograms: 6.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0547Whimsicott.png",
			"largeShiny": "src/img/shiny-pokemon/547-Whimsicott.png",
			"home": "src/img/tiny-pokemon/Whimsicott.png"
		},
		sounds: {
			"cry": "src/audio/cries/whimsicott.mp3"
		},
		types: ["Grass", "Fairy"],
		tags: [],
		abilities: ["Prankster", "Infiltrator"],
		hiddenAbilities: ["Chlorophyll"],
		stats: {
			hp: 60,
			attack: 67,
			defense: 85,
			specialAttack: 77,
			specialDefense: 75,
			speed: 116
		},
		expYield: 168,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			yellow: 2,
			green: 4,
			blue: 2,
			purple: 2
		},
		learnset: [
			//I AM MAKING AN EXECUTIVE DECISION HERE THIS THING
			//SHOULDN'T JUST LEARN EVERYTHING IN ONE BLAST
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 8 } },
			// { name: "Moonblast", unlock: { type: "level", amount: 10 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 12 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Gust", unlock: { type: "level", amount: 16 } },
			{ name: "Growth", unlock: { type: "level", amount: 18 } },
			// { name: "Memento", unlock: { type: "level", amount: 20 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 21 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 24 } },
			{ name: "Charm", unlock: { type: "level", amount: 27 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 30 } },
			// { name: "Cotton Spore", unlock: { type: "level", amount: 33 } },
			// { name: "Energy Ball", unlock: { type: "level", amount: 36 } },
			// { name: "Sunny Day", unlock: { type: "level", amount: 39 } },
			// { name: "Endeavor", unlock: { type: "level", amount: 42 } },
			// { name: "Hurricane", unlock: { type: "level", amount: 44 } },
			// { name: "Cotton Guard", unlock: { type: "level", amount: 45 } },
			// { name: "Solar Beam", unlock: { type: "level", amount: 48 } },
		]
	},
	"Petilil": {
		name: "Petilil",
		number: "548",
		weight: {
			pounds: 14.6,
			kilograms: 6.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0548Petilil.png",
			"largeShiny": "src/img/shiny-pokemon/548-Petilil.png",
			"home": "src/img/tiny-pokemon/Petilil.png"
		},
		sounds: {
			"cry": "src/audio/cries/petilil.mp3"
		},
		types: ["Grass"],
		tags: [],
		abilities: ["Chlorophyll", "Own Tempo"],
		hiddenAbilities: ["Leaf Guard"],
		stats: {
			hp: 45,
			attack: 35,
			defense: 50,
			specialAttack: 70,
			specialDefense: 50,
			speed: 30
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 1,
			green: 3,
			blue: 1
		},
		evolutions: [
			{ name: "Lilligant", unlock: { type: "fiveMatchGreen", amount: 1 } },
			{ name: "Lilligant-Hisui", unlock: { type: "fiveMatchOrange", amount: 1 } },
		],
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 9 } },
			{ name: "Charm", unlock: { type: "level", amount: 12 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Sleep Powder", unlock: { type: "level", amount: 18 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 21 } },
		]
	},
	"Lilligant": {
		name: "Lilligant",
		number: "549",
		weight: {
			pounds: 35.9,
			kilograms: 16.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0549Lilligant.png",
			"largeShiny": "src/img/shiny-pokemon/549-Lilligant.png",
			"home": "src/img/tiny-pokemon/Lilligant.png"
		},
		sounds: {
			"cry": "src/audio/cries/lilligant.mp3"
		},
		types: ["Grass"],
		tags: [],
		abilities: ["Chlorophyll", "Own Tempo"],
		hiddenAbilities: ["Leaf Guard"],
		stats: {
			hp: 70,
			attack: 60,
			defense: 75,
			specialAttack: 110,
			specialDefense: 75,
			speed: 90
		},
		expYield: 168,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 1,
			green: 6,
			blue: 2,
			purple: 1
		},
		learnset: [
			//Executive decision again
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 9 } },
			{ name: "Teeter Dance", unlock: { type: "level", amount: 10 } },
			{ name: "Charm", unlock: { type: "level", amount: 12 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Sleep Powder", unlock: { type: "level", amount: 18 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 21 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 24 } },
			// { name: "After You", unlock: { type: "level", amount: 27 } },
			// { name: "Quiver Dance", unlock: { type: "level", amount: 28 } },
			// { name: "Energy Ball", unlock: { type: "level", amount: 30 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 33 } },
			// { name: "Sunny Day", unlock: { type: "level", amount: 36 } },
			// { name: "Entrainment", unlock: { type: "level", amount: 39 } },
			// { name: "Leaf Storm", unlock: { type: "level", amount: 42 } },
			// { name: "Petal Dance", unlock: { type: "level", amount: 46 } },
			// { name: "Petal Blizzard", unlock: { type: "level", amount: 50 } },
		]
	},
	"Lilligant-Hisui": {
		name: "Lilligant",
		id: "Lilligant-Hisui",
		number: "549h",
		weight: {
			pounds: 42.3,
			kilograms: 19.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0549Lilligant-Hisui.png",
			"largeShiny": "src/img/shiny-pokemon/549-Lilligant-Hisui.png",
			"home": "src/img/tiny-pokemon/Lilligant-Hisui.png"
		},
		sounds: {
			"cry": "src/audio/cries/lilligant.mp3"
		},
		types: ["Grass", "Fighting"],
		tags: [],
		abilities: ["Chlorophyll", "Hustle"],
		hiddenAbilities: ["Leaf Guard"],
		stats: {
			hp: 70,
			attack: 105,
			defense: 75,
			specialAttack: 50,
			specialDefense: 75,
			speed: 105
		},
		expYield: 168,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			yellow: 1,
			green: 3,
			blue: 2,
			purple: 1
		},
		learnset: [
			//Executive decision again
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Helping Hand", unlock: { type: "level", amount: 3 } },
			{ name: "Leafage", unlock: { type: "level", amount: 5 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 9 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 9 } },
			// { name: "Defog", unlock: { type: "level", amount: 12 } },
			{ name: "Poison Powder", unlock: { type: "level", amount: 15 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 18 } },
			// { name: "Energy Ball", unlock: { type: "level", amount: 21 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 23 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 25 } },
			// { name: "After You", unlock: { type: "level", amount: 27 } },
			{ name: "Sleep Powder", unlock: { type: "level", amount: 29 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 33 } },
			// { name: "Drain Punch", unlock: { type: "level", amount: 34 } },
			// { name: "Sunny Day", unlock: { type: "level", amount: 36 } },
			// { name: "Recover", unlock: { type: "level", amount: 37 } },
			// { name: "Leaf Blade", unlock: { type: "level", amount: 37 } },
			// { name: "Entrainment", unlock: { type: "level", amount: 39 } },
			// { name: "Mega Kick", unlock: { type: "level", amount: 40 } },
			// { name: "Victory Dance", unlock: { type: "level", amount: 42 } },
			// { name: "Leaf Storm", unlock: { type: "level", amount: 47 } },
			// { name: "Petal Blizzard", unlock: { type: "level", amount: 50 } },
			// { name: "Petal Dance", unlock: { type: "level", amount: 53 } },
			// { name: "Axe Kick", unlock: { type: "level", amount: 55 } },
			// { name: "Close Combat", unlock: { type: "level", amount: 57 } },
			// { name: "Solar Blade", unlock: { type: "level", amount: 60 } },
		]
	},
	"Zorua": {
		name: "Zorua",
		number: "570",
		weight: {
			pounds: 27.6,
			kilograms: 12.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0570Zorua.png",
			"largeShiny": "src/img/shiny-pokemon/570-Zorua.png",
			"home": "src/img/tiny-pokemon/Zorua.png"
		},
		sounds: {
			"cry": "src/audio/cries/zorua.mp3"
		},
		types: ["Dark"],
		tags: [],
		abilities: ["Illusion"],
		hiddenAbilities: [],
		stats: {
			hp: 40,
			attack: 65,
			defense: 40,
			specialAttack: 80,
			specialDefense: 40,
			speed: 65
		},
		expYield: 66,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 3,
			green: 1,
			red: 1,
			orange: 1
		},
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Torment", unlock: { type: "level", amount: 4 } },
			{ name: "Hone Claws", unlock: { type: "level", amount: 8 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 12 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 16 } },
			{ name: "Taunt", unlock: { type: "level", amount: 20 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 24 } },
			{ name: "Fake Tears", unlock: { type: "level", amount: 28 } },
			{ name: "Agility", unlock: { type: "level", amount: 32 } },
			{ name: "Imprison", unlock: { type: "level", amount: 36 } },
		]
	},
	"Rufflet": {
		name: "Rufflet",
		number: "627",
		weight: {
			pounds: 23.1,
			kilograms: 10.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0627Rufflet.png",
			"largeShiny": "src/img/shiny-pokemon/627-Rufflet.png",
			"home": "src/img/tiny-pokemon/Rufflet.png"
		},
		sounds: {
			"cry": "src/audio/cries/rufflet.mp3"
		},
		types: ["Normal", "Flying"],
		tags: [],
		abilities: ["Keen Eye", "Sheer Force"],
		hiddenAbilities: ["Hustle"],
		stats: {
			hp: 70,
			attack: 83,
			defense: 50,
			specialAttack: 37,
			specialDefense: 50,
			speed: 60
		},
		expYield: 70,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 1,
			blue: 3,
			purple: 1
		},
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Hone Claws", unlock: { type: "level", amount: 6 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 12 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 18 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 24 } },
			{ name: "Aerial Ace", unlock: { type: "level", amount: 30 } },
		]
	},
	"Vullaby": {
		name: "Vullaby",
		number: "629",
		weight: {
			pounds: 19.8,
			kilograms: 9.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0629Vullaby.png",
			"largeShiny": "src/img/shiny-pokemon/629-Vullaby.png",
			"home": "src/img/tiny-pokemon/Vullaby.png"
		},
		sounds: {
			"cry": "src/audio/cries/vullaby.mp3"
		},
		types: ["Dark", "Flying"],
		tags: [],
		abilities: ["Big Pecks", "Overcoat"],
		hiddenAbilities: ["Weak Armor"],
		stats: {
			hp: 70,
			attack: 55,
			defense: 75,
			specialAttack: 45,
			specialDefense: 65,
			speed: 60
		},
		expYield: 74,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 4,
			purple: 2
		},
		learnset: [
			{ name: "Gust", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Flatter", unlock: { type: "level", amount: 6 } },
			{ name: "Pluck", unlock: { type: "level", amount: 12 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 18 } },
			{ name: "Knock Off", unlock: { type: "level", amount: 24 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 30 } },
			{ name: "Whirlwind", unlock: { type: "level", amount: 36 } },
		]
	},
	"Pancham": {
		name: "Pancham",
		number: "674",
		weight: {
			pounds: 17.6,
			kilograms: 8.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0674Pancham.png",
			"largeShiny": "src/img/shiny-pokemon/674-Pancham.png",
			"home": "src/img/tiny-pokemon/Pancham.png"
		},
		sounds: {
			"cry": "src/audio/cries/pancham.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Iron Fist", "Mold Breaker"],
		hiddenAbilities: ["Scrappy"],
		stats: {
			hp: 67,
			attack: 82,
			defense: 62,
			specialAttack: 46,
			specialDefense: 48,
			speed: 43
		},
		expYield: 70,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			purple: 2
		},
		evolutions: [
			{ name: "Pangoro", unlock: { type: "levelWithPartyMember", amount: 32, partyMember: {
				types: ["Dark"]
			} } },
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Arm Thrust", unlock: { type: "level", amount: 4 } },
			{ name: "Taunt", unlock: { type: "level", amount: 8 } },
			{ name: "Circle Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Low Sweep", unlock: { type: "level", amount: 16 } },
			{ name: "Work Up", unlock: { type: "level", amount: 20 } },
		]
	},
	"Pangoro": {
		name: "Pangoro",
		number: "675",
		weight: {
			pounds: 299.8,
			kilograms: 136.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0675Pangoro.png",
			"largeShiny": "src/img/shiny-pokemon/675-Pangoro.png",
			"home": "src/img/tiny-pokemon/Pangoro.png"
		},
		sounds: {
			"cry": "src/audio/cries/pangoro.mp3"
		},
		types: ["Fighting", "Dark"],
		tags: [],
		abilities: ["Iron Fist", "Mold Breaker"],
		hiddenAbilities: ["Scrappy"],
		stats: {
			hp: 95,
			attack: 124,
			defense: 78,
			specialAttack: 69,
			specialDefense: 71,
			speed: 58
		},
		expYield: 173,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			purple: 4,
			red: 2
		},
		learnset: [
			{ name: "Night Slash", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			// { name: "Bullet Punch", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Arm Thrust", unlock: { type: "level", amount: 1 } },
			{ name: "Taunt", unlock: { type: "level", amount: 1 } },
			{ name: "Circle Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Low Sweep", unlock: { type: "level", amount: 16 } },
			{ name: "Work Up", unlock: { type: "level", amount: 20 } },
		]
	},
	"Carbink": {
		name: "Carbink",
		number: "703",
		weight: {
			pounds: 12.6,
			kilograms: 5.7
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0703Carbink.png",
			"largeShiny": "src/img/shiny-pokemon/703-Carbink.png",
			"home": "src/img/tiny-pokemon/Carbink.png"
		},
		sounds: {
			"cry": "src/audio/cries/carbink.mp3"
		},
		types: ["Rock", "Fairy"],
		tags: [],
		abilities: ["Clear Body"],
		hiddenAbilities: ["Sturdy"],
		stats: {
			hp: 50,
			attack: 50,
			defense: 150,
			specialAttack: 50,
			specialDefense: 150,
			speed: 50
		},
		expYield: 100,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 4,
			red: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 1 } },
			{ name: "Guard Split", unlock: { type: "level", amount: 5 } },
			{ name: "Smack Down", unlock: { type: "level", amount: 10 } },
			{ name: "Flail", unlock: { type: "level", amount: 15 } },
			{ name: "Ancient Power", unlock: { type: "level", amount: 20 } },
		]
	},
	"Noibat": {
		name: "Noibat",
		number: "714",
		weight: {
			pounds: 17.6,
			kilograms: 8.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0714Noibat.png",
			"largeShiny": "src/img/shiny-pokemon/714-Noibat.png",
			"home": "src/img/tiny-pokemon/Noibat.png"
		},
		sounds: {
			"cry": "src/audio/cries/noibat.mp3"
		},
		types: ["Flying", "Dragon"],
		tags: [],
		abilities: ["Frisk", "Infiltrator"],
		hiddenAbilities: ["Telepathy"],
		stats: {
			hp: 40,
			attack: 30,
			defense: 35,
			specialAttack: 45,
			specialDefense: 40,
			speed: 55
		},
		expYield: 49,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			orange: 1,
			yellow: 1,
			blue: 2,
			purple: 1
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 4 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 8 } },
			{ name: "Double Team", unlock: { type: "level", amount: 12 } },
			{ name: "Wing Attack", unlock: { type: "level", amount: 16 } },
			{ name: "Bite", unlock: { type: "level", amount: 20 } },
		]
	},
	"Rowlet": {
		name: "Rowlet",
		number: "722",
		weight: {
			pounds: 3.3,
			kilograms: 1.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0722Rowlet.png",
			"largeShiny": "src/img/shiny-pokemon/722-Rowlet.png",
			"home": "src/img/tiny-pokemon/Rowlet.png"
		},
		sounds: {
			"cry": "src/audio/cries/rowlet.mp3"
		},
		types: ["Grass"],
		tags: ["Starter"],
		abilities: ["Overgrow"],
		hiddenAbilities: ["Long Reach"],
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
			yellow: 3
		},
		evolutions: [
			{ name: "Dartrix", unlock: { type: "level", amount: 17 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Leafage", unlock: { type: "level", amount: 3 } },
			{ name: "Astonish", unlock: { type: "level", amount: 6 } },
			{ name: "Peck", unlock: { type: "level", amount: 9 } },
			{ name: "Shadow Sneak", unlock: { type: "level", amount: 12 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 18 } },
			{ name: "Pluck", unlock: { type: "level", amount: 21 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 24 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 27 } },
		]
	},
	"Dartrix": {
		name: "Dartrix",
		number: "723",
		weight: {
			pounds: 35.3,
			kilograms: 16.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0723Dartrix.png",
			"largeShiny": "src/img/shiny-pokemon/723-Dartrix.png",
			"home": "src/img/tiny-pokemon/Dartrix.png"
		},
		sounds: {
			"cry": "src/audio/cries/dartrix.mp3"
		},
		types: ["Grass", "Flying"],
		tags: [],
		abilities: ["Overgrow"],
		hiddenAbilities: ["Long Reach"],
		stats: {
			hp: 78,
			attack: 75,
			defense: 75,
			specialAttack: 70,
			specialDefense: 70,
			speed: 52
		},
		expYield: 147,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 1,
			yellow: 3,
			green: 5,
			purple: 1
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Leafage", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Peck", unlock: { type: "level", amount: 9 } },
			{ name: "Shadow Sneak", unlock: { type: "level", amount: 12 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 20 } },
			{ name: "Pluck", unlock: { type: "level", amount: 25 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 30 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 35 } },
		]
	},
	"Litten": {
		name: "Litten",
		number: "725",
		weight: {
			pounds: 9.5,
			kilograms: 4.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0725Litten.png",
			"largeShiny": "src/img/shiny-pokemon/725-Litten.png",
			"home": "src/img/tiny-pokemon/Litten.png"
		},
		sounds: {
			"cry": "src/audio/cries/litten.mp3"
		},
		types: ["Fire"],
		tags: ["Starter"],
		abilities: ["Blaze"],
		hiddenAbilities: ["Intimidate"],
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
		evolutions: [
			{ name: "Torracat", unlock: { type: "level", amount: 17 } }
		],
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 3 } },
			{ name: "Lick", unlock: { type: "level", amount: 6 } },
			{ name: "Roar", unlock: { type: "level", amount: 9 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
			{ name: "Double Kick", unlock: { type: "level", amount: 18 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 21 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 24 } },
			{ name: "Swagger", unlock: { type: "level", amount: 27 } },
		]
	},
	"Torracat": {
		name: "Torracat",
		number: "726",
		weight: {
			pounds: 55.1,
			kilograms: 25.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0726Torracat.png",
			"largeShiny": "src/img/shiny-pokemon/726-Torracat.png",
			"home": "src/img/tiny-pokemon/Torracat.png"
		},
		sounds: {
			"cry": "src/audio/cries/torracat.mp3"
		},
		types: ["Fire"],
		tags: [],
		abilities: ["Blaze"],
		hiddenAbilities: ["Intimidate"],
		stats: {
			hp: 65,
			attack: 85,
			defense: 50,
			specialAttack: 80,
			specialDefense: 50,
			speed: 90
		},
		expYield: 147,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			red: 5,
			orange: 1,
			yellow: 1,
			purple: 3
		},
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Lick", unlock: { type: "level", amount: 1 } },
			{ name: "Roar", unlock: { type: "level", amount: 9 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
			{ name: "Double Kick", unlock: { type: "level", amount: 20 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 25 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 30 } },
			{ name: "Swagger", unlock: { type: "level", amount: 35 } },
		]
	},
	"Popplio": {
		name: "Popplio",
		number: "728",
		weight: {
			pounds: 16.5,
			kilograms: 7.5
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0728Popplio.png",
			"largeShiny": "src/img/shiny-pokemon/728-Popplio.png",
			"home": "src/img/tiny-pokemon/Popplio.png"
		},
		sounds: {
			"cry": "src/audio/cries/popplio.mp3"
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
		evolutions: [
			{ name: "Brionne", unlock: { type: "level", amount: 17 } }
		],
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 3 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 6 } },
			{ name: "Aqua Jet", unlock: { type: "level", amount: 9 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 12 } },
			{ name: "Icy Wind", unlock: { type: "level", amount: 15 } },
			{ name: "Sing", unlock: { type: "level", amount: 18 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 21 } },
			{ name: "Encore", unlock: { type: "level", amount: 24 } },
		]
	},
	"Brionne": {
		name: "Brionne",
		number: "729",
		weight: {
			pounds: 38.6,
			kilograms: 17.5
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0729Brionne.png",
			"largeShiny": "src/img/shiny-pokemon/729-Brionne.png",
			"home": "src/img/tiny-pokemon/Brionne.png"
		},
		sounds: {
			"cry": "src/audio/cries/brionne.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Torrent"],
		hiddenAbilities: ["Liquid Voice"],
		stats: {
			hp: 60,
			attack: 69,
			defense: 69,
			specialAttack: 91,
			specialDefense: 81,
			speed: 50
		},
		expYield: 147,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 1,
			green: 1,
			blue: 5,
			purple: 3
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Aqua Jet", unlock: { type: "level", amount: 9 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 12 } },
			{ name: "Icy Wind", unlock: { type: "level", amount: 15 } },
			{ name: "Sing", unlock: { type: "level", amount: 20 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 25 } },
			{ name: "Encore", unlock: { type: "level", amount: 30 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
		]
	},
	"Pikipek": {
		name: "Pikipek",
		number: "731",
		weight: {
			pounds: 2.6,
			kilograms: 1.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0731Pikipek.png",
			"largeShiny": "src/img/shiny-pokemon/731-Pikipek.png",
			"home": "src/img/tiny-pokemon/Pikipek.png"
		},
		sounds: {
			"cry": "src/audio/cries/pikipek.mp3"
		},
		tags: [],
		types: ["Normal", "Flying"],
		abilities: ["Keen Eye", "Skill Link"],
		hiddenAbilities: ["Pickup"],
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
		evolutions: [
			{ name: "Trumbeak", unlock: { type: "level", amount: 14 } }
		],
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 3 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 7 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 9 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 13 } },
			{ name: "Pluck", unlock: { type: "level", amount: 15 } },
			{ name: "Roost", unlock: { type: "level", amount: 19 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 21 } },
		]
	},
	"Trumbeak": {
		name: "Trumbeak",
		number: "732",
		weight: {
			pounds: 32.6,
			kilograms: 14.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0732Trumbeak.png",
			"largeShiny": "src/img/shiny-pokemon/732-Trumbeak.png",
			"home": "src/img/tiny-pokemon/Trumbeak.png"
		},
		sounds: {
			"cry": "src/audio/cries/trumbeak.mp3"
		},
		tags: [],
		types: ["Normal", "Flying"],
		abilities: ["Keen Eye", "Skill Link"],
		hiddenAbilities: ["Pickup"],
		stats: {
			hp: 55,
			attack: 85,
			defense: 50,
			specialAttack: 40,
			specialDefense: 50,
			speed: 75
		},
		expYield: 124,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 4,
			orange: 2,
			blue: 2
		},
		evolutions: [
			{ name: "Toucannon", unlock: { type: "level", amount: 28 } }
		],
		learnset: [
			{ name: "Echoed Voice", unlock: { type: "level", amount: 1 } }, //note: should be learned via move reminder
			// { name: "Rock Blast", unlock: { type: "level", amount: 1 } },
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 13 } },
			{ name: "Pluck", unlock: { type: "level", amount: 16 } },
			{ name: "Roost", unlock: { type: "level", amount: 21 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 24 } },
			{ name: "Screech", unlock: { type: "level", amount: 29 } },
			{ name: "Drill Peck", unlock: { type: "level", amount: 32 } },
		]
	},
	"Toucannon": {
		name: "Toucannon",
		number: "733",
		weight: {
			pounds: 57.3,
			kilograms: 26.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0733Toucannon.png",
			"largeShiny": "src/img/shiny-pokemon/733-Toucannon.png",
			"home": "src/img/tiny-pokemon/Toucannon.png"
		},
		sounds: {
			"cry": "src/audio/cries/toucannon.mp3"
		},
		tags: [],
		types: ["Normal", "Flying"],
		abilities: ["Keen Eye", "Skill Link"],
		hiddenAbilities: ["Sheer Force"],
		stats: {
			hp: 80,
			attack: 120,
			defense: 75,
			specialAttack: 75,
			specialDefense: 75,
			speed: 60
		},
		expYield: 218,
		evYield: {
			hp: 0,
			attack: 3,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 5,
			orange: 3,
			blue: 2
		},
		learnset: [
			// { name: "Rock Blast", unlock: { type: "level", amount: 1 } },
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 1 } },
			// { name: "Beak Blast", unlock: { type: "level", amount: 1 } }, //note: should be learned on evolution
			{ name: "Supersonic", unlock: { type: "level", amount: 13 } },
			{ name: "Pluck", unlock: { type: "level", amount: 16 } },
			{ name: "Roost", unlock: { type: "level", amount: 21 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 24 } },
			{ name: "Screech", unlock: { type: "level", amount: 30 } },
			{ name: "Drill Peck", unlock: { type: "level", amount: 34 } },
		]
	},
	"Yungoos": {
		name: "Yungoos",
		number: "734",
		weight: {
			pounds: 13.2,
			kilograms: 6.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0734Yungoos.png",
			"largeShiny": "src/img/shiny-pokemon/734-Yungoos.png",
			"home": "src/img/tiny-pokemon/Yungoos.png"
		},
		sounds: {
			"cry": "src/audio/cries/yungoos.mp3"
		},
		tags: [],
		types: ["Normal"],
		abilities: ["Stakeout", "Strong Jaw"],
		hiddenAbilities: ["Adaptability"],
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
		evolutions: [
			{ name: "Gumshoos", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 3 } },
			{ name: "Payback", unlock: { type: "level", amount: 7 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 10 } },
			{ name: "Work Up", unlock: { type: "level", amount: 13 } },
			{ name: "Bite", unlock: { type: "level", amount: 19 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 22 } },
			{ name: "Super Fang", unlock: { type: "level", amount: 25 } },
		]
	},
	"Gumshoos": {
		name: "Gumshoos",
		number: "735",
		weight: {
			pounds: 31.3,
			kilograms: 14.2
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0735Gumshoos.png",
			"largeShiny": "src/img/shiny-pokemon/735-Gumshoos.png",
			"home": "src/img/tiny-pokemon/Gumshoos.png"
		},
		sounds: {
			"cry": "src/audio/cries/gumshoos.mp3"
		},
		tags: [],
		types: ["Normal"],
		abilities: ["Stakeout", "Strong Jaw"],
		hiddenAbilities: ["Adaptability"],
		stats: {
			hp: 88,
			attack: 110,
			defense: 60,
			specialAttack: 55,
			specialDefense: 60,
			speed: 45
		},
		expYield: 146,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 2,
			purple: 6,
			green: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Payback", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Work Up", unlock: { type: "level", amount: 13 } },
			{ name: "Bite", unlock: { type: "level", amount: 19 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 23 } },
			{ name: "Super Fang", unlock: { type: "level", amount: 27 } },
		]
	},
	"Grubbin": {
		name: "Grubbin",
		number: "736",
		weight: {
			pounds: 9.7,
			kilograms: 4.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0736Grubbin.png",
			"largeShiny": "src/img/shiny-pokemon/736-Grubbin.png",
			"home": "src/img/tiny-pokemon/Grubbin.png"
		},
		sounds: {
			"cry": "src/audio/cries/grubbin.mp3"
		},
		tags: [],
		types: ["Bug"],
		abilities: ["Swarm"],
		hiddenAbilities: [],
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
		evolutions: [
			{ name: "Charjabug", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 5 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
			{ name: "Spark", unlock: { type: "level", amount: 21 } },
		]
	},
	"Charjabug": {
		name: "Charjabug",
		number: "737",
		weight: {
			pounds: 23.1,
			kilograms: 10.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0737Charjabug.png",
			"largeShiny": "src/img/shiny-pokemon/737-Charjabug.png",
			"home": "src/img/tiny-pokemon/Charjabug.png"
		},
		sounds: {
			"cry": "src/audio/cries/charjabug.mp3"
		},
		tags: [],
		types: ["Bug", "Electric"],
		abilities: ["Battery"],
		hiddenAbilities: [],
		stats: {
			hp: 57,
			attack: 82,
			defense: 95,
			specialAttack: 55,
			specialDefense: 75,
			speed: 36
		},
		expYield: 140,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 4,
			green: 5
		},
		evolutions: [
			{ name: "Vikavolt", unlock: { type: "fiveMatchYellow", amount: 3 } },
		],
		learnset: [
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Charge", unlock: { type: "level", amount: 1 } }, //NOTE: Should be learned upon evolution.
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
			{ name: "Spark", unlock: { type: "level", amount: 23 } },
		]
	},
	"Vikavolt": {
		name: "Vikavolt",
		number: "738",
		weight: {
			pounds: 99.2,
			kilograms: 45.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0738Vikavolt.png",
			"largeShiny": "src/img/shiny-pokemon/738-Vikavolt.png",
			"home": "src/img/tiny-pokemon/Vikavolt.png"
		},
		sounds: {
			"cry": "src/audio/cries/vikavolt.mp3"
		},
		tags: [],
		types: ["Bug", "Electric"],
		abilities: ["Levitate"],
		hiddenAbilities: [],
		stats: {
			hp: 77,
			attack: 70,
			defense: 90,
			specialAttack: 145,
			specialDefense: 75,
			speed: 43
		},
		expYield: 225,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 3,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 2,
			yellow: 4,
			green: 3,
			blue: 1
		},
		learnset: [
			{ name: "Charge", unlock: { type: "level", amount: 1 } },
			{ name: "Crunch", unlock: { type: "level", amount: 1 } },
			// { name: "Discharge", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } }, // note: move reminder
			// { name: "Dig", unlock: { type: "level", amount: 1 } }, // note: move reminder
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } }, // note: move reminder
			{ name: "Iron Defense", unlock: { type: "level", amount: 1 } }, // note: move reminder
			// { name: "X-Scissor", unlock: { type: "level", amount: 1 } }, // note: move reminder
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } }, // note: move reminder
			// { name: "Thunderbolt", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
			{ name: "Spark", unlock: { type: "level", amount: 23 } },
		]
	},
	"Crabrawler": {
		name: "Crabrawler",
		number: "739",
		weight: {
			pounds: 15.4,
			kilograms: 7.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0739Crabrawler.png",
			"largeShiny": "src/img/shiny-pokemon/739-Crabrawler.png",
			"home": "src/img/tiny-pokemon/Crabrawler.png"
		},
		sounds: {
			"cry": "src/audio/cries/crabrawler.mp3"
		},
		tags: [],
		types: ["Fighting"],
		abilities: ["Hyper Cutter", "Iron Fist"],
		hiddenAbilities: ["Anger Point"],
		stats: {
			hp: 47,
			attack: 82,
			defense: 57,
			specialAttack: 42,
			specialDefense: 47,
			speed: 63
		},
		expYield: 68,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			blue: 2
		},
		learnset: [
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 5 } },
			{ name: "Leer", unlock: { type: "level", amount: 9 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 13 } },
			{ name: "Protect", unlock: { type: "level", amount: 17 } },
			{ name: "Brick Break", unlock: { type: "level", amount: 22 } },
		]
	},
	"Oricorio": {
		name: "Oricorio",
		number: "741",
		weight: {
			pounds: 7.5,
			kilograms: 3.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0741Oricorio.png",
			"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Baile.png",
			"home": "src/img/tiny-pokemon/Oricorio-Baile.png"
		},
		sounds: {
			"cry": "src/audio/cries/oricorio.mp3"
		},
		hasForms: true,
		defaultForm: "Baile",
		forms: {
			"Baile": {
				id: "Baile",
				types: ["Fire", "Flying"],
				imageSources: {
					"large": "src/img/pokemon/0741Oricorio.png",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Baile.png",
					"home": "src/img/tiny-pokemon/Oricorio-Baile.png"
				},
				sounds: {
					"cry": "src/audio/cries/oricorio.mp3"
				},
				pokedexKey: "pokedex-entry-baile"
			},
			"Pom-Pom": {
				id: "Pom-Pom",
				types: ["Electric", "Flying"],
				imageSources: {
					"large": "src/img/pokemon/0741Oricorio-Pom-Pom.png",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Pom-Pom.png",
					"home": "src/img/tiny-pokemon/Oricorio-Pom-Pom.png"
				},
				sounds: {
					"cry": "src/audio/cries/oricorio-pompom.mp3"
				},
				pokedexKey: "pokedex-entry-pom-pom"
			},
			"Pa'u": {
				id: "Pa'u",
				types: ["Psychic", "Flying"],
				imageSources: {
					"large": "src/img/pokemon/0741Oricorio-Pa'u.png",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Pa-u.png",
					"home": "src/img/tiny-pokemon/Oricorio-Pa-u.png"
				},
				sounds: {
					"cry": "src/audio/cries/oricorio-pau.mp3"
				},
				pokedexKey: "pokedex-entry-pa-u"
			},
			"Sensu": {
				id: "Sensu",
				types: ["Ghost", "Flying"],
				imageSources: {
					"large": "src/img/pokemon/0741Oricorio-Sensu.png",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Sensu.png",
					"home": "src/img/tiny-pokemon/Oricorio-Sensu.png"
				},
				sounds: {
					"cry": "src/audio/cries/oricorio-sensu.mp3"
				},
				pokedexKey: "pokedex-entry-sensu"
			}
		},
		types: [],
		tags: [],
		abilities: ["Dancer"],
		hiddenAbilities: [],
		stats: {
			hp: 75,
			attack: 70,
			defense: 70,
			specialAttack: 98,
			specialDefense: 70,
			speed: 93
		},
		expYield: 167,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 1,
			orange: 1,
			yellow: 1,
			blue: 2,
			purple: 1
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 4 } },
			{ name: "Peck", unlock: { type: "level", amount: 6 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 10 } },
			{ name: "Air Cutter", unlock: { type: "level", amount: 13 } },
			{ name: "Baton Pass", unlock: { type: "level", amount: 16 } },
			{ name: "Feather Dance", unlock: { type: "level", amount: 20 } },
		]
	},
	"Cutiefly": {
		name: "Cutiefly",
		number: "742",
		weight: {
			pounds: 0.4,
			kilograms: 0.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0742Cutiefly.png",
			"largeShiny": "src/img/shiny-pokemon/742-Cutiefly.png",
			"home": "src/img/tiny-pokemon/Cutiefly.png"
		},
		sounds: {
			"cry": "src/audio/cries/cutiefly.mp3"
		},
		tags: [],
		types: ["Bug", "Fairy"],
		abilities: ["Honey Gather", "Shield Dust"],
		hiddenAbilities: ["Sweet Veil"],
		stats: {
			hp: 40,
			attack: 45,
			defense: 40,
			specialAttack: 55,
			specialDefense: 40,
			speed: 84
		},
		expYield: 61,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			yellow: 1,
			green: 3,
			blue: 1,
			purple: 1
		},
		evolutions: [
			{ name: "Ribombee", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 12 } },
			{ name: "Draining Kiss", unlock: { type: "level", amount: 18 } },
			{ name: "Struggle Bug", unlock: { type: "level", amount: 24 } },
			{ name: "Covet", unlock: { type: "level", amount: 30 } },
		]
	},
	"Ribombee": {
		name: "Ribombee",
		number: "743",
		weight: {
			pounds: 1.1,
			kilograms: 0.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0743Ribombee.png",
			"largeShiny": "src/img/shiny-pokemon/742-Cutiefly.png",
			"home": "src/img/tiny-pokemon/Ribombee.png"
		},
		sounds: {
			"cry": "src/audio/cries/ribombee.mp3"
		},
		tags: [],
		types: ["Bug", "Fairy"],
		abilities: ["Honey Gather", "Shield Dust"],
		hiddenAbilities: ["Sweet Veil"],
		stats: {
			hp: 60,
			attack: 55,
			defense: 60,
			specialAttack: 95,
			specialDefense: 70,
			speed: 124
		},
		expYield: 162,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			yellow: 1,
			green: 4,
			blue: 2,
			purple: 3
		},
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 1 } },
			// { name: "Pollen Puff", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Draining Kiss", unlock: { type: "level", amount: 18 } },
			{ name: "Struggle Bug", unlock: { type: "level", amount: 24 } },
			{ name: "Covet", unlock: { type: "level", amount: 32 } },
			{ name: "Switcheroo", unlock: { type: "level", amount: 40 } },
		]
	},
	"Rockruff": {
		name: "Rockruff",
		number: "744",
		weight: {
			pounds: 20.3,
			kilograms: 9.2
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0744Rockruff.png",
			"largeShiny": "src/img/shiny-pokemon/744-Rockruff.png",
			"home": "src/img/tiny-pokemon/Rockruff.png"
		},
		sounds: {
			"cry": "src/audio/cries/rockruff.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Keen Eye", "Vital Spirit"],
		hiddenAbilities: ["Steadfast"],
		stats: {
			hp: 45,
			attack: 65,
			defense: 40,
			specialAttack: 30,
			specialDefense: 40,
			speed: 60
		},
		expYield: 56,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			blue: 2,
		},
		evolutions: [
			{ name: "Lycanroc-Midday", unlock: { type: "levelWhileTime", time: "Day", amount: 25 } },
			{ name: "Lycanroc-Midnight", unlock: { type: "levelWhileTime", time: "Night", amount: 25 } },
			{ name: "Lycanroc-Dusk", unlock: { type: "levelWhileTime", time: "Evening", amount: 30 } },
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 4 } },
			{ name: "Double Team", unlock: { type: "level", amount: 8 } },
			{ name: "Rock Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Howl", unlock: { type: "level", amount: 16 } },
			{ name: "Bite", unlock: { type: "level", amount: 20 } },
			{ name: "Rock Tomb", unlock: { type: "level", amount: 24 } },
			{ name: "Roar", unlock: { type: "level", amount: 28 } },
		]
	},
	"Lycanroc-Midday": {
		name: "Lycanroc",
		id: "Lycanroc-Midday",
		number: "745α",
		weight: {
			pounds: 55.1,
			kilograms: 25.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0745Lycanroc.png",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Midday.png",
			"home": "src/img/tiny-pokemon/Lycanroc-Midday.png"
		},
		sounds: {
			"cry": "src/audio/cries/lycanroc.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Keen Eye", "Sand Rush"],
		hiddenAbilities: ["Steadfast"],
		stats: {
			hp: 75,
			attack: 115,
			defense: 65,
			specialAttack: 55,
			specialDefense: 65,
			speed: 112
		},
		expYield: 170,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			yellow: 2,
			blue: 3
		},
		learnset: [
			// { name: "Accelerock", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Guard", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Double Team", unlock: { type: "level", amount: 1 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Rock Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Howl", unlock: { type: "level", amount: 16 } },
			{ name: "Bite", unlock: { type: "level", amount: 20 } },
			{ name: "Rock Tomb", unlock: { type: "level", amount: 24 } },
			{ name: "Roar", unlock: { type: "level", amount: 30 } },
		]
	},
	"Lycanroc-Midnight": {
		name: "Lycanroc",
		id: "Lycanroc-Midnight",
		number: "745β",
		weight: {
			pounds: 55.1,
			kilograms: 25.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0745Lycanroc-Midnight.png",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Midnight.png",
			"home": "src/img/tiny-pokemon/Lycanroc-Midnight.png"
		},
		sounds: {
			"cry": "src/audio/cries/lycanroc-midnight.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Keen Eye", "Vital Spirit"],
		hiddenAbilities: ["No Guard"],
		stats: {
			hp: 85,
			attack: 115,
			defense: 75,
			specialAttack: 55,
			specialDefense: 75,
			speed: 82
		},
		expYield: 170,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			yellow: 2,
			purple: 3
		},
		learnset: [
			{ name: "Endure", unlock: { type: "level", amount: 1 } },
			// { name: "Reversal", unlock: { type: "level", amount: 1 } },
			{ name: "Taunt", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Double Team", unlock: { type: "level", amount: 1 } },
			// { name: "Counter", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Rock Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Howl", unlock: { type: "level", amount: 16 } },
			{ name: "Bite", unlock: { type: "level", amount: 20 } },
			{ name: "Rock Tomb", unlock: { type: "level", amount: 24 } },
			{ name: "Roar", unlock: { type: "level", amount: 30 } },
		]
	},
	"Lycanroc-Dusk": {
		name: "Lycanroc",
		id: "Lycanroc-Dusk",
		number: "745γ",
		weight: {
			pounds: 55.1,
			kilograms: 25.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0745Lycanroc-Dusk.png",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Dusk.png",
			"home": "src/img/tiny-pokemon/Lycanroc-Dusk.png"
		},
		sounds: {
			"cry": "src/audio/cries/lycanroc-dusk.mp3"
		},
		types: ["Rock"],
		tags: [],
		abilities: ["Tough Claws"],
		hiddenAbilities: [],
		stats: {
			hp: 75,
			attack: 117,
			defense: 65,
			specialAttack: 55,
			specialDefense: 65,
			speed: 110
		},
		expYield: 170,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 6,
			blue: 1,
			yellow: 2,
			purple: 1
		},
		learnset: [
			{ name: "Sucker Punch", unlock: { type: "level", amount: 1 } },
			// { name: "Accelerock", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Guard", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 1 } },
			// { name: "Counter", unlock: { type: "level", amount: 1 } },
			{ name: "Endure", unlock: { type: "level", amount: 1 } },
			// { name: "Reversal", unlock: { type: "level", amount: 1 } },
			{ name: "Taunt", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 1 } },
			{ name: "Double Team", unlock: { type: "level", amount: 1 } },
			// { name: "Crush Claw", unlock: { type: "level", amount: 1 } }, //note: evolution
			{ name: "Rock Throw", unlock: { type: "level", amount: 12 } },
			{ name: "Howl", unlock: { type: "level", amount: 16 } },
			{ name: "Bite", unlock: { type: "level", amount: 20 } },
			{ name: "Rock Tomb", unlock: { type: "level", amount: 24 } },
			{ name: "Roar", unlock: { type: "level", amount: 30 } },
		]
	},
	"Wishiwashi": {
		name: "Wishiwashi",
		number: "746",
		weight: {
			pounds: 0.7,
			kilograms: 0.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0746Wishiwashi.png",
			"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi.png",
			"home": "src/img/tiny-pokemon/Wishiwashi.png"
		},
		sounds: {
			"cry": "src/audio/cries/wishiwashi.mp3"
		},
		hasForms: true,
		formsToLoad: ["Solo", "School"],
		defaultForm: "Solo",
		returnToDefaultFormAfterBattle: true,
		forms: {
			"Solo": {
				id: "Solo",
				imageSources: {
					"large": "src/img/pokemon/0746Wishiwashi.png",
					"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi.png",
					"home": "src/img/tiny-pokemon/Wishiwashi.png"
				},
				sounds: {
					"cry": "src/audio/cries/wishiwashi.mp3"
				},
				stats: {
					hp: 45,
					attack: 20,
					defense: 20,
					specialAttack: 25,
					specialDefense: 25,
					speed: 40
				},
				weight: {
					pounds: 0.7,
					kilograms: 0.3
				},
			},
			"School": {
				id: "School",
				imageSources: {
					"large": "src/img/pokemon/0746Wishiwashi-School.png",
					"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi-School.png",
					"home": "src/img/tiny-pokemon/Wishiwashi-School.png"
				},
				sounds: {
					"cry": "src/audio/cries/wishiwashi-school.mp3"
				},
				stats: {
					hp: 45,
					attack: 140,
					defense: 130,
					specialAttack: 140,
					specialDefense: 135,
					speed: 30
				},
				weight: {
					pounds: 173.3,
					kilograms: 78.6
				},
			},
		},
		types: ["Water"],
		tags: [],
		abilities: ["Schooling"],
		hiddenAbilities: [],
		stats: {
			hp: 45,
			attack: 20,
			defense: 20,
			specialAttack: 25,
			specialDefense: 25,
			speed: 40
		},
		expYield: 61,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 1,
			orange: 1,
			blue: 5,
			purple: 1
		},
		learnset: [
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 4 } },
			{ name: "Beat Up", unlock: { type: "level", amount: 8 } },
			{ name: "Brine", unlock: { type: "level", amount: 12 } },
			{ name: "Tearful Look", unlock: { type: "level", amount: 16 } },
			{ name: "Dive", unlock: { type: "level", amount: 20 } },
			{ name: "Soak", unlock: { type: "level", amount: 24 } },
		]
	},
	"Mudbray": {
		name: "Mudbray",
		number: "749",
		weight: {
			pounds: 242.5,
			kilograms: 100.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0749Mudbray.png",
			"largeShiny": "src/img/shiny-pokemon/749-Mudbray.png",
			"home": "src/img/tiny-pokemon/Mudbray.png"
		},
		sounds: {
			"cry": "src/audio/cries/mudbray.mp3"
		},
		tags: [],
		types: ["Ground"],
		abilities: ["Own Tempo", "Stamina"],
		hiddenAbilities: ["Inner Focus"],
		stats: {
			hp: 70,
			attack: 100,
			defense: 70,
			specialAttack: 45,
			specialDefense: 55,
			speed: 45
		},
		expYield: 77,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 4,
			green: 3
		},
		evolutions: [
			{ name: "Mudsdale", unlock: { type: "level", amount: 30 } }
		],
		learnset: [
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 1 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 4 } },
			{ name: "Double Kick", unlock: { type: "level", amount: 8 } },
			{ name: "Bulldoze", unlock: { type: "level", amount: 12 } },
			{ name: "Stomp", unlock: { type: "level", amount: 16 } },
			{ name: "Strength", unlock: { type: "level", amount: 20 } },
			{ name: "Counter", unlock: { type: "level", amount: 24 } },
		]
	},
	"Mudsdale": {
		name: "Mudsdale",
		number: "750",
		weight: {
			pounds: 2028.3,
			kilograms: 920.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0750Mudsdale.png",
			"largeShiny": "src/img/shiny-pokemon/750-Mudsdale.png",
			"home": "src/img/tiny-pokemon/Mudsdale.png"
		},
		sounds: {
			"cry": "src/audio/cries/mudsdale.mp3"
		},
		tags: [],
		types: ["Ground"],
		abilities: ["Own Tempo", "Stamina"],
		hiddenAbilities: ["Inner Focus"],
		stats: {
			hp: 100,
			attack: 125,
			defense: 100,
			specialAttack: 55,
			specialDefense: 85,
			speed: 35
		},
		expYield: 175,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			green: 4,
			yellow: 1
		},
		learnset: [
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 1 } },
			{ name: "Iron Defense", unlock: { type: "level", amount: 1 } },
			{ name: "Double Kick", unlock: { type: "level", amount: 1 } },
			{ name: "Bulldoze", unlock: { type: "level", amount: 12 } },
			{ name: "Stomp", unlock: { type: "level", amount: 16 } },
			{ name: "Strength", unlock: { type: "level", amount: 20 } },
			{ name: "Counter", unlock: { type: "level", amount: 24 } },
		]
	},
	"Dewpider": {
		name: "Dewpider",
		number: "751",
		weight: {
			pounds: 8.8,
			kilograms: 4.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0751Dewpider.png",
			"largeShiny": "src/img/shiny-pokemon/751-Dewpider.png",
			"home": "src/img/tiny-pokemon/Dewpider.png"
		},
		sounds: {
			"cry": "src/audio/cries/dewpider.mp3"
		},
		tags: [],
		types: ["Water", "Bug"],
		abilities: ["Water Bubble"],
		hiddenAbilities: ["Water Absorb"],
		stats: {
			hp: 38,
			attack: 40,
			defense: 52,
			specialAttack: 40,
			specialDefense: 72,
			speed: 27
		},
		expYield: 54,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			blue: 2,
			green: 2,
			yellow: 1,
		},
		learnset: [
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Infestation", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 4 } },
			{ name: "Bite", unlock: { type: "level", amount: 8 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 12 } },
			{ name: "Aqua Ring", unlock: { type: "level", amount: 16 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 20 } },
			{ name: "Crunch", unlock: { type: "level", amount: 24 } },
		]
	},
	"Araquanid": {
		name: "Araquanid",
		number: "752",
		weight: {
			pounds: 180.8,
			kilograms: 82.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0752Araquanid.png",
			"largeShiny": "src/img/shiny-pokemon/752-Araquanid.png",
			"home": "src/img/tiny-pokemon/Araquanid.png"
		},
		sounds: {
			"cry": "src/audio/cries/araquanid.mp3"
		},
		tags: [],
		types: ["Water", "Bug"],
		abilities: ["Water Bubble"],
		hiddenAbilities: ["Water Absorb"],
		stats: {
			hp: 68,
			attack: 70,
			defense: 92,
			specialAttack: 50,
			specialDefense: 132,
			speed: 42
		},
		expYield: 159,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		energyMastery: {
			blue: 3,
			green: 3,
			yellow: 2,
			purple: 1,
			orange: 1
		},
		learnset: [
			{ name: "Wide Guard", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Infestation", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Bubble Beam", unlock: { type: "level", amount: 12 } },
			{ name: "Aqua Ring", unlock: { type: "level", amount: 16 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 20 } },
			{ name: "Crunch", unlock: { type: "level", amount: 26 } },
		]
	},
	"Fomantis": {
		name: "Fomantis",
		number: "753",
		weight: {
			pounds: 3.3,
			kilograms: 1.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0753Fomantis.png",
			"largeShiny": "src/img/shiny-pokemon/753-Fomantis.png",
			"home": "src/img/tiny-pokemon/Fomantis.png"
		},
		sounds: {
			"cry": "src/audio/cries/fomantis.mp3"
		},
		tags: [],
		types: ["Grass"],
		abilities: ["Leaf Guard"],
		hiddenAbilities: ["Contrary"],
		stats: {
			hp: 40,
			attack: 55,
			defense: 35,
			specialAttack: 50,
			specialDefense: 35,
			speed: 35
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
			orange: 4,
			green: 3
		},
		evolutions: [
			{ name: "Lurantis", unlock: { type: "level", amount: 34 } }
		],
		learnset: [
			{ name: "Leafage", unlock: { type: "level", amount: 1 } },
			{ name: "Fury Cutter", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 5 } },
			{ name: "Ingrain", unlock: { type: "level", amount: 10 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 20 } },
		]
	},
	"Morelull": {
		name: "Morelull",
		number: "755",
		weight: {
			pounds: 3.3,
			kilograms: 1.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0755Morelull.png",
			"largeShiny": "src/img/shiny-pokemon/755-Morelull.png",
			"home": "src/img/tiny-pokemon/Morelull.png"
		},
		sounds: {
			"cry": "src/audio/cries/morelull.mp3"
		},
		tags: [],
		types: ["Grass", "Fairy"],
		abilities: ["Illuminate", "Effect Spore"],
		hiddenAbilities: ["Rain Dish"],
		stats: {
			hp: 40,
			attack: 35,
			defense: 55,
			specialAttack: 65,
			specialDefense: 75,
			speed: 15
		},
		expYield: 57,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 1,
			speed: 0
		},
		energyMastery: {
			green: 2,
			yellow: 2,
			purple: 2
		},
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 4 } },
			{ name: "Ingrain", unlock: { type: "level", amount: 8 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 12 } },
			{ name: "Sleep Powder", unlock: { type: "level", amount: 16 } },
			{ name: "Moonlight", unlock: { type: "level", amount: 20 } },
		]
	},
	"Stufful": {
		name: "Stufful",
		number: "759",
		weight: {
			pounds: 15.0,
			kilograms: 6.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0759Stufful.png",
			"largeShiny": "src/img/shiny-pokemon/759-Stufful.png",
			"home": "src/img/tiny-pokemon/Stufful.png"
		},
		sounds: {
			"cry": "src/audio/cries/stufful.mp3"
		},
		types: ["Normal", "Fighting"],
		tags: [],
		abilities: ["Fluffy", "Klutz"],
		hiddenAbilities: ["Cute Charm"],
		stats: {
			hp: 70,
			attack: 75,
			defense: 50,
			specialAttack: 45,
			specialDefense: 50,
			speed: 50
		},
		expYield: 68,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			purple: 1
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 4 } },
			{ name: "Bide", unlock: { type: "level", amount: 6 } }, //Learned only in gen 7
			{ name: "Payback", unlock: { type: "level", amount: 8 } },
			{ name: "Brutal Swing", unlock: { type: "level", amount: 12 } },
			{ name: "Endure", unlock: { type: "level", amount: 16 } },
			{ name: "Strength", unlock: { type: "level", amount: 20 } },
		]
	},
	"Bounsweet": {
		name: "Bounsweet",
		number: "761",
		weight: {
			pounds: 7.1,
			kilograms: 3.2
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0761Bounsweet.png",
			"largeShiny": "src/img/shiny-pokemon/761-Bounsweet.png",
			"home": "src/img/tiny-pokemon/Bounsweet.png"
		},
		sounds: {
			"cry": "src/audio/cries/bounsweet.mp3"
		},
		types: ["Grass"],
		tags: [],
		abilities: ["Leaf Guard", "Oblivious"],
		hiddenAbilities: ["Sweet Veil"],
		stats: {
			hp: 42,
			attack: 30,
			defense: 38,
			specialAttack: 30,
			specialDefense: 38,
			speed: 32
		},
		expYield: 42,
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
			purple: 1
		},
		evolutions: [
			{ name: "Steenee", unlock: { type: "level", amount: 18 } }
		],
		learnset: [
			{ name: "Splash", unlock: { type: "level", amount: 1 } },
			{ name: "Play Nice", unlock: { type: "level", amount: 4 } },
			{ name: "Rapid Spin", unlock: { type: "level", amount: 8 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 12 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 16 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 20 } },
			{ name: "Flail", unlock: { type: "level", amount: 24 } },
			{ name: "Teeter Dance", unlock: { type: "level", amount: 28 } },
			// { name: "Aromatic Mist", unlock: { type: "level", amount: 32 } },
		]
	},
	"Steenee": {
		name: "Steenee",
		number: "762",
		weight: {
			pounds: 18.1,
			kilograms: 8.2
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0762Steenee.png",
			"largeShiny": "src/img/shiny-pokemon/762-Steenee.png",
			"home": "src/img/tiny-pokemon/Steenee.png"
		},
		sounds: {
			"cry": "src/audio/cries/steenee.mp3"
		},
		types: ["Grass"],
		tags: [],
		abilities: ["Leaf Guard", "Oblivious"],
		hiddenAbilities: ["Sweet Veil"],
		stats: {
			hp: 52,
			attack: 40,
			defense: 48,
			specialAttack: 40,
			specialDefense: 48,
			speed: 62
		},
		expYield: 102,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			green: 3,
			yellow: 2,
			purple: 2
		},
		learnset: [
			{ name: "Double Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Splash", unlock: { type: "level", amount: 1 } },
			{ name: "Play Nice", unlock: { type: "level", amount: 1 } },
			{ name: "Rapid Spin", unlock: { type: "level", amount: 1 } },
			{ name: "Razor Leaf", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 17 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 21 } },
			{ name: "Teeter Dance", unlock: { type: "level", amount: 25 } },
			// { name: "Stomp", unlock: { type: "level", amount: 29 } },
			// { name: "Aromatic Mist", unlock: { type: "level", amount: 33 } },
			// { name: "Captivate", unlock: { type: "level", amount: 37 } },
			// { name: "Aromatherapy", unlock: { type: "level", amount: 41 } },
			// { name: "Leaf Storm", unlock: { type: "level", amount: 45 } },
		]
	},
	"Comfey": {
		name: "Comfey",
		number: "764",
		weight: {
			pounds: 0.7,
			kilograms: 0.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0764Comfey.png",
			"largeShiny": "src/img/shiny-pokemon/764-Comfey.png",
			"home": "src/img/tiny-pokemon/Comfey.png"
		},
		sounds: {
			"cry": "src/audio/cries/comfey.mp3"
		},
		tags: [],
		types: ["Fairy"],
		abilities: ["Flower Veil", "Triage"],
		hiddenAbilities: ["Natural Cure"],
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
			{ name: "Wrap", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Vine Whip", unlock: { type: "level", amount: 3 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 6 } },
			{ name: "Draining Kiss", unlock: { type: "level", amount: 9 } },
			{ name: "Charm", unlock: { type: "level", amount: 12 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 15 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 18 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 21 } },
		]
	},
	"Passimian": {
		name: "Passimian",
		number: "766",
		weight: {
			pounds: 182.5,
			kilograms: 82.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0766Passimian.png",
			"largeShiny": "src/img/shiny-pokemon/766-Passimian.png",
			"home": "src/img/tiny-pokemon/Passimian.png"
		},
		sounds: {
			"cry": "src/audio/cries/passimian.mp3"
		},
		tags: [],
		types: ["Fighting"],
		abilities: ["Receiver"],
		hiddenAbilities: ["Defiant"],
		stats: {
			hp: 100,
			attack: 120,
			defense: 90,
			specialAttack: 40,
			specialDefense: 60,
			speed: 80
		},
		expYield: 172,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 5,
			red: 2,
			purple: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Rock Smash", unlock: { type: "level", amount: 5 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 10 } },
			{ name: "Beat Up", unlock: { type: "level", amount: 15 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 20 } },
		]
	},
	"Type: Null": {
		name: "Type: Null",
		number: "772",
		weight: {
			pounds: 265.7,
			kilograms: 120.5
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0772Type_Null.png",
			"largeShiny": "src/img/shiny-pokemon/772-Type_Null.png",
			"home": "src/img/tiny-pokemon/Type Null.png"
		},
		sounds: {
			"cry": "src/audio/cries/typenull.mp3"
		},
		tags: [],
		types: ["Normal"],
		abilities: ["Battle Armor"],
		hiddenAbilities: [],
		stats: {
			hp: 95,
			attack: 95,
			defense: 95,
			specialAttack: 95,
			specialDefense: 95,
			speed: 59
		},
		expYield: 107,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 2,
			orange: 2,
			yellow: 2,
			green: 2,
			blue: 2,
			purple: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Imprison", unlock: { type: "level", amount: 1 } },
			{ name: "Aerial Ace", unlock: { type: "level", amount: 5 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 10 } },
			{ name: "Double Hit", unlock: { type: "level", amount: 15 } },
			{ name: "Metal Sound", unlock: { type: "level", amount: 20 } },
		]
	},
	"Komala": {
		name: "Komala",
		number: "775",
		weight: {
			pounds: 43.9,
			kilograms: 19.9
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0775Komala.png",
			"largeShiny": "src/img/shiny-pokemon/775-Komala.png",
			"home": "src/img/tiny-pokemon/Komala.png"
		},
		sounds: {
			"cry": "src/audio/cries/komala.mp3"
		},
		tags: [],
		types: ["Normal"],
		abilities: ["Comatose"],
		hiddenAbilities: [],
		stats: {
			hp: 65,
			attack: 115,
			defense: 65,
			specialAttack: 75,
			specialDefense: 95,
			speed: 65
		},
		expYield: 168,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			purple: 2,
		},
		learnset: [
			{ name: "Defense Curl", unlock: { type: "level", amount: 1 } },
			{ name: "Rollout", unlock: { type: "level", amount: 1 } },
			{ name: "Stockpile", unlock: { type: "level", amount: 6 } },
			{ name: "Spit Up", unlock: { type: "level", amount: 6 } },
			{ name: "Swallow", unlock: { type: "level", amount: 6 } },
			{ name: "Rapid Spin", unlock: { type: "level", amount: 11 } },
			{ name: "Yawn", unlock: { type: "level", amount: 16 } },
			{ name: "Slam", unlock: { type: "level", amount: 21 } },
			{ name: "Flail", unlock: { type: "level", amount: 26 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 31 } },
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
	if (!pokemon.weight){
		console.warn(pokemon, "is missing a weight")
	}
	if (!pokemon.relevantTriggers){
		pokemon.relevantTriggers = []
	}
	if (pokemon.evolutions.length){
		pokemon.evolutions.forEach(evolveData => {
			let type = evolveData.unlock.type
			if (!pokemon.relevantTriggers.includes(type) && evolutionActiveTriggers.includes(type)){
				pokemon.relevantTriggers.push(type)
			}
		})
	}

	//Make sure all dex numbers are 4 digits long.
	//Eg 0039, 0019a
	let number = pokemon.number
	let targetDigits = 4
	let regex = /([\d\?]+)([^\d\?])*/g
	let match = regex.exec(number)
	let justDigits = match[1]
	let modifier = match[2] ?? ""
	justDigits = justDigits.padStart(targetDigits, "0")
	pokemon.number = justDigits + modifier
	let same = Object.values(pokemonData).filter(p => p.number === pokemon.number)
	if (same.length !== 1){
		console.warn("These pokemon share a number", same, pokemon)
	}
}