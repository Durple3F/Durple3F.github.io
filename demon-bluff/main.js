import {delay, randomChoice} from "./util.js"
import {cardBackgroundSpriteUrls, allRoles, createLevel} from "./stuff.js"

let currentLevel
let killing_ready = false

function killCard(card){
	card.container.addClass("dead")
	card.is_alive = false
	card.undisguise()
	updateCardDisplay(card)
}
function revealCard(card){
	let cardContainer = card.container
	let div = cardContainer.find(".card")
	div.css("transition", "250ms transform linear")
	div.css("transform", "rotate3d(0, 1, 0, 90deg)")
	delay(250).then(() => {
		div.css("transition", "0s transform linear")
		div.css("transform", "rotate3d(0, 1, 0, 270deg)")
		div.css("transition", "250ms transform linear")
		div.css("transform", "rotate3d(0, 1, 0, 0deg)")
		card.is_face_up = true
		updateCardDisplay(card)
		card.onShow(card, currentLevel)
		card.showTooltip()
		return delay(250)
	}).then(() => {
		div.css("transition", "")
		div.css("transform", "")
	})
}

function createCardDisplay(){
	let cardContainer = $("<div class='card-container'>")
	let div = $("<div class='card'>")
	cardContainer.append(div)
	let img = $("<img class='card-img-top'>")
	div.append(img)
	let img2 = $("<img class='card-img-top true-role'>")
	div.append(img2)
	let body = $("<div class='card-body'>")
	div.append(body)
	let title = $("<h5 class='card-title'>")
	body.append(title)
	title.append("<span class='card-corrupted'>&lt;Corrupted&gt;</span>")
	title.append("<span class='card-name'>")
	cardContainer.data("img", img)
	cardContainer.data("img2", img2)

	let cardId = $("<div class='card-id'>")
	cardContainer.append(cardId)

	let skullIcon = $("<img>").attr("src", "src/Pictoicon_Skull.png").addClass("skull")
	cardContainer.append(skullIcon)

	return cardContainer
}
function updateCardDisplay(card){
	let cardContainer = card.container
	let img = cardContainer.data("img")
	let img2 = cardContainer.data("img2")
	cardContainer.attr("faceup", card.is_face_up)
	cardContainer.attr("data-type", card.shown_role.type)
	cardContainer.find(".card-id").text(`#${card.id}`)

	let imgBg = img.data("bg")
	if (!imgBg){
		let url = randomChoice(cardBackgroundSpriteUrls[card.shown_role.bg_category])
		imgBg = `url(${url})`
	}
	img.data("bg", imgBg)
	img.css("background-image", imgBg)

	let img2Bg = img2.data("bg2")
	if (!img2Bg){
		let url = randomChoice(cardBackgroundSpriteUrls[card.true_role.bg_category])
		img2Bg = `url(${url})`
	}
	img2.data("bg2", img2Bg)
	img2.css("background-image", img2Bg)

	let div = cardContainer.find(".card")
	div.off("click")

	if (card.is_face_up){
		div.children().show()
		img.attr("src", card.shown_role.sprite_url)
		img2.attr("src", card.true_role.sprite_url)
		div.find(".card-name").text(card.shown_role.name)
	} else {
		div.children().hide()
	}

	if (card.is_corrupted){
		div.find(".card-corrupted").show()
	} else {
		div.find(".card-corrupted").hide()
	}

	div.on("click", () => {
		if (killing_ready){
			killCard(card)
		}
		else if (!card.is_face_up && card.is_alive){
			revealCard(card)
		}
	})

	div.off("mouseenter").on("mouseenter", () => {
		card.showHints()
	})
	div.off("mouseleave").on("mouseleave", () => {
		card.hideHints()
	})
}

function levelTick(){
	currentLevel.cards.forEach(card => {
		card.hints.forEach(hint => {
			hint.tick()
		})
	})
}

function startRound(){
	let W = $(window).width()
	let H = $(window).height()
	const level = createLevel()
	currentLevel = level
	console.log(level)

	let charactersContainer = $("#characters")
	let cards = level.cards
	let charContainers = []
	for (let i = 0; i < cards.length; i++){
		let card = cards[i]
		let container = $("<div class='character-anchor-point'>")
		card.anchorPoint = container
		charContainers.push(container)
		charactersContainer.append(container)
		let div = createCardDisplay()
		card.container = div
		container.append(div)
		div.data("card", card)
		updateCardDisplay(card)

		//position the box
		let radius = 0.3
		let r = Math.min(W, H) * radius
		let p = (i / cards.length * 2 - 0.5) * Math.PI
		// let x = Math.cos(p) * r + (W * 0.5)
		// let xp = x / W * 100 + "%"
		container.data("x", Math.cos(p))
		// let y = Math.sin(p) * r + (H * 0.5)
		// let yp = y / H * 100 + "%"
		container.data("y", Math.sin(p))
		let totalCirc = 2 * Math.PI * r
		let dBetween = totalCirc / cards.length
		container.css("left", `calc(min(100vw, 100vh) * ${radius} * ${Math.cos(p)} + 50vw)`)
		container.css("top", `calc(min(100vw, 100vh) * ${radius} * ${Math.sin(p)} + 50vh)`)
		container.css("font-size", `calc(min(${dBetween}px / 10, 2.5vh, 2.5vw))`)
	}
	charContainers.toSorted((a, b) => {
		let ay = a.position().top
		let by = b.position().top
		return ay - by
	}).forEach((charContainer, i) => {
		charContainer.css("z-index", i)
	})
	for (let i = 0; i < charContainers.length; i++){
		let container = charContainers[i]
		let direction = i < charContainers.length * 0.5 ? "right" : "left"
		if (i === 0){
			direction = "bottom"
		}
		if (Math.abs(i - charContainers.length * 0.5) <= 0.5){
			direction = "top"
		}
		let majorOffset = container.data("y") * container.height() * 0.3
		let minorOffset = 10
		if (direction === "bottom" || direction === "top"){
			majorOffset = 0
		}
		if (direction === "top"){
			minorOffset = 20
		}
		let cardContainer = container.find(".card-container")
		let card = cardContainer.data("card")
		card.anchorPoint.popover({
			content: () => {
				return card.outputHtml
			},
			html: true,
			placement: direction,
			offset: [majorOffset, minorOffset],
			container: charactersContainer,
			trigger: "manual"
		})
	}

	let evilCount = level.cards.filter(card => {
		return card.true_role.alignment === "Evil"
	}).length
	let minionCount = level.cards.filter(card => {
		return card.true_role.type === "Minion"
	}).length
	let demonCount = level.cards.filter(card => {
		return card.true_role.type === "Demon"
	}).length
	let content = $(`<p>Find and Execute ${evilCount} Evil Characters</p>`)
	
	let secondaryObjective = $("<p>").addClass("secondary").html(
		`(<span class='color-minion'>${minionCount} Minion${minionCount === 1 ? "" : "s"}</span>` +
		" and " +
		`<span class='color-demon'>${demonCount} Demon${demonCount === 1 ? "" : "s"}</span>` +
		")"
	)
	content = content.add(secondaryObjective)
	$(".ui-info .objective").empty().append(content)

	level.interval = setInterval(levelTick, 1000 / 60)
}

$(".dagger-button").on("click", () => {
	killing_ready = !killing_ready
	if (killing_ready){
		$("#game").addClass("killing-active")
	} else {
		$("#game").removeClass("killing-active")
	}
})

$(window).on("resize", () => {
	$("#characters .card-container").popover("update")
	currentLevel.cards.forEach(card => {
		card.hints.forEach(hint => {
			hint.positionElements()
		})
	})
})

startRound()