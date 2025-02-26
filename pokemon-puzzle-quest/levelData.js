const songData = {
	"Route 201 (Day)": {source: "src/audio/songs/route201-2.mp3"},
	"SM Trainer Battle": {source: "src/audio/songs/sm trainer battle.mp3"},
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
	{
		id: "Route 1-1",
		category: "Route 1",
		name: "Test fight",
		icon: "1",
		music: "SM Trainer Battle",
		trainers: [
			{
				name: "Hau",
				pokemon: [
					{
						pokemonName: "Litten",
						level: 2
					}
				]
			}
		],
		effects: [{type: "fight", trainer: 0}]
	},
	{
		id: "Route 1-2",
		category: "Route 1",
		name: "Fight like 7 Comfeys",
		icon: "2",
		music: "SM Trainer Battle",
		trainers: [
			{
				pokemon: [
					{
						pokemonName: "Comfey",
						levelMin: 3, levelMax: 5
					}
				]
			}
		],
		effects: [
			{type: "fight", trainer: 0}
		]
	}
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