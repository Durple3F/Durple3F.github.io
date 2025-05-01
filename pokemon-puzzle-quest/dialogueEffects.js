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
		hasSpeaker: true,
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
		hasSpeaker: true,
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let tag = speaker.tag
			let duration = effect.duration
			let waitDuration = effect.waitDuration ?? duration
			let stepHeight = options.dialogueTag.height() * 0.035

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
	"wait": {
		execute: (resolve, effect, progress, options) => {
			let wait = effect.waitDuration
			delay(wait).then(() => resolve())
		}
	},
	"come-in-from-offscreen": {
		hasSpeaker: true,
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
				let stepHeight = options.dialogueTag.height() * 0.07
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
		hasSpeaker: true,
		execute: (resolve, effect, progress, options) => {
			let speaker = options.speaker
			let tag = speaker.tag
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
			animateNext()
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
			let choices = effect.choices
			let modal = $("#modal")
			clearModal(modal)
			modal.modal("show")
			let result
			let body = modal.find(".modal-body")
			let container = $(`<div class='container d-flex justify-content-around'>`)
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
}