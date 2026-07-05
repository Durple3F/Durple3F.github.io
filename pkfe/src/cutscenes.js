import { CUTSCENEEVENTS } from "./cutsceneEvents.js"

export class BattleCutscene {
	constructor(game, options, triggerEvent={}){
		this.game = game
		this.eventIndex = -1
		this.info = {}
		this.events = options.events
		this.triggerEvent = triggerEvent
	}
	async play(){
		let result = null
		while (result !== "done"){
			result = await this.advance()
		}
	}
	async advance(){
		this.eventIndex++
		let eventData = this.events[this.eventIndex]
		if (!eventData) return "done"
		let eventType = eventData.type
		if (!(eventType in CUTSCENEEVENTS)){
			console.warn("Unhandled event type: "+eventType)
			return
		}
		await CUTSCENEEVENTS[eventType].execute(this.game, this, eventData)
	}
	getInfo(key){
		if (typeof key === "number"){
			return this.info[this.eventIndex + key]
		}
	}
}