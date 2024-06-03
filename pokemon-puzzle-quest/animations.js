const animTemplates = {
	"displace": function(tile, tx, ty, startT, duration){
		let animation = {
			type: "displace",
			tile: tile,
			startX: tile.x,
			startY: tile.y,
			startT: startT,
			endX: tx,
			endY: ty,
			endT: startT + duration,
			duration: duration
		}
		return animation
	}
}

const tileTypeColors = {
	"red": "#ff2f35",
	"yellow": "#e8aa00",
	"green": "#82dc42",
	"blue": "#00c0e7",
	"purple": "#dd60dd",
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
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		case "physical":
		return "src/img/types/physical.png"
		default:
		return "???"
	}
}