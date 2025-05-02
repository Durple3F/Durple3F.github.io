const backgroundAnimations = {
	"none": {
		name: "none",
		type: "none",
		frameCount: 1
	},
	"rainbow-radial": {
		name: "rainbow-radial",
		type: "gradient",
		gradient: {
			stops: [
				{stop: 0, color: new Color("red"), reverseHue: false},
				{stop: 0.5, color: new Color("purple")},
				{stop: 1, color: new Color("red")},
			],
			colorBandCount: 1000,
			center: {
				x: 0.5,
				y: 0.5
			},
			size: 0.6,
			sizeReference: "height",
			reverse: true
		},
		frameCount: 100
	},
	"ilima-radial": {
		name: "ilima-radial",
		type: "gradient",
		gradient: {
			stops: [
				{stop: 0, color: new Color("#ffd300")},
				{stop: 1, color: new Color("#ffd300"), reverseHue: true},
			],
			lightnessFilterStops: [
				{stop: 0, lightness: 1.6},
				{stop: 0.5, lightness: 1},
				{stop: 1, lightness: 1.6},
			],
			colorBandCount: 500,
			center: {
				x: 0.5,
				y: 1.6
			},
			size: 3,
			sizeReference: "height",
			reverse: true
		},
		frameCount: 150,
		clearColorCacheEveryFrame: true
	},
	"hala-radial": {
		name: "hala-radial",
		type: "gradient",
		gradients: [
			{
				stops: [
					{stop: 0, color: new Color("#5e1c00")},
					{stop: 0.25, color: new Color("#b44400")},
					{stop: 0.5, color: new Color("#f28018")},
					{stop: 0.75, color: new Color("#b44400")},
					{stop: 1, color: new Color("#5e1c00")},
				],
				colorBandCount: 500,
				center: {
					x: 0.66,
					y: 0.35
				},
				size: 1,
				sizeReference: "height",
				reverse: true
			},
		],
		frameCount: 100,
		clearColorCacheEveryFrame: true
	}
}

function getGradientStops(p, stops){
	let stopLen = stops.length
	let stop2 = stops[stopLen - 1]
	let stop1 = stops[stopLen - 2]
	for (let i = 1; i < stopLen; i++){
		let stop = stops[i]
		let stopP = stop.stop
		if (stopP > p){
			stop1 = stops[i - 1]
			stop2 = stop
			break
		}
	}
	return [stop1, stop2]
}

const animationPixelRenderFunctions = {
	"none": {
		execute: () => {
			return [0, 0, 0, 0]
		}
	},
	"gradient": {
		execute: (px, py, frame, background, animation) => {
			let w = background.width
			let h = background.height
			let gradientList = animation.gradients ?? [animation.gradient]
			let totalColor
			for (let gradient of gradientList){
				// console.log(gradient.stops)
				let colorCache = gradient.colorCache ?? animation.colorCache
				let gradientColorStops = gradient.stops
				let lightnessStops = gradient.lightnessFilterStops
				let colorBands = gradient.colorBandCount
				let gradientCenter = gradient.center
				let gradientSize = gradient.size
				if (gradient.sizeReference === "height"){
					gradientSize *= h
				}
				let animCompleteness = frame / animation.frameCount
				let reverse = !!gradient.reverse
				let gx = gradientCenter.x * w
				let gy = gradientCenter.y * h
				let dist = distance(px, py, gx, gy) / gradientSize
				let p = dist % 1
				if (reverse){
					p = (p + 1 - animCompleteness) % 1
				} else {
					p = (p + animCompleteness) % 1
				}
				let band = Math.floor(p * colorBands)

				let color
				if (colorCache[band]){
					color = colorCache[band]
				} else {
					let stops = getGradientStops(p, gradientColorStops)
					let stop1 = stops[0]
					let stop2 = stops[1]

					let colorP = (p - stop1.stop) / (stop2.stop - stop1.stop)
					let c1 = stop1.color
					let c2 = stop2.color
					let hsl1 = c1.hsl
					let hsl2 = c2.hsl
					let h1 = hsl1.h
					let h2 = hsl2.h
					if (stop2.reverseHue){
						h2 -= 360
					}
					let newH = lerp(h1, h2, colorP)
					let s1 = hsl1.s
					let s2 = hsl2.s
					let newS = lerp(s1, s2, colorP)
					let l1 = hsl1.l
					let l2 = hsl2.l
					let newL = lerp(l1, l2, colorP)

					//Handle lightness overlay
					if (lightnessStops){
						let stops = getGradientStops(animCompleteness, lightnessStops)
						let stop1 = stops[0]
						let stop2 = stops[1]
						let stopP = (animCompleteness - stop1.stop) / (stop2.stop - stop1.stop)
						let l = lerp(stop1.lightness, stop2.lightness, stopP)
						newL *= l
					}

					let c = new Color("hsl", [newH, newS, newL])
					let srgb = c.srgb
					color = [srgb.r * 255, srgb.g * 255, srgb.b * 255, (srgb.a || 1)*255]
					colorCache[band] = color
				}
				if (!totalColor){
					totalColor = color
				}
			}

			return totalColor
		}
	}
}

class Background{
	constructor(canvas){
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.scale = 0.1
		this.width = $(window).width() * this.scale
		this.height = $(window).height() * this.scale

		this.animation = null
		this.loadingAnimation = null
		this.loadingAnimationQueue = []
		this.loadedAnimations = {}

		this.t = 0n
		this.frame = 0
		this.framesInAnimation = 100
		this.gradientT = 0
		this.colorCache = {}
		this.resize()

		for (let key in backgroundAnimations){
			let animation = backgroundAnimations[key]
			this.clearAnimation(animation)
		}
		
		this.frameRate = frameRate
		this.startTicks()
		this.loadAnimation("ilima-radial")
		this.loadAnimation("hala-radial")
		this.playAnimation("none")
	}

	tick(){
		this.t += 1n
		let animation = this.loadingAnimation
		if (animation){
			let drawEvery = animation.drawEvery ?? 1
			if (!animation.complete && this.t % drawEvery === 0n){
				let totalPixels = this.width * this.height
				let timeData = animation.frameData.times
				let lastTime = timeData[timeData.length - 1]
				let pixels = totalPixels
				if (lastTime){
					let timePerPixel = lastTime.pixels / lastTime.time
					let targetTime = 5
					pixels = Math.ceil(timePerPixel * targetTime)
				}
				if (pixels >= totalPixels){
					this.prepareNextFrame(animation)
				} else {
					this.preparePixels(animation, pixels)
				}
			}
		}
		window.requestAnimationFrame(this.render.bind(this))
	}
	render(){
		let ctx = this.ctx
		let w = this.width
		let h = this.height
		let frame = this.frame
		let animation = this.animation

		ctx.clearRect(0, 0, w, h)
		
		let newImageData
		if (animation.frameCache[frame]){
			newImageData = animation.frameCache[frame]
		} else {
			newImageData = this.prepareFrame(animation, frame)
			animation.frameCache[frame] = newImageData
		}

		ctx.putImageData(newImageData, 0, 0)
		this.frame = (this.frame + 1) % this.framesInAnimation
	}

	startTicks(){
		clearInterval(this.interval)
		this.interval = setInterval(this.tick.bind(this), (1000 / this.frameRate)|0)
	}
	stopTicks(){
		clearInterval(this.interval)
	}

	newImageData(){
		let w = this.width
		let h = this.height
		let newImageData = ctx.createImageData(w, h)
		return newImageData
	}

	prepareFrame(animation, frame){
		let w = this.width
		let h = this.height
		let newImageData = animation.incompleteFrame ?? ctx.createImageData(w, h)
		let frameCache = animation.frameCache

		if (frameCache[frame]){
			return frameCache[frame]
		}

		let totalPixels = w * h
		this.preparePixels(animation, totalPixels)
		
		return newImageData
	}
	prepareNextFrame(animation){
		let frame = animation.framesDrawn
		this.prepareFrame(animation, frame)
	}
	preparePixels(animation, pixelCount){
		// if (animation === this.animation) return)
		let now = Date.now()
		let w = this.width
		let h = this.height
		let totalPixels = w * h
		let frame = animation.framesDrawn
		let frameData = animation.frameData
		let pixelsComplete = frameData.frameCompletePixels[frame]
		let targetPixel = Math.min(totalPixels, pixelCount + pixelsComplete)
		let animData = animationPixelRenderFunctions[animation.type]
		let drawPixel = animData.execute
		let incompleteFrame = animation.incompleteFrame
		let data = incompleteFrame.data
		for (let pi = pixelsComplete; pi < targetPixel; pi++){
			let i = pi * 4
			let px = pi % w
			let py = Math.floor(pi / w)

			let color = drawPixel(px, py, frame, this, animation)
			
			data[i] = color[0]
			data[i+1] = color[1]
			data[i+2] = color[2]
			data[i+3] = color[3]
		}
		frameData.frameCompletePixels[frame] = targetPixel
		let timeData = {
			time: Date.now() - now,
			pixels: pixelCount
		}
		animation.frameData.times.push(timeData)

		if (targetPixel >= totalPixels){
			animation.frameCache[frame] = incompleteFrame
			this.incrementFrames(animation)
		}
	}
	incrementFrames(animation){
		animation.framesDrawn++
		if (animation.framesDrawn >= animation.frameCount){
			animation.complete = true
		} else {
			animation.incompleteFrame = this.newImageData()
		}
		if (animation.complete) {
			animation.resolve()
			return
		}
		let clearColorCacheEveryFrame = animation.clearColorCacheEveryFrame ?? false
		if (clearColorCacheEveryFrame){
			let colorCache = animation.colorCache
			for (let key in colorCache){
				delete colorCache[key]
			}
			if (animation.gradientList){
				for (let gradient of animation.gradientList){
					let colorCache = gradient.colorCache
					for (let key in colorCache){
						delete colorCache[key]
					}
				}
			}
		}
	}

	playAnimation(animation){
		if (typeof animation === "string"){
			animation = backgroundAnimations[animation]
		}
		this.frame = 0
		this.framesInAnimation = animation.frameCount
		this.animation = animation

		if (!animation.complete){
			if (this.loadingAnimation && this.loadingAnimation !== animation){
				this.loadingAnimationQueue.splice(0, 0, this.loadingAnimation)
				this.loadingAnimation = undefined
				this.loadAnimation(animation)
			}
		}
	}
	clearAnimation(animation){
		if (!animation) return
		animation.frameCache = {}
		animation.colorCache = {}
		animation.frameData = {}
		animation.frameData.times = []
		animation.frameData.frameCompletePixels = []
		for (let i = 0; i < animation.frameCount; i++){
			animation.frameData.frameCompletePixels[i] = 0
		}
		animation.frameData.lastCompleteFrame = -1
		animation.incompleteFrame = this.newImageData()
		animation.complete = false
		animation.framesDrawn = 0
		animation.drawEvery = 10n
		animation.startedLoading = null
		animation.finishedLoading = null
		if (animation === this.loadingAnimation){
			this.loadAnimation(animation)
		}
	}
	loadAnimation(animation){
		if (typeof animation === "string"){
			animation = backgroundAnimations[animation]
		}
		if (this.loadedAnimations[animation.name]){
			return animation
		}
		if (!animation.promise){
			animation.promise = new Promise(resolve => {
				animation.resolve = resolve
			})
		}
		if (this.loadingAnimation && this.loadingAnimation !== animation) {
			this.loadingAnimationQueue.push(animation)
			return animation
		}
		if (!animation.startedLoading){
			animation.startedLoading = Date.now()
		}
		
		this.loadingAnimation = animation
		animation.promise.then(() => {
			animation.finishedLoading = Date.now()
			console.log("Finished loading", animation.name, "in", animation.finishedLoading - animation.startedLoading, "ms")
			this.loadedAnimations[animation.name] = animation
			if (this.loadingAnimation === animation){
				this.loadingAnimation = null
				if (this.loadingAnimationQueue.length){
					let next = this.loadingAnimationQueue[0]
					this.loadAnimation(next)
					this.loadingAnimationQueue.splice(0, 1)
				}
			}
		})
		return animation
	}
	stopAnimation(){
		this.playAnimation("none")
	}

	resize(){
		this.width = Math.floor($(window).width() * this.scale)
		this.height = Math.floor($(window).height() * this.scale)
		let canvas = this.canvas
		canvas.width = this.width
		canvas.height = this.height
		this.colorCache = {}

		//Unfortunately, resizing the screen means all our animation caches are gone.
		for (let key in this.loadedAnimations){
			delete this.loadedAnimations[key]
		}
		this.loadingAnimationQueue.forEach(anim => {
			this.clearAnimation(anim)
		})
		this.clearAnimation(this.loadingAnimation)
		this.clearAnimation(this.animation)
		if (this.animation){
			this.playAnimation(this.animation)
		}
	}
}