export function clamp(x, min, max){
	return x < min ? min : x > max ? max : x
}

export async function loadImage(url){
	let image = new Image()
	image.src = url
	await new Promise((res, rej) => {
		const ready = () => {
			res()
		}
		if (image.complete || image.readyState === 4){
			ready()
		}
		image.addEventListener("load", ready)
	})
	return image
}

export async function delay(ms){
	await new Promise(res => {
		setTimeout(res, ms)
	})
}

export async function animate(options){
	let startTime = performance.now()
	let duration = options.duration
	let endTime = startTime + duration
	let interval
	if (options.step){
		const step = () => {
			let now = performance.now()
			let p = (now - startTime) / duration
			options.step(p)
		}
		interval = setInterval(step, 1)
	}
	await delay(duration)
	clearInterval(interval)
	if (options.complete){
		options.complete()
	}
}