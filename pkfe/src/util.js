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