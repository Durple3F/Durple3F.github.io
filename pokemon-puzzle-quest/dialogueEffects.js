const dialogueEffects = {
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
        initialPosition["top"] += $(window).height()
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
  }
}