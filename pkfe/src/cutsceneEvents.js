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
new CutsceneEventType("path-character", function(game, cutscene, event){
	let characterId = cutscene.getInfo(event.characterId)
	let character = game.level.getCharacter(characterId)
	let mode = event.mode
	if (mode === "offset"){
		let offset = cutscene.getInfo(event.to)
		let pos = character.billboardPivot.position
		pos.x += offset.x
		pos.y += offset.y
		pos.z += offset.z
	}
})