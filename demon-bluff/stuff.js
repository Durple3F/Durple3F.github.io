import {randomChoice, shuffleArray, lerp} from "./util.js"

export class Selection {
	constructor(type="basic"){
		this.type = type
		this.cards = []
		this.activeAbilities = []
	}
	addCard(card){
		this.cards.push(card)
		card.anchorPoint?.addClass("selected")
		let activeAbilities = this.activeAbilities
		let curAbility = activeAbilities[activeAbilities.length - 1]
		if (curAbility){
			curAbility.checkCompletion()
		}
	}
	changeType(type){
		this.type = type
	}
	reset(){
		this.cards.forEach(card => {
			card.anchorPoint?.removeClass("selected")
		})
		this.cards.splice(0, this.cards.length)
		this.changeType("basic")
	}
}

class ActivatedAbility {
	constructor(ownerCard, ownerRole){
		this.owner = ownerCard
		this.role = ownerRole
		this.selection = null
		this.is_finished = false
	}
	checkCompletion(){
		console.log(this.selection.cards)
	}
	begin(selection){
		this.selection = selection
		selection.reset()
		selection.changeType("cards")
	}
	end(){
		this.selection.reset()
		this.is_finished = true
		this.role.activatedAbilityCharges--
	}
	cancel(){
		this.selection.reset()
		this.is_finished = true
	}
	performAction(){
		this.action()
		this.end()
		this.owner.showTooltip()
	}
	action(){}
	get infoBox(){
		return ""
	}
}

class Hint {
	constructor(){
		this.elements = $()
	}
	createElements(){}
	positionElements(){}
	tick(){
		this.elements.each((i, e) => {
			let element = $(e)
			let cur = Number(element.css("opacity"))
			let target = Number(element.data("target-opacity"))
			if (cur !== target) {
				let next = lerp(cur, target, 0.2)
				if (Math.abs(next - target) < 0.001){
					next = target
				}
				element.css("opacity", next)
			}
		})
	}
	show(){
		this.elements.each((i, e) => {
			let element = $(e)
			element.data("target-opacity", 1)
		})
	}
	hide(){
		this.elements.each((i, e) => {
			let element = $(e)
			element.data("target-opacity", 0)
		})
	}
}
const allHints = {}
allHints["Cards"] = class extends Hint {
	constructor(cardList){
		super()
		this.cards = cardList
		this.createElements()
	}
	createElements(){
		for (let card of this.cards){
			let element = $("<img>")
			element.addClass("hint").addClass("arrow")
			element.attr("src", "src/img/icons/arrow_with_outline.png")
			element.data("card", card)
			this.elements = this.elements.add(element)
		}
		this.elements.appendTo("#game .ui-hints")
		this.positionElements()
	}
	positionElements(){
		this.elements.each((i, e) => {
			let element = $(e)
			let card = element.data("card")
			let anchorPoint = card.anchorPoint
			let position = anchorPoint.position()
			let width = anchorPoint.width()
			let height = anchorPoint.height()
			let top = position.top - (height * 0.25)
			let left = position.left + (width * 0.02)
			element.css("top", top).css("left", left)
			.css("width", width * 0.4).css("rotate", "180deg")
		})
	}
}
allHints["Card"] = class extends allHints["Cards"]{
	constructor(card){
		super([card])
	}
}
allHints["Direction"] = class extends Hint {
	constructor(card, direction){
		super()
		this.card = card
		this.direction = direction
		this.createElements()
	}
	createElements(){
		let element = $("<div>")
		element.addClass("hint").addClass("arrow-curve")
		let img = $("<img>")
		img.attr("src", "src/img/icons/arrow_curve.png")
		element.append(img)
		this.elements = this.elements.add(element)

		let element2 = $("<div>")
		element2.addClass("hint").addClass("arrow-curve")
		let img2 = $("<img>")
		img2.attr("src", "src/img/icons/arrow_curve.png")
		element2.append(img2)
		this.elements = this.elements.add(element2)

		this.elements.appendTo("#game .ui-hints").attr("data-direction", this.direction)
		this.positionElements()
	}
	positionElements(){
		let card = this.card
		let anchorPoint = card.anchorPoint
		let W = $(window).width()
		let H = $(window).height()
		let angle = anchorPoint.data("angle")
		let card_height = anchorPoint.height()

		if (this.direction === "clockwise"){
			angle += Math.PI * 0.13
		} else {
			angle -= Math.PI * 0.09
		}

		let arrow_angle = angle / (2 * Math.PI)

		if (this.direction === "clockwise"){
			arrow_angle += 0.37
		} else {
			arrow_angle += 0.14
		}

		let arrow1 = $(this.elements[0])
		let radius1 = Math.min(W, H) * 0.35 - card_height
		let top1 = H * 0.5 + radius1 * Math.sin(angle)
		let left1 = W * 0.5 + radius1 * Math.cos(angle)
		let transform1 = `translate(-50%, -50%)`
		transform1 += ` rotate(${arrow_angle}turn) scale(1.5)`
		arrow1.css("top", top1).css("left", left1)
		.css("transform", transform1)

		let arrow2 = $(this.elements[1])
		let radius2 = Math.min(W, H) * 0.35 + card_height * 0.8
		let top2 = H * 0.5 + radius2 * Math.sin(angle)
		let left2 = W * 0.5 + radius2 * Math.cos(angle)
		let transform2 = `translate(-50%, -50%)`
		transform2 += ` rotate(${arrow_angle}turn) scale(1.5)`
		arrow2.css("top", top2).css("left", left2)
		.css("transform", transform2)

		this.elements.css("font-size", card_height * 0.1)
	}
}

class Message {
	constructor(text, type){
		this.text = text
		this.type = type
		this.timestamp = Date.now()
	}
	get html(){
		return `<div class='message'>${this.text}</div>`
	}
}

class Character {
	name = "Citizen"
	type = "Villager"
	alignment = "Good"
	disguises = false
	lies = false
	can_lie = true
	can_be_disguised_as = true
	sprite_url = ""
	activatedAbilityCharges = 0
	activatedAbility = null
	constructor(options={}){
		this.outputs = []
	}
	get registers_differently(){
		return false
	}
	get id(){
		return this.name.replaceAll(" ", "")
	}
	get bg_category(){
		if (this.type === "Villager" || this.type === "Outcast"){
			return "Good"
		}
		if (this.type === "Minion" || this.type === "Demon"){
			return "Evil"
		}
	}
	speak(text, type="none"){
		text = text ?? "Test Message"
		this.outputs.push(new Message(text, type))
	}
	register(otherCard, lying){
		if (otherCard.true_role.registers_differently){
			return otherCard.true_role.beRegistered(this, lying)
		} else {
			return roleQualities[otherCard.true_role.id]
		}
	}
	beRegistered(byCard, lying){
		return this
	}
	trigger(card, level){}
	onShow(card, level){}
	get execution_health_change(){
		if (this.alignment !== "Evil") return -5
		return 0
	}
	kill(card, level){}
	onKill(card, level){}
}

export const allRoles = {}
export const roleQualities = {}
allRoles["Confessor"] = class Confessor extends Character {
	name = "Confessor"
	type = "Villager"
	alignment = "Good"
	lies = false
	can_lie = false
	sprite_url = "src/img/roles/Confessor.png"
	trigger(card, level){
		let lies = card.lies
		let is_evil = card.true_role.type === "Evil"
		if (is_evil || lies){
			this.speak("I am dizzy")
		} else {
			this.speak("I am Good")
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Lover"] = class Lover extends Character {
	name = "Lover"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Lover.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let index = cards.indexOf(card)
		let nextIndex = (index + 1) % cards.length
		let prevIndex = (index - 1 + cards.length) % cards.length
		let adjacentCards = [cards[nextIndex], cards[prevIndex]]
		let theirRoles = adjacentCards.map(card => this.register(card, lies))
		let adjacentEvils = theirRoles.filter(role => role.alignment === "Evil")
		let count = adjacentEvils.length
		let shownCount = count
		if (!lies){
			//I am not lying
		} else {
			//I am lying
			let options = [0,1,2].filter(v => v !== count)
			shownCount = randomChoice(options)
		}
		if (shownCount > 0){
			let s = shownCount === 1 ? "" : "s"
			this.speak(`${shownCount} Evil${s} adjacent to me`)
		} else {
			this.speak(`NO Evils adjacent to me`)
		}
		let hint = new allHints["Cards"](adjacentCards)
		card.hints.push(hint)
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Gemcrafter"] = class Gemcrafter extends Character {
	name = "Gemcrafter"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Gemcrafter.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let goods
		let alignments = cards.map(card => {
			let registered_alignment = this.register(card, lies).alignment
			return registered_alignment
		})
		if (!lies){
			//I am not lying
			goods = cards.filter((_, i) => alignments[i] === "Good")
		} else {
			goods = cards.filter((_, i) => alignments[i] !== "Good")
		}
		let otherGoods = goods.filter(goodCard => goodCard !== card)
		if (!otherGoods.length){
			otherGoods = goods
		}
		let randomCard = randomChoice(otherGoods)

		if (randomCard){
			let id = randomCard.id
			this.speak(`#${id} is Good`)

			//Create a hint pointing to that card
			let hint = new allHints["Card"](randomCard)
			card.hints.push(hint)
		} else {
			this.speak(`Uh... I'm not sure what to say.`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Hunter"] = class Hunter extends Character {
	name = "Hunter"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Hunter.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let otherEvils = cards.filter(otherCard => otherCard !== card)
		.filter(otherCard => {
			let role = this.register(otherCard, lies)
			return role.alignment === "Evil"
		})
		
		let index = cards.indexOf(card)
		let minDistance = Infinity
		for (let otherCard of otherEvils){
			let otherIndex = cards.indexOf(otherCard)
			let clockwiseDist = otherIndex - index
			if (clockwiseDist < 0) clockwiseDist += cards.length
			let counterClockwiseDist = cards.length - clockwiseDist
			let distance = Math.min(clockwiseDist, counterClockwiseDist)
			if (distance < minDistance){
				minDistance = distance
			}
		}

		let shownDistance = minDistance
		let canShow = true
		if (lies){
			//Pick a random possible incorrect answer
			let possibilities = []
			let max = Math.ceil((cards.length - 1) * 0.5)
			for (let i = 1; i <= max; i++){
				if (i === minDistance) continue
				possibilities.push(i)
			}
			if (possibilities.length){
				shownDistance = randomChoice(possibilities)
			} else {
				canShow = false
			}
		}
		if (canShow){
			let s = shownDistance === 1 ? "" : "s"
			this.speak(`I am ${shownDistance} card${s} away from closest Evil`)

			//Create a hint pointing to those cards
			let hintCards = []
			let clockwiseCard = cards[(index + shownDistance) % cards.length]
			hintCards.push(clockwiseCard)
			let counterClockwiseCard = cards[(index - shownDistance + cards.length) % cards.length]
			hintCards.push(counterClockwiseCard)
			let hint = new allHints["Cards"](hintCards)
			card.hints.push(hint)
		} else {
			this.speak(`I don't see any Evils`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Enlightened"] = class Enlightened extends Character {
	name = "Enlightened"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Enlightened.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let otherEvils = cards.filter(otherCard => otherCard !== card)
		.filter(otherCard => {
			let role = this.register(otherCard, lies)
			return role.alignment === "Evil"
		})
		
		let index = cards.indexOf(card)
		let minCDist = Infinity
		let minCCDist = Infinity
		for (let otherCard of otherEvils){
			let otherIndex = cards.indexOf(otherCard)
			let clockwiseDist = otherIndex - index
			if (clockwiseDist < 0) clockwiseDist += cards.length
			let counterClockwiseDist = cards.length - clockwiseDist
			if (clockwiseDist < minCDist){
				minCDist = clockwiseDist
			}
			if (counterClockwiseDist < minCCDist){
				minCCDist = counterClockwiseDist
			}
		}

		let possibleAnswers = {
			"clockwise": "Closest Evil is: Clockwise",
			"counterclockwise": "Closest Evil is: Counter-clockwise",
			"equidistant": "Closest Evil is: Equidistant",
		}
		let correctAnswer
		if (minCDist < minCCDist) correctAnswer = "clockwise"
		else if (minCDist > minCCDist) correctAnswer = "counterclockwise"
		else correctAnswer = "equidistant"
		let shownAnswer = correctAnswer
		if (lies){
			shownAnswer = randomChoice(Object.keys(possibleAnswers).filter(key => key !== shownAnswer))
		}
		this.speak(possibleAnswers[shownAnswer])
		
		if (shownAnswer !== "equidistant"){
			let hint = new allHints["Direction"](card, shownAnswer)
			card.hints.push(hint)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Medium"] = class Medium extends Character {
	name = "Medium"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Medium.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let disguised_cards = cards.filter(card => card.is_disguised)
		let undisguised_cards = cards.filter(card => !card.is_disguised && card.true_role.alignment === "Good")

		let shownCard
		if (!lies){
			shownCard = randomChoice(undisguised_cards)
		} else {
			shownCard = randomChoice(disguised_cards)
		}

		if (shownCard){
			let id = shownCard.id
			this.speak(`#${id} is a real ${shownCard.shown_role.name}`)

			//Create a hint pointing to that card
			let hint = new allHints["Card"](shownCard)
			card.hints.push(hint)
		} else {
			this.speak(`Uh... I'm not sure what to say.`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Judge"] = class Judge extends Character {
	name = "Judge"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Judge.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
		this.activatedAbility = class extends ActivatedAbility {
			get infoBox(){
				return "Pick a Character"
			}
			checkCompletion(){
				if (this.selection.cards.length){
					this.performAction()
				}
			}
			action(){
				let lies = this.owner.lies
				let card = this.selection.cards[0]
				let targetIsLying = card.lies && card.shown_role.can_lie
				if (lies === targetIsLying){
					this.role.speak(`#${card.id} is saying Truth`)
				} else {
					this.role.speak(`#${card.id} is lying`)
				}

				let hint = new allHints["Card"](card)
				this.owner.hints.push(hint)
			}
		}
	}
}
allRoles["Jester"] = class Jester extends Character {
	name = "Jester"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Jester.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
		this.activatedAbility = class extends ActivatedAbility {
			get infoBox(){
				return "Pick 3 Characters"
			}
			checkCompletion(){
				if (this.selection.cards.length >= 3){
					this.performAction()
				}
			}
			action(){
				console.log(this)
				let owner = this.owner
				let lies = owner.lies
				let cards = this.selection.cards
				let ownerRole = this.role
				let evils = cards.filter(card => {
					let role = ownerRole.register(card, lies)
					let alignment = role.alignment
					return alignment === "Evil"
				})
				let trueCount = evils.length
				let shownCount = trueCount
				if (lies){
					let possibilities = []
					for (let i = 0; i <= cards.length; i++){
						if (i === trueCount) continue
						possibilities.push(i)
					}
					shownCount = randomChoice(possibilities)
				}
				let ids = cards.map(card => "#"+card.id).join(", ")
				ownerRole.speak(`Among: ${ids}: There are ${shownCount} Evils`)

				let hint = new allHints["Cards"](cards)
				this.owner.hints.push(hint)
			}
		}
	}
}
allRoles["Wretch"] = class Wretch extends Character {
	name = "Wretch"
	type = "Outcast"
	alignment = "Good"
	lies = false
	registers_differently = true
	can_be_disguised_as = false
	sprite_url = "src/img/roles/Wretch.png"
	beRegistered(byCard, lying){
		let evilMinionRoles = Object.values(roleQualities)
		.filter(role => role.type === "Minion" && role.alignment === "Evil")
		let randomRole = randomChoice(evilMinionRoles)
		return randomRole
	}
}
allRoles["Minion"] = class Minion extends Character {
	name = "Minion"
	id = "Minion"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Minion.png"
	// onShow(card, level){
	// 	this.constructor.prototype.onShow(card, level)
	// }
}
allRoles["TwinMinion"] = class TwinMinion extends Character {
	name = "Twin Minion"
	id = "TwinMinion"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Twin Minion.png"
}
for (let roleName in allRoles){
	let role = allRoles[roleName]
	let character = new role()
	roleQualities[character.id] = character
}

class Card {
	constructor(character){
		this.true_role = character
		this.shown_role = character
		this.id = 0
		this.is_alive = true
		this.is_face_up = false
		this.is_disguised = false
		this.is_corrupted = false
		this.hints = []
	}
	get lies(){
		let lies = this.true_role.lies || this.is_corrupted
		if (lies && !this.true_role.can_lie){
			lies = false
		}
		return lies
	}
	disguise_as(character){
		this.shown_role = character
		this.is_disguised = this.shown_role !== this.true_role
	}
	undisguise(){
		this.shown_role = this.true_role
		this.is_disguised = false
	}
	onShow(card, level){
		this.shown_role.onShow(card, level)
		if (this.is_disguised){
			this.true_role.onShow(card, level)
		}
	}
	kill(card, level){
		card.container.addClass("dead")
		card.is_alive = false
		card.true_role.onKill(card, level)
		card.undisguise()
	}
	get outputs(){
		return this.true_role.outputs
		.concat(this.shown_role.outputs)
		.filter((v,i,s) => s.indexOf(v)===i)
		.sort((a, b) => a.timestamp - b.timestamp)
	}
	get outputHtml(){
		let outputs = this.outputs
		return outputs.map(message => message.html).join("")
	}
	get tooltip(){
		if (!this.anchorPoint) return
		let instance = bootstrap.Popover.getOrCreateInstance(this.anchorPoint)
		return instance
	}
	showTooltip(){
		let outputs = this.outputs
		let tooltip = this.tooltip
		if (outputs.length && !tooltip.tip){
			this.anchorPoint.popover("show")
		} else if (outputs.length && tooltip.tip) {
			$(tooltip.tip).find(".popover-body").html(this.outputHtml)
			this.anchorPoint.popover("update")
		}
	}
	showHints(){
		this.hints.forEach(hint => {
			hint.show()
		})
	}
	hideHints(){
		this.hints.forEach(hint => {
			hint.hide()
		})
	}
}

export const cardBackgroundSpriteUrls = {
	"Good": [
		"src/img/card-bg/good_1.png"
	],
	"Evil": [
		"src/img/card-bg/evil_1.png"
	],
}
export const characterTypes = ["Villager", "Outcast", "Minion", "Demon"]

export function createLevel(){
	let level = {}
	let characterCount = 10

	let typeTargets = {
		"Villager": {
			min: 0, max: Infinity
		},
		"Outcast": {
			min: 1, max: 1
		},
		"Minion": {
			min: 1, max: 2
		},
		"Demon": {
			min: 0, max: 1
		}
	}
	let typePriorities = ["Demon", "Minion", "Outcast", "Villager"]
	for (let i = 0; i < typePriorities.length; i++){
		let type = typePriorities[i]

		//The absolute maximum amount of this type that we can fit is the total number of cards
		//MINUS the sum of all previous minimums
		let totalMins = 0
		for (let j = 0; j < i; j++){
			let otherType = typePriorities[j]
			totalMins += typeTargets[otherType].min
		}
		let remainder = characterCount - totalMins
		if (typeTargets[type].max > remainder){
			typeTargets[type].max = remainder
		}
	}

	let typeCounts = {}
	for (let charType of characterTypes){
		typeCounts[charType] = 0
	}
	let cards = []
	let failsafe = 0
	while (cards.length < characterCount && failsafe < 100){
		failsafe++
		let availableRoles = Object.keys(allRoles)

		//Remove all roles whose types we're full on
		availableRoles = availableRoles.filter(roleId => {
			let type = roleQualities[roleId].type
			return typeCounts[type] < typeTargets[type].max 
		})

		//Duplicates are not allowed by default
		let withoutDuplicates = availableRoles.filter(roleId => {
			return !cards.some(card => card.true_role.id === roleId)
		})
		if (withoutDuplicates.length){
			availableRoles = withoutDuplicates
		} else {
			break
		}

		let neededRoleTypes = typePriorities.filter(type => {
			return typeCounts[type] < typeTargets[type].min
		})
		if (neededRoleTypes.length){
			let needed = neededRoleTypes[0]
			availableRoles = availableRoles.filter(roleId => {
				return roleQualities[roleId].type === needed
			})
		}

		let roleId = randomChoice(availableRoles)
		let role = allRoles[roleId]
		let character = new role()
		let card = new Card(character)
		let isLegal = true
		let type = card.true_role.type

		if (typeCounts[type] >= typeTargets[type].max){
			isLegal = false
		}

		if (isLegal){
			typeCounts[type]++
			cards.push(card)
		}
	}

	shuffleArray(cards)
	for (let card of cards){
		card.id = cards.indexOf(card) + 1
	}

	//Disguises
	for (let card of cards){
		if (!card.true_role.disguises) continue
		
		let type = card.true_role.type
		//Minions can disguise as villagers or outcasts
		if (type === "Minion"){
			let options = Object.keys(allRoles).filter(roleId => {
				let type = roleQualities[roleId].type
				return type === "Villager" || type === "Outcast"
			})
			//They can't disguise as some roles
			.filter(roleId => {
				return roleQualities[roleId].can_be_disguised_as
			})
			//TODO: Minions should have the 60% thing
			let disguiseName = randomChoice(options)
			let disguise = allRoles[disguiseName]
			card.disguise_as(new disguise())
		}
	}

	level.cards = cards
	level.max_hp = 10
	level.hp = level.max_hp
	return level
}
console.log(allRoles)