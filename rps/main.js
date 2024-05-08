let FPS = 60
let conversionChance = 0.2

//0: Rock
//1: Paper
//2: Scissors
//This function returns true if a is beaten by b.
const colors = [
	[0, 0, 0, 255],
	[51, 160, 44, 255],
	[31, 120, 180, 255],
	[231, 41, 138, 255],
	[224, 59, 40, 255],
	[224, 205, 27, 255],
]
const winRules = {
	0: [0, 1, 1, 1, 1, 1],
	1: [0, 0, 1, 0, 0, 1],
	2: [0, 0, 0, 1, 1, 0],
	3: [0, 1, 0, 0, 0, 1],
	4: [0, 1, 0, 1, 0, 0],
	5: [0, 0, 1, 0, 1, 0]
}
function runRules(a, b){
	return winRules[a][b] && Math.random() > conversionChance
}

let screenW = $(window).width()
let screenH = $(window).height()
let w = screenW
let h = screenH

const c = document.getElementById("screen")
const ctx = c.getContext("2d")
ctx.imageSmoothingEnabled = false
const neighborMap = {}
function resize(){
	let givenW = parseInt($("#width").val())
	let givenH = parseInt($("#height").val())

	let screenW = $(window).width()
	let screenH = $(window).height()

	if (!givenW && !givenH){
		w = Math.floor(screenW * 0.5)
		h = Math.floor(screenH * 0.5)
	} else {
		w = givenW
		h = givenH
	}

	c.width = Math.round(w)
	c.height = Math.round(h)

	let size = w * h
	for (let i = 0; i < size; i++){
		let neighbors = []

		//up-left
		if (i > w - 1 && i % w !== 0) neighbors.push(i - w - 1)
		//up
		if (i > w - 1) neighbors.push(i - w)
		//up-right
		if (i > w - 1 && i % w !== w - 1) neighbors.push(i - w + 1)
		//left
		if (i % w !== 0) neighbors.push(i - 1)
		//right
		if (i % w !== w - 1) neighbors.push(i + 1)
		//down-left
		if (i < size - w && i % w !== 0) neighbors.push(i + w - 1)
		//down
		if (i < size - w) neighbors.push(i + w)
		//down-right
		if (i < size - w && i % w !== w - 1) neighbors.push(i + w + 1)

		neighborMap[i] = neighbors
	}
}
$(window).on("resize", resize)

let frame = 0
function drawFrame(){
	frame++
	let size = w * h
	let bytes = size * 4
	let data = new Uint8ClampedArray(bytes)
	let state = currentState
	for (let i = 0; i < size; i++){
		let px = i * 4
		let v = state[i]
		let color = colors[v]
		
		data[px] = color[0]
		data[px + 1] = color[1]
		data[px + 2] = color[2]
		data[px + 3] = color[3]
	}

	let imageData = new ImageData(data, w, h)
	ctx.putImageData(imageData, 0, 0)
}

let tickInterval
let timeStats = []
let densityStats = []
function tick(){
	let s = Date.now()
	let state = currentState
	let size = currentState.length
	let newState = createNewState(state)
	let density = []
	let cLen = colors.length
	for (let i = 0; i < cLen; i++){
		density.push(0)
	}
	for (let i = 0; i < size; i++){
		let v = state[i]
		density[v]++
		let nbr = neighborMap[i]

		let seen = []
		let winCounts = {}
		let len = nbr.length
		for (let j = 0; j < len; j++){
			let v2 = state[nbr[j]]
			let r = runRules(v, v2)
			// if (wins > 2) {
			// 	winner = v2
			// 	break
			// }
			winCounts[v2] = (winCounts[v2] ?? 0) + r
			if (r && v !== v2) seen.push(v2)
		}
		//console.log(winCounts)
		let mostWins = 0
		let mostWinsCount = 0
		let sLen = seen.length
		for (let j = 0; j < sLen; j++){
			let amt = winCounts[seen[j]]
			if (amt > mostWinsCount){
				mostWins = seen[j]
				mostWinsCount = amt
			}
		}
		//console.log(i, seen, winCounts, mostWins, mostWinsCount)
		newState[i] = mostWinsCount > 2 ? (Math.random() > conversionChance ? mostWins : v) : v
	}
	currentState = newState
	drawFrame()
	let time = Date.now() - s
	timeStats.push(time)
	densityStats.push(density)

	let densities = densityStats[densityStats.length - 1]
	let statsBox = $("#stats")
	let statsHtml = ""
	for (let i = 0; i < densities.length; i++){
		if (densities[i] === 0) continue
		let p = (densities[i] / size * 100).toFixed(2) + "%"
		statsHtml += `<p>C${i}:${p}</p>`
	}
	statsBox.html(statsHtml)
}

let timeStatsInterval
function displayTimeStats(){
	let sum = 0
	let len = timeStats.length
	for (let i = 0; i < len; i++){
		sum += timeStats[i]
	}
	let avg = sum / len
	let fps = 1000 / (avg)
	let realFPS = Math.min(fps, FPS)
	document.getElementById("fps").innerHTML = realFPS.toFixed(2) + "fps"
	timeStats.splice(0, len)
	
	if (densityStats.length > 10000) {
		densityStats.splice(0, densityStats.length - 10000)
	}
}

function dist(x1, y1, x2, y2){
	let d1 = (x2 - x1)
	let d2 = (y2 - y1)
	return Math.sqrt(d1 * d1 + d2 * d2)
}

let started = false
let playing = false
let currentState = new Uint8ClampedArray()
function start(){
	resize()
	started = true
	//$("#start").hide()
	let state = createNewState()
	currentState = state
	let size = w * h
	let toSpawn = Math.max(colors.length, Math.sqrt(size) * 0.4)
	let ps = []
	for (let i = 0; i < toSpawn; i++){
		ps.push([
			Math.random() * w,
			Math.random() * h,
			Math.floor(Math.random() * (colors.length - 1)) + 1
		])
	}
	for (let i = 0; i < size; i++){
		let x = i % w
		let y = (i / w)|0
		let ds = ps.map(d => dist(x, y, d[0], d[1]))
		let min = Math.min(...ds)
		let index = ds.indexOf(min)
		state[i] = ps[index][2]
	}

	play()
}

function createNewState(oldState){
	let size = w * h
	let state = new Uint8ClampedArray(size)

	if (oldState !== undefined){
		let oldSize = oldState.length
		for (let i = 0; i < oldSize; i++){
			state[i] = oldState[i]
		}
	}

	return state
}

function toggleControlsExpand(){
	$("#controls").toggleClass("active")
	changeColorCount()

	if ($("#controls").hasClass("active")){
		$("#expand").html("Un-expand")
	} else {
		$("#expand").html("Expand")
	}
}

function colorToHex(c){
	let r = (c[0] < 16 ? "0" : "") + c[0].toString(16)
	let g = (c[1] < 16 ? "0" : "") + c[1].toString(16)
	let b = (c[2] < 16 ? "0" : "") + c[2].toString(16)
	return "#"+r+g+b
}

function changeColorCount(){
	let colorCount = parseInt($("#color-count").val())
	$(".color-box").remove()
	$(".beats-box").remove()
	for (let i = 1; i <= colorCount; i++){
		let color = $(`<div class='color-box extra'></div>`)
		color.append(`<label>Color ${i}:</label>`)
		let hex
		if (colors[i]){
			hex = colorToHex(colors[i])
		} else {
			if (!colors[i]){
				colors[i] = [
					Math.floor(Math.random() * 255),
					Math.floor(Math.random() * 255),
					Math.floor(Math.random() * 255),
					255
				]
			}
			let c = colors[i]
			hex = colorToHex(c)
		}
		color.append(`<input class='extra color'
			data-color='${i}' type='color' value='${hex}'>`)
		$("#controls").append(color)
	}
	$(".color").change(changeColor)
	colors.splice(colorCount + 1, Infinity)

	for (let i = 1; i <= colorCount; i++){
		if (!winRules[i]) winRules[i] = []
		winRules[i][0] = 0
		for (let j = 1; j <= colorCount; j++){
			winRules[i][j] = winRules[i][j] ?? Math.floor(Math.random() + 0.5)
		}
	}

	for (let i = 1; i <= colorCount; i++){
		let beats = $(`<div class='beats-box extra'></div>`)
		beats.append(`<label>Color ${i} is beaten by:</label>`)
		for (let j = 1; j <= colorCount; j++){
			beats.append(`<label>${j}</label>`)
			let checked = winRules[i][j] ? "checked" : ""
			beats.append(`<input type='checkbox' class='beats-checkbox'
				data-color='${i}' data-beaten-by='${j}' ${checked}>`)
		}
		$("#controls").append(beats)
	}
	$(".beats-checkbox").change(changeRule)
}

function changeColor(event){
	let color = $(event.currentTarget).val()
	let i = $(event.currentTarget).attr("data-color")
	i = parseInt(i)
	let r = color.substring(1, 3)
	let g = color.substring(3, 5)
	let b = color.substring(5, 7)
	r = parseInt(r, 16)
	g = parseInt(g, 16)
	b = parseInt(b, 16)
	colors[i] = [r, g, b, 255]
}

function changeRule(event){
	let target = $(event.currentTarget)
	let a = parseInt(target.attr("data-color"))
	let b = parseInt(target.attr("data-beaten-by"))
	winRules[a][b] = target.is(":checked") ? 1 : 0
}

function play(){
	if (!started) return
	playing = true
	drawFrame()
	clearInterval(tickInterval)
	clearInterval(timeStatsInterval)
	tickInterval = setInterval(tick, 1000 / FPS)
	timeStatsInterval = setInterval(displayTimeStats, 1000)
}
function pause(){
	playing = false
	clearInterval(tickInterval)
	clearInterval(timeStatsInterval)
}

function keyPress(event){
	if (event.code === "Space"){
		if (playing) pause()
		else play()
	} else if (event.code === "Enter"){
		if (!playing) tick()
	}
}

function changeConversionChance(){
	let val = $("#conversion-chance").val()
	conversionChance = 1 - (parseInt(val) / 100)
	$("label[for=conversion-chance]").text(`Conversion chance: (${val}%)`)
}

function changeTargetFPS(){
	let val = $("#target-fps").val()
	FPS = parseInt(val)
	$("label[for=target-fps]").text(`Target FPS: (${FPS})`)
	if (playing){
		pause()
		play()
	}
}

let mouseX = 0
let mouseY = 0
let isMouseDown = false
let drawInterval
function draw(){
	let x = Math.floor(mouseX * w / screenW)
	let y = Math.floor(mouseY * h / screenH)

	if (isMouseDown){
		for (let i = 0; i < 3; i++){
			for (let j = 0; j < 3; j++){
				let index = (y+i) * w + (x+j)
				currentState[index] = 2
			}
		}
	}
}

function mouseMove(event){
	mouseX = event.clientX
	mouseY = event.clientY
}
function mouseDown(event){
	isMouseDown = true
}
function mouseUp(event){
	isMouseDown = false
}

resize()
changeColorCount()
changeConversionChance()
changeTargetFPS()

$("#start").click(start)
$("#expand").click(toggleControlsExpand)
$("#color-count").change(changeColorCount)
$("#conversion-chance").change(changeConversionChance)
$("#target-fps").change(changeTargetFPS)
$(document).on("keydown", keyPress)
$(document).on("mousemove", mouseMove)
$(document).on("mousedown", mouseDown)
$(document).on("mouseup", mouseUp)
drawInterval = setInterval(draw, 10)