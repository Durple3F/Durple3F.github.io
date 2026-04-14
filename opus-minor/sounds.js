const SOUNDS = {}
const playingSounds = []
export const neededSounds = [
	{
		id: "ui_modal",
		url: "./src/sounds/ui_modal.mp3",
		category: "sfx"
	},
	{
		id: "ui_modal_close",
		url: "./src/sounds/ui_modal_close.mp3",
		category: "sfx"
	},
	{
		id: "piece_modify",
		url: "./src/sounds/piece_modify.mp3",
		category: "sfx"
	},
	{
		id: "piece_pickup",
		url: "./src/sounds/piece_pickup.mp3",
		category: "sfx"
	},
	{
		id: "piece_place",
		url: "./src/sounds/piece_place.mp3",
		category: "sfx"
	},
	{
		id: "piece_remove",
		url: "./src/sounds/piece_remove.mp3",
		category: "sfx"
	},
	{
		id: "piece_rotate",
		url: "./src/sounds/piece_rotate.mp3",
		category: "sfx"
	},
]
export const categoryVolumes = {
	sfx: 1,
	music: 1
}

class Sound {
	constructor(id, url, category="sfx"){
		this.id = id
		this.url = url
		this.category = category
		this.complete = false
		this.elem = new Audio(this.url)
		this.promise = new Promise(res => this.resolve = res)
		this.handleCanPlayThrough = () => {
			this.complete = true
			this.resolve()
		}
		this.elem.addEventListener("canplaythrough", this.handleCanPlayThrough)
		this.setVolume(categoryVolumes[this.category])
	}
	clone(){
		let clone = new Sound(this.id, this.url, this.category)
		clone.elem.removeEventListener("canplaythrough", clone.handleCanPlayThrough)
		clone.elem = this.elem.cloneNode()
		clone.complete = this.complete
		clone.setVolume(this.elem.volume)
		if (clone.complete){
			clone.resolve()
		} else {
			clone.elem.addEventListener("canplaythrough", clone.handleCanPlayThrough)
		}
		return clone
	}
	setVolume(volume){
		this.elem.volume = volume
	}
}

export async function loadSound(id, url, category){
	if (SOUNDS[id]){
		await SOUNDS[id].promise
		return SOUNDS[id]
	} else {
		let snd = new Sound(id, url, category)
		SOUNDS[id] = snd
		await snd.promise
		return snd
	}
}

export async function playSound(id){
	if (!SOUNDS[id]){
		return
	}
	let resolve
	let promise = new Promise(res => resolve = res)
	let sound = SOUNDS[id]
	if (!sound.elem.paused){
		console.log("clone")
		sound = sound.clone()
		sound.elem.pause()
		sound.elem.currentTime = 0
	}
	sound.elem.play()
	playingSounds.push(sound)
	sound.elem.addEventListener("ended", () => {
		resolve()
	})
	await promise
	return promise
}

export async function loadNeededSounds(){
	let promises = []
	for (let snd of neededSounds){
		let id = snd.id
		let url = snd.url
		let category = snd.category || "sfx"
		let p = loadSound(id, url, category)
		promises.push(p)
	}
	await Promise.all(promises)
}

export function changeCategoryVolume(category, volume, saveFile){
	for (let soundId in SOUNDS){
		let snd = SOUNDS[soundId]
		if (snd.category !== category) continue
		snd.setVolume(volume)
	}
	for (let snd of playingSounds){
		if (snd.category !== category) continue
		snd.setVolume(volume)
	}
	categoryVolumes[category] = volume
	saveFile.settings.sounds[category] = volume
}