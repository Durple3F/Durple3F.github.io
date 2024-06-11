function startScene(name, options){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	gameTag.html("")

	switch (name){
		case "choose-starter": {
			changeMusic("Route 201 (Day)")

			gameTag.addClass("choosing-starter")
			promise = promise//.then(() => stopSound("Route 201 (Day)"))

			gameTag.append(`<i class='bi bi-caret-left-fill left' style='opacity:0'></i>`)
			gameTag.append(`<i class='bi bi-caret-right-fill right' style='opacity:0'></i>`)

			let newChooseTag = () => {
				let chooseTag = $("<div class='choose-starter'></div>")
				let bg = $(`<img class='bg' src='src/img/bg/choose-starter.png'>`)
				chooseTag.append(`<button class='btn btn-primary confirm'>Confirm Starter</button>`)
				chooseTag.append(bg)
				chooseTag.click(() => {
					chooseTag.children(".ball:not(.active)").popover("hide")
				})
				return chooseTag
			}

			let chooseTag = newChooseTag()
			gameTag.append(chooseTag)
			
			let starterPokemon = Object.keys(pokemonData).filter(k => {
				return pokemonData[k].tags.includes("Starter")
			})
			let groups = []

			let currentIndex = 0
			const confirmChoice = pokemon => {
				chooseTag.children(".ball").popover("hide")
				delay(250).then(() => $(".popover").remove())
				let caught = new Pokemon(pokemon.name, pokemon.name, {level: 5})
				catchPokemon(caught)

				//Remove this once it works
				.then(() => {
					let caught = new Pokemon(pokemon.name, "Comfey", {level: 5})
					return catchPokemon(caught)
				})

				.then(resolvePromise)
			}
			const choosePokemon = (event, pokemon) => {
				let oldActive = $(".choose-starter > .ball.active")
				let target = $(event.currentTarget)
				target.toggleClass("active")
				oldActive.removeClass("active")
				let button = chooseTag.children(".confirm")
				button.off("click")
				let chosen = target.hasClass("active")
				if (chosen){
					button.fadeIn().click(() => confirmChoice(pokemon))
				} else {
					button.fadeOut()
				}
			}
			const getPopover = pokemon => {
				let html = `<div class='text-center'>${pokemon.name}
				<div>
				<img class='pokemon-image' src='${pokemon.imageSources[pokemon.name]}'>
				</div></div>`
				return html
			}
			const fillWithPokemon = () => {
				let group = groups[currentIndex]
				let tags = []
				if (!group) return
				for (let i = 0; i < group.length; i++){
					let pokemon = group[i]
					let tag = $(`<div class='ball ball-${i+1}'>
					<img src='src/img/balls/pokeball.png'>
					</div>`)
					chooseTag.append(tag)
					tags.push([tag, pokemon])

					//Now add a tiny, nearly-invisible image of that pokemon
					//(just to get the image preloaded)
					chooseTag.append(`<img class='invisible-image' src='${pokemon.imageSources[pokemon.name]}'>`)
				}

				for (let pair of tags){
					let tag = pair[0]
					let pokemon = pair[1]
					tag.click(event => choosePokemon(event, pokemon))
					tag.popover({
						placement: "top",
						trigger: "hover click",
						html: true,
						content: () => getPopover(pokemon)
					})
				}

				if (currentIndex === 0){
					$("#game > .left").removeClass("active").animate({opacity: 0})
				} else {
					$("#game > .left").addClass("active").animate({opacity: 1})
				}

				if (currentIndex === groups.length - 1){
					$("#game > .right").removeClass("active").animate({opacity: 0})
				} else {
					$("#game > .right").addClass("active").animate({opacity: 1})
				}
			}
			const changeGroup = (indexMod, firstLeft, secondLeft) => {
				currentIndex += indexMod
				chooseTag.children(".ball").popover("hide")
				chooseTag.animate({
					left: firstLeft
				}, 400).queue(function(){
					$(this).remove()
				})
				chooseTag = newChooseTag()
				chooseTag.css({
					left: secondLeft
				})
				gameTag.append(chooseTag)
				chooseTag.animate({
					left: "0"
				}, 400)
				fillWithPokemon()
			}
			const nextGroup = () => changeGroup(1, "-100%", "100%")
			const prevGroup = () => changeGroup(-1, "100%", "-100%")
			$("#game > .left").click(prevGroup)
			$("#game > .right").click(nextGroup)

			for (let i = 0; i < starterPokemon.length; i++){
				let arr = i % 3 === 0 ? [] : groups[groups.length - 1]
				if (i % 3 === 0) groups.push(arr)
				arr.push(pokemonData[starterPokemon[i]])
			}
			fillWithPokemon()
		} break
		case "route": {
			console.log(name, options)
			let routeName = options.name

			if (routeName === "Route 1"){
				changeMusic("Route 201 (Day)")
			}

			let listTag = $(`<div class='route-list'></div>`)
			let routeTag = $(`<div class='route-screen'></div>`)

			const getLevels = name => {
				routeTag.html("")
				let routeLevels = levelData.filter(level => {
					return level.category === name
				})
				let levelButtons = []
				routeLevels.forEach(level => {
					let btn = getLevelButtonHtml(level)
					btn.popover({
						placement: "top",
						trigger: "hover click",
						html: true,
						content: () => getPopover(level)
					})
					levelButtons.push(btn)
					routeTag.append(btn)
				})
				levelButtons.forEach(btn => {
					$(btn).click(chooseLevel)
				})
			}
			const getPopover = level => {
				let content = $(`<div class='d-flex flex-column align-items-center justify-content-center'></div>`)
				content.append(`<div class='name'>${level.name}</div>`)
				let btn = $(`<button class='btn btn-primary'>Play Level </button>`)
				btn.append("<i class='bi bi-play-circle-fill'></i>")
				btn.click(() => confirmChoice(level))
				content.append(btn)
				return content
			}
			const confirmChoice = level => {
				$(".level-button").popover("hide")
				resolvePromise(level.id)
			}
			const chooseLevel = event => {
				let target = $(event.currentTarget)
				let id = target.attr("data-level")
				let level = levelData.find(l => l.id === id)
				let oldActive = $(".level-button.clicked")
				target.toggleClass("clicked")
				oldActive.removeClass("clicked")
				let chosen = target.hasClass("clicked")
				if (chosen){
					
				}
			}
			getLevels(routeName)

			gameTag.append(listTag)
			gameTag.append(routeTag)

			promise = promise.then(levelID => beginLevel(levelID))
		} break
		default: {
			console.warn("What scene??", name)
			console.trace()
		}
	}
	return promise
}

function changeScene(name, options){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	$(".popover").fadeOut().queue(function(){$(this).remove()})
	let toHide = gameTag.css("display") === "none" ? $("#board") : gameTag

	toHide.fadeOut(() => {
		gameTag.html("")
		gameTag.removeClass("choosing-starter")
		resolvePromise()
		gameTag.fadeIn()
	})
	if (name){
		promise = promise.then(() => startScene(name, options))
	}
	return promise
}

function catchPokemon(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	pokemon.owner = playerSaveId
	caughtPokemon.push(pokemon)
	if (playerActivePokemon.length < 6){
		playerActivePokemon.push(pokemon)
	}

	//Later, asking to rename pokemon whenever you catch one should be optional.
	//TODO
	askToRenamePokemon(pokemon)
	.then(() => savePokemon(pokemon))
	.then(() => resolvePromise())

	return promise
}

function askToRenamePokemon(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")
	let pokemonName = pokemon.pokemonName
	let image = pokemon.data.imageSources[pokemonName]

	clearModal(modal)

	modal.find(".modal-title").text(`What would you like to name your ${pokemonName}?`)
	let innerStuff = $(`<div class='container d-flex'></div>`)
	innerStuff.append(`<div class='col col-3'><img class='pokemon-image' src='${image}'></div>`)
	innerStuff.append(`<div class='col col-9 d-flex flex-column justify-content-center align-items-center'>
		<input type='text' required value='${pokemonName}'>
		<button class='btn btn-primary confirm'>Submit</button>
	</div>`)
	let body = modal.find(".modal-body")
	body.append(innerStuff)

	body.find(".btn.confirm").click(() => {
		pokemon.name = body.find("input").val()
		modal.modal("hide")
	})

	modal.on("hidden.bs.modal", () => {
		resolvePromise()
	})

	modal.modal("show")
	return promise
}

let currentLevelProgress
function beginLevel(levelID){
	let level = levelData.find(l => l.id === levelID)
	if (level.music){
		changeMusic(level.music)
	}
	$("#game").fadeOut()
	$("#board").fadeIn()

	currentLevelProgress = {
		id: levelID,
		level: level,
		effects: level.effects,
		effectIndex: 0
	}

	let promise = advanceCurrentLevel()
	.then((val) => {
		console.log(val)
		if (val === "lose"){
			console.log("You lose :(")
		} else {
			level.status = "won"
			saveLevelStatus(level, "won")
		}
		return changeScene("route", {name: "Route 1"})
	})
	
	return promise
}
function advanceCurrentLevel(){
	let promise
	let level = currentLevelProgress.level
	let effects = currentLevelProgress.effects
	let effectIndex = currentLevelProgress.effectIndex
	let effect = effects[effectIndex]
	let trainerData = level.trainers[0]

	switch (effect.type){
		case "fight": {
			promise = beginRound(trainerData)
		} break
	}

	if (effects[effectIndex + 1]){
		promise = promise.then(val => {
			return advanceCurrentLevel()
		})
	} else {
		promise = promise.then(val => {
			console.log("Finished level :)")
		})
	}

	return promise
}