const versionNumber = "v0.15.17"
let lang = "en"
let playerName

let timeSteps = 0
let frameRate = 60

const canvas = $("#screen")[0]
const ctx = canvas.getContext("2d")
const bgCanvas = $("#background-canvas")[0]
const background = new Background(bgCanvas)

const mouse = {
	x: 0,
	y: 0,
	isDown: false,
	downX: 0,
	downY: 0,
	upX: 0,
	upY: 0
}
let currentHoveredElement

const UNITVECTORS = [
	[1, 0],
	[0, 1],
]
const OPPOSITEVECTORS = new Map()
for (let v of UNITVECTORS){
	let opposite = v.map(x => x * -1)
	OPPOSITEVECTORS.set(v, opposite)
	OPPOSITEVECTORS.set(opposite, v)
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

	elem.attr("data-counter-target", to)
	$(fromObj).animate(toObj, {
		duration: duration,
		step: function(){
			elem.text(parseInt(this.val))
		},
		complete: function(){
			elem.text(parseInt(to))
			ongoingTextAnimations.delete(elem)
			elem.removeAttr("data-counter-target")
		}
	})
	ongoingTextAnimations.set(elem, fromObj)
}

function addFloatingText(text, elem, options){
	let color = options?.color ?? "white"
	let shadow = options?.shadow ?? null
	let fontSize = options?.fontSize ?? null
	let direction = options?.direction ?? "random"
	let distance = options?.distance ?? 100
	let duration = options?.duration ?? 500
	let side = options?.side ?? "center"
	let angleDeviation = options?.angleDeviation ?? 0
	let angleDevRad = angleDeviation * Math.PI / 180
	let floater = $("<div class='floating-text'></div>")
	floater.text(text)
	floater.css("color", color)
	$("body").append(floater)

	let jelem = $(elem)
	let offset = jelem.offset()
	let width = jelem.width()
	let height = jelem.height()
	let elemWidth = floater.width()
	let elemHeight = floater.height()
	let xOff = 0
	let yOff = 0

	if (side === "center"){
		xOff = offset.left + width * 0.5
		yOff = offset.top + height * 0.5
	} else if (side === "right"){
		xOff = offset.left + width - elemWidth * 0.5
		yOff = offset.top + height * 0.5
	} else if (side === "left"){
		xOff = offset.left + elemWidth * 0.5
		yOff = offset.top + height * 0.5
	} else if (side === "top"){
		xOff = offset.left + width * 0.5
		yOff = offset.top
	} else {
		console.warn("You never handled", side)
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
	direction += 2*Math.random()*angleDevRad - angleDevRad
	
	//Presumably we've been given an angle
	tx = xOff - Math.cos(direction) * distance
	ty = yOff - Math.sin(direction) * distance

	if (fontSize){
		floater.css("font-size", fontSize*100+"%")
	}
	if (shadow){
		floater.css("text-shadow", `${shadow} 0 0 1em`)
	}

	floater.animate({
		left: tx, top: ty, opacity: 0
	}, duration).queue(() => {
		floater.remove()
	})
}

function getCSSEnergyColor(type){
	switch (type){
		case "red":
		return cssColors["energy-red"]
		case "orange":
		return cssColors["energy-orange"]
		case "yellow":
		return cssColors["energy-yellow"]
		case "green":
		return cssColors["energy-green"]
		case "blue":
		return cssColors["energy-blue"]
		case "purple":
		return cssColors["energy-purple"]
		default:
			console.warn("You never handled", type)
			return "pink"
	}
}

const sprites = {
	images: {},
	complete: {},
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
function loadSprite(name, url){
	if (name in sprites.images){
		if (sprites.images[name].complete){
			loadedResources[0]++
			return Promise.resolve()
		}
	}
	let img = new Image()
	img.src = url
	sprites.images[name] = img
	sprites.complete[name] = false
	let promise = new Promise((resolve, reject) => {
		img.onload = function(){
			handleSpriteLoad()
			sprites.complete[name] = true
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
function unloadSprite(name){
	delete sprites.images[name]
	delete sprites.complete[name]
}

function changeBackgroundImage(name, url){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let background = $("#background")
	if (name === "none"){
		let currentBg = background.css("background-image")
		let p = Promise.resolve()
		if (currentBg !== "none"){
			background.fadeOut(400)
			p = p.then(() => delay(400))
		}
		p.then(() => {
			background.css("background-image", "none")
			background.show()
			resolvePromise()
		})
		return promise
	}

	let p1 = loadSprite(name, url)
	let p2 = Promise.resolve()
	let currentBg = background.css("background-image")
	if (currentBg !== "none"){
		background.fadeOut(400)
		p2 = delay(400)
	} else {
		background.hide()
	}
	Promise.all([p1, p2]).then(() => {
		let image = sprites.images[name]
		let canvas = document.createElement("canvas")
		canvas.height = image.height
		canvas.width = image.width
		let ctx = canvas.getContext("2d")
		ctx.drawImage(image, 0, 0)
		let dataURL = canvas.toDataURL()
		
		background.css("background-image", `url("${dataURL}")`)
		background.fadeIn()
		resolvePromise()
	})
	return promise
}

let currentMusic
const sounds = {}
const playingSounds = []
function loadSound(name, type, url){
	if (sounds[name]){
		return sounds[name].promise
	}
	sounds[name] = {
		type: type
	}
	let promise = new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			xhrFields: {
				responseType: "blob"
			},
			success: (response) => {
				var audio = new Audio(URL.createObjectURL(response))
				audio.muted = config.muted[type]
				audio.volume = config.volumes[type]
				audio.load()
				sounds[name].audio = audio
				loadedResources[2]++
				audio.oncanplaythrough = () => resolve(audio)
			}
		})
		// No idea what I was thinking when I wrote this code
		// let request = new XMLHttpRequest()
		// request.open("GET", url, true)
		// request.responseType = "blob"
		// request.onload = function(){
		// 	if (this.status === 200){
		// 		var audio = new Audio(URL.createObjectURL(this.response))
		// 		audio.load()

		// 		audio.muted = config.muted[type]
		// 		audio.volume = config.volumes[type]

		// 		sounds[name].audio = audio
		// 		console.log("Just ran the weird code")
		// 		resolve(audio)
		// 	}
		// }
	})
	sounds[name].promise = promise
	return promise
}
function loadSounds(list){
	let batch = []
	for (let sound of list){
		batch.push(loadSound(sound.name, sound.type, sound.url))
	}
	return Promise.all(batch)
}
function playSound(name, fadeMusic=true){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let soundData = sounds[name]
	if (!soundData){
		console.warn("Tried to play nonexistent sound", name)
		resolvePromise()
		return promise
	}
	let snd = soundData.audio
	if (!snd){
		console.warn("Couldn't play sound",name)
		resolvePromise()
		return promise
	}
	if (snd && !snd.paused){
		snd = snd.cloneNode()
		snd.currentTime = 0
	}
	snd.volume = config.volumes[soundData.type]
	snd.muted = config.muted[soundData.type]
	if (sounds[name].type === "music" && fadeMusic){
		//Fade the sound effect in
		fadeSoundVolume(snd, 0, snd.volume)
	}
	snd.play()
	playingSounds.push({name: name, type: sounds[name].type, audio: snd})
	snd.addEventListener("ended", () => {
		resolvePromise()
		delay(100).then(() => stopSound(name))
	})
	return promise
}
function stopSound(name, fadeMusic=true){
	let toCheck = playingSounds.map(p => p)
	for (let sound of toCheck){
		let snd = sound.audio
		if (snd.paused){
			let index = playingSounds.indexOf(sound)
			if (index !== -1){
				playingSounds.splice(index, 1)
			}
		}
		if (sound.name === name){
			let index = playingSounds.indexOf(sound)
			if (index !== -1){
				playingSounds.splice(index, 1)
			}
			if (sound.type === "music" && fadeMusic){
				let originalVolume = snd.volume
				fadeSoundVolume(snd, originalVolume, 0)
				.then(() => {
					snd.pause()
					snd.volume = originalVolume
					snd.currentTime = 0
				})
			} else {
				sound.audio.pause()
			}
		}
	}
}
function unloadSound(name){
	delete sounds[name]
}
function fadeSoundVolume(snd, from, to, duration){
	if (!duration) duration = 2000
	let promise = new Promise(resolve => {
		$({val: from}).animate({val: to}, {
			duration: duration,
			step: function(){
				snd.volume = this.val
			},
			complete: function(){
				snd.volume = to
				resolve()
			}
		})
	})
	return promise
}

//Songs are loaded & stored the same way as sounds,
//but in a less memory-intensive way.
const songs = {}
function loadMusic(name, url, loops=false){
	let data = songData[name] ?? {}
	if (!url && data) {
		url = data.source
	}
	sounds[name] = {type: "music"}
	sounds[name].children = []
	let promises = []
	let promise = new Promise((resolve, reject) => {
		let snd = new Audio()
		snd.src = url
		snd.volume = config.volumes["music"]
		sounds[name].audio = snd
		snd.muted = config.muted["music"]
		snd.audio = config.volumes["music"]
		if (data.loops || loops){
			snd.loop = true
		}
		if (data.loopTransition){
			let loopName = name+"-loop"
			let loopPromise = loadMusic(loopName, data.loopSource, true)
			promises.push(loopPromise)
			snd.onended = () => {
				playSound(loopName, false)
			}
			sounds[name].children.push(loopName)
		}

		snd.oncanplaythrough = () => {
			resolve(snd)
		}
	})
	promises.push(promise)
	return Promise.all(promises)
}
function changeMusic(name){
	let toStop = playingSounds.filter(sound => sound.type === "music")
	let found = false
	toStop.forEach(sound => {
		if (sound.name === name){
			found = true
		} else {
			//If we find other songs playing, kill them.
			stopSound(sound.name)
		}
	})

	//If that song is already playing, don't do anything.
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
	let shown = modal.hasClass("show")
	modal.removeClass().addClass("modal").addClass("fade")
	if (shown) modal.addClass("show")
	modal.find(".modal-header").empty().append("<div class='modal-title'>")
	modal.find(".modal-header").removeClass().addClass("modal-header")
	modal.find(".modal-header > .modal-title").empty()
	modal.find(".modal-header > .modal-title").removeClass().addClass("modal-title")
	modal.find(".modal-body").empty()
	modal.find(".modal-body").removeClass().addClass("modal-body")
	modal.find(".modal-footer").empty()
	modal.find(".modal-footer").removeClass().addClass("modal-footer")
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
	let initiativesHeight = $(".board-center > .initiatives").height()
	let realH = screenH - initiativesHeight

	let intendedSize = Math.min(realH, screenW * 0.6) * 0.95
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

	//Resize initiative bars
	let initiativeBars = $(".initiative")
	for (let initiativeBar of initiativeBars){
		let bar = $(initiativeBar).children(".bar")
		let width = bar.attr("data-width")
		if (width !== undefined){
			$(bar).css("width", width)
		}
	}

	//Resize the dialogue box to fit
	let intendedDialogueRatio = 20 / 9
	let currentRatio = screenW / screenH
	let dialogueContainer = $("#dialogue-container")
	let newW = screenW, newH = screenH
	let xOffset = 0, yOffset = 0
	if (currentRatio > intendedDialogueRatio){
		//Screen is too wide
		newW = screenH * intendedDialogueRatio
		remainingW = screenW - newW
		xOffset = remainingW * 0.5
	} else {
		//Screen is too short
		newH = screenW / intendedDialogueRatio
		remainingH = screenH - newH
		yOffset = remainingH * 0.5
	}
	dialogueContainer.css("width", newW)
	dialogueContainer.css("height", newH)
	dialogueContainer.css("left", xOffset)
	dialogueContainer.css("top", yOffset)

	background.resize()
	background.render()
}

let timeForTicks = []
let timeForFrames = []
function tick(){
	let now = Date.now()
	gameRound.tick()
	timeForTicks.push(Date.now() - now)
	requestAnimationFrame(render)

	let checkTime = 100
	if (timeForTicks.length >= checkTime){
		let sumT = 0
		let maxT = 0
		let sumF = 0
		let maxF = 0
		for (let i = 0; i < timeForTicks.length; i++){
			let t = timeForTicks[i]
			sumT += t
			if (t > maxT) maxT = t
		}
		for (let i = 0; i < timeForFrames.length; i++){
			let t = timeForFrames[i]
			sumF += t
			if (t > maxF) maxF = t
		}
		let avgT = sumT / timeForTicks.length
		let avgF = sumF / timeForFrames.length
		let fpsT = 1000 / avgT //Math.min(60, 1000 / avgT)
		let fpsF = 1000 / avgF //Math.min(60, 1000 / avgF)
		let text = ""
		if (config.showFPS === "dev"){
			text = "Tick:"+avgT.toFixed(2)+"ms (max "+maxT+")<br>Frame:"+avgF.toFixed(2)+"ms (max "+maxF+")"
		} else if (config.showFPS === "normal"){
			text = fpsT.toFixed(0) + "ups / " + fpsF.toFixed(0) + "fps"
		}
		$("#fps").html(text)
		timeForTicks.splice(0, timeForTicks.length - checkTime * 0.9)
		timeForFrames.splice(0, timeForFrames.length - checkTime * 0.9)
	}
}

function handleMouseMove(event){
	currentHoveredElement = event.target
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

	//TODO would be nice to have more options for status circles

	//Maybe render blurs here?
	// canvas.width = 200
	// canvas.height = 200
	// ctx.width = 200
	// ctx.height = 200
	// ctx.save()
	// ctx.filter = "blur(" + blurAmount + "px)"
	// ctx.fillStyle = "#db3737"
	// ctx.beginPath()
	// ctx.arc(ctx.width * 0.5, ctx.height * 0.5, ctx.width * 0.5, 0, 2 * Math.PI)
	// ctx.fill()
	// let img3 = new Image()
	// img3.src = canvas.toDataURL()
	// sprites.images["blur-test"] = img1
}

function resetEntirePage(){
	loadedResources = [0, 0, 0, 0]
	currentSceneInfo = {}

	Object.values(sounds).forEach(sound => {
		stopSound(sound.name)
	})
	playingSounds.forEach(sound => {
		stopSound(sound.name)
	})

	$("body > div[data-initially-hidden='true']").fadeOut()
	$("#title-screen").show().fadeIn()

	$("#save-files").find(".save-file").remove()
	$("#loading-bar").removeClass("complete")
	$("#loading-bar").children(".count").show()
	$("#loading-bar").children(".start").hide()
}

let loadedResources = [0, 0, 0, 0]
function loadResources(){
	resetEntirePage()
	renderHelperSprites()

	let sprites = [
		{name: "pokeballs", url: "src/img/pokeballs.png"}
	]
	sprites = sprites.concat(
		Object.keys(tileIconUrls)
		.map(key => {
			return {name: key, url: tileIconUrls[key]}
		})
	)
	// sprites = sprites.concat(getAllStatusSprites())
	loadedResources[1] = sprites.length

	let soundsToLoad = [
		{name: "cascade1", type: "sound", url: "src/audio/Cascade1.wav"},
		{name: "cascade2", type: "sound", url: "src/audio/Cascade2.wav"},
		{name: "cascade3", type: "sound", url: "src/audio/Cascade3.wav"},
		{name: "cascade4", type: "sound", url: "src/audio/Cascade4.wav"},
		{name: "cascade5", type: "sound", url: "src/audio/Cascade5.wav"},
		{name: "cascade6", type: "sound", url: "src/audio/Cascade6.wav"},
		{name: "level-up", type: "sound", url: "src/audio/Level Up!.wav"},
		{name: "healing", type: "sound", url: "src/audio/healing.mp3"},
		{name: "shiny-appear", type: "sound", url: "src/audio/shiny_appear.mp3"},
	]
	loadedResources[3] = soundsToLoad.length

	let localeFinished = 0

	const countCompleteSounds = () => {
		let done = 0
		for (let sound of soundsToLoad){
			let soundName = sound.name
			if (sounds[soundName] && sounds[soundName]?.audio?.readyState === 4){
				done++
			}
		}
		return done
	}

	const update = () => {
		let total = loadedResources[1] + loadedResources[3] + 1
		let complete = loadedResources[0] + countCompleteSounds() + localeFinished
		let completeTag = $("#loading-bar > .count > .count")
		let shown = parseInt(completeTag.text() || 0)
		animateTextCounter(shown, complete, completeTag)
		$("#loading-bar > .count > .max").text(total)
		let width = (complete / total * 100)
		if (width > 100) width = 100
		$("#loading-bar > .bar").stop(true).animate({
			width: width + "%"
		})
	}
	update()

	let promises = [
		loadSprites(sprites),
		loadSounds(soundsToLoad),
		downloadLocale(lang).then(() => new Promise(resolve => {
			localeFinished++
			resolve()
		}))
	]
	sprites.forEach(sprite => {
		let p = loadSprite(sprite.name, sprite.url)
		.then(() => loadedResources[0]++)

		promises.push(p)
	})
	for (let tileStatusName in tileStatusData){
		let data = tileStatusData[tileStatusName]
		loadedResources[1]++
		let p = loadStatusSprite(data)
		.then(() => loadedResources[0]++)
		promises.push(p)
	}

	let interval = setInterval(update, 100)
	let promise = Promise.all(promises)
	.then(() => openDatabase())
	.then(() => doesSaveDataExist())
	//If we found data, show the save files. Otherwise, just move on.
	.then(val => new Promise(resolve => {
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
						playerName = saves[index].name || null
						let settings = saves[index].settings
						for (let key in settings){
							config[key] = settings[key]
						}
						let newSaveData = saves[index]?.data ?? {}
						//Remove all existing data from playerSaveInfo
						Object.keys(playerSaveInfo).forEach(key => delete playerSaveInfo[key])
						//Carry over data from new save
						Object.keys(newSaveData).forEach(key => playerSaveInfo[key] = newSaveData[key])

						$("#loading-bar > .start").text("Continue")
						target.addClass("active")
					}
				}

				for (let i = 0; i < saves.length; i++){
					let tag = $(`<div class='save-file btn btn-primary' data-save='${i}'></div>`)
					let save = saves[i]
					let name = save.name ?? (i + 1)
					tag.text(name)
					list.append(tag)
					tag.click(click)
				}
				resolve()
			})
		} else {
			resolve()
		}
	}))
	.then(() => {
		update()
		clearInterval(interval)

		delay(1000).then(() => {
			$("#loading-bar").addClass("complete")
			$("#loading-bar > .bar").addClass("ready")
			$("#loading-bar > .count").fadeOut()
			$("#loading-bar > .start").fadeIn()
			$("#loading-bar").off("click")
			.on("click", () => {
				$("#title-screen *").off("click")
				$("#title-screen").stop(true)
				.fadeOut().queue(() => {
					// $("#game").empty().fadeIn()
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

function openSettings(){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")
	clearModal(modal)
	modal.addClass("wide")
	let body = modal.find(".modal-body")

	modal.find(".modal-title").html(`<h6 class='display-6 text-center'>Settings</h6>`)

	//SOUND SETTINGS

	let rangeSize = 1000
	let numSize = 100

	let changeMuted = (type, muted) => {
		Object.values(sounds).forEach(sound => {
			if (sound.type !== type) return
			let snd = sound.audio
			snd.muted = muted
		})
	}
	let changeVolume = (type, volume) => {
		Object.values(sounds).forEach(sound => {
			if (sound.type !== type) return
			let snd = sound.audio
			fadeSoundVolume(snd, snd.volume, volume, 500)
		})
	}

	let changeMute = event => {
		let elem = event.currentTarget
		let type = elem.attributes["data-type"].value
		let muted = !elem.checked
		config.muted[type] = muted
		changeMuted(type, muted)
		let range = body.find(`.form-range[data-type="${type}"]`)
		let numInput = body.find(`.form-control[data-type="${type}"]`)
		range.attr("disabled", config.muted[type])
		numInput.attr("disabled", config.muted[type])
	}
	let changeRange = event => {
		let elem = event.currentTarget
		let type = elem.attributes["data-type"].value
		let value = Number(elem.value) || 0
		value /= rangeSize
		config.volumes[type] = value
		changeVolume(type, value)
		let numInput = body.find(`.form-control[data-type="${type}"]`)
		numInput.val(value * numSize)
	}
	let changeNumInput = event => {
		let elem = event.currentTarget
		let type = elem.attributes["data-type"].value
		let value = Number(elem.value) || 0
		value /= numSize
		config.volumes[type] = value
		changeVolume(type, value)
		let range = body.find(`.form-range[data-type="${type}"]`)
		range.val(value * rangeSize)
	}

	let soundTypes = Object.keys(config.volumes)
	for (let type of soundTypes){
		let section = $(`<div class='mb-3 d-flex align-items-center'></div>`)
		body.append(section)
		let name = getLocaleString("name", lang, ["settings", "sound-types", type])
		section.append(`<label class='form-label m-0' style='width: 20%;'>${name}</label>`)
		let checkbox = $(`<input class='form-check-input' type='checkbox' data-type='${type}'>`)
		let range = $(`<input class='form-range' type='range' min='0' max='${rangeSize}' data-type='${type}'>`)
		let numInput = $(`<input class='form-control text-center' style='width: 10%;' type='text' min='0' max='${numSize}' data-type='${type}'>`)
		checkbox.attr("checked", !config.muted[type])
		range.attr("disabled", config.muted[type])
		numInput.attr("disabled", config.muted[type])
		range.val(config.volumes[type] * rangeSize)
		numInput.val(config.volumes[type] * numSize)
		checkbox.on("change", changeMute)
		range.on("change", changeRange)
		numInput.on("change", changeNumInput)
		section.append(checkbox)
		section.append(range)
		section.append(numInput)
		section.append("%")
	}

	//TOGGLES
	let toggleInfo = [
		{
			text: "toggle-skip-seen-dialogue",
			key: "skipSeenDialogue"
		},
		{
			text: "toggle-exp-share",
			key: "expShare"
		},
		{
			text: "toggle-hard-mode",
			key: "hardMode"
		},
		{
			text: "toggle-level-lowering",
			key: "lowerLevelsToRecommendedLevels"
		},
		{
			text: "toggle-show-level-completion-data",
			key: "showLevelCompletionData"
		},
		{
			text: "toggle-pixelated-screen",
			key: "antialiasing",
			onclick: val => {
				let setting = val ? "smooth" : "pixelated"
				$("#screen").css("image-rendering", setting)
			}
		},
		{
			text: "toggle-screen-shake",
			key: "screenShake"
		},
		{
			text: "toggle-funny-mode",
			key: "funnyMode"
		},
	]
	for (let toggle of toggleInfo){
		let textName = toggle.text
		let text = getLocaleString(textName, lang, ["settings"])
		let key = toggle.key
		let section = $(`<div class='mb-3 d-flex align-items-center'></div>`)
		body.append(section)
		let checkbox = $("<input class='form-check-input' type='checkbox'>")
		let id = `setting-toggle-${key}`
		checkbox.attr("id", id)
		section.append(checkbox)
		section.append(`<label for='${id}'>${text}</label>`)
		if (config[key]){
			checkbox.attr("checked", true)
		}
		checkbox.change(() => {
			let checked = checkbox[0].checked
			config[key] = checked
			if (toggle.onclick){
				toggle.onclick(checked)
			}
		})
	}

	//SAVE FILE SETTINGS
	let saveButtonSection = $("<div class='d-flex justify-content-around w-75 mx-auto'></div>")
	body.append(saveButtonSection)

	let renameText = getLocaleString("rename-save", lang, ["settings"])
	let renameSaveButton = $(`<button class='btn btn-primary'>${renameText}</button>`)
	saveButtonSection.append(renameSaveButton)
	renameSaveButton.click(() => {
		modal.modal("hide")
		delay(400)
		.then(() => askToNameSave())
		.then(() => openSettings())
	})

	let getTransferText = getLocaleString("get-transfer-string", lang, ["settings"])
	let getTransferSuccessText = getLocaleString("get-transfer-string-success", lang, ["settings"])
	let getTransferButton = $(`<button class='btn btn-secondary'>${getTransferText}</button>`)
	saveButtonSection.append(getTransferButton)
	getTransferButton.click(() => {
		getSaveTransferString(playerSaveId)
		.then(transferString => {
			let elem = document.createElement("input")
			elem.value = transferString
			elem.select()
			elem.setSelectionRange(0, transferString.length)
			navigator.clipboard.writeText(elem.value)
			getTransferButton.text(getTransferSuccessText)
			delay(1000).then(() => {
				getTransferButton.text(getTransferText)
			})
		})
	})

	let importText = getLocaleString("import-save-file", lang, ["settings"])
	let importPromptText = getLocaleString("import-save-file-prompt", lang, ["settings"])
	let importSuccessText = getLocaleString("import-save-file-success", lang, ["settings"])
	let importButton = $(`<button class='btn btn-secondary'>${importText}</button>`)
	saveButtonSection.append(importButton)
	importButton.click(() => {
		let transferString = prompt(importPromptText)
		if (!transferString) return
		transferSaveFromString(transferString)
		.then(() => {
			alert(importSuccessText)
			modal.modal("hide")
			loadResources()
		})
	})

	let deleteText = getLocaleString("delete-save", lang, ["settings"])
	let deleteSaveButton = $(`<button class='btn btn-danger'>${deleteText}</button>`)
	saveButtonSection.append(deleteSaveButton)
	deleteSaveButton.click(() => {
		let text = getLocaleString("delete-save-confirm", lang, ["settings"])
		let sure = confirm(text)
		if (sure){
			deleteSaveFile(playerSaveId)
			.then(success => {
				if (!success){
					let text = getLocaleString("delete-save-failure", lang, ["settings"])
					alert(text)
					location.reload()
					return
				}
				alert("Successfully deleted save. However, it may be buggy, so I recommend refreshing your page.")
				modal.modal("hide")
				playerSaveId = null
				playerSaveInfo = {}
				loadResources()
			})
		}
	})
	if (!playerSaveId){
		deleteSaveButton.attr("disabled", true)
		getTransferButton.attr("disabled", true)
	}

	//BOTTOM BUTTONS

	let changelogBtn = $(`<button class='btn btn-secondary'></button>`)
	changelogBtn.text(`Changelog (${versionNumber})`)
	changelogBtn.click(openChangelog)

	modal.find(".modal-footer").append(changelogBtn)
	let btn = $(`<button class='btn btn-primary'>Continue</button>`)
	modal.find(".modal-footer").append(btn)

	btn.click(() => {
		modal.modal("hide")
	})
	modal.modal("show")
	modal.on("hidden.bs.modal", () => {
		resolvePromise()
	})

	promise = promise.then(() => {
		if (playerSaveId) return savePlayerInfo()
		return
	})

	return promise
}
function openChangelog(){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")
	clearModal(modal)
	modal.addClass("wide").addClass("show")
	let body = modal.find(".modal-body")

	modal.find(".modal-title").html(`<h6 class='display-6 text-center'>Changelog</h6>`)
	let btn = $(`<button class='btn btn-primary'>Continue</button>`)
	modal.find(".modal-footer").append(btn)

	$.ajax({
		url: "changelog.txt",
		success: function(data){
			let content = $("<div>")
			content.css("user-select", "text")
			content.html(data.replaceAll("\n", "<br>"))
			body.append(content)
		},
		error: function(){
			body.html("Error getting changelog :/")
		}
	})
	modal.on("hidden.bs.modal", () => {
		resolvePromise()
	})

	return promise
}

function beginNewGame(){
	makeNewSaveFile()
	.then(uuid => {
		playerSaveId = uuid
		return normalizeSave(playerSaveInfo)
	})
	.then(() => getPlayerBoxes(playerSaveId))
	.then(boxes => {
		boxes.forEach(box => playerPCBoxes.push(box))
	})
	.then(() => startScene("choose-starter"))
	.then(() => changeScene("route", {name: "Route 1"}))
}

function continueGame(){
	normalizeSave(playerSaveInfo)

	getPlayerPokemon(playerSaveId)
	.then(dataList => loadPlayerPokemon(dataList))
	.then(() => getPlayerBoxes(playerSaveId))
	.then(boxes => {
		boxes.forEach(box => playerPCBoxes.push(box))
	})
	.then(() => getPlayerLevelData(playerSaveId))
	.then(result => {
		levelData.forEach(level => {
			delete level.status
		})
		result.forEach(obj => {
			let level = getLevelDataById(obj.id)
			if (!level) return
			level.status = obj.status
			level.attempts = obj.attempts ?? 0
			level.completions = obj.completions ?? 0
		})
	})
	.then(() => normalizeSave(playerSaveInfo))
	.then(() => {
		let noPokemon = playerActivePokemon.length === 0
		if (!playerSaveInfo["started-game"] && noPokemon){
			return startScene("choose-starter")
		} else {
			return Promise.resolve()
		}
	})
	.then(() => changeScene("route", {name: "Route 1"}))
}

function handleVisibilityChange(){
	if (document.hidden){
		background.stopTicks()
		if (gameRound) gameRound.stopTicks()
	} else {
		background.startTicks()
		if (gameRound) gameRound.startTicks()
	}
}

document.onvisibilitychange = handleVisibilityChange
window.onresize = resize
window.onmousemove = handleMouseMove
window.onmousedown = handleMouseDown
window.onmouseup = handleMouseUp
resize()

$(canvas).on("mouseenter", () => {
	$(".popover").fadeOut()
})
$("#settings-btn").click(openSettings)

loadResources()