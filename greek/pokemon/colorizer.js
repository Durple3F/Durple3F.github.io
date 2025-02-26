const c = document.getElementById("screen")
const ctx = c.getContext("2d")

const c2 = document.createElement("canvas")
const ctx2 = c2.getContext("2d")

let completeImages = 0
function imageIsLoaded(){
	completeImages++

	if (completeImages >= layers.length){
		render()
	}
}

const layerOptions = [
	{
		name: "Brightness",
		class: "brightness",
		val: 100,
		min: 0,
		max: 300,
		pattern: "%v%"
	},
	{
		name: "Sepia",
		class: "sepia",
		val: 0,
		min: 0,
		max: 100,
		pattern: "%v%"
	},
	{
		name: "Hue Rotate",
		class: "hue-rotate",
		val: 0,
		min: 0,
		max: 360,
		pattern: "%vdeg"
	},
	{
		name: "Contrast",
		class: "contrast",
		val: 100,
		min: 0,
		max: 300,
		pattern: "%v%"
	},
	{
		name: "Saturation",
		class: "saturation",
		val: 100,
		min: 0,
		max: 300,
		pattern: "%v%"
	},
	{
		name: "Brightness 2",
		class: "brightness2",
		val: 100,
		min: 0,
		max: 300,
		pattern: "%v%"
	},
]

const imageW = colorData[pokemonCode].imageW
const imageH = colorData[pokemonCode].imageH
const layers = colorData[pokemonCode].layers

const images = []
for (var i in layers){
	let layer = layers[i]
	let url = layer.url
	let img = new Image()
	img.src = "images/"+url+".png"

	img.onload = function(){
		if (img.complete){
			imageIsLoaded()
		} else {
			img.onload = imageIsLoaded
		}
	}

	images.push(img)
}
function setup(){
	for (let i in layers){
		let layer = layers[i]

		let controls = $("<div class='filter-selector'>")
		controls.attr("data-layer", i)
		controls.append(`<h3>Layer ${i}: ${layer.name}</h3>`)

		if (layer.category){
			controls.attr("data-category", layer.category)
			let catControls = $(`<div class='category-controls'></div>`)
			catControls.append(`<label>Combine styles for this category?</label>`)
			let checkbox = $(`<input type='checkbox'>`)
			catControls.append(checkbox)
			controls.append(catControls)
		}
	
		for (let setting of layerOptions){
			let options = $("<div class='filter-option'></div>")
			options.attr("data-setting", setting.class)
	
			options.append(`<label>${setting.name}:</label>`)
			let feedback = `${applyPattern(setting, setting.val)}`
			options.append(`<span>${feedback}</span>`)
			options.append(`<input type="range"
				value="${setting.val}"
				min="${setting.min}"
				max="${setting.max}"
				data-default="${setting.val}">`)
			controls.append(options)
		}
	
		$("#controls").append(controls)
	}

	c.height = imageH
	c.width = imageW
	c2.height = imageH
	c2.width = imageW
}
setup()

function render(){
	const w = ctx.width
	const h = ctx.height
	ctx.clearRect(0, 0, w, h)

	for (let layer in images){
		let img = images[layer]
		let options = $(`.filter-selector[data-layer=${layer}]`)
		let bri, sep, deg, sat, bri2, con
		if (options.length){
			bri = options.find("[data-setting=brightness] > input").val() / 100
			sep = options.find("[data-setting=sepia] > input").val() / 100
			deg = options.find("[data-setting=hue-rotate] > input").val()
			con = options.find("[data-setting=contrast] > input").val() / 100
			sat = options.find("[data-setting=saturation] > input").val() / 100
			bri2 = options.find("[data-setting=brightness2] > input").val() / 100
		}
		else {
			//deg = Math.floor(Math.random()*360)
			//sat = 2 - (Math.floor(Math.random()*200)/100)
			bri = 1
			sep = 0
			deg = 0
			con = 1
			sat = 1
			bri2 = 1
		}

		let filter = [
			`brightness(${bri})`,
			`sepia(${sep})`,
			`hue-rotate(${deg}deg)`,
			`contrast(${con})`,
			`saturate(${sat})`,
			`brightness(${bri2})`,
		].join(" ")
		console.log(filter)
		
		ctx.filter = filter
		ctx.drawImage(img, 0, 0)
	}
}

function applyPattern(setting, value){
	return setting.pattern.replaceAll("%v", value)
}

function reset(){
	let inputs = $(".filter-option input")
	for (let input of inputs){
		console.log(input)
		$(input).val($(input).attr("data-default"))
		updateFeedback(input)
	}
	render()
}

let inputType = "range"
function toggleInputType(){
	if (inputType === "range"){
		$("#controls input[type=range]").attr("type", "number")
		inputType = "number"
	}
	else {
		$("#controls input[type=number]").attr("type", "range")
		inputType = "range"
	}
}

function updateFeedback(changed){
	let parent = $(changed).parent()
	let layer = $(parent).attr("data-setting")
	let setting = layerOptions.find(v => v.class == layer)
	let feedback = $(parent).children("span")
	let value = $(changed).val()
	feedback.html(applyPattern(setting, value))
}

function updateCombination(changed){
	let newValue = $(changed).is(":checked")
	let parent = $(changed).parents(".filter-selector")
	let category = parent.attr("data-category")
	let selector = `.filter-selector[data-category=${category}]`
	let checkboxes = $(selector).find(".category-controls > input[type=checkbox]")
	checkboxes.prop("checked", newValue)

	let filterOptions = $(selector).children(".filter-option")
	for (let option of filterOptions){
		let setting = $(option).attr("data-setting")
		let share = newValue ? `${category}-${setting}` : ""
		$(option).attr("data-share", share)
	}
}

function shareData(target, share){
	let newValue = $(target).val()
	let toShare = $(`.filter-option[data-share=${share}]`)

	for (let option of toShare){
		let input = $(option).children("input")[0]
		$(input).val(newValue)
		updateFeedback(input)
	}
}

function handleChange(event){
	let target = event.currentTarget
	let parent = $(target).parents(".filter-option")
	let shouldShare = !!parent.attr("data-share")
	if (shouldShare){
		shareData(target, parent.attr("data-share"))
	}
	updateFeedback(event.currentTarget)
	render()
}

$("#render").click(render)
$("#reset").click(reset)
$("#switch").click(toggleInputType)

$(".category-controls > input").change(function(event){
	updateCombination(event.currentTarget)
})

$(".filter-option > input").change(handleChange)