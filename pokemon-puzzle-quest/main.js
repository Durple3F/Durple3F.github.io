const canvas = $("#screen")[0]
const ctx = canvas.getContext("2d")

const mouse = {
	x: 0,
	y: 0,
	isDown: false,
	downX: 0,
	downY: 0,
	upX: 0,
	upY: 0
}

const boardSize = 8
let frameRate = 60

const colors = ["red", "orange", "yellow", "green", "blue", "purple"]

const UNITVECTORS = [
	[1, 0],
	[0, 1]
]
const OPPOSITEVECTORS = new Map()
for (let v of UNITVECTORS){
	let opposite = v.map(x => x * -1)
	OPPOSITEVECTORS.set(v, opposite)
	OPPOSITEVECTORS.set(opposite, v)
}

function delay(ms){
	return new Promise(resolve => setTimeout(resolve, ms))
}

function randomAngle(deg1, deg2){
	let result = (deg1 + Math.random() * (deg2 - deg1)) / 180 * Math.PI
	return result
}
function randomFrom(min, max){
	let result = min + Math.random() * (max - min + 1)
	return Math.floor(result)
}

function weightedRandom(items, weights) {
	if (items.length !== weights.length) {
		throw new Error('Items and weights must be of the same size');
	}

	if (!items.length) {
		throw new Error('Items must not be empty');
	}

	// Preparing the cumulative weights array.
	// For example:
	// - weights = [1, 4, 3]
	// - cumulativeWeights = [1, 5, 8]
	const cumulativeWeights = [];
	for (let i = 0; i < weights.length; i += 1) {
		cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
	}

	// Getting the random number in a range of [0...sum(weights)]
	// For example:
	// - weights = [1, 4, 3]
	// - maxCumulativeWeight = 8
	// - range for the random number is [0...8]
	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
	const randomNumber = maxCumulativeWeight * Math.random();

	// Picking the random item based on its weight.
	// The items with higher weight will be picked more often.
	for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return {
				item: items[itemIndex],
				index: itemIndex,
			};
		}
	}
}
function distance(x1, y1, x2, y2){
	let dx = x2-x1
	let dy = y2-y1
	return Math.sqrt(dx*dx + dy*dy)
}

function bezierEase(t){
	// return [
	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0.42 + 
	// 	3*(1 - t)*Math.pow(t,2)*0.58 + 
	// 	Math.pow(t, 3)*1,

	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0 + 
	// 	3*(1 - t)*Math.pow(t,2)*1 + 
	// 	Math.pow(t, 3)*1,
	// ]
	let r = Math.pow(1 - t, 3)*0 + 3*Math.pow(1 - t, 2)*t*0 + 3*(1 - t)*Math.pow(t,2)*1 + Math.pow(t, 3)*1
	return r
}
function interpolate(v1, v2, p){
	return (1 - p)*v1 + p*v2
}

function lerp(a, b, t){
	return a + (b - a)*t
}

function randomChoice(arr){
	return arr[Math.floor(Math.random() * arr.length)]
}
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
	}
}

const ongoingTextAnimations = new Map()
function animateTextCounter(from, to, elem, duration){
	if (duration === undefined){
		duration = 300
	}

	let fromObj = {val: from}
	let toObj = {val: to}

	if (ongoingTextAnimations.has(elem)){
		let oldAnimation = ongoingTextAnimations.get(elem)
		$(oldAnimation).stop()
	}

	$(fromObj).animate(toObj, {
		duration: duration,
		step: function(){
			elem.text(parseInt(this.val))
		},
		complete: function(){
			elem.text(to)
			ongoingTextAnimations.delete(elem)
		}
	})
	ongoingTextAnimations.set(elem, fromObj)
}

function addFloatingText(text, elem, options){
	let color = options.color ?? "white"
	let direction = options.direction ?? "random"
	let distance = options.distance ?? 100
	let duration = options.duration ?? 500
	let side = options.side ?? "center"
	let floater = $("<div class='floating-text'></div>")
	floater.text(text)
	floater.css("color", color)
	$("body").append(floater)

	let offset = $(elem).offset()
	let width = $(elem).width()
	let height = $(elem).height()
	let elemWidth = floater.width()
	let elemHeight = floater.height()
	let xOff = 0
	let yOff = 0

	if (side === "center"){
		xOff = offset.left + width * 0.5
		yOff = offset.top + height * 0.5
	} else if (side === "right"){
		xOff = offset.left + width - elemWidth
		yOff = offset.top + height * 0.5
	}
	floater.css("left", xOff)
	floater.css("top", yOff)

	let tx = xOff
	let ty = yOff
	if (direction === "up"){
		direction = Math.PI * 0.5
	} else if (direction === "down"){
		direction = Math.PI * 1.5
	} else if (direction === "left"){
		direction = Math.PI
	} else if (direction === "right"){
		direction = Math.PI * 2
	} else if (direction === "random"){
		direction = Math.PI * Math.random() * 2
	} else if (typeof direction !== "number"){
		console.error(direction, "is not a valid direction")
	}
	
	//Presumably we've been given an angle
	tx = xOff - Math.cos(direction) * distance
	ty = yOff - Math.sin(direction) * distance

	floater.animate({
		left: tx, top: ty, opacity: 0
	}, duration).queue(() => {
		floater.remove()
	})
}

function getEmptyEnergy(){
	let t = {}
	colors.forEach(c => t[c] = 0)
	return t
}

const sprites = {
	images: {},
	batches: []
}
function handleSpriteLoad(){
	let allLoaded = true
	for (let key in sprites.images){
		let sprite = sprites.images[key]
		if (!sprite.complete){
			allLoaded = false
		}
	}
}
function loadSprite(name, url, batch){
	let img = new Image()
	img.src = url
	sprites.images[name] = img
	let promise = new Promise((resolve, reject) => {
		img.onload = function(){
			handleSpriteLoad()
			loadedResources[0]++
			resolve()
		}
		img.onerror = reject
	})
	return promise
}
function loadSprites(list){
	let batch = []
	for (let sprite of list){
		batch.push(loadSprite(sprite.name, sprite.url))
	}
	sprites.batches.push(batch)
	let promise = Promise.all(batch)
	return promise
}

const sounds = {}
const playingSounds = []
function loadSound(name, type, url){
	sounds[name] = {
		type: type
	}
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest()
		$.ajax({
			url: url,
			xhrFields: {
				responseType: "blob"
			},
			success: (response) => {
				var audio = new Audio(URL.createObjectURL(response))
				audio.load()
				sounds[name].audio = audio
				loadedResources[2]++
				resolve()
			}
		})
		request.open("GET", url, true)
		request.responseType = "blob"
		request.onload = function(){
			if (this.status === 200){
				var audio = new Audio(URL.createObjectURL(this.response))
				audio.load()
				sounds[name].audio = audio
				resolve(audio)
			}
		}
	})
}
function loadSounds(list){
	let batch = []
	for (let sound of list){
		batch.push(loadSound(sound.name, sound.type, sound.url))
	}
	return Promise.all(batch)
}
function playSound(name){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let soundData = sounds[name]
	if (!soundData){
		console.warn("Tried to play nonexistent sound", name)
		resolvePromise()
		return promise
	}
	let snd = soundData.audio
	if (!snd.paused){
		snd = snd.cloneNode()
		snd.currentTime = 0
	}
	if (sounds[name].type === "music"){
		//Fade the sound effect in
		fadeSoundVolume(snd, 0, snd.volume)
	}
	snd.play()
	let duration = snd.duration
	playingSounds.push({name: name, type: sounds[name].type, audio: snd})
	setTimeout(() => {
		resolvePromise()
		delay(100).then(stopSound)
	}, duration * 1000)
	return promise
}
function stopSound(name){
	let toCheck = playingSounds.map(p => p)
	while (toCheck.length){
		let sound = toCheck[0]
		let snd = sound.audio
		if (snd.paused){
			let index = playingSounds.indexOf(sound)
			playingSounds.splice(index, 1)
		}
		if (sound.name === name){
			let index = playingSounds.indexOf(sound)
			playingSounds.splice(index, 1)
			if (sound.type === "music"){
				let originalVolume = snd.volume
				fadeSoundVolume(snd, originalVolume, 0)
				.then(() => {
					snd.pause()
					snd.volume = originalVolume
				})
			} else {
				sound.audio.pause()
			}
		}

		toCheck.splice(0, 1)
	}
}
function fadeSoundVolume(snd, from, to){
	let promise = new Promise(resolve => {
		$({val: from}).animate({val: to}, {
			duration: 2000,
			step: function(){
				snd.volume = this.val
			},
			complete: function(){
				resolve()
			}
		})
	})
	return promise
}

//Songs are loaded & stored the same way as sounds,
//but in a less memory-intensive way.
const songs = {}
function loadMusic(name, url){
	if (!url && songData[name]) {
		url = songData[name].source
	}
	sounds[name] = {type: "music"}
	return new Promise((resolve, reject) => {
		let snd = new Audio()
		snd.src = url
		snd.volume = 0.1
		snd.loop = true
		sounds[name].audio = snd
		snd.oncanplaythrough = () => {
			resolve(snd)
		}
	})
}
function changeMusic(name){
	let toStop = playingSounds.filter(sound => sound.type === "music")
	let found = false
	toStop.forEach(sound => {
		if (sound.name === name){
			found = true
		} else {
			stopSound(sound.name)
		}
	})

	if (found){
		return
	}

	if (sounds[name]){
		playSound(name)
	} else {
		loadMusic(name, songData[name].source)
		.then(val => {
			delay(500).then(() => playSound(name))
		})
	}
}

function getRandomTileType(){
	return weightedRandom(
		["red", "orange", "yellow", "green", "blue", "purple"],
		[1, 1, 1, 1, 1, 1]
	).item
}

function clearModal(modal){
	modal.removeClass().addClass("modal").addClass("fade")
	modal.find(".modal-header > .modal-title").html("")
	modal.find(".modal-body").html("")
	modal.find(".modal-footer").html("")
	modal.off("hidden.bs.modal")
}

function createAnnouncement(type, text, duration=1500){
	let promise = new Promise(resolve => {
		let obj = {
			type: type,
			text: text
		}
		let startUpTime = duration / 4
		let mainShowingTime = duration - startUpTime * 2
	
		let announcement = $("<div class='announcement'></div>")
		obj.elem = announcement
		announcement.addClass(type)
		announcement.text(text)
		announcement.hide()
		$("#game-announcements").append(announcement)
		announcement.fadeIn(startUpTime)
		.delay(mainShowingTime)
		.fadeOut(startUpTime)
		.queue(() => {
			resolve()
		})
	})
	return promise
}

function resize(){
	let screenW = document.body.clientWidth
	let screenH = document.body.clientHeight

	let intendedSize = Math.min(screenH, screenW * 0.6)
	$(canvas).css({"width":intendedSize,"height":intendedSize})
	canvas.width = intendedSize
	canvas.height = intendedSize

	//Resize health bars
	let healthBars = $(".health-bar")
	for (let healthBar of healthBars){
		let bar = $(healthBar).children(".bar")
		let width = bar.attr("data-width")
		if (width !== undefined){
			$(bar).css("width", width)
		}
	}
}

function doTick(){
	gameRound.tick()
}

let timeForTicks = []
let timeForFrames = []
function tick(){
	let now = Date.now()
	doTick()
	timeForTicks.push(Date.now() - now)
	now = Date.now()
	requestAnimationFrame(render)
	timeForFrames.push(Date.now() - now)

	let checkTime = 30
	if (timeForTicks.length >= checkTime){
		let sumT = 0
		let sumF = 0
		for (let i = 0; i < timeForTicks.length; i++){
			sumT += timeForTicks[i]
		}
		for (let i = 0; i < timeForFrames.length; i++){
			sumF += timeForFrames[i]
		}
		let avgT = sumT / timeForTicks.length
		let avgF = sumF / timeForFrames.length
		let fpsT = Math.min(60, 1000 / avgT)
		let fpsF = Math.min(60, 1000 / avgF)
		let text = fpsT.toFixed(0) + "ups / " + fpsF.toFixed(0) + "fps"
		$("#fps").text(text)
		timeForTicks.splice(0, timeForTicks.length - checkTime * 0.9)
		timeForFrames.splice(0, timeForFrames.length - checkTime * 0.9)
	}
}

function handleMouseMove(event){
	let canvasOffset = $(canvas).offset()
	mouse.x = event.clientX - canvasOffset.left
	mouse.y = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseMove()
	}
}
function handleMouseDown(event){
	let canvasOffset = $(canvas).offset()
	mouse.isDown = true
	mouse.downX = event.clientX - canvasOffset.left
	mouse.downY = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseDown()
	}
}
function handleMouseUp(event){
	let canvasOffset = $(canvas).offset()
	mouse.isDown = false
	mouse.upX = event.clientX - canvasOffset.left
	mouse.upY = event.clientY - canvasOffset.top
	if (gameRound){
		gameRound.handleMouseUp()
	}
}

function renderHelperSprites(){
	let canvas = document.createElement("canvas")
	let ctx = canvas.getContext("2d")
	canvas.width = 200
	canvas.height = 200
	ctx.width = 200
	ctx.height = 200
	
	ctx.save()
	ctx.fillStyle = "#db3737"
	ctx.beginPath()
	ctx.arc(ctx.width * 0.5, ctx.height * 0.5, ctx.width * 0.5, 0, 2 * Math.PI)
	ctx.fill()
	let img1 = new Image()
	img1.src = canvas.toDataURL()
	sprites.images["enemy-circle"] = img1
	
	ctx.save()
	ctx.fillStyle = "#387bd9"
	ctx.beginPath()
	ctx.arc(ctx.width * 0.5, ctx.height * 0.5, ctx.width * 0.5, 0, 2 * Math.PI)
	ctx.fill()
	let img2 = new Image()
	img2.src = canvas.toDataURL()
	sprites.images["friendly-circle"] = img2
}

let loadedResources = [0, 0, 0, 0]
function loadResources(){
	renderHelperSprites()

	let sprites = [
		{name: "pokeballs", url: "src/img/pokeballs.png"},
		{name: "red", url: "src/img/tiles/red.png"},
		{name: "orange", url: "src/img/tiles/orange.png"},
		{name: "yellow", url: "src/img/tiles/yellow.png"},
		{name: "green", url: "src/img/tiles/green.png"},
		{name: "blue", url: "src/img/tiles/blue.png"},
		{name: "purple", url: "src/img/tiles/purple.png"},
	]
	sprites = sprites.concat(getAllStatusSprites())
	loadedResources[1] = sprites.length

	let sounds = [
		{name: "cascade1", type: "sound", url: "src/audio/Cascade1.wav"},
		{name: "cascade2", type: "sound", url: "src/audio/Cascade2.wav"},
		{name: "cascade3", type: "sound", url: "src/audio/Cascade3.wav"},
		{name: "cascade4", type: "sound", url: "src/audio/Cascade4.wav"},
		{name: "cascade5", type: "sound", url: "src/audio/Cascade5.wav"},
		{name: "cascade6", type: "sound", url: "src/audio/Cascade6.wav"},
		{name: "level-up", type: "sound", url: "src/audio/Level Up!.wav"},
	]
	loadedResources[3] = sounds.length

	let update = () => {
		let total = loadedResources[1] + loadedResources[3]
		let complete = loadedResources[0] + loadedResources[2]
		let completeTag = $("#loading-bar > .count > .count")
		let shown = parseInt(completeTag.text() || 0)
		animateTextCounter(shown, complete, completeTag)
		$("#loading-bar > .count > .max").text(total)
		$("#loading-bar > .bar").stop(true).animate({
			width: (complete / total * 100) + "%"
		})
	}
	update()

	let promise = new Promise((resolve, reject) => {
		loadSprites(sprites)
		.then(() => {
			return this.loadSounds(sounds)
		})
		.then(resolve)
	})
	let interval = setInterval(update, 100)
	promise = promise
	.then(() => openDatabase())
	.then(() => doesSaveDataExist())
	//If we found data, show the save files. Otherwise, just move on.
	.then(val => {
		return new Promise(resolve => {
			if (val){
				findPreviousSaveData()
				.then(saves => {
					let saveFileTag = $("#save-files")
					saveFileTag.animate({opacity: 1})
					let list = saveFileTag.children(".list")

					let chosen = null
					const click = event => {
						let target = $(event.currentTarget)
						let index = parseInt(target.attr("data-save"))
						list.children(".active").removeClass("active")
						if (chosen === index){
							chosen = null
							playerSaveId = null
							$("#loading-bar > .start").text("Start")
						} else {
							chosen = index
							playerSaveId = saves[index].uuid
							$("#loading-bar > .start").text("Continue")
							target.addClass("active")
						}
					}

					for (let i = 0; i < saves.length; i++){
						let tag = $(`<div class='save-file btn btn-primary' data-save='${i}'>${i + 1}</div>`)
						list.append(tag)
						tag.click(click)
					}
					resolve()
				})
			} else {
				resolve()
			}
		})
	})
	.then(() => {
		update()
		clearInterval(interval)

		delay(1000).then(() => {
			$("#loading-bar").animate({
				width: "30%",
				height: "+=20px"
			}, 1000)
			$("#loading-bar > .bar").addClass("ready")
			$("#loading-bar > .count").fadeOut()
			$("#loading-bar > .start").fadeIn()
			$("#loading-bar").click(() => {
				$("#title-screen *").off("click")
				$("#title-screen").fadeOut().queue(() => {
					$("#game").fadeIn()
				})
				if (playerSaveId){
					continueGame()
				} else {
					beginNewGame()
				}
			})
		})
	})
	return promise
}

function beginNewGame(){
	makeNewSaveFile()
	.then(uuid => {
		playerSaveId = uuid
	})
	.then(() => getPlayerBoxes(playerSaveId))
	.then(boxes => {
		boxes.forEach(box => playerPCBoxes.push(box))
	})
	.then(() => startScene("choose-starter"))
	.then(() => changeScene("route", {name: "Route 1"}))
}

function continueGame(){
	getPlayerPokemon(playerSaveId)
	.then(result => {
		result.forEach(obj => {
			let pokemon = new Pokemon(obj.name, obj.pokemonName, obj)
			caughtPokemon.push(pokemon)

			if (obj.activeSlot !== -1){
				playerActivePokemon[obj.activeSlot] = pokemon
			}
		})
	})
	.then(() => getPlayerBoxes(playerSaveId))
	.then(boxes => {
		boxes.forEach(box => playerPCBoxes.push(box))
	})
	.then(() => getPlayerLevelData(playerSaveId))
	.then(result => {
		result.forEach(obj => {
			let level = levelData.find(l => l.id === obj.id)
			if (!level) return
			level.status = obj.status
		})
	})
	.then(() => changeScene("route", {name: "Route 1"}))
}

window.onresize = resize
window.onmousemove = handleMouseMove
window.onmousedown = handleMouseDown
window.onmouseup = handleMouseUp
resize()

loadResources()
// .then(beginRound)