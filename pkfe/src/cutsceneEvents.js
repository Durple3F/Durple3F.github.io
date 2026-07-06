export const CUTSCENEEVENTS = {}

export class CutsceneEventType {
	constructor(id, executeFn){
		this.id = id
		this.execute = executeFn.bind(this)
		CUTSCENEEVENTS[this.id] = this
	}
	execute(game, cutscene, event){
		console.log("Seems like you forgot to provide a function for "+this.id)
	}
}

new CutsceneEventType("load-value", function(game, cutscene, event){
	cutscene.info[cutscene.eventIndex] = event.value
})
new CutsceneEventType("path-character", async function(game, cutscene, event){
	let characterId = cutscene.getInfo(event.characterId)
	let character = game.level.getCharacter(characterId)
	let duration = event.duration
	let mode = event.mode
	if (mode === "offset"){
		let offset = cutscene.getInfo(event.to)
		let start = character.homeTile
		let terrain = game.map.terrain
		let toTile = terrain.getTile(start.x + offset.x, start.y + offset.y, start.z + offset.z)
		let path = game.map.terrain.findPath(start, toTile)
		await game.moveCharacterAlongPath(character, path, duration, event.cameraFollow)
	}
})