const controls = new Map()
const keyMap = new Map()

function ControllerKey(name, keys){
	controls.set(name, this)
	this.name = name
	this.keys = keys
	this.isDown = false
	for (let key of keys){
		keyMap.set(key, this)
	}
}

;(function(){
	function keyUp(event){
		let key = event.code
		if (!keyMap.has(key)) return
		let control = keyMap.get(key)
		control.isDown = false
	}
	function keyDown(event){
		let key = event.code
		if (!keyMap.has(key)) return
		let control = keyMap.get(key)
		control.isDown = true
	}
	new ControllerKey("up", ["KeyW", "ArrowUp"])
	new ControllerKey("down", ["KeyS", "ArrowDown"])
	new ControllerKey("left", ["KeyA", "ArrowLeft"])
	new ControllerKey("right", ["KeyD", "ArrowRight"])
	new ControllerKey("zoom-out", ["KeyQ"])
	new ControllerKey("zoom-in", ["KeyE"])
	new ControllerKey("pause", ["Space"])
	
	window.onkeydown = keyDown
	window.onkeyup = keyUp
})()