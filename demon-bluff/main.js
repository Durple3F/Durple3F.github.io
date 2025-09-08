import {delay, randomChoice} from "./util.js"
import {cardBackgroundSpriteUrls, allRoles, createLevel, Selection, GameEventList} from "./stuff.js"

const cardMarkSprites = {
	"green": "src/img/flags/Title_Flag_01_NoShadow_Green.png",
	"orange": "src/img/flags/Title_Flag_01_NoShadow_Orange.png",
	"red": "src/img/flags/Title_Flag_01_NoShadow_Red.png",
	"blue": "src/img/flags/Title_Flag_01_NoShadow_Blue.png",
}

let frameRate = 1000 / 60
let currentLevel
let killing_ready = false
let currentlyHoveredCard = null
let currentSelection = new Selection()
let activeAbilities = currentSelection.activeAbilities
console.log(activeAbilities)

function clickCard(card){
	if (currentSelection.type === "basic"){
		if (killing_ready && card.is_alive){
			executeCard(card)
		}
		else if (!card.is_face_up && card.is_alive){
			tryToRevealCard(card)
		}
		else if (
			card.is_face_up &&
			card.shown_role.activatedAbility &&
			card.shown_role.activatedAbilityCharges > 0
		){
			let ability = new card.shown_role.activatedAbility(card, card.shown_role, currentLevel)
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
function handleKeydown(e){
	if (currentlyHoveredCard){
		let key = e.key
		let card = currentlyHoveredCard

		if (key === "1"){
			card.toggleMark("green")
			card.removeMark("orange")
			card.removeMark("red")
		}
		if (key === "2"){
			card.toggleMark("orange")
			card.removeMark("green")
			card.removeMark("red")
		}
		if (key === "3"){
			card.toggleMark("red")
			card.removeMark("green")
			card.removeMark("orange")
		}
		if (key === "4"){
			let marks = card.marks
			console.log(marks)
			for (let markType of marks){
				card.removeMark(markType)
			}
		}
		if (key === "5"){
			card.toggleMark("blue")
		}
		updateEverything()
	}
}

function triggerCards(cards, callback){
	let triggers = getTriggerPriorities(cards)
	let highestPriority = triggers[0].priority

	while (highestPriority > 0){
		let toPerform = triggers.filter(trigger => trigger.priority === highestPriority)
		
		toPerform.forEach(trigger => {
			callback(trigger, cards)
		})

		triggers = getTriggerPriorities(cards)
		highestPriority = triggers.find(trigger => trigger.priority < highestPriority)?.priority || 0
	}
}
function getTriggerPriorities(cards){
	let result = []
	
	cards.toSorted((a, b) => b.id - a.id)
	.forEach(card => {
		let role = card.true_role
		let trigger = {
			role: role,
			priority: role.trigger_priority,
			card: card
		}
		result.push(trigger)

		if (card.is_disguised){
			let role = card.shown_role
			let trigger = {
				role: role,
				priority: role.trigger_priority,
				card: card
			}
			result.push(trigger)
		}
	})

	result.sort((a, b) => b.priority - a.priority)

	return result
}
function performGameStart(){
	let gameEvents = new GameEventList()

	let cards = currentLevel.cards
	triggerCards(cards, trigger => {
		let card = trigger.card
		let role = trigger.role
		role.onGameStart(card, currentLevel, gameEvents)
	})
	
	carryOutEvents(gameEvents)
}
function tryToRevealCard(card){
	let revealEvent = new GameEventList()
	revealEvent.events.push({type: "reveal", card: card})

	let cards = currentLevel.cards
	triggerCards(cards, trigger => {
		let triggeringCard = trigger.card
		let role = trigger.role
		role.onAttemptReveal(triggeringCard, currentLevel, card, revealEvent)
	})

	carryOutEvents(revealEvent)
}

function carryOutEvents(gameEventList){
	for (let event of gameEventList.events){
		carryOutEvent(event)
	}
}
function carryOutEvent(event){
	if (event.type === "reveal"){
		let card = event.card
		revealCard(card)
	} else {
		console.warn(event)
	}
}

function executeCard(card){
	card.execute(card, currentLevel)
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

function createCardHtml(){
	let div = $("<div class='card'>")
	let img = $("<img class='card-img-top' data-img='1'>")
	div.append(img)
	let img2 = $("<img class='card-img-top true-role' data-img='2'>")
	div.append(img2)
	let body = $("<div class='card-body'>")
	div.append(body)
	let title = $("<h5 class='card-title'>")
	body.append(title)
	title.append("<span class='card-name'>")
	title.append("<span class='card-corrupted'>&lt;Corrupted&gt;</span>")
	return div
}
function createCardDisplay(){
	let cardModel = $("<div class='card-model'>")
	let cardExtras = $("<div class='card-extras'>")
	cardModel.append(cardExtras)
	let cardContainer = $("<div class='card-container'>")
	cardExtras.append(cardContainer)
	let div = createCardHtml().addClass("base")
	cardContainer.append(div)
	cardContainer.data("img", div.find(".card-img-top[data-img='1']"))
	cardContainer.data("img2", div.find(".card-img-top[data-img='2']"))
	cardContainer.data("base", div.find(".card.base"))
	cardContainer.data("ghost", div.find(".card.ghost"))

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

	let disguiseIconBox = $("<div class='disguise-icon-container'>")
	cardExtras.append(disguiseIconBox)
	let disguiseIcon = $("<img>").attr("src", "src/img/icons/disguise.png")
	disguiseIconBox.append(disguiseIcon)

	let cardMarksBox = $("<div class='card-marks-container'>")
	cardExtras.append(cardMarksBox)
	let markTypes = ["green", "orange", "red", "blue"]
	markTypes.forEach(type => {
		let mark = $("<div class='card-mark'>")
		mark.attr("data-mark-type", type)
		let div = $("<div>").addClass("mark-flag")
		mark.append(div)
		div.css("background-image", `url("${cardMarkSprites[type]}")`)
		let icon = $("<div>").addClass("mark-icon")
		mark.append(icon)
		cardMarksBox.append(mark)
	})

	let ghostCard = createCardHtml().addClass("ghost")
	cardContainer.append(ghostCard)

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

	let div = cardContainer.find(".card.base")
	div.off("click")

	if (card.is_face_up){
		div.children().show()
		img.attr("src", card.shown_role.sprite_url)
		img2.attr("src", card.true_role.sprite_url)
		div.find(".card-name").text(card.shown_role.name)
	} else {
		div.children().hide()
	}

	if (card.is_corrupted && !card.is_alive){
		card.anchorPoint.attr("data-showcorrupted", true)
	} else {
		card.anchorPoint.attr("data-showcorrupted", false)
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

	if (card.original_disguise && card.original_disguise !== card.shown_role && card.is_face_up){
		card.anchorPoint.attr("data-showdisguise", true)
	} else {
		card.anchorPoint.attr("data-showdisguise", false)
	}

	if (card.original_disguise){
		let ghost = card.container.find(".card.ghost")
		let img = ghost.find("img[data-img='1']")
		img.attr("src", card.original_disguise.sprite_url)
		img.css("background-image", imgBg)
		ghost.find(".card-name").text(card.original_disguise.name)
	}

	//Card marks
	let marksContainer = card.anchorPoint.find(".card-marks-container")
	marksContainer.find(".card-mark").hide()
	for (let markType of card.marks){
		marksContainer.find(`.card-mark[data-mark-type='${markType}']`).show()
	}

	div.on("click", () => {
		clickCard(card)
	})

	div.off("mouseenter").on("mouseenter", () => {
		currentlyHoveredCard = card
		card.showHints()
	})
	div.off("mouseleave").on("mouseleave", () => {
		currentlyHoveredCard = null
		card.hideHints()
	})

	let disguiseIconBox = card.anchorPoint.find(".disguise-icon-container")
	disguiseIconBox.off("mouseenter").on("mouseenter", () => {
		card.anchorPoint.attr("data-showghost", true)
	})
	disguiseIconBox.off("mouseleave").on("mouseleave", () => {
		card.anchorPoint.attr("data-showghost", false)
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
	performGameStart()

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

$(document).on("keydown", handleKeydown)

startRound()