const animTemplates = {
	"displace": function(tile, tx, ty, startT, duration, delay=0){
		let animation = {
			type: "displace",
			tile: tile,
			startX: tile.x,
			startY: tile.y,
			startT: startT + delay,
			endX: tx,
			endY: ty,
			endT: startT + delay + duration,
			duration: duration
		}
		return animation
	}
}

const tileTypeColors = {
	"red": "#ff2f35",
	"orange": "#e57526",
	"yellow": "#e8aa00",
	"green": "#82dc42",
	"blue": "#00c0e7",
	"purple": "#dd60dd",
	"black": "#495856",
	"pink": "#9c0132",
	"rainbow": "#ffffff",
}

const RED = new Color("#ff2f35")
function getHighlightColor(color, now){
	if (color === "rainbow"){
		let rotate = now % 360
		rotate /= 300
		return RED.set({"hsl.h": h => h + rotate}).toString()
	}
	return tileTypeColors[color]
}

function getEmptyAnimationBatch(){
	let animations = {
		batch: [],
		info: {},
		halts: false
	}
	let promise = new Promise(resolve => animations.resolve = resolve)
	animations.promise = promise
	return animations
}

function getHealthColor(p){
	if (p >= 0.6){
		return "#47c72c"
	} else if (p >= 0.2){
		return "#ffcc03"
	} else {
		return "#db2428"
	}
}

let tileIconUrls = {
	red: "src/img/tiles/red.png",
	orange: "src/img/tiles/orange.png",
	yellow: "src/img/tiles/yellow.png",
	green: "src/img/tiles/green.png",
	blue: "src/img/tiles/blue.png",
	purple: "src/img/tiles/purple.png",
	black: "src/img/tiles/black.png",
	pink: "src/img/tiles/pink.png",
	rainbow: "src/img/tiles/rainbow.png"
}
function getEnergyIcon(type){
	if (type in tileIconUrls){
		return tileIconUrls[type]
	}
	return `src/img/tiles/${type}.png`
}

function getTypeIcon(type){
	switch (type.toLowerCase()){
		case "normal":
		return "src/img/types/normal.png"
		case "fighting":
		return "src/img/types/fighting.png"
		case "flying":
		return "src/img/types/flying.png"
		case "poison":
		return "src/img/types/poison.png"
		case "ground":
		return "src/img/types/ground.png"
		case "rock":
		return "src/img/types/rock.png"
		case "bug":
		return "src/img/types/bug.png"
		case "ghost":
		return "src/img/types/ghost.png"
		case "steel":
		return "src/img/types/steel.png"
		case "fire":
		return "src/img/types/fire.png"
		case "water":
		return "src/img/types/water.png"
		case "grass":
		return "src/img/types/grass.png"
		case "electric":
		return "src/img/types/electric.png"
		case "psychic":
		return "src/img/types/psychic.png"
		case "ice":
		return "src/img/types/ice.png"
		case "dragon":
		return "src/img/types/dragon.png"
		case "dark":
		return "src/img/types/dark.png"
		case "fairy":
		return "src/img/types/fairy.png"
		case "status":
		return "src/img/types/status.png"
		case "special":
		return "src/img/types/special.png"
		case "physical":
		return "src/img/types/physical.png"
		case "typeless":
		return undefined
		default:
			console.warn("What type is", type)
		return undefined
	}
}

const zMeterColors = {
  "Normal": ["#F5F5F5", "#AAA9AD", "#77777A"],
  "Fire": ["#FFA756", "#EE8130", "#B95810"],
  "Water": ["#58ABF6", "#6390F0", "#3B5BA9"],
  "Electric": ["#FBE273", "#F7D02C", "#C0A100"],
  "Grass": ["#7CDB8A", "#7AC74C", "#4C9230"],
  "Ice": ["#A8F0F4", "#96D9D6", "#5AA4A2"],
  "Fighting": ["#FF7667", "#C22E28", "#861D1A"],
  "Poison": ["#C58BE2", "#A33EA1", "#6B2070"],
  "Ground": ["#E3C38E", "#E2BF65", "#AA8E3F"],
  "Flying": ["#A0C8F0", "#A98FF3", "#7258AA"],
  "Psychic": ["#FF93B5", "#F95587", "#B9325A"],
  "Bug": ["#C6D16E", "#A6B91A", "#717B11"],
  "Rock": ["#D3C08A", "#B6A136", "#7E6916"],
  "Ghost": ["#A181E8", "#735797", "#493360"],
  "Dragon": ["#A48BF4", "#6F35FC", "#4722B6"],
  "Dark": ["#8D8D94", "#705746", "#4C3A2F"],
  "Steel": ["#C1C7D6", "#B7B7CE", "#7B7B8A"],
  "Fairy": ["#FFB7E6", "#D685AD", "#944D72"]
}
function applyColorsToZCrystal(elem, types){
	if (types[0]){
		elem.attr("data-type1", types[0])
		elem.attr("data-type2", types[0])
	} else {
		elem.attr("data-type1", "")
		elem.attr("data-type2", "")
	}
	if (types[1]){
		elem.attr("data-type2", types[1])
	} else if (types[0]){
		elem.attr("data-type2", types[0])
	} else {
		elem.attr("data-type2", "")
	}
}

function shakeBoard(shakeAmount=10){
	if (!config["screenShake"]){
		return
	}
	let board = $("#board")
	let targetLocations = [
		[0, 0]
	]
	let segCount = 5
	for (let i = 0; i < segCount; i++){
		let x = Math.random() * shakeAmount
		let y = Math.random() * shakeAmount
		targetLocations.push([x, y])
	}
	targetLocations.push([0, 0])
	$({val: 0}).animate({val: 1}, {
		duration: 300,
		step: function(){
			let p = this.val
			let segmentIndex = Math.floor(p * targetLocations.length)
			let targetLocation = targetLocations[segmentIndex]
			let css = {
				left: targetLocation[0],
				top: targetLocation[1]
			}
			board.css(css)	
		},
		complete: function(){
			board.css({
				left: 0,
				top: 0
			})
		}
	})
}