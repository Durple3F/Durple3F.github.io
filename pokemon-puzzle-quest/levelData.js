const songData = {
	"Route 201 (Day)": {
		source: "src/audio/songs/route201-2.mp3",
		loops: true,
	},
	"SM Trainer Battle": {
		source: "src/audio/songs/sm wild pokemon battle intro.mp3",
		loopTransition: true,
		loopSource: "src/audio/songs/sm wild pokemon battle loop.mp3"
	},
	"SM Wild Pokemon Battle": {
		source: "src/audio/songs/sm wild pokemon battle.mp3",
		loops: true,
	},
	"SM Trainers' School": {
		source: "src/audio/songs/trainer school.mp3",
		loops: true,
	},
	"Team Skull Appears!": {
		source: "src/audio/songs/2-02. Team Skull Appears! intro.mp3",
		loopTransition: true,
		loopSource: "src/audio/songs/2-02. Team Skull Appears! intro.mp3"
	},
}

const boxThemeData = {
	"forest_frlg": {
		"header": "src/img/wallpapers/forest_frlg_header.png",
		"body": "src/img/wallpapers/forest_frlg.png",
		"color": "black"
	}
}

const levelCategoryData = {
	"Route 1": {
		id: "Route 1",
		startsUnlocked: true
	},
	"Route 2": {
		id: "Route 2",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 1-7"
			]
		}
	},
	"Route 3": {
		id: "Route 3",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 2-7"
			]
		}
	},
	"Route 4": {
		id: "Route 4",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 3-5"
			]
		}
	},
}

const levelData = [
	//1-1: Rival Battle 1
	{
		id: "Route 1-1",
		category: "Route 1",
		name: "Rival Battle 1",
		forgiving: true,
		icon: "1",
		recommendedLevels: {
			"normal": 5,
			"hard": 5
		},
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						id: "Popplio",
						level: 5,
						ability: "Torrent"
					}
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Rowlet",
						level: 5,
						ability: "Overgrow"
					}
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Litten",
						level: 5,
						ability: "Blaze"
					}
				]
			}
		],
		effects: [
			{ type: "dialogue", source: "rival-battle-1-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },

			{ type: "load-player-info", key: "chosen-starter", label: "easyMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Rowlet" },
			{ type: "jump", jumpTo: "Litten" },

			{ type: "load-player-info", key: "chosen-starter", label: "hardMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Litten" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "jump", jumpTo: "Rowlet" },

			{ type: "fight", trainer: 1, label: "Rowlet" },
			{ type: "jump", jumpTo: "Win Check" },
			{ type: "fight", trainer: 2, label: "Litten" },
			{ type: "jump", jumpTo: "Win Check" },
			{ type: "fight", trainer: 0, label: "Popplio" },
			{ type: "jump", jumpTo: "Win Check" },

			{ type: "jump-if-lost", jumpTo: "lost", label: "Win Check" },
			{ type: "dialogue", source: "rival-battle-1-dialogue-won" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "dialogue", source: "rival-battle-1-dialogue-lost", label: "lost" },
		]
	},
	//1-2: Caterpie, Pikipek, Pichu? | Jimmy
	{
		id: "Route 1-2",
		category: "Route 1",
		name: "Route 1-2",
		icon: "2",
		music: "SM Wild Pokemon Battle",
		recommendedLevels: {
			"normal": 5,
			"hard": 5
		},
		trainers: [
			{
				isWild: true,
				pokemon: [
					{
						id: "Pikipek",
						levelMin: 2, levelMax: 3
					},
					{
						id: "Caterpie",
						levelMin: 2, levelMax: 3
					},
				]
			},
			{
				isWild: true,
				pokemon: [
					{
						id: "Pikipek",
						levelMin: 2, levelMax: 3
					},
					{
						id: "Caterpie",
						levelMin: 2, levelMax: 3
					},
					{
						id: "Pichu",
						levelMin: 3, levelMax: 5
					},
				]
			},
			{
				name: "Jimmy",
				class: "Youngster-Gen7",
				pokemon: [
					{
						id: "Rattata-Alola",
						level: 3,
						ability: "Gluttony"
					}
				]
			},
		],
		effects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 10 },
			{ type: "jump-if-less-than", jumpTo: "Normal" },
			{ type: "fight", trainer: 1, label: "Pichu" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "Jimmy" },
			{ type: "fight", trainer: 0, label: "Normal" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "Jimmy" },
			{ type: "stop-music", label: "Jimmy" },
			{ type: "dialogue", source: "route-1-2-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 2 },
			{ type: "jump-if-lost", jumpTo: Infinity },
		]
	},
	//1-3: Spinarak, Ledyba, Grubbin? | Audrey
	{
		id: "Route 1-3",
		category: "Route 1",
		name: "Route 1-3",
		icon: "3",
		music: "SM Wild Pokemon Battle",
		recommendedLevels: {
			"normal": 6,
			"hard": 6
		},
		trainers: [
			{
				isWild: true,
				pokemon: [
					{
						id: "Spinarak",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Ledyba",
						levelMin: 3, levelMax: 4
					}
				]
			},
			{
				isWild: true,
				pokemon: [
					{
						id: "Spinarak",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Ledyba",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Grubbin",
						levelMin: 3, levelMax: 5
					},
				]
			},
			{
				name: "Audrey",
				class: "Lass-Gen7",
				pokemon: [
					{
						id: "Caterpie",
						level: 3,
						ability: "Shield Dust"
					}
				]
			},
		],
		effects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 10 },
			{ type: "jump-if-less-than", jumpTo: "Normal" },
			{ type: "fight", trainer: 1, label: "Grubbin" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "Audrey" },
			{ type: "fight", trainer: 0, label: "Normal" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "Audrey" },
			{ type: "stop-music", label: "Audrey" },
			{ type: "dialogue", source: "route-1-3-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 2 },
			{ type: "jump-if-lost", jumpTo: Infinity }
		]
	},
	//1-4: Rival Battle 2
	{
		id: "Route 1-4",
		category: "Route 1",
		name: "Rival Battle 2",
		icon: "4",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 6
				return 7
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 6
				return 7
			}
		},
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						id: "Popplio",
						level: 7,
						ability: "Torrent",
						activeMoves: ["Pound", "Water Gun", "Growl"]
					},
					{
						id: "Pichu",
						level: 6,
						ability: "Static",
						activeMoves: ["Thunder Shock", "Tail Whip", "Charm"]
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Rowlet",
						level: 7,
						ability: "Overgrow",
						activeMoves: ["Tackle", "Growl", "Leafage"]
					},
					{
						id: "Pichu",
						level: 6,
						ability: "Static",
						activeMoves: ["Thunder Shock", "Tail Whip", "Charm"]
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Litten",
						level: 7,
						ability: "Blaze",
						activeMoves: ["Scratch", "Growl", "Ember"]
					},
					{
						id: "Pichu",
						level: 6,
						ability: "Static",
						activeMoves: ["Thunder Shock", "Tail Whip", "Charm"]
					},
				]
			}
		],
		effects: [
			{ type: "dialogue", source: "rival-battle-2-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },

			{ type: "load-player-info", key: "chosen-starter", label: "easyMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Rowlet" },
			{ type: "jump", jumpTo: "Litten" },

			{ type: "load-player-info", key: "chosen-starter", label: "hardMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Litten" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "jump", jumpTo: "Rowlet" },

			{ type: "fight", trainer: 1, label: "Rowlet" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 2, label: "Litten" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 0, label: "Popplio" },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//1-5: Wingull, Yungoos, Ratatta-Alola, Slowpoke? | Kevin / Madison
	{
		id: "Route 1-5",
		category: "Route 1",
		name: "Route 1-5",
		icon: "5",
		music: "SM Wild Pokemon Battle",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 7
				return 9
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 7
				return 9
			}
		},
		trainers: [
			{
				isWild: true,
				pokemon: [
					{
						id: "Wingull",
						levelMin: 4, levelMax: 6
					},
					{
						id: "Yungoos",
						levelMin: 4, levelMax: 6
					},
					{
						id: "Rattata-Alola",
						levelMin: 4, levelMax: 6
					}
				]
			},
			{
				isWild: true,
				pokemon: [
					{
						id: "Wingull",
						levelMin: 4, levelMax: 6
					},
					{
						id: "Yungoos",
						levelMin: 4, levelMax: 6
					},
					{
						id: "Rattata-Alola",
						levelMin: 4, levelMax: 6
					},
					{
						id: "Slowpoke",
						levelMin: 6, levelMax: 7
					}
				]
			},
			{
				name: "Kevin",
				class: "Youngster-Gen7",
				pokemon: [
					{
						id: "Grubbin",
						level: 6,
						ability: "Swarm"
					}
				]
			},
			{
				name: "Madison",
				class: "Lass-Gen7",
				pokemon: [
					{
						id: "Wingull",
						name: "Gully",
						level: 6,
						ability: "Hydration"
					}
				]
			},
		],
		effects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 9 },
			{ type: "jump-if-less-than", jumpTo: "Normal" },
			{ type: "fight", trainer: 1, label: "Slowpoke" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "TrainerChoice" },
			{ type: "fight", trainer: 0, label: "Normal" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "TrainerChoice" },

			{ type: "change-music", music: "SM Trainer Battle", label: "TrainerChoice" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 3 },
			{ type: "jump-if-less-than", jumpTo: "Kevin" },
			{ type: "jump", jumpTo: "Madison" },
			{ type: "dialogue", source: "route-1-5-dialogue-1", label: "Kevin" },
			{ type: "fight", trainer: 2 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-5-dialogue-2", label: "Madison" },
			{ type: "fight", trainer: 3 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-5-dialogue-2-win" },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//1-6: Magnemite, Meowth-Alola, Grimer-Alola + Lillie Dialogue
	{
		id: "Route 1-6",
		category: "Route 1",
		name: "Route 1-6",
		icon: "6",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 8
				return 10
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 8
				return 10
			}
		},
		trainers: [
			{
				isWild: true,
				pokemon: [
					{ id: "Magnemite", levelMin: 6, levelMax: 8 },
					{ id: "Meowth-Alola", levelMin: 6, levelMax: 8 },
					{ id: "Grimer-Alola", levelMin: 6, levelMax: 8 },
				]
			},
			{
				name: "Lillie",
				pokemon: []
			}
		],
		effects: [
			{ type: "dialogue", source: "route-1-6-dialogue" },
			{ type: "change-music", music: "SM Wild Pokemon Battle" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "load-value", value: true },
			{ type: "save-player-info", key: "unlocked-pokedex", value: -1 }
		]
	},
	//1-7 Trainer school teacher's challenge
	{
		id: "Route 1-7",
		category: "Route 1",
		name: "Route 1-7",
		icon: "7",
		music: "SM Trainers' School",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 8
				return 10
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 8
				return 10
			}
		},
		trainers: [
			{
				name: "Hiromi",
				class: "Young-Athlete-F",
				pokemon: [
					{ id: "Pikipek", name: "Chirpo", level: 8, ability: "Skill Link" }
				]
			},
			{
				name: "Mia",
				class: "Preschooler-F-Gen7",
				pokemon: [
					{ id: "Bonsly", name: "Mister Wobbles", level: 7, ability: "Sturdy" }
				]
			},
			{
				name: "Joey",
				class: "Youngster-Gen7",
				pokemon: [
					{ id: "Metapod", name: "Podzilla", level: 7, ability: "Shed Skin" }
				]
			},
			{
				name: "Joseph",
				class: "Rising-Star",
				pokemon: [
					{ id: "Grimer-Alola", pokeball: "greatball", level: 8, ability: "Poison Touch" }
				]
			},
			{
				name: "Emily",
				class: "Teacher-Gen7",
				pokemon: [
					{ id: "Magnemite", name: "Tesla", level: 8, ability: "Analytic" },
					{ id: "Meowth-Alola", name: "Cleo", level: 9, ability: "Technician" }
				]
			},
		],
		effects: [
			{ type: "dialogue", source: "route-1-7-dialogue-1" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-7-dialogue-2" },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-7-dialogue-3" },
			{ type: "fight", trainer: 2 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-7-dialogue-4" },
			{ type: "fight", trainer: 3 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-7-dialogue-5" },
			{ type: "fight", trainer: 4 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-1-7-dialogue-6" },
		]
	},

	//2-1: Abra, Pikachu, Happiny, + others
	{
		id: "Route 2-1",
		category: "Route 2",
		name: "Route 2-1",
		music: "SM Wild Pokemon Battle",
		icon: "1",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 9
				return 12
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 9
				return 12
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 5,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Abra", levelMin: 6, levelMax: 8, weight: 4 },
					{ id: "Pichu", levelMin: 6, levelMax: 8, weight: 4 },
					{ id: "Pikachu", levelMin: 6, levelMax: 8, weight: 2 },
					{ id: "Happiny", levelMin: 6, levelMax: 8, weight: 2 },
					{ id: "Rattata-Alola", levelMin: 6, levelMax: 8, weight: 1 },
					{ id: "Meowth-Alola", levelMin: 6, levelMax: 8, weight: 1 },
					{ id: "Magnemite", levelMin: 6, levelMax: 8, weight: 1 },
					{ id: "Wingull", levelMin: 6, levelMax: 8, weight: 0.5 },
					{ id: "Yungoos", levelMin: 6, levelMax: 8, weight: 0.5 },
					{ id: "Grimer-Alola", levelMin: 6, levelMax: 8, weight: 0.5 },
				]
			}
		],
		effects: [
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
		]
	},
	//2-2: Battle with Team Skull Grunts + Ilima
	{
		id: "Route 2-2",
		category: "Route 2",
		name: "Route 2-2",
		icon: "2",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 10
				return 13
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 10
				return 13
			}
		},
		trainers: [
			{
				name: "Team Skull Grunt A",
				class: "Team-Skull-Grunt",
				pokemon: [
					{ id: "Zubat", level: 8 },
					{ id: "Meowth-Alola", level: 8 }
				]
			},
			{
				name: "Team Skull Grunt B",
				class: "Team-Skull-Grunt",
				pokemon: [
					{ id: "Grimer-Alola", level: 8 },
					{ id: "Rattata-Alola", level: 8 },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Yungoos", level: 9, name: "Reginald", pokeball: "ultraball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "Inkwell", pokeball: "ultraball", activeMoves: ["Ember", "Tackle"] },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Yungoos", level: 9, name: "Reginald", pokeball: "ultraball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "Inkwell", pokeball: "ultraball", activeMoves: ["Water Gun", "Tackle"] },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Yungoos", level: 9, name: "Reginald", pokeball: "ultraball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "Inkwell", pokeball: "ultraball", activeMoves: ["Leafage", "Tackle"] },
				]
			},
		],
		effects: [
			{ type: "dialogue", source: "route-2-2-dialogue-1" },

			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },

			{ type: "dialogue", source: "route-2-2-dialogue-2" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Fire" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Water" },
			{ type: "jump", jumpTo: "Grass" },

			{ type: "fight", trainer: 2, label: "Fire" },
			{ type: "jump", jumpTo: "Win Check" },
			{ type: "fight", trainer: 3, label: "Water" },
			{ type: "jump", jumpTo: "Win Check" },
			{ type: "fight", trainer: 4, label: "Grass" },
			{ type: "jump", jumpTo: "Win Check" },

			{ type: "jump-if-lost", jumpTo: Infinity, label: "Win Check" },
			{ type: "dialogue", source: "route-2-2-dialogue-won" },
		]
	},
	//2-3: Smeargle, Drowzee, Abra, + others | Krystal
	{
		id: "Route 2-3",
		category: "Route 2",
		name: "Route 2-3",
		music: "SM Wild Pokemon Battle",
		icon: "3",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 10
				return 13
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 10
				return 13
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Smeargle", levelMin: 7, levelMax: 10, weight: 4 },
					{ id: "Drowzee", levelMin: 7, levelMax: 10, weight: 4 },
					{ id: "Abra", levelMin: 7, levelMax: 10, weight: 3 },
					{ id: "Meowth-Alola", levelMin: 7, levelMax: 10, weight: 2 },
					{ id: "Yungoos", levelMin: 7, levelMax: 10, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 7, levelMax: 10, weight: 1 },
				]
			},
			{
				name: "Krystal",
				class: "Beauty-Gen7",
				pokemon: [
					{ id: "Gastly", level: 9, name: "Gastlé No. 3 by Krystal" }
				]
			},
		],
		effects: [
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-3-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-3-dialogue-won" },
		]
	},
	//2-4: Spearow, Growlithe, Cutiefly, Makuhita + others | Ashley
	{
		id: "Route 2-4",
		category: "Route 2",
		name: "Route 2-4",
		music: "SM Wild Pokemon Battle",
		icon: "4",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 11
				return 13
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 11
				return 13
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Spearow", levelMin: 8, levelMax: 10, weight: 4 },
					{ id: "Growlithe", levelMin: 8, levelMax: 10, weight: 4 },
					{ id: "Cutiefly", levelMin: 8, levelMax: 10, weight: 4 },
					{ id: "Makuhita", levelMin: 9, levelMax: 10, weight: 2 },
					{ id: "Smeargle", levelMin: 8, levelMax: 10, weight: 2 },
					{ id: "Yungoos", levelMin: 8, levelMax: 10, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 8, levelMax: 10, weight: 1 },
				]
			},
			{
				name: "Ashley",
				class: "Backpacker-Gen7-F",
				pokemon: [
					{ id: "Cottonee", level: 10, name: "Soozle" }
				]
			},
		],
		effects: [
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-4-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-4-dialogue-won" },
		]
	},
	//2-5: Zubat, Gastly, Misdreavus, Drifloon, Murkrow
	{
		id: "Route 2-5",
		category: "Route 2",
		name: "Route 2-5",
		music: "SM Wild Pokemon Battle",
		icon: "5",
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 12
				return 15
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 12
				return 15
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Zubat", levelMin: 8, levelMax: 11, weight: 4 },
					{ id: "Gastly", levelMin: 8, levelMax: 11, weight: 4 },
					{ id: "Misdreavus", levelMin: 8, levelMax: 11, weight: 4 },
					{ id: "Drifloon", levelMin: 8, levelMax: 11, weight: 4 },
					{ id: "Murkrow", levelMin: 8, levelMax: 11, weight: 2 },
				]
			},
		],
		effects: [
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-5-dialogue" },
		]
	},
	//2-6: Battle with Team Skull Grunts + Ikue
	{
		id: "Route 2-6",
		category: "Route 2",
		name: "Route 2-6",
		icon: "6",
		images: {
			"route-bg-berry-farm": "src/img/bg/berry farm.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 12
				return 15
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 12
				return 15
			}
		},
		trainers: [
			{
				name: "Ikue",
				class: "Pokemon-Breeder-Gen7-F",
				pokemon: [
					{ id: "Pikachu", level: 12 }
				]
			},
			{
				name: "Team Skull Grunt C",
				class: "Team-Skull-Grunt",
				pokemon: [
					{ id: "Drowzee", level: 12 },
					{ id: "Zubat", level: 10 },
					{ id: "Spinarak", level: 10 },
					{ id: "Meowth-Alola", level: 10 },
				]
			},
		],
		effects: [
			{ type: "dialogue", source: "route-2-6-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-6-dialogue-won" },
		]
	},
	//2-7: Trial 1
	//UNLOCK NORMAL Z
	{
		id: "Route 2-7",
		category: "Route 2",
		name: "Route 2-7",
		icon: "7",
		images: {
			"route-bg-verdant-cavern-entrance": "src/img/bg/cave entrance.jpg",
			"route-bg-verdant-cavern": "src/img/bg/verdant cavern.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			}
		},
		trainers: [
			{
				isWild: true,
				shuffle: false,
				pokemon: [
					{ id: "Yungoos", level: 11, activeMoves: ["Sand Attack", "Tackle", "Hyper Fang", "Leer"] },
					{ id: "Yungoos", level: 11, activeMoves: ["Bide", "Tackle", "Super Fang", "Leer"] },
					{ id: "Gumshoos", level: 13, activeMoves: ["Sand Attack", "Bite", "Super Fang", "Leer"] },
				]
			},
			{
				isWild: true,
				shuffle: false,
				pokemon: [
					{ id: "Rattata-Alola", level: 11, activeMoves: ["Quick Attack", "Tail Whip", "Hyper Fang", "Tackle"] },
					{ id: "Rattata-Alola", level: 11, activeMoves: ["Quick Attack", "Tail Whip", "Super Fang", "Tackle"] },
					{ id: "Raticate-Alola", level: 13, activeMoves: ["Focus Energy", "Tail Whip", "Super Fang", "Tackle"] },
				]
			},
			{
				isWild: true,
				shuffle: false,
				pokemon: [
					{ id: "Yungoos", level: 11, activeMoves: ["Sand Attack", "Tackle", "Hyper Fang", "Leer"] },
					{ id: "Rattata-Alola", level: 11, activeMoves: ["Quick Attack", "Tail Whip", "Hyper Fang", "Tackle"] },
					{ id: "Yungoos", level: 11, activeMoves: ["Bide", "Tackle", "Super Fang", "Leer"] },
					{ id: "Rattata-Alola", level: 11, activeMoves: ["Quick Attack", "Tail Whip", "Super Fang", "Tackle"] },
					{ id: "Gumshoos", level: 13, activeMoves: ["Sand Attack", "Bite", "Super Fang", "Leer"] },
					{ id: "Raticate-Alola", level: 13, activeMoves: ["Focus Energy", "Tail Whip", "Super Fang", "Tackle"] },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Gumshoos", level: 15, name: "Reginald", pokeball: "ultraball", activeMoves: ["Bite", "Hyper Fang", "Super Fang", "Leer"] },
					{ id: "Smeargle", level: 15, name: "Inkwell", pokeball: "ultraball", activeMoves: ["Tackle", "Ember", "Leafage", "Water Gun"] },
					{ id: "Komala", level: 15, name: "Nibsby", pokeball: "ultraball", activeMoves: ["Yawn", "Bite", "Pound", "Focus Energy"] },
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-verdant-cavern-entrance" },
			{ type: "dialogue", source: "route-2-7-dialogue" },
			{ type: "get-val-from-obj", key: "fight-ilima", obj: -1 },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "fight-ilima" },
			{ type: "change-background-image", name: "route-bg-verdant-cavern" },
			{ type: "jump", jumpTo: "fight-rats" },

			{ type: "load-setting", key: "hardMode", label: "fight-ilima" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 3, label: "Ilima" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-2-7-dialogue-won-2" },
			{ type: "unlock-z-move-type", unlockedType: "Normal" },
			{ type: "jump", jumpTo: Infinity },

			{ type: "load-setting", key: "hardMode", label: "fight-rats" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },

			{ type: "change-music", music: "SM Wild Pokemon Battle", label: "easyMode" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "Moon" },
			{ type: "fight", trainer: 0, label: "Sun" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "fight", trainer: 1, label: "Moon" },
			{ type: "jump", jumpTo: "win-check" },

			{ type: "change-music", music: "SM Wild Pokemon Battle", label: "hardMode" },
			{ type: "fight", trainer: 2 },
			{ type: "jump", jumpTo: "win-check" },

			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check" },
			{ type: "dialogue", source: "route-2-7-dialogue-won-1" },
			{ type: "unlock-z-move-type", unlockedType: "Normal" },
		]
	},

	//3-1: Mankey, Delibird, Crabrawler + others | Tatiana
	{
		id: "Route 3-1",
		category: "Route 3",
		name: "Route 3-1",
		music: "SM Wild Pokemon Battle",
		icon: "1",
		images: {
			"route-bg-cliff-path": "src/img/bg/cliff path.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Crabrawler", levelMin: 9, levelMax: 12, weight: 4 },
					{ id: "Mankey", levelMin: 9, levelMax: 12, weight: 4 },
					{ id: "Delibird", levelMin: 9, levelMax: 12, weight: 4 },
					{ id: "Spearow", levelMin: 9, levelMax: 12, weight: 2 },
					{ id: "Cutiefly", levelMin: 9, levelMax: 12, weight: 2 },
					{ id: "Yungoos", levelMin: 9, levelMax: 12, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 9, levelMax: 12, weight: 1 },
				]
			},
			{
				name: "Tatiana",
				class: "Rising-Star-F",
				pokemon: [
					{ id: "Petilil", level: 13, pokeball: "greatball", name: "Direvine the Destroyer" }
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-cliff-path" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-1-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
		]
	},
	//3-2: Rufflet, Vullaby, Bagon + others | Makana
	{
		id: "Route 3-2",
		category: "Route 3",
		name: "Route 3-2",
		music: "SM Wild Pokemon Battle",
		icon: "2",
		images: {
			"route-bg-cliff-path": "src/img/bg/cliff path.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 14
				return 16
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				recommendedLevels: {
					"normal": (pokemonList) => {
						if (pokemonList.length >= 3) return 14
						return 16
					},
					"hard": (pokemonList) => {
						if (pokemonList.length >= 3) return 14
						return 16
					}
				},
				possiblePokemon: [
					{ id: "Rufflet", levelMin: 10, levelMax: 12, weight: 4 },
					{ id: "Vullaby", levelMin: 10, levelMax: 12, weight: 4 },
					{ id: "Bagon", levelMin: 10, levelMax: 12, weight: 2 },
					{ id: "Spearow", levelMin: 10, levelMax: 12, weight: 3 },
					{ id: "Cutiefly", levelMin: 10, levelMax: 12, weight: 2 },
					{ id: "Yungoos", levelMin: 10, levelMax: 12, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 10, levelMax: 12, weight: 1 },
				]
			},
			{
				name: "Makana",
				class: "Ace-Trainer-Gen7",
				pokemon: [
					{ id: "Rockruff", level: 13 },
					{ id: "Slowpoke", level: 14 },
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-cliff-path" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-2-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
		]
	},
	//3-3: Oricorio (Pom-Pom), Cottonee, Petilil, Cutiefly + others | Thistle
	{
		id: "Route 3-3",
		category: "Route 3",
		name: "Route 3-3",
		music: "SM Wild Pokemon Battle",
		icon: "3",
		images: {
			"route-bg-melemele-meadow": "src/img/bg/melemele meadow.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 15
				return 17
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 15
				return 17
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Oricorio", form: "Pom-Pom", levelMin: 10, levelMax: 13, weight: 4 },
					{ id: "Cottonee", levelMin: 10, levelMax: 13, weight: 4 },
					{ id: "Petilil", levelMin: 10, levelMax: 13, weight: 4 },
					{ id: "Cutiefly", levelMin: 10, levelMax: 13, weight: 2 },
					{ id: "Caterpie", levelMin: 10, levelMax: 13, weight: 1 },
					{ id: "Metapod", levelMin: 10, levelMax: 13, weight: 1 },
					{ id: "Butterfree", levelMin: 10, levelMax: 13, weight: 0.5 },
				]
			},
			{
				name: "Thistle",
				class: "Aroma-Lady",
				pokemon: [
					{ id: "Cottonee", name: "Juniper", level: 13 },
					{ id: "Cutiefly", name: "Mote", level: 14 },
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-melemele-meadow" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-3-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "fight", trainer: 1 },
		]
	},
	//3-4: Rival Battle 3
	{
		id: "Route 3-4",
		category: "Route 3",
		name: "Rival Battle 3",
		icon: "4",
		images: {
			"route-bg-forest-path": "src/img/bg/forest path.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 4) return 14
				return 16
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 4) return 14
				return 16
			}
		},
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						id: "Popplio",
						level: 14,
						ability: "Torrent",
						activeMoves: ["Water Gun", "Growl", "Disarming Voice", "Baby-Doll Eyes"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Ball", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Rowlet",
						level: 14,
						ability: "Overgrow",
						activeMoves: ["Leafage", "Growl", "Peck", "Astonish"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Ball", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Litten",
						level: 14,
						ability: "Blaze",
						activeMoves: ["Ember", "Growl", "Lick", "Leer"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Ball", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 31 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			}
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-forest-path" },

			{ type: "dialogue", source: "route-3-4-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },

			{ type: "load-player-info", key: "chosen-starter", label: "easyMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Rowlet" },
			{ type: "jump", jumpTo: "Litten" },

			{ type: "load-player-info", key: "chosen-starter", label: "hardMode" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Litten" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "jump", jumpTo: "Rowlet" },

			{ type: "fight", trainer: 1, label: "Rowlet" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 2, label: "Litten" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 0, label: "Popplio" },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//3-5: Fight with Hala
	//UNLOCK FIGHTING Z
	{
		id: "Route 3-5",
		category: "Route 3",
		name: "Route 3-5",
		music: "SM Trainer Battle",
		icon: "5",
		images: {
			"route-bg-iki-town": "src/img/bg/iki town.jpg"
		},
		recommendedLevels: {
			"normal": 15,
			"hard": 15
		},
		trainers: [
			{
				name: "Hala",
				targetPokemon: {
					"normal": (pokemonList) => {
						return Math.max(3, pokemonList.length)
					},
					"hard": (pokemonList) => {
						return Math.max(4, pokemonList.length)
					}
				},
				canUseZMoves: true,
				zMoveUsableTypes: ["Fighting"],
				pokemon: [
					{
						id: "Mankey",
						name: "Howler",
						level: 15,
						ability: "Anger Point",
						activeMoves: ["Karate Chop", "Focus Energy", "Pursuit"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 15, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 10 },
					},
					{
						id: "Makuhita",
						name: "Tuffle",
						level: 15,
						ability: "Thick Fat",
						activeMoves: ["Fake Out", "Sand Attack", "Arm Thrust"],
						ivs: { hp: 30, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 5 },
						evs: { hp: 30, attack: 15, defense: 5, specialAttack: 0, specialDefense: 5, speed: 0 },
					},
					{
						id: "Crabrawler",
						name: "Knuckles",
						level: 15,
						ability: "Iron Fist",
						activeMoves: ["Power-Up Punch", "Pursuit", "Leer"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 15, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 10 },
					},
					{
						id: "Stufful",
						name: "Mr. Gumpy",
						level: 15,
						ability: "Fluffy",
						activeMoves: ["Brutal Swing", "Payback", "Leer", "Tackle"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 20, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 5 },
					},
					{
						id: "Pancham",
						name: "Jabjab",
						level: 15,
						ability: "Scrappy",
						activeMoves: ["Circle Throw", "Taunt", "Leer", "Arm Thrust"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 20, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 5 },
					},
					{
						id: "Passimian",
						name: "Coach",
						level: 15,
						ability: "Receiver",
						activeMoves: ["Beat Up", "Low Kick", "Focus Energy", "Leer"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 20, attack: 60, defense: 5, specialAttack: 0, specialDefense: 5, speed: 15 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-iki-town" },
			{ type: "dialogue", source: "route-3-5-dialogue" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-5-dialogue-won" },
			{ type: "unlock-z-move-type", unlockedType: "Fighting" },
		]
	},
	//3-6: Roggenrola, Carbink, Sableye, Mawile + others | Sheri
	{
		id: "Route 3-6",
		category: "Route 3",
		name: "Route 3-6",
		music: "SM Wild Pokemon Battle",
		icon: "6",
		images: {
			"route-bg-cave-inside": "src/img/bg/cave inside.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Roggenrola", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Carbink", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Sableye", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Mawile", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Zubat", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Diglett-Alola", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Rockruff", levelMin: 12, levelMax: 15, weight: 0.5 },
				]
			},
			//Easy
			{
				name: "Sheri",
				class: "Ace-Trainer-Gen7-F",
				pokemon: [
					{
						id: "Rockruff",
						name: "Roxie",
						level: 14,
						activeMoves: ["Howl", "Rock Throw", "Bite", "Double Team"],
					},
					{
						id: "Pikachu",
						name: "Nyoom",
						level: 13,
						activeMoves: ["Thunder Shock", "Double Team", "Agility", "Feint"],
					},
					{
						id: "Bounsweet",
						name: "Fresa",
						level: 15,
						activeMoves: ["Razor Leaf", "Play Nice", "Magical Leaf", "Flail"],
					},
				]
			},
			//Hard
			{
				name: "Sheri",
				class: "Ace-Trainer-Gen7-F",
				pokemon: [
					{
						id: "Pikachu",
						name: "Nyoom",
						level: 13,
						activeMoves: ["Electro Ball", "Double Team", "Agility", "Feint"],
						ivs: { hp: 15, attack: 5, defense: 15, specialAttack: 25, specialDefense: 0, speed: 25 },
						evs: { hp: 15, attack: 10, defense: 5, specialAttack: 20, specialDefense: 5, speed: 30 },
					},
					{
						id: "Rockruff",
						name: "Roxie",
						level: 14,
						activeMoves: ["Howl", "Rock Throw", "Bite", "Double Team"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 25, specialAttack: 5, specialDefense: 0, speed: 10 },
					},
					{
						id: "Steenee",
						name: "Fresa",
						level: 15,
						activeMoves: ["Razor Leaf", "Play Nice", "Magical Leaf", "Flail"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 35, attack: 30, defense: 5, specialAttack: 5, specialDefense: 0, speed: 10 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-cave-inside" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-6-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			{ type: "fight", trainer: 1, label: "easyMode" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 2, label: "hardMode" },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//3-7: Machop, Spinda, Rockruff | Kahili
	//UNLOCK FLYING Z
	{
		id: "Route 3-7",
		category: "Route 3",
		name: "Route 3-7",
		music: "SM Wild Pokemon Battle",
		icon: "7",
		images: {
			"route-bg-farthest-hollow": "src/img/bg/farthest hollow.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Machop", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Spinda", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Rockruff", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Roggenrola", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Carbink", levelMin: 12, levelMax: 15, weight: 1 },
				]
			},
			//Easy
			//Mandibuzz: Sandtrap
			//Hawlucha: Topspin
			//Skarmory: Nine Iron
			{
				name: "Kahili",
				canUseZMoves: true,
				zMoveUsableTypes: ["Flying"],
				pokemon: [
					{
						id: "Zubat",
						name: "Slice",
						level: 14,
						pokeball: "ultraball",
						activeMoves: ["Mean Look", "Aerial Ace", "Supersonic", "Absorb"],
						//(Uses a TM)
					},
					{
						id: "Oricorio",
						form: "Baile",
						name: "Fairway",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Air Cutter", "Helping Hand", "Growl", "Peck"],
					},
					//Canonically named Touckey
					{
						id: "Trumbeak",
						name: "Caddy",
						level: 16,
						pokeball: "ultraball",
						activeMoves: ["Pluck", "Supersonic", "Growl", "Echoed Voice"],
					},
				]
			},
			//Hard
			{
				name: "Kahili",
				canUseZMoves: true,
				zMoveUsableTypes: ["Flying"],
				pokemon: [
					{
						id: "Zubat",
						name: "Slice",
						level: 14,
						pokeball: "ultraball",
						activeMoves: ["Mean Look", "Aerial Ace", "Absorb", "Poison Fang"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						//(Uses a TM and gets a move 1 level early)
					},
					{
						id: "Oricorio",
						form: "Baile",
						name: "Fairway",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Air Cutter", "Helping Hand", "Growl", "Peck"],
						ivs: { hp: 15, attack: 5, defense: 15, specialAttack: 25, specialDefense: 0, speed: 25 },
						evs: { hp: 15, attack: 10, defense: 15, specialAttack: 25, specialDefense: 0, speed: 20 },
					},
					//Canonically named Touckey
					{
						id: "Trumbeak",
						name: "Caddy",
						level: 16,
						pokeball: "ultraball",
						activeMoves: ["Pluck", "Supersonic", "Growl", "Echoed Voice"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 20, speed: 25 },
						evs: { hp: 15, attack: 40, defense: 15, specialAttack: 50, specialDefense: 20, speed: 25 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-farthest-hollow" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-3-7-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			{ type: "fight", trainer: 1, label: "easyMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "fight", trainer: 2, label: "hardMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check" },
			{ type: "dialogue", source: "route-3-7-dialogue-won" },
			{ type: "unlock-z-move-type", unlockedType: "Flying" },
		]
	},

	//4-1: Fight with Dexio/Sina
	{
		id: "Route 4-1",
		category: "Route 4",
		name: "Route 4-1",
		music: "SM Trainer Battle",
		icon: "1",
		images: {
			"route-bg-tide-song-interior": "src/img/bg/tide song interior.jpg",
			"route-bg-tide-song-exterior": "src/img/bg/tide song exterior.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 19
			}
		},
		trainers: [
			//Easy
			{
				name: "Dexio",
				pokemon: [
					{
						id: "Slowpoke",
						name: "Slouch",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Disable", "Confusion", "Yawn", "Water Gun"],
					},
					{
						id: "Espeon",
						name: "Epsilon",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Confusion", "Psybeam", "Sand Attack", "Quick Attack"],
					},
					{
						id: "Raichu-Alola",
						name: "Indra",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Light Screen", "Agility", "Thunder Shock", "Quick Attack"],
					},
				]
			},
			{
				name: "Sina",
				pokemon: [
					{
						id: "Smoochum",
						name: "Mwah",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Confusion", "Covet", "Sing", "Powder Snow"],
					},
					{
						id: "Glaceon",
						name: "Glimmer",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Icy Wind", "Covet", "Double-Edge", "Growl"],
					},
					{
						id: "Snowball",
						name: "Sandshrew-Alola",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Fury Cutter", "Rollout", "Powder Snow", "Mist"],
					},
				]
			},
			//Hard
			{
				name: "Dexio",
				pokemon: [
					{
						id: "Slowpoke",
						name: "Slouch",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Disable", "Confusion", "Yawn", "Water Gun"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 20, speed: 5 },
					},
					{
						id: "Espeon",
						name: "Epsilon",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Confusion", "Psybeam", "Sand Attack", "Quick Attack"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 5, defense: 15, specialAttack: 35, specialDefense: 25, speed: 25 },
					},
					{
						id: "Raichu-Alola",
						name: "Indra",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Light Screen", "Agility", "Thunder Shock", "Quick Attack"],
						ivs: { hp: 15, attack: 5, defense: 15, specialAttack: 25, specialDefense: 15, speed: 25 },
						evs: { hp: 25, attack: 15, defense: 15, specialAttack: 35, specialDefense: 0, speed: 25 },
					},
				]
			},
			{
				name: "Sina",
				pokemon: [
					{
						id: "Smoochum",
						name: "Mwah",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Confusion", "Covet", "Sing", "Powder Snow"],
						ivs: { hp: 15, attack: 25, defense: 0, specialAttack: 25, specialDefense: 15, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 0, specialAttack: 25, specialDefense: 15, speed: 5 },
					},
					{
						id: "Glaceon",
						name: "Glimmer",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Icy Wind", "Covet", "Double-Edge", "Growl"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 10, speed: 25 },
						evs: { hp: 15, attack: 40, defense: 15, specialAttack: 25, specialDefense: 10, speed: 5 },
					},
					{
						id: "Snowball",
						name: "Sandshrew-Alola",
						level: 15,
						pokeball: "ultraball",
						activeMoves: ["Fury Cutter", "Rollout", "Powder Snow", "Iron Defense"],
						ivs: { hp: 15, attack: 25, defense: 25, specialAttack: 5, specialDefense: 25, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 40, specialAttack: 5, specialDefense: 25, speed: 5 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-tide-song-interior" },
			{ type: "dialogue", source: "route-4-1-dialogue" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			
			{ type: "fight", trainer: 0, label: "easyMode" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "fight", trainer: 1 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "end" },
			
			{ type: "fight", trainer: 2, label: "hardMode" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "fight", trainer: 3 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "end" },

			{ type: "dialogue", source: "route-4-1-dialogue-won", label: "end" },
		]
	},
	//4-2
	{
		id: "Route 4-2",
		category: "Route 4",
		name: "Route 4-2",
		music: "SM Wild Pokemon Battle",
		icon: "2",
		images: {
			"route-bg-cave-inside": "src/img/bg/cave inside.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 20
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 17
				return 20
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Mudbray", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Lillipup", levelMin: 12, levelMax: 15, weight: 3 },
					{ id: "Pikipek", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Grubbin", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Yungoos", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 12, levelMax: 15, weight: 1 },
					{ id: "Igglybuff", levelMin: 12, levelMax: 15, weight: 0.2 },
					{ id: "Eevee", levelMin: 12, levelMax: 15, weight: 0.2 },
				]
			},
		],
		effects: [
			// { type: "change-background-image", name: "route-bg-cave-inside" },
			{ type: "fight", trainer: 0 },
			// { type: "jump-if-lost", jumpTo: Infinity },
			// { type: "dialogue", source: "route-3-6-dialogue" },
			// { type: "change-music", music: "SM Trainer Battle" },
			// { type: "load-setting", key: "hardMode" },
			// { type: "load-value", value: true },
			// { type: "jump-if-equal", jumpTo: "hardMode" },
			// { type: "jump", jumpTo: "easyMode" },
			// { type: "fight", trainer: 1, label: "easyMode" },
			// { type: "jump", jumpTo: Infinity },
			// { type: "fight", trainer: 2, label: "hardMode" },
			// { type: "jump", jumpTo: Infinity },
		]
	},
]

for (let categoryId in levelCategoryData) {
	let category = levelCategoryData[categoryId]
	category.id = categoryId
	category.unlocked = category.startsUnlocked ?? false
}
for (let level of levelData) {
	level.status = "not won"
	level.attempts = 0
	level.completions = 0
	level.obtainablePokemon = level.obtainablePokemon ?? []
	if (level.trainers) {
		for (let trainerData of level.trainers) {
			trainerData.isWild = trainerData.isWild ?? false
			trainerData.pokemon = trainerData.pokemon ?? []

			if (trainerData.isWild) {
				let pokemonList = trainerData.pokemon
				if (trainerData.possiblePokemon) {
					pokemonList = pokemonList.concat(trainerData.possiblePokemon)
				}
				for (let pokemonData of pokemonList) {
					let id = pokemonData.id
					if (!level.obtainablePokemon.includes(id)) {
						level.obtainablePokemon.push(id)
					}
				}
			}
		}
	}
}

function getLevelDataById(id) {
	return levelData.find(l => l.id === id)
}

function getLevelButtonHtml(level) {
	let btn = $(`<button class='btn btn-primary level-button'></button>`)
	if (level.status === "won") {
		btn.addClass("won")
	}
	let inner = $(`<div class='inner'></div>`)
	inner.append(`<span class='icon'>${level.icon}</span>`)
	btn.append(inner)
	btn.attr("data-level", level.id)
	return btn
}
function getNPCDataFromTrainer(trainer) {
	let result = {}
	if (trainer.class in NPCTrainerData) {
		result = NPCTrainerData[trainer.class]
	} else if (trainer.name in NPCTrainerData) {
		result = NPCTrainerData[trainer.name]
	}
	return result
}
function getLevelsInCategory(category) {
	return levelData.filter(level => level.category === category)
}
function getTrainerClassesFromLevelCategory(category) {
	let levels = getLevelsInCategory(category)
	let trainers = levels.map(level => level.trainers ?? []).flat()
	let NPCDatas = trainers.map(getNPCDataFromTrainer)
		.filter(data => Object.keys(data).length)
	NPCDatas = noDuplicates(NPCDatas)
	return NPCDatas
}
function loadTrainerClassSprites(data) {
	let sprites = data.imageSources || {}
	let names = []
	for (let key in sprites) {
		let url = sprites[key]
		let name = `trainer-${data.name}-${key}`
		loadSprite(name, url)
		names.push(name)
	}
	return names
}

function determineUnlockedLevels() {
	for (let categoryId in levelCategoryData) {
		let category = levelCategoryData[categoryId]
		let unlocked = category.unlocked
		if (category.prerequisites) {
			let prereq = category.prerequisites
			let allBeaten = true
			if (prereq.levelsBeaten) {
				for (let levelId of prereq.levelsBeaten) {
					let level = getLevelDataById(levelId)
					if (level.status !== "won") {
						allBeaten = false
						break
					}
				}
			}
			let shouldUnlock = allBeaten
			if (shouldUnlock) {
				unlocked = true
			}
		}
		category.unlocked = unlocked
	}
}

const pokeballSpriteData = {
	types: {
		"pokeball": [0, 3],
		"greatball": [0, 29],
		"ultraball": [0, 55]
	},
	sprites: {
		"none": [1, 1, 0, 0],
		"closed": [16, 14, 114, 9],
		"squish": [18, 14, 130, 9],
		"open": [16, 23, 148, 0]
	}
}

function renderPokeballSmallCanvas(canvasTag, type, sprite) {
	let ctx = canvasTag.getContext("2d")
	canvasTag.height = 30
	canvasTag.width = 30
	ctx.height = 30
	ctx.width = 30
	ctx.clearRect(0, 0, ctx.width, ctx.height)
	let typeData = pokeballSpriteData.types[type]
	let spriteData = pokeballSpriteData.sprites[sprite]
	let spriteWidth = spriteData[0]
	let spriteHeight = spriteData[1]
	let spriteOffsetX = typeData[0] + spriteData[2]
	let spriteOffsetY = typeData[1] + spriteData[3]
	let placeOffsetX = Math.floor((ctx.width - spriteWidth) * 0.5)
	let placeOffsetY = Math.floor((ctx.height - spriteHeight) * 0.5)
	let spritesheet = sprites.images["pokeballs"]
	ctx.drawImage(spritesheet,
		spriteOffsetX, spriteOffsetY, spriteWidth, spriteHeight,
		placeOffsetX, placeOffsetY, spriteWidth, spriteHeight)
}
function renderPokeballSpinSmallCanvas(canvas, direction) {
	let directionMult = -1
	if (direction === "left") {
		directionMult = -1
	}
	if (direction === "right") {
		directionMult = 1
	}
	let p = new Promise(resolve => {
		let resolved = false
		const animate = p => {
			let top = 1.6 * (p - 0.4) * (p - 0.4) + 0.25
			canvas.css({
				transform: `translate(-50%, -50%) rotate(${p * 10 * directionMult}turn)`,
				top: `${top * 100}%`
			})
		}
		$({ val: 0 }).animate({ val: 1 }, {
			duration: 1200,
			easing: "linear",
			step: function () {
				animate(this.val)
				if (this.val > 0.9 && !resolved) {
					resolve()
					resolved = true
				}
			},
			complete: function () {
				animate(1)
				if (!resolved) {
					resolve()
					resolved = true
				}
			}
		})
	})
	return p
}