import {randomChoice, shuffleArray, lerp, delay} from "./util.js"

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

export class GameEventList {
	constructor(type="none"){
		this.events = []
	}
	removeEvent(event){
		let index = this.events.indexOf(event)
		if (index !== -1){
			this.events.splice(index, 1)
		}
	}
}

class Deck {
	constructor(){
		this.contents = []
	}
	add(roleId){
		if (!this.includes(roleId)){
			this.push(roleId)
		}
	}
	includes(roleId){
		return this.contents.includes(roleId)
	}
	push(roleId){
		this.contents.push(roleId)
	}
	shuffle(){
		shuffleArray(this.contents)
		this.sort()
	}
	sort(){
		let types = ["Villager", "Outcast", "Minion", "Demon"]
		this.contents.sort((a, b) => {
			let typeA = types.indexOf(roleQualities[a].type)
			let typeB = types.indexOf(roleQualities[b].type)
			return typeA - typeB
		})
	}
}

class ActivatedAbility {
	constructor(ownerCard, ownerRole, level){
		this.owner = ownerCard
		this.role = ownerRole
		this.level = level
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
			if (!card){
				console.log(this)
			}
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
	can_be_cured = true
	can_be_reseated = true
	spawnable = true
	night_cycle = false
	sprite_url = ""
	activatedAbilityCharges = 0
	activatedAbility = null
	constructor(options={}){
		this.outputs = []
	}
	get registers_differently(){
		return false
	}
	can_be_killed(card, level){
		return true
	}
	can_be_cured(card, level){
		return true
	}
	get trigger_priority(){
		return Object.keys(allRoles).indexOf(this.id)
	}
	getExecutionHealthChange(card, level){
		return 0
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
	kill(card, level){}
	onKill(card, level){}
	onExecute(card, level){}
	onAttemptReveal(card, level, cardBeingRevealed, gameEvents){}
	onGameStart(card, level, gameEvents){}
	onNight(card, level, gameEvents){}
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
allRoles["Cremgafter"] = class Cremgafter extends Character {
	name = "Cremgafter"
	type = "Villager"
	alignment = "Good"
	lies = false
	spawnable = false
	sprite_url = "src/img/roles/Gemcrafter.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let evils
		let alignments = cards.map(card => {
			let registered_alignment = this.register(card, lies).alignment
			return registered_alignment
		})
		if (!lies){
			//I am not lying
			evils = cards.filter((_, i) => alignments[i] === "Evil")
		} else {
			evils = cards.filter((_, i) => alignments[i] !== "Evil")
		}
		let otherEvils = evils.filter(evilCard => evilCard !== card)
		if (!otherEvils.length){
			otherEvils = evils
		}
		let randomCard = randomChoice(otherEvils)

		if (randomCard){
			let id = randomCard.id
			this.speak(`#${id} is Evil`)

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
allRoles["Empress"] = class Empress extends Character {
	name = "Empress"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Empress.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		
		let info = []
		if (!lies){
			let evils = cards.filter(otherCard => this.register(otherCard, lies).alignment === "Evil")
			info.push(randomChoice(evils))
		}

		//Add enough good characters so that the list has 3 characters in it
		while (info.length < 3){
			let options = cards.filter(otherCard => {
				if (this.register(otherCard, false).alignment === "Evil"){
					return false
				}
				if (info.includes(otherCard)){
					return false
				}
				//If the Empress is corrupted, her info may include herself as one of the good cards.
				if (otherCard === card && !card.is_corrupted){
					return false
				}
				return true
			})
			if (options.length){
				info.push(randomChoice(options))
			} else {
				break
			}
		}

		if (info.length === 1){
			this.speak(`#${info[0].id} is Evil`)
		} else if (info.length === 2){
			let ids = info.map(card => "#"+card.id).join(" & ")
			this.speak(`One is Evil: ${ids}`)
		} else {
			let ids = info.slice(0, -1).map(card => "#"+card.id).join(", ")
			ids += ", or #" + info[info.length - 1].id
			this.speak(`One is Evil: ${ids}`)
		}
		let hint = new allHints["Cards"](info)
		card.hints.push(hint)
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
allRoles["Knitter"] = class Knitter extends Character {
	name = "Knitter"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Knitter.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		
		let evils = cards.filter(otherCard => {
			let role = this.register(otherCard, lies)
			return role.alignment === "Evil"
		})
		let count = evils.filter(card1 => {
			let index = cards.indexOf(card1)
			let prevIndex = (index - 1 + cards.length) % cards.length
			let card2 = cards[prevIndex]
			let role = this.register(card2, lies)
			return role.alignment === "Evil"
		}).length
		
		let shownCount = count
		if (lies){
			let possibilities = []
			for (let i = 0; i < evils.length; i++){
				if (i === shownCount) continue
				possibilities.push(i)
			}
			shownCount = randomChoice(possibilities)
		}

		if (shownCount === 0){
			this.speak("Evils are not adjacent to each other")
		} else if (shownCount === 1) {
			this.speak(`There is only ${shownCount} pair of Evil`)
		} else {
			this.speak(`There are ${shownCount} pairs of Evil`)
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
	}
	activatedAbility = class extends ActivatedAbility {
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
allRoles["Jester"] = class Jester extends Character {
	name = "Jester"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Jester.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	activatedAbility = class extends ActivatedAbility {
		get infoBox(){
			return "Pick 3 Characters"
		}
		checkCompletion(){
			if (this.selection.cards.length >= 3){
				this.performAction()
			}
		}
		action(){
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
allRoles["Knight"] = class Knight extends Character {
	name = "Knight"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Knight.png"
	can_be_killed(card, level){
		let lies = card.lies
		return lies
	}
	getExecutionHealthChange(card, level){
		let change = super.getExecutionHealthChange(card, level)
		if (card.is_corrupted){
			change -= 4
		}
		return change
	}
}
allRoles["Scout"] = class Scout extends Character {
	name = "Scout"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Scout.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let evils = cards.filter(otherCard => {
			let role = this.register(otherCard, lies)
			return role.alignment === "Evil"
		})
		
		let randomEvil = randomChoice(evils)
		let otherEvils = evils.filter(otherCard => otherCard !== randomEvil)
		let index = cards.indexOf(randomEvil)
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
			this.speak(`${randomEvil.true_role.name} is ${shownDistance} card${s} away from closest Evil`)
		} else {
			this.speak(`I don't see any Evils`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Slayer"] = class Slayer extends Character {
	name = "Slayer"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Slayer.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	activatedAbility = class extends ActivatedAbility {
		get infoBox(){
			return "Pick a Character"
		}
		checkCompletion(){
			if (this.selection.cards.some(card => !card.is_alive)){
				this.cancel()
				return
			}
			if (this.selection.cards.length){
				this.performAction()
			}
		}
		action(){
			let owner = this.owner
			let lies = this.owner.lies
			let ownerRole = this.role
			let card = this.selection.cards[0]
			let level = this.level
			
			if (!lies && ownerRole.register(card, lies).alignment === "Evil" && card.is_alive){
				owner.execute(card, level)
				if (!card.is_alive){
					ownerRole.speak(`I killed Evil at #${card.id}`)
				} else {
					ownerRole.speak(`I couldn't kill #${card.id}`)
				}
			} else {
				ownerRole.speak(`I couldn't kill #${card.id}`)
			}

			let hint = new allHints["Card"](card)
			this.owner.hints.push(hint)
		}
	}
}
allRoles["Bard"] = class Bard extends Character {
	name = "Bard"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Bard.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let otherCorrupteds = cards.filter(otherCard => otherCard !== card)
		.filter(otherCard => {
			return otherCard.is_corrupted
		})
		
		let index = cards.indexOf(card)
		let minDistance = Infinity
		for (let otherCard of otherCorrupteds){
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
		} else if (!lies && minDistance === Infinity){
			//There are no corrupted characters
			canShow = false
		}

		if (canShow){
			let s = shownDistance === 1 ? "" : "s"
			this.speak(`I am ${shownDistance} card${s} away from closest Corrupted character`)

			//Create a hint pointing to those cards
			let hintCards = []
			let clockwiseCard = cards[(index + shownDistance) % cards.length]
			hintCards.push(clockwiseCard)
			let counterClockwiseCard = cards[(index - shownDistance + cards.length) % cards.length]
			hintCards.push(counterClockwiseCard)

			hintCards = hintCards.filter(otherCard => otherCard)
			if (hintCards.length){
				let hint = new allHints["Cards"](hintCards)
				card.hints.push(hint)
			}
		} else {
			this.speak(`There are no Corrupted characters`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["FortuneTeller"] = class FortuneTeller extends Character {
	name = "Fortune Teller"
	id = "FortuneTeller"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Fortune Teller.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	activatedAbility = class extends ActivatedAbility {
		get infoBox(){
			return "Pick 2 Characters"
		}
		checkCompletion(){
			if (this.selection.cards.length >= 2){
				this.performAction()
			}
		}
		action(){
			let owner = this.owner
			let lies = owner.lies
			let cards = this.selection.cards
			let ownerRole = this.role
			let evils = cards.filter(card => {
				let role = ownerRole.register(card, lies)
				let alignment = role.alignment
				return alignment === "Evil"
			})

			let isEvil = evils.length > 0
			let shownResult = isEvil
			if (lies) shownResult = !shownResult
			
			let ids = cards.map(otherCard => "#"+otherCard.id).join(" or ")
			let shownResultText = shownResult ? "True" : "False"
			ownerRole.speak(`Is ${ids} Evil? ${shownResultText}`)

			let hint = new allHints["Cards"](cards)
			this.owner.hints.push(hint)
		}
	}
}
allRoles["Oracle"] = class Oracle extends Character {
	name = "Oracle"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Oracle.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let roles = cards.map(otherCard => this.register(otherCard, lies))
		
		let info = []
		let shownRole = null
		if (lies){
			//Oracle picks two non-Evil characters and lies that they are an existing Evil role
			let options = cards.filter((_, i) => {
				return roles[i].alignment !== "Evil"
			})
			while (info.length < 2){
				let option = randomChoice(options.filter(option => !info.includes(option)))
				if (option){
					info.push(option)
				} else {
					break
				}
			}

			let existingEvilRoles = roles.filter(role => role.alignment === "Evil")
			shownRole = randomChoice(existingEvilRoles)
		} else {
			//Oracle picks an Evil character and a non-Evil character
			let evils = cards.filter((_, i) => {
				return roles[i].alignment === "Evil"
			})
			let nonEvils = cards.filter((_, i) => {
				return roles[i].alignment !== "Evil"
			})

			let chosenEvil
			if (evils.length){
				chosenEvil = randomChoice(evils)
				info.push(chosenEvil)
				shownRole = roles[cards.indexOf(chosenEvil)]
			}
			if (nonEvils.length){
				info.push(randomChoice(nonEvils))
			}
		}

		shuffleArray(info)
		let ids = info.map(otherCard => "#"+otherCard.id).join(" or ")
		if (shownRole){
			let roleName = shownRole.name
			this.speak(`${ids} is a ${roleName}`)
		} else {
			this.speak(`${ids} is... something. You shouldn't see this message.`)
		}

		let hint = new allHints["Cards"](info)
		card.hints.push(hint)
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Alchemist"] = class Alchemist extends Character {
	name = "Alchemist"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Alchemist.png"
	onGameStart(card, level, gameEvents){
		let lies = card.lies
		let cards = level.cards
		let otherCards = cards.filter(otherCard => otherCard !== card)
		let totalCorruptions = otherCards.filter(otherCard => otherCard.is_corrupted).length
		
		let affectedCards = []
		let index = cards.indexOf(card)
		let maxDistance = 2
		for (let otherCard of otherCards){
			let otherIndex = cards.indexOf(otherCard)
			let clockwiseDist = otherIndex - index
			if (clockwiseDist < 0) clockwiseDist += cards.length
			let counterClockwiseDist = cards.length - clockwiseDist
			let distance = Math.min(clockwiseDist, counterClockwiseDist)
			if (distance <= maxDistance){
				affectedCards.push(otherCard)
			}
		}
		let successes = 0
		for (let otherCard of affectedCards){
			if (otherCard.is_corrupted){
				if (!card.is_corrupted){
					card.cure(otherCard)
				}
				if (!otherCard.is_corrupted){
					successes++
				}
			}
		}
		let shownCount = successes
		if (lies){
			let possibilities = []
			let highest = Math.max(totalCorruptions, 1)
			for (let i = 1; i <= highest; i++){
				if (i === shownCount) continue
				possibilities.push(i)
			}
			if (possibilities.length){
				shownCount = randomChoice(possibilities)
			} else {
				shownCount = shownCount + 1
			}
		}

		let s = shownCount === 1 ? "" : "s"
		this.speak(`I cured ${shownCount} Corruption${s}`)
	}
}
allRoles["Druid"] = class Druid extends Character {
	name = "Druid"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Druid.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	activatedAbility = class extends ActivatedAbility {
		get infoBox(){
			return "Pick 3 Characters"
		}
		checkCompletion(){
			if (this.selection.cards.length >= 3){
				this.performAction()
			}
		}
		action(){
			let owner = this.owner
			let lies = owner.lies
			let selectedCards = this.selection.cards
			let ownerRole = this.role
			
			let roles = selectedCards.map(otherCard => {
				return ownerRole.register(otherCard, lies)
			})
			let outcasts = selectedCards.filter((otherCard, index) => {
				return roles[index].type === "Outcast"
			})
			let ids = selectedCards.map(card => "#"+card.id).join(", ")
			if (!lies){
				if (outcasts.length){
					let randomOutcast = randomChoice(outcasts)
					let index = selectedCards.indexOf(randomOutcast)
					let role = roles[index]

					ownerRole.speak(`Among: ${ids}: There is: ${role.name}`)
				} else {
					ownerRole.speak(`Among: ${ids}: There are no Outcasts`)
				}
			} else {
				//Find all incorrect statements
				let possibilities = []
				if (outcasts.length){
					possibilities.push("none")
				}
				let otherCards = this.owner.level.cards.filter(otherCard => !selectedCards.includes(otherCard))
				for (let otherCard of otherCards){
					let role = otherCard.true_role
					if (role.type !== "Outcast") continue
					if (possibilities.includes(role.id)) continue
					let roleId = role.id
					possibilities.push(roleId)
				}
				let randomOutcast = randomChoice(possibilities)
				if (randomOutcast === "none"){
					ownerRole.speak(`Among: ${ids}: There are no Outcasts`)
				} else {
					let role = roleQualities[randomOutcast]
					ownerRole.speak(`Among: ${ids}: There is: ${role.name}`)
				}
			}

			let hint = new allHints["Cards"](selectedCards)
			this.owner.hints.push(hint)
		}
	}
}
allRoles["Baker"] = class Baker extends Character {
	name = "Baker"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Baker.png"
	constructor(){
		super()
		this.prev_role = null
	}
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let unrevealedCards = cards.filter(otherCard => otherCard !== card && !otherCard.is_face_up)
		.filter(otherCard => {
			let role = otherCard.true_role
			return role.alignment === "Good" && role.type === "Villager"
		})

		if (!card.is_corrupted && unrevealedCards.length){
			let randomVillager = randomChoice(unrevealedCards)
			let newRole = new allRoles["Baker"]()
			let previousRole = randomVillager.true_role
			newRole.prev_role = previousRole
			randomVillager.setRole(newRole)
		}

		if (!lies){
			if (!this.prev_role){
				this.speak("I am the original Baker")
			} else {
				let name = this.prev_role.name
				let n = "AEIOUaeiou".includes(name[0]) ? "n" : ""
				this.speak(`I was a${n} ${name}`)
			}
		} else {
			//Pick a random existing villager role
			let roles = cards.filter(otherCard => otherCard !== card)
			.filter(otherCard => {
				let role = otherCard.true_role
				return role.alignment === "Good" && role.type === "Villager"
			})
			.filter(otherCard => {
				if (this.prev_role){
					let role = otherCard.true_role
					return role.id !== this.prev_role.id
				} else {
					return true
				}
			})
			.map(otherCard => otherCard.true_role)
			if (!roles.length){
				roles = Object.keys(allRoles).filter(roleId => {
					let role = roleQualities[roleId]
					return role.alignment === "Good" && role.type === "Villager"
				}).map(roleId => roleQualities[roleId])
			}
			let randomRole = randomChoice(roles)
			let name = randomRole.name
			let n = "AEIOUaeiou".includes(name[0]) ? "n" : ""
			this.speak(`I was a${n} ${randomRole.name}`)
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Architect"] = class Architect extends Character {
	name = "Architect"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Architect.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let roles = cards.map(otherCard => this.register(otherCard, lies))
		let sides = cards.map((otherCard, index) => {
			if (otherCard.id === cards.length) return "both"
			if (otherCard.id === cards.length * 0.5) return "both"
			if (otherCard.id > cards.length * 0.5) return "left"
			return "right"
		})
		
		let lefts = 0
		let rights = 0
		cards.forEach((otherCard, index) => {
			let role = roles[index]
			let side = sides[index]

			if (role.alignment === "Evil"){
				if (side === "left") lefts++
				else if (side === "right") rights++
				else {
					lefts++
					rights++
				}
			}
		})
		
		let trueAnswer = lefts > rights ? "left" : lefts < rights ? "right" : "both"
		let shownAnswer = trueAnswer
		if (lies){
			let possibilities = ["left", "right", "both"].filter(option => option !== trueAnswer)
			shownAnswer = randomChoice(possibilities)
		}

		if (shownAnswer === "left"){
			this.speak("Left side is more Evil")
			let affectedCards = cards.filter((otherCard, index) => {
				let side = sides[index]
				return side === "left" || side === "both"
			})
			let hint = new allHints["Cards"](affectedCards)
			card.hints.push(hint)
		} else if (shownAnswer === "right"){
			this.speak("Right side is more Evil")
			let affectedCards = cards.filter((otherCard, index) => {
				let side = sides[index]
				return side === "right" || side === "both"
			})
			let hint = new allHints["Cards"](affectedCards)
			card.hints.push(hint)
		} else {
			this.speak("Both sides are equally Evil")
		}
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Bishop"] = class Bishop extends Character {
	name = "Bishop"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Bishop.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards
		let roles = cards.map(otherCard => this.register(otherCard, lies))
		
		let info = []
		if (!lies){
			//Find one villager, one outcast, one minion
			let added = []
			let villagers = cards.filter((otherCard, index) => roles[index].type === "Villager")
			if (villagers.length){
				info.push(randomChoice(villagers))
				added.push("Villager")
			}
			let minions = cards.filter((otherCard, index) => roles[index].type === "Minion")
			if (minions.length){
				info.push(randomChoice(minions))
				added.push("Minion")
			}
			let outcasts = cards.filter((otherCard, index) => roles[index].type === "Outcasts")
			if (outcasts.length){
				info.push(randomChoice(outcasts))
				added.push("Outcast")
			}
			
			if (added.length === 3){
				let ids = info.map(card => "#"+card.id).join(", ")
				this.speak(`Between ${ids} there is: Villager, Minion, and Outcast`)
			} else {
				let ids = info.map(card => "#"+card.id).join(" & ")
				let claim = added.join(" & ")
				this.speak(`Between ${ids} there is: ${claim}`)
			}
		} else {
			//Find three villagers
			let villagers = cards.filter((otherCard, index) => roles[index].type === "Villager")
			while (info.length < 3){
				let options = villagers.filter(otherCard => !info.includes(otherCard))
				info.push(randomChoice(options))
			}

			let ids = info.map(card => "#"+card.id).join(", ")
			this.speak(`Between ${ids} there is: Villager, Minion, and Outcast`)
		}
		let hint = new allHints["Cards"](info)
		card.hints.push(hint)
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Dreamer"] = class Dreamer extends Character {
	name = "Dreamer"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Dreamer.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	activatedAbility = class extends ActivatedAbility {
		get infoBox(){
			return "Pick a Character"
		}
		checkCompletion(){
			if (this.selection.cards.length > 0){
				this.performAction()
			}
		}
		action(){
			let owner = this.owner
			let lies = owner.lies
			let selectedCard = this.selection.cards[0]
			let ownerRole = this.role
			let seenRole = ownerRole.register(selectedCard, lies)
			let cards = this.owner.level.cards

			let showIncorrect = false
			if (!lies){
				if (selectedCard.true_role === "Wretch"){
					//Cute detail
					ownerRole.speak(`#${selectedCard.id} could be: Cabbage`)
				} else if (seenRole.alignment === "Evil"){
					ownerRole.speak(`#${selectedCard.id} could be: ${seenRole.name}`)
				} else {
					showIncorrect = true
				}
			} else {
				showIncorrect = true
			}
			if (showIncorrect){
				//Find a random existing but incorrect role
				let evilCards = cards.filter(otherCard => otherCard !== selectedCard && otherCard.true_role.alignment === "Evil")
				let evilRoles = evilCards.map(otherCard => otherCard.true_role)
				if (!evilRoles.length){
					evilRoles = Object.keys(allRoles).filter(roleId => roleQualities[roleId].alignment === "Evil")
				}
				let seenRole = randomChoice(evilRoles)
				ownerRole.speak(`#${selectedCard.id} could be: ${seenRole.name}`)
			}

			let hint = new allHints["Card"](selectedCard)
			this.owner.hints.push(hint)
		}
	}
}
allRoles["Poet"] = class Poet extends Character {
	name = "Poet"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Poet.png"
	trigger(card, level){
		let usableRoleIds = [
			"Architect", "Bard", "Bishop", "Empress", "Enlightened",
			"Gemcrafter", "Hunter", "Knitter", "Lover", "Medium",
			"Oracle", "Scout", "Witness",
			"Cremgafter"
		]
		let Role = allRoles[randomChoice(usableRoleIds)]
		let role = new Role()
		role.onShow(card, level)
		role.outputs.forEach(output => {
			this.speak(output.text, output.type)
		})
	}
	onShow(card, level){
		this.trigger(card, level)
	}
}
allRoles["Witness"] = class Witness extends Character {
	name = "Witness"
	type = "Villager"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Witness.png"
	trigger(card, level){
		let lies = card.lies
		let cards = level.cards

		let affectedCards = cards.filter(otherCard => {
			return otherCard.eventHistory.some(event => {
				let role = roleQualities[event.fromRole]
				return role.alignment === "Evil"
			})
		})
		
		let randomCard
		if (!lies && affectedCards.length){
			randomCard = randomChoice(affectedCards)
		} else if (lies){
			let unaffectedCards = cards.filter(otherCard => !affectedCards.includes(otherCard))
			if (unaffectedCards.length){
				randomCard = randomChoice(unaffectedCards)
			}
		}

		if (randomCard){
			this.speak(`#${randomCard.id} was affected by an Evil`)
			let hint = new allHints["Card"](randomCard)
			card.hints.push(hint)
		} else {
			this.speak("No one was affected by an Evil")
		}
	}
	onShow(card, level){
		this.trigger(card, level)
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
allRoles["Bombardier"] = class Bombardier extends Character {
	name = "Bombardier"
	type = "Outcast"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Bombardier.png"
	onExecute(card, level){
		level.hp = 0
	}
}
allRoles["Doppelganger"] = class Doppelganger extends Character {
	name = "Doppelganger"
	type = "Outcast"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Doppelganger.png"
	onGameStart(card, level, gameEvents){
		//Disguises self as Villager currently in play
		let cards = level.cards
		let villagers = cards.filter(card => card.true_role.type === "Villager")
		if (villagers.length){
			let disguiseId = randomChoice(villagers).true_role.id
			let disguiseRole = allRoles[disguiseId]
			let disguise = new disguiseRole()
			card.disguise_as(disguise)
		}
	}
}
allRoles["Shaman"] = class Shaman extends Character {
	name = "Shaman"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Shaman.png"
	onGameStart(card, level, gameEvents){
		//Changes one Villager to another existing Villager role
		let cards = level.cards
		let villagers = cards.filter(otherCard => otherCard.true_role.type === "Villager")
		
		if (villagers.length > 1){
			let randomVillager = randomChoice(villagers)
			let otherVillagers = villagers.filter(otherCard => otherCard !== randomVillager)
			let otherVillager = randomChoice(otherVillagers)
			let roleId = otherVillager.true_role.id

			let Role = allRoles[roleId]
			let role = new Role()
			randomVillager.setRole(role)
			randomVillager.eventHistory.push({
				type: "role_switch",
				from: card,
				fromRole: this.id
			})
		}
	}
}
allRoles["PlagueDoctor"] = class PlagueDoctor extends Character {
	name = "Plague Doctor"
	id = "PlagueDoctor"
	type = "Outcast"
	alignment = "Good"
	lies = false
	sprite_url = "src/img/roles/Plague Doctor.png"
	constructor(){
		super()
		this.activatedAbilityCharges = 1
	}
	onGameStart(card, level, gameEvents){
		//Corrupts a random Good Villager

		//If an evil role is disguised as this card, they won't corrupt anyone.
		if (card.is_disguised){
			return
		}

		let cards = level.cards
		let options = cards.filter(otherCard => {
			return otherCard.true_role.type === "Villager" && otherCard.true_role.alignment === "Good"
		})
		if (options.length){
			let randomCard = randomChoice(options)
			randomCard.is_corrupted = true
		}
	}
	activatedAbility = class extends ActivatedAbility {
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
			let targetisCorrupted = card.is_corrupted

			let showEvil = false
			if (targetisCorrupted && !lies){
				showEvil = true
			} else if (!targetisCorrupted && lies){
				showEvil = true
			}

			if (card === this.owner){
				//Plague Doctors always view themselves as not corrupted.
				showEvil = false
			}

			if (showEvil){
				let cards = this.level.cards
				let evils = []
				if (!lies){
					evils = cards.filter(otherCard => {
						return this.role.register(otherCard, lies).alignment === "Evil"
					})
				} else {
					evils = cards.filter(otherCard => {
						return this.role.register(otherCard, lies).alignment !== "Evil"
					})
				}

				if (evils.length){
					let randomEvil = randomChoice(evils)
					this.role.speak(`#${randomEvil.id} is Evil`)
					this.role.speak(`#${card.id} is Corrupted`)
					let hint = new allHints["Card"](randomEvil)
					this.owner.hints.push(hint)
				} else {
					this.role.speak(`#${card.id} is Corrupted`)
				}
			} else {
				this.role.speak(`#${card.id} is Not Corrupted`)
			}

			let hint = new allHints["Card"](card)
			this.owner.hints.push(hint)
		}
	}
}
allRoles["Puppet"] = class Puppet extends Character {
	name = "Puppet"
	type = "Minion"
	alignment = "Evil"
	lies = false
	spawnable = false
	sprite_url = "src/img/roles/Puppet.png"
}
allRoles["Puppeteer"] = class Puppeteer extends Character {
	name = "Puppeteer"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Puppeteer.png"
	onGameStart(card, level, gameEvents){
		//Adds an additional outcast to the board
		let cards = level.cards
		let index = cards.indexOf(card)
		let nextIndex = (index + 1) % cards.length
		let prevIndex = (index - 1 + cards.length) % cards.length
		let adjacentCards = [cards[nextIndex], cards[prevIndex]]
		let options = adjacentCards.filter(otherCard => {
			return otherCard.true_role.type === "Villager"
		})
		if (options.length){
			let roleId = "Puppet"
			let Role = allRoles[roleId]
			let randomVillager = randomChoice(options)
			let role = new Role()
			randomVillager.true_role = role
			randomVillager.eventHistory.push({
				type: "puppet",
				from: card,
				fromRole: this.id
			})
		}
	}
}
allRoles["Drunk"] = class Drunk extends Character {
	name = "Drunk"
	type = "Outcast"
	alignment = "Good"
	lies = true
	can_be_cured = false
	sprite_url = "src/img/roles/Drunk.png"
	onGameStart(card, level, gameEvents){
		card.is_corrupted = true
		//Disguises self as Villager currently not in play
		let cards = level.cards
		let villagerRoles = []
		cards.forEach(otherCard => {
			let role1 = otherCard.true_role
			if (role1.type === "Villager"){
				villagerRoles.push(role1.id)
			}
			let role2 = otherCard.shown_role
			if (role2.type === "Villager"){
				villagerRoles.push(role2.id)
			}
		})
		villagerRoles = villagerRoles.filter((v,i,s) => s.indexOf(v) === i)
		let options = Object.keys(allRoles).filter(roleId => {
			return roleQualities[roleId].type === "Villager" && !villagerRoles.includes(roleId)
		})
		if (options.length){
			let disguiseId = randomChoice(options)
			let disguiseRole = allRoles[disguiseId]
			let disguise = new disguiseRole()
			card.disguise_as(disguise)
			card.level.deck.add(disguiseId)
		}
	}
	getExecutionHealthChange(card, level){
		let change = super.getExecutionHealthChange(card, level)
		return change + 3
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
allRoles["Witch"] = class Witch extends Character {
	name = "Witch"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Witch.png"
	onAttemptReveal(card, level, cardBeingRevealed, gameEvents){
		let cards = level.cards
		let unrevealedCards = cards.filter(c => {
			return !c.is_face_up && c.is_alive
		})
		if (unrevealedCards.length === 1 && card.is_alive){
			//Prevent the card being revealed
			let reveals = gameEvents.events.filter(event => event.type === "reveal")
			reveals.forEach(revealEvent => {
				gameEvents.removeEvent(revealEvent)
			})
		}
	}
}
allRoles["Poisoner"] = class Poisoner extends Character {
	name = "Poisoner"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Poisoner.png"
	onGameStart(card, level, gameEvents){
		//Poisons an adjacent Villager
		let cards = level.cards
		let index = cards.indexOf(card)
		let nextIndex = (index + 1) % cards.length
		let prevIndex = (index - 1 + cards.length) % cards.length
		let adjacentCards = [cards[nextIndex], cards[prevIndex]]
		let options = adjacentCards.filter(otherCard => {
			return otherCard.true_role.type === "Villager" && !otherCard.is_corrupted
		})
		if (options.length){
			let randomCard = randomChoice(options)
			randomCard.is_corrupted = true
			randomCard.eventHistory.push({
				type: "corrupted",
				from: card,
				fromRole: this.id
			})
		}
	}
}
allRoles["Pooka"] = class Pooka extends Character {
	name = "Pooka"
	type = "Demon"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Pooka.png"
	onGameStart(card, level, gameEvents){
		//Corrupts both adjacent Villagers
		let cards = level.cards
		let index = cards.indexOf(card)
		let nextIndex = (index + 1) % cards.length
		let prevIndex = (index - 1 + cards.length) % cards.length
		let adjacentCards = [cards[nextIndex], cards[prevIndex]]
		let options = adjacentCards.filter(otherCard => {
			return otherCard.true_role.type === "Villager" && !otherCard.is_corrupted
		})
		for (let adjacentCard of options){
			adjacentCard.is_corrupted = true
			adjacentCard.eventHistory.push({
				type: "corrupted",
				from: card,
				fromRole: this.id
			})
		}
	}
}
allRoles["Counsellor"] = class Counsellor extends Character {
	name = "Counsellor"
	type = "Minion"
	alignment = "Evil"
	lies = true
	disguises = true
	can_be_reseated = false
	sprite_url = "src/img/roles/Counsellor.png"
	onGameStart(card, level, gameEvents){
		//Adds an additional outcast to the board
		let outcasts = Object.keys(allRoles)
		.filter(roleId => !level.deck.includes(roleId))
		.filter(roleId => {
			return roleQualities[roleId].type === "Outcast"
		})
		let cards = level.cards
		let villagers = cards.filter(otherCard => otherCard.true_role.type === "Villager")
		
		if (outcasts.length && villagers.length){
			let roleId = randomChoice(outcasts)
			level.deck.add(roleId)
			level.deck.shuffle()
			let Role = allRoles[roleId]
			let randomVillager = randomChoice(villagers)
			let role = new Role()
			randomVillager.setRole(role)
			randomVillager.eventHistory.push({
				type: "counselled",
				from: card,
				fromRole: this.id
			})
		}

		//Then re-seats himself to sit next to an outcast, if possible.
		let legalMap = cards.map((otherCard, index) => {
			let nextIndex = (index + 1) % cards.length
			let prevIndex = (index - 1 + cards.length) % cards.length
			let adjacentCards = [cards[nextIndex], cards[prevIndex]]
			let legal = adjacentCards.some(adjacentCard => {
				return adjacentCard.true_role.type === "Outcast"
			})
			return legal
		})
		let index = cards.indexOf(card)
		if (!legalMap[index]){
			let reseatable = cards.filter((otherCard, index) => {
				return legalMap[index] && otherCard.true_role.can_be_reseated
			})
			if (reseatable.length){
				let newSeat = randomChoice(reseatable)
				card.swapSeats(newSeat)
			}
		}
	}
}
allRoles["Baa"] = class Baa extends Character {
	name = "Baa"
	type = "Demon"
	alignment = "Evil"
	lies = true
	disguises = true
	sprite_url = "src/img/roles/Baa.png"
	onGameStart(card, level, gameEvents){
		//Adds an additional outcast to the deck
		let outcasts = Object.keys(allRoles)
		.filter(roleId => !level.deck.includes(roleId))
		.filter(roleId => {
			return roleQualities[roleId].type === "Outcast"
		})
		
		if (outcasts.length){
			level.deck.add(randomChoice(outcasts))
			level.deck.shuffle()
		}
	}
}
allRoles["Lilis"] = class Lilis extends Character {
	name = "Lilis"
	type = "Demon"
	alignment = "Evil"
	lies = true
	disguises = true
	night_cycle = true
	sprite_url = "src/img/roles/Lilis.png"
	onNight(card, level, gameEvents){
		let cards = level.cards
	}
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
		this.original_disguise = null
		this.is_corrupted = false
		this.level = null
		this.eventHistory = []
		this.hints = []
		this.marks = []
	}
	get lies(){
		let lies = this.true_role.lies || this.is_corrupted
		if (lies && !this.true_role.can_lie){
			lies = false
		}
		return lies
	}
	setRole(character){
		this.true_role = character
		this.shown_role = character
	}
	disguise_as(character){
		this.original_disguise = character
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
	execute(card, level){
		if (card.is_alive && card.true_role.can_be_killed(card, level)){
			let wasDisguised = card.is_disguised
			let shownRole = card.shown_role
			card.kill(card, level)
			if (!card.is_alive){
				let health_change = 0
				health_change += card.true_role.alignment !== "Evil" ? -5 : 0
				health_change += card.true_role.getExecutionHealthChange(card, level)
				if (wasDisguised){
					health_change += shownRole.getExecutionHealthChange(card, level)
				}
				level.hp += health_change
				card.true_role.onExecute(card, level)
			}
		}
	}
	cure(card){
		if (card.is_corrupted && card.true_role.can_be_cured){
			card.is_corrupted = false
		}
	}
	swapSeats(card){
		let oldId = this.id
		this.id = card.id
		card.id = oldId
		let cards = this.level?.cards
		if (cards){
			let oldIndex = cards.indexOf(this)
			let newIndex = cards.indexOf(card)
			if (oldIndex !== -1 && newIndex !== -1){
				cards[newIndex] = this
				cards[oldIndex] = card
			}
		}
		console.log("Swapped", this, card)
	}
	onAttemptReveal(card, level, cardBeingRevealed, gameEvents){
		this.shown_role.onAttemptReveal(...arguments)
		if (this.is_disguised){
			this.true_role.onAttemptReveal(...arguments)
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
	toggleMark(markType){
		let marks = this.marks
		if (marks.includes(markType)){
			marks.splice(marks.indexOf(markType), 1)
		} else {
			marks.push(markType)
		}
	}
	removeMark(markType){
		let marks = this.marks
		if (marks.includes(markType)){
			marks.splice(marks.indexOf(markType), 1)
		}
	}
}

class Level {
	constructor(){
		this.deck = new Deck()
		this.cards = []
		this.max_hp = 10
		this.hp = this.max_hp
		this.night_cycle = false
		this.night_hour = 0
		this.night_day = 0
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
	let level = new Level()
	let characterCount = 10

	let typeTargets = {
		"Villager": {
			min: 0, max: Infinity
		},
		"Outcast": {
			min: 1, max: 2
		},
		"Minion": {
			min: 0, max: 0
		},
		"Demon": {
			min: 1, max: 1
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

	let forcedRoles = ["Shaman", "TwinMinion", "Lilis"]

	let typeCounts = {}
	for (let charType of characterTypes){
		typeCounts[charType] = 0
	}
	let deck = level.deck
	let cards = level.cards
	let failsafe = 0
	while (cards.length < characterCount && failsafe < 100){
		failsafe++
		let availableRoles = Object.keys(allRoles)

		//Not all roles can naturally spawn
		availableRoles = availableRoles.filter(roleId => {
			return roleQualities[roleId].spawnable
		})

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

		if (availableRoles.some(roleId => {
			return forcedRoles.includes(roleId)
		})){
			availableRoles = availableRoles.filter(roleId => {
				return forcedRoles.includes(roleId)
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
			deck.add(card.true_role.id)
			deck.add(card.shown_role.id)
		}
	}

	shuffleArray(cards)

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
			
			let disguiseId
			let tryToBeUnique = Math.random() < 0.4
			disguiseId = randomChoice(options)
			if (tryToBeUnique){
				//Pick a role that is available but not used
				let unusedRoles = options.filter(roleId => {
					return !cards.some(card => card.true_role.id === roleId)
				})
				if (unusedRoles.length){
					disguiseId = randomChoice(unusedRoles)
				}
			} else {
				//Pick a role that is already used by another card
				let usedRoles = options.filter(roleId => {
					return cards.some(card => card.true_role.id === roleId)
				})
				if (usedRoles.length){
					disguiseId = randomChoice(usedRoles)
				}
			}

			let disguiseRole = allRoles[disguiseId]
			let disguise = new disguiseRole()
			card.disguise_as(disguise)
			deck.add(disguiseId)
		}
		//Demons only ever disguise as villagers, but only as ones not already in play
		else if (type === "Demon"){
			let options = Object.keys(allRoles).filter(roleId => {
				let type = roleQualities[roleId].type
				return type === "Villager"
			})
			//They can't disguise as some roles
			.filter(roleId => {
				return roleQualities[roleId].can_be_disguised_as
			})

			let disguiseId
			disguiseId = randomChoice(options)

			//Pick a role that is available but not used
			let unusedRoles = options.filter(roleId => {
				return !cards.some(card => card.true_role.id === roleId)
			})
			if (unusedRoles.length){
				disguiseId = randomChoice(unusedRoles)
			}

			let disguiseRole = allRoles[disguiseId]
			let disguise = new disguiseRole()
			card.disguise_as(disguise)
			deck.add(disguiseId)
		}
	}

	shuffleArray(cards)
	for (let card of cards){
		card.id = cards.indexOf(card) + 1
		card.level = level
	}

	deck.shuffle()
	return level
}
console.log(allRoles)