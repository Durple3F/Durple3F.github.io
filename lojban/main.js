let allSpans = $(".col span:not(.nofact)")
let story = storyInfo["general"]
if (typeof storyCode !== "undefined") {
	let newStory = storyInfo[storyCode]
	for (let factCode in newStory) {
		story[factCode] = newStory[factCode]
	}
}
else {
	storyCode = ""
}
const storyElemValues = {}
const storyColors = {}
const myrng = new Math.seedrandom(storyCode);

const colorValues = {
	"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
	"beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
	"cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
	"darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
	"darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
	"darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
	"firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
	"gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
	"honeydew": "#f0fff0", "hotpink": "#ff69b4",
	"indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
	"lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
	"lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
	"lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
	"magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
	"mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
	"navajowhite": "#ffdead", "navy": "#000080",
	"oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
	"palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
	"rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
	"saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
	"tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
	"violet": "#ee82ee",
	"wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
	"yellow": "#ffff00", "yellowgreen": "#9acd32"
};

let colors = [
	"red", "crimson", "firebrick", "coral",
	"orange", "orangered", "darkorange", "yellow", "gold",
	"green", "lime", "mediumspringgreen", "seagreen", "forestgreen",
	"blue", "blueviolet", "deepskyblue",
	"magenta", "fuchsia", "indigo", "orchid", "rebeccapurple"
]
let colorUsage = {}
for (let i in colors) {
	let color = colorValues[colors[i]]
	colors[i] = color
	colorUsage[color] = 0
}

function getValsFromElement(element) {
	for (let factCode in storyElemValues) {
		let vals = storyElemValues[factCode]
		let elems = vals.elems
		for (let i = 0; i < elems.length; i++) {
			let e = elems[i]
			if (e === element) {
				return vals
			}
		}
	}
}

function tagIsSpanFact(tag){
	if (tag.tagName !== "SPAN") return false
	let parents = [...$(tag).parents()]
	if (parents.some(t => $(t).attr("id") === "views")) {
		return true
	}
}

let currentlyClicked = false;
let currentlyHovered;
function moveMouseOverText(e) {
	let hoveredList = document.elementsFromPoint(e.clientX, e.clientY)
	let hovered
	for (let tag of hoveredList) {
		if (tagIsSpanFact(tag)) {
			hovered = tag
			break
		}
	}

	if (!hovered) {
		return
	}
	if (!videoPlaying && !currentlyClicked){
		hoverFade(hovered)
	}
}
function hoverFade(hovered) {
	if (currentlyHovered) {
		unHoverFade(currentlyHovered)
	}

	let vals = getValsFromElement(hovered)
	if (!vals) {
		console.warn("????", hovered)
		return
	}
	currentlyHovered = hovered
	let css = {
		"background-color": vals.color,
		"text-shadow": "0px 0px 2px black"
	}
	vals.elems.css(css)
	if (!videoPlaying) {
		updateExplanationText(vals.fact)

		//Remove the "new fact" class if necessary.
		let classes = [...hovered.classList]
		for (let factCode in story){
			let className = "f" + factCode
			if (classes.includes(className)){
				$("."+className).removeClass("new-fact")
			}
		}
	}

	$(hovered).addClass("active")
	.css("background-color", vals.activeColor)

	$("#explanation > .show-all").hide()
}

function moveMouseOutOfText(e){
	if (currentlyClicked){
		return
	}
	unHoverFade(e)
}
function unHoverFade(e) {
	if (!e.textContent) {
		e = $(e.delegateTarget)[0]
	}
	let vals = getValsFromElement(e)
	if (!vals) {
		console.warn("????", hovered)
	}
	let css = {
		"background-color": "transparent",
		"text-shadow": "inherit"
	}
	vals.elems.css(css)
	$("#explanation-text").html("")

	if (showAllButtonIsShown) {
		$("#explanation > .show-all").show()
	}

	if (currentlyHovered) {
		$(currentlyHovered).removeClass("active")
	}
}
function clickText(e){
	let hoveredList = document.elementsFromPoint(e.clientX, e.clientY)
	let hovered
	for (let tag of hoveredList) {
		if (tagIsSpanFact(tag)) {
			hovered = tag
			break
		}
	}
	if (!hovered) {
		currentlyClicked = false
		if (currentlyHovered) {
			unHoverFade(currentlyHovered)
		}
		return
	}
	if (hovered && hovered !== currentlyHovered){
		currentlyClicked = true
		hoverFade(hovered)
		return
	}
	currentlyClicked = true
}

function updateExplanationText(fact){
	$("#explanation-text").html(fact)

	let newHeight = $("#explanation-text").height()
	let containerHeight = $("#explanation").height()

	if (newHeight >= containerHeight){
		$("#explanation").addClass("no-flex")
	}
	else {
		$("#explanation").removeClass("no-flex")
	}
}

let showAllButtonIsShown = false
function toggleColumn(e) {
	let elem = $(e.delegateTarget)
	let col = elem.parents(".col")[0]
	let row = $(col).parents(".row")[0]
	let index = [...$(row).children(".col")].indexOf(col) + 1
	let query = `#views > .row > .col:nth-child(${index})`
	console.log(index, query)
	$(query).hide()
	$("#explanation > .show-all").show()
	showAllButtonIsShown = true
	resize()
}
function showAllColumns() {
	$("#views > .row > .col").show()
	showAllButtonIsShown = false
	$("#explanation > .show-all").hide()
}

function resize() {
	$(".col").each((i, col) => {
		let imgs = $(col).children(".img-fluid.mtg-card")
		let width = $(col).width()
		let radius = width * 0.05
		let css = {
			"border-radius": radius + "px"
		}
		$(imgs).css(css)
	})

	let eTag = $("#explanation-container")
	$("#explanation-video > video").css(
		"height", eTag.height() - eTag.css("font-size")
	)

	let viewsHeight = $("#explanation-container").height()
	let remainingHeight = $(window).height() - $("#views").offset().top
	$("#views").css("height", remainingHeight + "px")
}

function explanationResizeStart(e) {
	let mouseInfo = {}
	mouseInfo.enabled = true
	mouseInfo.x = e.clientX
	mouseInfo.y = e.clientY
	mouseInfo.startX = e.clientX
	mouseInfo.startY = e.clientY
	mouseInfo.startHeight = $("#explanation-container").height()
	mouseInfo.mouseMoveHandler = function (e) {
		if (!mouseInfo.enabled) {
			$(document).unbind("mouseup", mouseInfo.mouseUpHandler)
			$(document).unbind("mousemove", mouseInfo.mouseMoveHandler)
			return
		}
		mouseInfo.x = e.clientX
		mouseInfo.y = e.clientY
		let diffY = e.clientY - mouseInfo.startY
		let newHeight = mouseInfo.startHeight + diffY
		newHeight = Math.max(newHeight, 0)
		let vh = $(window).height() / 100
		let remainingHeight = Math.floor($(window).height() - $("#views").offset().top) - 1
		$("#explanation-container").css("height", newHeight + "px")
		$("#views").css("margin-top", (newHeight + 3 * vh) + "px")
		.css("height", remainingHeight + "px")
		$("#draggable").css("top", (newHeight - vh) + "px")
	}
	mouseInfo.mouseUpHandler = function () {
		mouseInfo.enabled = false
		$("body").css("user-select", "initial")
	}
	$(document).on("mousemove", mouseInfo.mouseMoveHandler)
	$(document).on("mouseup", mouseInfo.mouseUpHandler)
	$("body").css("user-select", "none")
}

function convertFromTimestamp(timestamp) {
	let segments = timestamp.split(":").map(v => parseFloat(v)).reverse()
	let result = 0
	result += segments[0] || 0
	result += (segments[1] * 60) || 0
	return result
}
function convertToTimestamp(time) {

}

function toggleVideo(e) {
	let target = e.delegateTarget
	let playing = $(target).attr("data-playing") === "true"
	clearInterval(videoVars.interval)

	if (!playing && videoPlaying){
		let isPlayingTags = $(".play-video-btn[data-playing='true']")
		isPlayingTags.attr("data-playing", false)
		isPlayingTags.children("i")
			.removeClass("bi-pause-fill").addClass("bi-play-fill")
	}

	if (!playing) {
		let index = $(target).attr("data-video")
		let data = videoData[index]
		currentVideoData = data
		currentVideoSection = index
		let firstTimestamp = (data[0] && data[0].timestamp) ?? "0:00"
		let playTime = convertFromTimestamp(firstTimestamp)
		let videoTag = $("#explanation-video > video")
		console.log(playTime)
		videoTag[0].currentTime = playTime
		videoTag[0].play()
		$(target).children("i").eq(0)
			.removeClass("bi-play-fill").addClass("bi-pause-fill")
		$(target).attr("data-playing", true)

		videoVars.interval = setInterval(updateVideoData, 5)

		videoPlaying = true
		$("#explanation-text").hide()
		$("#explanation").css("justify-content", "center")
	}
	else {
		let videoTag = $("#explanation-video > video")
		videoTag[0].pause()

		$(target).children("i").eq(0)
			.removeClass("bi-pause-fill").addClass("bi-play-fill")
		
		$(target).attr("data-playing", false)
		clearInterval(videoVars.interval)

		videoPlaying = false
		$("#explanation-text").show()
		$("#explanation").css("justify-content", "space-between")
	}
}

function updateVideoData() {
	let videoTag = $("#explanation-video > video")
	let curTime = videoTag[0].currentTime

	let foundSomething = false
	let index = 0
	for (let i = 0; i < currentVideoData.length; i++) {
		let data = currentVideoData[i]
		let compareTime = convertFromTimestamp(data.timestamp)
		if (compareTime >= curTime) {
			index = i
			foundSomething = true
			break
		}
	}

	if (index > 0) {
		//Our target is index - 1
		let data = currentVideoData[index - 1]
		let section = currentVideoSection
		let query = `.play-video-btn[data-video="${section}"]`
		let button = $(query).eq(0)
		let col = $(button).parents(".col").eq(0)
		let spans = col.children("span")
		let curSpan = spans.eq(index - 1)

		if (currentlyHovered !== curSpan[0]) {
			hoverFade(curSpan[0])
		}
	}
	else if (!foundSomething) {
		//Our target is outside this data
		let lastData = currentVideoData[currentVideoData.length - 1]
		if (lastData.next){
			currentVideoSection = lastData.next
			currentVideoData = videoData[currentVideoSection]
		}
	}
}

let factCodeList = []
let generalFacts = []
for (let factCode in story){
	let isGeneral = !storyInfo[storyCode][factCode] && storyInfo["general"][factCode]
	if (isGeneral){
		generalFacts.push(factCode)
	}
	else {
		factCodeList.push(factCode)
	}
}
factCodeList = factCodeList.concat(generalFacts)

for (let factCode of factCodeList) {
	let fact = story[factCode] ?? ""
	let factText = fact
	if (factText[0] === "!") factText = factText.substring(1)
	let isGeneral = !storyInfo[storyCode][factCode] && storyInfo["general"][factCode]
	let factTag = `<div class="fact">${factText}</div>`
	let className = `.f${factCode}`
	let thoseSpans = $(className)
	if (!thoseSpans.length) continue
	let minColorUsage = Math.min(...Object.values(colorUsage))
	let validColors = colors.filter(c => colorUsage[c] === minColorUsage)
	let color = validColors[Math.floor(myrng.quick() * validColors.length)]
	
	if (fact !== ""){
		colorUsage[color]++
		if (fact[0] !== "!"){
			thoseSpans.addClass("new-fact")
		}
	}
	else {
		color = "white"
	}

	storyColors[factCode] = color
	let css = {
		"text-decoration-color": color,
		"text-decoration-style": color !== "white" ? "solid" : "wavy",
		"border-top": "none"
	}

	if (isGeneral){
		css["text-decoration-color"] = "transparent"
	}

	let boundObj = {
		elems: thoseSpans,
		color: color+"55",
		activeColor: color+"ff",
		fact: factTag
	}
	storyElemValues[factCode] = boundObj
	thoseSpans.css(css)
		.on("mousemove", moveMouseOverText)
		.on("mouseleave", moveMouseOutOfText)

	let children = thoseSpans.children("span")
	for (let child of children) {
		$(child).css("border-bottom", "1px solid " + color)
	}
}

for (let span of allSpans){
	let underlineColor = $(span).css("text-decoration-color")
	let borderColor = $(span).css("border-bottom-color")
	if (underlineColor === "rgba(0, 0, 0, 0)"){
		$(span).css("border-bottom-color", "transparent")
	}
}

let videoPlaying = false
let videoVars = {}
let videoData = {}
let currentVideoData = {}
let currentVideoSection = -1
if (typeof videoCode !== "undefined" && videoInfo[videoCode]) {
	videoData = videoInfo[videoCode]
	let explanationTag = $("#explanation-video")
	explanationTag.show()
	let videoTag = $("#explanation-video > video")
	videoTag.attr("src", videoData["src"])
	$(".play-video-btn").on("click", toggleVideo)
	$("#explanation").css("justify-content", "space-between")
}

$(".toggle-btn").click(toggleColumn)
$(".show-all").click(showAllColumns)
$(window).on("resize", resize)
resize()
$("#draggable").on("mousedown", explanationResizeStart)
$(document).on("click", clickText)