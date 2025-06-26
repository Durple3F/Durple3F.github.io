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
			"large-compressed": "src/img/pokemon-compressed/0010Caterpie.webp",
			"tiny": "src/img/tiny-pokemon/0010Caterpie.webp",
			"largeShiny": "src/img/shiny-pokemon/010-Caterpie.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/010-Caterpie.webp",
			"home": "src/img/home-pokemon/Caterpie.png"
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
			"large-compressed": "src/img/pokemon-compressed/0011Metapod.webp",
			"tiny": "src/img/tiny-pokemon/0011Metapod.webp",
			"largeShiny": "src/img/shiny-pokemon/011-Metapod.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/011-Metapod.webp",
			"home": "src/img/home-pokemon/Metapod.png"
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
			"large-compressed": "src/img/pokemon-compressed/0012Butterfree.webp",
			"tiny": "src/img/tiny-pokemon/0012Butterfree.webp",
			"largeShiny": "src/img/shiny-pokemon/012-Butterfree.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/012-Butterfree.webp",
			"home": "src/img/home-pokemon/Butterfree.png"
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
			// { name: "Air Slash", unlock: { type: "level", amount: 24 } },
			{ name: "Safeguard", unlock: { type: "level", amount: 28 } },
			// { name: "Bug Buzz", unlock: { type: "level", amount: 32 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 36 } },
			// { name: "Rage Powder", unlock: { type: "level", amount: 40 } },
			{ name: "Quiver Dance", unlock: { type: "level", amount: 44 } },
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
			"large-compressed": "src/img/pokemon-compressed/0019Rattata.webp",
			"tiny": "src/img/tiny-pokemon/0019Rattata.webp",
			"largeShiny": "src/img/shiny-pokemon/019-Rattata.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/019-Rattata.webp",
			"home": "src/img/home-pokemon/Rattata.png"
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
			"large-compressed": "src/img/pokemon-compressed/0019Rattata-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0019Rattata-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/019-Rattata-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/019-Rattata-Alola.webp",
			"home": "src/img/home-pokemon/Rattata-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0020Raticate-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0020Raticate-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/020-Raticate-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/020-Raticate-Alola.webp",
			"home": "src/img/home-pokemon/Raticate-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0021Spearow.webp",
			"tiny": "src/img/tiny-pokemon/0021Spearow.webp",
			"largeShiny": "src/img/shiny-pokemon/021-Spearow.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/021-Spearow.webp",
			"home": "src/img/home-pokemon/Spearow.png"
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
			"large-compressed": "src/img/pokemon-compressed/0022Fearow.webp",
			"tiny": "src/img/tiny-pokemon/0022Fearow.webp",
			"largeShiny": "src/img/shiny-pokemon/022-Fearow.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/022-Fearow.webp",
			"home": "src/img/home-pokemon/Fearow.png"
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
			"large-compressed": "src/img/pokemon-compressed/0025Pikachu.webp",
			"tiny": "src/img/tiny-pokemon/0025Pikachu.webp",
			"largeShiny": "src/img/shiny-pokemon/025-Pikachu.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/025-Pikachu.webp",
			"home": "src/img/home-pokemon/Pikachu.png"
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
			"large-compressed": "src/img/pokemon-compressed/0026Raichu.webp",
			"tiny": "src/img/tiny-pokemon/0026Raichu.webp",
			"largeShiny": "src/img/shiny-pokemon/026-Raichu.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/026-Raichu.webp",
			"home": "src/img/home-pokemon/Raichu.png"
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
			"large-compressed": "src/img/pokemon-compressed/0026Raichu-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0026Raichu-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/026-Raichu-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/026-Raichu-Alola.webp",
			"home": "src/img/home-pokemon/Raichu-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0027Sandshrew-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0027Sandshrew-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/027-Sandshrew-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/027-Sandshrew-Alola.webp",
			"home": "src/img/home-pokemon/Sandshrew-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0039Jigglypuff.webp",
			"tiny": "src/img/tiny-pokemon/0039Jigglypuff.webp",
			"largeShiny": "src/img/shiny-pokemon/039-Jigglypuff.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/039-Jigglypuff.webp",
			"home": "src/img/home-pokemon/Jigglypuff.png"
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
			"large-compressed": "src/img/pokemon-compressed/0040Wigglytuff.webp",
			"tiny": "src/img/tiny-pokemon/0040Wigglytuff.webp",
			"largeShiny": "src/img/shiny-pokemon/040-Wigglytuff.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/040-Wigglytuff.webp",
			"home": "src/img/home-pokemon/Wigglytuff.png"
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
			"large-compressed": "src/img/pokemon-compressed/0041Zubat.webp",
			"tiny": "src/img/tiny-pokemon/0041Zubat.webp",
			"largeShiny": "src/img/shiny-pokemon/041-Zubat.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/041-Zubat.webp",
			"home": "src/img/home-pokemon/Zubat.png"
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
			"large-compressed": "src/img/pokemon-compressed/0042Golbat.webp",
			"tiny": "src/img/tiny-pokemon/0042Golbat.webp",
			"largeShiny": "src/img/shiny-pokemon/042-Golbat.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/042-Golbat.webp",
			"home": "src/img/home-pokemon/Zubat.png"
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
			"large-compressed": "src/img/pokemon-compressed/0046Paras.webp",
			"tiny": "src/img/tiny-pokemon/0046Paras.webp",
			"largeShiny": "src/img/shiny-pokemon/046-Paras.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/046-Paras.webp",
			"home": "src/img/home-pokemon/Paras.png"
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
			"large-compressed": "src/img/pokemon-compressed/0047Parasect.webp",
			"tiny": "src/img/tiny-pokemon/0047Parasect.webp",
			"largeShiny": "src/img/shiny-pokemon/047-Parasect.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/047-Parasect.webp",
			"home": "src/img/home-pokemon/Parasect.png"
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
			"large-compressed": "src/img/pokemon-compressed/0050Diglett-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0050Diglett-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/050-Diglett-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/050-Diglett-Alola.webp",
			"home": "src/img/home-pokemon/Diglett-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0051Dugtrio-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0051Dugtrio-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/051-Dugtrio-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/051-Dugtrio-Alola.webp",
			"home": "src/img/home-pokemon/Dugtrio-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0052Meowth-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0052Meowth-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/052-Meowth-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/052-Meowth-Alola.webp",
			"home": "src/img/home-pokemon/Meowth-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0053Persian-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0053Persian-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/053-Persian-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/053-Persian-Alola.webp",
			"home": "src/img/home-pokemon/Persian-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0054Psyduck.webp",
			"tiny": "src/img/tiny-pokemon/0054Psyduck.webp",
			"largeShiny": "src/img/shiny-pokemon/054-Psyduck.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/054-Psyduck.webp",
			"home": "src/img/home-pokemon/Psyduck.png"
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
			"large-compressed": "src/img/pokemon-compressed/0055Golduck.webp",
			"tiny": "src/img/tiny-pokemon/0055Golduck.webp",
			"largeShiny": "src/img/shiny-pokemon/055-Golduck.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/055-Golduck.webp",
			"home": "src/img/home-pokemon/Golduck.png"
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
			"large-compressed": "src/img/pokemon-compressed/0056Mankey.webp",
			"tiny": "src/img/tiny-pokemon/0056Mankey.webp",
			"largeShiny": "src/img/shiny-pokemon/056-Mankey.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/056-Mankey.webp",
			"home": "src/img/home-pokemon/Mankey.png"
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
			"large-compressed": "src/img/pokemon-compressed/0058Growlithe.webp",
			"tiny": "src/img/tiny-pokemon/0058Growlithe.webp",
			"largeShiny": "src/img/shiny-pokemon/058-Growlithe.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/058-Growlithe.webp",
			"home": "src/img/home-pokemon/Growlithe.png"
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
			"large-compressed": "src/img/pokemon-compressed/0059Arcanine.webp",
			"tiny": "src/img/tiny-pokemon/0059Arcanine.webp",
			"largeShiny": "src/img/shiny-pokemon/059-Arcanine.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/059-Arcanine.webp",
			"home": "src/img/home-pokemon/Arcanine.png"
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
			"large-compressed": "src/img/pokemon-compressed/0060Poliwag.webp",
			"tiny": "src/img/tiny-pokemon/0060Poliwag.webp",
			"largeShiny": "src/img/shiny-pokemon/060-Poliwag.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/060-Poliwag.webp",
			"home": "src/img/home-pokemon/Poliwag.png"
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
			blue: 3,
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
			"large-compressed": "src/img/pokemon-compressed/0061Poliwhirl.webp",
			"tiny": "src/img/tiny-pokemon/0061Poliwhirl.webp",
			"largeShiny": "src/img/shiny-pokemon/061-Poliwhirl.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/061-Poliwhirl.webp",
			"home": "src/img/home-pokemon/Poliwhirl.png"
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
			"large-compressed": "src/img/pokemon-compressed/0063Abra.webp",
			"tiny": "src/img/tiny-pokemon/0063Abra.webp",
			"largeShiny": "src/img/shiny-pokemon/063-Abra.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/063-Abra.webp",
			"home": "src/img/home-pokemon/Abra.png"
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
			"large-compressed": "src/img/pokemon-compressed/0064Kadabra.webp",
			"tiny": "src/img/tiny-pokemon/0064Kadabra.webp",
			"largeShiny": "src/img/shiny-pokemon/064-Kadabra.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/064-Kadabra.webp",
			"home": "src/img/home-pokemon/Kadabra.png"
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
			"large-compressed": "src/img/pokemon-compressed/0066Machop.webp",
			"tiny": "src/img/tiny-pokemon/0066Machop.webp",
			"largeShiny": "src/img/shiny-pokemon/066-Machop.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/066-Machop.webp",
			"home": "src/img/home-pokemon/Machop.png"
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
			"large-compressed": "src/img/pokemon-compressed/0067Machoke.webp",
			"tiny": "src/img/tiny-pokemon/0067Machoke.webp",
			"largeShiny": "src/img/shiny-pokemon/067-Machoke.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/067-Machoke.webp",
			"home": "src/img/home-pokemon/Machoke.png"
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
			"large-compressed": "src/img/pokemon-compressed/0072Tentacool.webp",
			"tiny": "src/img/tiny-pokemon/0072Tentacool.webp",
			"largeShiny": "src/img/shiny-pokemon/072-Tentacool.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/072-Tentacool.webp",
			"home": "src/img/home-pokemon/Tentacool.png"
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
			"large-compressed": "src/img/pokemon-compressed/0073Tentacruel.webp",
			"tiny": "src/img/tiny-pokemon/0073Tentacruel.webp",
			"largeShiny": "src/img/shiny-pokemon/073-Tentacruel.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/073-Tentacruel.webp",
			"home": "src/img/home-pokemon/Tentacruel.png"
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
			"large-compressed": "src/img/pokemon-compressed/0079Slowpoke.webp",
			"tiny": "src/img/tiny-pokemon/0079Slowpoke.webp",
			"largeShiny": "src/img/shiny-pokemon/079-Slowpoke.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/079-Slowpoke.webp",
			"home": "src/img/home-pokemon/Slowpoke.png"
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
			"large-compressed": "src/img/pokemon-compressed/0081Magnemite.webp",
			"tiny": "src/img/tiny-pokemon/0081Magnemite.webp",
			"largeShiny": "src/img/shiny-pokemon/081-Magnemite.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/081-Magnemite.webp",
			"home": "src/img/home-pokemon/Magnemite.png"
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
			"large-compressed": "src/img/pokemon-compressed/0088Grimer-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0088Grimer-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/088-Grimer-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/088-Grimer-Alola.webp",
			"home": "src/img/home-pokemon/Grimer-Alola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0092Gastly.webp",
			"tiny": "src/img/tiny-pokemon/0092Gastly.webp",
			"largeShiny": "src/img/shiny-pokemon/092-Gastly.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/092-Gastly.webp",
			"home": "src/img/home-pokemon/Gastly.png"
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
			"large-compressed": "src/img/pokemon-compressed/0093Haunter.webp",
			"tiny": "src/img/tiny-pokemon/0093Haunter.webp",
			"largeShiny": "src/img/shiny-pokemon/093-Haunter.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/093-Haunter.webp",
			"home": "src/img/home-pokemon/Haunter.png"
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
			"large-compressed": "src/img/pokemon-compressed/0096Drowzee.webp",
			"tiny": "src/img/tiny-pokemon/0096Drowzee.webp",
			"largeShiny": "src/img/shiny-pokemon/096-Drowzee.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/096-Drowzee.webp",
			"home": "src/img/home-pokemon/Drowzee.png"
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
			"large-compressed": "src/img/pokemon-compressed/0097Hypno.webp",
			"tiny": "src/img/tiny-pokemon/0097Hypno.webp",
			"largeShiny": "src/img/shiny-pokemon/097-Hypno.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/097-Hypno.webp",
			"home": "src/img/home-pokemon/Hypno.png"
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
	"Voltorb": {
		name: "Voltorb",
		number: "100",
		weight: {
			pounds: 22.9,
			kilograms: 10.4
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0100Voltorb.png",
			"large-compressed": "src/img/pokemon-compressed/0100Voltorb.webp",
			"tiny": "src/img/tiny-pokemon/0100Voltorb.webp",
			"largeShiny": "src/img/shiny-pokemon/100-Voltorb.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/100-Voltorb.webp",
			"home": "src/img/home-pokemon/Voltorb.png"
		},
		sounds: {
			"cry": "src/audio/cries/voltorb.mp3"
		},
		types: ["Electric"],
		tags: [],
		abilities: ["Soundproof", "Static"],
		hiddenAbilities: ["Aftermath"],
		stats: {
			hp: 40,
			attack: 30,
			defense: 50,
			specialAttack: 55,
			specialDefense: 55,
			speed: 100
		},
		expYield: 66,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			orange: 8
		},
		learnset: [
			{ name: "Charge", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 4 } },
			// { name: "Eerie Impulse", unlock: { type: "level", amount: 6 } },
			{ name: "Spark", unlock: { type: "level", amount: 9 } },
			{ name: "Rollout", unlock: { type: "level", amount: 11 } },
			{ name: "Screech", unlock: { type: "level", amount: 13 } },
			// { name: "Charge Beam", unlock: { type: "level", amount: 16 } },
			{ name: "Swift", unlock: { type: "level", amount: 20 } },
			{ name: "Electro Ball", unlock: { type: "level", amount: 22 } },
			// { name: "Self-Destruct", unlock: { type: "level", amount: 26 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 29 } },
		]
	},
	"Cubone": {
		name: "Cubone",
		number: "104",
		weight: {
			pounds: 14.3,
			kilograms: 6.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0104Cubone.png",
			"large-compressed": "src/img/pokemon-compressed/0104Cubone.webp",
			"tiny": "src/img/tiny-pokemon/0104Cubone.webp",
			"largeShiny": "src/img/shiny-pokemon/104-Cubone.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/104-Cubone.webp",
			"home": "src/img/home-pokemon/Cubone.png"
		},
		sounds: {
			"cry": "src/audio/cries/cubone.mp3"
		},
		types: ["Ground"],
		tags: [],
		abilities: ["Rock Head", "Lightning Rod"],
		hiddenAbilities: ["Battle Armor"],
		stats: {
			hp: 50,
			attack: 50,
			defense: 95,
			specialAttack: 40,
			specialDefense: 50,
			speed: 35
		},
		expYield: 64,
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
			green: 1,
			purple: 1
		},
		evolutions: [
			{ name: "Marowak", unlock: { type: "levelWhileTime", time: "Day", amount: 28 } },
			{ name: "Marowak-Alola", unlock: { type: "levelWhileTime", time: "Night", amount: 28 } },
		],
		learnset: [
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 4 } },
			{ name: "False Swipe", unlock: { type: "level", amount: 8 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 12 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 16 } },
			{ name: "Fling", unlock: { type: "level", amount: 20 } },
		]
	},
	"Marowak": {
		name: "Marowak",
		number: "105",
		weight: {
			pounds: 99.2,
			kilograms: 45.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0105Marowak.png",
			"large-compressed": "src/img/pokemon-compressed/0105Marowak.webp",
			"tiny": "src/img/tiny-pokemon/0105Marowak.webp",
			"largeShiny": "src/img/shiny-pokemon/105-Marowak.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/105-Marowak.webp",
			"home": "src/img/home-pokemon/Marowak.png"
		},
		sounds: {
			"cry": "src/audio/cries/marowak.mp3"
		},
		types: ["Ground"],
		tags: [],
		abilities: ["Rock Head", "Lightning Rod"],
		hiddenAbilities: ["Battle Armor"],
		stats: {
			hp: 60,
			attack: 80,
			defense: 110,
			specialAttack: 50,
			specialDefense: 80,
			speed: 45
		},
		expYield: 149,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 6,
			green: 2,
			purple: 2
		},
		learnset: [
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "False Swipe", unlock: { type: "level", amount: 1 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 12 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 16 } },
			{ name: "Fling", unlock: { type: "level", amount: 20 } },
		]
	},
	"Marowak-Alola": {
		name: "Marowak",
		id: "Marowak-Alola",
		number: "105a",
		weight: {
			pounds: 75.0,
			kilograms: 34.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0105Marowak-Alola.png",
			"large-compressed": "src/img/pokemon-compressed/0105Marowak-Alola.webp",
			"tiny": "src/img/tiny-pokemon/0105Marowak-Alola.webp",
			"largeShiny": "src/img/shiny-pokemon/105-Marowak-Alola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/105-Marowak-Alola.webp",
			"home": "src/img/home-pokemon/Marowak-Alola.png"
		},
		sounds: {
			"cry": "src/audio/cries/marowak.mp3"
		},
		types: ["Fire", "Ghost"],
		tags: [],
		abilities: ["Cursed Body", "Lightning Rod"],
		hiddenAbilities: ["Rock Head"],
		stats: {
			hp: 60,
			attack: 80,
			defense: 110,
			specialAttack: 50,
			specialDefense: 80,
			speed: 45
		},
		expYield: 149,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 2,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 2,
			orange: 2,
			green: 2,
			purple: 4
		},
		learnset: [
			{ name: "False Swipe", unlock: { type: "level", amount: 1 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 1 } },
			{ name: "Retaliate", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Double-Edge", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Fire Spin", unlock: { type: "level", amount: 1 } },
			{ name: "Shadow Bone", unlock: { type: "level", amount: 1 } },
			{ name: "Flame Wheel", unlock: { type: "level", amount: 1 } },
			{ name: "Hex", unlock: { type: "level", amount: 16 } },
			{ name: "Fling", unlock: { type: "level", amount: 20 } },
		]
	},
	"Hitmonlee": {
		name: "Hitmonlee",
		number: "106",
		weight: {
			pounds: 109.8,
			kilograms: 49.8
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0106Hitmonlee.png",
			"large-compressed": "src/img/pokemon-compressed/0106Hitmonlee.webp",
			"tiny": "src/img/tiny-pokemon/0106Hitmonlee.webp",
			"largeShiny": "src/img/shiny-pokemon/106-Hitmonlee.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/106-Hitmonlee.webp",
			"home": "src/img/home-pokemon/Hitmonlee.png"
		},
		sounds: {
			"cry": "src/audio/cries/hitmonlee.mp3"
		},
		types: ["Fighting"],
		tags: [],
		abilities: ["Limber", "Reckless"],
		hiddenAbilities: ["Unburden"],
		stats: {
			hp: 50,
			attack: 120,
			defense: 53,
			specialAttack: 35,
			specialDefense: 110,
			speed: 87
		},
		expYield: 159,
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
			{ name: "Low Sweep", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Brick Break", unlock: { type: "level", amount: 1 } },
			{ name: "Double Kick", unlock: { type: "level", amount: 4 } },
			{ name: "Low Kick", unlock: { type: "level", amount: 8 } },
			{ name: "Endure", unlock: { type: "level", amount: 12 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 16 } },
			{ name: "Wide Guard", unlock: { type: "level", amount: 21 } },
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
			"large-compressed": "src/img/pokemon-compressed/0113Chansey.webp",
			"tiny": "src/img/tiny-pokemon/0113Chansey.webp",
			"largeShiny": "src/img/shiny-pokemon/113-Chansey.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/113-Chansey.webp",
			"home": "src/img/home-pokemon/Chansey.png"
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
	"Kangaskhan": {
		name: "Kangaskhan",
		number: "115",
		weight: {
			pounds: 176.4,
			kilograms: 80.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0115Kangaskhan.png",
			"large-compressed": "src/img/pokemon-compressed/0115Kangaskhan.webp",
			"tiny": "src/img/tiny-pokemon/0115Kangaskhan.webp",
			"largeShiny": "src/img/shiny-pokemon/115-Kangaskhan.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/115-Kangaskhan.webp",
			"home": "src/img/home-pokemon/Kangaskhan.png"
		},
		sounds: {
			"cry": "src/audio/cries/kangaskhan.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Early Bird", "Scrappy"],
		hiddenAbilities: ["Inner Focus"],
		stats: {
			hp: 105,
			attack: 95,
			defense: 80,
			specialAttack: 40,
			specialDefense: 80,
			speed: 90
		},
		expYield: 172,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			green: 3,
			blue: 2,
			purple: 3
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 4 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 8 } },
			{ name: "Bite", unlock: { type: "level", amount: 12 } },
			{ name: "Stomp", unlock: { type: "level", amount: 16 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 20 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 24 } },
			{ name: "Sucker Punch", unlock: { type: "level", amount: 28 } },
			{ name: "Double Hit", unlock: { type: "level", amount: 32 } },
			{ name: "Crunch", unlock: { type: "level", amount: 36 } },
			{ name: "Endure", unlock: { type: "level", amount: 40 } },
			{ name: "Reversal", unlock: { type: "level", amount: 44 } },
			{ name: "Outrage", unlock: { type: "level", amount: 48 } },
			{ name: "Last Resort", unlock: { type: "level", amount: 52 } },
		]
	},
	"Goldeen": {
		name: "Goldeen",
		number: "118",
		weight: {
			pounds: 33.1,
			kilograms: 15.0
		},
		imageFacing: "right",
		imageSources: {
			"large": "src/img/pokemon/0118Goldeen.png",
			"large-compressed": "src/img/pokemon-compressed/0118Goldeen.webp",
			"tiny": "src/img/tiny-pokemon/0118Goldeen.webp",
			"largeShiny": "src/img/shiny-pokemon/118-Goldeen.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/118-Goldeen.webp",
			"home": "src/img/home-pokemon/Goldeen.png"
		},
		sounds: {
			"cry": "src/audio/cries/goldeen.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Swift Swim", "Water Veil"],
		hiddenAbilities: ["Lightning Rod"],
		stats: {
			hp: 45,
			attack: 67,
			defense: 60,
			specialAttack: 35,
			specialDefense: 50,
			speed: 63
		},
		expYield: 64,
		evYield: {
			hp: 0,
			attack: 1,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 5
		},
		evolutions: [
			{ name: "Seaking", unlock: { type: "level", amount: 33 } }
		],
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 5 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 10 } },
			{ name: "Horn Attack", unlock: { type: "level", amount: 15 } },
			{ name: "Agility", unlock: { type: "level", amount: 20 } },
			{ name: "Aqua Ring", unlock: { type: "level", amount: 25 } },
			{ name: "Flail", unlock: { type: "level", amount: 30 } },
		]
	},
	"Seaking": {
		name: "Seaking",
		number: "119",
		weight: {
			pounds: 86.0,
			kilograms: 39.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0119Seaking.png",
			"large-compressed": "src/img/pokemon-compressed/0119Seaking.webp",
			"tiny": "src/img/tiny-pokemon/0119Seaking.webp",
			"largeShiny": "src/img/shiny-pokemon/119-Seaking.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/119-Seaking.webp",
			"home": "src/img/home-pokemon/Seaking.png"
		},
		sounds: {
			"cry": "src/audio/cries/seaking.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Swift Swim", "Water Veil"],
		hiddenAbilities: ["Lightning Rod"],
		stats: {
			hp: 80,
			attack: 92,
			defense: 65,
			specialAttack: 65,
			specialDefense: 80,
			speed: 68
		},
		expYield: 158,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 9
		},
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 1 } },
			{ name: "Horn Attack", unlock: { type: "level", amount: 15 } },
			{ name: "Agility", unlock: { type: "level", amount: 20 } },
			{ name: "Aqua Ring", unlock: { type: "level", amount: 25 } },
			{ name: "Flail", unlock: { type: "level", amount: 30 } },
		]
	},
	"Staryu": {
		name: "Staryu",
		number: "120",
		weight: {
			pounds: 76.1,
			kilograms: 34.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0120Staryu.png",
			"large-compressed": "src/img/pokemon-compressed/0120Staryu.webp",
			"tiny": "src/img/tiny-pokemon/0120Staryu.webp",
			"largeShiny": "src/img/shiny-pokemon/120-Staryu.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/120-Staryu.webp",
			"home": "src/img/home-pokemon/Staryu.png"
		},
		sounds: {
			"cry": "src/audio/cries/staryu.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Illuminate", "Natural Cure"],
		hiddenAbilities: ["Analytic"],
		stats: {
			hp: 30,
			attack: 45,
			defense: 55,
			specialAttack: 70,
			specialDefense: 55,
			speed: 85
		},
		expYield: 68,
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
			blue: 3,
			purple: 2
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 4 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 8 } },
			{ name: "Rapid Spin", unlock: { type: "level", amount: 12 } },
			{ name: "Minimize", unlock: { type: "level", amount: 16 } },
			{ name: "Swift", unlock: { type: "level", amount: 20 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 24 } },
			{ name: "Brine", unlock: { type: "level", amount: 28 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 32 } },
			{ name: "Power Gem", unlock: { type: "level", amount: 36 } },
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
			"large-compressed": "src/img/pokemon-compressed/0128Tauros.webp",
			"tiny": "src/img/tiny-pokemon/0128Tauros.webp",
			"largeShiny": "src/img/shiny-pokemon/128-Tauros.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/128-Tauros.webp",
			"home": "src/img/home-pokemon/Tauros.png"
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
	"Magikarp": {
		name: "Magikarp",
		number: "129",
		weight: {
			pounds: 22.0,
			kilograms: 10.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0129Magikarp.png",
			"large-compressed": "src/img/pokemon-compressed/0129Magikarp.webp",
			"tiny": "src/img/tiny-pokemon/0129Magikarp.webp",
			"largeShiny": "src/img/shiny-pokemon/129-Magikarp.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/129-Magikarp.webp",
			"home": "src/img/home-pokemon/Magikarp.png"
		},
		sounds: {
			"cry": "src/audio/cries/magikarp.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Swift Swim"],
		hiddenAbilities: ["Rattled"],
		stats: {
			hp: 20,
			attack: 10,
			defense: 55,
			specialAttack: 15,
			specialDefense: 20,
			speed: 80
		},
		expYield: 40,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			blue: 3
		},
		learnset: [
			{ name: "Splash", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 15 } },
			{ name: "Flail", unlock: { type: "level", amount: 25 } },
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
			"large-compressed": "src/img/pokemon-compressed/0133Eevee.webp",
			"tiny": "src/img/tiny-pokemon/0133Eevee.webp",
			"largeShiny": "src/img/shiny-pokemon/133-Eevee.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/133-Eevee.webp",
			"home": "src/img/home-pokemon/Eevee.png"
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
			"large-compressed": "src/img/pokemon-compressed/0165Ledyba.webp",
			"tiny": "src/img/tiny-pokemon/0165Ledyba.webp",
			"largeShiny": "src/img/shiny-pokemon/165-Ledyba.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/165-Ledyba.webp",
			"home": "src/img/home-pokemon/Ledyba.png"
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
			"large-compressed": "src/img/pokemon-compressed/0166Ledian.webp",
			"tiny": "src/img/tiny-pokemon/0166Ledian.webp",
			"largeShiny": "src/img/shiny-pokemon/166-Ledian.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/166-Ledian.webp",
			"home": "src/img/home-pokemon/Ledian.png"
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
			"large-compressed": "src/img/pokemon-compressed/0167Spinarak.webp",
			"tiny": "src/img/tiny-pokemon/0167Spinarak.webp",
			"largeShiny": "src/img/shiny-pokemon/167-Spinarak.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/167-Spinarak.webp",
			"home": "src/img/home-pokemon/Spinarak.png"
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
			"large-compressed": "src/img/pokemon-compressed/0168Ariados.webp",
			"tiny": "src/img/tiny-pokemon/0168Ariados.webp",
			"largeShiny": "src/img/shiny-pokemon/168-Ariados.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/168-Ariados.webp",
			"home": "src/img/home-pokemon/Ariados.png"
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
			"large-compressed": "src/img/pokemon-compressed/0172Pichu.webp",
			"tiny": "src/img/tiny-pokemon/0172Pichu.webp",
			"largeShiny": "src/img/shiny-pokemon/172-Pichu.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/172-Pichu.webp",
			"home": "src/img/home-pokemon/Pichu.png"
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
			"large-compressed": "src/img/pokemon-compressed/0174Igglybuff.webp",
			"tiny": "src/img/tiny-pokemon/0174Igglybuff.webp",
			"largeShiny": "src/img/shiny-pokemon/174-Igglybuff.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/174-Igglybuff.webp",
			"home": "src/img/home-pokemon/Igglybuff.png"
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
			"large-compressed": "src/img/pokemon-compressed/0179Mareep.webp",
			"tiny": "src/img/tiny-pokemon/0179Mareep.webp",
			"largeShiny": "src/img/shiny-pokemon/179-Mareep.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/179-Mareep.webp",
			"home": "src/img/home-pokemon/Mareep.png"
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
			"large-compressed": "src/img/pokemon-compressed/0180Flaaffy.webp",
			"tiny": "src/img/tiny-pokemon/0180Flaaffy.webp",
			"largeShiny": "src/img/shiny-pokemon/180-Flaaffy.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/180-Flaaffy.webp",
			"home": "src/img/home-pokemon/Flaaffy.png"
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
			"large-compressed": "src/img/pokemon-compressed/0181Ampharos.webp",
			"tiny": "src/img/tiny-pokemon/0181Ampharos.webp",
			"largeShiny": "src/img/shiny-pokemon/181-Ampharos.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/181-Ampharos.webp",
			"home": "src/img/home-pokemon/Ampharos.png"
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
			"large-compressed": "src/img/pokemon-compressed/0196Espeon.webp",
			"tiny": "src/img/tiny-pokemon/0196Espeon.webp",
			"largeShiny": "src/img/shiny-pokemon/196-Espeon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/196-Espeon.webp",
			"home": "src/img/home-pokemon/Espeon.png"
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
			"large-compressed": "src/img/pokemon-compressed/0198Murkrow.webp",
			"tiny": "src/img/tiny-pokemon/0198Murkrow.webp",
			"largeShiny": "src/img/shiny-pokemon/198-Murkrow.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/198-Murkrow.webp",
			"home": "src/img/home-pokemon/Murkrow.png"
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
			"large-compressed": "src/img/pokemon-compressed/0200Misdreavus.webp",
			"tiny": "src/img/tiny-pokemon/0200Misdreavus.webp",
			"largeShiny": "src/img/shiny-pokemon/200-Misdreavus.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/200-Misdreavus.webp",
			"home": "src/img/home-pokemon/Misdreavus.png"
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
			"large-compressed": "src/img/pokemon-compressed/0225Delibird.webp",
			"tiny": "src/img/tiny-pokemon/0225Delibird.webp",
			"largeShiny": "src/img/shiny-pokemon/225-Delibird.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/225-Delibird.webp",
			"home": "src/img/home-pokemon/Delibird.png"
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
			"large-compressed": "src/img/pokemon-compressed/0228Houndour.webp",
			"tiny": "src/img/tiny-pokemon/0228Houndour.webp",
			"largeShiny": "src/img/shiny-pokemon/228-Houndour.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/228-Houndour.webp",
			"home": "src/img/home-pokemon/Houndour.png"
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
			"large-compressed": "src/img/pokemon-compressed/0235Smeargle.webp",
			"tiny": "src/img/tiny-pokemon/0235Smeargle.webp",
			"largeShiny": "src/img/shiny-pokemon/235-Smeargle.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/235-Smeargle.webp",
			"home": "src/img/home-pokemon/Smeargle.png"
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
			"large-compressed": "src/img/pokemon-compressed/0238Smoochum.webp",
			"tiny": "src/img/tiny-pokemon/0238Smoochum.webp",
			"largeShiny": "src/img/shiny-pokemon/238-Smoochum.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/238-Smoochum.webp",
			"home": "src/img/home-pokemon/Smoochum.png"
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
	"Magby": {
		name: "Magby",
		number: "240",
		weight: {
			pounds: 47.2,
			kilograms: 21.4
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0240Magby.png",
			"large-compressed": "src/img/pokemon-compressed/0240Magby.webp",
			"tiny": "src/img/tiny-pokemon/0240Magby.webp",
			"largeShiny": "src/img/shiny-pokemon/240-Magby.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/240-Magby.webp",
			"home": "src/img/home-pokemon/Magby.png"
		},
		sounds: {
			"cry": "src/audio/cries/magby.mp3"
		},
		types: ["Fire"],
		tags: [],
		abilities: ["Flame Body"],
		hiddenAbilities: ["Vital Spirit"],
		stats: {
			hp: 45,
			attack: 75,
			defense: 37,
			specialAttack: 70,
			specialDefense: 55,
			speed: 83
		},
		expYield: 73,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			red: 3,
			orange: 1
		},
		learnset: [
			{ name: "Smog", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 4 } },
			// { name: "Smokescreen", unlock: { type: "level", amount: 8 } },
			// { name: "Clear Smog", unlock: { type: "level", amount: 12 } },
			{ name: "Flame Wheel", unlock: { type: "level", amount: 16 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 20 } },
			{ name: "Scary Face", unlock: { type: "level", amount: 24 } },
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
			"large-compressed": "src/img/pokemon-compressed/0241Miltank.webp",
			"tiny": "src/img/tiny-pokemon/0241Miltank.webp",
			"largeShiny": "src/img/shiny-pokemon/241-Miltank.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/241-Miltank.webp",
			"home": "src/img/home-pokemon/Miltank.png"
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
			"large-compressed": "src/img/pokemon-compressed/0261Poochyena.webp",
			"tiny": "src/img/tiny-pokemon/0261Poochyena.webp",
			"largeShiny": "src/img/shiny-pokemon/261-Poochyena.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/261-Poochyena.webp",
			"home": "src/img/home-pokemon/Poochyena.png"
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
			"large-compressed": "src/img/pokemon-compressed/0278Wingull.webp",
			"tiny": "src/img/tiny-pokemon/0278Wingull.webp",
			"largeShiny": "src/img/shiny-pokemon/278-Wingull.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/278-Wingull.webp",
			"home": "src/img/home-pokemon/Wingull.png"
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
			"large-compressed": "src/img/pokemon-compressed/0279Pelipper.webp",
			"tiny": "src/img/tiny-pokemon/0279Pelipper.webp",
			"largeShiny": "src/img/shiny-pokemon/279-Pelipper.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/279-Pelipper.webp",
			"home": "src/img/home-pokemon/Pelipper.png"
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
			"large-compressed": "src/img/pokemon-compressed/0283Surskit.webp",
			"tiny": "src/img/tiny-pokemon/0283Surskit.webp",
			"largeShiny": "src/img/shiny-pokemon/283-Surskit.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/283-Surskit.webp",
			"home": "src/img/home-pokemon/Surskit.png"
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
			"large-compressed": "src/img/pokemon-compressed/0284Masquerain.webp",
			"tiny": "src/img/tiny-pokemon/0284Masquerain.webp",
			"largeShiny": "src/img/shiny-pokemon/284-Masquerain.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/284-Masquerain.webp",
			"home": "src/img/home-pokemon/Masquerain.png"
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
			"large-compressed": "src/img/pokemon-compressed/0296Makuhita.webp",
			"tiny": "src/img/tiny-pokemon/0296Makuhita.webp",
			"largeShiny": "src/img/shiny-pokemon/296-Makuhita.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/296-Makuhita.webp",
			"home": "src/img/home-pokemon/Makuhita.png"
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
			"large-compressed": "src/img/pokemon-compressed/0297Hariyama.webp",
			"tiny": "src/img/tiny-pokemon/0297Hariyama.webp",
			"largeShiny": "src/img/shiny-pokemon/297-Hariyama.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/297-Hariyama.webp",
			"home": "src/img/home-pokemon/Hariyama.png"
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
			"large-compressed": "src/img/pokemon-compressed/0302Sableye.webp",
			"tiny": "src/img/tiny-pokemon/0302Sableye.webp",
			"largeShiny": "src/img/shiny-pokemon/302-Sableye.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/302-Sableye.webp",
			"home": "src/img/home-pokemon/Sableye.png"
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
			"large-compressed": "src/img/pokemon-compressed/0303Mawile.webp",
			"tiny": "src/img/tiny-pokemon/0303Mawile.webp",
			"largeShiny": "src/img/shiny-pokemon/303-Mawile.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/303-Mawile.webp",
			"home": "src/img/home-pokemon/Mawile.png"
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
	"Roselia": {
		name: "Roselia",
		number: "315",
		weight: {
			pounds: 4.4,
			kilograms: 2.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0315Roselia.png",
			"large-compressed": "src/img/pokemon-compressed/0315Roselia.webp",
			"tiny": "src/img/tiny-pokemon/0315Roselia.webp",
			"largeShiny": "src/img/shiny-pokemon/315-Roselia.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/315-Roselia.webp",
			"home": "src/img/home-pokemon/Roselia.png"
		},
		sounds: {
			"cry": "src/audio/cries/roselia.mp3"
		},
		types: ["Grass", "Poison"],
		tags: [],
		abilities: ["Natural Cure", "Poison Point"],
		hiddenAbilities: ["Leaf Guard"],
		stats: {
			hp: 50,
			attack: 60,
			defense: 45,
			specialAttack: 100,
			specialDefense: 80,
			speed: 65
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
			green: 4,
			purple: 3
		},
		evolutions: [
			{ name: "Roserade", unlock: { type: "fiveMatchPurple", amount: 10 } }
		],
		learnset: [
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 1 } },
			// { name: "Worry Seed", unlock: { type: "level", amount: 1 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 5 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 10 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 15 } },
			// { name: "Toxic Spikes", unlock: { type: "level", amount: 20 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 25 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 30 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 35 } },
			// { name: "Toxic", unlock: { type: "level", amount: 40 } },
			// { name: "Petal Blizzard", unlock: { type: "level", amount: 45 } },
			// { name: "Aromatherapy", unlock: { type: "level", amount: 50 } },
			{ name: "Ingrain", unlock: { type: "level", amount: 55 } },
			// { name: "Petal Dance", unlock: { type: "level", amount: 60 } },
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
			"large-compressed": "src/img/pokemon-compressed/0327Spinda.webp",
			"tiny": "src/img/tiny-pokemon/0327Spinda.webp",
			"largeShiny": "src/img/shiny-pokemon/327-Spinda.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/327-Spinda.webp",
			"home": "src/img/home-pokemon/Spinda.png"
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
	"Barboach": {
		name: "Barboach",
		number: "339",
		weight: {
			pounds: 4.2,
			kilograms: 1.9
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0339Barboach.png",
			"large-compressed": "src/img/pokemon-compressed/0339Barboach.webp",
			"tiny": "src/img/tiny-pokemon/0339Barboach.webp",
			"largeShiny": "src/img/shiny-pokemon/339-Barboach.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/339-Barboach.webp",
			"home": "src/img/home-pokemon/Barboach.png"
		},
		sounds: {
			"cry": "src/audio/cries/barboach.mp3"
		},
		types: ["Water", "Ground"],
		tags: [],
		abilities: ["Oblivious", "Anticipation"],
		hiddenAbilities: ["Hydration"],
		stats: {
			hp: 50,
			attack: 48,
			defense: 43,
			specialAttack: 46,
			specialDefense: 41,
			speed: 60
		},
		expYield: 58,
		evYield: {
			hp: 1,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 2,
			blue: 2,
			purple: 1
		},
		evolutions: [
			{ name: "Whiscash", unlock: { type: "level", amount: 30 } }
		],
		learnset: [
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Rest", unlock: { type: "level", amount: 6 } },
			{ name: "Snore", unlock: { type: "level", amount: 6 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 12 } },
			{ name: "Amnesia", unlock: { type: "level", amount: 18 } },
			{ name: "Aqua Tail", unlock: { type: "level", amount: 24 } },
		]
	},
	"Whiscash": {
		name: "Whiscash",
		number: "340",
		weight: {
			pounds: 52.0,
			kilograms: 23.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0340Whiscash.png",
			"large-compressed": "src/img/pokemon-compressed/0340Whiscash.webp",
			"tiny": "src/img/tiny-pokemon/0340Whiscash.webp",
			"largeShiny": "src/img/shiny-pokemon/340-Whiscash.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/340-Whiscash.webp",
			"home": "src/img/home-pokemon/Whiscash.png"
		},
		sounds: {
			"cry": "src/audio/cries/whiscash.mp3"
		},
		types: ["Water", "Ground"],
		tags: [],
		abilities: ["Oblivious", "Anticipation"],
		hiddenAbilities: ["Hydration"],
		stats: {
			hp: 110,
			attack: 78,
			defense: 73,
			specialAttack: 76,
			specialDefense: 71,
			speed: 60
		},
		expYield: 164,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			orange: 3,
			yellow: 1,
			blue: 3,
			purple: 2
		},
		learnset: [
			{ name: "Belch", unlock: { type: "level", amount: 1 } },
			{ name: "Zen Headbutt", unlock: { type: "level", amount: 1 } },
			{ name: "Tickle", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 1 } },
			{ name: "Rest", unlock: { type: "level", amount: 1 } },
			{ name: "Snore", unlock: { type: "level", amount: 1 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 12 } },
			{ name: "Amnesia", unlock: { type: "level", amount: 18 } },
			{ name: "Aqua Tail", unlock: { type: "level", amount: 24 } },
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
			"large-compressed": "src/img/pokemon-compressed/0371Bagon.webp",
			"tiny": "src/img/tiny-pokemon/0371Bagon.webp",
			"largeShiny": "src/img/shiny-pokemon/371-Bagon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/371-Bagon.webp",
			"home": "src/img/home-pokemon/Bagon.png"
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
	"Budew": {
		name: "Budew",
		number: "406",
		weight: {
			pounds: 2.6,
			kilograms: 1.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0406Budew.png",
			"large-compressed": "src/img/pokemon-compressed/0406Budew.webp",
			"tiny": "src/img/tiny-pokemon/0406Budew.webp",
			"largeShiny": "src/img/shiny-pokemon/406-Budew.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/406-Budew.webp",
			"home": "src/img/home-pokemon/Budew.png"
		},
		sounds: {
			"cry": "src/audio/cries/budew.mp3"
		},
		types: ["Grass", "Poison"],
		tags: [],
		abilities: ["Natural Cure", "Poison Point"],
		hiddenAbilities: ["Leaf Guard"],
		stats: {
			hp: 40,
			attack: 30,
			defense: 35,
			specialAttack: 50,
			specialDefense: 70,
			speed: 55
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
			green: 4,
		},
		evolutions: [
			{ name: "Roselia", unlock: { type: "friendship", amount: 50 } }
		],
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 1 } },
			// { name: "Worry Seed", unlock: { type: "level", amount: 1 } },
		]
	},
	"Roserade": {
		name: "Roserade",
		number: "407",
		weight: {
			pounds: 32.0,
			kilograms: 14.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0407Roserade.png",
			"large-compressed": "src/img/pokemon-compressed/0407Roserade.webp",
			"tiny": "src/img/tiny-pokemon/0407Roserade.webp",
			"largeShiny": "src/img/shiny-pokemon/407-Roserade.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/407-Roserade.webp",
			"home": "src/img/home-pokemon/Roserade.png"
		},
		sounds: {
			"cry": "src/audio/cries/roserade.mp3"
		},
		types: ["Grass", "Poison"],
		tags: [],
		abilities: ["Natural Cure", "Poison Point"],
		hiddenAbilities: ["Technician"],
		stats: {
			hp: 60,
			attack: 70,
			defense: 65,
			specialAttack: 125,
			specialDefense: 105,
			speed: 90
		},
		expYield: 232,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 3,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 1,
			green: 4,
			blue: 2,
			purple: 3,
		},
		learnset: [
			// { name: "Grassy Terrain", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			// { name: "Venom Drench", unlock: { type: "level", amount: 1 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 1 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 1 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 1 } },
			// { name: "Toxic Spikes", unlock: { type: "level", amount: 1 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 1 } },
			{ name: "Giga Drain", unlock: { type: "level", amount: 1 } },
			{ name: "Synthesis", unlock: { type: "level", amount: 1 } },
			// { name: "Toxic", unlock: { type: "level", amount: 1 } },
			// { name: "Petal Blizzard", unlock: { type: "level", amount: 1 } },
			// { name: "Aromatherapy", unlock: { type: "level", amount: 1 } },
			{ name: "Ingrain", unlock: { type: "level", amount: 1 } },
			// { name: "Petal Dance", unlock: { type: "level", amount: 1 } },
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 1 } },
			// { name: "Worry Seed", unlock: { type: "level", amount: 1 } },
		]
	},
	"Cherrim": {
		name: "Cherrim",
		number: "421",
		weight: {
			pounds: 20.5,
			kilograms: 9.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0421Cherrim.png",
			"large-compressed": "src/img/pokemon-compressed/0421Cherrim.webp",
			"tiny": "src/img/tiny-pokemon/0421Cherrim.webp",
			"largeShiny": "src/img/shiny-pokemon/421-Cherrim-Overcast.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/421-Cherrim-Overcast.webp",
			"home": "src/img/home-pokemon/Drifloon.png"
		},
		sounds: {
			"cry": "src/audio/cries/cherrim.mp3"
		},
		hasForms: true,
		formsToLoad: ["Overcast", "Sunshine"],
		defaultForm: "Overcast",
		forms: {
			"Overcast": {
				id: "Overcast",
				imageSources: {
					"large": "src/img/pokemon/0421Cherrim.png",
					"large-compressed": "src/img/pokemon-compressed/0421Cherrim.webp",
					"tiny": "src/img/tiny-pokemon/0421Cherrim.webp",
					"largeShiny": "src/img/shiny-pokemon/421-Cherrim-Overcast.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/421-Cherrim-Overcast.webp",
					"home": "src/img/home-pokemon/Cherrim-Overcast.png"
				},
			},
			"Sunshine": {
				id: "Sunshine",
				imageSources: {
					"large": "src/img/pokemon/0421Cherrim-Sunshine.png",
					"large-compressed": "src/img/pokemon-compressed/0421Cherrim-Sunshine.webp",
					"tiny": "src/img/tiny-pokemon/0421Cherrim-Sunshine.webp",
					"largeShiny": "src/img/shiny-pokemon/421-Cherrim-Sunny.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/421-Cherrim-Sunny.webp",
					"home": "src/img/home-pokemon/Cherrim-Sunshine.png"
				},
			},
		},
		types: ["Grass"],
		tags: [],
		abilities: ["Flower Gift"],
		hiddenAbilities: [],
		stats: {
			hp: 70,
			attack: 60,
			defense: 70,
			specialAttack: 87,
			specialDefense: 78,
			speed: 85
		},
		expYield: 158,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 2,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			red: 4,
			yellow: 1,
			green: 5,
		},
		learnset: [
			// { name: "Sunny Day", unlock: { type: "level", amount: 1 } },
			// { name: "Flower Shield", unlock: { type: "level", amount: 1 } },
			// { name: "Morning Sun", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leafage", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 15 } },
			{ name: "Magical Leaf", unlock: { type: "level", amount: 20 } },
			{ name: "Leech Seed", unlock: { type: "level", amount: 28 } },
			{ name: "Take Down", unlock: { type: "level", amount: 34 } },
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
			"large-compressed": "src/img/pokemon-compressed/0425Drifloon.webp",
			"tiny": "src/img/tiny-pokemon/0425Drifloon.webp",
			"largeShiny": "src/img/shiny-pokemon/425-Drifloon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/425-Drifloon.webp",
			"home": "src/img/home-pokemon/Drifloon.png"
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
			"large-compressed": "src/img/pokemon-compressed/0426Drifblim.webp",
			"tiny": "src/img/tiny-pokemon/0426Drifblim.webp",
			"largeShiny": "src/img/shiny-pokemon/426-Drifblim.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/426-Drifblim.webp",
			"home": "src/img/home-pokemon/Drifblim.png"
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
			"large-compressed": "src/img/pokemon-compressed/0429Mismagius.webp",
			"tiny": "src/img/tiny-pokemon/0429Mismagius.webp",
			"largeShiny": "src/img/shiny-pokemon/429-Mismagius.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/429-Mismagius.webp",
			"home": "src/img/home-pokemon/Mismagius.png"
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
			"large-compressed": "src/img/pokemon-compressed/0430Honchkrow.webp",
			"tiny": "src/img/tiny-pokemon/0430Honchkrow.webp",
			"largeShiny": "src/img/shiny-pokemon/430-Honchkrow.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/430-Honchkrow.webp",
			"home": "src/img/home-pokemon/Honchkrow.png"
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
			"large-compressed": "src/img/pokemon-compressed/0438Bonsly.webp",
			"tiny": "src/img/tiny-pokemon/0438Bonsly.webp",
			"largeShiny": "src/img/shiny-pokemon/438-Bonsly.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/438-Bonsly.webp",
			"home": "src/img/home-pokemon/Bonsly.png"
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
			"large-compressed": "src/img/pokemon-compressed/0440Happiny.webp",
			"tiny": "src/img/tiny-pokemon/0440Happiny.webp",
			"largeShiny": "src/img/shiny-pokemon/440-Happiny.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/440-Happiny.webp",
			"home": "src/img/home-pokemon/Happiny.png"
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
	"Finneon": {
		name: "Finneon",
		number: "456",
		weight: {
			pounds: 15.4,
			kilograms: 7.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0456Finneon.png",
			"large-compressed": "src/img/pokemon-compressed/0456Finneon.webp",
			"tiny": "src/img/tiny-pokemon/0456Finneon.webp",
			"largeShiny": "src/img/shiny-pokemon/456-Finneon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/456-Finneon.webp",
			"home": "src/img/home-pokemon/Finneon.png"
		},
		sounds: {
			"cry": "src/audio/cries/finneon.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Swift Swim", "Storm Drain"],
		hiddenAbilities: ["Water Veil"],
		stats: {
			hp: 49,
			attack: 49,
			defense: 56,
			specialAttack: 49,
			specialDefense: 61,
			speed: 66
		},
		expYield: 66,
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
			green: 1,
			blue: 3
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 6 } },
			{ name: "Rain Dance", unlock: { type: "level", amount: 13 } },
			{ name: "Gust", unlock: { type: "level", amount: 17 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 22 } },
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
			"large-compressed": "src/img/pokemon-compressed/0471Glaceon.webp",
			"tiny": "src/img/tiny-pokemon/0471Glaceon.webp",
			"largeShiny": "src/img/shiny-pokemon/471-Glaceon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/471-Glaceon.webp",
			"home": "src/img/home-pokemon/Glaceon.png"
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
			"large-compressed": "src/img/pokemon-compressed/0506Lillipup.webp",
			"tiny": "src/img/tiny-pokemon/0506Lillipup.webp",
			"largeShiny": "src/img/shiny-pokemon/506-Lillipup.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/506-Lillipup.webp",
			"home": "src/img/home-pokemon/Lillipup.png"
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
			"large-compressed": "src/img/pokemon-compressed/0507Herdier.webp",
			"tiny": "src/img/tiny-pokemon/0507Herdier.webp",
			"largeShiny": "src/img/shiny-pokemon/507-Herdier.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/507-Herdier.webp",
			"home": "src/img/home-pokemon/Herdier.png"
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
			"large-compressed": "src/img/pokemon-compressed/0508Stoutland.webp",
			"tiny": "src/img/tiny-pokemon/0508Stoutland.webp",
			"largeShiny": "src/img/shiny-pokemon/508-Stoutland.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/508-Stoutland.webp",
			"home": "src/img/home-pokemon/Stoutland.png"
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
			"large-compressed": "src/img/pokemon-compressed/0524Roggenrola.webp",
			"tiny": "src/img/tiny-pokemon/0524Roggenrola.webp",
			"largeShiny": "src/img/shiny-pokemon/524-Roggenrola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/524-Roggenrola.webp",
			"home": "src/img/home-pokemon/Roggenrola.png"
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
			"large-compressed": "src/img/pokemon-compressed/0525Boldore.webp",
			"tiny": "src/img/tiny-pokemon/0525Boldore.webp",
			"largeShiny": "src/img/shiny-pokemon/525-Boldore.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/525-Boldore.webp",
			"home": "src/img/home-pokemon/Boldore.png"
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
			"large-compressed": "src/img/pokemon-compressed/0546Cottonee.webp",
			"tiny": "src/img/tiny-pokemon/0546Cottonee.webp",
			"largeShiny": "src/img/shiny-pokemon/546-Cottonee.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/546-Cottonee.webp",
			"home": "src/img/home-pokemon/Cottonee.png"
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
			"large-compressed": "src/img/pokemon-compressed/0547Whimsicott.webp",
			"tiny": "src/img/tiny-pokemon/0547Whimsicott.webp",
			"largeShiny": "src/img/shiny-pokemon/547-Whimsicott.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/547-Whimsicott.webp",
			"home": "src/img/home-pokemon/Whimsicott.png"
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
			{ name: "Endeavor", unlock: { type: "level", amount: 42 } },
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
			"large-compressed": "src/img/pokemon-compressed/0548Petilil.webp",
			"tiny": "src/img/tiny-pokemon/0548Petilil.webp",
			"largeShiny": "src/img/shiny-pokemon/548-Petilil.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/548-Petilil.webp",
			"home": "src/img/home-pokemon/Petilil.png"
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
			"large-compressed": "src/img/pokemon-compressed/0549Lilligant.webp",
			"tiny": "src/img/tiny-pokemon/0549Lilligant.webp",
			"largeShiny": "src/img/shiny-pokemon/549-Lilligant.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/549-Lilligant.webp",
			"home": "src/img/home-pokemon/Lilligant.png"
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
			"large-compressed": "src/img/pokemon-compressed/0549Lilligant-Hisui.webp",
			"tiny": "src/img/tiny-pokemon/0549Lilligant-Hisui.webp",
			"largeShiny": "src/img/shiny-pokemon/549-Lilligant-Hisui.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/549-Lilligant-Hisui.webp",
			"home": "src/img/home-pokemon/Lilligant-Hisui.png"
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
			"large-compressed": "src/img/pokemon-compressed/0570Zorua.webp",
			"tiny": "src/img/tiny-pokemon/0570Zorua.webp",
			"largeShiny": "src/img/shiny-pokemon/570-Zorua.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/570-Zorua.webp",
			"home": "src/img/home-pokemon/Zorua.png"
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
	"Minccino": {
		name: "Minccino",
		number: "572",
		weight: {
			pounds: 12.8,
			kilograms: 5.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0572Minccino.png",
			"large-compressed": "src/img/pokemon-compressed/0572Minccino.webp",
			"tiny": "src/img/tiny-pokemon/0572Minccino.webp",
			"largeShiny": "src/img/shiny-pokemon/572-Minccino.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/572-Minccino.webp",
			"home": "src/img/home-pokemon/Minccino.png"
		},
		sounds: {
			"cry": "src/audio/cries/minccino.mp3"
		},
		types: ["Normal"],
		tags: [],
		abilities: ["Cute Charm", "Technician"],
		hiddenAbilities: ["Skill Link"],
		stats: {
			hp: 55,
			attack: 50,
			defense: 40,
			specialAttack: 40,
			specialDefense: 40,
			speed: 75
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
			green: 2,
			purple: 3,
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 4 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 18 } },
			{ name: "Sing", unlock: { type: "level", amount: 12 } },
			{ name: "Charm", unlock: { type: "level", amount: 16 } },
			{ name: "Swift", unlock: { type: "level", amount: 20 } },
			{ name: "Encore", unlock: { type: "level", amount: 24 } },
		]
	},
	"Alomomola": {
		name: "Alomomola",
		number: "594",
		weight: {
			pounds: 69.7,
			kilograms: 31.6
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0594Alomomola.png",
			"large-compressed": "src/img/pokemon-compressed/0594Alomomola.webp",
			"tiny": "src/img/tiny-pokemon/0594Alomomola.webp",
			"largeShiny": "src/img/shiny-pokemon/594-Alomomola.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/594-Alomomola.webp",
			"home": "src/img/home-pokemon/Alomomola.png"
		},
		sounds: {
			"cry": "src/audio/cries/alomomola.mp3"
		},
		types: ["Water"],
		tags: [],
		abilities: ["Healer", "Hydration"],
		hiddenAbilities: ["Regenerator"],
		stats: {
			hp: 165,
			attack: 75,
			defense: 80,
			specialAttack: 40,
			specialDefense: 45,
			speed: 65
		},
		expYield: 165,
		evYield: {
			hp: 2,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 3,
			orange: 1,
			purple: 1
		},
		learnset: [
			{ name: "Play Nice", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Aqua Ring", unlock: { type: "level", amount: 5 } },
			{ name: "Aqua Jet", unlock: { type: "level", amount: 9 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 13 } },
			{ name: "Wide Guard", unlock: { type: "level", amount: 13 } },
			{ name: "Protect", unlock: { type: "level", amount: 21 } },
			{ name: "Water Pulse", unlock: { type: "level", amount: 25 } },
		]
	},
	"Klink": {
		name: "Klink",
		number: "599",
		weight: {
			pounds: 46.3,
			kilograms: 21.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0777Togedemaru.png",
			"large-compressed": "src/img/pokemon-compressed/0777Togedemaru.webp",
			"tiny": "src/img/tiny-pokemon/0777Togedemaru.webp",
			"largeShiny": "src/img/shiny-pokemon/599-Klink.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/599-Klink.webp",
			"home": "src/img/home-pokemon/Klink.png"
		},
		sounds: {
			"cry": "src/audio/cries/klink.mp3"
		},
		tags: [],
		types: ["Steel"],
		abilities: ["Plus", "Minus"],
		hiddenAbilities: ["Clear Body"],
		stats: {
			hp: 40,
			attack: 55,
			defense: 70,
			specialAttack: 45,
			specialDefense: 60,
			speed: 30
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
			yellow: 2,
			blue: 2
		},
		learnset: [
			{ name: "Thunder Shock", unlock: { type: "level", amount: 1 } },
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			// { name: "Bind", unlock: { type: "level", amount: 4 } },
			{ name: "Charge", unlock: { type: "level", amount: 8 } },
			// { name: "Charge Beam", unlock: { type: "level", amount: 12 } },
			{ name: "Metal Sound", unlock: { type: "level", amount: 16 } },
			// { name: "Automotize", unlock: { type: "level", amount: 20 } },
			{ name: "Discharge", unlock: { type: "level", amount: 24 } },
			{ name: "Screech", unlock: { type: "level", amount: 28 } },
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
			"large-compressed": "src/img/pokemon-compressed/0627Rufflet.webp",
			"tiny": "src/img/tiny-pokemon/0627Rufflet.webp",
			"largeShiny": "src/img/shiny-pokemon/627-Rufflet.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/627-Rufflet.webp",
			"home": "src/img/home-pokemon/Rufflet.png"
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
			"large-compressed": "src/img/pokemon-compressed/0629Vullaby.webp",
			"tiny": "src/img/tiny-pokemon/0629Vullaby.webp",
			"largeShiny": "src/img/shiny-pokemon/629-Vullaby.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/629-Vullaby.webp",
			"home": "src/img/home-pokemon/Vullaby.png"
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
	"Fletchling": {
		name: "Fletchling",
		number: "661",
		weight: {
			pounds: 3.7,
			kilograms: 1.7
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0661Fletchling.png",
			"large-compressed": "src/img/pokemon-compressed/0661Fletchling.webp",
			"tiny": "src/img/tiny-pokemon/0661Fletchling.webp",
			"largeShiny": "src/img/shiny-pokemon/661-Fletchling.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/661-Fletchling.webp",
			"home": "src/img/home-pokemon/Fletchling.png"
		},
		sounds: {
			"cry": "src/audio/cries/seaking.mp3"
		},
		types: ["Normal", "Flying"],
		tags: [],
		abilities: ["Big Pecks"],
		hiddenAbilities: ["Gale Wings"],
		stats: {
			hp: 45,
			attack: 50,
			defense: 43,
			specialAttack: 40,
			specialDefense: 38,
			speed: 62
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
			red: 2,
			yellow: 1,
			blue: 2,
		},
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Quick Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Ember", unlock: { type: "level", amount: 10 } },
			{ name: "Flail", unlock: { type: "level", amount: 15 } },
			{ name: "Acrobatics", unlock: { type: "level", amount: 20 } },
			{ name: "Agility", unlock: { type: "level", amount: 25 } },
			{ name: "Aerial Ace", unlock: { type: "level", amount: 30 } },
			{ name: "Tailwind", unlock: { type: "level", amount: 35 } },
		]
	},
	"Litleo": {
		name: "Litleo",
		number: "667",
		weight: {
			pounds: 29.8,
			kilograms: 13.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0667Litleo.png",
			"large-compressed": "src/img/pokemon-compressed/0667Litleo.webp",
			"tiny": "src/img/tiny-pokemon/0667Litleo.webp",
			"largeShiny": "src/img/shiny-pokemon/667-Litleo.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/667-Litleo.webp",
			"home": "src/img/home-pokemon/Litleo.png"
		},
		sounds: {
			"cry": "src/audio/cries/litleo.mp3"
		},
		types: ["Fire", "Normal"],
		tags: [],
		abilities: ["Rivalry", "Unnerve"],
		hiddenAbilities: ["Moxie"],
		stats: {
			hp: 62,
			attack: 50,
			defense: 58,
			specialAttack: 73,
			specialDefense: 54,
			speed: 72
		},
		expYield: 74,
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
			orange: 1,
			yellow: 1,
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 5 } },
			{ name: "Work Up", unlock: { type: "level", amount: 8 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 11 } },
			{ name: "Noble Roar", unlock: { type: "level", amount: 15 } },
			{ name: "Take Down", unlock: { type: "level", amount: 20 } },
			{ name: "Fire Fang", unlock: { type: "level", amount: 23 } },
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
			"large-compressed": "src/img/pokemon-compressed/0674Pancham.webp",
			"tiny": "src/img/tiny-pokemon/0674Pancham.webp",
			"largeShiny": "src/img/shiny-pokemon/674-Pancham.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/674-Pancham.webp",
			"home": "src/img/home-pokemon/Pancham.png"
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
			"large-compressed": "src/img/pokemon-compressed/0675Pangoro.webp",
			"tiny": "src/img/tiny-pokemon/0675Pangoro.webp",
			"largeShiny": "src/img/shiny-pokemon/675-Pangoro.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/675-Pangoro.webp",
			"home": "src/img/home-pokemon/Pangoro.png"
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
	"Furfrou": {
		name: "Furfrou",
		number: "676",
		weight: {
			pounds: 61.5,
			kilograms: 28.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0676Furfrou.png",
			"large-compressed": "src/img/pokemon-compressed/0676Furfrou.webp",
			"tiny": "src/img/tiny-pokemon/0676Furfrou.webp",
			"largeShiny": "src/img/shiny-pokemon/676-Furfrou.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/676-Furfrou.webp",
			"home": "src/img/home-pokemon/Furfrou.png"
		},
		sounds: {
			"cry": "src/audio/cries/furfrou.mp3"
		},
		hasForms: true,
		defaultForm: "Natural",
		forms: {
			"Natural": {
				id: "Natural",
				imageSources: {
					"large": "src/img/pokemon/0676Furfrou.png",
					"large-compressed": "src/img/pokemon-compressed/0676Furfrou.webp",
					"tiny": "src/img/tiny-pokemon/0676Furfrou.webp",
					"largeShiny": "src/img/shiny-pokemon/676-Furfrou.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/676-Furfrou.webp",
					"home": "src/img/home-pokemon/Furfrou.png"
				},
			},
			"Diamond": {
				id: "Diamond",
				imageSources: {
					"large": "src/img/pokemon/0676Furfrou-Diamond.png",
					"large-compressed": "src/img/pokemon-compressed/0676Furfrou-Diamond.webp",
					"tiny": "src/img/tiny-pokemon/0676Furfrou-Diamond.webp",
					"largeShiny": "src/img/shiny-pokemon/676-Furfrou.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/676-Furfrou.webp",
					"home": "src/img/home-pokemon/Furfrou-Diamond.png"
				},
			},
			"Heart": {
				id: "Heart",
				imageSources: {
					"large": "src/img/pokemon/0676Furfrou-Heart.png",
					"large-compressed": "src/img/pokemon-compressed/0676Furfrou-Heart.webp",
					"tiny": "src/img/tiny-pokemon/0676Furfrou-Heart.webp",
					"largeShiny": "src/img/shiny-pokemon/676-Furfrou.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/676-Furfrou.webp",
					"home": "src/img/home-pokemon/Furfrou-Heart.png"
				},
			},
			"Star": {
				id: "Star",
				imageSources: {
					"large": "src/img/pokemon/0676Furfrou-Star.png",
					"large-compressed": "src/img/pokemon-compressed/0676Furfrou-Star.webp",
					"tiny": "src/img/tiny-pokemon/0676Furfrou-Star.webp",
					"largeShiny": "src/img/shiny-pokemon/676-Furfrou.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/676-Furfrou.webp",
					"home": "src/img/home-pokemon/Furfrou-Star.png"
				},
			},
		},
		types: [],
		tags: [],
		abilities: ["Fur Coat"],
		hiddenAbilities: [],
		stats: {
			hp: 75,
			attack: 80,
			defense: 60,
			specialAttack: 65,
			specialDefense: 90,
			speed: 102
		},
		expYield: 165,
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
			orange: 2,
			yellow: 1,
			green: 1,
			blue: 1
		},
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 5 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 9 } },
			{ name: "Headbutt", unlock: { type: "level", amount: 12 } },
			{ name: "Tail Whip", unlock: { type: "level", amount: 15 } },
			{ name: "Bite", unlock: { type: "level", amount: 22 } },
		]
	},
	"Espurr": {
		name: "Espurr",
		number: "677",
		weight: {
			pounds: 7.7,
			kilograms: 3.5
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0677Espurr.png",
			"large-compressed": "src/img/pokemon-compressed/0677Espurr.webp",
			"tiny": "src/img/tiny-pokemon/0677Espurr.webp",
			"largeShiny": "src/img/shiny-pokemon/677-Espurr.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/677-Espurr.webp",
			"home": "src/img/home-pokemon/Espurr.png"
		},
		sounds: {
			"cry": "src/audio/cries/espurr.mp3"
		},
		types: ["Psychic"],
		tags: [],
		abilities: ["Keen Eye", "Infiltrator"],
		hiddenAbilities: ["Own Tempo"],
		stats: {
			hp: 62,
			attack: 48,
			defense: 54,
			specialAttack: 63,
			specialDefense: 60,
			speed: 68
		},
		expYield: 71,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 1
		},
		energyMastery: {
			purple: 4,
			green: 1
		},
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Fake Out", unlock: { type: "level", amount: 3 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 6 } },
			{ name: "Confusion", unlock: { type: "level", amount: 9 } },
			{ name: "Covet", unlock: { type: "level", amount: 18 } },
			{ name: "Psybeam", unlock: { type: "level", amount: 21 } },
			{ name: "Light Screen", unlock: { type: "level", amount: 30 } },
			{ name: "Reflect", unlock: { type: "level", amount: 30 } },
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
			"large-compressed": "src/img/pokemon-compressed/0703Carbink.webp",
			"tiny": "src/img/tiny-pokemon/0703Carbink.webp",
			"largeShiny": "src/img/shiny-pokemon/703-Carbink.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/703-Carbink.webp",
			"home": "src/img/home-pokemon/Carbink.png"
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
			"large-compressed": "src/img/pokemon-compressed/0714Noibat.webp",
			"tiny": "src/img/tiny-pokemon/0714Noibat.webp",
			"largeShiny": "src/img/shiny-pokemon/714-Noibat.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/714-Noibat.webp",
			"home": "src/img/home-pokemon/Noibat.png"
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
			"large-compressed": "src/img/pokemon-compressed/0722Rowlet.webp",
			"tiny": "src/img/tiny-pokemon/0722Rowlet.webp",
			"largeShiny": "src/img/shiny-pokemon/722-Rowlet.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/722-Rowlet.webp",
			"home": "src/img/home-pokemon/Rowlet.png"
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
			"large-compressed": "src/img/pokemon-compressed/0723Dartrix.webp",
			"tiny": "src/img/tiny-pokemon/0723Dartrix.webp",
			"largeShiny": "src/img/shiny-pokemon/723-Dartrix.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/723-Dartrix.webp",
			"home": "src/img/home-pokemon/Dartrix.png"
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
			"large-compressed": "src/img/pokemon-compressed/0725Litten.webp",
			"tiny": "src/img/tiny-pokemon/0725Litten.webp",
			"largeShiny": "src/img/shiny-pokemon/725-Litten.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/725-Litten.webp",
			"home": "src/img/home-pokemon/Litten.png"
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
			"large-compressed": "src/img/pokemon-compressed/0726Torracat.webp",
			"tiny": "src/img/tiny-pokemon/0726Torracat.webp",
			"largeShiny": "src/img/shiny-pokemon/726-Torracat.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/726-Torracat.webp",
			"home": "src/img/home-pokemon/Torracat.png"
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
			"large-compressed": "src/img/pokemon-compressed/0728Popplio.webp",
			"tiny": "src/img/tiny-pokemon/0728Popplio.webp",
			"largeShiny": "src/img/shiny-pokemon/728-Popplio.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/728-Popplio.webp",
			"home": "src/img/home-pokemon/Popplio.png"
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
			"large-compressed": "src/img/pokemon-compressed/0729Brionne.webp",
			"tiny": "src/img/tiny-pokemon/0729Brionne.webp",
			"largeShiny": "src/img/shiny-pokemon/729-Brionne.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/729-Brionne.webp",
			"home": "src/img/home-pokemon/Brionne.png"
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
			{ name: "Outrage", unlock: { type: "level", amount: 1 } },
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
			"large-compressed": "src/img/pokemon-compressed/0731Pikipek.webp",
			"tiny": "src/img/tiny-pokemon/0731Pikipek.webp",
			"largeShiny": "src/img/shiny-pokemon/731-Pikipek.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/731-Pikipek.webp",
			"home": "src/img/home-pokemon/Pikipek.png"
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
			"large-compressed": "src/img/pokemon-compressed/0732Trumbeak.webp",
			"tiny": "src/img/tiny-pokemon/0732Trumbeak.webp",
			"largeShiny": "src/img/shiny-pokemon/732-Trumbeak.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/732-Trumbeak.webp",
			"home": "src/img/home-pokemon/Trumbeak.png"
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
			"large-compressed": "src/img/pokemon-compressed/0733Toucannon.webp",
			"tiny": "src/img/tiny-pokemon/0733Toucannon.webp",
			"largeShiny": "src/img/shiny-pokemon/733-Toucannon.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/733-Toucannon.webp",
			"home": "src/img/home-pokemon/Toucannon.png"
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
			"large-compressed": "src/img/pokemon-compressed/0734Yungoos.webp",
			"tiny": "src/img/tiny-pokemon/0734Yungoos.webp",
			"largeShiny": "src/img/shiny-pokemon/734-Yungoos.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/734-Yungoos.webp",
			"home": "src/img/home-pokemon/Yungoos.png"
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
			"large-compressed": "src/img/pokemon-compressed/0735Gumshoos.webp",
			"tiny": "src/img/tiny-pokemon/0735Gumshoos.webp",
			"largeShiny": "src/img/shiny-pokemon/735-Gumshoos.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/735-Gumshoos.webp",
			"home": "src/img/home-pokemon/Gumshoos.png"
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
			"large-compressed": "src/img/pokemon-compressed/0736Grubbin.webp",
			"tiny": "src/img/tiny-pokemon/0736Grubbin.webp",
			"largeShiny": "src/img/shiny-pokemon/736-Grubbin.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/736-Grubbin.webp",
			"home": "src/img/home-pokemon/Grubbin.png"
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
			"large-compressed": "src/img/pokemon-compressed/0737Charjabug.webp",
			"tiny": "src/img/tiny-pokemon/0737Charjabug.webp",
			"largeShiny": "src/img/shiny-pokemon/737-Charjabug.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/737-Charjabug.webp",
			"home": "src/img/home-pokemon/Charjabug.png"
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
			"large-compressed": "src/img/pokemon-compressed/0738Vikavolt.webp",
			"tiny": "src/img/tiny-pokemon/0738Vikavolt.webp",
			"largeShiny": "src/img/shiny-pokemon/738-Vikavolt.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/738-Vikavolt.webp",
			"home": "src/img/home-pokemon/Vikavolt.png"
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
			"large-compressed": "src/img/pokemon-compressed/0739Crabrawler.webp",
			"tiny": "src/img/tiny-pokemon/0739Crabrawler.webp",
			"largeShiny": "src/img/shiny-pokemon/739-Crabrawler.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/739-Crabrawler.webp",
			"home": "src/img/home-pokemon/Crabrawler.png"
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
			"large-compressed": "src/img/pokemon-compressed/0741Oricorio.webp",
			"tiny": "src/img/tiny-pokemon/0741Oricorio.webp",
			"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Baile.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/741-Oricorio-Baile.webp",
			"home": "src/img/home-pokemon/Oricorio-Baile.png"
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
					"large-compressed": "src/img/pokemon-compressed/0741Oricorio.webp",
					"tiny": "src/img/tiny-pokemon/0741Oricorio.webp",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Baile.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/741-Oricorio-Baile.webp",
					"home": "src/img/home-pokemon/Oricorio-Baile.png"
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
					"large-compressed": "src/img/pokemon-compressed/0741Oricorio-Pom-Pom.webp",
					"tiny": "src/img/tiny-pokemon/0741Oricorio-Pom-Pom.webp",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Pom-Pom.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/741-Oricorio-Pom-Pom.webp",
					"home": "src/img/home-pokemon/Oricorio-Pom-Pom.png"
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
					"large-compressed": "src/img/pokemon-compressed/0741Oricorio-Pa'u.webp",
					"tiny": "src/img/tiny-pokemon/0741Oricorio-Pa'u.webp",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Pa-u.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/741-Oricorio-Pa-u.webp",
					"home": "src/img/home-pokemon/Oricorio-Pa-u.png"
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
					"large-compressed": "src/img/pokemon-compressed/0741Oricorio-Sensu.webp",
					"tiny": "src/img/tiny-pokemon/0741Oricorio-Sensu.webp",
					"largeShiny": "src/img/shiny-pokemon/741-Oricorio-Sensu.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/741-Oricorio-Sensu.webp",
					"home": "src/img/home-pokemon/Oricorio-Sensu.png"
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
			"large-compressed": "src/img/pokemon-compressed/0742Cutiefly.webp",
			"tiny": "src/img/tiny-pokemon/0742Cutiefly.webp",
			"largeShiny": "src/img/shiny-pokemon/742-Cutiefly.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/742-Cutiefly.webp",
			"home": "src/img/home-pokemon/Cutiefly.png"
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
			"large-compressed": "src/img/pokemon-compressed/0743Ribombee.webp",
			"tiny": "src/img/tiny-pokemon/0743Ribombee.webp",
			"largeShiny": "src/img/shiny-pokemon/742-Cutiefly.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/742-Cutiefly.webp",
			"home": "src/img/home-pokemon/Ribombee.png"
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
			"large-compressed": "src/img/pokemon-compressed/0744Rockruff.webp",
			"tiny": "src/img/tiny-pokemon/0744Rockruff.webp",
			"largeShiny": "src/img/shiny-pokemon/744-Rockruff.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/744-Rockruff.webp",
			"home": "src/img/home-pokemon/Rockruff.png"
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
			"large-compressed": "src/img/pokemon-compressed/0745Lycanroc.webp",
			"tiny": "src/img/tiny-pokemon/0745Lycanroc.webp",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Midday.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/745-Lycanroc-Midday.webp",
			"home": "src/img/home-pokemon/Lycanroc-Midday.png"
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
			"large-compressed": "src/img/pokemon-compressed/0745Lycanroc-Midnight.webp",
			"tiny": "src/img/tiny-pokemon/0745Lycanroc-Midnight.webp",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Midnight.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/745-Lycanroc-Midnight.webp",
			"home": "src/img/home-pokemon/Lycanroc-Midnight.png"
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
			"large-compressed": "src/img/pokemon-compressed/0745Lycanroc-Dusk.webp",
			"tiny": "src/img/tiny-pokemon/0745Lycanroc-Dusk.webp",
			"largeShiny": "src/img/shiny-pokemon/745-Lycanroc-Dusk.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/745-Lycanroc-Dusk.webp",
			"home": "src/img/home-pokemon/Lycanroc-Dusk.png"
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
			"large-compressed": "src/img/pokemon-compressed/0746Wishiwashi.webp",
			"tiny": "src/img/tiny-pokemon/0746Wishiwashi.webp",
			"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/746-Wishiwashi.webp",
			"home": "src/img/home-pokemon/Wishiwashi.png"
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
					"large-compressed": "src/img/pokemon-compressed/0746Wishiwashi.webp",
					"tiny": "src/img/tiny-pokemon/0746Wishiwashi.webp",
					"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/746-Wishiwashi.webp",
					"home": "src/img/home-pokemon/Wishiwashi.png"
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
					"large-compressed": "src/img/pokemon-compressed/0746Wishiwashi-School.webp",
					"tiny": "src/img/tiny-pokemon/0746Wishiwashi-School.webp",
					"largeShiny": "src/img/shiny-pokemon/746-Wishiwashi-School.png",
					"largeShiny-compressed": "src/img/shiny-pokemon-compressed/746-Wishiwashi-School.webp",
					"home": "src/img/home-pokemon/Wishiwashi-School.png"
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
	"Mareanie": {
		name: "Mareanie",
		number: "747",
		weight: {
			pounds: 17.6,
			kilograms: 8.0
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0747Mareanie.png",
			"large-compressed": "src/img/pokemon-compressed/0747Mareanie.webp",
			"tiny": "src/img/tiny-pokemon/0747Mareanie.webp",
			"largeShiny": "src/img/shiny-pokemon/747-Mareanie.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/747-Mareanie.webp",
			"home": "src/img/home-pokemon/Mareanie.png"
		},
		sounds: {
			"cry": "src/audio/cries/mareanie.mp3"
		},
		tags: [],
		types: ["Poison", "Water"],
		abilities: ["Merciless", "Limber"],
		hiddenAbilities: ["Regenerator"],
		stats: {
			hp: 50,
			attack: 53,
			defense: 62,
			specialAttack: 43,
			specialDefense: 52,
			speed: 45
		},
		expYield: 61,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 1,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			blue: 2,
			purple: 3
		},
		// evolutions: [
		// 	{ name: "Mudsdale", unlock: { type: "level", amount: 30 } }
		// ],
		learnset: [
			{ name: "Poison Sting", unlock: { type: "level", amount: 1 } },
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Wide Guard", unlock: { type: "level", amount: 5 } },
			{ name: "Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Venoshock", unlock: { type: "level", amount: 15 } },
			{ name: "Recover", unlock: { type: "level", amount: 20 } },
			// { name: "Pin Missile", unlock: { type: "level", amount: 25 } },
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
			"large-compressed": "src/img/pokemon-compressed/0749Mudbray.webp",
			"tiny": "src/img/tiny-pokemon/0749Mudbray.webp",
			"largeShiny": "src/img/shiny-pokemon/749-Mudbray.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/749-Mudbray.webp",
			"home": "src/img/home-pokemon/Mudbray.png"
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
			"large-compressed": "src/img/pokemon-compressed/0750Mudsdale.webp",
			"tiny": "src/img/tiny-pokemon/0750Mudsdale.webp",
			"largeShiny": "src/img/shiny-pokemon/750-Mudsdale.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/750-Mudsdale.webp",
			"home": "src/img/home-pokemon/Mudsdale.png"
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
			"large-compressed": "src/img/pokemon-compressed/0751Dewpider.webp",
			"tiny": "src/img/tiny-pokemon/0751Dewpider.webp",
			"largeShiny": "src/img/shiny-pokemon/751-Dewpider.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/751-Dewpider.webp",
			"home": "src/img/home-pokemon/Dewpider.png"
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
		evolutions: [
			{ name: "Araquanid", unlock: { type: "level", amount: 22 } }
		],
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
			"large-compressed": "src/img/pokemon-compressed/0752Araquanid.webp",
			"tiny": "src/img/tiny-pokemon/0752Araquanid.webp",
			"largeShiny": "src/img/shiny-pokemon/752-Araquanid.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/752-Araquanid.webp",
			"home": "src/img/home-pokemon/Araquanid.png"
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
			"large-compressed": "src/img/pokemon-compressed/0753Fomantis.webp",
			"tiny": "src/img/tiny-pokemon/0753Fomantis.webp",
			"largeShiny": "src/img/shiny-pokemon/753-Fomantis.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/753-Fomantis.webp",
			"home": "src/img/home-pokemon/Fomantis.png"
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
		// evolutions: [
		// 	{ name: "Lurantis", unlock: { type: "level", amount: 34 } }
		// ],
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
			"large-compressed": "src/img/pokemon-compressed/0755Morelull.webp",
			"tiny": "src/img/tiny-pokemon/0755Morelull.webp",
			"largeShiny": "src/img/shiny-pokemon/755-Morelull.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/755-Morelull.webp",
			"home": "src/img/home-pokemon/Morelull.png"
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
	"Salandit": {
		name: "Salandit",
		number: "757",
		weight: {
			pounds: 10.6,
			kilograms: 4.8
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0757Salandit.png",
			"large-compressed": "src/img/pokemon-compressed/0757Salandit.webp",
			"tiny": "src/img/tiny-pokemon/0757Salandit.webp",
			"largeShiny": "src/img/shiny-pokemon/757-Salandit.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/757-Salandit.webp",
			"home": "src/img/home-pokemon/Salandit.png"
		},
		sounds: {
			"cry": "src/audio/cries/salandit.mp3"
		},
		tags: [],
		types: ["Poison", "Fire"],
		abilities: ["Corrosion"],
		hiddenAbilities: ["Oblivious"],
		stats: {
			hp: 48,
			attack: 44,
			defense: 40,
			specialAttack: 71,
			specialDefense: 40,
			speed: 77
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
			red: 3,
			purple: 3
		},
		evolutions: [
			{ name: "Salazzle", unlock: { type: "level", amount: 33 } }
		],
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Gas", unlock: { type: "level", amount: 1 } },
			{ name: "Smog", unlock: { type: "level", amount: 5 } },
			{ name: "Ember", unlock: { type: "level", amount: 10 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 15 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 20 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 25 } },
		]
	},
	"Salazzle": {
		name: "Salazzle",
		number: "758",
		weight: {
			pounds: 49.8,
			kilograms: 22.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0758Salazzle.png",
			"large-compressed": "src/img/pokemon-compressed/0758Salazzle.webp",
			"tiny": "src/img/tiny-pokemon/0758Salazzle.webp",
			"largeShiny": "src/img/shiny-pokemon/758-Salazzle.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/758-Salazzle.webp",
			"home": "src/img/home-pokemon/Salazzle.png"
		},
		sounds: {
			"cry": "src/audio/cries/salazzle.mp3"
		},
		tags: [],
		types: ["Poison", "Fire"],
		abilities: ["Corrosion"],
		hiddenAbilities: ["Oblivious"],
		stats: {
			hp: 68,
			attack: 64,
			defense: 60,
			specialAttack: 111,
			specialDefense: 60,
			speed: 117
		},
		expYield: 64,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 2
		},
		energyMastery: {
			orange: 1,
			red: 4,
			purple: 5
		},
		learnset: [
			{ name: "Knock Off", unlock: { type: "level", amount: 1 } },
			{ name: "Encore", unlock: { type: "level", amount: 1 } },
			{ name: "Torment", unlock: { type: "level", amount: 1 } },
			{ name: "Swagger", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 1 } },
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Endeavor", unlock: { type: "level", amount: 1 } },
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Gas", unlock: { type: "level", amount: 1 } },
			{ name: "Smog", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Fire Lash", unlock: { type: "level", amount: 1 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 15 } },
			{ name: "Sweet Scent", unlock: { type: "level", amount: 20 } },
			{ name: "Nasty Plot", unlock: { type: "level", amount: 25 } },
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
			"large-compressed": "src/img/pokemon-compressed/0759Stufful.webp",
			"tiny": "src/img/tiny-pokemon/0759Stufful.webp",
			"largeShiny": "src/img/shiny-pokemon/759-Stufful.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/759-Stufful.webp",
			"home": "src/img/home-pokemon/Stufful.png"
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
			"large-compressed": "src/img/pokemon-compressed/0761Bounsweet.webp",
			"tiny": "src/img/tiny-pokemon/0761Bounsweet.webp",
			"largeShiny": "src/img/shiny-pokemon/761-Bounsweet.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/761-Bounsweet.webp",
			"home": "src/img/home-pokemon/Bounsweet.png"
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
			"large-compressed": "src/img/pokemon-compressed/0762Steenee.webp",
			"tiny": "src/img/tiny-pokemon/0762Steenee.webp",
			"largeShiny": "src/img/shiny-pokemon/762-Steenee.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/762-Steenee.webp",
			"home": "src/img/home-pokemon/Steenee.png"
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
			"large-compressed": "src/img/pokemon-compressed/0764Comfey.webp",
			"tiny": "src/img/tiny-pokemon/0764Comfey.webp",
			"largeShiny": "src/img/shiny-pokemon/764-Comfey.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/764-Comfey.webp",
			"home": "src/img/home-pokemon/Comfey.png"
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
			"large-compressed": "src/img/pokemon-compressed/0766Passimian.webp",
			"tiny": "src/img/tiny-pokemon/0766Passimian.webp",
			"largeShiny": "src/img/shiny-pokemon/766-Passimian.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/766-Passimian.webp",
			"home": "src/img/home-pokemon/Passimian.png"
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
	"Togedemaru": {
		name: "Togedemaru",
		number: "777",
		weight: {
			pounds: 7.3,
			kilograms: 3.3
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0777Togedemaru.png",
			"large-compressed": "src/img/pokemon-compressed/0777Togedemaru.webp",
			"tiny": "src/img/tiny-pokemon/0777Togedemaru.webp",
			"largeShiny": "src/img/shiny-pokemon/777-Togedemaru.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/777-Togedemaru.webp",
			"home": "src/img/home-pokemon/Togedemaru.png"
		},
		sounds: {
			"cry": "src/audio/cries/togedemaru.mp3"
		},
		tags: [],
		types: ["Electric", "Steel"],
		abilities: ["Iron Barbs", "Lightning Rod"],
		hiddenAbilities: ["Sturdy"],
		stats: {
			hp: 65,
			attack: 98,
			defense: 63,
			specialAttack: 40,
			specialDefense: 73,
			speed: 96
		},
		expYield: 152,
		evYield: {
			hp: 0,
			attack: 2,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			yellow: 6,
			green: 2,
			orange: 1
		},
		learnset: [
			{ name: "Nuzzle", unlock: { type: "level", amount: 1 } },
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Defense Curl", unlock: { type: "level", amount: 5 } },
			{ name: "Charge", unlock: { type: "level", amount: 10 } },
			{ name: "Thunder Shock", unlock: { type: "level", amount: 15 } },
			{ name: "Fell Stinger", unlock: { type: "level", amount: 20 } },
			{ name: "Spark", unlock: { type: "level", amount: 25 } },
		]
	},
	"Pyukumuku": {
		name: "Pyukumuku",
		number: "771",
		weight: {
			pounds: 2.6,
			kilograms: 1.2
		},
		imageFacing: "left",
		imageSources: {
			"large": "src/img/pokemon/0771Pyukumuku.png",
			"large-compressed": "src/img/pokemon-compressed/0771Pyukumuku.webp",
			"tiny": "src/img/tiny-pokemon/0771Pyukumuku.webp",
			"largeShiny": "src/img/shiny-pokemon/771-Pyukumuku.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/771-Pyukumuku.webp",
			"home": "src/img/home-pokemon/Pyukumuku.png"
		},
		sounds: {
			"cry": "src/audio/cries/pyukumuku.mp3"
		},
		tags: [],
		types: ["Water"],
		abilities: ["Innards Out"],
		hiddenAbilities: ["Unaware"],
		stats: {
			hp: 55,
			attack: 60,
			defense: 130,
			specialAttack: 30,
			specialDefense: 130,
			speed: 5
		},
		expYield: 144,
		evYield: {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 2,
			speed: 0
		},
		energyMastery: {
			orange: 2,
			blue: 3,
			purple: 4
		},
		learnset: [
			{ name: "Baton Pass", unlock: { type: "level", amount: 1 } },
			{ name: "Harden", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 5 } },
			{ name: "Taunt", unlock: { type: "level", amount: 10 } },
			{ name: "Safeguard", unlock: { type: "level", amount: 15 } },
			{ name: "Counter", unlock: { type: "level", amount: 20 } },
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
			"large-compressed": "src/img/pokemon-compressed/0772Type_Null.webp",
			"tiny": "src/img/tiny-pokemon/0772Type_Null.webp",
			"largeShiny": "src/img/shiny-pokemon/772-Type_Null.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/772-Type_Null.webp",
			"home": "src/img/home-pokemon/Type Null.png"
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
			"large-compressed": "src/img/pokemon-compressed/0775Komala.webp",
			"tiny": "src/img/tiny-pokemon/0775Komala.webp",
			"largeShiny": "src/img/shiny-pokemon/775-Komala.png",
			"largeShiny-compressed": "src/img/shiny-pokemon-compressed/775-Komala.webp",
			"home": "src/img/home-pokemon/Komala.png"
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
	if (!pokemon.preEvolutions) {
		pokemon.preEvolutions = []
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
for (let name in pokemonData){
	let pData = pokemonData[name]
	for (let eData of pData.evolutions){
		let toPId = eData.name
		let toPData = pokemonData[toPId]
		if (!toPData){
			console.error(pData,"has an evolution that doesn't exist")
		}
		let preEvolutions = toPData.preEvolutions
		if (!(preEvolutions.includes(name))){
			preEvolutions.push(name)
		}
	}
}