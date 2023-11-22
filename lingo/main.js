(function(){
	let SECTIONS = {}
	let LEVELS = []
	let currentLevel

	let clueClasses = {
		"none": "clue-none",
		"white": "clue-white",
		"black": "clue-black",
		"red": "clue-red",
		"blue": "clue-blue",
		"purple": "clue-purple",
		"yellow": "clue-yellow",
		"green": "clue-green",
		"brown": "clue-brown",
		"brown-black": "clue-brown-black",
		"orange": "clue-orange",
		"gray": "clue-gray",
		"mint": "clue-mint",
		"magenta": "clue-magenta",
		"lime": "clue-lime",
		"lavender": "clue-lavender"
	}
	let clueHelps = {
		"clue-white-high": "The answer sounds the same as this clue.",
		"clue-white-middle": "The answer has the same letters as this clue.",
		"clue-white-low": "The answer means the same thing as this clue.",

		"clue-black-high": "The answer sounds the same as this clue, but backwards.",
		"clue-black-middle": "The answer has the same letters as this clue, but backwards.",
		"clue-black-low": "The answer has an opposite or complementary meaning to this clue.",

		"clue-red-high": "The answer sounds the same as this clue, but with sounds removed. Order remains the same.",
		"clue-red-middle": "The answer has the same letters as this clue, but with letters removed. Order remains the same.",
		"clue-red-low": "The answer is something that is inside of this clue. For example, a saw has teeth, and a ship has an aft.",

		"clue-blue-high": "The answer sounds the same as this clue, but with sounds added.",
		"clue-blue-middle": "The answer has the same letters as this clue, but with some letters added.",
		"clue-blue-low": "The answer is something that has this clue inside of it. For example, walls are part of a home, and your nose is on your face.",

		"clue-purple-high": "The answer sounds the same as this clue, but with sounds replaced. It's very vague.",
		"clue-purple-middle": "The answer has the same letters as this clue, but with some letters replaced. It's very vague.",
		"clue-purple-low": "The answer is something that you get when you replace or modify all or part of this clue. For example, a spoon could become a fork, and eggs could become deviled eggs.",

		"clue-yellow-high": "The answer has the same sounds as this clue, but reordered.",
		"clue-yellow-middle": "The answer has the same letters as this clue, but reordered.",
		"clue-yellow-low": "The answer is something that you get when this clue is mixed somehow. For example, air could become a tornado, and eggs could become scrambled eggs.",

		"clue-green-high": "The answer sounds the same as something in the environment or surrounding context.",
		"clue-green-middle": "The answer appears in actual letters in the environment or surrounding context.",
		"clue-green-low": "The answer is something in the environment or surrounding context.",

		"clue-brown-high": "The answer sounds the way this clue would sound after time has passed.",
		"clue-brown-middle": "The answer has the spelling that this clue would have after time has passed. For example, Nigh could become Near.",
		"clue-brown-low": "The answer is something that you get after time passes, related to this clue somehow. For example, an acorn could become a tree, or a child could become an adult.",

		"clue-brown-black-high": "The answer sounds the way this clue would sound before time has passed.",
		"clue-brown-black-middle": "The answer has the spelling that this clue would have before time passed. For example, Before could become Ere.",
		"clue-brown-black-low": "The answer is something that you get before time passes, related to this clue somehow. For example, a tree could become an acorn, or a child could become a baby.",
		
		"clue-orange-high": "The answer has something to do with the sounds ciphered by the clue.",
		"clue-orange-middle": "The answer is what you get when you decode this clue using a cipher or transformative operation of some kind.",
		"clue-orange-low": "The answer is some transformation of the clue.",
		
		"clue-gray-high": "Gray is entirely context-specific. The clue describes what the answer is, but it's intentionally vague.",
		"clue-gray-middle": "Gray is entirely context-specific. The clue describes what the answer is, but it's intentionally vague.",
		"clue-gray-low": "Gray is entirely context-specific. The clue describes what the answer is, but it's intentionally vague.",
		
		"clue-mint-high": "The answer is something you're supposed to remember from the actual Lingo game. These might be difficult for you. I've included some extra hints.",
		"clue-mint-middle": "The answer is something you're supposed to remember from the actual Lingo game. These might be difficult for you. I've included some extra hints.",
		"clue-mint-low": "The answer is something you're supposed to remember from the actual Lingo game. These might be difficult for you. I've included some extra hints.",
		
		"clue-magenta-high": "The answer is the sound that this clue makes. For example, cat could be meow or purr.",
		"clue-magenta-middle": "The answer is an example of the kind of thing given by the clue. For example, English could be literally any English word, and Noun could be literally any Noun.",
		"clue-magenta-low": "The answer is an example of the kind of thing given by the clue. For example, gemstone could be diamond, or ruby, or any kind of gem, really.",
		
		"clue-lime-high": "The answer is the thing that makes the sound given by the clue. For example, hiss could be snake or cat.",
		"clue-lime-middle": "The answer is the kind of word that the clue is. For example, we could be pronoun, or english, or plural, or any other descriptor.",
		"clue-lime-low": "The answer is the kind of thing that the clue is. For example, orange could be fruit or color.",
		
		"clue-lavender-high": "The answer is the sounds that surround the clue somehow.",
		"clue-lavender-middle": "The answer is comprised of the letters that surround the letters of the clue somehow.",
		"clue-lavender-low": "The answer is the thing that surrounds the clue somehow. For example, an egg is surrounded by a shell, and a bunny lives in a burrow."
	}
	let clueClassesToHelpName = {
		"clue-brown-black-low": "Brown",
		"clue-brown-black-middle": "Brown",
		"clue-brown-black-high": "Brown",
	}

	let SOUNDS = {}
	SOUNDS["confetti"] = new Audio("lingo complete sound.mp3")
	SOUNDS["confetti"].addEventListener("play", confettiEffect)

	function fireConfetti(){
		let sound = SOUNDS["confetti"]
		sound.currentTime = 0
		sound.play()
	}

	function confettiEffect(){
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.5, y: 0.6 },
		})
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.3, y: 0.3 },
		})
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.7, y: 0.3 },
		})
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.1, y: 0.5 },
		})
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.9, y: 0.5 },
		})
	}

	function getLevelInternalName(level){
		let section = level.section ?? "no-section"
		let levelName = level.name ?? "no-name"
		return section + "++" + levelName
	}

	function decodeSave(encodedSave){
		let str = LZString.decompress(encodedSave) || ""
		let levelData = str.split("|")
		console.log(levelData)
		for (let data of levelData){
			let vals = data.match(/([^:]+):(\d+)/)
			if (!vals) continue

			let levelName = vals[1]
			let levelSolved = !!parseInt(vals[2])

			let level = LEVELS.find(l => l.internalName === levelName)
			if (!level) continue
			level.complete = levelSolved
			level.hintsUsed = 0
		}
		console.log(LEVELS)
		console.log(SECTIONS)
	}

	function save(){
		let data = ""
		for (let level of LEVELS){
			data += `${level.internalName}:${level.complete ? 1 : 0}`
			data += "|"
		}
		data = data.substring(0, data.length - 1)
		data = LZString.compress(data)
		localStorage.setItem("lingo-save", data)
	}

	function resetSave(){
		localStorage.setItem("save", "")
		location.reload(true)
	}

	function changeVolume(event){
		let el = event.delegateTarget
		let val = $(el).val() / 100
		val *= val
		console.log(val)
		let keys = Object.keys(SOUNDS)
		for (let key of keys){
			let sound = SOUNDS[key]
			sound.volume = val
		}
	}

	function changeView(view){
		$("body > .screen:not(#"+view+")").hide()
		$("#"+view).show()
	}

	function changeHelpTopic(event){
		let val
		if (typeof event === "number"){
			val = event
		}
		else if (typeof event === "string"){
			$("#help-topic-list > .topic").each((_, el) => {
				if (el.textContent === event){
					val = el.value
				}
			})
		}
		else {
			let el = event?.delegateTarget
			val = el.value
		}
		let toShow = $(`#help-content > div[value=${val}]`)
		if (toShow.length === 1){
			$(`#help-content > div:not([value=${val}])`).hide()
			toShow.show()
		}
	}

	function helpTopicLink(event){
		let el = event.delegateTarget
		let help = $(el).attr("data-help-value")
		if (help){
			changeHelpTopic(help)
		}
	}

	function explainClue(event){
		let btnEl = event.delegateTarget
		let clueType = $(btnEl).parent().attr("value")
		let topic = clueClassesToHelpName[clueType]
		if (!topic){
			let vals = clueType.match(/clue-(.+)-(.+)/)
			let color = vals[1]
			let height = vals[2]
			topic = color[0].toUpperCase() + color.substring(1)
		}
		console.log(topic)
		changeHelpTopic(topic)
		changeView("help")
	}

	function checkKey(event){
		let key = event.key
		if (key === "Enter"){
			if (!currentLevel) return
			let index = LEVELS.indexOf(currentLevel)
			let nextIndex = (index + 1) % LEVELS.length
			pickLevel(LEVELS[nextIndex])
		}
		else if (currentLevel){
			let stacks = $("#puzzle .puzzle-stack")
			stacks = [...stacks].filter(stack => {
				return $(stack).attr("hidden") !== "hidden"
			})
			let lastStack = stacks[stacks.length - 1]
			let inputBox = $(lastStack).children(".answer-input")
			let isLetter = key.length === 1 && /[a-z0-9]/.test(key)
			if (document.activeElement !== inputBox[0] && isLetter){
				setTimeout(function(){
					inputBox.focus().val(key)
				}, 20)
			}
		}
	}
	function enterLetter(event){
		let el = event.delegateTarget
		let guess = el.value.toLowerCase().replaceAll(/\W/g, "")
		let index = parseInt($(el).parent().attr("value"))
		let answer = getAnswer(currentLevel, index)
		answer = answer.toLowerCase().replaceAll(/\W/g, "")
		
		if (guess !== answer && guess.length === answer.length){
			$(el).addClass("invalid")
		}
		else {
			$(el).removeClass("invalid")
		}

		if (guess === answer) {
			beatSubPuzzle(currentLevel, index)
		}
	}

	function addNewSection(name){
		let sectionCount = Object.keys(SECTIONS).length

		let html = `<div class="level-section" value="${sectionCount}">
			<h2 class="level-section-header">${name}</h2>
			<div class="level-section-list"></div>
		</div>`
		let el = $(html)
		el.appendTo("#level-select")
		
		let section = {
			name: name,
			index: sectionCount,
			elem: el,
			levels: []
		}
		SECTIONS[name] = section
	}
	function getSection(sectionIndex){
		let key = Object.keys(SECTIONS).find(key => SECTIONS[key].index === sectionIndex)
		if (!key) return undefined
		return SECTIONS[key]
	}
	function getAnswer(level, index){
		return (level.answers && level.answers[index]) || level.answer
	}

	function levelButtonHtml(level){
		let index = LEVELS.indexOf(level)
		return `<button class="btn level-btn btn-primary btn-lg" value="${index}">
			<span class="level-name-icon">${level.name}</span>
			<i class="level-progress-icon bi bi-star-fill" hidden></i>
		</button>`
	}

	function clueHelpButtonHtml(clue){
		let clueHelpText = clueHelps[clue]

		return `<div class="clue-help-btn" data-toggle="tooltip" title="${clueHelpText}">
			<i class="bi bi-question-circle"></i>
		</div>`
	}

	function clueHtml(clue, height){
		let className = clueClasses[clue.color]
		let clueValue = className + "-" + height
		let clueHelpBtn = clueHelpButtonHtml(clueValue)
		let hintExtra = clue.isHint ? "hidden" : ""
		let hintClass = clue.isHint ? "clue-hint" : ""
		let html = $(`<div class="clue ${className} ${hintClass}" value="${clueValue}" ${hintExtra}>
			${clueHelpBtn}
			<div class="clue-text"><span>${clue.text}</span></div>
		</div>`)
		if (html.hasClass("clue-none")){
			html.html("")
		}
		clue.elem = html
		return html
	}

	function displayPuzzle(level){
		$("#puzzle").html("")
		$("#puzzle").append(`<div class="puzzle-title">${level.name}</div>`)

		let subPuzzles = []
		subPuzzles.push([])
		for (let clue of level.clues){
			if (clue.puzzle !== undefined){
				if (!subPuzzles[clue.puzzle]) {
					subPuzzles[clue.puzzle] = []
				}
				subPuzzles[clue.puzzle].push(clue)
			}
			else {
				subPuzzles[0].push(clue)
			}
		}
		for (let hint of level.hints){
			hint.isHint = true
			if (hint.puzzle !== undefined){
				if (!subPuzzles[hint.puzzle]) {
					subPuzzles[hint.puzzle] = []
				}
				subPuzzles[hint.puzzle].push(hint)
			}
			else {
				subPuzzles[0].push(hint)
			}
		}

		let clueStacks = []
		for (let puzzle of subPuzzles){
			let stack = {
				high: [],
				middle: [],
				low: []
			}
			for (let clue of puzzle){
				stack[clue.height].push(clue)
			}
			clueStacks.push(stack)

			if (stack.high.length === 0){
				stack.high.push({
					height: "high",
					color: "none",
					text: ""
				})
			}
			if (stack.middle.length === 0){
				stack.middle.push({
					height: "middle",
					color: "none",
					text: ""
				})
			}
			if (stack.low.length === 0){
				stack.low.push({
					height: "low",
					color: "none",
					text: ""
				})
			}
		}

		for (let stack of clueStacks){
			let index = clueStacks.indexOf(stack)

			let highHtml = $(`<div class="clues high-clues"></div>`)
			for (let clue of stack.high){
				highHtml.append(clueHtml(clue, "high"))
			}

			let middleHtml = $(`<div class="clues middle-clues"></div>`)
			for (let clue of stack.middle){
				middleHtml.append(clueHtml(clue, "middle"))
			}

			let lowHtml = $(`<div class="clues low-clues"></div>`)
			for (let clue of stack.low){
				lowHtml.append(clueHtml(clue, "low"))
			}

			let answer = getAnswer(level, index)
			let givenLetters = level.givenLetters ?? 0
			let placeholder = answer.replaceAll(/\w/g, "_")
			placeholder = answer.substring(0, givenLetters) + placeholder.substring(givenLetters)

			let buttons = $(`<div class="puzzle-buttons"></div>`)
			if (level.hints.length){
				let used = level.hintsUsed || 0
				let totalHints = level.hints.filter(hint => {
					let puzzleIndex = hint.puzzle ?? 0
					return index === puzzleIndex
				}).length
				let text = `<span class="hints-used">${used}</span> / ${totalHints}`
				hintButton = `<button class="btn btn-info hint-btn">Get Hint (${text})</button>`
				buttons.append(hintButton)
			}
			let giveUpButton = $(`<button class="btn btn-danger give-up-btn" hidden>Give Up</button>`)
			if (!level.hints.length){
				giveUpButton.attr("hidden", false)
			}
			buttons.append(giveUpButton)

			let stackHtml = $(`<div class="puzzle-stack" value="${index}"></div>`)

			if (index !== 0){
				stackHtml.attr("hidden", true)
			}

			stackHtml.appendTo("#puzzle")
			stackHtml.append(highHtml)
			stackHtml.append(middleHtml)
			stackHtml.append(lowHtml)

			if (clueStacks.length > 1){
				let text = `${index + 1} / ${clueStacks.length}`
				stackHtml.append(`<div class="puzzle-number">Puzzle ${text}</div>`)
			}

			stackHtml.append(`<input class="answer-input" placeholder="${placeholder}" maxlength="${answer.length}">`)
			stackHtml.append(buttons)

			if (clueStacks.indexOf(stack) !== clueStacks.length - 1){
				stackHtml.append(`<div class="puzzle-continuation-icon" hidden><i class="bi bi-arrow-down"></i></div>`)
			}
		}
		
		let firstInput = $(".puzzle-stack[value='0'] > .answer-input")
		setTimeout(function(){
			firstInput.focus()
		}, 20)

		let index = LEVELS.indexOf(level)
		if (index === 0){
			$("#prev-btn").hide()
		}
		else {
			$("#prev-btn").show()
		}

		if (index === LEVELS.length - 1){
			$("#next-btn").hide()
		}
		else {
			$("#next-btn").show()
		}
		
		$(".answer-input").keyup(enterLetter)
		$(".clue-help-btn").click(explainClue)
		$(".clue-help-btn").tooltip({placement: "right"})
		$(".hint-btn").click(getHint)
		$(".give-up-btn").click(giveUp)
	}

	function handleLevelButtonClick(event){
		let el = event.delegateTarget
		let index = parseInt($(el).attr("value"))
		pickLevel(LEVELS[index])
	}
	function resetLevel(level){
		if (level.hints){
			for (let hint of level.hints){
				hint.shown = false
			}
		}
		level.hintsUsed = 0
	}
	function pickLevel(level){
		if (currentLevel){
			resetLevel(currentLevel)
		}
		currentLevel = level
		displayPuzzle(level)
		changeView("puzzle-screen")
	}
	function nextLevel(){
		let index = LEVELS.indexOf(currentLevel)
		let newIndex = (index + 1) % LEVELS.length
		pickLevel(LEVELS[newIndex])
	}
	function prevLevel(){
		let index = LEVELS.indexOf(currentLevel)
		let newIndex = (index - 1 + LEVELS.length) % LEVELS.length
		pickLevel(LEVELS[newIndex])
	}

	function getHint(event){
		let btnEl = event.delegateTarget
		let el = $(btnEl).parents(".puzzle-stack")
		let index = parseInt(el.attr("value"))
		let validHints = currentLevel.hints.filter(hint => {
			let puzzleIndex = hint.puzzle ?? 0
			return index === puzzleIndex && !hint.shown
		})
		if (validHints.length){
			let randomHint = validHints[Math.floor(Math.random() * validHints.length)]
			randomHint.elem.attr("hidden", false)
			randomHint.shown = true
			currentLevel.hintsUsed += 1

			let shownHints = currentLevel.hints.filter(hint => {
				let puzzleIndex = hint.puzzle ?? 0
				return index === puzzleIndex && hint.shown
			})
			$(btnEl).children(".hints-used").text(shownHints.length)
		}
		
		let unshownHints = currentLevel.hints.filter(hint => {
			let puzzleIndex = hint.puzzle ?? 0
			return index === puzzleIndex && !hint.shown
		})
		if (!unshownHints.length){
			$(btnEl).attr("hidden", true)
			$(btnEl).parent().children(".give-up-btn").attr("hidden", false)
		}
	}

	function giveUp(event){
		let btnEl = event.delegateTarget
		let el = $(btnEl).parents(".puzzle-stack")
		let index = parseInt(el.attr("value"))
		beatSubPuzzle(currentLevel, index, true)
	}

	function markLevelComplete(level){
		level.complete = true
		level.buttonElem.children(".level-progress-icon").attr("hidden", false)
	}

	function beatSubPuzzle(level, index, skipped){
		let stack = $(`#puzzle > .puzzle-stack[value="${index}"]`)
		let correctAnswer = getAnswer(level, index)
		let inputBox = stack.children(".answer-input")
		inputBox.attr("disabled", true)
		if (!skipped){
			inputBox.addClass("complete")
		}
		else {
			inputBox.addClass("incomplete").val(correctAnswer)
		}

		let answerCount = level.answers ? level.answers.length : 1
		let completeCount = $(".answer-input.complete").length
		if (answerCount === completeCount){
			//Player only gets credit and confetti if they don't skip it.
			//They can skip the earlier steps though I don't care
			if (!skipped){
				markLevelComplete(level)
				fireConfetti()
			}

			if (level.notes){
				$(`<div class="puzzle-notes">${level.notes}</div>`).insertAfter(".puzzle-title")
			}
		}
		else {
			let nextIndex = index + 1
			let nextStack = $(`#puzzle > .puzzle-stack[value="${nextIndex}"]`)
			nextStack.attr("hidden", false)
			stack.children(".puzzle-continuation-icon").attr("hidden", false)

			setTimeout(function(){
				$(window).scrollTop(stack.height() * nextIndex)
			}, 20)
		}
		save()
	}

	function loadGame(data){
		LEVELS = data.levels
		let encodedSave = localStorage.getItem("lingo-save") || ""
		for (let level of LEVELS){
			level.internalName = getLevelInternalName(level)
		}
		decodeSave(encodedSave)
		for (let level of LEVELS){
			let sName = level.section
			if (!SECTIONS[sName]){
				addNewSection(sName)
			}
			let section = SECTIONS[sName]
			section.levels.push(level)
			let html = levelButtonHtml(level)
			let el = $(html)
			el.appendTo(section.elem.children(".level-section-list"))
			level.buttonElem = el

			if (level.complete){
				el.children(".level-progress-icon").attr("hidden", false)
			}
			if (!level.hintsUsed){
				level.hintsUsed = 0
			}
			if (!level.hints){
				level.hints = []
			}
		}

		$("#level-select .level-btn").click(handleLevelButtonClick)
		$("#intro-start-btn").attr("disabled", false).text("Start")
	}

	function toggleColorblindMode(event){
		let el = event.delegateTarget
		let body = $("body")
		if (body.hasClass("theme-colorblind")){
			body.removeClass("theme-colorblind")
			$(el).text("Enable Colorblind Mode")
		}
		else {
			body.addClass("theme-colorblind")
			$(el).text("Disable Colorblind Mode")
		}
	}

	$("#help-topic-list > .topic").each((i, el) => {
		$(el).attr("value", i)
	})
	$("#help-content > div").each((i, el) => {
		$(el).attr("value", i)
	})

	$("#help").hide()
	$("#level-select").hide()
	$("#puzzle-screen").hide()
	$("#reset-save").click(resetSave)
	$(".main-menu-btn").click(() => changeView("intro"))
	$(".level-select-btn").click(() => changeView("level-select"))
	$("#intro-help-btn").click(() => changeView("help"))
	$("#help-topic-list > .topic").click(changeHelpTopic)
	$("#help-content a").click(helpTopicLink)
	$("#toggle-colorblind").click(toggleColorblindMode)
	$("#volume").change(changeVolume)

	$("#next-btn").click(nextLevel)
	$("#prev-btn").click(prevLevel)
	$(document).keydown(checkKey)

	changeHelpTopic(0)

	$.getJSON({
		url: "levels.json",
		dataType: "json",
		success: loadGame
	})

	// $("#background").animate({
	// 	opacity: 0.04
	// }, 1000000)
})()