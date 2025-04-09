const dialogueEffects = {
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
			let wait = effect.waitDuration ?? duration

			let finalPosition = tag.position()
			let initialPosition = {}
			for (let key in finalPosition){
				initialPosition[key] = finalPosition[key]
			}

			if (direction === "up"){
				initialPosition["top"] = $(window).height()
			} else if (direction === "left"){
				initialPosition["left"] = $(window).width()
			} else if (direction === "right"){
				initialPosition["left"] = -tag.width()
			}
			tag.css(initialPosition)
			tag.animate(finalPosition, duration)
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
			}
			console.log(finalPosition)
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
	"clear-text": {
		execute: (resolve, effect, progress, options) => {
			options.textBox.children(".text").empty()
			resolve()
		}
	}
}