export const INPUTS = {
	confirm: "confirm",
	cancel: "cancel",
	menu: "menu",
	up: "up",
	down: "down",
	left: "left",
	right: "right"
}

export class InputManager {
	constructor(controls){
		this.controls = controls
		this.events = []
		this.listeners = {}
		for (let inputType in INPUTS){
			this.listeners[inputType] = []
		}
	}
	addListener(inputType, fn){
		this.listeners[inputType].unshift(fn)
	}
	removeListener(inputType, fn){
		let list = this.listeners[inputType]
		while (list.includes(fn)){
			list.splice(list.indexOf(fn), 1)
		}
	}
	tick(){
		this.events = []
		const keyboard = this.controls
		
		//Determine which input events are happening
		if (keyboard.justClicked() || keyboard.justPressed(" ")){
			this.events.push({
				action: "confirm"
			})
		}

		const events = this.events
		const listeners = this.listeners
		for (let i = 0; i < events.length; i++){
			let event = events[i]
			let inputType = event.action
			for (let callback of listeners[inputType]){
				events.splice(events.indexOf(event), 1)
				i--
				callback(event)
				//let's assume they're all blocking for now
				break
			}
		}

		this.controls.tick()
	}
}