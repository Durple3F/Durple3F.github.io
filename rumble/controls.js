export default class ControlManager {
	constructor(){
		this.buttons = {}
		this.mouse = {
			x: window.innerWidth * 0.5,
			y: window.innerHeight * 0.5,
			vx: 0,
			vy: 0,
			buttons: {
				1: false, //left mouse
				2: false, //right mouse
				3: false //secret third mouse (mr. squeaker)
			},
			records: []
		}
		console.log(this)
		window.addEventListener("keydown", e => {
			let key = e.key
			this.setButtonState(key, true)
		})
		window.addEventListener("keyup", e => {
			let key = e.key
			this.setButtonState(key, false)
		})
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				for (let key in this.buttons){
					this.setButtonState(key, false)
				}
				for (let key in this.mouse.buttons){
					this.setButtonState(key, false)
				}
			} else {
				// Page became visible!
			}
		});
		document.addEventListener("mousemove", e => {
			this.setMousePosition(e.clientX, e.clientY)
		})
		document.addEventListener("mousedown", e => {
			let buttons = e.buttons
			this.setMouseButtonState(buttons)
			this.setMousePosition(e.clientX, e.clientY)
		})
		document.addEventListener("mouseup", e => {
			let buttons = e.buttons
			this.setMouseButtonState(buttons)
			this.setMousePosition(e.clientX, e.clientY)
		})
	}
	setButtonState(key, value){
		this.buttons[key] = value
	}
	getButtonState(key){
		return !!this.buttons[key]
	}
	isPressing(key, modifiers){
		let pressed = this.getButtonState(key)
		if (modifiers){
			//Control, Shift, stuff like that
			for (let modifier of modifiers){
				pressed = pressed && this.getButtonState(modifier)
			}
		}
		return pressed
	}
	setMouseButtonState(buttons){
		//binary
		//101 means pressing middle and left mouse but not right
		//final digit is left mouse
		for (let i = 0; i < 3; i++){
			let pow = Math.pow(2, i)
			let equal = Math.floor(buttons / pow) % 2 === 1
			this.mouse.buttons[i+1] = equal
		}
	}
	getMouseButtonState(key){
		return !!this.mouse.buttons[key]
	}
	isClicking(mouseButtonName){
		let index = 1
		switch (mouseButtonName){
			case undefined: break
			case 1: {
				index = 1
				break
			}
			case 2: {
				index = 2
				break
			}
			case 3: {
				index = 3
				break
			}
			case "left": {
				index = 1
				break
			}
			case "right": {
				index = 2
				break
			}
			case "middle": {
				index = 3
				break
			}
		}
		return this.getMouseButtonState(index)
	}
	setMousePosition(x, y){
		this.mouse.x = x
		this.mouse.y = y
	}
	tick(){
		let records = this.mouse.records
		records.push([this.mouse.x, this.mouse.y, Date.now()])
		if (records.length > 5){
			records.splice(0, records.length - 5)
		}
		let vx = 0
		let vy = 0
		let first = records[0]
		let last = records[records.length - 1]
		let dt = last[2] - first[2]
		if (dt !== 0){
			vx = (last[0] - first[0]) / dt
			vy = (last[1] - first[1]) / dt
		}
		this.mouse.vx = vx
		this.mouse.vy = vy
	}
}