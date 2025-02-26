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