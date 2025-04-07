const songData = {
	"Route 201 (Day)": { source: "src/audio/songs/route201-2.mp3" },
	"SM Trainer Battle": { source: "src/audio/songs/sm trainer battle.mp3" },
	"SM Wild Pokemon Battle": { source: "src/audio/songs/sm wild pokemon battle.mp3" },
	"SM Trainers' School": { source: "src/audio/songs/trainer school.mp3" }
}

const boxThemeData = {
	"forest_frlg": {
		"header": "src/img/wallpapers/forest_frlg_header.png",
		"body": "src/img/wallpapers/forest_frlg.png",
		"color": "black"
	}
}

const levelCategoryData = [
	{
		name: "Route 1"
	}
]

const levelData = [
	// Rival Battle 1
	{
		id: "Route 1-1",
		category: "Route 1",
		name: "Rival Battle 1",
		forgiving: true,
		icon: "1",
		music: "SM Trainer Battle",
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						id: "Popplio",
						level: 5
					}
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Rowlet",
						level: 5
					}
				]
			},
			{
				name: "Hau",
				pokemon: [
					{
						id: "Litten",
						level: 5
					}
				]
			}
		],
		effects: [
			{ type: "dialogue", source: "rival-battle-1-dialogue" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Litten" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
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
	//Caterpie, Pikipek, Pichu? | Jimmy
	{
		id: "Route 1-2",
		category: "Route 1",
		name: "Route 1-2",
		icon: "2",
		music: "SM Wild Pokemon Battle",
		trainers: [
			{
				pokemon: [
					{
						id: "Pikipek",
						levelMin: 2, levelMax: 3
					},
					{
						id: "Caterpie",
						levelMin: 2, levelMax: 3
					}
				]
			},
			{
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
						level: 3
					}
				]
			},
		],
		effects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 0 },
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
			{ type: "fight", trainer: 2 }
		]
	},
	//Spinarak, Ledyba, Grubbin? | Audrey
	{
		id: "Route 1-3",
		category: "Route 1",
		name: "Route 1-3",
		icon: "3",
		music: "SM Wild Pokemon Battle",
		trainers: [
			{
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
						level: 3
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
			{ type: "fight", trainer: 2 }
		]
	},
	// Rival Battle 2
	{
		id: "Route 1-4",
		category: "Route 1",
		name: "Rival Battle 2",
		// description: "Route 1-4-description",
		icon: "4",
		music: "SM Trainer Battle",
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						id: "Popplio",
						level: 7,
						activeMoves: ["Pound", "Water Gun", "Growl"]
					},
					{
						id: "Pichu",
						level: 6,
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
						activeMoves: ["Tackle", "Growl", "Leafage"]
					},
					{
						id: "Pichu",
						level: 6,
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
						activeMoves: ["Scratch", "Growl", "Ember"]
					},
					{
						id: "Pichu",
						level: 6,
						activeMoves: ["Thunder Shock", "Tail Whip", "Charm"]
					},
				]
			}
		],
		effects: [
			{ type: "dialogue", source: "rival-battle-2-dialogue" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Rowlet" },
			{ type: "jump-if-equal", jumpTo: "Litten" },
			{ type: "load-player-info", key: "chosen-starter" },
			{ type: "load-value", value: "Litten" },
			{ type: "jump-if-equal", jumpTo: "Popplio" },
			{ type: "fight", trainer: 1, label: "Rowlet" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 2, label: "Litten" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "fight", trainer: 0, label: "Popplio" },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//Wingull, Yungoos, Ratatta-Alola, Slowpoke? | Kevin / Madison
	{
		id: "Route 1-5",
		category: "Route 1",
		name: "Route 1-5",
		icon: "5",
		music: "SM Wild Pokemon Battle",
		trainers: [
			{
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
						level: 6
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
						level: 6
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

			{ type: "random-number", min: 1, max: 10, label: "TrainerChoice" },
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
	//Magnemite, Meowth-Alola, Grimer-Alola + Lillie Dialogue
	{
		id: "Route 1-6",
		category: "Route 1",
		name: "Route 1-6",
		description: "route-1-6-description",
		icon: "6",
		trainers: [
			{
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
	//Trainer school teacher's challenge
	{
		id: "Route 1-7",
		category: "Route 1",
		name: "Route 1-7",
		description: "route-1-7-description",
		icon: "7",
		music: "SM Trainers' School",
		trainers: [
			{
				name: "Hiromi",
				class: "Young-Athlete-F",
				pokemon: [
					{ id: "Pikipek", name: "Chirpo", level: 8 }
				]
			},
			{
				name: "Mia",
				class: "Preschooler-F-Gen7",
				pokemon: [
					{ id: "Bonsly", name: "Mister Wobbles", level: 7 }
				]
			},
			{
				name: "Joey",
				class: "Youngster-Gen7",
				pokemon: [
					{ id: "Metapod", name: "Podzilla", level: 7 }
				]
			},
			{
				name: "Joseph",
				class: "Rising-Star",
				pokemon: [
					{ id: "Grimer-Alola", level: 8 }
				]
			},
			{
				name: "Emily",
				class: "Teacher-Gen7",
				pokemon: [
					{ id: "Magnemite", name: "Tesla", level: 8 },
					{ id: "Meowth-Alola", name: "Cleo", level: 9 }
				]
			},
		],
		effects: [
			{ type: "dialogue", source: "route-1-7-dialogue-1" },
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
	{
		id: "Route 1-8",
		category: "Route 1",
		name: "Route 1-8",
		music: "SM Wild Pokemon Battle",
		icon: "8",
		trainers: [
			{
				pokemon: [
					{ id: "Pikachu", levelMin: 6, levelMax: 8 },
				]
			}
		],
		effects: [
			{ type: "fight", trainer: 0 },
		]
	},
]

for (let level of levelData) {
	level.status = "not won"
	level.attempts = 0
}

function getLevelDataById(id){
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

const pokeballSpriteData = {
	types: {
		"pokeball": [0, 3]
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
				if (!resolved){
					resolve()
					resolved = true
				}
			}
		})
	})
	return p
}