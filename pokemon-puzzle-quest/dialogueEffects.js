const dialogueEffects = {
	"load-player-name": {
		execute: (resolve, effect, progress, options) => {
			let effectIndex = progress.effectIndex
			dialogueProgress.info[effectIndex] = playerName
			resolve()
		}
	},
	"remove-speaker": {
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let index = progress.speakers.indexOf(speaker)
			if (index !== -1){
				progress.speakers.splice(index, 1)
			}
			speaker.tag.remove()
			resolve()
		}
	},
	"reset-position": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let tag = speaker.tag
			let position = effect.position ?? "right"

			let positions = dialogueStyleData.positions
			tag.css(positions[position])
			
			resolve()
		}
	},
	"bounce": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let tag = speaker.tag
			let duration = effect.duration
			let waitDuration = effect.waitDuration ?? duration
			let stepHeight = options.dialogueTag.height() * 0.035

			let transition = tag.css("transition")
			if (transition.includes("transform")){
				tag.css("transition", "")
			}
			
			$({ val: 0 }).animate({ val: 1 }, {
				duration: duration,
				easing: "linear",
				step: function(){
					let p = this.val
					let stepP = (Math.max(p, 1-p) - 0.5)*2
					let y = (-stepHeight) + (stepP ** 2) * stepHeight
					tag.css("transform", "translateY("+y+"px)")
				},
				complete: function(){
					
				}
			})
			
			delay(waitDuration).then(() => resolve())
		}
	},
	"fade-in": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let duration = effect.duration ?? 400
			let waitDuration = effect.waitDuration ?? duration

			tag.fadeIn(duration)
			
			delay(waitDuration).then(() => resolve())
		}
	},
	"fade-out": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let duration = effect.duration ?? 400
			let waitDuration = effect.waitDuration ?? duration

			tag.fadeOut(duration)
			
			delay(waitDuration).then(() => resolve())
		}
	},
	"wait": {
		execute: (resolve, effect, progress, options) => {
			let wait = effect.waitDuration
			delay(wait).then(() => resolve())
		}
	},
	"come-in-from-offscreen": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let tag = speaker.tag
			let direction = effect.direction
			let duration = effect.duration ?? 500
			let easing = effect.easing ?? "swing"
			let wait = effect.waitDuration ?? duration

			let finalPosition = tag.position()
			let initialPosition = {}
			for (let key in finalPosition){
				initialPosition[key] = finalPosition[key]
			}

			if (direction === "up"){
				initialPosition["top"] = $(window).height()
			} else if (direction === "left"){
				initialPosition["left"] = $(window).width() * 1.1
			} else if (direction === "right"){
				let xOffset = ($(window).width() - options.dialogueContainer.width()) * 0.5
				initialPosition["left"] = - tag.width() - xOffset
			}

			if (effect.additionalLeft){
				initialPosition["left"] += options.dialogueTag.width() * effect.additionalLeft
			}

			if (effect.walkAnimation){
				let stepTime = 800
				let stepHeight = options.dialogueTag.height() * 0.035
				let totalSteps = Math.ceil(duration / stepTime)
				stepTime = duration / totalSteps
				let totalWalkTime = stepTime * totalSteps
				$({ val: 0 }).animate({ val: totalSteps }, {
					duration: totalWalkTime,
					easing: easing,
					step: function(){
						let p = this.val % 1
						let stepP = (Math.max(p, 1-p) - 0.5)*2
						let y = (-stepHeight) + (stepP ** 2) * stepHeight
						tag.css("transform", "translateY("+y+"px)")
					},
					complete: function(){
						
					}
				})
			}

			tag.css(initialPosition)
			tag.animate(finalPosition, duration, easing)
			delay(wait).then(() => resolve())
		}
	},
	"go-out-from-onscreen": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag
			if (effect.targetType === "image"){
				tag = options.target
				console.log(options)
			} else {
				let speaker = options.speaker
				tag = speaker.tag
			}
			let direction = effect.direction
			let duration = effect.duration ?? 500
			let wait = effect.waitDuration ?? duration
			let easing = effect.easing ?? "swing"

			let initialPosition = tag.position()
			let finalPosition = {}
			for (let key in initialPosition){
				finalPosition[key] = initialPosition[key]
			}

			if (direction === "right"){
				finalPosition["left"] = $(window).width() * 1.1
			} else if (direction === "left"){
				let xOffset = ($(window).width() - options.dialogueContainer.width()) * 0.5
				finalPosition["left"] = - tag.width() - xOffset
			}

			if (effect.additionalLeft){
				finalPosition["left"] += options.dialogueTag.width() * effect.additionalLeft
			}

			if (effect.walkAnimation){
				let stepTime = 800
				let stepHeight = options.dialogueTag.height() * 0.035
				let totalSteps = Math.ceil(duration / stepTime)
				stepTime = duration / totalSteps
				let totalWalkTime = stepTime * totalSteps
				$({ val: 0 }).animate({ val: totalSteps }, {
					duration: totalWalkTime,
					easing: easing,
					step: function(){
						let p = this.val % 1
						let stepP = (Math.max(p, 1-p) - 0.5)*2
						let y = (-stepHeight) + (stepP ** 2) * stepHeight
						tag.css("transform", "translateY("+y+"px)")
					},
					complete: function(){
						
					}
				})
			}

			tag.animate(finalPosition, duration, easing)
			delay(wait).then(() => resolve())
		}
	},
	"go-out-from-onscreen-image": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let direction = effect.direction
			let duration = effect.duration ?? 500
			let wait = effect.waitDuration ?? duration

			let initialPosition = tag.position()
			let finalPosition = {}
			for (let key in initialPosition){
				finalPosition[key] = initialPosition[key]
			}

			if (direction === "right"){
				finalPosition["left"] = $(window).width() * 1.1
			} else if (direction === "left"){
				let xOffset = ($(window).width() - options.dialogueContainer.width()) * 0.5
				finalPosition["left"] = - tag.width() - xOffset
			}

			if (effect.additionalLeft){
				finalPosition["left"] += options.dialogueTag.width() * effect.additionalLeft
			}

			tag.animate(finalPosition, duration)
			delay(wait).then(() => resolve())
		}
	},
	"looping-animation": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let states = effect.states
			let name = effect.name
			let delayTime = effect.delay ?? 0
			let index = 0
			const animateNext = () => {
				let state = states[index]
				let duration = state.duration
				let css = state.css
				let instant = state.instant ?? false
				if (instant){
					tag.css(css)
				} else {
					tag.animate(css, duration)
				}
				progress.intervals[name] = setTimeout(animateNext, duration)
				index = (index + 1) % states.length
			}
			if (delayTime){
				delay(delayTime).then(() => animateNext())
			} else {
				animateNext()
			}
			
			resolve()
		}
	},
	"stop-animation": {
		execute: (resolve, effect, progress, options) => {
			let animationName = effect.animationName
			clearInterval(dialogueProgress.intervals[animationName])

			resolve()
		}
	},
	"looping-animation-v2": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target

			let speakersTag = options.speakersTag
			let speakersTagW = speakersTag.width()
			let speakersTagH = speakersTag.height()
			let position = tag.position()

			let keyframes = effect.keyframes ?? []
			if (effect.keyframe){
				keyframes.push(effect.keyframe)
			}
			keyframes = window.structuredClone(keyframes)

			const rectifyProperty = (obj, property) => {
				let value = obj[property]
				let direction = value.substring(0, 2)
				if (direction !== "+=" && direction !== "-="){
					return
				}
				direction = direction === "+=" ? 1 : -1

				let parentUnit
				let childUnit
				if (property === "top"){
					parentUnit = speakersTagH
					childUnit = position.top
				} else if (property === "left"){
					parentUnit = speakersTagW
					childUnit = position.left
				}

				let remainder = value.substring(2)
				if (remainder[remainder.length - 1] === "%"){
					let amount = remainder.substring(0, remainder.length - 1)
					amount = Number(amount) || 0
					let pixels = amount * 0.01 * parentUnit * direction
					pixels += childUnit
					obj[property] = pixels.toString() + "px"
				} else {
					console.warn("You never handled non-percent units")
				}
			}

			for (let keyframe of keyframes){
				for (let key in keyframe){
					if (key !== "from" && key !== "to" && !key.includes("%")) continue
					let state = keyframe[key]
					for (let property in state){
						rectifyProperty(state, property)
					}
				}
			}

			$.keyframe.define(keyframes)
			
			resolve()
		}
	},
	"play-keyframe-animation": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let animationName = effect.animationName
			let duration = effect.duration ?? 1000
			let iterationCount = effect.iterationCount ?? "infinite"
			let direction = effect.direction ?? "normal"
			let easing = effect.easing ?? "ease"
			
			$(tag).playKeyframe({
				name: animationName,
				duration: duration + "ms",
				iterationCount: iterationCount,
				direction: direction,
				timingFunction: easing
			})

			resolve()
		}
	},
	"stop-keyframe-animation": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			console.log(tag)
			$(tag).pauseKeyframe();

			resolve()
		}
	},
	"move-back-and-forth": {
		hasTarget: true,
		execute: (resolve, effect, progress, options) => {
			let tag = options.target
			let states = effect.states
			let name = effect.name
			let state = 0
			let moveScale = 1.4
			let duration = 1000
			let initialLeft = tag.position().left
			const animateNext = () => {
				if (state === 0){
					$({val: 0}).animate({val: 1}, {
						duration: duration,
						step: function(){
							let p = this.val
							let x = initialLeft + p * moveScale * tag.width()
							let transform = "scaleX(-1)"
							tag.css("transform", transform)
							tag.css("left", x)
							tag.css("z-index", 10)
						},
						complete: function(){
							state = 1
							animateNext()
						}
					})
				} else if (state === 1){
					$({val: 0}).animate({val: 1}, {
						duration: duration,
						step: function(){
							let p = 1 - this.val
							let x = initialLeft + p * moveScale * tag.width()
							let transform = ""
							tag.css("transform", transform)
							tag.css("left", x)
							tag.css("z-index", 1)
						},
						complete: function(){
							state = 0
							animateNext()
						}
					})
				}
			}
			animateNext()
			resolve()
		}
	},
	"style-background": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			let tag = $("#background-canvas")
			let css = effect.css
			tag.css(css)
			resolve()
		}
	},
	"animate-background": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			let tag = $("#background-canvas")
			let css = effect.css
			let duration = effect.duration ?? 500
			let waitDuration = effect.waitDuration ?? duration
			tag.animate(css, duration)
			delay(waitDuration).then(() => resolve())
		}
	},
	"change-background-image": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			if (!currentLevelProgress?.level){
				return
			}
			let imgName = effect.name
			let level = currentLevelProgress.level
			let images = level.images
			let wait = effect.wait ?? true
			if (imgName in images){
				let url = images[imgName]
				let p = changeBackgroundImage(imgName, url, undefined, false)
				if (wait){
					p.then(() => resolve())
				} else {
					resolve()
				}
			}
		}
	},
	"animate-speaker-nameplate": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			let tag = $("#dialogue").find(".nameplate")
			let css = effect.css
			let duration = effect.duration ?? 0
			let wait = effect.waitDuration ?? duration
			if (duration || true) {
				console.log(css, duration)
				tag.animate(css, duration)
			}
	
			if (wait) {
				delay(wait).then(() => resolve())
			} else {
				resolve()
			}
		}
	},
	"transform-speaker-nameplate": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			let tag = $("#dialogue").find(".nameplate")
			let duration = effect.duration ?? 0
			let wait = effect.waitDuration ?? duration
			let transform = effect.transform
			let filter = effect.filter

			if (transform) {
				tag.css("transition", `${duration}ms transform`)
			}
			if (filter) {
				tag.css("filter", `${duration}ms filter`)
			}
			
			delay(10).then(() => {
				if (transform) {
					tag.css("transform", transform)
				}
				if (filter) {
					tag.css("filter", filter)
				}
			})
	
			if (wait) {
				delay(10 + wait).then(() => resolve())
			} else {
				resolve()
			}
		}
	},
	"clear-text": {
		execute: (resolve, effect, progress, options) => {
			options.textBox.children(".text").empty()
			resolve()
		}
	},
	"change-music": {
		execute: (resolve, effect, progress, options) => {
			let music = effect.music
			changeMusic(music)
			resolve()
		}
	},
	"stop-music": {
		execute: (resolve, effect, progress, options) => {
			stopMusic()
			resolve()
		}
	},
	"load-background-animation": {
		execute: (resolve, effect, progress, options) => {
			let animationName = effect.name
			let animation = background.loadAnimation(animationName)
			if (effect.priority){
				animation.drawEvery = BigInt(effect.priority)
			}
			resolve()
		}
	},
	"play-background-animation": {
		execute: (resolve, effect, progress, options) => {
			let animationName = effect.name
			background.playAnimation(animationName)
			resolve()
		}
	},
	"animate": {
		hasTarget: false,
		execute: (resolve, effect, progress, options) => {
			let selector = effect.selector
			let tag = $(selector)
			let css = effect.css
			let duration = effect.duration
			let waitDuration = effect.waitDuration ?? duration
			tag.animate(css, duration)
			delay(waitDuration).then(() => resolve())
		}
	},
	"choice": {
		execute: (resolve, effect, progress, options) => {
			let effectIndex = progress.effectIndex
			let info = progress.info
			let choices = effect.choices
			let modal = $("#modal")
			clearModal(modal)
			modal.modal("show")
			let result
			let body = modal.find(".modal-body")
			let container = $(`<div class='container d-flex justify-content-around flex-column dialogue-choice-container'>`)
			body.append(container)
			let buttons = $()

			const handleClick = event => {
				let tag = $(event.currentTarget)
				choose(tag)
			}
			const choose = tag => {
				buttons.removeClass("chosen").removeClass("btn-info")
				tag.addClass("chosen").addClass("btn-info")
				let choice = tag.data("choice")
				result = choice.value
			}

			choices.forEach(choice => {
				let button = $("<button class='btn btn-primary dialogue-choice'>")
				button.text(choice.text)
				button.data("choice", choice)
				container.append(button)
				buttons = buttons.add(button)
				if (choice.default){
					choose(button)
				}
				button.click(handleClick)
			})
			
			let btn = $(`<button class='btn btn-primary'>Confirm</button>`)
			modal.find(".modal-footer").append(btn)
			btn.click(() => {
				modal.modal("hide")
			})

			modal.on("hidden.bs.modal", () => {
				info[effectIndex] = result
				resolve(result)
			})
		}
	},
	"set-variable": {
		execute: (resolve, effect, progress, options) => {
			let variables = progress.variables
			let effectIndex = progress.effectIndex
			let info = progress.info
			let name = effect.name
			variables[name] = info[effectIndex - 1]
			resolve(info[effectIndex - 1])
		}
	},
	"load-variable": {
		execute: (resolve, effect, progress, options) => {
			let variables = progress.variables
			let name = effect.name
			resolve(variables[name])
		}
	},
	"load-value": {
		execute: (resolve, effect, progress, options) => {
			let value = effect.value
			resolve(value)
		}
	},
	"jump-if-equal": {
		execute: (resolve, effect, progress, options) => {
			let effectIndex = progress.effectIndex
			let test = progress.info[effectIndex - 2]
			let against = progress.info[effectIndex - 1]
			
			if (test === against) {
				progress.nextEffectIndex = options.index
			}
			resolve()
		}
	},
	"jump": {
		execute: (resolve, effect, progress, options) => {
			progress.nextEffectIndex = options.index
			resolve()
		}
	},
}