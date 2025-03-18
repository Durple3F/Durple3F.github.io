const songData = {
	"Route 201 (Day)": {source: "src/audio/songs/route201-2.mp3"},
	"SM Trainer Battle": {source: "src/audio/songs/sm trainer battle.mp3"},
	"SM Wild Pokemon Battle": {source: "src/audio/songs/sm wild pokemon battle.mp3"},
}

const boxThemeData = {
	"forest_frlg": {
		"header": "src/img/wallpapers/forest_frlg_header.png",
		"body": "src/img/wallpapers/forest_frlg.png",
		"color": "black"
	}
}

const NPCTrainerData = {
	"Hau": {
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/hau.png"
		}
	}
}

const trainerAnimations = {
	"default-throw-pokeball": function(tag){
		let promise = new Promise(resolve => {
			let resolved = false
			let animation = p => {
				let rotate = 0
				if (p < 0.4){
					let partP = (p - 0) / (0.4 - 0)
					rotate = interpolate(0, 30, bezierEase(partP))
				} else if (p < 0.7) {
					let partP = (p - 0.4) / (0.7 - 0.4)
					rotate = interpolate(30, -10, bezierEase(partP))
				} else {
					let partP = (p - 0.7) / (1 - 0.7)
					rotate = interpolate(-10, 0, bezierEase(partP))
				}
				tag.css({
					transform: "rotate(" + rotate + "deg)"
				})
				if (p > 0.5 && !resolved){
					resolve()
					resolved = true
				}
			}
			delay(500).then(() => {
				$({val: 0}).animate({val: 1}, {
					duration: 800,
					easing: "linear",
					step: function(){
						animation(this.val)
					},
					complete: function(){
						animation(1)
					}
				})
			})
		})
		return promise
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
		// description: "Route 1-1-description",
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
			{type: "load-player-info", key: "chosen-starter"},
			{type: "load-value", value: "Rowlet"},
			{type: "jump-if-equal", jumpTo: "Litten"},
			{type: "load-player-info", key: "chosen-starter"},
			{type: "load-value", value: "Litten"},
			{type: "jump-if-equal", jumpTo: "Popplio"},
			{type: "fight", trainer: 1, label: "Rowlet"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 2, label: "Litten"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 0, label: "Popplio"},
			{type: "jump", jumpTo: Infinity},
		]
	},
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
					},
					{
						id: "Ledyba",
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
						id: "Ledyba",
						levelMin: 2, levelMax: 3
					},
					{
						id: "Pichu",
						levelMin: 3, levelMax: 5
					},
				]
			},
		],
		effects: [
			{type: "random-number", min: 1, max: 10},
			{type: "load-value", value: 10},
			{type: "jump-if-less-than", jumpTo: "Normal"},
			{type: "fight", trainer: 1, label: "Pichu"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 0, label: "Normal"}
		]
	},
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
						id: "Yungoos",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Rattata-Alola",
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
						id: "Yungoos",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Rattata-Alola",
						levelMin: 3, levelMax: 4
					},
					{
						id: "Grubbin",
						levelMin: 4, levelMax: 6
					}
				]
			}
		],
		effects: [
			{type: "random-number", min: 1, max: 10},
			{type: "load-value", value: 10},
			{type: "jump-if-less-than", jumpTo: "Normal"},
			{type: "fight", trainer: 1, label: "Grubbin"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 0, label: "Normal"}
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
			{type: "load-player-info", key: "chosen-starter"},
			{type: "load-value", value: "Rowlet"},
			{type: "jump-if-equal", jumpTo: "Litten"},
			{type: "load-player-info", key: "chosen-starter"},
			{type: "load-value", value: "Litten"},
			{type: "jump-if-equal", jumpTo: "Popplio"},
			{type: "fight", trainer: 1, label: "Rowlet"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 2, label: "Litten"},
			{type: "jump", jumpTo: Infinity},
			{type: "fight", trainer: 0, label: "Popplio"},
			{type: "jump", jumpTo: Infinity},
		]
	},
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
						levelMin: 5, levelMax: 7
					},
				]
			},
		],
		effects: [
			{type: "fight", trainer: 0}
		]
	},
]

for (let level of levelData){
	level.status = "not won"
}

function getLevelButtonHtml(level){
	let btn = $(`<button class='btn btn-primary level-button'></button>`)
	if (level.status === "won"){
		btn.addClass("won")
	}
	let inner = $(`<div class='inner'></div>`)
	inner.append(`<span class='icon'>${level.icon}</span>`)
	btn.append(inner)
	btn.attr("data-level", level.id)
	return btn
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

function renderPokeballSmallCanvas(canvasTag, type, sprite){
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
function renderPokeballSpinSmallCanvas(canvas, direction){
	let directionMult = -1
	if (direction === "left"){
		directionMult = -1
	}
	if (direction === "right"){
		directionMult = 1
	}
	return new Promise(resolve => {
		let resolved = false
		const animate = p => {
			let top = 1.6 * (p - 0.4) * (p - 0.4) + 0.25
			canvas.css({
				transform: `translate(-50%, -50%) rotate(${p * 10 * directionMult}turn)`,
				top: `${top * 100}%`
			})
		}
		$({val: 0}).animate({val: 1}, {
			duration: 1200,
			easing: "linear",
			step: function(){
				if (this.val > 0.9 && !resolved){
					resolve()
					resolved = true
				}
				animate(this.val)
			},
			complete: function(){
				animate(1)
			}
		})
	})
}