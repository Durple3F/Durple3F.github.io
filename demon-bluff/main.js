import {delay, randomChoice} from "./util.js"
import {cardBackgroundSpriteUrls, allRoles, createLevel, Selection} from "./stuff.js"

let frameRate = 1000 / 60
let currentLevel
let killing_ready = false
let currentSelection = new Selection()
let activeAbilities = currentSelection.activeAbilities
console.log(activeAbilities)

function clickCard(card){
	if (currentSelection.type === "basic"){
		if (killing_ready){
			executeCard(card)
		}
		else if (!card.is_face_up && card.is_alive){
			revealCard(card)
		}
		else if (
			card.is_face_up &&
			card.shown_role.activatedAbility &&
			card.shown_role.activatedAbilityCharges > 0
		){
			let ability = new card.shown_role.activatedAbility(card, card.shown_role)
			ability.begin(currentSelection)
			activeAbilities.push(ability)
		} else {
			console.log(card)
		}
	} else {
		currentSelection.addCard(card)
	}

	updateEverything()
}

function killCard(card){
	card.kill(card, currentLevel)
}
function executeCard(card){
	killCard(card)
	let health_change = card.true_role.execution_health_change
	currentLevel.hp += health_change
}
function revealCard(card){
	let model = card.model
	model.css("transition", "250ms transform linear").css("transform", "rotate3d(0, 1, 0, 90deg)")
	delay(250).then(() => {
		model.css("transition", "0s transform linear").css("transform", "rotate3d(0, 1, 0, 270deg)")
		model.css("transition", "250ms transform linear").css("transform", "rotate3d(0, 1, 0, 0deg)")
		card.is_face_up = true
		updateCardDisplay(card)
		card.onShow(card, currentLevel)
		card.showTooltip()
		return delay(250)
	}).then(() => {
		model.css("transition", "").css("transform", "")
	})
}

function createCardDisplay(){
	let cardModel = $("<div class='card-model'>")
	let cardExtras = $("<div class='card-extras'>")
	cardModel.append(cardExtras)
	let cardContainer = $("<div class='card-container'>")
	cardExtras.append(cardContainer)
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

	let shadow = $("<div class='drop-shadow'>")
	cardModel.append(shadow)

	let activatedAbilityIconBox = $("<div class='activated-ability-container'>")
	cardExtras.append(activatedAbilityIconBox)
	let activatedAbilityIcon = $("<img>").attr("src", "src/img/icons/Joystick_Action_Icon_Jump.png")
	activatedAbilityIconBox.append(activatedAbilityIcon)

	return cardModel
}
function updateCardDisplay(card){
	let anchorPoint = card.anchorPoint
	let cardContainer = card.container
	let img = cardContainer.data("img")
	let img2 = cardContainer.data("img2")
	anchorPoint.attr("faceup", card.is_face_up)
	anchorPoint.attr("data-type", card.shown_role.type)
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

	if (
		card.is_face_up &&
		card.shown_role.activatedAbility &&
		card.shown_role.activatedAbilityCharges > 0
	){
		card.anchorPoint.attr("data-showactive", true)
	} else {
		card.anchorPoint.attr("data-showactive", false)
	}

	div.on("click", () => {
		clickCard(card)
	})

	div.off("mouseenter").on("mouseenter", () => {
		card.showHints()
	})
	div.off("mouseleave").on("mouseleave", () => {
		card.hideHints()
	})
}

function updateAbilities(){
	for (let i = 0; i < activeAbilities.length; i++){
		let ability = activeAbilities[i]
		if (ability.is_finished){
			activeAbilities.splice(i, 1)
			i--
		}
	}
}
function updateCenterInfoBox(){
	if (!activeAbilities.length) {
		$("#game .ui-instruction").fadeOut(100)
	} else {
		let ability = activeAbilities[activeAbilities.length - 1]
		let infoBox = ability.infoBox
		$("#game .ui-instruction").fadeIn(100).html(infoBox)
	}
}
function updateEverything(){
	for (let card of currentLevel.cards){
		updateCardDisplay(card)
	}
	updateAbilities()
	updateCenterInfoBox()

	let healthSection = $("#game .health-container")
	let healthP = currentLevel.hp / currentLevel.max_hp
	healthSection.find(".bar").css("height", healthP * 100 + "%")
	healthSection.find(".current").text(currentLevel.hp)
	healthSection.attr("data-empty", currentLevel.hp <= 0)
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
		card.model = div
		card.container = div.find(".card-container")
		container.append(div)
		card.container.data("card", card)
		updateCardDisplay(card)

		//position the box
		let radius = 0.35
		let r = Math.min(W, H) * radius
		let p = (((i+1) / cards.length * 2 - 0.5) * Math.PI + 2 * Math.PI) % (2 * Math.PI)
		container.data("angle", p)
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
		container.css("font-size", `calc(min(${dBetween}px / 10, 2vh, 1.8vw))`)
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
		let angle = container.data("angle")
		if (Math.abs(1.5*Math.PI - angle) < 0.125*Math.PI){
			direction = "bottom"
		}
		if (Math.abs(0.5*Math.PI - angle) < 0.125*Math.PI){
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

	level.interval = setInterval(levelTick, frameRate)
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

$(window).on("contextmenu", e => {
	let parents = [...$(e.target).parents()]
	if (activeAbilities.length && !parents.some(tag => $(tag).hasClass("character-anchor-point"))){
		e.preventDefault()
		let ability = activeAbilities[0]
		ability.cancel()
		updateEverything()
	}
})

startRound()