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
			cry: "src/audio/cries/caterpie.mp3"
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
			cry: "src/audio/cries/metapod.mp3"
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
			cry: "src/audio/cries/butterfree.mp3"
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
			cry: "src/audio/cries/raticate.mp3"
		},
		types: ["Dark", "Normal"],
		tags: [],
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
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
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
			cry: "src/audio/cries/spearow.mp3"
		},
		types: ["Normal", "Flying"],
		tags: [],
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
			yellow: 5,
			orange: 2
		},
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 4 } },
			{ name: "Assurance", unlock: { type: "level", amount: 8 } },
			{ name: "Fury Attack", unlock: { type: "level", amount: 11 } },
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
			cry: "src/audio/cries/pikachu.mp3"
		},
		types: ["Electric"],
		tags: [],
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
			yellow: 5,
			orange: 3,
			purple: 2
		},
		learnset: [
			{
				name: "Play Nice",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Sweet Kiss",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Nuzzle",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Nasty Plot",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Charm",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Thunder Shock",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Tail Whip",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Growl",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Quick Attack",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Thunder Wave",
				unlock: { type: "level", amount: 4 }
			},
			{
				name: "Double Team",
				unlock: { type: "level", amount: 1 }
			},
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
			cry: "src/audio/cries/zubat.mp3"
		},
		types: ["Poison", "Flying"],
		tags: [],
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
			purple: 2
		},
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Supersonic", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 5 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 10 } },
			{ name: "Poison Fang", unlock: { type: "level", amount: 15 } },
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
			cry: "src/audio/cries/meowth.mp3"
		},
		types: ["Dark"],
		tags: [],
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
		learnset: [
			{ name: "Fake Out", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Feint", unlock: { type: "level", amount: 4 } },
			{ name: "Scratch", unlock: { type: "level", amount: 8 } },
			{ name: "Pay Day", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 16 } },
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
			cry: "src/audio/cries/mankey.mp3"
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
			{ name: "Seismic Toss", unlock: { type: "level", amount: 12 } },
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
			cry: "src/audio/cries/growlithe.mp3"
		},
		types: ["Fire"],
		tags: [],
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
		learnset: [
			{ name: "Ember", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 1 } },
			{ name: "Howl", unlock: { type: "level", amount: 4 } },
			{ name: "Bite", unlock: { type: "level", amount: 8 } },
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
			cry: "src/audio/cries/abra.mp3"
		},
		types: ["Psychic"],
		tags: [],
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
			purple: 7
		},
		learnset: [
			{
				name: "Teleport",
				unlock: {
					type: "level",
					amount: 1
				}
			}
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
			cry: "src/audio/cries/magnemite.mp3"
		},
		types: ["Electric", "Steel"],
		tags: [],
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
					amount: 8
				}
			},
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
			cry: "src/audio/cries/grimer.mp3"
		},
		types: ["Poison", "Dark"],
		tags: [],
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
			{
				name: "Pound",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Poison Gas",
				unlock: {
					type: "level",
					amount: 1
				}
			},
			{
				name: "Harden",
				unlock: {
					type: "level",
					amount: 4
				}
			},
			{
				name: "Bite",
				unlock: {
					type: "level",
					amount: 7
				}
			},
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
			cry: "src/audio/cries/gastly.mp3"
		},
		types: ["Ghost", "Poison"],
		tags: [],
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
		learnset: [
			{ name: "Lick", unlock: { type: "level", amount: 1 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 4 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 8 } },
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
			cry: "src/audio/cries/grimer.mp3"
		},
		types: ["Psychic"],
		tags: [],
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
			specialAttack: 1,
			specialDefense: 0,
			speed: 0
		},
		energyMastery: {
			purple: 6
		},
		learnset: [
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Hypnosis", unlock: { type: "level", amount: 1 } },
			{ name: "Disable", unlock: { type: "level", amount: 5 } },
			{ name: "Confusion", unlock: { type: "level", amount: 9 } },
			{ name: "Bide", unlock: { type: "level", amount: 1 } },
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
		evolutions: [
			{
				name: "Pikachu",
				unlock: {
					type: "level",
					amount: 15
				}
			}
		],
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
			cry: "src/audio/cries/murkrow.mp3"
		},
		types: ["Dark", "Flying"],
		tags: [],
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
			
		],
		learnset: [
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 5 } },
			{ name: "Haze", unlock: { type: "level", amount: 11 } },
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
			cry: "src/audio/cries/misdreavus.mp3"
		},
		types: ["Ghost"],
		tags: [],
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
			
		],
		learnset: [
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Confusion", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 10 } },
			{ name: "Confuse Ray", unlock: { type: "level", amount: 14 } },
			{ name: "Mean Look", unlock: { type: "level", amount: 19 } },
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
			cry: "src/audio/cries/delibird.mp3"
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
			cry: "src/audio/cries/smeargle.mp3"
		},
		types: ["Normal"],
		tags: [],
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
			cry: "src/audio/cries/makuhita.mp3"
		},
		types: ["Fighting"],
		tags: [],
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
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 1 } },
			{ name: "Sand Attack", unlock: { type: "level", amount: 4 } },
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
			cry: "src/audio/cries/drifloon.mp3"
		},
		types: ["Ghost", "Flying"],
		tags: [],
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
		learnset: [
			{ name: "Minimize", unlock: { type: "level", amount: 1 } },
			{ name: "Astonish", unlock: { type: "level", amount: 1 } },
			{ name: "Gust", unlock: { type: "level", amount: 4 } },
			{ name: "Focus Energy", unlock: { type: "level", amount: 8 } },
			{ name: "Payback", unlock: { type: "level", amount: 12 } },
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
			cry: "src/audio/cries/bonsly.mp3"
		},
		types: ["Rock"],
		tags: [],
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
			cry: "src/audio/cries/happiny.mp3"
		},
		types: ["Normal"],
		tags: [],
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
		learnset: [
			{
				name: "Pound",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Copycat",
				unlock: { type: "level", amount: 1 }
			},
			{
				name: "Defense Curl",
				unlock: { type: "level", amount: 4 }
			},
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
			cry: "src/audio/cries/cottonee.mp3"
		},
		types: ["Grass", "Fairy"],
		tags: [],
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
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
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
			cry: "src/audio/cries/petilil.mp3"
		},
		types: ["Grass"],
		tags: ["Starter"],
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
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Growth", unlock: { type: "level", amount: 1 } },
			{ name: "Helping Hand", unlock: { type: "level", amount: 3 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
			{ name: "Mega Drain", unlock: { type: "level", amount: 9 } },
			{ name: "Charm", unlock: { type: "level", amount: 12 } },
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
			"home": "src/img/tiny-pokemon/0627Rufflet.png"
		},
		sounds: {
			cry: "src/audio/cries/rufflet.mp3"
		},
		types: ["Normal", "Flying"],
		tags: ["Starter"],
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
			{ name: "Wing Attack", unlock: { type: "level", amount: 1 } },
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
			cry: "src/audio/cries/rowlet.mp3"
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
			cry: "src/audio/cries/litten.mp3"
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
		learnset: [
			{ name: "Scratch", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Ember", unlock: { type: "level", amount: 3 } },
			{ name: "Lick", unlock: { type: "level", amount: 6 } },
			{ name: "Roar", unlock: { type: "level", amount: 9 } },
			{ name: "Fury Swipes", unlock: { type: "level", amount: 12 } },
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
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
			{ name: "Pound", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 1 } },
			{ name: "Water Gun", unlock: { type: "level", amount: 3 } },
			{ name: "Disarming Voice", unlock: { type: "level", amount: 6 } },
			{ name: "Aqua Jet", unlock: { type: "level", amount: 9 } },
			{ name: "Baby-Doll Eyes", unlock: { type: "level", amount: 12 } },
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
			cry: "src/audio/cries/pikipek.mp3"
		},
		tags: [],
		types: ["Normal", "Flying"],
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
			{ name: "Peck", unlock: { type: "level", amount: 1 } },
			{ name: "Growl", unlock: { type: "level", amount: 3 } },
			{ name: "Echoed Voice", unlock: { type: "level", amount: 7 } },
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
		evolutions: [
			{ name: "Gumshoos", unlock: { type: "level", amount: 20 } }
		],
		learnset: [
			{ name: "Tackle", unlock: { type: "level", amount: 1 } },
			{ name: "Leer", unlock: { type: "level", amount: 3 } },
			{ name: "Payback", unlock: { type: "level", amount: 7 } },
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
			cry: "src/audio/cries/gumshoos.mp3"
		},
		tags: [],
		types: ["Normal"],
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
		evolutions: [
			{
				name: "Charjabug",
				unlock: {
					type: "level",
					amount: 20
				}
			}
		],
		learnset: [
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 5 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 10 } },
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
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
			cry: "src/audio/cries/charjabug.mp3"
		},
		tags: [],
		types: ["Bug", "Electric"],
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
		learnset: [
			{ name: "Vise Grip", unlock: { type: "level", amount: 1 } },
			{ name: "Mud-Slap", unlock: { type: "level", amount: 1 } },
			{ name: "String Shot", unlock: { type: "level", amount: 1 } },
			{ name: "Bug Bite", unlock: { type: "level", amount: 1 } },
			{ name: "Charge", unlock: { type: "level", amount: 1 } }, //NOTE: Should be learned upon evolution.
			{ name: "Bite", unlock: { type: "level", amount: 15 } },
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
			cry: "src/audio/cries/crabrawler.mp3"
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
			cry: "src/audio/cries/cutiefly.mp3"
		},
		tags: [],
		types: ["Bug", "Fairy"],
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
		learnset: [
			{ name: "Absorb", unlock: { type: "level", amount: 1 } },
			{ name: "Fairy Wind", unlock: { type: "level", amount: 1 } },
			{ name: "Stun Spore", unlock: { type: "level", amount: 6 } },
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
			{ name: "Wrap", unlock: { type: "level", amount: 1 } },
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
			cry: "src/audio/cries/komala.mp3"
		},
		tags: [],
		types: ["Normal"],
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
		console.warning("These pokemon share a number", same, pokemon)
	}
}