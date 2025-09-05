import {randomChoice, shuffleArray, lerp} from "./util.js"

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
				if (Math.abs(next - target) < 0.01){
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
			element.attr("src", "src/arrow_with_outline.png")
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
	constructor(options={}){
		this.outputs = []
	}
	get registers_differently(){
		return false
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
			return otherCard.true_role.be_registered(this, lying)
		} else {
			return roleQualities[otherCard.true_role.name]
		}
	}
	be_registered(byCard, lying){
		return this
	}
	trigger(card, level){}
	onShow(){}
}

export const allRoles = {}
export const roleQualities = {}
allRoles["Confessor"] = class extends Character {
	name = "Confessor"
	type = "Villager"
	alignment = "Good"
	lies = false
	can_lie = false
	sprite_url = "src/img/Confessor.png"
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
allRoles["Lover"] = class extends Character {
	name = "Lover"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/Lover.png"
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
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Gemcrafter"] = class extends Character {
	name = "Gemcrafter"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/Gemcrafter.png"
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
		let id = randomCard.id
		this.speak(`#${id} is Good`)

		//Create a hint pointing to that card
		let hint = new allHints["Cards"]([randomCard])
		card.hints.push(hint)
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Hunter"] = class extends Character {
	name = "Hunter"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/Hunter.png"
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
allRoles["Wretch"] = class extends Character {
	name = "Wretch"
	type = "Outcast"
	alignment = "Good"
	lies = false
	registers_differently = true
	can_be_disguised_as = false
	sprite_url = "src/img/Wretch.png"
	be_registered(byCard, lying){
		let evilMinionRoles = Object.values(roleQualities)
		.filter(role => role.type === "Minion" && role.alignment === "Evil")
		let randomRole = randomChoice(evilMinionRoles)
		return randomRole
	}
}
allRoles["Minion"] = class extends Character {
	name = "Minion"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/Minion.png"
}
allRoles["Twin Minion"] = class extends Character {
	name = "Twin Minion"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/Twin Minion.png"
}
for (let roleName in allRoles){
	let role = allRoles[roleName]
	let character = new role()
	roleQualities[roleName] = character
}

class Card{
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
	let characterCount = 5

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
		availableRoles = availableRoles.filter(roleName => {
			let type = roleQualities[roleName].type
			return typeCounts[type] < typeTargets[type].max 
		})

		//Duplicates are not allowed by default
		let withoutDuplicates = availableRoles.filter(roleName => {
			return !cards.some(card => card.true_role.name === roleName)
		})
		if (withoutDuplicates.length){
			availableRoles = withoutDuplicates
		}

		let neededRoleTypes = typePriorities.filter(type => {
			return typeCounts[type] < typeTargets[type].min
		})
		if (neededRoleTypes.length){
			let needed = neededRoleTypes[0]
			availableRoles = availableRoles.filter(roleName => {
				return roleQualities[roleName].type === needed
			})
		}

		let roleName = randomChoice(availableRoles)
		let role = allRoles[roleName]
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
	cards[0].true_role = new allRoles["Hunter"]()
	cards[0].undisguise()
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
			let options = Object.keys(allRoles).filter(key => {
				let type = roleQualities[key].type
				return type === "Villager" || type === "Outcast"
			})
			//They can't disguise as some roles
			.filter(key => {
				return roleQualities[key].can_be_disguised_as
			})
			//TODO: Minions should have the 60% thing
			let disguiseName = randomChoice(options)
			let disguise = allRoles[disguiseName]
			card.disguise_as(new disguise())
		}
	}

	let level = {
		cards: cards
	}
	return level
}
console.log(allRoles)