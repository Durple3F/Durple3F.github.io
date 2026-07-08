export class Screen2d {
	constructor (canvas){
		this.canvas = canvas
		this.context = this.canvas.getContext("2d")
		this.context.imageSmoothingEnabled = false;
		this.isFocused = false
		this.isActive = false
		this.renderFns = []
	}

	setActive(bool){
		this.isActive = bool
	}
	setFocus(bool){
		this.isFocused = bool
	}

	render(){
		const ctx = this.context
		const w = this.canvas.width
		const h = this.canvas.height
		ctx.clearRect(0, 0, w, h)
		if (this.isActive){
			for (let fn of this.renderFns){
				fn()
			}
		}
	}
}