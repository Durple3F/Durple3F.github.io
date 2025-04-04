const textCharacterDurationMap = {
	"&nbsp;": 0.5,
	",": 3,
	"!": 7,
	"?": 10,
	"?!": 10,
	"...": 30,
	"^^": 0, //This one's for events
}
const textColors = {
	"red":"rgb(251, 49, 69)",
	"blue":"rgb(49, 89, 251)",
}

let dialogueProgress

function beginDialogue(dialogueData){
	$("#dialogue-container").fadeIn()
	dialogueProgress = {
		dialogue: dialogueData,
		info: [],
		effectIndex: -1,
		nextEffectIndex: 0,
		eventIndex: 0,
		speakers: []
	}

	let boardIsVisible = $("#board").css("display") !== "none"
	if (boardIsVisible){
		$("#board").addClass("showing-dialogue")
	}

	let speakersTag = $("#dialogue").children(".speakers")
	speakersTag.empty()
	let textBox = $("#dialogue").children(".text-box")
	let nameplate = $("#dialogue").children(".nameplate")

	let promises = []
	let promise = advanceCurrentDialogue()
	promises.push(promise)
	dialogueData.promise = promise

	let skipPromise = new Promise(res => {
		$("#dialogueSkipBtn").off("click")
		$("#dialogueSkipBtn").on("click", () => {
			res()
		})
	})
	promises.push(skipPromise)

	let totalPromise = Promise.any(promises)

	totalPromise
	.then(() => {
		$("#dialogue-container").fadeOut()
		if (boardIsVisible){
			delay(400).then(() => {
				$("#board").removeClass("showing-dialogue")
			})
		}
		return delay(400)
	})

	return totalPromise
}
function advanceCurrentDialogue(){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let dialogueData = dialogueProgress.dialogue
	let events = dialogueData.events || []
	let effects = dialogueData.effects
	dialogueProgress.effectIndex = dialogueProgress.nextEffectIndex
	let effectIndex = dialogueProgress.effectIndex
	let effect = effects[effectIndex]
	dialogueProgress.nextEffectIndex++
	let eventIndex = dialogueProgress.eventIndex

	if (effectIndex >= effects.length){
		resolvePromise()
		return promise
	}

	let dialogueContainer = $("#dialogue-container")
	let dialogueTag = $("#dialogue")
	let speakersTag = dialogueTag.children(".speakers")
	let textBox = dialogueTag.children(".text-box")
	let nameplate = textBox.children(".nameplate")

	switch (effect.type){
		case "get-speaker": {
			let speaker = {
				position: "right",
				facing: "left"
			}
			let name = effect.name
			speaker.name = name
			speaker.id = effect.id || speaker.name
			dialogueProgress.speakers.push(speaker)
			let trainerClassName = effect.class
			let trainerClass = NPCTrainerData[trainerClassName]
			speaker.class = trainerClass
			let url = trainerClass.imageSources["trainer"]
			let speakerTag = $("<div class='speaker'></div>")
			speaker.tag = speakerTag
			let img = $("<img>")
			img.attr("src", url)
			speakerTag.append(img)
			speakersTag.append(speakerTag)
			resolvePromise()
		} break
		case "update-style": {
			let name = effect.speaker
			let speaker = dialogueProgress.speakers.find(s => s.id === name)
			if (speaker){
				nameplate.children(".text").text(speaker.name)
			} else {
				console.warn("Who is", name, "???")
			}

			changeDialogueStyle(speaker)
			resolvePromise()
		} break
		case "text": {
			let name = effect.speaker
			let speaker = dialogueProgress.speakers.find(s => s.id === name)
			if (speaker){
				nameplate.children(".text").text(speaker.name)
			} else {
				console.warn("Who is", name, "???")
			}
			let autoAdvance = effect.auto ?? false

			let promises = []
			let textSpeed = config.textSpeed ?? 10
			let currentDuration = 100
			let characters = Object.keys(textCharacterDurationMap)
			.sort((a, b) => a.length - b.length)

			let textTag = textBox.children(".text")
			textTag.empty()
			let text = effect.text

			let replacements = []
			if (effect.values){
				for (let index of effect.values){
					let i
					if (index < 0){
						i = effectIndex + index
					} else {
						i = index
					}
					replacements.push(dialogueProgress.info[i])
				}
			}
			text = applyReplacements(text, replacements)

			let fancyRegex = /(?<!\\)\$@([^\|]+)\|([^\@]*)@\$/g
			let fancyRegexNoCapture = /(?<!\\)\$@[^\|]+\|[^\@]*@\$/g
			let fancyTextMatches = [...text.matchAll(fancyRegex)]
			let otherText = text.split(fancyRegexNoCapture)
			let realWords = []

			let skippedDialogue = false

			let colors = {}
			Object.keys(textColors).forEach(key => colors[key] = textColors[key])
			if (speaker.class?.textColorOverrides){
				let those = speaker.class.textColorOverrides
				Object.keys(those).forEach(key => colors[key] = those[key])
			}

			let skipResolve
			let skipPromise = new Promise(resolve => skipResolve = resolve)

			let currentAdditionalStyle = {}
			for (let i = 0; i < otherText.length; i++){
				let word = {
					text: otherText[i],
					style: {}
				}
				Object.keys(currentAdditionalStyle)
				.forEach(key => {
					word.style[key] = currentAdditionalStyle[key]
				})
				realWords.push(word)

				if (fancyTextMatches[i]){
					let match = fancyTextMatches[i]
					let word = {
						text: match[2],
						style: {}
					}
					let style = match[1]
					
					if (style in colors){
						let color = colors[style]
						word.style["color"] = color
						word.style["background-image"] = `linear-gradient(${color}, ${color})`
					} else if (style.substring(0, 4) === "wait") {
						let dur = Number(style.substring(5))
						word.addedDuration = textSpeed * dur
					} else if (style === "start-italics") {
						currentAdditionalStyle["font-style"] = "italic"
					} else if (style === "end-italics") {
						currentAdditionalStyle["font-style"] = ""
					} else {
						console.warn("Unknown style info", style)
					}
					Object.keys(currentAdditionalStyle)
					.forEach(key => {
						word.style[key] = currentAdditionalStyle[key]
					})
					realWords.push(word)
				}
			}

			realWords.forEach(textPiece => {
				let textPieceTag = $("<span>")
				textPiece.tag = textPieceTag
				textTag.append(textPieceTag)

				if (textPiece.addedDuration){
					currentDuration += textPiece.addedDuration
				}

				let words = [""]
				let text = textPiece.text
				for (let letter of text){
					if (letter === " "){
						words.push(letter)
						words.push("")
					} else {
						let lastIndex = words.length - 1
						words[lastIndex] += letter
					}
				}
				words.forEach(word => {
					let wordTag = $("<span>")
					wordTag.addClass("word")
					textPieceTag.append(wordTag)
					let durationMap = {}

					let letters = word.split("")
					letters = letters.map(letter => letter.replace(" ", "&nbsp;"))
					letters.forEach((v, i) => {
						let letter = v
						let dur = 1
						for (let character of characters){
							let len = character.length
							let substring = letters.slice(i, i + len).join("")
							if (substring === character){
								for (let j = i; j < i + len; j++){
									durationMap[j] = textCharacterDurationMap[character] / len
								}
							}
						}
						if (i in durationMap){
							dur = durationMap[i]
						}
						dur *= textSpeed
						let span = $("<span>")
						span.addClass("letter")
						span.css("opacity", "0.0000001")
						span.html(letter)

						let isOperation = v === "^" && (letters[i+1] === "^" || letters[i-1] === "^")
						//If this is a letter that triggers an event
						if (isOperation && letters[i+1] === "^"){
							let thisEvent = events[eventIndex]
							eventIndex++
							dialogueProgress.eventIndex = eventIndex
							let carriedOut = false
							delay(currentDuration)
							.then(() => {
								if (!skippedDialogue && !carriedOut){
									carriedOut = true
									carryOutDialogueEvent(thisEvent)
								}
							})
							skipPromise.then(() => {
								if (!carriedOut){
									carriedOut = true
									carryOutDialogueEvent(thisEvent)
								}
							})
						} else if (!isOperation) {
							wordTag.append(span)
						}

						let promise = delay(currentDuration)
						promises.push(promise)
						promise.then(() => {
							span.animate({"opacity": 1}, textSpeed * 2.5)
						})
						currentDuration += dur
					})
				})
			})

			changeDialogueStyle(speaker)

			realWords.forEach(textPiece => {
				let textPieceTag = textPiece.tag
				let style = textPiece.style
				textPieceTag.css(textPiece.style)
				if (style["font-style"] === "italic"){
					console.log(style)
					textPieceTag.css({
						"padding-right": "0.12em"
					})
				}
			})

			const skipDialogue = () => {
				skippedDialogue = true
				textTag.find(".letter").animate({"opacity": 1}, textSpeed * 2.5)

				//Reset each speaker's position
				dialogueProgress.speakers.forEach(speaker => {
					carryOutDialogueEvent({
						type: "transform-speaker",
						speaker: speaker.id,
						transform: ""
					})
				})

				skipResolve()
			}
			const continueDialogue = () => {
				dialogueTag.off("click")
				resolvePromise()
				textBox.css("cursor", "")
			}

			dialogueTag.on("click", skipDialogue)
			textBox.css("cursor", "")
			textBox.children(".text-continue").hide()

			Promise.any([skipPromise, Promise.all(promises)])
			.then(() => {
				if (autoAdvance){
					resolvePromise()
				} else {
					dialogueTag.off("click")
					dialogueTag.on("click", continueDialogue)
					textBox.css("cursor", "pointer")
					textBox.children(".text-continue").fadeIn(textSpeed * 2.5)
				}
			})
		} break
		case "display-image": {
			let src = effect.src
			let imageObj = {}
			imageObj.src = src
			let image = $("<img>")
			imageObj.tag = image
			image.attr("src", src)
			let position = effect.position
			if (position.type === "relative"){
				let name = position.relative
				let relativeTo = dialogueProgress.speakers.find(s => s.id === name)
				let relativeTag = relativeTo.tag
				let offset = relativeTag.position()
				let width = relativeTag.width()
				let height = relativeTag.height()
				let totalWidth = dialogueContainer.width()
				let totalHeight = dialogueContainer.height()
				image.css({
					"position": "absolute",
					"top": offset.top + (totalHeight * (position?.top ?? 0)),
					"left": offset.left + (totalWidth * (position?.left ?? 0)),
					"width": width,
					"height": height
				})
			}
			image.attr("data-name", effect.name)
			speakersTag.append(image)

			resolvePromise()
		} break
		case "animate-image": {
			let image = speakersTag.children(`[data-name=${effect.image}]`)
			let css = effect.css
			let duration = effect.duration ?? 500
			let waitDuration = effect.waitDuration ?? duration
			image.animate(css, duration)
			delay(waitDuration).then(() => resolvePromise())
		} break
		case "style-speaker": {
			let name = effect.speaker
			let speaker = dialogueProgress.speakers.find(s => s.id === name)
			let image = speaker.tag
			let css = effect.css
			image.css(css)
			resolvePromise()
		} break
		case "style-image": {
			let image = speakersTag.children(`[data-name=${effect.image}]`)
			let css = effect.css
			image.css(css)
			resolvePromise()
		} break
		case "load-player-info": {
			dialogueProgress.info[effectIndex] = playerSaveInfo[effect.key]
			resolvePromise()
		} break
		case "wait": {
			let wait = effect.waitDuration
			delay(wait).then(() => resolvePromise())
		} break
		default:
			carryOutDialogueEvent(effect)
			.then(() => resolvePromise())
	}

	promise = promise.then(() => {
		if (effects[dialogueProgress.nextEffectIndex]){
			return advanceCurrentDialogue()
			.then(() => Promise.resolve())
		}

		return Promise.resolve()
	})

	return promise
}

function changeDialogueStyle(speaker){
	let dialogueTag = $("#dialogue")
	let speakersTag = dialogueTag.children(".speakers")
	let textBox = dialogueTag.children(".text-box")
	let nameplate = textBox.children(".nameplate")

	let style = {}
	for (let key in defaultDialogueStyle){
		style[key] = defaultDialogueStyle[key]
	}

	let trainerClass = speaker.class
	if (trainerClass?.textStyle){
		for (let key in trainerClass.textStyle){
			style[key] = trainerClass.textStyle[key]
		}
	}

	textBox.css("background", style.textBoxBackground1)
	textBox.children(".text-background").css("background", style.textBoxBackground2)
	textBox.children(".text-background").css("mask", style.textBoxMask)
	textBox.children(".text").css("filter", style.textBoxFilter)
	textBox.children(".text").children("span").css("background-image", style.textBoxTextBackground)
	textBox.children(".text-continue").css("background-image", style.textBoxTextContinueBackground)
	let namePlateTag = textBox.children(".nameplate")
	namePlateTag.children(".text").css("background-image", style.namePlateTextBackground)
	namePlateTag.children(".text-background").css("background-color", style.namePlateBackgroundColor)
	namePlateTag.children(".text-background-2").css("background-image", style.namePlateBackground2)
	namePlateTag.children(".text-background-2").css("background-color", style.namePlateBackground2Color)
}

function carryOutDialogueEvent(effect){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let name = effect.speaker
	let speaker, tag
	if (name){
		speaker = dialogueProgress.speakers.find(s => s.id === name)
		tag = speaker.tag
	}

	let options = {}
	let dialogueContainer = $("#dialogue-container")
	let dialogueTag = $("#dialogue")
	let speakersTag = dialogueTag.children(".speakers")
	let textBox = dialogueTag.children(".text-box")
	let nameplate = textBox.children(".nameplate")
	options.dialogueContainer = dialogueContainer
	options.dialogueTag = dialogueTag
	options.speakersTag = speakersTag
	options.textBox = textBox
	options.nameplate = nameplate

	if (effect.speaker){
		options.name = effect.speaker
		options.speaker = dialogueProgress.speakers.find(s => s.id === options.name)
	}

	let effectData = dialogueEffects[effect.type]
	if (effectData){
		effectData.execute(resolvePromise, effect, dialogueProgress, options)
		return promise
	}

	switch (effect.type){
		case "transform-speaker": {
			let transform = effect.transform
			let duration = effect.duration ?? 0
			let wait = effect.waitDuration ?? 100
			tag.css("transition", `${duration}ms transform`)
			delay(10).then(() => tag.css("transform", transform))
			delay(10 + wait).then(() => resolvePromise())
		} break
		case "animate-speaker-nameplate": {
			let tag = $("#dialogue").find(".nameplate")
			let css = effect.css
			let duration = effect.duration ?? 0
			let wait = effect.waitDuration ?? duration
			if (duration){
				$(tag).animate(css, duration)
			} else {
				$(tag).css(css)
			}

			if (wait){
				delay(wait).then(() => resolvePromise())
			} else {
				resolvePromise()
			}
		} break
		case "animate-speaker": {
			let speaker = options.speaker
			let image = speaker.tag
			let css = effect.css
			let duration = effect.duration ?? 500
			let waitDuration = effect.waitDuration ?? duration
			image.animate(css, duration)
			delay(waitDuration).then(() => resolvePromise())
		} break
		case "fade-out-text": {
			let text = effect.text
			let shownText = [...textBox.find(".letter")]
			let textSpeed = config.textSpeed ?? 10
			let promises = []
			for (let i in shownText){
				let nextFew = shownText.slice(i, text.length)
				if (nextFew.length < text.length) break
				let thatText = nextFew.map(tag => tag.textContent).join("")
				//Remove those pesky non-breaking spaces
				let matches = text.split("").every((v, charI) => {
					if (v === " ") return true
					if (v === thatText[charI]) return true
					console.log(v, thatText[charI])
					return false
				})
				if (!matches) continue

				//We found the text, now we can fade those tags out.
				let currentDuration = 0
				for (let j = nextFew.length - 1; j >= 0; j--){
					let letterTag = nextFew[j]
					currentDuration += textSpeed
					let p = delay(currentDuration).then(() => {
						return new Promise(res => {
							$(letterTag).fadeOut({
								complete: () => res()
							})
						})
					})
					promises.push(p)
				}
				break
			}
			Promise.all(promises)
			.then(() => resolvePromise())
		} break
		default:
			console.warn("You never handled", effect.type)
	}
	
	return promise
}