import { ControlManager } from "../src/controls.js"

class MapMaker {
	constructor(){
		this.canvas = $("#canvas > canvas")[0]
		this.tileset = null
		this.tilesetImage = null
		this.tileCanvas = $("#tileset > canvas")[0]
		this.context = this.canvas.getContext("2d")
		this.context2 = this.tileCanvas.getContext("2d")
		this.controls = new ControlManager()

		this.tool = {
			type: "paint",
			tileId: 1
		}

		this.width = 0
		this.height = 0
		this.tiles = []

		this.tickInterval = -1
		this.autosaveInterval = -1
	}
	start(){
		this.tileCanvas.width = this.tilesetImage.width
		this.tileCanvas.height = this.tilesetImage.height
		let context = this.context2
		context.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height)
		context.drawImage(this.tilesetImage, 0, 0)

		this.width = Number($("#map-width").val())
		this.height = Number($("#map-height").val())
		this.tiles = []
		for (let i = 0; i < this.width * this.height; i++){
			let x = i % this.width
			let z = Math.floor(i / this.width)
			let tile = new Tile(x, 0, z, 0)
			this.tiles.push(tile)
		}
		this.canvas.width = this.width * this.tileset.spriteWidth
		this.canvas.height = this.height * this.tileset.spriteHeight

		clearInterval(this.tickInterval)
		this.tickInterval = setInterval(() => this.tick(), 20)
		clearInterval(this.autosaveInterval)
		this.autosaveInterval = setInterval(() => this.save(), 1000)
	}
	tick(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (let tile of this.tiles){
			let sw = this.tileset.spriteWidth
			let sh = this.tileset.spriteHeight
			let x = (tile.x + 0.5) * sw
			let y = (tile.z + 0.5) * sh

			let tileId = tile.spriteIndexes[0]
			let spriteX = tileId % this.tileset.columns
			let spriteY = this.tileset.rows - 1 - Math.floor(tileId / this.tileset.columns)

			spriteX *= sw
			spriteY *= sh

			this.context.save()
			this.context.translate(x, y)
			this.context.drawImage(this.tilesetImage, spriteX, spriteY, sw, sh, -sw/2, -sh/2, sw, sh)
			this.context.restore()
		}
		this.context2.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height)
		this.context2.drawImage(this.tilesetImage, 0, 0)

		let canvasBox = this.canvas.getBoundingClientRect()
		let tilesetBox = this.tileCanvas.getBoundingClientRect()
		let mouseX = this.controls.mouse.x
		let mouseY = this.controls.mouse.y

		if (this.isInBox(mouseX, mouseY, canvasBox)){
			mouseX = mouseX - canvasBox.x
			mouseY = mouseY - canvasBox.y
			if (this.controls.isClicking() && this.tool.type === "paint"){
				let tileX = Math.floor(mouseX / canvasBox.width * this.width)
				let tileY = Math.floor(mouseY / canvasBox.height * this.height)
				let tile = this.tiles.find(t => t.x === tileX && t.z === tileY)
				tile.spriteIndexes[0] = this.tool.tileId
			}
		} else if (this.isInBox(mouseX, mouseY, tilesetBox)){
			mouseX = mouseX - tilesetBox.x
			mouseY = mouseY - tilesetBox.y
			if (this.controls.isClicking()){
				let tileX = Math.floor(mouseX / tilesetBox.width * this.tileset.columns)
				let tileY = this.tileset.rows - 1 - Math.floor(mouseY / tilesetBox.height * this.tileset.rows)
				let tileId = tileY * this.tileset.columns + tileX
				console.log(tileId)
				this.tool.tileId = tileId
			}
		}

		if ("tileId" in this.tool){
			let tileId = this.tool.tileId
			let tileX = tileId % this.width
			let tileY = this.tileset.rows - 1 - Math.floor(tileId / this.width)
			tileX *= this.tileset.spriteWidth
			tileY *= this.tileset.spriteHeight
			this.context2.save()
			this.context2.strokeStyle = "magenta"
			this.context2.strokeRect(tileX, tileY, this.tileset.spriteWidth, this.tileset.spriteHeight)
			console.log(tileX, tileY)
		}
	}
	isInBox(x, y, box){
		return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height
	}

	save(){
		let str = this.getString()
		localStorage.setItem("last-map-layer", str)
		let compressed = LZString.compressToBase64(str)
		$("#data").val(compressed)
	}
	getString(){
		let output = []
		output.push(this.width)
		output.push(this.height)
		let tileData = []
		output.push(tileData)
		for (let tile of this.tiles){
			tileData.push([
				tile.x,
				tile.y,
				tile.z,
				tile.spriteIndexes,
				tile.spriteChangeInterval
			])
		}
		return JSON.stringify(output)
	}

	load(){
		let lastData = localStorage.getItem("last-map-layer")
		if (lastData){
			this.loadFromString(JSON.parse(lastData))
		}
	}
	loadFromString(data){
		this.width = data[0]
		$("#map-width").val(this.width)
		this.height = data[1]
		$("#map-height").val(this.height)
		this.start()
		let tileData = data[2]
		this.tiles.length = 0
		for (let tileD of tileData){
			let tile = new Tile(tileD[0], tileD[1], tileD[2], tileD[3], tileD[4])
			this.tiles.push(tile)
		}
	}
}
class Tile {
	constructor(x, y, z, spriteIndexes, spriteChangeInterval=200) {
		this.x = x
		this.y = y
		this.z = z
		if (typeof spriteIndexes === "number"){
			spriteIndexes = [spriteIndexes]
		}
		this.spriteIndex = 0
		this.spriteIndexes = spriteIndexes
		if (this.spriteIndexes.length <= 1){
			spriteChangeInterval = -1
		}
		this.spriteChangeInterval = spriteChangeInterval
		this.lastSpriteChangeTime = performance.now()
	}
}
class TileSet {
	constructor(src, name, rows, columns, spriteWidth, spriteHeight){
		this.src = src
		this.name = name
		this.rows = rows
		this.columns = columns
		this.spriteWidth = spriteWidth
		this.spriteHeight = spriteHeight
	}
}
const TILESETS = []
TILESETS[0] = new TileSet("../img/tilesets/test.png", "Test Tileset", 32, 32, 16, 16)
TILESETS[1] = new TileSet("../img/tilesets/night forest.png", "Night Forest", 32, 32, 16, 16)
let mapMaker = new MapMaker()

for (let tileset of TILESETS){
	let option = $("<option>").appendTo("#tileset-picker")
	option.val(TILESETS.indexOf(tileset))
	option.text(tileset.name)
}

function update(){
	let tilesetImage = new Image()
	let tileset = TILESETS[$("#tileset-picker").val()]
	tilesetImage.src = tileset.src

	const ready = () => {
		mapMaker.tilesetImage = tilesetImage
		mapMaker.tileset = tileset
		mapMaker.start()
		mapMaker.load()
	}
	if (tilesetImage.complete || tilesetImage.readyState === 4){
		ready()
	}
	tilesetImage.addEventListener("load", ready)
}
update()
$("#update-btn").click(update)