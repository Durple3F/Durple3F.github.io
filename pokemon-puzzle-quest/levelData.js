const songData = {
	"Route 201 (Day)": {
		source: "src/audio/songs/route201-2.mp3",
		loops: true,
	},
	"SM Trainer Battle": {
		source: "src/audio/songs/sm trainer battle intro.mp3",
		loopTransition: true,
		loopSource: "src/audio/songs/sm trainer battle loop.mp3"
	},
	"SM Wild Pokemon Battle": {
		source: "src/audio/songs/sm wild pokemon battle intro.mp3",
		loopTransition: true,
		loopSource: "src/audio/songs/sm wild pokemon battle loop.mp3"
	},
	"SM Gladion Battle": {
		source: "src/audio/songs/sm gladion battle intro.mp3",
		loopTransition: true,
		loopSource: "src/audio/songs/sm gladion battle loop.mp3"
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
		startsUnlocked: true,
		style: {
			backgroundColor: "#0e499e",
			backgroundImage: "src/img/bg/Melemele_Island.png",
			positionLevels: "absolute"
		}
	},
	"Route 2": {
		id: "Route 2",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 1-7"
			]
		},
		style: {
			backgroundColor: "#0e499e",
			backgroundImage: "src/img/bg/Melemele_Island.png",
			positionLevels: "absolute"
		}
	},
	"Route 3": {
		id: "Route 3",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 2-7"
			]
		},
		style: {
			backgroundColor: "#0e499e",
			backgroundImage: "src/img/bg/Melemele_Island.png",
			positionLevels: "absolute"
		}
	},
	"Route 4": {
		id: "Route 4",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 3-5"
			]
		},
		style: {
			backgroundColor: "#0e499e",
			backgroundImage: "src/img/bg/Akala_Island.png",
			positionLevels: "absolute"
		}
	},
	"Route 5": {
		id: "Route 5",
		startsUnlocked: false,
		prerequisites: {
			levelsBeaten: [
				"Route 4-7"
			]
		},
		style: {
			backgroundColor: "#0e499e",
			backgroundImage: "src/img/bg/Akala_Island.png",
			positionLevels: "absolute"
		}
	},
}

const levelData = [
	//1-1: Rival Battle 1
	{
		id: "Route 1-1",
		category: "Route 1",
		name: "Route 1-1",
		forgiving: true,
		icon: "1",
		position: {
			left: 0.325,
			top: 0.27
		},
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
						name: "hau-popplio",
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
						name: "hau-rowlet",
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
						name: "hau-litten",
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
			{ type: "dialogue", source: "rival-battle-1-dialogue-won", fadeOut: false },
			{ type: "jump", jumpTo: Infinity },
			{ type: "dialogue", source: "rival-battle-1-dialogue-lost", label: "lost", fadeOut: false },
		]
	},
	//1-2: Caterpie, Pikipek, Pichu? | Jimmy
	{
		id: "Route 1-2",
		category: "Route 1",
		name: "Route 1-2",
		icon: "2",
		music: "SM Wild Pokemon Battle",
		position: {
			left: 0.37,
			top: 0.36
		},
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
		position: {
			left: 0.435,
			top: 0.33
		},
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
		position: {
			left: 0.45,
			top: 0.21
		},
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
						name: "hau-popplio",
						level: 7,
						ability: "Torrent",
						activeMoves: ["Pound", "Water Gun", "Growl"]
					},
					{
						id: "Pichu",
						name: "hau-pichu",
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
						name: "hau-rowlet",
						level: 7,
						ability: "Overgrow",
						activeMoves: ["Tackle", "Growl", "Leafage"]
					},
					{
						id: "Pichu",
						name: "hau-pichu",
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
						name: "hau-litten",
						level: 7,
						ability: "Blaze",
						activeMoves: ["Scratch", "Growl", "Ember"]
					},
					{
						id: "Pichu",
						name: "hau-pichu",
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
		position: {
			left: 0.51,
			top: 0.27
		},
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
						name: "1-5-madison-wingull",
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
			{ type: "dialogue", source: "route-1-5-dialogue-2-win", fadeOut: false },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//1-6: Magnemite, Meowth-Alola, Grimer-Alola + Lillie Dialogue
	{
		id: "Route 1-6",
		category: "Route 1",
		name: "Route 1-6",
		icon: "6",
		position: {
			left: 0.58,
			top: 0.28
		},
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
		position: {
			left: 0.57,
			top: 0.41
		},
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
					{ id: "Pikipek", name: "1-7-hiromi-pikipek", level: 8, ability: "Skill Link" }
				]
			},
			{
				name: "Mia",
				class: "Preschooler-F-Gen7",
				pokemon: [
					{ id: "Bonsly", name: "1-7-mia-bonsly", level: 7, ability: "Sturdy" }
				]
			},
			{
				name: "Joey",
				class: "Youngster-Gen7",
				pokemon: [
					{ id: "Metapod", name: "1-7-joey-metapod", level: 7, ability: "Shed Skin" }
				]
			},
			{
				name: "Joseph",
				class: "Rising-Star",
				pokemon: [
					{ id: "Grimer-Alola", pokeball: "great ball", level: 8, ability: "Poison Touch" }
				]
			},
			{
				name: "Emily",
				class: "Teacher-Gen7",
				pokemon: [
					{ id: "Magnemite", name: "1-7-emily-magnemite", level: 8, ability: "Analytic" },
					{ id: "Meowth-Alola", name: "1-7-emily-meowth", level: 9, ability: "Technician" }
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
			{ type: "dialogue", source: "route-1-7-dialogue-6", fadeOut: false },
		]
	},

	//2-1: Abra, Pikachu, Happiny, + others
	{
		id: "Route 2-1",
		category: "Route 2",
		name: "Route 2-1",
		music: "SM Wild Pokemon Battle",
		icon: "1",
		position: {
			left: 0.50,
			top: 0.58
		},
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
		position: {
			left: 0.41,
			top: 0.84
		},
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
					{ id: "Yungoos", level: 9, name: "ilima-yungoos", pokeball: "ultra ball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "ilima-smeargle", pokeball: "ultra ball", activeMoves: ["Ember", "Tackle"] },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Yungoos", level: 9, name: "ilima-yungoos", pokeball: "ultra ball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "ilima-smeargle", pokeball: "ultra ball", activeMoves: ["Water Gun", "Tackle"] },
				]
			},
			{
				name: "Ilima",
				pokemon: [
					{ id: "Yungoos", level: 9, name: "ilima-yungoos", pokeball: "ultra ball", activeMoves: ["Tackle", "Pursuit", "Leer"] },
					{ id: "Smeargle", level: 10, name: "ilima-smeargle", pokeball: "ultra ball", activeMoves: ["Leafage", "Tackle"] },
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
			{ type: "dialogue", source: "route-2-2-dialogue-won", fadeOut: false },
		]
	},
	//2-3: Smeargle, Drowzee, Abra, + others | Krystal
	{
		id: "Route 2-3",
		category: "Route 2",
		name: "Route 2-3",
		music: "SM Wild Pokemon Battle",
		icon: "3",
		position: {
			left: 0.15,
			top: 0.60
		},
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
					{ id: "Gastly", level: 9, name: "2-3-krystal-gastly" }
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
			{ type: "dialogue", source: "route-2-3-dialogue-won", fadeOut: false },
		]
	},
	//2-4: Spearow, Growlithe, Cutiefly, Makuhita + others | Ashley
	{
		id: "Route 2-4",
		category: "Route 2",
		name: "Route 2-4",
		music: "SM Wild Pokemon Battle",
		icon: "4",
		position: {
			left: 0.11,
			top: 0.50
		},
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
					{ id: "Cottonee", level: 10, name: "2-4-ashley-cottonee" }
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
			{ type: "dialogue", source: "route-2-4-dialogue-won", fadeOut: false },
		]
	},
	//2-5: Zubat, Gastly, Misdreavus, Drifloon, Murkrow
	{
		id: "Route 2-5",
		category: "Route 2",
		name: "Route 2-5",
		music: "SM Wild Pokemon Battle",
		icon: "5",
		position: {
			left: 0.215,
			top: 0.50
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
			{ type: "dialogue", source: "route-2-5-dialogue", fadeOut: false },
		]
	},
	//2-6: Battle with Team Skull Grunts + Ikue
	{
		id: "Route 2-6",
		category: "Route 2",
		name: "Route 2-6",
		icon: "6",
		position: {
			left: 0.11,
			top: 0.36
		},
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
			{ type: "dialogue", source: "route-2-6-dialogue-won", fadeOut: false },
		]
	},
	//2-7: Trial 1
	//UNLOCK NORMAL Z
	{
		id: "Route 2-7",
		category: "Route 2",
		name: "Route 2-7",
		icon: "7",
		position: {
			left: 0.16,
			top: 0.23
		},
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
					{ id: "Gumshoos", level: 15, name: "ilima-yungoos", pokeball: "ultra ball", activeMoves: ["Bite", "Hyper Fang", "Super Fang", "Leer"] },
					{ id: "Smeargle", level: 15, name: "ilima-smeargle", pokeball: "ultra ball", activeMoves: ["Tackle", "Ember", "Leafage", "Water Gun"] },
					{ id: "Komala", level: 15, name: "ilima-komala", pokeball: "ultra ball", activeMoves: ["Yawn", "Bite", "Pound", "Focus Energy"] },
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
			{ type: "dialogue", source: "route-2-7-dialogue-won-1", fadeOut: false },
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
		position: {
			left: 0.21,
			top: 0.19
		},
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
					{ id: "Petilil", level: 13, pokeball: "great ball", name: "3-1-tatiana-petilil" }
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
		position: {
			left: 0.28,
			top: 0.15
		},
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
		position: {
			left: 0.36,
			top: 0.11
		},
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
					{ id: "Cottonee", name: "3-3-thistle-cottonee", level: 13 },
					{ id: "Cutiefly", name: "3-3-thistle-cutiefly", level: 14 },
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
		position: {
			left: 0.45,
			top: 0.24
		},
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
						name: "hau-popplio",
						level: 14,
						ability: "Torrent",
						activeMoves: ["Water Gun", "Growl", "Disarming Voice", "Baby-Doll Eyes"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Rowlet",
						name: "hau-rowlet",
						level: 14,
						ability: "Overgrow",
						activeMoves: ["Leafage", "Growl", "Peck", "Astonish"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Litten",
						name: "hau-litten",
						level: 14,
						ability: "Blaze",
						activeMoves: ["Ember", "Growl", "Lick", "Leer"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 5, attack: 5, defense: 5, specialAttack: 20, specialDefense: 5, speed: 10 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 14,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
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
		position: {
			left: 0.33,
			top: 0.27
		},
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
						name: "hala-mankey",
						level: 15,
						ability: "Anger Point",
						activeMoves: ["Karate Chop", "Focus Energy", "Pursuit"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 15, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 10 },
					},
					{
						id: "Makuhita",
						name: "hala-makuhita",
						level: 15,
						ability: "Thick Fat",
						activeMoves: ["Fake Out", "Sand Attack", "Arm Thrust"],
						ivs: { hp: 30, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 5 },
						evs: { hp: 30, attack: 15, defense: 5, specialAttack: 0, specialDefense: 5, speed: 0 },
					},
					{
						id: "Crabrawler",
						name: "hala-crabrawler",
						level: 15,
						ability: "Iron Fist",
						activeMoves: ["Power-Up Punch", "Pursuit", "Leer"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 15, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 10 },
					},
					{
						id: "Stufful",
						name: "hala-stufful",
						level: 15,
						ability: "Fluffy",
						activeMoves: ["Brutal Swing", "Payback", "Leer", "Tackle"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 20, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 5 },
					},
					{
						id: "Pancham",
						name: "hala-pancham",
						level: 15,
						ability: "Scrappy",
						activeMoves: ["Circle Throw", "Taunt", "Leer", "Arm Thrust"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 20, attack: 30, defense: 5, specialAttack: 0, specialDefense: 5, speed: 5 },
					},
					{
						id: "Passimian",
						name: "hala-passimian",
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
			{ type: "dialogue", source: "route-3-5-dialogue-won", fadeOut: false },
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
		position: {
			left: 0.56,
			top: 0.56
		},
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
					{ id: "Noibat", levelMin: 12, levelMax: 15, weight: 1 },
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
						name: "3-6-sheri-rockruff",
						level: 14,
						activeMoves: ["Howl", "Rock Throw", "Bite", "Double Team"],
					},
					{
						id: "Pikachu",
						name: "3-6-sheri-pikachu",
						level: 13,
						activeMoves: ["Thunder Shock", "Double Team", "Agility", "Feint"],
					},
					{
						id: "Bounsweet",
						name: "3-6-sheri-bounsweet",
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
						name: "3-6-sheri-pikachu",
						level: 13,
						activeMoves: ["Electro Ball", "Double Team", "Agility", "Feint"],
						ivs: { hp: 15, attack: 5, defense: 15, specialAttack: 25, specialDefense: 0, speed: 25 },
						evs: { hp: 15, attack: 10, defense: 5, specialAttack: 20, specialDefense: 5, speed: 30 },
					},
					{
						id: "Rockruff",
						name: "3-6-sheri-rockruff",
						level: 14,
						activeMoves: ["Howl", "Rock Throw", "Bite", "Double Team"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 15 },
						evs: { hp: 15, attack: 30, defense: 25, specialAttack: 5, specialDefense: 0, speed: 10 },
					},
					{
						id: "Steenee",
						name: "3-6-sheri-bounsweet",
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
		position: {
			left: 0.65,
			top: 0.45
		},
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
			{
				name: "Kahili",
				canUseZMoves: true,
				zMoveUsableTypes: ["Flying"],
				pokemon: [
					{
						id: "Zubat",
						name: "kahili-zubat",
						level: 14,
						pokeball: "ultra ball",
						activeMoves: ["Mean Look", "Aerial Ace", "Supersonic", "Absorb"],
						//(Uses a TM)
					},
					{
						id: "Oricorio",
						form: "Baile",
						name: "kahili-oricorio",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Air Cutter", "Helping Hand", "Growl", "Peck"],
					},
					//Canonically named Touckey
					{
						id: "Trumbeak",
						name: "kahili-toucannon",
						level: 16,
						pokeball: "ultra ball",
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
						name: "kahili-zubat",
						level: 14,
						pokeball: "ultra ball",
						activeMoves: ["Mean Look", "Aerial Ace", "Absorb", "Poison Fang"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						//(Uses a TM and gets a move 1 level early)
					},
					{
						id: "Oricorio",
						form: "Baile",
						name: "kahili-oricorio",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Air Cutter", "Helping Hand", "Growl", "Peck"],
						ivs: { hp: 15, attack: 5, defense: 15, specialAttack: 25, specialDefense: 0, speed: 25 },
						evs: { hp: 15, attack: 10, defense: 15, specialAttack: 25, specialDefense: 0, speed: 20 },
					},
					{
						id: "Trumbeak",
						name: "kahili-toucannon",
						level: 16,
						pokeball: "ultra ball",
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
			{ type: "dialogue", source: "route-3-7-dialogue-won", fadeOut: false },
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
		position: {
			left: 0.205,
			top: 0.54
		},
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
						name: "dexio-slowpoke",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Disable", "Confusion", "Yawn", "Water Gun"],
					},
					{
						id: "Espeon",
						name: "dexio-espeon",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Confusion", "Psybeam", "Sand Attack", "Quick Attack"],
					},
					{
						id: "Raichu-Alola",
						name: "dexio-raichu",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Light Screen", "Agility", "Thunder Shock", "Quick Attack"],
					},
				]
			},
			{
				name: "Sina",
				pokemon: [
					{
						id: "Smoochum",
						name: "sina-smoochum",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Confusion", "Covet", "Sing", "Powder Snow"],
					},
					{
						id: "Glaceon",
						name: "sina-glaceon",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Icy Wind", "Covet", "Double-Edge", "Growl"],
					},
					{
						id: "Sandshrew-Alola",
						name: "sina-sandshrew",
						level: 15,
						pokeball: "ultra ball",
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
						name: "dexio-slowpoke",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Disable", "Confusion", "Yawn", "Water Gun"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 20, speed: 5 },
					},
					{
						id: "Espeon",
						name: "dexio-espeon",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Confusion", "Psybeam", "Sand Attack", "Quick Attack"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 0, speed: 5 },
						evs: { hp: 15, attack: 5, defense: 15, specialAttack: 35, specialDefense: 25, speed: 25 },
					},
					{
						id: "Raichu-Alola",
						name: "dexio-raichu",
						level: 15,
						pokeball: "ultra ball",
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
						name: "sina-smoochum",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Confusion", "Covet", "Sing", "Powder Snow"],
						ivs: { hp: 15, attack: 25, defense: 0, specialAttack: 25, specialDefense: 15, speed: 5 },
						evs: { hp: 15, attack: 25, defense: 0, specialAttack: 25, specialDefense: 15, speed: 5 },
					},
					{
						id: "Glaceon",
						name: "sina-glaceon",
						level: 15,
						pokeball: "ultra ball",
						activeMoves: ["Icy Wind", "Covet", "Double-Edge", "Growl"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 25, specialDefense: 10, speed: 25 },
						evs: { hp: 15, attack: 40, defense: 15, specialAttack: 25, specialDefense: 10, speed: 5 },
					},
					{
						id: "Sandshrew-Alola",
						name: "sina-sandshrew",
						level: 15,
						pokeball: "ultra ball",
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

			{ type: "dialogue", source: "route-4-1-dialogue-won", label: "end", fadeOut: false },
		]
	},
	//4-2: Mudbray, Lillipup + others | Jody
	{
		id: "Route 4-2",
		category: "Route 4",
		name: "Route 4-2",
		music: "SM Wild Pokemon Battle",
		icon: "2",
		position: {
			left: 0.295,
			top: 0.515
		},
		images: {
			"route-bg-forest-path": "src/img/bg/forest path.jpg"
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
			//Easy
			{
				name: "Jody",
				class: "Bellhop",
				pokemon: [
					{
						id: "Drifloon",
						name: "4-2-jody-drifloon",
						level: 14,
						pokeball: "luxury ball",
						activeMoves: ["Minimize", "Astonish", "Focus Energy", "Payback"],
					},
					{
						id: "Fomantis",
						name: "4-2-jody-fomantis",
						level: 14,
						pokeball: "luxury ball",
						activeMoves: ["Razor Leaf", "Growth", "Fury Cutter", "Leafage"],
					},
					{
						id: "Lillipup",
						name: "4-2-jody-lillipup",
						isAce: true,
						level: 15,
						pokeball: "premier ball",
						activeMoves: ["Play Rough", "Take Down", "Reversal", "Work Up"],
					},
				]
			},
			//Hard
			{
				name: "Jody",
				class: "Bellhop",
				pokemon: [
					{
						id: "Drifloon",
						name: "4-2-jody-drifloon",
						level: 14,
						pokeball: "luxury ball",
						activeMoves: ["Minimize", "Astonish", "Focus Energy", "Payback"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 20, speed: 25 },
						evs: { hp: 15, attack: 30, defense: 15, specialAttack: 20, specialDefense: 40, speed: 30 },
					},
					{
						id: "Fomantis",
						name: "4-2-jody-fomantis",
						level: 14,
						pokeball: "luxury ball",
						activeMoves: ["Razor Leaf", "Growth", "Ingrain", "Leafage"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 20, speed: 25 },
						evs: { hp: 30, attack: 40, defense: 15, specialAttack: 10, specialDefense: 20, speed: 50 },
					},
					{
						id: "Lillipup",
						name: "4-2-jody-lillipup",
						isAce: true,
						level: 15,
						pokeball: "premier ball",
						activeMoves: ["Play Rough", "Retaliate", "Reversal", "Work Up"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 20, speed: 25 },
						evs: { hp: 40, attack: 80, defense: 15, specialAttack: 10, specialDefense: 20, speed: 25 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-forest-path" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-4-2-dialogue" },
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
			{ type: "dialogue", source: "route-4-2-dialogue-won", fadeOut: false },
		]
	},
	//4-3: Igglybuff, Eevee | Scotty
	{
		id: "Route 4-3",
		category: "Route 4",
		name: "Route 4-3",
		music: "SM Wild Pokemon Battle",
		icon: "3",
		position: {
			left: 0.24,
			top: 0.44
		},
		images: {
			"route-bg-forest-path": "src/img/bg/forest path.jpg"
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
					{ id: "Igglybuff", levelMin: 13, levelMax: 15, weight: 3 },
					{ id: "Eevee", levelMin: 13, levelMax: 15, weight: 3 },
					{ id: "Pikipek", levelMin: 13, levelMax: 15, weight: 1 },
					{ id: "Grubbin", levelMin: 13, levelMax: 15, weight: 1 },
					{ id: "Yungoos", levelMin: 13, levelMax: 15, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 13, levelMax: 15, weight: 1 },
					{ id: "Mudbray", levelMin: 13, levelMax: 15, weight: 0.2 },
					{ id: "Lillipup", levelMin: 13, levelMax: 15, weight: 0.2 },
				]
			},
			//Easy
			{
				name: "Scotty",
				class: "Sightseer",
				pokemon: [
					{
						id: "Sableye",
						name: "4-3-scotty-sableye",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Fake Out", "Astonish", "Shadow Sneak", "Disable"],
					},
					{
						id: "Rattata",
						name: "4-3-scotty-rattata",
						level: 15,
						pokeball: "great ball",
						activeMoves: ["Hyper Fang", "Focus Energy", "Quick Attack", "Bite"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 20, attack: 40, defense: 15, specialAttack: 10, specialDefense: 20, speed: 30 },
					},
					{
						id: "Rattata-Alola",
						name: "4-3-scotty-rattata-alola",
						isAce: true,
						level: 13,
						pokeball: "pokeball",
						activeMoves: ["Focus Energy", "Tackle", "Hyper Fang", "Tail Whip"],
					},
				]
			},
			//Hard
			{
				name: "Scotty",
				class: "Sightseer",
				pokemon: [
					{
						id: "Sableye",
						name: "4-3-scotty-sableye",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Fake Out", "Astonish", "Shadow Sneak", "Disable"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 30, attack: 50, defense: 30, specialAttack: 10, specialDefense: 20, speed: 40 },
					},
					{
						id: "Rattata",
						name: "4-3-scotty-rattata",
						level: 15,
						pokeball: "great ball",
						activeMoves: ["Hyper Fang", "Focus Energy", "Quick Attack", "Bite"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 40, attack: 60, defense: 35, specialAttack: 10, specialDefense: 40, speed: 50 },
					},
					{
						id: "Rattata-Alola",
						name: "4-3-scotty-rattata-alola",
						isAce: true,
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Focus Energy", "Tackle", "Quick Attack", "Tail Whip"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 20, attack: 40, defense: 15, specialAttack: 10, specialDefense: 20, speed: 30 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-forest-path" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-4-3-dialogue" },
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
			{ type: "dialogue", source: "route-4-3-dialogue-won", fadeOut: false },
		]
	},
	//4-4: Rival Battle 4
	{
		id: "Route 4-4",
		category: "Route 4",
		name: "Rival Battle 4",
		icon: "4",
		position: {
			left: 0.34,
			top: 0.40
		},
		images: {
			"route-bg-paniola-town": "src/img/bg/paniola town.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 5) return 18
				return 18
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 5) return 15
				return 16
			}
		},
		trainers: [
			{
				name: "Hau",
				canUseZMoves: true,
				zMoveUsableTypes: ["Normal"],
				pokemon: [
					{
						id: "Brionne",
						name: "hau-popplio",
						level: 16,
						ability: "Torrent",
						activeMoves: ["Water Gun", "Growl", "Pound", "Aqua Jet"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 10, attack: 15, defense: 5, specialAttack: 30, specialDefense: 5, speed: 20 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 15,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
						evs: { hp: 15, attack: 20, defense: 10, specialAttack: 15, specialDefense: 15, speed: 20 },
					},
					{
						id: "Noibat",
						name: "hau-noibat",
						level: 14,
						ability: "Infiltrator",
						activeMoves: ["Tackle", "Bite", "Double Team", "Supersonic"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
					{
						id: "Eevee",
						name: "hau-eevee",
						level: 14,
						ability: "Adaptability",
						activeMoves: ["Baby-Doll Eyes", "Play Nice", "Swift", "Copycat"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				canUseZMoves: true,
				zMoveUsableTypes: ["Normal"],
				pokemon: [
					{
						id: "Dartrix",
						name: "hau-rowlet",
						level: 17,
						ability: "Overgrow",
						activeMoves: ["Leafage", "Growl", "Peck", "Astonish"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 10, attack: 15, defense: 5, specialAttack: 30, specialDefense: 5, speed: 20 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 16,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
						evs: { hp: 15, attack: 20, defense: 10, specialAttack: 15, specialDefense: 15, speed: 20 },
					},
					{
						id: "Noibat",
						name: "hau-noibat",
						level: 14,
						ability: "Infiltrator",
						activeMoves: ["Tackle", "Bite", "Double Team", "Supersonic"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
					{
						id: "Eevee",
						name: "hau-eevee",
						level: 14,
						ability: "Adaptability",
						activeMoves: ["Baby-Doll Eyes", "Play Nice", "Swift", "Copycat"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			},
			{
				name: "Hau",
				canUseZMoves: true,
				zMoveUsableTypes: ["Normal"],
				pokemon: [
					{
						id: "Torracat",
						name: "hau-litten",
						level: 17,
						ability: "Blaze",
						activeMoves: ["Ember", "Growl", "Scratch", "Lick"],
						ivs: { hp: 25, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 15 },
						evs: { hp: 10, attack: 15, defense: 5, specialAttack: 30, specialDefense: 5, speed: 20 },
					},
					{
						id: "Pikachu",
						name: "hau-pichu",
						level: 16,
						ability: "Static",
						activeMoves: ["Growl", "Play Nice", "Quick Attack", "Electro Ball"],
						ivs: { hp: 15, attack: 15, defense: 15, specialAttack: 25, specialDefense: 10, speed: 20 },
						evs: { hp: 15, attack: 20, defense: 10, specialAttack: 15, specialDefense: 15, speed: 20 },
					},
					{
						id: "Noibat",
						name: "hau-noibat",
						level: 14,
						ability: "Infiltrator",
						activeMoves: ["Tackle", "Bite", "Double Team", "Supersonic"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
					{
						id: "Eevee",
						name: "hau-eevee",
						level: 14,
						ability: "Adaptability",
						activeMoves: ["Baby-Doll Eyes", "Play Nice", "Swift", "Copycat"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 10, specialDefense: 10, speed: 20 },
						evs: { hp: 5, attack: 10, defense: 5, specialAttack: 5, specialDefense: 5, speed: 20 },
					},
				]
			}
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-paniola-town" },

			{ type: "dialogue", source: "route-4-4-dialogue" },
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
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "won" },
			{ type: "fight", trainer: 2, label: "Litten" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "won" },
			{ type: "fight", trainer: 0, label: "Popplio" },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "jump", jumpTo: "won" },
			
			{ type: "dialogue", source: "route-4-4-dialogue-won", label: "won", fadeOut: false },
		]
	},
	//4-5: Tauros, Miltank, Mareep | Wesley
	{
		id: "Route 4-5",
		category: "Route 4",
		name: "Route 4-5",
		music: "SM Wild Pokemon Battle",
		icon: "5",
		position: {
			left: 0.32,
			top: 0.30
		},
		images: {
			"route-bg-ranch": "src/img/bg/ranch.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 18
				return 21
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 18
				return 21
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Mareep", levelMin: 13, levelMax: 15, weight: 3 },
					{ id: "Miltank", levelMin: 13, levelMax: 15, weight: 3 },
					{ id: "Tauros", levelMin: 13, levelMax: 15, weight: 3 },
					{ id: "Lillipup", levelMin: 13, levelMax: 15, weight: 1 },
					{ id: "Mudbray", levelMin: 13, levelMax: 15, weight: 1 },
				]
			},
			//Easy
			{
				name: "Wesley",
				class: "Pokemon-Breeder-Gen7",
				bypassTrainerAnimation: true,
				pokemon: [
					{
						id: "Tauros",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Assurance", "Payback", "Work Up", "Tackle"],
					},
					{
						id: "Tauros",
						level: 16,
						pokeball: "pokeball",
						activeMoves: ["Assurance", "Horn Attack", "Payback", "Work Up"],
					},
					{
						id: "Miltank",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Stomp", "Heal Bell", "Rollout", "Defense Curl"],
					},
					{
						id: "Mareep",
						name: "4-5-wesley-mareep",
						isAce: true,
						level: 5,
						pokeball: "pokeball",
						activeMoves: ["Charge", "Discharge"],
					},
				]
			},
			//Hard
			{
				name: "Wesley",
				class: "Pokemon-Breeder-Gen7",
				bypassTrainerAnimation: true,
				pokemon: [
					{
						id: "Tauros",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Assurance", "Payback", "Work Up", "Tackle"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 50, attack: 50, defense: 35, specialAttack: 10, specialDefense: 20, speed: 30 },
					},
					{
						id: "Tauros",
						level: 16,
						pokeball: "pokeball",
						activeMoves: ["Assurance", "Horn Attack", "Payback", "Work Up"],
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 5, specialDefense: 5, speed: 25 },
						evs: { hp: 60, attack: 60, defense: 5, specialAttack: 10, specialDefense: 20, speed: 20 },
					},
					{
						id: "Miltank",
						level: 15,
						pokeball: "pokeball",
						activeMoves: ["Stomp", "Heal Bell", "Rollout", "Defense Curl"],
						ivs: { hp: 25, attack: 25, defense: 15, specialAttack: 5, specialDefense: 15, speed: 5 },
						evs: { hp: 80, attack: 20, defense: 35, specialAttack: 10, specialDefense: 40, speed: 0 },
					},
					{
						id: "Mareep",
						name: "4-5-wesley-mareep",
						isAce: true,
						level: 13,
						pokeball: "pokeball",
						activeMoves: ["Charge", "Discharge"],
						nature: "Rash",
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 31, specialDefense: 5, speed: 25 },
						evs: { hp: 0, attack: 0, defense: 0, specialAttack: 100, specialDefense: 0, speed: 0 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-ranch" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-4-5-dialogue" },
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
			{ type: "dialogue", source: "route-4-5-dialogue-won", fadeOut: false },
		]
	},
	//4-6: Fomantis | Yuka
	{
		id: "Route 4-6",
		category: "Route 4",
		name: "Route 4-6",
		music: "SM Wild Pokemon Battle",
		icon: "6",
		position: {
			left: 0.25,
			top: 0.245
		},
		images: {
			"route-bg-forest-path-2": "src/img/bg/forest path 2.jpg",
			"route-bg-forest-path-2-night": "src/img/bg/forest path 2 night.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 18
				return 21
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 18
				return 21
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Fomantis", levelMin: 13, levelMax: 16, weight: 3 },
					{ id: "Lillipup", levelMin: 13, levelMax: 16, weight: 1 },
					{ id: "Pikipek", levelMin: 13, levelMax: 16, weight: 1 },
					{ id: "Caterpie", levelMin: 13, levelMax: 16, weight: 1 },
					{ id: "Grubbin", levelMin: 13, levelMax: 16, weight: 1 },
					{ id: "Crabrawler", levelMin: 13, levelMax: 16, weight: 0.5 },
					{ id: "Metapod", levelMin: 13, levelMax: 16, weight: 0.5 },
					{ id: "Butterfree", levelMin: 13, levelMax: 16, weight: 0.2 },
				]
			},
			//Easy
			{
				name: "Yuka",
				class: "Pokemon-Breeder-Gen7-F",
				pokemon: [
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-2",
						ability: "Effect Spore",
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Light Screen", "Sleep Powder", "Astonish", "Mega Drain"],
					},
					{
						id: "Ledyba",
						name: "4-6-yuka-ledyba",
						level: 16,
						pokeball: "great ball",
						activeMoves: ["Mach Punch", "Reflect", "Swift", "Supersonic"],
					},
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-shiny",
						ability: "Effect Spore",
						isShiny: true,
						isAce: true,
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Moonlight", "Ingrain", "Astonish", "Mega Drain"],
					},
				]
			},
			//Hard
			{
				name: "Yuka",
				class: "Pokemon-Breeder-Gen7-F",
				pokemon: [
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-1",
						ability: "Effect Spore",
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Reflect", "Poison Powder", "Astonish", "Mega Drain"],
					},
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-2",
						ability: "Effect Spore",
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Light Screen", "Sleep Powder", "Confuse Ray", "Mega Drain"],
					},
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-3",
						ability: "Effect Spore",
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Draining Kiss", "Stun Spore", "Astonish", "Mega Drain"],
					},
					{
						id: "Ledyba",
						name: "4-6-yuka-ledyba",
						level: 16,
						pokeball: "great ball",
						activeMoves: ["Mach Punch", "Reflect", "Swift", "Supersonic"],
					},
					{
						id: "Morelull",
						name: "4-6-yuka-morelull-shiny",
						ability: "Effect Spore",
						isShiny: true,
						isAce: true,
						level: 15,
						pokeball: "dusk ball",
						activeMoves: ["Moonlight", "Ingrain", "Astonish", "Mega Drain"],
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-forest-path-2" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "change-background-image", name: "route-bg-forest-path-2-night", duration: 5000, combineFades: true },
			{ type: "dialogue", source: "route-4-6-dialogue" },
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
			{ type: "dialogue", source: "route-4-6-dialogue-won", fadeOut: false },
		]
	},
	//4-7: Fight with Gladion
	{
		id: "Route 4-7",
		category: "Route 4",
		name: "Route 4-7",
		music: "Route 201 (Day)",
		icon: "7",
		position: {
			left: 0.30,
			top: 0.17
		},
		images: {
			"route-bg-route-5": "src/img/bg/route 5.jpg"
		},
		recommendedLevels: {
			"normal": 19,
			"hard": 19
		},
		trainers: [
			{
				name: "Gladion-stance",
				pokemon: [
					{
						id: "Zubat",
						level: 17,
						ability: "Inner Focus",
						activeMoves: ["Bite", "Wing Attack", "Poison Fang", "Astonish"],
					},
					{
						id: "Poochyena",
						level: 17,
						ability: "Rattled",
						activeMoves: ["Bite", "Tackle", "Sand Attack", "Howl"],
					},
					{
						id: "Houndour",
						level: 17,
						ability: "Unnerve",
						activeMoves: ["Roar", "Ember", "Smog", "Howl"],
					},
					{
						id: "Zorua",
						level: 17,
						ability: "Illusion",
						activeMoves: ["Fury Swipes", "Torment", "Hone Claws", "Knock Off"],
					},
					{
						id: "Type: Null",
						name: "gladion-type-null",
						isAce: true,
						level: 18,
						ability: "Battle Armor",
						activeMoves: ["Double Hit", "Aerial Ace", "Imprison", "Scary Face"],
					},
				]
			},
			{
				name: "Gladion-stance",
				pokemon: [
					{
						id: "Zubat",
						level: 17,
						ability: "Inner Focus",
						activeMoves: ["Bite", "Wing Attack", "Poison Fang", "Astonish"],
						nature: "adamant",
						ivs: { hp: 15, attack: 25, defense: 15, specialAttack: 15, specialDefense: 5, speed: 25 },
						evs: { hp: 30, attack: 50, defense: 35, specialAttack: 30, specialDefense: 30, speed: 30 },
					},
					{
						id: "Poochyena",
						level: 17,
						ability: "Rattled",
						activeMoves: ["Bite", "Tackle", "Sand Attack", "Howl"],
						nature: "adamant",
						ivs: { hp: 15, attack: 30, defense: 20, specialAttack: 10, specialDefense: 5, speed: 25 },
						evs: { hp: 30, attack: 60, defense: 35, specialAttack: 20, specialDefense: 30, speed: 40 },
					},
					{
						id: "Houndour",
						level: 17,
						ability: "Unnerve",
						activeMoves: ["Roar", "Ember", "Smog", "Howl"],
						nature: "modest",
						ivs: { hp: 15, attack: 10, defense: 20, specialAttack: 30, specialDefense: 15, speed: 15 },
						evs: { hp: 30, attack: 20, defense: 35, specialAttack: 60, specialDefense: 30, speed: 40 },
					},
					{
						id: "Zorua",
						level: 17,
						ability: "Illusion",
						activeMoves: ["Fury Swipes", "Torment", "Hone Claws", "Knock Off"],
						nature: "hasty",
						ivs: { hp: 15, attack: 30, defense: 20, specialAttack: 10, specialDefense: 15, speed: 25 },
						evs: { hp: 30, attack: 60, defense: 35, specialAttack: 20, specialDefense: 30, speed: 40 },
					},
					{
						id: "Type: Null",
						name: "gladion-type-null",
						isAce: true,
						level: 18,
						ability: "Battle Armor",
						activeMoves: ["Double Hit", "Aerial Ace", "Imprison", "Scary Face"],
						nature: "adamant",
						ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
						evs: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-route-5" },
			{ type: "dialogue", source: "route-4-7-dialogue" },
			{ type: "change-music", music: "SM Gladion Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			{ type: "fight", trainer: 0, label: "easyMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "fight", trainer: 1, label: "hardMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check" },
			{ type: "dialogue", source: "route-4-7-dialogue-won", fadeOut: false },
		]
	},
	
	//5-1: Paras, Morelull, Dewpider, Surskit | Mikiko
	{
		id: "Route 5-1",
		category: "Route 5",
		name: "Route 5-1",
		music: "SM Wild Pokemon Battle",
		icon: "1",
		position: {
			left: 0.24,
			top: 0.16
		},
		images: {
			"route-bg-brooklet-hill-1": "src/img/bg/brooklet hill 1.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 19
				return 22
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 19
				return 22
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Paras", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Morelull", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Dewpider", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Surskit", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Wingull", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Lillipup", levelMin: 14, levelMax: 17, weight: 1 },
				]
			},
			//Easy
			{
				name: "Mikiko",
				class: "Backpacker-Gen7-F",
				pokemon: [
					{
						id: "Fletchling",
						name: "5-1-mikiko-fletchling",
						level: 17,
						ability: "Gale Wings",
						activeMoves: ["Acrobatics", "Flail", "Growl", "Ember"],
						evs: { hp: 30, attack: 35, defense: 15, specialAttack: 15, specialDefense: 30, speed: 15 },
					},
					{
						id: "Litleo",
						name: "5-1-mikiko-litleo",
						pokeball: "great ball",
						level: 17,
						ability: "Rattled",
						activeMoves: ["Noble Roar", "Headbutt", "Work Up", "Tackle"],
						evs: { hp: 30, attack: 35, defense: 25, specialAttack: 15, specialDefense: 15, speed: 20 },
					},
					{
						id: "Espurr",
						name: "5-1-mikiko-espurr",
						level: 17,
						ability: "Keen Eye",
						activeMoves: ["Confusion", "Disarming Voice", "Reflect", "Fake Tears"],
						evs: { hp: 30, attack: 15, defense: 15, specialAttack: 35, specialDefense: 30, speed: 20 },
					},
				]
			},
			//Hard
			{
				name: "Mikiko",
				class: "Backpacker-Gen7-F",
				pokemon: [
					{
						id: "Fletchling",
						name: "5-1-mikiko-fletchling",
						level: 17,
						ability: "Gale Wings",
						activeMoves: ["Acrobatics", "Flail", "Growl", "Ember"],
						nature: "adamant",
						ivs: { hp: 15, attack: 30, defense: 20, specialAttack: 15, specialDefense: 10, speed: 25 },
						evs: { hp: 60, attack: 70, defense: 35, specialAttack: 30, specialDefense: 60, speed: 30 },
					},
					{
						id: "Litleo",
						name: "5-1-mikiko-litleo",
						pokeball: "great ball",
						level: 17,
						ability: "Rattled",
						activeMoves: ["Noble Roar", "Headbutt", "Work Up", "Tackle"],
						nature: "adamant",
						ivs: { hp: 15, attack: 30, defense: 20, specialAttack: 15, specialDefense: 10, speed: 25 },
						evs: { hp: 60, attack: 70, defense: 50, specialAttack: 30, specialDefense: 35, speed: 40 },
					},
					{
						id: "Espurr",
						name: "5-1-mikiko-espurr",
						level: 17,
						ability: "Keen Eye",
						activeMoves: ["Confusion", "Disarming Voice", "Reflect", "Fake Tears"],
						nature: "modest",
						ivs: { hp: 20, attack: 10, defense: 25, specialAttack: 30, specialDefense: 15, speed: 15 },
						evs: { hp: 60, attack: 30, defense: 35, specialAttack: 70, specialDefense: 60, speed: 40 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-brooklet-hill-1" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-5-1-dialogue" },
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
			// { type: "dialogue", source: "route-5-1-dialogue-won" },
		]
	},
	//5-2: Psyduck, Poliwag, Surskit | Hal, Ernest, Herbert, Carl
	{
		id: "Route 5-2",
		category: "Route 5",
		name: "Route 5-2",
		music: "SM Wild Pokemon Battle",
		icon: "2",
		position: {
			left: 0.16,
			top: 0.20
		},
		images: {
			"route-bg-brooklet-hill-1": "src/img/bg/brooklet hill 1.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 19
				return 22
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 19
				return 22
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 2,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Psyduck", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Poliwag", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Surskit", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Wingull", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Lillipup", levelMin: 14, levelMax: 17, weight: 1 },
				]
			},
			
			//Easy 1
			{
				name: "Hal",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Tentacool",
						name: "5-2-hal-tentacool",
						pokeball: "net ball",
						level: 17,
						ability: "Liquid Ooze",
						activeMoves: ["Wrap", "Acid", "Poison Sting", "Water Gun"],
						evs: { hp: 30, attack: 35, defense: 25, specialAttack: 15, specialDefense: 30, speed: 15 },
					},
				]
			},
			//Hard 1
			{
				name: "Hal",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Tentacool",
						name: "5-2-hal-tentacool",
						pokeball: "net ball",
						level: 17,
						ability: "Liquid Ooze",
						activeMoves: ["Wrap", "Acid", "Poison Sting", "Water Gun"],
						nature: "hasty",
						ivs: { hp: 20, attack: 20, defense: 25, specialAttack: 20, specialDefense: 15, speed: 15 },
						evs: { hp: 60, attack: 70, defense: 30, specialAttack: 50, specialDefense: 60, speed: 80 },
					},
				]
			},
			
			//Easy 2
			{
				name: "Ernest",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Barboach",
						name: "5-2-ernest-barboach",
						pokeball: "dive ball",
						level: 16,
						ability: "Oblivious",
						activeMoves: ["Water Gun", "Mud-Slap", "Rest", "Water Pulse"],
						evs: { hp: 30, attack: 10, defense: 25, specialAttack: 40, specialDefense: 30, speed: 30 },
					},
					{
						id: "Goldeen",
						name: "5-2-ernest-goldeen",
						pokeball: "net ball",
						level: 17,
						ability: "Swift Swim",
						activeMoves: ["Horn Attack", "Supersonic", "Peck", "Tail Whip"],
						evs: { hp: 40, attack: 35, defense: 15, specialAttack: 15, specialDefense: 20, speed: 25 },
					},
				]
			},
			//Hard 2
			{
				name: "Ernest",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Barboach",
						name: "5-2-ernest-barboach",
						pokeball: "dive ball",
						level: 17,
						ability: "Oblivious",
						activeMoves: ["Water Gun", "Mud-Slap", "Rest", "Water Pulse"],
						nature: "timid",
						ivs: { hp: 20, attack: 20, defense: 25, specialAttack: 20, specialDefense: 15, speed: 15 },
						evs: { hp: 60, attack: 20, defense: 60, specialAttack: 80, specialDefense: 70, speed: 60 },
					},
					{
						id: "Goldeen",
						name: "5-2-ernest-goldeen",
						pokeball: "net ball",
						level: 17,
						ability: "Swift Swim",
						activeMoves: ["Horn Attack", "Supersonic", "Peck", "Tail Whip"],
						nature: "adamant",
						ivs: { hp: 20, attack: 20, defense: 25, specialAttack: 20, specialDefense: 15, speed: 15 },
						evs: { hp: 80, attack: 70, defense: 30, specialAttack: 30, specialDefense: 40, speed: 50 },
					},
				]
			},
			
			//Easy 3
			{
				name: "Herbert",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Poliwag",
						name: "5-2-herbert-poliwag",
						pokeball: "net ball",
						level: 17,
						ability: "Water Absorb",
						activeMoves: ["Bubble Beam", "Mud Shot", "Water Gun", "Rain Dance"],
						evs: { hp: 30, attack: 10, defense: 30, specialAttack: 30, specialDefense: 15, speed: 25 },
					},
				]
			},
			//Hard 3
			{
				name: "Herbert",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Poliwag",
						name: "5-2-herbert-poliwag",
						pokeball: "net ball",
						level: 17,
						ability: "Water Absorb",
						activeMoves: ["Bubble Beam", "Mud Shot", "Water Gun", "Rain Dance"],
						nature: "modest",
						ivs: { hp: 20, attack: 15, defense: 25, specialAttack: 20, specialDefense: 30, speed: 15 },
						evs: { hp: 60, attack: 30, defense: 60, specialAttack: 80, specialDefense: 30, speed: 50 },
					},
				]
			},
			
			//Easy 4
			{
				name: "Carl",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Psyduck",
						name: "5-2-carl-psyduck",
						pokeball: "dive ball",
						level: 17,
						ability: "Cloud Nine",
						activeMoves: ["Zen Headbutt", "Disable", "Water Gun", "Confusion"],
						evs: { hp: 50, attack: 0, defense: 30, specialAttack: 50, specialDefense: 30, speed: 20 },
					},
					{
						id: "Magikarp",
						name: "5-2-carl-magikarp",
						pokeball: "net ball",
						level: 17,
						ability: "Swift Swim",
						activeMoves: ["Splash", "Tackle"],
						evs: { hp: 20, attack: 20, defense: 30, specialAttack: 10, specialDefense: 20, speed: 40 },
					},
				]
			},
			//Hard 4
			{
				name: "Carl",
				class: "Fisherman-Gen7",
				pokemon: [
					{
						id: "Psyduck",
						name: "5-2-carl-psyduck",
						pokeball: "dive ball",
						level: 17,
						ability: "Cloud Nine",
						activeMoves: ["Zen Headbutt", "Disable", "Water Gun", "Confusion"],
						nature: "modest",
						ivs: { hp: 20, attack: 15, defense: 25, specialAttack: 25, specialDefense: 30, speed: 15 },
						evs: { hp: 60, attack: 0, defense: 60, specialAttack: 80, specialDefense: 60, speed: 50 },
					},
					{
						id: "Magikarp",
						name: "5-2-carl-magikarp",
						pokeball: "net ball",
						level: 17,
						ability: "Swift Swim",
						activeMoves: ["Splash", "Tackle", "Flail", "Dragon Rage"],
						nature: "adamant",
						ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
						evs: { hp: 60, attack: 60, defense: 60, specialAttack: 60, specialDefense: 60, speed: 60 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-brooklet-hill-1" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-5-2-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode-1" },
			{ type: "jump", jumpTo: "easyMode-1" },
			{ type: "fight", trainer: 1, label: "easyMode-1" },
			{ type: "jump", jumpTo: "win-check-1" },
			{ type: "fight", trainer: 2, label: "hardMode-1" },
			{ type: "jump", jumpTo: "win-check-1" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check-1" },
			// { type: "dialogue", source: "route-5-2-dialogue-won-1" },

			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode-2" },
			{ type: "jump", jumpTo: "easyMode-2" },
			{ type: "fight", trainer: 3, label: "easyMode-2" },
			{ type: "jump", jumpTo: "win-check-2" },
			{ type: "fight", trainer: 4, label: "hardMode-2" },
			{ type: "jump", jumpTo: "win-check-2" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check-2" },
			// { type: "dialogue", source: "route-5-2-dialogue-won-2" },

			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode-3" },
			{ type: "jump", jumpTo: "easyMode-3" },
			{ type: "fight", trainer: 5, label: "easyMode-3" },
			{ type: "jump", jumpTo: "win-check-3" },
			{ type: "fight", trainer: 6, label: "hardMode-3" },
			{ type: "jump", jumpTo: "win-check-3" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check-3" },
			// { type: "dialogue", source: "route-5-2-dialogue-won-3" },

			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode-4" },
			{ type: "jump", jumpTo: "easyMode-4" },
			{ type: "fight", trainer: 7, label: "easyMode-4" },
			{ type: "jump", jumpTo: "win-check-4" },
			{ type: "fight", trainer: 8, label: "hardMode-4" },
			{ type: "jump", jumpTo: "win-check-4" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check-4" },
			// { type: "dialogue", source: "route-5-2-dialogue-won-4" },
		]
	},
	//5-3: Trial against the big Wishiwashi & Araquanid
	//UNLOCK WATER Z
	{
		id: "Route 5-3",
		category: "Route 5",
		name: "Route 5-3",
		music: "SM Wild Pokemon Battle",
		icon: "3",
		position: {
			left: 0.09,
			top: 0.13
		},
		images: {
			"route-bg-brooklet-hill-1": "src/img/bg/brooklet hill 1.jpg",
			"route-bg-brooklet-hill-2": "src/img/bg/brooklet hill 2.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			}
		},
		trainers: [
			{
				isWild: true,
				shuffle: false,
				strategies: [
					{
						name: "5-3-trial"
					}
				],
				pokemon: [
					{
						id: "Wishiwashi",
						level: 18,
						activeMoves: ["Helping Hand", "Feint Attack", "Brine", "Aqua Ring"],
						evs: { hp: 30, attack: 30, defense: 25, specialAttack: 20, specialDefense: 30, speed: 20 },
					},
					{
						id: "Wishiwashi",
						level: 20,
						tags: ["totem"],
						activeMoves: ["Water Gun", "Growl", "Rain Dance", "Soak"],
						evs: { hp: 100, attack: 50, defense: 50, specialAttack: 120, specialDefense: 200, speed: 30 },
					},
					{
						id: "Alomomola",
						level: 18,
						isAce: true,
						activeMoves: ["Helping Hand", "Double Slap", "Heal Pulse", "Rain Dance"],
						evs: { hp: 30, attack: 25, defense: 25, specialAttack: 25, specialDefense: 30, speed: 20 },
					},
				]
			},
			{
				isWild: true,
				shuffle: false,
				strategies: [
					{
						name: "5-3-trial"
					}
				],
				pokemon: [
					{
						id: "Wishiwashi",
						level: 18,
						activeMoves: ["Helping Hand", "Feint Attack", "Brine", "Aqua Ring"],
						evs: { hp: 30, attack: 30, defense: 25, specialAttack: 20, specialDefense: 30, speed: 20 },
					},
					{
						id: "Dewpider",
						level: 18,
						activeMoves: ["Water Pulse", "Rain Dance", "Bug Bite", "Bubble"],
						evs: { hp: 30, attack: 25, defense: 25, specialAttack: 25, specialDefense: 30, speed: 20 },
					},
					{
						id: "Masquerain",
						level: 18,
						activeMoves: ["Scary Face", "Stun Spore", "Tailwind", "Bug Bite"],
						evs: { hp: 30, attack: 25, defense: 25, specialAttack: 25, specialDefense: 30, speed: 20 },
					},
					{
						id: "Wishiwashi",
						level: 20,
						tags: ["totem"],
						activeMoves: ["Water Gun", "Growl", "Rain Dance", "Soak"],
						evs: { hp: 100, attack: 50, defense: 50, specialAttack: 120, specialDefense: 200, speed: 30 },
					},
					{
						id: "Araquanid",
						level: 20,
						tags: ["totem"],
						activeMoves: ["Leech Life", "Bubble", "Bite", "Aurora Beam"],
						evs: { hp: 100, attack: 50, defense: 50, specialAttack: 120, specialDefense: 200, speed: 30 },
					},
					{
						id: "Alomomola",
						level: 18,
						isAce: true,
						activeMoves: ["Helping Hand", "Double Slap", "Heal Pulse", "Rain Dance"],
						evs: { hp: 30, attack: 25, defense: 25, specialAttack: 25, specialDefense: 30, speed: 20 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-brooklet-hill-1" },
			{ type: "dialogue", source: "route-5-3-dialogue" },
			{ type: "change-music", music: "SM Trainer Battle" },
			{ type: "change-background-image", name: "route-bg-brooklet-hill-2", duration: 30000, combineFades: true },
			{ type: "load-setting", key: "hardMode" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			{ type: "fight", trainer: 0, label: "easyMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "fight", trainer: 1, label: "hardMode" },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check" },
			{ type: "change-background-image", name: "route-bg-brooklet-hill-1", duration: 5000, combineFades: true },
			{ type: "dialogue", source: "route-5-3-dialogue-won", fadeOut: false },
			{ type: "unlock-z-move-type", unlockedType: "Water" },
		]
	},
	//5-4: Oricorio (Pa'u) | Maika
	{
		id: "Route 5-4",
		category: "Route 5",
		name: "Route 5-4",
		music: "SM Wild Pokemon Battle",
		icon: "4",
		position: {
			left: 0.37,
			top: 0.23
		},
		images: {
			"route-bg-route-6": "src/img/bg/route 6.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Oricorio", form: "Pa'u", levelMin: 14, levelMax: 17, weight: 5 },
					{ id: "Lillipup", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Pikipek", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Grubbin", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Yungoos", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Rattata-Alola", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Igglybuff", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Eevee", levelMin: 14, levelMax: 17, weight: 1 },
				]
			},
			{
				name: "Maika",
				class: "Dancer-Gen7",
				pokemon: [
					{
						id: "Oricorio",
						form: "Pom-Pom",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-2",
						level: 17,
						activeMoves: ["Feather Dance", "Agility", "Acrobatics", "Spark"]
					},
					{
						id: "Oricorio",
						form: "Pa'u",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-1",
						level: 17,
						activeMoves: ["Quiver Dance", "Rest", "Teeter Dance", "Psybeam"]
					},
					{
						id: "Oricorio",
						form: "Sensu",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-3",
						level: 17,
						activeMoves: ["Revelation Dance", "Spite", "Peck", "Mean Look"]
					},
					{
						id: "Oricorio",
						form: "Baile",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-4",
						level: 17,
						activeMoves: ["Fiery Dance", "Mystical Fire", "Work Up", "Gust"]
					},
				]
			},
			{
				name: "Maika",
				class: "Dancer-Gen7",
				pokemon: [
					{
						id: "Oricorio",
						form: "Pom-Pom",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-2",
						level: 17,
						activeMoves: ["Feather Dance", "Agility", "Acrobatics", "Spark"],
						nature: "jolly",
						ivs: { hp: 15, attack: 30, defense: 20, specialAttack: 15, specialDefense: 15, speed: 25 },
						evs: { hp: 60, attack: 70, defense: 35, specialAttack: 30, specialDefense: 60, speed: 30 },
					},
					{
						id: "Oricorio",
						form: "Pa'u",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-1",
						level: 17,
						activeMoves: ["Quiver Dance", "Rest", "Teeter Dance", "Psybeam"],
						nature: "modest",
						ivs: { hp: 30, attack: 5, defense: 20, specialAttack: 25, specialDefense: 15, speed: 25 },
						evs: { hp: 60, attack: 30, defense: 35, specialAttack: 70, specialDefense: 60, speed: 30 },
					},
					{
						id: "Oricorio",
						form: "Sensu",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-3",
						level: 17,
						activeMoves: ["Revelation Dance", "Spite", "Peck", "Mean Look"],
						nature: "serious",
						ivs: { hp: 30, attack: 15, defense: 10, specialAttack: 25, specialDefense: 15, speed: 25 },
						evs: { hp: 80, attack: 60, defense: 35, specialAttack: 60, specialDefense: 60, speed: 30 },
					},
					{
						id: "Oricorio",
						form: "Baile",
						pokeball: "great ball",
						name: "5-4-maika-oricorio-4",
						level: 17,
						activeMoves: ["Fiery Dance", "Mystical Fire", "Work Up", "Gust"],
						nature: "rash",
						ivs: { hp: 30, attack: 5, defense: 20, specialAttack: 25, specialDefense: 15, speed: 25 },
						evs: { hp: 60, attack: 30, defense: 60, specialAttack: 70, specialDefense: 30, speed: 30 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "route-bg-route-6" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-5-4-dialogue" },
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
		]
	},
	//5-5: Battle Royale
	{
		id: "Route 5-5",
		category: "Route 5",
		name: "Route 5-5",
		icon: "5",
		position: {
			left: 0.57,
			top: 0.31
		},
		images: {
			"battle-royale-dome-exterior": "src/img/bg/battle royale dome exterior.jpg",
			"battle-royale-dome-interior": "src/img/bg/battle royale dome interior.jpg",
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 21
				return 25
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 21
				return 25
			}
		},
		trainers: [
			{ // Beauty Hana
				name: "Hana",
				class: "Beauty-Gen6",
				tags: ["contestant"],
				introDialogue: "route-5-5-hana-intro",
				winDialogue: "route-5-5-hana-win",
				pokemon: [
					{
						id: "Furfrou",
						form: "Diamond",
						pokeball: "luxury ball",
						name: "5-5-hana-furfrou",
						level: 17
					},
					{
						id: "Minccino",
						pokeball: "luxury ball",
						name: "5-5-hana-minccino",
						level: 17
					},
					{
						id: "Oricorio",
						form: "Pom-Pom",
						pokeball: "luxury ball",
						name: "5-5-hana-oricorio",
						level: 17
					},
				]
			},
			{ // Engineer Mr Fix
				name: "Mr. Fix",
				class: "Engineer-Gen3",
				tags: ["contestant"],
				introDialogue: "route-5-5-mr-fix-intro",
				winDialogue: "route-5-5-mr-fix-win",
				pokemon: [
					{
						id: "Magnemite",
						pokeball: "great ball",
						name: "5-5-mr-fix-magnemite",
						level: 17
					},
					{
						id: "Togedemaru",
						pokeball: "great ball",
						name: "5-5-mr-fix-togedemaru",
						level: 17
					},
					{
						id: "Klink",
						pokeball: "great ball",
						name: "5-5-mr-fix-klink",
						level: 17
					},
				]
			},
			{ // Surfer Keola
				name: "Keola",
				class: "Surfer",
				tags: ["contestant"],
				introDialogue: "route-5-5-keola-intro",
				winDialogue: "route-5-5-keola-win",
				pokemon: [
					{
						id: "Wingull",
						pokeball: "dive ball",
						name: "5-5-keola-wingull",
						level: 17
					},
					{
						id: "Raichu-Alola",
						pokeball: "dive ball",
						name: "5-5-keola-raichu",
						level: 17
					},
					{
						id: "Poliwhirl",
						pokeball: "dive ball",
						name: "5-5-keola-poliwhirl",
						level: 17
					},
				]
			},
			{ // Aroma Lady Elizabeth
				name: "Elizabeth",
				class: "Aroma-Lady",
				tags: ["contestant"],
				introDialogue: "route-5-5-elizabeth-intro",
				winDialogue: "route-5-5-elizabeth-win",
				pokemon: [
					{
						id: "Comfey",
						pokeball: "friend ball",
						name: "5-5-elizabeth-comfey",
						level: 17
					},
					{
						id: "Cherrim",
						pokeball: "friend ball",
						name: "5-5-elizabeth-cherrim",
						level: 17
					},
					{
						id: "Roselia",
						pokeball: "friend ball",
						name: "5-5-elizabeth-roselia",
						level: 17
					},
				]
			},
			{ // Striker Johnathan
				name: "Johnathan",
				class: "Striker",
				tags: ["contestant"],
				introDialogue: "route-5-5-johnathan-intro",
				winDialogue: "route-5-5-johnathan-win",
				pokemon: [
					{
						id: "Hitmonlee",
						pokeball: "timer ball",
						name: "5-5-johnathan-hitmonlee",
						level: 17
					},
					{
						id: "Passimian",
						pokeball: "timer ball",
						name: "5-5-johnathan-passimian",
						level: 17
					},
					{
						id: "Voltorb",
						pokeball: "timer ball",
						name: "5-5-johnathan-voltorb",
						level: 17
					},
				]
			},
			{ // Firebreather Keahi
				name: "Keahi",
				class: "Firebreather",
				tags: ["contestant"],
				introDialogue: "route-5-5-keahi-intro",
				winDialogue: "route-5-5-keahi-win",
				pokemon: [
					{
						id: "Magby",
						pokeball: "repeat ball",
						name: "5-5-keahi-magby",
						level: 17
					},
					{
						id: "Houndour",
						pokeball: "repeat ball",
						name: "5-5-keahi-houndour",
						level: 17
					},
					{
						id: "Growlithe",
						pokeball: "repeat ball",
						name: "5-5-keahi-growlithe",
						level: 17
					},
				]
			},
			{ // Punk Girl Margo
				name: "Margo",
				class: "Punk-Girl-Gen7",
				tags: ["contestant"],
				introDialogue: "route-5-5-margo-intro",
				winDialogue: "route-5-5-margo-win",
				pokemon: [
					{
						id: "Poochyena",
						pokeball: "dusk ball",
						name: "5-5-margo-poochyena",
						level: 17
					},
					{
						id: "Zorua",
						pokeball: "dusk ball",
						name: "5-5-margo-zorua",
						level: 17
					},
					{
						id: "Sableye",
						pokeball: "dusk ball",
						name: "5-5-margo-sableye",
						isAce: true,
						level: 17
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "battle-royale-dome-exterior" },
			{ type: "dialogue", source: "route-5-5-dialogue" },
			{ type: "get-val-from-obj", key: "participate", obj: -1 },
			{ type: "set-variable", name: "skipping" },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-truthy", jumpTo: "skip" },
			{ type: "jump", jumpTo: "enter" },

			{ type: "change-music", music: "SM Trainer Battle", label: "enter" },
			{ type: "load-setting", key: "hardMode" },
			{ type: "change-background-image", name: "battle-royale-dome-interior" },
			{ type: "load-value", value: true },
			{ type: "jump-if-equal", jumpTo: "hardMode" },
			{ type: "jump", jumpTo: "easyMode" },
			{ type: "tournament", label: "easyMode", contestantTag: "contestant", dialogues: [
				"route-5-5-dialogue-2",
				"route-5-5-dialogue-3",
				"route-5-5-dialogue-4",
				"route-5-5-dialogue-5",
			], lossDialogue: "route-5-5-lose", neededWins: 4, waningHP: true },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "tournament", label: "hardMode", contestantTag: "contestant", dialogues: [
				"route-5-5-dialogue-2",
				"route-5-5-dialogue-3",
				"route-5-5-dialogue-4",
				"route-5-5-dialogue-5",
			], lossDialogue: "route-5-5-lose", neededWins: 4, waningHP: false },
			{ type: "jump", jumpTo: "win-check" },
			{ type: "jump-if-lost", jumpTo: Infinity, label: "win-check" },
			{ type: "dialogue", source: "route-5-5-win", fadeOut: false },
			{ type: "change-music", music: "Route 201 (Day)" },
			{ type: "change-background-image", name: "battle-royale-dome-exterior" },
			{ type: "dialogue", source: "route-5-5-win-2", fadeOut: false },
			{ type: "jump", jumpTo: Infinity },
			
			{ type: "mark-as-lost", label: "skip" },
		]
	},
	//5-6: Finneon, Pyukumuku, Wishiwashi, Staryu | Dakota
	{
		id: "Route 5-6",
		category: "Route 5",
		name: "Route 5-6",
		music: "SM Wild Pokemon Battle",
		icon: "6",
		position: {
			left: 0.67,
			top: 0.18
		},
		images: {
			"wela-volcano-park-lower-level": "src/img/bg/wela volcano park lower level.jpg"
		},
		recommendedLevels: {
			"normal": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			},
			"hard": (pokemonList) => {
				if (pokemonList.length >= 3) return 20
				return 22
			}
		},
		trainers: [
			{
				isWild: true,
				targetPokemon: 4,
				canPickDuplicates: false,
				possiblePokemon: [
					{ id: "Finneon", levelMin: 14, levelMax: 17, weight: 5 },
					{ id: "Pyukumuku", levelMin: 14, levelMax: 17, weight: 5 },
					{ id: "Magikarp", levelMin: 14, levelMax: 17, weight: 5 },
					{ id: "Wishiwashi", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Staryu", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Tentacool", levelMin: 14, levelMax: 17, weight: 3 },
					{ id: "Wingull", levelMin: 14, levelMax: 17, weight: 1 },
					{ id: "Diglett-Alola", levelMin: 14, levelMax: 17, weight: 1 },
				]
			},
			// Easy
			{
				name: "Dakota",
				class: "Swimmer-Gen7",
				pokemon: [
					{
						id: "Surskit",
						pokeball: "great ball",
						name: "5-6-dakota-surskit",
						level: 19
					},
					{
						id: "Dewpider",
						pokeball: "great ball",
						name: "5-6-dakota-dewpider",
						level: 19
					},
					{
						id: "Mareanie",
						pokeball: "dive ball",
						name: "5-6-dakota-mareanie",
						level: 19
					},
				]
			},
			// Hard
			{
				name: "Dakota",
				class: "Swimmer-Gen7",
				pokemon: [
					{
						id: "Surskit",
						pokeball: "great ball",
						name: "5-6-dakota-surskit",
						level: 19,
						activeMoves: ["Water Gun", "Agility", "Leech Life", "Quick Attack"],
						nature: "rash",
						ivs: { hp: 15, attack: 20, defense: 20, specialAttack: 25, specialDefense: 20, speed: 25 },
						evs: { hp: 60, attack: 70, defense: 35, specialAttack: 50, specialDefense: 20, speed: 70 },
					},
					{
						id: "Dewpider",
						pokeball: "great ball",
						name: "5-6-dakota-dewpider",
						level: 19,
						activeMoves: ["Headbutt", "Crunch", "Bug Bite", "Aqua Ring"],
						nature: "adamant",
						ivs: { hp: 30, attack: 30, defense: 20, specialAttack: 15, specialDefense: 15, speed: 15 },
						evs: { hp: 70, attack: 70, defense: 50, specialAttack: 30, specialDefense: 50, speed: 30 },
					},
					{
						id: "Mareanie",
						pokeball: "dive ball",
						name: "5-6-dakota-mareanie",
						level: 19,
						activeMoves: ["Venoshock", "Recover", "Poison Sting", "Bite"],
						nature: "careful",
						ivs: { hp: 30, attack: 20, defense: 30, specialAttack: 15, specialDefense: 15, speed: 25 },
						evs: { hp: 100, attack: 30, defense: 80, specialAttack: 30, specialDefense: 60, speed: 30 },
					},
				]
			},
		],
		effects: [
			{ type: "change-background-image", name: "wela-volcano-park-lower-level" },
			{ type: "fight", trainer: 0 },
			{ type: "jump-if-lost", jumpTo: Infinity },
			{ type: "dialogue", source: "route-5-6-dialogue" },
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
			
			let pokemonList = trainerData.pokemon
			if (trainerData.possiblePokemon) {
				pokemonList = pokemonList.concat(trainerData.possiblePokemon)
			}

			if (trainerData.isWild) {
				for (let pokemonData of pokemonList) {
					let id = pokemonData.id
					if (!level.obtainablePokemon.includes(id)) {
						level.obtainablePokemon.push(id)
					}
				}
			}

			for (let pData of pokemonList){
				let data = pokemonData[pData.id]
				if (!data){
					console.warn(pData.id,"is not defined for level",level.id)
				}
				if (pData.activeMoves){
					for (let moveId of pData.activeMoves){
						let move = pokemonMoveData[moveId]
						if (!move){
							console.warn("A pokemon in level", level.id, "wants to learn",moveId,"but that move doesn't exist.")
						}
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

		let components = []
		if (!unlocked && category.debugOnly){
			components.push(config['debug'])
		}
		if (!unlocked && category.prerequisites) {
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
			components.push(shouldUnlock)
		}

		if (!unlocked && components.length){
			unlocked = components.every(c => c)
		}

		category.unlocked = unlocked
	}
}

const pokeballImages = {
	"pokeball": {
		"icon": "src/img/balls/pokeball.png"
	},
	"great ball": {
		"icon": "src/img/balls/great ball.png"
	},
	"ultra ball": {
		"icon": "src/img/balls/ultra ball.png"
	},
	"premier ball": {
		"icon": "src/img/balls/premier ball.png"
	},
	"luxury ball": {
		"icon": "src/img/balls/luxury ball.png"
	},
	"net ball": {
		"icon": "src/img/balls/net ball.png"
	},
	"dive ball": {
		"icon": "src/img/balls/dive ball.png"
	},
	"dusk ball": {
		"icon": "src/img/balls/dusk ball.png"
	},
	"friend ball": {
		"icon": "src/img/balls/friend ball.png"
	},
}
const pokeballSpriteData = {
	types: {
		"pokeball": [0, 3],
		"great ball": [0, 3 + 26 * 1],
		"ultra ball": [0, 3 + 26 * 2],
		"master ball": [0, 3 + 26 * 3],
		"premier ball": [0, 3 + 26 * 4],
		"cherish ball": [0, 3 + 26 * 5],
		"luxury ball": [0, 3 + 26 * 6],
		"nest ball": [0, 3 + 26 * 7],
		"net ball": [0, 3 + 26 * 8],
		"dive ball": [0, 3 + 26 * 9],
		"repeat ball": [0, 3 + 26 * 10],
		"timer ball": [0, 3 + 26 * 11],
		"safari ball": [0, 3 + 26 * 12],
		"quick ball": [0, 3 + 26 * 13],
		"dusk ball": [0, 3 + 26 * 14],
		"heal ball": [0, 3 + 26 * 15],
		"friend ball": [0, 452],
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